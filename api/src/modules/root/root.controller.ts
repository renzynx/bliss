import {
  Controller,
  Get,
  Param,
  Render,
  Response,
  Request,
  UseGuards,
} from "@nestjs/common";
import { Response as EResponse, Request as ERequest } from "express";
import { AuthGuard } from "modules/auth/guard/auth.guard";
import { RootService } from "./root.service";

@Controller()
export class RootController {
  constructor(private readonly rootService: RootService) {}

  @UseGuards(AuthGuard)
  @Get("statistics")
  getStats() {
    return this.rootService.getStatistics();
  }

  @Get(":slug")
  @Render("index")
  file(@Param("slug") slug: string, @Request() req: ERequest) {
    return this.rootService.getFile(slug, req);
  }

  @Get("d/:filename")
  thumbnail(@Param("filename") filename: string, @Response() res: EResponse) {
    return this.rootService.getThumbnail(filename, res);
  }
}
