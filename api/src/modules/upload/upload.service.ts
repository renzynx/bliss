import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from "@nestjs/common";
import { generateApiKey, lookUp } from "lib/utils";
import { createReadStream, createWriteStream, existsSync } from "fs";
import { readdir, readFile, stat, unlink, writeFile } from "fs/promises";
import { thumbnailDir, tmpDir, uploadDir } from "lib/constants";
import { Request, Response } from "express";
import { join } from "path";
import { PrismaService } from "modules/prisma/prisma.service";
import { CustomSession } from "lib/types";
import mimetype from "mime-types";
import { EmbedSettings } from "@prisma/client";

@Injectable()
export class UploadService {
  private logger = new Logger(UploadService.name);

  constructor(private readonly prismaService: PrismaService) {}

  getFilePath(fileId: string) {
    return join(uploadDir, fileId);
  }

  uploadRequest() {
    const fileId = generateApiKey(12);
    createWriteStream(this.getFilePath(fileId), { flags: "w" });
    return { fileId };
  }

  async uploadStatus(fileId: string) {
    return stat(this.getFilePath(fileId))
      .then((stats) => {
        return { uploaded: stats.size };
      })
      .catch((err) => {
        if (err.code === "ENOENT") {
          return { uploaded: 0 };
        }
        throw err;
      });
  }

  createOEmbedJSON({
    embedAuthor,
    embedAuthorUrl,
    embedSite,
    embedSiteUrl,
    filename,
  }: Partial<EmbedSettings> & { filename: string }) {
    const data = {
      version: "1.0",
      type: "link",
      author_name: embedAuthor,
      author_url: embedAuthorUrl,
      provider_name: embedSite,
      provider_url: embedSiteUrl,
    };

    const stream = createWriteStream(join(thumbnailDir, filename + ".json"), {
      flags: "w",
    });
    stream.write(JSON.stringify(data));
    stream.end();
  }

  async deleteFile(id: string, res: Response) {
    const file = await this.prismaService.file.findUnique({
      where: { id },
    });

    if (!file) {
      throw new NotFoundException("Not found");
    }

    const oembedPath = join(thumbnailDir, `${file.slug}.json`);
    const thumbnailPath = join(thumbnailDir, `${file.slug}_${file.filename}`);
    const isImg = lookUp(file.filename) && existsSync(oembedPath);
    const oembedExist = existsSync(oembedPath);

    return stat(join(uploadDir, file.slug))
      .then(async () => {
        await Promise.all([
          this.prismaService.file.delete({
            where: { id },
          }),
          unlink(join(uploadDir, file.slug)),
          isImg && unlink(join(thumbnailDir, `${file.slug}.json`)),
          oembedExist && unlink(join(thumbnailDir, thumbnailPath)),
        ]);
        return res.send(`<pre>Successfully deleted ${file.filename}</pre>`);
      })
      .catch((err) => {
        if (err.code === "ENOENT") {
          throw new NotFoundException("Not found");
        } else {
          this.logger.error(err.message);
          return res
            .status(500)
            .send(
              `<pre>Something went wrong in our end, please try again later.</pre>`
            );
        }
      });
  }

  async sharexUpload(file: Express.Multer.File, req: Request) {
    const apikey = req.headers["authorization"] as string;
    if (!apikey) {
      throw new BadRequestException("Authorization header is missing");
    }

    const user = await this.prismaService.user.findUnique({
      where: { apiKey: apikey },
      include: { embed_settings: true },
    });

    if (!user) {
      throw new BadRequestException("Invalid API key");
    }

    const slug = generateApiKey(12);

    const stream = createWriteStream(join(uploadDir, slug), {
      flags: "w",
    }).on("error", (e) => {
      throw new InternalServerErrorException(e);
    });
    const thumbnail = createWriteStream(
      join(thumbnailDir, slug + "_" + file.originalname),
      {
        flags: "w",
      }
    );

    stream.write(file.buffer);
    thumbnail.write(file.buffer);
    stream.end();
    thumbnail.end();

    user.embed_settings &&
      user.embed_settings.enabled &&
      this.createOEmbedJSON({
        filename: slug,
        embedAuthor: user.embed_settings?.embedAuthor,
        embedAuthorUrl: user.embed_settings?.embedAuthorUrl,
        embedSite: user.embed_settings?.embedSite,
        embedSiteUrl: user.embed_settings?.embedSiteUrl,
      });

    const mime = mimetype.lookup(file.originalname);

    const { id } = await this.prismaService.file.create({
      data: {
        userId: user.id,
        filename: file.originalname,
        size: file.size,
        mimetype: mime ? mime : "application/octet-stream",
        slug,
      },
    });

    const protocol = process.env.USE_PROXY === "true" ? "https" : req.protocol;

    const baseUrl = `${protocol}://${req.get("host")}`;

    return {
      url: `${baseUrl}/${slug}`,
      thumbnail: `${baseUrl}/${slug}_${file.originalname}`,
      delete: `${baseUrl}/delete/${id}`,
    };
  }

  async bulkUpload(files: Array<Express.Multer.File>, req: Request) {
    const apikey = req.headers["authorization"] as string;

    if (!apikey) {
      throw new BadRequestException("Authorization header is missing");
    }

    const user = await this.prismaService.user.findUnique({
      where: { apiKey: apikey },
      include: { embed_settings: true },
    });

    const contentRange = req.headers["content-range"] as string;

    if (contentRange) {
      const [start, end, total] = req.headers["content-range"]
        .replace("bytes ", "")
        .replace("-", "/")
        .split("/")
        .map((x) => +x);

      const filename = req.headers["x-file-name"] as string;
      const mimetype = req.headers["x-file-type"] as string;
      const fileId = req.headers["x-file-id"] as string;
      const lastchunk = req.headers["x-file-last-chunk"] === "true";

      this.logger.debug({
        filename,
        mimetype,
        fileId,
        lastchunk,
        start,
        end,
        total,
      });

      const tmpFile = join(tmpDir, `b_tmp_${fileId}_${start}_${end}`);
      await writeFile(tmpFile, files[0].buffer);

      if (lastchunk) {
        const t = await readdir(tmpDir).then((files) =>
          files.filter((f) => f.startsWith(`b_tmp_${fileId}`))
        );

        const readChunks = t.map((f) => {
          const [, , , start, end] = f.split("_");
          return {
            start: +start,
            end: +end,
            filename: f,
          };
        });

        const chunks = new Uint8Array(total);

        for (let i = 0; i !== readChunks.length; i++) {
          const chunkData = readChunks[i];

          const buffer = await readFile(join(tmpDir, chunkData.filename));
          await unlink(join(tmpDir, readChunks[i].filename));

          chunks.set(buffer, chunkData.start);
        }
      }

      if (!files) {
        throw new BadRequestException("No files were uploaded");
      }
      if (files && files.length === 0) {
        throw new BadRequestException("No files were uploaded");
      }

      for (let i = 0; i !== files.length; i++) {
        const file = files[i];

        if (!file.originalname) {
          throw new BadRequestException("No filename");
        }

        const f = await this.prismaService.file.create({
          data: {
            userId: user.id,
            filename: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            slug: fileId,
          },
        });

        return {
          url: `${process.env.BASE_URL}/${fileId}`,
          delete: `${process.env.BASE_URL}/delete/${f.id}`,
        };
      }
    }
  }

  // bulkUpload(file: Array<Express.Multer.File>, req: Request) {
  //   const contentRange = req.headers["content-range"];

  // if (!contentRange) {
  //   throw new BadRequestException("Content-Range header is missing");
  // }

  // if (!fileId) {
  //   throw new BadRequestException("X-File-Id header is missing");
  // }

  // const match = contentRange.match(/bytes=(\d+)-(\d+)\/(\d+)/);

  // if (!match) {
  //   throw new BadRequestException("Invalid Content-Range header");
  // }

  // const rangeStart = +match[1];
  // const rangeEnd = +match[2];
  // const fileSize = +match[3];

  // const max = 1024 * 1024 * 1024 * 2; // 2GB

  // if (fileSize > max) {
  //   throw new BadRequestException("File is too large");
  // }

  // if (
  //   rangeStart >= fileSize ||
  //   rangeStart >= rangeEnd ||
  //   rangeEnd > fileSize
  // ) {
  //   throw new BadRequestException("Invalid Content-Range header");
  // }

  // if (!fileId) {
  //   req.pause();
  // }

  // stat(this.getFilePath(fileId))
  //   .then(async (stats) => {
  //     if (stats.size !== rangeStart) {
  //       throw new BadRequestException("Bad chunk!");
  //     }

  //     const stream = createWriteStream(this.getFilePath(fileId), {
  //       flags: "a",
  //     });
  //     stream.write(file.buffer);
  //     stream.end();

  //     const mime = mimetype.lookup(file.originalname);

  //     await this.prismaService.file
  //       .create({
  //         data: {
  //           filename: file.originalname,
  //           mimetype: mime ? mime : "application/octet-stream",
  //           slug: fileId,
  //           size: file.size,
  //           userId: (req.session as CustomSession).userId,
  //         },
  //         include: { user: { include: { embed_settings: true } } },
  //       })
  //       .then(({ user: { embed_settings } }) => {
  //         if (
  //           (mimetype.lookup(file.originalname) as string).includes("image")
  //         ) {
  //           const thumbnail = createWriteStream(
  //             join(thumbnailDir, fileId + "_" + file.originalname),
  //             {
  //               flags: "a",
  //             }
  //           );
  //           embed_settings &&
  //             embed_settings.enabled &&
  //             this.createOEmbedJSON({
  //               filename: fileId,
  //               embedAuthor: embed_settings?.embedAuthor,
  //               embedAuthorUrl: embed_settings?.embedAuthorUrl,
  //               embedSite: embed_settings?.embedSite,
  //               embedSiteUrl: embed_settings?.embedSiteUrl,
  //             });
  //           thumbnail.write(file.buffer);
  //           thumbnail.end();
  //         }
  //       });

  //     stream.on("error", (e) => {
  //       this.logger.error(e.message);
  //       throw new InternalServerErrorException("Error writing chunk");
  //     });
  //   })

  //   .catch((err) => {
  //     if (err.code === "ENOENT") {
  //       throw new BadRequestException("No file found");
  //     } else {
  //       this.logger.error(err.message);
  //       throw new InternalServerErrorException(
  //         "Something went wrong in our server, please try again later."
  //       );
  //     }
  //   });
  // }
}
