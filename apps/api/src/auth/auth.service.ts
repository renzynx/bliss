import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
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
import { COOKIE_NAME, INVITE_PREFIX, SLUG_TYPE } from '../lib/constants';
import { File } from '@prisma/client';
import { Request, Response } from 'express';
import { SessionData } from 'express-session';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  async me(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) throw new UnauthorizedException('Unauthorized.');

    delete user.password;
    return { user };
  }

  async getInvite(id: number) {
    const user = await this.prismaService.user
      .findUnique({
        where: { id },
        include: { invites: true },
      })
      .catch((err) => {
        Logger.debug((err as Error).message, 'AuthService.getInvite');
        throw new InternalServerErrorException('Something went wrong');
      });

    if (!user) throw new UnauthorizedException('Unauthorized.');

    return {
      invites: user.invites,
    };
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
    session: SessionData,
    username: string,
    password: string,
    invitation: string,
    email?: string
  ): Promise<UserResponse> {
    const [check, inviteCheck] = await Promise.all([
      this.prismaService.user.findFirst({
        where: { OR: [{ email }, { username }] },
      }),
      this.cacheManager.get<string>(INVITE_PREFIX + invitation),
    ]).catch((err) => {
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

    if (!inviteCheck)
      return {
        error: [
          {
            field: 'invitation',
            message: 'Invitation code is either invalid or expired',
          },
        ],
      };

    const hashedPassword = await this.hashPassword(password);
    const token = this.generateToken(32);

    const [user] = await Promise.all([
      this.prismaService.user.create({
        data: {
          email,
          username,
          token,
          password: hashedPassword,
        },
        include: { files: true },
      }),
      this.cacheManager.del(INVITE_PREFIX + invitation),
      this.prismaService.invite.update({
        where: { code: invitation },
        data: { usedBy: username },
      }),
    ]);

    delete user.password;

    session.userId = user.id;

    return { user };
  }

  async login(
    session: SessionData,
    username: string,
    password: string
  ): Promise<UserResponse> {
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

    session.userId = user.id;

    return { user };
  }

  logout(req: Request, res: Response): void {
    req.session.destroy((err) => {
      res.clearCookie(COOKIE_NAME);

      if (err) return { success: false };

      return { success: true };
    });
  }

  async createInvite(id: number) {
    const USER_LIMIT = 2;

    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: { invites: true },
    });

    if (!user) throw new UnauthorizedException('Unauthorized.');

    if (user.invites.length >= USER_LIMIT && !user.admin)
      throw new BadRequestException('You have reached the invite limit.');

    const code = this.generateToken(32);

    const expire = 1000 * 60 * 60 * 24 * 7;

    await Promise.all([
      this.prismaService.invite.create({
        data: {
          code,
          uid: id,
          expiresAt: new Date(Date.now() + expire),
        },
      }),
      this.cacheManager.set(INVITE_PREFIX + code, id, { ttl: expire / 1000 }),
    ]).catch((err) => {
      Logger.debug((err as Error).message, 'AuthService.createInvite');
      throw new InternalServerErrorException('Something went wrong');
    });

    return { code };
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
      RequestURL: `${process.env.NEXT_PUBLIC_API_URL}/upload`,
      Headers: {
        Authorization: user.token,
        Type: user.slugType,
      },
      URL: '$json:url$',
      DeletionURL: '$json:delete$',
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
