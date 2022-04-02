import type { File } from "@prisma/client";
import express from "express";
import { createReadStream } from "fs";
import path from "path";
import "reflect-metadata";
import "./libs/config";
import { port, __secure__ } from "./libs/config";
import { uploadDir } from "./libs/constants";
import logger from "./libs/logger";
import prisma from "./libs/prisma";
import deleteFile from "./routes/delete";
import upload from "./routes/upload";
export const filedata = new Map<string, File>();

const start = async () => {
	if (!process.env.MYSQL_URL) return logger.error("MYSQL_URL not set");

	const app = express();
	const allFiles = await prisma.file.findMany();
	allFiles.forEach((file) => filedata.set(file.slug, file));

	__secure__ && logger.info("Secure mode enabled");
	process.env.NODE_ENV === "production" && logger.info("Production mode enabled");

	app.set("trust proxy", 1);
	app.use("/upload", upload);
	app.use("/delete", deleteFile);
	app.get("/:image", async (req, res) => {
		const { image } = req.params;
		const filedesc = filedata.get(image);
		if (!filedesc) return res.sendStatus(404);
		res.header("Accept-Ranges", "bytes").header("Content-Length", filedesc.size.toString()).header("Content-Type", filedesc.mimetype);
		return createReadStream(path.join(uploadDir, image)).pipe(res);
	});
	app.use("*", (_req, res) => res.status(404).send("Not Found"));

	app.listen(port, () => logger.info(`Server started on port ${port}`));
};

start().catch((error) => logger.error((error as Error).message));
