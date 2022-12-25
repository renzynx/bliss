import {
  Controller,
  Get,
  Param,
  Render,
  Response,
  Request,
  UseGuards,
} from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import { Response as EResponse, Request as ERequest } from "express";
import { AuthGuard } from "modules/auth/guard/auth.guard";
import { RedisService } from "modules/redis/redis.service";
import { RootService } from "./root.service";

@SkipThrottle()
@Controller()
export class RootController {
  constructor(
    private readonly rootService: RootService,
    private readonly redisService: RedisService
  ) {}

  @Get()
  hello() {
    return "<pre>Hello World!</pre>";
  }

  @Get("server-settings")
  check() {
    return this.redisService.readServerSettings();
  }

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
    return this.rootService.downloadFile(filename, res);
  }
}
