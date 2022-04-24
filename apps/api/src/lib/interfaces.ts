import 'multer';
import type { File, User } from '@prisma/client';
import { SLUG_TYPE } from './constants';
import {
  PaginationPayload,
  Stats,
  UploadResponse,
  UserResponse,
} from '@bliss/shared-types';
import { Request, Response } from 'express';
import { StreamableFile } from '@nestjs/common';
import { SessionData } from 'express-session';

export interface IUploadService {
  findUser(token: string): Promise<User>;
  generateSlug(type: SLUG_TYPE, length?: number): string;
  updateCache(file: File): Promise<string>;
  uploadFile(
    file: Express.Multer.File,
    req: Request
  ): Promise<UploadResponse | string>;
  getProtocol(): 'https' | 'http';
}

export interface IAuthService {
  register(
    session: SessionData,
    username: string,
    password: string,
    email?: string
  ): Promise<UserResponse>;
  login(
    session: SessionData,
    username: string,
    password: string
  ): Promise<UserResponse>;
  files(
    id: number,
    page: number,
    limit?: number
  ): Promise<PaginationPayload<File>>;
  me(id: number): Promise<UserResponse>;
  updateSlugType(type: SLUG_TYPE, id: number): Promise<User>;
  getStats(): Promise<Stats>;
  hashPassword(text: string): Promise<string>;
  verifyPassword(hash: string, password: string): Promise<boolean>;
  generateToken(length: number): string;
}

export interface IAppService {
  getFile(
    slug: string,
    res: Response,
    download?: string
  ): Promise<StreamableFile | string>;
}
