import * as path from "path";
import { config } from "dotenv";
import { rootDir, __prod__ } from "./constants";

config({ path: path.join(rootDir, ".env"), debug: !__prod__ });
