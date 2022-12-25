import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Query,
  Delete,
} from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import { Request as ERequest } from "express";
import { CustomSession, UpdateUsers } from "lib/types";
import { AuthGuard } from "modules/auth/guard/auth.guard";
import { AdminService } from "./admin.service";

@SkipThrottle()
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AuthGuard)
  @Post("server-settings")
  updateServerSettings(
    @Body()
    data: {
      REGISTRATION_ENABLED: boolean;
      INVITE_MODE: boolean;
    },
    @Request() req: ERequest
  ) {
    return this.adminService.changeServerSettings(
      data,
      (req.session as CustomSession).userId
    );
  }

  @UseGuards(AuthGuard)
  @Get("invites")
  getInvites(@Request() req: ERequest) {
    return this.adminService.getInvites((req.session as CustomSession).userId);
  }

  @UseGuards(AuthGuard)
  @Post("invites")
  createInvite(@Request() req: ERequest) {
    return this.adminService.createInvite(
      (req.session as CustomSession).userId
    );
  }

  @UseGuards(AuthGuard)
  @Get("users")
  getUsers(
    @Request() req: ERequest,
    @Query("skip") skip: string,
    @Query("take") take: string,
    @Query("search") search?: string
  ) {
    return this.adminService.getUsers(
      (req.session as CustomSession).userId,
      +skip,
      +take,
      search
    );
  }

  @UseGuards(AuthGuard)
  @Post("users")
  updateUsers(@Body() data: UpdateUsers[], @Request() req: ERequest) {
    return this.adminService.updateUsers(
      (req.session as CustomSession).userId,
      data
    );
  }

  @UseGuards(AuthGuard)
  @Delete("purge-files")
  purgeFiles(@Request() req: ERequest, @Query("user") user: string) {
    return this.adminService.purgeUserFiles(
      (req.session as CustomSession).userId,
      user
    );
  }
}
