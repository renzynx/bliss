import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { SessionData } from 'express-session';
import { LoginDTO } from '../auth/dto/login.dto';
import { RegisterDTO } from '../auth/dto/register.dto';
import { ROUTES, SLUG_TYPE } from '../lib/constants';
import { AuthService } from '../auth/auth.service';
import { Response, Request } from 'express';
import { AuthGuard } from './auth.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { ChangePasswordDTO } from './dto/change-password.dto';

@Controller(ROUTES.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Get('stats')
  stats() {
    return this.authService.getStats();
  }

  @SkipThrottle()
  @UseGuards(AuthGuard)
  @Get('me')
  me(@Session() session: SessionData) {
    if (!session.userId) throw new BadRequestException('Unauthorized');
    return this.authService.me(session.userId);
  }

  @UseGuards(AuthGuard)
  @Post('slug')
  slug(@Body() { slug }: { slug: SLUG_TYPE }, @Session() session: SessionData) {
    return this.authService.updateSlugType(slug, session.userId);
  }

  @UseGuards(AuthGuard)
  @Get('sharex')
  getConfig(@Session() { userId }: SessionData) {
    return this.authService.getShareXUploadConfig(userId);
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  changePassword(
    @Body()
    { old_password, new_password }: ChangePasswordDTO,
    @Session() { userId }: SessionData
  ) {
    return this.authService.changePassword(userId, old_password, new_password);
  }

  @UseGuards(AuthGuard)
  @Get('reset-token')
  resetToken(@Session() session: SessionData) {
    return this.authService.resetToken(session.userId);
  }

  @SkipThrottle()
  @UseGuards(AuthGuard)
  @Get('files')
  async files(
    @Session() session: SessionData,
    @Query('page') page: number,
    @Query('limit') limit = 15
  ) {
    return this.authService.files(session.userId, page, limit);
  }

  @Post('login')
  async login(
    @Body() { username_email, password }: LoginDTO,
    @Session() session: SessionData
  ) {
    const res = await this.authService.login(username_email, password);
    if (res.error)
      return {
        error: res.error,
      };
    session.userId = res.user.id;
    return { user: res.user };
  }

  @Post('register')
  async register(
    @Body() { email, username, password }: RegisterDTO,
    @Session() session: SessionData
  ) {
    if (!username || !password) throw new BadRequestException('Missing fields');
    const res = await this.authService.register(username, password, email);
    if (res.error) throw new BadRequestException(res.error);
    session.userId = res.user.id;
    return res.user;
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  logout(@Res() res: Response, @Req() req: Request) {
    return this.authService.logout(req, res);
  }
}
