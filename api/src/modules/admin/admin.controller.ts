import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
} from "@nestjs/common";
import { Request as ERequest } from "express";
import { CustomSession } from "lib/types";
import { AuthGuard } from "modules/auth/guard/auth.guard";
import { AdminService } from "./admin.service";

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
}
