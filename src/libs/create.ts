import { randomString } from "./functions";
import { PrismaClient } from "@prisma/client";
import realine from "readline";

const CreateUser = async () => {
	const prisma = new PrismaClient();

	const rl = realine.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	rl.question("Username: ", async (username) => {
		const exist = await prisma.user.findUnique({ where: { username } });
		if (exist) {
			console.log("Username already exist");
			rl.close();
			return;
		}
		const token = randomString(32);
		prisma.user
			.create({
				data: {
					username,
					token
				}
			})
			.then(({ username, token }) => {
				console.log(`User ${username} created`);
				console.log(`Your token is: ${token}`);
				console.log("Save it somewhere safe!, you will need this to upload files.");
				rl.close();
			});
	});
};

CreateUser();
