import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { randomString } from "../libs/functions";
import { writeFile } from "fs/promises";
import { uploadDir } from "../libs/constants";
import multer from "multer";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
	if (!req.headers.authorization) return res.status(401).send("Unauthorized");

	const { authorization } = req.headers;

	const prisma = new PrismaClient();

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

	return res.json({
		url: `${process.env.SECURE === "true" ? "https" : "http"}://${process.env.CDN_URL}/files/${generatedName}`
	});
});

export default router;
