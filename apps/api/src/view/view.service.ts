import { bytesToSize } from '@bliss/shared-types';
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ViewService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  async getFile(slug: string) {
    const file = await this.prismaService.file.findFirst({
      where: { slug },
      include: { user: true },
    });

    if (!file) throw new NotFoundException('File not found');

    const [user] = await Promise.all([
      this.prismaService.user.findUnique({ where: { id: file.uid } }),
      this.prismaService.file.update({
        where: { id: file.id },
        data: { views: { increment: 1 } },
      }),
    ]);

    delete user.password;

    const {
      useEmbed,
      embedTitle,
      embedDesc,
      embedSiteName,
      embedColor,
      username,
    } = user;
    const type = file.mimetype.split('/').shift();
    const size = file.size;

    return {
      enabled: useEmbed,
      title: embedTitle,
      description: embedDesc,
      siteName: embedSiteName,
      color: embedColor,
      type,
      size,
      username,
      formatted_size: bytesToSize(size),
      original_name: file.originalName,
      filename: file.fileName,
      uploadedAt: file.createdAt,
      view: file.views,
    };
  }

  async getOembed(slug: string) {
    const file = await this.prismaService.file.findFirst({
      where: { slug },
      include: { user: true },
    });

    if (!file) throw new NotFoundException('File not found');

    return {
      type: 'link',
      version: '1.0',
      author_name: file.user.username,
      author_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      provider_name: 'Bliss',
      provider_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      title: file.originalName,
      url: `${process.env.NEXT_PUBLIC_API_URL}/${slug}`,
    };
  }

  private getProtocol() {
    return process.env.USE_HTTPS === 'true' ? 'https' : 'http';
  }
}
