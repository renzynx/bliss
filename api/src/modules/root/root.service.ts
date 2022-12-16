import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { Request, Response } from "express";
import fastFolderSize from "fast-folder-size";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { thumbnailDir, uploadDir } from "lib/constants";
import { formatBytes, generateRandomHexColor, lookUp } from "lib/utils";
import mime from "mime-types";
import { PrismaService } from "modules/prisma/prisma.service";
import { join } from "path";
import { promisify } from "util";

@Injectable()
export class RootService {
  private logger = new Logger(RootService.name);
  constructor(private readonly prismaService: PrismaService) {}

  async getOembed(slug: string, res: Response) {
    return stat(join(thumbnailDir, slug + ".json"))
      .then(async () => {
        const stream = createReadStream(join(thumbnailDir, slug + ".json"));
        stream.pipe(res);
      })
      .catch((err) => {
        if (err.code === "ENOENT") {
          return {};
        } else {
          this.logger.error(err.message);
        }
      });
  }

  getThumbnail(filename: string, res: Response) {
    if (!filename) {
      throw new NotFoundException();
    }
    return stat(join(thumbnailDir, filename))
      .then((stats) => {
        res.setHeader("Accept-Ranges", "bytes");
        res.setHeader("Content-Length", stats.size);
        res.setHeader(
          "Content-Disposition",
          `'inline'; filename=${filename.split("_")[1]}`
        );
        createReadStream(join(thumbnailDir, filename)).pipe(res);
      })
      .catch(() => {
        throw new NotFoundException();
      });
  }

  async getFile(slug: string, req: Request) {
    if (!slug) {
      throw new NotFoundException();
    }
    const file = await this.prismaService.file.findUnique({
      where: { slug },
      include: { user: { include: { embed_settings: true } } },
    });

    if (!file) {
      throw new NotFoundException();
    }

    const protocol = req.headers["x-forwarded-proto"] || req.protocol;

    const baseUrl = `${protocol}://${req.headers.host}`;

    return stat(join(uploadDir, `${slug}_${file.filename}`))
      .then(async (stats) => {
        const isVideo = lookUp(file.filename).includes("video");
        const isImage = lookUp(file.filename).includes("image");
        const isAudio = lookUp(file.filename).includes("audio");
        const cannotDisplay = !isImage && !isVideo && !isAudio;

        return {
          oembed: `${baseUrl}/${slug}.json`,
          url: `${baseUrl}/${slug}_${file.filename}`,
          title: file.user.embed_settings?.title,
          description: file.user.embed_settings?.description,
          color: file.user.embed_settings?.color ?? generateRandomHexColor(),
          ogType: isVideo ? "video.other" : isImage ? "image" : "website",
          urlType: isVideo ? "video" : isAudio ? "audio" : "image",
          mimetype: lookUp(file.filename),
          filename: file.filename,
          slug: file.slug + "." + file.filename.split(".").pop(),
          size: stats.size,
          username: file.user.username,
          embed_enabled: file.user.embed_settings?.enabled ?? false,
          isVideo,
          isImage,
          isAudio,
          cannotDisplay,
        };
      })
      .catch((err) => {
        if (err.code === "ENOENT") {
          throw new NotFoundException();
        } else {
          this.logger.error(err.message);
          throw new InternalServerErrorException("Something went wrong");
        }
      });
  }

  async getStatistics() {
    try {
      const fastSize = promisify(fastFolderSize);
      const [files, uploads] = await Promise.all([
        this.prismaService.file.count(),
        fastSize(uploadDir),
      ]);

      return {
        files,
        size: formatBytes(uploads),
      };
    } catch (error) {
      this.logger.error(error.message);
      return {
        files: "N/A",
        size: "N/A",
      };
    }
  }
}