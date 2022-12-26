import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { EmbedSettings } from "@prisma/client";
import { Client, ItemBucketMetadata } from "minio";
import { Request, Response } from "express";
import { CustomSession } from "lib/types";
import { generateRandomString, lookUp } from "lib/utils";
import { PrismaService } from "modules/prisma/prisma.service";
import md5 from "md5";
import { createReadStream, existsSync } from "fs";
import { appendFile, readFile, unlink, writeFile } from "fs/promises";
import { join } from "path";
import { uploadDir } from "lib/constants";

@Injectable()
export class S3Service {
  private s3: Client;
  private logger = new Logger(S3Service.name);
  private readonly bucketName = process.env.S3_BUCKET_NAME;

  constructor(private readonly prismaService: PrismaService) {
    this.s3 =
      process.env.UPLOADER === "s3" &&
      new Client({
        endPoint: process.env.S3_ENDPOINT,
        accessKey: process.env.S3_ACCESS_KEY_ID,
        secretKey: process.env.S3_SECRET_ACCESS_KEY,
        region: process.env.S3_REGION,
        pathStyle: true,
      });
  }

  createOEmbedJSON(oembed: Partial<EmbedSettings> & { filename: string }) {
    const { author_name, author_url, provider_name, provider_url, filename } =
      oembed;

    const data = {
      version: "1.0",
      type: "link",
      author_name,
      author_url,
      provider_name,
      provider_url,
    };

    const metadata: ItemBucketMetadata = {
      "Content-Type": "application/json",
    };

    return this.s3.putObject(
      this.bucketName,
      `${filename}.json`,
      JSON.stringify(data),
      metadata
    );
  }

  async uploadFile(req: Request, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("Missing file.");
    }

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

    const slug = generateRandomString(12);
    const extension = file.originalname.split(".").pop();
    const filename = slug + "." + extension;

    const params: ItemBucketMetadata = {
      "Content-Type": file.mimetype,
      "Content-Disposition": "inline",
      "Content-Length": file.size,
    };

    const { embed_settings } = user;

    if (lookUp(filename).includes("image") && embed_settings?.enabled) {
      await this.createOEmbedJSON({
        filename: slug,
        ...embed_settings,
      });
    }

    await Promise.all([
      this.prismaService.file.create({
        data: {
          filename: file.originalname,
          slug,
          userId: user.id,
          size: file.size,
          mimetype: file.mimetype,
        },
      }),
      this.s3
        .putObject(this.bucketName, filename, file.buffer, params)
        .catch((err) => {
          this.logger.error(err.message);
          throw new InternalServerErrorException("Server error");
        }),
    ]);

    const protocol = req.headers["x-forwarded-proto"] || "http";

    return {
      url: `${protocol}://${req.get("host")}/${slug}`,
      thumbnail: `${process.env.CDN_URL ?? protocol}/${filename}`,
      delete: `${protocol}://${req.get("host")}/delete/${filename}`,
    };
  }

  async bulkUpload(req: Request) {
    const apiKey = req.headers["authorization"] as string;

    if (!apiKey) {
      throw new BadRequestException("Authorization header is missing");
    }

    const user = await this.prismaService.user.findUnique({
      where: { apiKey },
      include: { embed_settings: true },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid session");
    }

    const tmp = await this.prismaService.file.aggregate({
      where: {
        user: { apiKey },
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
    const id: string = md5(name + req.ip);
    const tmpName = `tmp_${id}.${ext}`;

    if (firstChunk && existsSync(join(uploadDir, tmpName))) {
      await unlink(join(uploadDir, tmpName));
    }

    await writeFile(join(uploadDir, tmpName), buffer, { flag: "a" })
      .then(() => {
        this.logger.debug(`Uploaded chunk ${currentChunk} of ${totalChunks}`);
      })
      .catch((err) => {
        this.logger.error(err.message);
        throw new InternalServerErrorException("Server error");
      });

    if (lastChunk) {
      const { embed_settings } = user;
      try {
        const slug = generateRandomString(12);
        const extension = name.split(".").pop();
        const filename = slug + "." + extension;
        const mimetype = lookUp(name);

        const params: ItemBucketMetadata = {
          "Content-Length": size,
          "Content-Type": mimetype,
          "Content-Disposition": "inline",
        };

        if (mimetype.includes("image") && embed_settings?.enabled) {
          await this.createOEmbedJSON({
            filename: slug,
            ...embed_settings,
          });
        }

        await Promise.all([
          this.prismaService.file.create({
            data: {
              filename: name,
              slug,
              userId: user.id,
              size: +size,
              mimetype,
            },
          }),
          this.s3.fPutObject(
            this.bucketName,
            filename,
            join(uploadDir, tmpName),
            params
          ),
        ]);

        return { final: id };
      } catch (error) {
        this.logger.error(error.message);
        throw new InternalServerErrorException(
          "Something went wrong in our end, please try again later."
        );
      }
    }
  }

  async deleteFile(key: string, res: Response) {
    if (!key) {
      throw new BadRequestException("Missing key.");
    }

    const decodedId = Buffer.from(key, "base64").toString("utf-8");

    const file = await this.prismaService.file.findUnique({
      where: { id: decodedId },
    });

    if (!file) {
      throw new NotFoundException("File does not exist");
    }

    const ext = file.filename.split(".").pop();
    const full = `${file.slug}.${ext}`;

    await Promise.all([
      this.prismaService.file.delete({ where: { id: decodedId } }),
      this.s3.removeObject(this.bucketName, full, (error) => {
        if (error.message.toLowerCase().includes("exist")) {
          throw new NotFoundException("File does not exist");
        } else {
          this.logger.error(error.message);
          throw new InternalServerErrorException("Server error");
        }
      }),
    ]);

    return res.status(200).json({ message: "File deleted successfully" });
  }
}
