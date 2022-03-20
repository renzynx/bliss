import { type FileUpload, GraphQLUpload } from "graphql-upload";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { createWriteStream, statSync } from "fs";
import { uploadDir } from "../libs/constants";
import { Context, GraphqlFile, Ids } from "../libs/types";
import logger from "../libs/logger";
import { unlink } from "fs/promises";
import { randomString } from "../libs/functions";
import { __secure__ } from "../libs/config";

@Resolver()
export class UploadResolver {
	@Mutation(() => GraphqlFile)
	async singleUpload(
		@Arg("file", () => GraphQLUpload)
		{ createReadStream, filename, mimetype }: FileUpload,
		@Ctx() { prisma, req }: Context
	) {
		const ext = filename.split(".").pop();
		const generatedName = randomString();
		const slug = `${generatedName}.${ext}`;
		createReadStream()
			.pipe(createWriteStream(`${uploadDir}/${slug}`))
			.on("finish", async () => {
				await prisma.file.create({
					data: {
						file_name: generatedName,
						mimetype,
						original_name: filename,
						slug,
						uid: req.session.userId,
						size: statSync(`${uploadDir}/${slug}`).size
					}
				});
			})
			.on("error", (err) => {
				logger.error(err.message);
			});
		return { url: `http://localhost:42069/${slug}` };
	}

	@Mutation(() => [GraphqlFile], { nullable: true })
	async multipleUpload(
		@Arg("files", () => [GraphQLUpload])
		files: Array<FileUpload>,
		@Ctx() { prisma, req, urls }: Context
	) {
		const auth = req.headers.authorization;
		if (!auth) return null;
		const token = await prisma.user.findFirst({ where: { token: auth, id: req.session.userId } });
		if (!token) return null;
		const promises = files.map(async (file) => {
			const { filename, createReadStream, mimetype } = await file;
			const ext = filename.split(".").pop();
			const generatedName = randomString();
			urls.set(generatedName, `${generatedName}.${ext}`);
			createReadStream()
				.pipe(createWriteStream(`${uploadDir}/${generatedName}.${ext}`))
				.on("finish", async () => {
					await prisma.file.create({
						data: {
							original_name: filename,
							file_name: `${generatedName}.${ext}`,
							uid: req.session.userId,
							slug: generatedName,
							mimetype,
							size: statSync(`${uploadDir}/${generatedName}.${ext}`).size
						}
					});
				})
				.on("error", (err) => logger.error(err.message));
			return { url: `${process.env.CDN_URL}/${generatedName}` };
		});
		return Promise.all(promises);
	}

	@Mutation(() => Boolean)
	async deleteFile(@Arg("ids") ids: Ids, @Ctx() { prisma }: Context) {
		const files = await prisma.file.findMany({
			where: {
				id: {
					in: ids.ids
				}
			}
		});

		if (!files) return false;

		const promises = files.map(async (file) => {
			await prisma.file.delete({
				where: {
					id: file.id
				}
			});
			await unlink(`${uploadDir}/${file.file_name}.${file.original_name.split(".").pop()}`);
		});

		await Promise.all(promises);
		return true;
	}
}
