import { Role, User } from "@prisma/client";
import { Request } from "express";
import { Session, SessionData } from "express-session";
import { RegisterDTO } from "modules/auth/dto/register.dto";

export interface FieldError {
  field: string;
  message: string;
}

export interface UserResponse {
  errors?: FieldError[];
  user?: SessionUser;
}

export interface findUserOptions {
  byId?: boolean;
  withPassword?: boolean;
  withFiles?: boolean;
  totalUsed?: boolean;
}

export interface IUserService {
  findUser(
    username_or_email: string,
    options: findUserOptions
  ): Promise<SessionUser | null>;
  validateUser(username: string, password: string): Promise<SessionUser | null>;
  createUser(data: RegisterDTO, req: Request): Promise<UserResponse>;
}

export type SessionUser = Omit<User, "password">;

export interface NormalError {
  statusCode: number;
  message: string[];
  error: string;
}

export type CustomSession = Session &
  Partial<SessionData> & {
    userId: string;
  };

export interface ServerSettings {
  REGISTRATION_ENABLED: boolean;
  INVITE_MODE: boolean;
}

export interface UpdateUsers {
  id: string;
  role: Role;
  disabled: boolean;
  uploadLimit: number;
}
