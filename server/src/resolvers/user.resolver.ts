import { Context, User, UserResponse } from "../libs/types";
import { Resolver, Query, Arg, Ctx, Mutation } from "type-graphql";
import * as argon from "argon2";
import { COOKIE_NAME } from "../libs/constants";

@Resolver()
export class UserResolver {
	@Query(() => User, { nullable: true })
	me(@Ctx() { req, prisma }: Context) {
		if (!req.session.userId) return null;
		return prisma.user.findUnique({ where: { id: req.session.userId }, include: { files: true, urls: true } });
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
