import {
  Controller,
  Get,
  Param,
  Render,
  Response,
  UseGuards,
} from "@nestjs/common";
import { Response as EResponse } from "express";
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
  file(@Param("slug") slug: string) {
    return this.rootService.getFile(slug);
  }

  @Get("d/:filename")
  thumbnail(@Param("filename") filename: string, @Response() res: EResponse) {
    return this.rootService.getThumbnail(filename, res);
  }
}
