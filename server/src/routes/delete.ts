import { Router } from "express";
import { unlink } from "fs/promises";
import { join } from "path";
import { uploadDir } from "../libs/constants";
import prisma from "../libs/prisma";

const router = Router();

router.get("/:file", async (req, res) => {
	try {
		const { file } = req.params;

		const exist = await prisma.file.findMany();

		const fileExist = exist.find((f) => f.slug === file);

		if (!fileExist) return res.status(404).send("File not found");

		await Promise.all([prisma.file.delete({ where: { id: fileExist.id } }), unlink(join(uploadDir, fileExist.slug))]);

		return res.sendStatus(200);
	} catch (error) {
		return res.status(500).send(error);
	}
});

export default router;
