import "reflect-metadata";
import "./libs/config";
import express from "express";
import session from "express-session";
import cors from "cors";
import ioredis from "ioredis";
import connect from "connect-redis";
import logger from "./libs/logger";
import { port, __cors__, __prod__, __secure__ } from "./libs/config";
import { COOKIE_NAME, uploadDir } from "./libs/constants";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageDisabled } from "apollo-server-core";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user.resolver";
import { StatResolver } from "./resolvers/stat.resolver";
import { existsSync, readFileSync } from "fs";
import path from "path";
import prisma from "./libs/prisma";
import upload from "./routes/upload";
import files from "./routes/files";
import deleteFile from "./routes/delete";

const start = async () => {
	process.setMaxListeners(0);
	const app = express();
	const RedisStore = connect(session);
	const redis = new ioredis(process.env.REDIS_URL, { keepAlive: 5000 });

	__secure__ && logger.info("Secure mode enabled");
	__prod__ && logger.info("Production mode enabled");
	__prod__ && logger.info(`Frontend URL: ${__cors__}`);

	app.set("trust proxy", 1);
	app.use(cors({ credentials: true, origin: __cors__, optionsSuccessStatus: 200 }));
	app.use(
		session({
			name: COOKIE_NAME,
			secret: process.env.SESSION_SECRET!,
			resave: false,
			saveUninitialized: false,
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
				sameSite: "lax",
				httpOnly: true,
				secure: __secure__,
				domain: process.env.NODE_ENV === "production" ? `.${process.env.DOMAIN}` : undefined
			},
			store: new RedisStore({ client: redis, disableTouch: true, prefix: "bliss:" })
		})
	);

	const server = new ApolloServer({
		schema: await buildSchema({ resolvers: [UserResolver, StatResolver], validate: false }),
		plugins: [
			process.env.NODE_ENV === "production"
				? ApolloServerPluginLandingPageDisabled()
				: ApolloServerPluginLandingPageGraphQLPlayground({ settings: { "request.credentials": "include" } })
		],
		context: ({ req, res }) => ({ req, res, prisma, redis })
	});

	await server.start();

	server.applyMiddleware({ app, cors: false });

	app.use("/upload", upload);
	app.use("/files", files);
	app.use("/delete", deleteFile);
	app.get("/:image", (req, res) => {
		const { image } = req.params;
		const exist = existsSync(path.join(uploadDir, image));
		if (!exist) return res.sendStatus(404);
		const data = readFileSync(path.join(uploadDir, image));
		const file = Buffer.from(data).toString("base64");
		const url = `${process.env.USE_HTTPS ? "https" : "http"}://${process.env.DOMAIN}/${image}`;
		return res.send(`
			<html>
				<title>
					<meta name="viewport" content="width=device-width, initial-scale=1">
					<meta property="og:image" content="${url}">
				</title>
				<body>
					<img src="data:image/png;base64,${file}" />
				</body>
			</html>
		`);
	});
	app.use("*", (_req, res) => res.status(404).send("Not Found"));

	app.listen(port, () => logger.info(`Server started on port ${port}`));
};

start().catch((error) => logger.error((error as Error).message));
