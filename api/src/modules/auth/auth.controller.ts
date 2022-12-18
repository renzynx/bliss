import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Request,
  Response,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Request as ERequest, Response as EResponse } from "express";
import { CustomSession } from "lib/types";
import { ROUTES } from "../../lib/constants";
import { HttpExceptionFilter } from "./auth.http-filter";
import { AuthService } from "./auth.service";
import { LoginDTO } from "./dto/login.dto";
import { RegisterDTO } from "./dto/register.dto";
import { AuthGuard } from "./guard/auth.guard";

@Controller(ROUTES.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseFilters(new HttpExceptionFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post("register")
  async register(
    @Body()
    data: RegisterDTO,
    @Request() req: ERequest
  ) {
    return this.authService.register(data, req);
  }

  @UseFilters(new HttpExceptionFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(200)
  @Post("login")
  async login(@Body() data: LoginDTO, @Request() req: ERequest) {
    return this.authService.login(data, req);
  }

  @UseGuards(AuthGuard)
  @Delete("logout")
  logout(@Request() req: ERequest, @Response() res: EResponse) {
    return this.authService.logout(req, res);
  }

  @UseGuards(AuthGuard)
  @Get("me")
  async me(@Request() req: ERequest) {
    return this.authService.me((req.session as CustomSession).userId);
  }
}
