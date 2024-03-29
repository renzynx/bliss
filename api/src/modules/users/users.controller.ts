import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Request,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { SkipThrottle, Throttle } from "@nestjs/throttler";
import { Request as ERequest } from "express";
import { ROUTES } from "lib/constants";
import { CustomSession } from "lib/types";
import { HttpExceptionFilter } from "modules/auth/auth.http-filter";
import { AuthGuard } from "modules/auth/guard/auth.guard";
import { ChangePasswordDTO } from "./dto/ChangePasswordDTO";
import { ChangeUsernameDTO } from "./dto/ChangeUsernameDTO";
import { EmbedSettingDTO } from "./dto/EmbedSettingsDTO";
import { ResetPasswordDTO } from "./dto/ResetPasswordDTO";
import { UsersService } from "./users.service";

@SkipThrottle()
@Controller(ROUTES.USERS)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @SkipThrottle(false)
  @UseGuards(AuthGuard)
  @Post("verify/send")
  sendVerifyMail(@Request() req: ERequest) {
    return this.usersService.sendVerifyEmail(
      (req.session as CustomSession).userId
    );
  }

  @UseGuards(AuthGuard)
  @Post("verify")
  verifyEmail(@Body() { token }: { token: string }) {
    return this.usersService.verifyEmail(token);
  }

  @SkipThrottle(false)
  @Post("forgot-password")
  forgotPassword(@Body() { email }: { email: string }) {
    return this.usersService.sendForgotPasswordEmail(email);
  }

  @SkipThrottle(false)
  @Post("check-token")
  checkToken(@Body() { token }: { token: string }) {
    return this.usersService.checkToken(token);
  }

  @UseFilters(new HttpExceptionFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post("reset-password")
  resetPassword(@Body() { token, password }: ResetPasswordDTO) {
    return this.usersService.resetPassword(token, password);
  }

  @UseGuards(AuthGuard)
  @Get("files")
  getFiles(
    @Request() req: ERequest,
    @Query("skip") skip: string,
    @Query("take") take: string,
    @Query("currentPage") currentPage: string,
    @Query("sort") sort?: string,
    @Query("search") search?: string
  ) {
    return this.usersService.getUserFiles(req, {
      skip: +skip,
      // @ts-ignore
      take: take === "all" ? "all" : +take,
      currentPage: +currentPage,
      sort,
      search,
    });
  }

  @UseGuards(AuthGuard)
  @UseFilters(new HttpExceptionFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  @Put("embed-settings")
  updateEmbedSettings(@Request() req: ERequest, @Body() body: EmbedSettingDTO) {
    return this.usersService.setEmbedSettings(
      body,
      (req.session as CustomSession).userId
    );
  }

  @UseGuards(AuthGuard)
  @Get("embed-settings")
  getEmbedSettings(@Request() req: ERequest) {
    return this.usersService.getEmbedSettings(
      (req.session as CustomSession).userId
    );
  }

  @SkipThrottle(false)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseFilters(new HttpExceptionFilter())
  @Put("change-password")
  changePassword(
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

  @SkipThrottle(false)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseFilters(new HttpExceptionFilter())
  @Put("change-username")
  changeUsername(
    @Body()
    { username, newUsername }: ChangeUsernameDTO
  ) {
    return this.usersService.changeUsername(username, newUsername);
  }

  @SkipThrottle(false)
  @Throttle(1, 300)
  @UseGuards(AuthGuard)
  @Put("regenerate-api-key")
  regnerateApiKey(@Request() req: ERequest) {
    return this.usersService.regenerateApiKey(
      (req.session as CustomSession).userId
    );
  }

  @UseGuards(AuthGuard)
  @Delete("delete-account")
  deleteAccount(@Request() req: ERequest) {
    return this.usersService.deleteAccount(
      (req.session as CustomSession).userId
    );
  }

  @UseGuards(AuthGuard)
  @Delete("wipe-files")
  wipeFiles(@Request() req: ERequest) {
    return this.usersService.wipeFiles((req.session as CustomSession).userId);
  }
}
