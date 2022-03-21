process.env.NODE_ENV ??= "production";
import { config } from "dotenv-cra";

config({ debug: true });

export const __prod__ = process.env.NODE_ENV === "production";
export const __secure__ = process.env.SECURE === "false" ? false : true;
export const __cors__ = __prod__ ? `http${__secure__ ? "s" : ""}://${process.env.DOMAIN}` : `http://localhost:3000`;
export const port = process.env.PORT ?? 42069;
