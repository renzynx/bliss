import { Router } from "express";
import { randomString, slugGenerator } from "../libs/functions";
import { writeFile } from "fs/promises";
import { GENERATOR_TYPE, uploadDir } from "../libs/constants";
import multer from "multer";
import prisma from "../libs/prisma";
import { filedata } from "..";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
	if (!req.headers.authorization) return res.status(401).send("Unauthorized");

	const { authorization, type } = req.headers;

	const user = await prisma.user.findUnique({
		where: { token: authorization }
	});

	if (!user) return res.status(401).send("Unauthorized");

	if (!req.file) return res.status(400).send("No file uploaded");

	const { mimetype, buffer, originalname, size } = req.file;

	const generatedName =
		type === "zws"
			? slugGenerator(12, GENERATOR_TYPE.ZEROWIDTH)
			: type === "emoji"
			? slugGenerator(12, GENERATOR_TYPE.EMOJI)
			: slugGenerator(12, GENERATOR_TYPE.TEXT);

	const ext = originalname.split(".").pop();

	const [file] = await Promise.all([
		await prisma.file.create({
			data: {
				original_name: originalname,
				file_name: `${generatedName}.${ext}`,
				uid: user.id,
				slug: generatedName,
				mimetype,
				size: size
			}
		}),
		await writeFile(`${uploadDir}/${generatedName}`, buffer)
	]);

	filedata.set(file.slug, file);

	return res.json({
		url: `${process.env.SECURE === "true" ? "https" : "http"}://${process.env.CDN_URL}/${generatedName}`,
		delete: `${process.env.SECURE === "true" ? "https" : "http"}://${process.env.CDN_URL}/delete/${generatedName}`
	});
});

router.post("/multiple", upload.array("files"), async (req, res) => {
	if (!req.headers.authorization) return res.status(401).send("Unauthorized");

	const { authorization } = req.headers;

	const user = await prisma.user.findUnique({
		where: { token: authorization }
	});

	if (!user) return res.status(401).send("Unauthorized");

	if (!req.files) return res.status(400).send("No files uploaded");

	const promises = (req.files as Express.Multer.File[]).map(async (file) => {
		const { mimetype, buffer, originalname, size } = file;

		const generatedName = randomString(12);

		const ext = originalname.split(".").pop();

		const [created] = await Promise.all([
			prisma.file.create({
				data: {
					original_name: originalname,
					file_name: `${generatedName}.${ext}`,
					uid: user.id,
					slug: generatedName,
					mimetype,
					size: size
				}
			}),
			writeFile(`${uploadDir}/${generatedName}`, buffer)
		]);

		filedata.set(created.slug, created);

		return `${process.env.SECURE === "true" ? "https" : "http"}://${process.env.CDN_URL}/${generatedName}`;
	});

	return res.json(await Promise.all(promises));
});

export default router;
