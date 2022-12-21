import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { EmbedSettings } from "@prisma/client";
import { Client, ItemBucketMetadata } from "minio";
import { Request, Response } from "express";
import { CustomSession } from "lib/types";
import { generateApiKey, lookUp } from "lib/utils";
import { PrismaService } from "modules/prisma/prisma.service";

@Injectable()
export class S3Service {
  private s3: Client;
  private logger = new Logger(S3Service.name);
  private readonly bucketName = process.env.S3_BUCKET_NAME;

  constructor(private readonly prismaService: PrismaService) {
    this.s3 = new Client({
      endPoint: process.env.S3_ENDPOINT,
      accessKey: process.env.S3_ACCESS_KEY_ID,
      secretKey: process.env.S3_SECRET_ACCESS_KEY,
      region: process.env.S3_REGION,
      pathStyle: true,
    });
  }

  createOEmbedJSON(oembed: Partial<EmbedSettings> & { filename: string }) {
    const tmp = oembed;

    delete tmp.filename;

    const data = {
      version: "1.0",
      type: "link",
      ...tmp,
    };

    const metadata: ItemBucketMetadata = {
      "Content-Type": "application/json",
    };

    return this.s3.putObject(
      this.bucketName,
      `${oembed.filename}.json`,
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

    const slug = generateApiKey(12);
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

    await this.s3
      .putObject(this.bucketName, filename, file.buffer, params)
      .catch((err) => {
        this.logger.error(err.message);
        throw new InternalServerErrorException("Server error");
      });

    const protocol = req.headers["x-forwarded-proto"] || "http";

    return {
      url: `${protocol}://${req.get("host")}/${slug}`,
      thumbnail: `${process.env.CDN_URL ?? protocol}/${filename}`,
      delete: `${protocol}://${req.get("host")}/delete/${filename}`,
    };
  }

  async deleteFile(key: string, res: Response) {
    if (!key) {
      throw new BadRequestException("Missing key.");
    }

    await this.s3.removeObject(this.bucketName, key, (error) => {
      if (error.message.includes("The specified key does not exist.")) {
        throw new BadRequestException("File does not exist");
      } else {
        this.logger.error(error.message);
        throw new InternalServerErrorException("Server error");
      }
    });

    return res.status(200).json({ message: "File deleted successfully" });
  }

  async bulkUpload(req: Request, files: Express.Multer.File[]) {
    const userId = (req.session as CustomSession).userId;

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { embed_settings: true },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid session");
    }

    const { embed_settings } = user;
    try {
      const promises = files.map(async (file) => {
        const slug = generateApiKey(12);
        const extension = file.originalname.split(".").pop();
        const filename = slug + "." + extension;

        const params: ItemBucketMetadata = {
          "Content-Length": file.size,
          "Content-Type": file.mimetype,
          "Content-Disposition": "inline",
        };

        if (
          lookUp(file.originalname).includes("image") &&
          embed_settings?.enabled
        ) {
          await this.createOEmbedJSON({
            filename: slug,
            ...embed_settings,
          });
        }

        return this.s3.putObject(
          this.bucketName,
          filename,
          file.buffer,
          params
        );
      });

      return Promise.all(promises);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(
        "Something went wrong in our end, please try again later."
      );
    }
  }
}
