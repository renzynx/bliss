import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Request,
  HttpCode,
  Get,
  Query,
  UseGuards,
  Param,
  Response,
  UploadedFiles,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "./upload.service";
import { Request as ERequest, Response as EResponse } from "express";
import { ROUTES } from "lib/constants";
import { AuthGuard } from "modules/auth/guard/auth.guard";

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

  @UseInterceptors(FileInterceptor("file"))
  @HttpCode(200)
  @Post("bulk")
  uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Request() req: ERequest
  ) {
    return this.uploadService.bulkUpload(files, req);
  }

  @UseGuards(AuthGuard)
  @Post("request")
  uploadRequest() {
    return this.uploadService.uploadRequest();
  }

  @UseGuards(AuthGuard)
  @Get("status")
  uploadStatus(@Query("fileId") fileId: string) {
    return this.uploadService.uploadStatus(fileId);
  }
}
