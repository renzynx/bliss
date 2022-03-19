import { bytesToHr, dirSize } from "./../libs/functions";
import { Ctx, Query, Resolver } from "type-graphql";
import { Context, Stats } from "../libs/types";
import { uploadDir } from "../libs/constants";

@Resolver()
export class StatResolver {
	@Query(() => Stats)
	async getStats(@Ctx() { prisma }: Context) {
		const files = await prisma.file.count();
		const bytes = await dirSize(uploadDir);
		const size = bytesToHr(bytes);

		return {
			files,
			size
		};
	}
}
