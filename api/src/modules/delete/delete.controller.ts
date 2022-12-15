import { Controller, Get, Param, Response } from "@nestjs/common";
import { Response as EResponse } from "express";
import { ROUTES } from "lib/constants";
import { S3Service } from "modules/s3/s3.service";
import { UploadService } from "../upload/upload.service";

@Controller(ROUTES.DELETE)
export class DeleteController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly s3Service: S3Service
  ) {}

  @Get(":id")
  async deleteFile(@Param("id") id: string, @Response() res: EResponse) {
    return process.env.UPLOADER === "s3"
      ? this.s3Service.deleteFile(id, res)
      : this.uploadService.deleteFile(id, res);
  }
}
