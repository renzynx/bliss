import { randomString } from "./functions";
import realine from "readline";
import { PrismaClient } from "@prisma/client";
import * as argon from "argon2";

const CreateUser = async () => {
	const prisma = new PrismaClient();

	const rl = realine.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	rl.question("Username: ", (username) => {
		rl.question("Password: ", async (password) => {
			const random = randomString();
			const hash = await argon.hash(password);
			await prisma.user
				.create({
					data: {
						username,
						password: hash,
						token: Buffer.from(random).toString("base64")
					}
				})
				.then((user) => {
					console.log(`Created user ${user.username}`);
					rl.close();
				});
		});
	});
};

CreateUser();
