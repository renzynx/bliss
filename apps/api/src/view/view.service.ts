import { bytesToSize } from '@bliss/shared-types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ViewService {
  constructor(private readonly prismaService: PrismaService) {}

  async getFile(slug: string) {
    const file = await this.prismaService.file.findFirst({
      where: { slug },
      include: { user: true },
    });

    if (!file) throw new NotFoundException('File not found');

    await this.prismaService.file.update({
      where: { id: file.id },
      data: { views: { increment: 1 } },
    });

    const user = file.user;

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
}
