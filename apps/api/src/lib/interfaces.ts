import 'multer';
import type { User } from '.prisma/client';
import { File } from '@prisma/client';
import { SLUG_TYPE } from './constants';

export interface UserResponse {
  error?: string;
  user?: User;
}

export interface UploadResponse {
  error?: string;
  url?: string;
  delete?: string;
}

export interface IUploadService {
  findUser(token: string): Promise<UserResponse>;
  generateSlug(type: SLUG_TYPE, length?: number): string;
  updateCache(file: File): Map<string, File>;
  uploadFile(
    file: Express.Multer.File,
    uid: number,
    slugType: string,
    perverse?: boolean
  ): Promise<UploadResponse>;
  getProtocol(): 'https' | 'http';
}

export interface IAuthService {
  register(
    email: string,
    username: string,
    password: string
  ): Promise<UserResponse>;
  login(username: string, password: string): Promise<UserResponse>;
  me(id: number): Promise<UserResponse>;
  hashPassword(text: string): Promise<string>;
  verifyPassword(hash: string, password: string): Promise<boolean>;
  generateToken(length: number): string;
}

export interface IAppService {
  getFile(slug: string): File;
}
