import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { EmbedSettings } from "@prisma/client";
import argon from "argon2";
import { Request, Response } from "express";
import { createWriteStream, existsSync } from "fs";
import { rename, stat, unlink, writeFile } from "fs/promises";
import { thumbnailDir, uploadDir } from "lib/constants";
import { generateApiKey, lookUp } from "lib/utils";
import md5 from "md5";
import { PrismaService } from "modules/prisma/prisma.service";
import { join } from "path";

@Injectable()
export class UploadService {
  private logger = new Logger(UploadService.name);

  constructor(private readonly prismaService: PrismaService) {}

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

    const stream = createWriteStream(join(uploadDir, filename + ".json"), {
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

    const oembedPath = join(uploadDir, `${file.slug}.json`);
    const filePath = join(uploadDir, `${file.slug}_${file.filename}`);
    const isImg = lookUp(file.filename).includes("image");
    const oembedExist = existsSync(oembedPath);

    return stat(filePath)
      .then(async () => {
        await Promise.all([
          this.prismaService.file.delete({
            where: { id },
          }),
          unlink(filePath),
          isImg && oembedExist && unlink(oembedPath),
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

    const stream = createWriteStream(
      join(uploadDir, `${slug}_${file.originalname}`),
      {
        flags: "w",
      }
    ).on("error", (e) => {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        "Something went wrong in our end, please try again later."
      );
    });

    stream.write(file.buffer);
    stream.end();

    const mime = lookUp(file.originalname);

    if (mime.includes("image") && user.embed_settings?.enabled) {
      this.createOEmbedJSON({
        filename: slug,
        embedAuthor: user.embed_settings?.embedAuthor,
        embedAuthorUrl: user.embed_settings?.embedAuthorUrl,
        embedSite: user.embed_settings?.embedSite,
        embedSiteUrl: user.embed_settings?.embedSiteUrl,
      });
    }

    const { id } = await this.prismaService.file.create({
      data: {
        userId: user.id,
        filename: file.originalname,
        size: file.size,
        mimetype: mime,
        slug,
      },
    });

    const protocol = process.env.USE_SSL === "true" ? "https" : req.protocol;

    const baseUrl = `${protocol}://${req.get("host")}`;

    return {
      url: `${baseUrl}/${slug}`,
      thumbnail: `${baseUrl}/${slug}_${file.originalname}`,
      delete: `${baseUrl}/delete/${id}`,
    };
  }

  async bulkUpload(req: Request) {
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

    const name = decodeURIComponent(req.headers["x-file-name"] as string);
    const size = req.headers["x-file-size"] as string;
    const currentChunk = req.headers["x-current-chunk"] as string;
    const totalChunks = req.headers["x-total-chunks"] as string;

    const firstChunk = +currentChunk === 0;
    const lastChunk = +currentChunk === +totalChunks - 1;
    const ext = name.split(".").pop();
    const data = req.body.toString().split(",")[1];
    const buffer = Buffer.from(data, "base64");
    const id = md5(`${name}${req.ip}`);
    const slug = generateApiKey(12);
    const tmpName = `tmp_${id}.${ext}`;

    if (firstChunk && existsSync(join(uploadDir, tmpName))) {
      await unlink(join(uploadDir, tmpName));
    }
    await writeFile(join(uploadDir, tmpName), buffer, { flag: "a" });
    if (lastChunk) {
      const mimetype = lookUp(name);

      await rename(
        join(uploadDir, tmpName),
        join(uploadDir, `${slug}_${name}`)
      );

      if (mimetype.includes("image") && user.embed_settings?.enabled) {
        this.createOEmbedJSON({
          filename: name,
          embedAuthor: user.embed_settings?.embedAuthor,
          embedAuthorUrl: user.embed_settings?.embedAuthorUrl,
          embedSite: user.embed_settings?.embedSite,
          embedSiteUrl: user.embed_settings?.embedSiteUrl,
        });
      }

      await this.prismaService.file.create({
        data: {
          userId: user.id,
          filename: name,
          size: +size,
          mimetype,
          slug,
        },
      });

      return { final: id };
    } else {
      return "ok";
    }
  }
}
