import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { S3Service } from "./s3.service";
import { Request as ERequest, Response as EResponse } from "express";
import { AuthGuard } from "modules/auth/guard/auth.guard";
import { ROUTES } from "lib/constants";

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

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("files"))
  @Post("bulk")
  uploadBulk(
    @UploadedFile() files: Express.Multer.File[],
    @Request() req: ERequest
  ) {
    return this.s3Service.bulkUpload(req, files);
  }
}
