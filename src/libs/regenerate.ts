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

		if (!exist) {
			console.log("Username doesn't exist");
			rl.close();
		}

		const token = randomString(32);
		prisma.user
			.update({
				where: { username },
				data: {
					token
				}
			})
			.then(() => {
				console.log(`Reset token for ${username}`);
				console.log(`Your token is: ${token}`);
				console.log("Save it somewhere safe!, you will need this to upload files.");
				rl.close();
			});
	});
};

CreateUser();
