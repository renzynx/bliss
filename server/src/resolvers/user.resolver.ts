import { randomString } from "./../libs/functions";
import { Context, CreateInvite, User, UserResponse } from "../libs/types";
import { Resolver, Query, Arg, Ctx, Mutation } from "type-graphql";
import * as argon from "argon2";
import { COOKIE_NAME, INVITE_PREFIX } from "../libs/constants";

@Resolver()
export class UserResolver {
	@Query(() => User, { nullable: true })
	me(@Ctx() { req, prisma }: Context) {
		if (!req.session.userId) return null;
		return prisma.user.findUnique({ where: { id: req.session.userId }, include: { files: true, urls: true } });
	}

	@Mutation(() => CreateInvite, { nullable: true })
	async createInvite(@Ctx() { redis, prisma, req }: Context): Promise<CreateInvite | null> {
		const invite = randomString();
		const expires = Date.now() + 1000 * 60 * 60 * 24;

		const code = await redis.set(`${INVITE_PREFIX}${invite}`, invite, "ex", 1000 * 60 * 60 * 24);

		if (!code) return null;

		await prisma.invite.create({
			data: {
				code,
				uid: req.session.userId
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
		const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

		if (format.test(username))
			return {
				errors: [
					{
						field: "username",
						message: "Username contains invalid characters."
					}
				]
			};

		if (password.length < 3)
			return {
				errors: [
					{
						field: "password",
						message: "Password must be at least 3 characters."
					}
				]
			};

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

		const hashedPassword = await argon.hash(password);

		const user = await prisma.user.create({
			data: {
				username,
				password: hashedPassword,
				token: randomString()
			}
		});

		req.session.userId = user.id;

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
