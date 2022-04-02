import { Router } from "express";
import { writeFile } from "fs/promises";
import multer from "multer";
import { filedata } from "..";
import { GENERATOR_TYPE, uploadDir } from "../libs/constants";
import { slugGenerator } from "../libs/functions";
import logger from "../libs/logger";
import prisma from "../libs/prisma";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
	try {
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

		filedata.set(file.slug, file);

		logger.info(`User ${user.username} uploaded file ${file.file_name}`);

		return res.json({
			url: `${process.env.SECURE === "true" ? "https" : "http"}://${process.env.CDN_URL}/${generatedName}`,
			delete: `${process.env.SECURE === "true" ? "https" : "http"}://${process.env.CDN_URL}/delete/${generatedName}`
		});
	} catch (error) {
		logger.error((error as Error).message);
		return res.status(500).send("Something went wrong");
	}
});

export default router;
