import "reflect-metadata";
import "./libs/config";
import express from "express";
import session from "express-session";
import http from "http";
import cors from "cors";
import ioredis from "ioredis";
import connect from "connect-redis";
import logger from "./libs/logger";
import { __port__, __cors__, __prod__, COOKIE_NAME, uploadDir, __secure__ } from "./libs/constants";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user.resolver";
import { PrismaClient } from "@prisma/client";
import { graphqlUploadExpress } from "graphql-upload";
import { UploadResolver } from "./resolvers/upload.resolver";
import path from "path";
import { StatResolver } from "./resolvers/stat.resolver";

const start = async () => {
	process.setMaxListeners(0);
	const urlMap = new Map<string, string>();
	const app = express();
	const httpServer = http.createServer(app);
	const prisma = new PrismaClient();
	const RedisStore = connect(session);
	const redis = new ioredis(process.env.REDIS_URL, { keepAlive: 5000 });

	const allUrls = await prisma.file.findMany();
	allUrls.forEach((url) => urlMap.set(url.slug, url.file_name));

	app.use(cors({ credentials: true, origin: __cors__ }));
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
				domain: __prod__ ? process.env.DOMAIN : undefined,
				secure: __secure__
			},
			store: new RedisStore({ client: redis, disableTouch: true, prefix: "bliss:" })
		})
	);
	app.use(graphqlUploadExpress());

	const server = new ApolloServer({
		schema: await buildSchema({ resolvers: [UserResolver, UploadResolver, StatResolver], validate: false }),
		plugins: [
			ApolloServerPluginDrainHttpServer({ httpServer }),
			ApolloServerPluginLandingPageGraphQLPlayground({ settings: { "request.credentials": "include" } })
		],
		context: ({ req, res }) => ({ req, res, prisma, urls: urlMap })
	});

	await server.start();

	server.applyMiddleware({ app, cors: false });

	app.use((req, res, next) => {
		const fileName = urlMap.get(req.path.replace("/", ""));
		if (!fileName) return next();
		const file = path.join(uploadDir, fileName);
		res.sendFile(file);
	});

	app.use("*", (_req, res) => res.status(404).send("Not Found"));

	httpServer.listen(__port__, () => logger.info(`Server started on port ${__port__}`));
};

start().catch((error) => {
	const err = error as Error;
	logger.error(err.message);
});
