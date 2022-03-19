import { PrismaClient } from "@prisma/client";
import * as argon from "argon2";
import logger from "./logger";

const setup = async () => {
	const client = new PrismaClient();
	logger.info("Connecting to MYSQL...");

	const count = await client.user.count();

	if (count > 0) return logger.error("You already run this setup script, you don't need to run it again");

	logger.info("Creating admin user...");

	const plainPassword = gen();
	const hashedPassword = await argon.hash(plainPassword);

	await client.user.create({
		data: {
			username: "admin",
			password: hashedPassword,
			token: Buffer.from(gen()).toString("base64"),
			is_admin: true
		}
	});

	return logger.info(`Created user with username: "admin" and password: "${plainPassword}"`);
};

setup()
	.catch((err) => logger.error(err.message))
	.finally(() => process.exit(0));

const gen = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
