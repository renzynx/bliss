import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { IAuthService } from '../lib/interfaces';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'node:crypto';
import * as argon from 'argon2';
import {
  bytesToSize,
  PaginationPayload,
  UserResponse,
} from '@bliss/shared-types';
import * as os from 'node:os';
import { COOKIE_NAME, SLUG_TYPE } from '../lib/constants';
import { File } from '@prisma/client';
import { Request, Response } from 'express';

@Injectable()
export class AuthService implements IAuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async me(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) throw new UnauthorizedException('Unauthorized.');

    delete user.password;
    return { user };
  }

  async files(
    id: number,
    page: number,
    limit = 15
  ): Promise<PaginationPayload<File>> {
    if (!id) throw new UnauthorizedException('Unauthorized.');

    const files = await this.prismaService.file
      .findMany({
        where: { uid: id },
      })
      .catch((err) => {
        Logger.debug((err as Error).message, 'AuthService.files');
        throw new InternalServerErrorException('Something went wrong');
      });

    const start = (page - 1) * limit;

    const end = start + limit;

    return {
      data: files.slice(start, end),
      total: files.length,
      per_page: limit,
      page,
      total_pages: Math.ceil(files.length / limit),
    };
  }

  async register(
    username: string,
    password: string,
    email?: string
  ): Promise<UserResponse> {
    const check = await this.prismaService.user
      .findFirst({
        where: { OR: [{ email }, { username }] },
      })
      .catch((err) => {
        Logger.debug((err as Error).message, 'AuthService.register');
        throw new InternalServerErrorException('Something went wrong');
      });

    if (check)
      return {
        error: [
          {
            field: 'email',
            message: 'Email or username already exists',
          },
          {
            field: 'username',
            message: 'Email or username already exists',
          },
        ],
      };

    const hashedPassword = await this.hashPassword(password);
    const token = this.generateToken(32);

    const user = await this.prismaService.user.create({
      data: {
        email,
        username,
        token,
        password: hashedPassword,
      },
      include: { files: true },
    });
    delete user.password;
    return { user };
  }

  async login(username: string, password: string): Promise<UserResponse> {
    const user = username.includes('@')
      ? await this.prismaService.user.findUnique({
          where: { email: username },
          include: { files: true },
        })
      : await this.prismaService.user.findUnique({
          where: { username },
          include: { files: true },
        });

    if (!user)
      return {
        error: [
          {
            field: 'username_email',
            message: 'Incorrect username/email or password',
          },
          {
            field: 'password',
            message: 'Incorrect username/email or password',
          },
        ],
      };

    const isValid = await this.verifyPassword(user.password, password);

    if (!isValid)
      return {
        error: [
          {
            field: 'username_email',
            message: 'Incorrect username/email or password',
          },
          {
            field: 'password',
            message: 'Incorrect username/email or password',
          },
        ],
      };

    delete user.password;

    return { user };
  }

  logout(req: Request, res: Response): Promise<boolean> {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          resolve(false);
        }
        resolve(true);
      });
    });
  }

  async updateSlugType(type: SLUG_TYPE, id: number) {
    switch (type) {
      case SLUG_TYPE.RANDOM:
        return this.prismaService.user.update({
          where: { id },
          data: {
            slugType: SLUG_TYPE.RANDOM,
          },
        });
      case SLUG_TYPE.EMOJI:
        return this.prismaService.user.update({
          where: { id },
          data: {
            slugType: SLUG_TYPE.EMOJI,
          },
        });

      case SLUG_TYPE.ZEROWIDTH:
        return this.prismaService.user.update({
          where: { id },
          data: {
            slugType: SLUG_TYPE.ZEROWIDTH,
          },
        });
      default:
        throw new BadRequestException('Invalid slug type');
    }
  }

  async resetToken(id: number) {
    if (!id) throw new UnauthorizedException('Unauthorized.');

    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) throw new UnauthorizedException('Unauthorized.');

    const token = this.generateToken(32);

    await this.prismaService.user
      .update({
        where: { id },
        data: {
          token,
        },
      })
      .catch((err) => {
        Logger.debug((err as Error).message, 'AuthService.resetToken');
        throw new InternalServerErrorException('Something went wrong');
      });

    return { token };
  }

  async getShareXUploadConfig(id: number) {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) throw new UnauthorizedException('Unauthorized.');

    const uploaderConfig = {
      Version: '13.2.1',
      Name: 'bliss',
      DestinationType: 'ImageUploader, FileUploader, TextUploader',
      RequestMethod: 'POST',
      RequestURL: `${process.env.USE_HTTPS ? 'https' : 'http'}://${
        process.env.SERVER_DOMAIN
      }/upload`,
      Headers: {
        Authorization: user.token,
        Type: user.slugType,
      },
      URL: '$json:url$',
      ThumbnailURL: '$json:thumbUrl$',
      DeletionURL: '$json:deletionUrl$',
      ErrorMessage: '$json:error$',
      Body: 'MultipartFormData',
      FileFormName: 'file',
    };

    return uploaderConfig;
  }

  async changePassword(id: number, old_password: string, new_password: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) throw new UnauthorizedException('Unauthorized');

    const check = await this.verifyPassword(user.password, old_password);

    if (!check)
      return {
        error: [
          {
            field: 'old_password',
            message: 'Incorrect password',
          },
        ],
      };

    const hashedPassword = await this.hashPassword(new_password);

    return this.prismaService.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });
  }

  async getStats() {
    const [totalUser, totalFile, totalSize] = await Promise.all([
      this.prismaService.user.count(),
      this.prismaService.file.count(),
      this.dirSize(),
    ]);

    return {
      memory: os.freemem(),
      total: bytesToSize(os.totalmem()),
      free: bytesToSize(os.freemem()),
      used: bytesToSize(os.totalmem() - os.freemem()),
      platform: os.platform(),
      release: os.release(),
      type: os.type(),
      arch: os.arch(),
      cpus: os.cpus(),
      uptime: new Date(os.uptime() * 1000).toISOString().substring(11, 19),
      hostname: os.hostname(),
      networkInterfaces: os.networkInterfaces(),
      totalUser,
      totalFile,
      totalSize: bytesToSize(totalSize),
    };
  }

  async dirSize() {
    const files = await this.prismaService.file.findMany();

    const fileSize = files.reduce((acc, file) => {
      return acc + file.size;
    }, 0);

    return fileSize;
  }

  hashPassword(text: string): Promise<string> {
    return argon.hash(text);
  }

  verifyPassword(hash: string, password: string): Promise<boolean> {
    return argon.verify(hash, password);
  }

  generateToken(len: number): string {
    return randomBytes(len).toString('hex').substring(0, len);
  }
}
