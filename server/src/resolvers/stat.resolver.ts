import { bytesToHr, dirSize } from "./../libs/functions";
import { Ctx, Query, Resolver } from "type-graphql";
import { Context, Stats } from "../libs/types";
import { uploadDir } from "../libs/constants";

@Resolver()
export class StatResolver {
	@Query(() => Stats)
	async getStats(@Ctx() { prisma }: Context) {
		const [users, files, dirSiz] = await Promise.all([prisma.user.count(), prisma.file.count(), dirSize(uploadDir)]);

		const size = bytesToHr(dirSiz);

		return {
			users,
			files,
			size
		};
	}
}
