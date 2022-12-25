import {
  Controller,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { SkipThrottle } from "@nestjs/throttler";
import { Request as ERequest } from "express";
import { ROUTES } from "lib/constants";
import { S3Service } from "./s3.service";

@SkipThrottle()
@Controller(ROUTES.UPLOAD)
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @UseInterceptors(FileInterceptor("file"))
  @Post()
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: ERequest
  ) {
    return this.s3Service.uploadFile(req, file);
  }

  @Post("bulk")
  uploadBulk(@Request() req: ERequest) {
    return this.s3Service.bulkUpload(req);
  }
}
