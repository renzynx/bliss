import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { CustomSession, UserResponse } from "../../lib/types";
import { UsersService } from "../users/users.service";
import { LoginDTO } from "./dto/login.dto";
import { RegisterDTO } from "./dto/register.dto";
import argon from "argon2";
import { Request, Response } from "express";
import { COOKIE_NAME } from "../../lib/constants";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly usersService: UsersService) {}

  async me(id: string) {
    const user = await this.usersService.findUser(id, {
      byId: true,
      totalUsed: true,
    });
    if (user.disabled) {
      throw new ForbiddenException();
    }
    return user;
  }

  async login(data: LoginDTO, req: Request): Promise<UserResponse> {
    const user = await this.usersService.findUser(data.username_email, {
      withPassword: true,
    });

    if (!user) {
      throw new BadRequestException({
        errors: [
          {
            field: "username_email",
            message: "Invalid username or email",
          },
          {
            field: "password",
            message: "Invalid password",
          },
        ],
      });
    }

    const valid = await argon.verify(user.password, data.password);

    if (!valid) {
      throw new BadRequestException({
        errors: [
          {
            field: "username_email",
            message: "Invalid username or email",
          },
          {
            field: "password",
            message: "Invalid password",
          },
        ],
      });
    }

    if (user.disabled) {
      throw new ForbiddenException({
        errors: [
          {
            field: "username_email",
            message: "Your account has been disabled",
          },
        ],
      });
    }

    delete user.password;

    (req.session as CustomSession).userId = user.id;

    return { user };
  }

  async register(data: RegisterDTO, req: Request) {
    return this.usersService.createUser(data, req);
  }

  async logout(req: Request, res: Response) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          this.logger.error(err.message);
          resolve(false);
          return;
        }
        resolve(true);
        res.end();
      })
    );
  }
}
