import { PrismaClient } from "@prisma/client";
import * as argon from "argon2";
import { randomString } from "./functions";
import logger from "./logger";

const setup = async () => {
	const client = new PrismaClient();
	logger.info("Connecting to MYSQL...");

	const count = await client.user.count();

	if (count > 0) return logger.error("You already run this setup script, you don't need to run it again");

	logger.info("Creating admin user...");

	const plainPassword = randomString();
	const hashedPassword = await argon.hash(plainPassword);

	await client.user.create({
		data: {
			username: "admin",
			password: hashedPassword,
			token: randomString(),
			is_admin: true
		}
	});

	return logger.info(`Created user with username: "admin" and password: "${plainPassword}"`);
};

setup()
	.catch((err) => logger.error(err.message))
	.finally(() => process.exit(0));
