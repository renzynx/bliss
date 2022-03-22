import { type FileUpload, GraphQLUpload } from "graphql-upload";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { createWriteStream, statSync } from "fs";
import { uploadDir } from "../libs/constants";
import { Context, GraphqlFile, Ids, Upload } from "../libs/types";
import logger from "../libs/logger";
import { unlink } from "fs/promises";
import { randomString } from "../libs/functions";
import { __secure__ } from "../libs/config";

@Resolver()
export class UploadResolver {
	@Mutation(() => Boolean)
	async singleUpload(
		@Arg("file", () => GraphQLUpload)
		{ createReadStream, filename, mimetype }: Upload,
		@Ctx() { prisma, req, tokens, urls }: Context
	) {
		return new Promise((resolve, reject) => {
			console.log(req.headers.authorization);
			const auth = req.headers.authorization;
			if (!auth) return;
			const uid = tokens.get(auth);
			if (!uid) return;
			const gen = randomString(12);
			const ext = filename.split(".").pop();
			createReadStream()
				.pipe(createWriteStream(`${uploadDir}/${gen}.${ext}`))
				.on("finish", async () => {
					urls.set(gen, `${gen}.${ext}`);
					await prisma.file.create({
						data: {
							original_name: filename,
							file_name: `${gen}.${ext}`,
							uid,
							slug: gen,
							mimetype,
							size: statSync(`${uploadDir}/${gen}.${ext}`).size
						}
					});
					return resolve(true);
				})
				.on("error", () => reject(false));
		});
	}

	@Mutation(() => [GraphqlFile], { nullable: true })
	async multipleUpload(
		@Arg("files", () => [GraphQLUpload])
		files: Array<FileUpload>,
		@Ctx() { prisma, req, urls, tokens }: Context
	) {
		const auth = req.headers.authorization;
		if (!auth) return null;
		const token = tokens.get(auth);
		if (!token) return null;
		const promises = files.map(async (file) => {
			const { filename, createReadStream, mimetype } = await file;
			const ext = filename.split(".").pop();
			const generatedName = randomString(12);
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
			return { url: `${__secure__ ? "https" : "http"}://${process.env.CDN_URL}/${generatedName}` };
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
			await unlink(`${uploadDir}/${file.file_name}`);
		});

		await Promise.all(promises);
		return true;
	}
}
