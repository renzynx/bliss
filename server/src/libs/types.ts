import type { Session, SessionData } from "express-session";
import type { Request, Response } from "express";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import type { PrismaClient, Prisma } from "@prisma/client";
import type { Redis } from "ioredis";
import type { Stream } from "stream";

export interface Context {
	res: Response;
	req: Request & {
		session: Session & Partial<SessionData> & { userId: number };
	};
	redis: Redis;
	prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;
}

export interface Upload {
	filename: string;
	mimetype: string;
	encoding: string;
	createReadStream: () => Stream;
}

@ObjectType()
export class CreateInvite {
	@Field()
	invite!: string;

	@Field()
	expires!: number;
}

@ObjectType()
export class Stats {
	@Field()
	users!: number;

	@Field()
	files!: number;

	@Field()
	size!: string;
}

@InputType()
export class Ids {
	@Field(() => [Int])
	ids!: number[];
}

@ObjectType()
export class GraphqlFile {
	@Field()
	url!: string;
}

@ObjectType()
export class User {
	@Field()
	id!: number;

	@Field()
	username!: string;

	@Field()
	is_admin!: boolean;

	@Field()
	token!: string;

	@Field(() => [File], { nullable: true })
	files?: File[];

	@Field(() => [Url], { nullable: true })
	urls?: Url[];

	@Field(() => [Invite], { nullable: true })
	invites?: Invite[];
}

@ObjectType()
export class Invite {
	@Field()
	id!: number;

	@Field()
	code!: string;

	@Field()
	created_at!: Date;

	@Field({ nullable: true })
	used_by?: string;

	@Field()
	uid!: number;

	@Field()
	expires_at!: Date;
}

@ObjectType()
export class File {
	@Field()
	id!: number;

	@Field()
	file_name!: string;

	@Field()
	original_name!: string;

	@Field({ defaultValue: "image/png" })
	mimetype!: string;

	@Field()
	slug!: string;

	@Field()
	uploaded_at!: Date;

	@Field()
	views!: number;

	@Field()
	uid!: number;

	@Field()
	size!: number;
}

@ObjectType()
export class Url {
	@Field()
	id!: number;

	@Field()
	destination!: string;

	@Field()
	short!: string;

	@Field()
	created_at!: string;

	@Field()
	password!: string;

	@Field()
	views!: number;

	@Field()
	uid!: number;
}

@ObjectType()
export class FieldError {
	@Field()
	field!: string;

	@Field()
	message!: string;
}

@ObjectType()
export class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => User, { nullable: true })
	user?: User;
}
