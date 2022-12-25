import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Request,
  HttpCode,
  Get,
  Param,
  Response,
  Body,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "./upload.service";
import { Request as ERequest, Response as EResponse } from "express";
import { ROUTES } from "lib/constants";
import { SkipThrottle } from "@nestjs/throttler";

@SkipThrottle()
@Controller(ROUTES.UPLOAD)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @HttpCode(200)
  @UseInterceptors(FileInterceptor("file"))
  @Post()
  singleFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: ERequest
  ) {
    return this.uploadService.sharexUpload(file, req);
  }

  @Get("delete/:id")
  deleteFile(@Param("id") id: string, @Response() res: EResponse) {
    return this.uploadService.deleteFile(id, res);
  }

  @HttpCode(200)
  @Post("bulk")
  uploadFile(@Request() req: ERequest) {
    return this.uploadService.bulkUpload(req);
  }
}
