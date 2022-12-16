import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
  Request,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Request as ERequest } from "express";
import { ROUTES } from "lib/constants";
import { CustomSession } from "lib/types";
import { HttpExceptionFilter } from "modules/auth/auth.http-filter";
import { AuthGuard } from "modules/auth/guard/auth.guard";
import { ChangePasswordDTO } from "./dto/ChangePasswordDTO";
import { ChangeUsernameDTO } from "./dto/ChangeUsernameDTO";
import { EmbedSettingDTO } from "./dto/EmbedSettingsDTO";
import { UsersService } from "./users.service";

@Controller(ROUTES.USERS)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Post("verify/send")
  async sendVerifyMail(@Request() req: ERequest) {
    return this.usersService.sendVerifyEmail(
      (req.session as CustomSession).userId
    );
  }

  @UseGuards(AuthGuard)
  @Post("verify")
  async verifyEmail(@Body() { token }: { token: string }) {
    return this.usersService.verifyEmail(token);
  }

  @UseGuards(AuthGuard)
  @Get("files")
  async getFiles(
    @Request() req: ERequest,
    @Query("skip") skip: string,
    @Query("take") take: string,
    @Query("currentPage") currentPage: string,
    @Query("sort") sort?: string,
    @Query("search") search?: string
  ) {
    return this.usersService.getUserFiles(
      (req.session as CustomSession).userId,
      {
        skip: +skip,
        take: take === "all" ? "all" : +take,
        currentPage: +currentPage,
        sort,
        search,
      }
    );
  }

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseFilters(new HttpExceptionFilter())
  @Put("embed-settings")
  async updateEmbedSettings(
    @Request() req: ERequest,
    @Body() body: EmbedSettingDTO
  ) {
    return this.usersService.setEmbedSettings(
      body,
      (req.session as CustomSession).userId
    );
  }

  @UseGuards(AuthGuard)
  @Get("embed-settings")
  async getEmbedSettings(@Request() req: ERequest) {
    return this.usersService.getEmbedSettings(
      (req.session as CustomSession).userId
    );
  }

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseFilters(new HttpExceptionFilter())
  @Put("change-password")
  async changePassword(
    @Request() req: ERequest,
    @Body()
    { password, newPassword }: ChangePasswordDTO
  ) {
    return this.usersService.changePassword(
      password,
      newPassword,
      (req.session as CustomSession).userId
    );
  }

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseFilters(new HttpExceptionFilter())
  @Put("change-username")
  async changeUsername(
    @Body()
    { username, newUsername }: ChangeUsernameDTO
  ) {
    return this.usersService.changeUsername(username, newUsername);
  }
}