import { Router } from "express";
import { randomString } from "../libs/functions";
import { writeFile } from "fs/promises";
import { uploadDir } from "../libs/constants";
import multer from "multer";
import prisma from "../libs/prisma";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
	if (!req.headers.authorization) return res.status(401).send("Unauthorized");

	const { authorization } = req.headers;

	const user = await prisma.user.findUnique({
		where: { token: authorization }
	});

	if (!user) return res.status(401).send("Unauthorized");

	if (!req.file) return res.status(400).send("No file uploaded");

	const { mimetype, buffer, originalname, size } = req.file;

	const generatedName = randomString(12);

	const ext = originalname.split(".").pop();

	await Promise.all([
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

	prisma.$disconnect();

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

		await Promise.all([
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

		return `${process.env.SECURE === "true" ? "https" : "http"}://${process.env.CDN_URL}/${generatedName}`;
	});

	return res.json(await Promise.all(promises));
});

export default router;
