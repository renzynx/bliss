import 'multer';
import type { File, User } from '@prisma/client';
import { SLUG_TYPE } from './constants';
import {
  PaginationPayload,
  Stats,
  UploadResponse,
  UserResponse,
} from '@bliss/shared-types';

export interface IUploadService {
  findUser(token: string): Promise<UserResponse>;
  generateSlug(type: SLUG_TYPE, length?: number): string;
  updateCache(file: File): Promise<string>;
  uploadFile(
    file: Express.Multer.File,
    uid: number,
    slugType: string,
    uploader: 'sharex' | 'web',
    perverse?: boolean
  ): Promise<UploadResponse | File>;
  getProtocol(): 'https' | 'http';
}

export interface IAuthService {
  register(
    email: string,
    username: string,
    password: string
  ): Promise<UserResponse>;
  login(username: string, password: string): Promise<UserResponse>;
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
  getFile(slug: string): Promise<string>;
}
