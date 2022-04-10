import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { IAuthService, UserResponse } from '../lib/interfaces';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'node:crypto';
import * as argon from 'argon2';

@Injectable()
export class AuthService implements IAuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async me(id: number): Promise<UserResponse> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!user) return { error: 'User not found' };
      delete user.password;
      return { user };
    } catch (error) {
      Logger.error((error as Error).message, 'AuthService.me');
      return { error: 'Something went wrong' };
    }
  }

  async register(
    username: string,
    password: string,
    email?: string
  ): Promise<UserResponse> {
    try {
      const check = await this.prismaService.user.findFirst({
        where: { OR: [{ email }, { username }] },
      });

      if (check) return { error: 'User already exists' };

      const hashedPassword = await this.hashPassword(password);
      const token = this.generateToken(32);

      const user = await this.prismaService.user.create({
        data: {
          email,
          username,
          token,
          password: hashedPassword,
        },
      });
      delete user.password;
      return { user };
    } catch (error) {
      Logger.error((error as Error).message, 'AuthService.register');
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async login(username: string, password: string): Promise<UserResponse> {
    try {
      const user = username.includes('@')
        ? await this.prismaService.user.findUnique({
            where: { email: username },
          })
        : await this.prismaService.user.findUnique({ where: { username } });

      if (!user) return { error: 'User not found' };

      const isValid = await this.verifyPassword(user.password, password);

      if (!isValid) return { error: 'Incorrect username or password' };
      delete user.password;
      return { user };
    } catch (error) {
      Logger.error((error as Error).message, 'AuthService.login');
      return { error: 'Something went wrong' };
    }
  }

  hashPassword(text: string): Promise<string> {
    return argon.hash(text);
  }

  verifyPassword(hash: string, password: string): Promise<boolean> {
    return argon.verify(hash, password);
  }

  generateToken(len: number) {
    return randomBytes(len).toString('hex').substring(0, len);
  }
}
