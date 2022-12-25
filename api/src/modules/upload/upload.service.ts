import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { EmbedSettings } from "@prisma/client";
import { Request, Response } from "express";
import { createWriteStream, existsSync } from "fs";
import { rename, stat, unlink, writeFile } from "fs/promises";
import { uploadDir } from "lib/constants";
import { generateRandomString, lookUp } from "lib/utils";
import { PrismaService } from "modules/prisma/prisma.service";
import { join } from "path";
import md5 from "md5";

@Injectable()
export class UploadService {
  private logger = new Logger(UploadService.name);

  constructor(private readonly prismaService: PrismaService) {}

  createOEmbedJSON(oembed: Partial<EmbedSettings> & { filename: string }) {
    const tmp = oembed;
    delete tmp.filename;
    const data = {
      version: "1.0",
      type: "link",
      ...tmp,
    };

    const { filename } = oembed;

    delete data.userId;

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
    const filePath = join(
      uploadDir,
      `${file.slug}.${file.filename.split(".").pop()}`
    );
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

    const tmp = await this.prismaService.file.aggregate({
      where: {
        user: {
          apiKey: apikey,
        },
      },
      _sum: { size: true },
    });

    const final = Math.round(tmp._sum.size / 1e6);

    if (final > user.uploadLimit || user.uploadLimit !== 0) {
      throw new BadRequestException(
        "You have no space left for upload, maybe delete a few files first?"
      );
    }

    const slug = generateRandomString(12);
    const ext = file.originalname.split(".").pop();

    const stream = createWriteStream(join(uploadDir, `${slug}.${ext}`), {
      flags: "w",
    }).on("error", (e) => {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        "Something went wrong in our end, please try again later."
      );
    });

    stream.write(file.buffer);
    stream.end();

    stream.on("error", (e) => {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        "Something went wrong in our end, please try again later."
      );
    });

    const mime = lookUp(file.originalname);

    const { embed_settings } = user;

    if (mime.includes("image") && embed_settings && embed_settings.enabled) {
      this.createOEmbedJSON({
        filename: slug,
        ...user.embed_settings,
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

    const protocol = req.headers["x-forwarded-proto"] || req.protocol;

    const baseUrl = `${protocol}://${req.get("host")}`;

    return {
      url: `${baseUrl}/${slug}`,
      thumbnail: `${baseUrl}/${slug}.${ext}`,
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

    const tmp = await this.prismaService.file.aggregate({
      where: {
        user: {
          apiKey: apikey,
        },
      },
      _sum: { size: true },
    });

    const final = Math.round(tmp._sum.size / 1e6);

    if (final > user.uploadLimit && user.uploadLimit !== 0) {
      throw new BadRequestException(
        "You have no space left for upload, maybe delete a few files first?"
      );
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
    const id = md5(name + req.ip);
    const tmpName = `tmp_${id}.${ext}`;

    if (firstChunk && existsSync(join(uploadDir, tmpName))) {
      await unlink(join(uploadDir, tmpName));
    }
    await writeFile(join(uploadDir, tmpName), buffer, { flag: "a" });
    if (lastChunk) {
      const mimetype = lookUp(name);
      let slug = generateRandomString(12);
      await rename(
        join(uploadDir, tmpName),
        join(uploadDir, `${slug}.${ext}`)
      ).catch(async (reason) => {
        if (reason === "EEXIST") {
          slug = generateRandomString(12);
          await rename(
            join(uploadDir, tmpName),
            join(uploadDir, `${slug}.${ext}`)
          );
          await this.prismaService.file.update({
            where: { slug: tmpName.split(".").shift() },
            data: { slug },
          });
        } else {
          this.logger.error(reason);
          throw new InternalServerErrorException(
            "Something went wrong in our end, please try again later."
          );
        }
      });

      const { embed_settings } = user;

      if (
        mimetype.includes("image") &&
        embed_settings &&
        embed_settings.enabled
      ) {
        this.createOEmbedJSON({
          filename: name,
          ...embed_settings,
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
