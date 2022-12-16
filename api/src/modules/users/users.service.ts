import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { EmbedSettings, User } from "@prisma/client";
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
import {
  formatBytes,
  generateApiKey,
  readServerSettings,
} from "../../lib/utils";
import { RegisterDTO } from "../auth/dto/register.dto";
import { PrismaService } from "../prisma/prisma.service";
import { Request } from "express";
import md5 from "md5";

@Injectable()
export class UsersService implements IUserService {
  private readonly _logger = new Logger(UsersService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService
  ) {}

  async findUser(
    username_or_email: string,
    { byId, withPassword }: findUserOptions = {
      byId: false,
      withPassword: false,
    }
  ): Promise<User | null> {
    let user: User | null;
    if (byId) {
      user = await this.prisma.user.findUnique({
        where: {
          id: username_or_email,
        },
      });
    } else {
      user = await this.prisma.user.findUnique({
        where: username_or_email.includes("@")
          ? { email: username_or_email }
          : { username: username_or_email },
      });
    }

    !withPassword && delete user.password;
    return user;
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
    const { INVITE_MODE, REGISTRATION_ENABLED } = await readServerSettings();
    let inv: string | null = null;

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

    if (username) {
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

      const inviteCode = await this.prisma.verificationToken.findUnique({
        where: {
          token: invite,
        },
      });

      if (!inviteCode || inviteCode.type !== "INVITE_CODE") {
        throw new BadRequestException({
          errors: [
            {
              field: "invite",
              message: "Invalid invite code",
            },
          ],
        });
      }

      inv = inviteCode.identifier;
      await this.prisma.verificationToken.delete({ where: { token: invite } });
    }

    try {
      const avatarHash = md5(email.trim().toLowerCase());
      const hashedPassword = await argon.hash(password);
      const user = await this.prisma.user.create({
        data: {
          email,
          username: username ? username : generateUsername("_"),
          password: hashedPassword,
          apiKey: generateApiKey(),
          image: `https://www.gravatar.com/avatar/${avatarHash}`,
          invitedBy: inv ? inv : null,
        },
      });
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
      const { token } = await this.prisma.verificationToken.create({
        data: {
          expires: new Date(Date.now() + 60 * 2),
          identifier: id,
          token: generateApiKey(),
        },
      });

      await this.mailService.createInstance().sendMail(
        user.email,
        "Verify your email",
        `
				<html>
					<p>
					Click this <a href="${process.env.CORS_ORIGIN}/verify?token=${token}">link</a> to verify your email.
					</p>
				</html>
      	`
      );

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

    const check = await this.prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!check) {
      return false;
    }

    await Promise.all([
      this.prisma.user.update({
        where: { id: check.identifier },
        data: { emailVerified: new Date(Date.now()) },
      }),
      this.prisma.verificationToken.deleteMany({
        where: { identifier: check.identifier, type: "EMAIL_VERIFICATION" },
      }),
    ]);

    return true;
  }

  async getEmbedSettings(id: string) {
    return this.prisma.embedSettings.findUnique({ where: { userId: id } });
  }

  async setEmbedSettings(
    settings: Omit<EmbedSettings, "id" | "userId">,
    id: string
  ) {
    // @ts-ignore
    settings.enabled === "false"
      ? (settings.enabled = false)
      : (settings.enabled = true);
    return this.prisma.embedSettings.upsert({
      where: { userId: id },
      create: { ...settings, userId: id },
      update: { ...settings, userId: id },
    });
  }

  async getUserFiles(
    id: string,
    {
      skip,
      take,
      currentPage,
      sort = "newest",
      search = "",
    }: {
      skip: number;
      take: number | "all";
      currentPage: number;
      sort?: string;
      search?: string;
    }
  ) {
    // const user = await this.findUser(id, { byId: true });
    // if (!user) {
    //   throw new UnauthorizedException("not authorized");
    // }
    const total = await this.prisma.file.count({
      where: {
        userId: id,
      },
    });

    if (take === "all") {
      const files = await this.prisma.file.findMany({
        where: {
          userId: id,
          filename: {
            contains: search,
          },
          slug: {
            contains: search,
          },
        },
        orderBy: {
          createdAt: sort === "newest" ? "desc" : "asc",
        },
      });

      return {
        files,
        totalFiles: total,
        pages: 1,
      };
    }

    const pages = Math.ceil(total / take);

    //[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    //                          	^^
    // newest
    // 1 to 10 is page 1
    // total = 20, take = 10, skip = 0

    let finalSkip!: number;
    let finalTake!: number;

    if (sort === "newest") {
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
      finalSkip = skip;
      finalTake = take;
    }

    if (search) {
      const files = await this.prisma.file
        .findMany({
          where: {
            userId: id,
            OR: [
              {
                filename: {
                  contains: search,
                },
              },
              {
                slug: {
                  contains: search,
                },
              },
            ],
          },
          orderBy: {
            createdAt: sort === "oldest" ? "asc" : "desc",
          },
        })
        .then((files) => {
          if (sort === "largest") {
            return files.sort((a, b) => b.size - a.size);
          } else if (sort === "smallest") {
            return files.sort((a, b) => a.size - b.size);
          } else if (sort === "a-z") {
            return files.sort((a, b) => a.filename.localeCompare(b.filename));
          } else if (sort === "z-a") {
            return files.sort((a, b) => b.filename.localeCompare(a.filename));
          }
          return files.map((file) => ({
            ...file,
            size: formatBytes(file.size),
          }));
        });

      return {
        files,
        totalFiles: files.length,
        totalPages: 1,
      };
    }

    const files = await this.prisma.file
      .findMany({
        where: {
          userId: id,
        },
        skip: finalSkip,
        take: finalTake,
        orderBy: {
          createdAt: sort === "oldest" ? "asc" : "desc",
        },
      })
      .then((files) => {
        if (sort === "largest") {
          files.sort((a, b) => b.size - a.size);
        } else if (sort === "smallest") {
          files.sort((a, b) => a.size - b.size);
        } else if (sort === "a-z") {
          files.sort((a, b) => a.filename.localeCompare(b.filename));
        } else if (sort === "z-a") {
          files.sort((a, b) => b.filename.localeCompare(a.filename));
        }
        return files.map((file) => ({
          ...file,
          size: formatBytes(file.size),
        }));
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
        where: {
          username: old,
        },
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
}
