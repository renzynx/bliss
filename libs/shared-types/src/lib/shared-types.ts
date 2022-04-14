import type { User } from '@prisma/client';
import * as os from 'node:os';

export interface FieldError {
  field: string;
  message: string;
}

export interface UserResponse {
  error?: FieldError[];
  user?: Omit<User, 'password'>;
}

export interface UploadResponse {
  error?: string;
  url?: string;
  delete?: string;
}

export function bytesToSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(
    Math.floor(Math.log(bytes) / Math.log(1024)).toString(),
    10
  );
  return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
}

export interface Stats {
  memory: number;
  total: string;
  free: string;
  used: string;
  platform: NodeJS.Platform;
  release: string;
  type: string;
  arch: string;
  cpus: os.CpuInfo[];
  uptime: string;
  hostname: string;
  networkInterfaces: NodeJS.Dict<os.NetworkInterfaceInfo[]>;
  totalUser: number;
  totalFile: number;
  totalSize: string;
}

export interface PaginationPayload<T> {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: T[];
}
