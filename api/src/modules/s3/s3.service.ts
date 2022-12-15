import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { EmbedSettings } from "@prisma/client";
import S3Client from "aws-sdk/clients/s3";
import { Request, Response } from "express";
import { CustomSession } from "lib/types";
import { generateApiKey, lookUp } from "lib/utils";
import { PrismaService } from "modules/prisma/prisma.service";

@Injectable()
export class S3Service {
  private s3: S3Client;
  private logger = new Logger(S3Service.name);

  constructor(private readonly prismaService: PrismaService) {
    this.s3 = new S3Client({
      endpoint: process.env.S3_ENDPOINT,
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      region: process.env.S3_REGION,
      s3ForcePathStyle: true,
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

    const params: S3Client.PutObjectRequest = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${filename}.json`,
      Body: JSON.stringify(data),
      ContentType: "application/json",
    };

    return this.s3.upload(params).promise();
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

    const params: S3Client.PutObjectRequest = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: filename,
      Body: file.buffer,
      ContentLength: file.size,
      ContentType: file.mimetype,
    };

    const { embed_settings } = user;

    lookUp(filename).includes("image") &&
      embed_settings &&
      embed_settings.enabled &&
      (await this.createOEmbedJSON({
        filename: slug,
        embedAuthor: user.embed_settings?.embedAuthor,
        embedAuthorUrl: user.embed_settings?.embedAuthorUrl,
        embedSite: user.embed_settings?.embedSite,
        embedSiteUrl: user.embed_settings?.embedSiteUrl,
      }));

    const data = await this.s3.upload(params).promise();
    const protocol = process.env.USE_PROXY === "true" ? "https" : req.protocol;
    return {
      url: `${protocol}://${req.get("host")}/${slug}`,
      thumbnail: `${process.env.CDN_URL}/${filename}`,
      delete: `${protocol}://${req.get("host")}/s3/delete/${filename}`,
    };
  }

  async deleteFile(key: string, res: Response) {
    if (!key) {
      throw new BadRequestException("Missing key.");
    }

    const params: S3Client.DeleteObjectRequest = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    };

    try {
      const data = await this.s3.deleteObject(params).promise();
      return data.DeleteMarker
        ? res.send(`<pre>Successfully deleted ${key}</pre>`)
        : res.send("<pre>File does not exist</pre>");
    } catch (error) {
      this.logger.error(error.message);
      return res.send("File does not exist or server error.");
    }
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

        const params: S3Client.PutObjectRequest = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: filename,
          Body: file.buffer,
          ContentLength: file.size,
          ContentType: file.mimetype,
        };

        embed_settings &&
          embed_settings.enabled &&
          (await this.createOEmbedJSON({
            filename: slug,
            embedAuthor: user.embed_settings?.embedAuthor,
            embedAuthorUrl: user.embed_settings?.embedAuthorUrl,
            embedSite: user.embed_settings?.embedSite,
            embedSiteUrl: user.embed_settings?.embedSiteUrl,
          }));

        return this.s3.upload(params).promise();
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
