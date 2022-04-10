import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionData } from 'express-session';
import { LoginDTO } from '../auth/dto/login.dto';
import { RegisterDTO } from '../auth/dto/register.dto';
import { ROUTES } from '../lib/constants';
import { AuthService } from '../auth/auth.service';

@Controller(ROUTES.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('me')
  me(@Session() session: SessionData) {
    if (!session.userId) throw new UnauthorizedException('Unauthorized');
    return this.authService.me(session.userId);
  }

  @Post('login')
  async login(
    @Body() { username_email, password }: LoginDTO,
    @Session() session: SessionData
  ) {
    const res = await this.authService.login(username_email, password);
    if (res.error) throw new BadRequestException(res.error);
    session.userId = res.user.id;
    return res.user;
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
}
