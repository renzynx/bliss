import { bytesToHr, dirSize as directorySize } from "./../libs/functions";
import { Ctx, Query, Resolver } from "type-graphql";
import { Context, Stats } from "../libs/types";
import { uploadDir } from "../libs/constants";

@Resolver()
export class StatResolver {
	@Query(() => Stats)
	async getStats(@Ctx() { prisma }: Context) {
		const [users, files, dirSize] = await Promise.all([prisma.user.count(), prisma.file.count(), directorySize(uploadDir)]);
		const size = bytesToHr(dirSize);

		return {
			users,
			files,
			size
		};
	}
}