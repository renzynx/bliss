import { randomString } from "./../libs/functions";
import { Context, CreateInvite, User, UserResponse } from "../libs/types";
import { Resolver, Query, Arg, Ctx, Mutation } from "type-graphql";
import * as argon from "argon2";
import { COOKIE_NAME, INVITE_PREFIX } from "../libs/constants";
import logger from "../libs/logger";

@Resolver()
export class UserResolver {
	@Query(() => User, { nullable: true })
	me(@Ctx() { req, prisma }: Context) {
		if (!req.session.userId) return null;
		return prisma.user.findUnique({ where: { id: req.session.userId }, include: { files: true, urls: true, invites: true } });
	}

	@Mutation(() => CreateInvite, { nullable: true })
	async createInvite(@Ctx() { redis, prisma, req }: Context): Promise<CreateInvite | null> {
		const invite = randomString(16);
		const expires = Date.now() + 1000 * 60 * 60 * 24;

		const ok = await redis.set(`${INVITE_PREFIX}${invite}`, invite, "ex", 1000 * 60 * 60 * 24);

		if (!ok) return null;

		await prisma.invite.create({
			data: {
				code: invite,
				uid: req.session.userId,
				expires_at: new Date(expires)
			}
		});

		return { invite, expires };
	}

	@Mutation(() => UserResponse)
	async register(
		@Arg("username") username: string,
		@Arg("password") password: string,
		@Arg("invite") invite: string,
		@Ctx() { req, prisma, redis }: Context
	): Promise<UserResponse> {
		const checkExist = await prisma.user.findUnique({ where: { username } });

		if (checkExist)
			return {
				errors: [
					{
						field: "username",
						message: "Username already exists."
					}
				]
			};

		const checkInvite = await redis.get(`${INVITE_PREFIX}${invite}`);

		if (!checkInvite)
			return {
				errors: [
					{
						field: "invite",
						message: "Invalid invite."
					}
				]
			};

		await redis.del(`${INVITE_PREFIX}${invite}`);

		logger.info("Creating user");

		const user = await prisma.user.create({
			data: {
				username,
				password: await argon.hash(password),
				token: randomString(64)
			}
		});

		logger.info("Creating session");
		req.session.userId = user.id;

		prisma.invite
			.update({
				where: { code: invite },
				data: { used_by: username }
			})
			.then(() => logger.info("Invite updated"))
			.catch((err) => logger.error(`Error updating invite: ${(err as Error).message}`));

		return { user };
	}

	@Mutation(() => UserResponse)
	async login(@Arg("username") username: string, @Arg("password") password: string, @Ctx() { req, prisma }: Context): Promise<UserResponse> {
		const user = await prisma.user.findUnique({ where: { username } });

		if (!user)
			return {
				errors: [
					{
						field: "username",
						message: "Incorrect username."
					}
				]
			};

		const valid = await argon.verify(user.password, password);

		if (!valid)
			return {
				errors: [
					{
						field: "password",
						message: "Incorrect password."
					}
				]
			};

		req.session.userId = user.id;

		logger.info("Logged in");

		return { user };
	}

	@Mutation(() => Boolean)
	async logout(@Ctx() { req, res }: Context): Promise<Boolean> {
		return new Promise((resolve) =>
			req.session.destroy((err) => {
				res.clearCookie(COOKIE_NAME);
				if (err) {
					resolve(false);
					return;
				}
				resolve(true);
			})
		);
	}
}
