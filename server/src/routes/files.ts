import { Router } from "express";
import prisma from "../libs/prisma";

const router = Router();

declare module "express-session" {
	interface SessionData {
		userId: number;
	}
}
router.get("/", async (req, res) => {
	const user = req.session.userId;

	if (!user) return res.sendStatus(401);

	const files = await prisma.user.findUnique({ where: { id: user } }).files();

	return res.send(files);
});

export default router;
