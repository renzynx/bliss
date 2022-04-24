import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { unlink } from 'node:fs/promises';
import { UPLOAD_DIR } from '../lib/constants';
import { join } from 'node:path';
import { PrismaService } from '../prisma/prisma.service';
import { Cache } from 'cache-manager';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class DeleteService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  findFile(token: string) {
    return this.prismaService.file.findUnique({
      where: { deleteToken: token },
    });
  }

  async deleteFile(
    token: string
  ): Promise<{ success: boolean; message: string }> {
    const file = await this.prismaService.file.findUnique({
      where: { deleteToken: token },
    });

    if (!file) throw new NotFoundException('File not found');

    await Promise.all([
      this.prismaService.file.delete({
        where: { deleteToken: token },
      }),
      unlink(join(UPLOAD_DIR, file.slug)),
      this.cacheManager.del(file.slug),
    ]).catch((err) => {
      Logger.error((err as Error).message, 'DeleteService.deleteFile');
      throw new InternalServerErrorException('Something went wrong');
    });
    return {
      success: true,
      message: `Successfully deleted ${file.originalName}.`,
    };
  }

  async deleteFileFromS3(token: string) {
    const file = await this.prismaService.file.findUnique({
      where: { deleteToken: token },
    });

    if (!file) throw new NotFoundException('File not found');

    await Promise.all([
      this.prismaService.file.delete({
        where: { deleteToken: token },
      }),
      this.s3Service.s3_delete(file.fileName),
      this.cacheManager.del(file.slug),
    ]).catch((err) => {
      Logger.error((err as Error).message, 'DeleteService.deleteFileFromS3');
      throw new InternalServerErrorException('Something went wrong');
    });

    return {
      success: true,
      message: `Successfully deleted ${file.originalName}.`,
    };
  }
}
