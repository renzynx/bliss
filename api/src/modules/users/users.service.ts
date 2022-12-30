import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { EmbedSettings, File, User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as argon from "argon2";
import { MailService } from "../mail/mail.service";
import { generateUsername } from "unique-username-generator";
import {
  CustomSession,
  findUserOptions,
  IUserService,
  SessionUser,
  UserResponse,
} from "../../lib/types";
import { formatBytes, generateRandomString } from "../../lib/utils";
import { RegisterDTO } from "../auth/dto/register.dto";
import { PrismaService } from "../prisma/prisma.service";
import { Request } from "express";
import md5 from "md5";
import { RedisService } from "modules/redis/redis.service";
import { Redis } from "ioredis";
import {
  CONFIRM_EMAIL_PREFIX,
  FORGOT_PASSWORD_PREFIX,
  INVITE_PREFIX,
  rootDir,
  uploadDir,
} from "lib/constants";
import { join } from "path";
import { readFile, unlink } from "fs/promises";
import { EmbedSettingDTO } from "./dto/EmbedSettingsDTO";
import cuid from "cuid";
import { existsSync } from "fs";

@Injectable()
export class UsersService implements IUserService {
  private readonly _logger = new Logger(UsersService.name);
  private redis: Redis;
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly redisService: RedisService
  ) {
    this.redis = this.redisService.redis();
  }

  async findUser(
    username_or_email: string,
    { byId, withPassword, totalUsed, withFiles }: findUserOptions = {
      byId: false,
      withPassword: false,
      totalUsed: false,
      withFiles: false,
    }
  ): Promise<(User & { files?: File[] }) | null> {
    if (!username_or_email) {
      throw new BadRequestException("Invalid request");
    }
    let user: User;
    let total: number;

    // get total used space of user

    if (byId) {
      user = await this.prisma.user.findUnique({
        where: {
          id: username_or_email,
        },
        include: {
          files: withFiles,
        },
      });
      if (totalUsed) {
        const tmp = await this.prisma.file.aggregate({
          where: {
            userId: username_or_email,
          },
          _sum: {
            size: true,
          },
        });

        // convert to mb
        total = Math.round(tmp._sum.size / 1000000);
      }
    } else {
      user = await this.prisma.user.findUnique({
        where: username_or_email.includes("@")
          ? { email: username_or_email }
          : { username: username_or_email },
        include: { files: withFiles },
      });

      if (totalUsed) {
        const tmp = await this.prisma.file.aggregate({
          where: {
            userId: user.id,
          },
          _sum: {
            size: true,
          },
        });

        total = Math.round(tmp._sum.size / 1000000);
      }
    }

    !withPassword && delete user.password;

    // @ts-ignore
    if (totalUsed) return { ...user, total };

    return user;
  }

  validateUsername(username: string) {
    if (username.length < 3) {
      throw new BadRequestException({
        errors: [
          {
            field: "username",
            message: "Username must be at least 3 characters long",
          },
        ],
      });
    }
    if (username.length > 20) {
      throw new BadRequestException({
        errors: [
          {
            field: "username",
            message: "Username must be at most 20 characters long",
          },
        ],
      });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      throw new BadRequestException({
        errors: [
          {
            field: "username",
            message: "Username can only contain letters, numbers and _",
          },
        ],
      });
    }
  }

  async validateServerSettings(invite: string): Promise<string | null> {
    const { INVITE_MODE, REGISTRATION_ENABLED } =
      await this.redisService.readServerSettings();
    let inv: string = null;

    if (!REGISTRATION_ENABLED) {
      throw new BadRequestException({
        errors: [
          {
            field: "username",
            message: "Registration is disabled",
          },
          {
            field: "email",
            message: "Registration is disabled",
          },
          {
            field: "password",
            message: "Registration is disabled",
          },
        ],
      });
    }

    if (INVITE_MODE) {
      if (!invite) {
        throw new BadRequestException({
          errors: [
            {
              field: "invite",
              message: "Invite code is required",
            },
          ],
        });
      }

      const inviter = await this.redis.get(INVITE_PREFIX + invite);

      if (!inviter) {
        throw new BadRequestException({
          errors: [
            {
              field: "invite",
              message: "Invalid invite code",
            },
          ],
        });
      }

      inv = inviter;
    }

    return inv;
  }

  async createUser(
    {
      email,
      username,
      password,
      invite,
    }: RegisterDTO & { invite?: string; username?: string | undefined },
    req: Request
  ): Promise<UserResponse> {
    const inviter = await this.validateServerSettings(invite);

    if (username) {
      this.validateUsername(username);
    }

    try {
      const avatarHash = md5(generateRandomString(16) + Date.now().toString());
      const hashedPassword = await argon.hash(password);
      const user = await this.prisma.user.create({
        data: {
          email,
          username: username ? username : generateUsername("_"),
          password: hashedPassword,
          apiKey: generateRandomString(),
          image: `https://avatars.dicebear.com/api/identicon/${avatarHash}.svg`,
          invitedBy: inviter ? inviter : null,
        },
      });
      await this.redis.del(INVITE_PREFIX + invite);

      delete user.password;

      (req.session as CustomSession).userId = user.id;

      return { user };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new BadRequestException({
          errors: [
            {
              field: "email",
              message: "Email or username already taken",
            },
            {
              field: "username",
              message: "Email or username already taken",
            },
          ],
        });
      } else {
        this._logger.error(error.message);
        throw new InternalServerErrorException({
          errors: [
            {
              field: "username",
              message: "Something went wrong in our end, try again later",
            },
            {
              field: "email",
              message: "Something went wrong in our end, try again later",
            },
          ],
        });
      }
    }
  }

  async validateUser(
    username_email: string,
    password: string
  ): Promise<SessionUser> {
    const user = await this.findUser(username_email, { withPassword: true });
    if (!user) return null;
    const valid = await argon.verify(user.password, password);
    if (!valid) return null;
    delete user.password;
    return user;
  }

  async sendVerifyEmail(id: string) {
    const user = await this.findUser(id, { byId: true });

    if (!user) {
      throw new UnauthorizedException("not authorized");
    }

    if (user.emailVerified) {
      throw new BadRequestException("email already verified");
    }
    try {
      const token = generateRandomString(32);

      await this.redis.set(
        CONFIRM_EMAIL_PREFIX + token,
        user.id,
        "EX",
        60 * 60 * 2 // 2 hours
      );

      // read the html file
      const html = await readFile(
        join(rootDir, "templates", "verify.html"),
        "utf8"
      );

      // replace the placeholders with the actual data
      const htmlToSend = html
        .replace(
          /{{url}}/gi,
          `${process.env.CORS_ORIGIN}/verify?token=${token}`
        )
        .replace(/{{username}}/gi, user.username)
        .replace(/{{valid}}/gi, "2 hours");

      await this.mailService
        .createInstance()
        .sendMail(user.email, "Verify your email", htmlToSend);

      return true;
    } catch (error) {
      this._logger.error(error.message);
      throw new InternalServerErrorException("Something went wrong");
    }
  }

  async verifyEmail(token: string) {
    if (!token) {
      return false;
    }

    const varible = CONFIRM_EMAIL_PREFIX + token;

    const check = await this.redis.get(varible);

    if (!check) {
      return false;
    }

    await Promise.all([
      this.prisma.user.update({
        where: { id: check },
        data: { emailVerified: new Date(Date.now()) },
      }),
      this.redis.del(varible),
    ]);

    return true;
  }

  async getEmbedSettings(id: string) {
    return this.prisma.embedSettings.findUnique({ where: { userId: id } });
  }

  async setEmbedSettings(settings: EmbedSettingDTO, id: string) {
    const defaultSettings: Omit<EmbedSettings, "id"> = {
      enabled: false,
      title: null,
      description: null,
      color: null,
      author_name: null,
      author_url: null,
      provider_name: null,
      provider_url: null,
      userId: id,
    };

    // @ts-ignore
    settings.enabled === "false"
      ? (settings.enabled = false)
      : (settings.enabled = true);

    // replace all missing keys with null
    const finalSettings = Object.assign(defaultSettings, settings);

    return this.prisma.embedSettings.upsert({
      where: { userId: id },
      update: { ...finalSettings },
      create: { ...finalSettings, userId: id },
    });
  }

  async getUserFiles(
    req: Request,
    {
      skip,
      take,
      currentPage,
      sort = "newest",
      search = "",
    }: {
      skip: number;
      take: number;
      currentPage: number;
      sort?: string;
      search?: string;
    }
  ) {
    const id = (req.session as CustomSession).userId;
    const user = await this.findUser(id, {
      byId: true,
    });
    if (!user) {
      throw new UnauthorizedException("not authorized");
    }
    const total = await this.prisma.file.count({ where: { userId: id } });

    let finalSkip!: number;
    let finalTake!: number;

    // @ts-ignore
    const pages = take === "all" ? 1 : Math.ceil(total / take);

    //[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    //                          	^^
    // newest
    // 1 to 10 is page 1
    // total = 20, take = 10, skip = 0

    // @ts-ignore
    if (sort === "newest" && take !== "all") {
      // total = 20, take = 10, skip = 0 page: 1
      // total = 20, take = 12, skip = 10 page: 2 error
      // take = total - skip
      if (total - take * currentPage < 0) {
        finalSkip = skip;
        finalTake = total - finalSkip;
      } else {
        finalSkip = total - take * currentPage;
        finalTake = take;
      }
    } else {
      // @ts-ignore
      finalSkip = take === "all" ? 0 : skip;
      // @ts-ignore
      finalTake = take === "all" ? total : take;
    }

    const files = await this.prisma.file
      .findMany({
        where: {
          userId: id,
          OR: [
            { filename: { contains: search } },
            { slug: { contains: search } },
          ],
        },
        skip: finalSkip,
        take: finalTake,
        orderBy: {
          createdAt: sort === "newest" ? "asc" : "desc",
        },
      })
      .then((files) => {
        switch (sort) {
          case "largest":
            files.sort((a, b) => b.size - a.size);
            break;
          case "smallest":
            files.sort((a, b) => a.size - b.size);
            break;
          case "a-z":
            files.sort((a, b) => a.filename.localeCompare(b.filename));
            break;
          case "z-a":
            files.sort((a, b) => b.filename.localeCompare(a.filename));
            break;
          case "newest":
            take !== total && files.reverse();
        }
        return files.map((file) => {
          let albumCover = null;

          if (
            file.mimetype.includes("audio") &&
            existsSync(join(uploadDir, `${file.slug}.jpg`))
          ) {
            const protocol = req.headers["x-forwarded-proto"] || "http";
            const host = req.headers.host;
            albumCover = `${protocol}://${host}/${file.slug}.jpg`;
          }

          return {
            ...file,
            size: formatBytes(file.size),
            albumCover,
          };
        });
      });

    return {
      files,
      totalPages: pages,
      totalFiles: total,
    };
  }

  async changeUsername(old: string, newUsername: string) {
    const user = await this.findUser(old);

    if (!user) {
      throw new UnauthorizedException("not authorized");
    }

    try {
      const { username } = await this.prisma.user.update({
        where: { username: old },
        data: { username: newUsername },
      });

      return username;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new BadRequestException({
          errors: [
            {
              field: "username",
              message: "This username already taken, please try another one",
            },
          ],
        });
      }

      this._logger.error(error.message);

      throw new InternalServerErrorException({
        errors: [
          {
            field: "username",
            message:
              "Something went wrong in our server, please try again later",
          },
        ],
      });
    }
  }

  async changePassword(old: string, newpw: string, id: string) {
    const user = await this.findUser(id, {
      withPassword: true,
      byId: true,
    });

    if (!user) {
      throw new UnauthorizedException("not authorized");
    }

    const valid = await argon.verify(user.password, old);

    if (!valid) {
      throw new BadRequestException({
        errors: [
          {
            field: "password",
            message: "Incorrect password",
          },
        ],
      });
    }

    const password = await argon.hash(newpw);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password },
    });

    return true;
  }

  async wipeFiles(id: string) {
    const files = await this.prisma.file.findMany({ where: { userId: id } });

    const promises = files.map((file) => {
      const ext = file.filename.split(".").pop();
      const filename = `${file.slug}.${ext}`;
      if (file.mimetype.includes("audio")) {
        return Promise.all([
          unlink(join(uploadDir, filename)),
          unlink(join(uploadDir, `${file.slug}.jpg`)),
        ]);
      }
      return unlink(join(uploadDir, filename));
    });

    await Promise.all([
      this.prisma.file.deleteMany({ where: { userId: id } }),
      ...promises,
    ]).catch(() => {});

    return true;
  }

  async deleteAccount(id: string) {
    const user = await this.findUser(id, { byId: true, withFiles: true });

    if (!user) {
      throw new UnauthorizedException("not authorized");
    }

    if (
      user.email === "root@localhost" ||
      user.username === "root" ||
      user.role === "OWNER"
    ) {
      throw new BadRequestException("You cannot delete root account");
    }

    const wiped = await this.wipeFiles(id);

    await this.prisma.user.delete({ where: { id } }).catch(() => {});

    return wiped;
  }

  async sendForgotPasswordEmail(email: string) {
    if (!email) {
      throw new BadRequestException({
        errors: [
          {
            field: "email",
            message: "Email is required",
          },
        ],
      });
    }

    // RFC 5322 Official Standard
    const emailRegex = new RegExp(
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g
    );

    const isEmail = emailRegex.test(email);

    if (!isEmail) {
      throw new BadRequestException({
        errors: [
          {
            field: "email",
            message: "Invalid email",
          },
        ],
      });
    }

    const user = await this.findUser(email);

    if (!user) {
      return true;
    }

    try {
      const token = generateRandomString(64);

      await this.redis.set(
        FORGOT_PASSWORD_PREFIX + token,
        user.id,
        "EX",
        60 * 60 * 2 // 2 hours
      );

      const html = await readFile(
        join(rootDir, "templates", "forgot.html"),
        "utf-8"
      );

      const htmlToSend = html
        .replace(
          /{{url}}/gi,
          `${process.env.CORS_ORIGIN}/auth/forgot-password/${token}`
        )
        .replace(/{{username}}/gi, user.username)
        .replace(/{{valid}}/gi, "2 hours");

      await this.mailService
        .createInstance()
        .sendMail(user.email, "Reset your password", htmlToSend);

      return true;
    } catch (error) {
      this._logger.error(error.message);

      throw new InternalServerErrorException({
        errors: [
          {
            field: "email",
            message:
              "Something went wrong in our server, please try again later",
          },
        ],
      });
    }
  }

  checkToken(token: string) {
    return this.redis.exists(FORGOT_PASSWORD_PREFIX + token);
  }

  async resetPassword(token: string, password: string) {
    const id = await this.redis.get(FORGOT_PASSWORD_PREFIX + token);

    if (!id) {
      throw new BadRequestException({
        errors: [
          {
            field: "password",
            message:
              "Verification token is invalid or expired, please request a new one.",
          },
        ],
      });
    }

    const user = await this.findUser(id, { byId: true });

    if (!user) {
      throw new UnauthorizedException("not authorized");
    }

    const hashedPassword = await argon.hash(password);

    await Promise.all([
      this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      this.redis.del(FORGOT_PASSWORD_PREFIX + token),
    ]);

    return true;
  }

  async regenerateApiKey(id: string) {
    const user = await this.findUser(id, { byId: true });

    if (!user) {
      throw new UnauthorizedException("not authorized");
    }

    const apiKey = cuid();

    await this.prisma.user.update({
      where: { id: user.id },
      data: { apiKey },
    });

    return apiKey;
  }
}
