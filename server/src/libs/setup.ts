import { PrismaClient } from "@prisma/client";
import * as argon from "argon2";
import { randomString } from "./functions";
import logger from "./logger";
import readline from "readline";

const setup = async (): Promise<void | boolean> => {
	const client = new PrismaClient();

	const count = await client.user.count();

	if (count > 0) return logger.error("You already run this setup script, you don't need to run it again");

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	rl.question("What do you want your admin username to be: ", (username) => {
		rl.question("What do you want your admin password to be: ", async (password) => {
			const hash = await argon.hash(password);
			await client.user
				.create({
					data: {
						username,
						password: hash,
						token: randomString(64),
						is_admin: true
					}
				})
				.then((user) => {
					console.log(`Created admin user "${user.username}"`);
					rl.close();
				});
		});
	});
};

setup();
