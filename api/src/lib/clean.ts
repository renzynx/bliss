import { uploadDir } from "./constants";
import { promises as fs } from "fs";
import { CronJob } from "cron";
import { Logger } from "@nestjs/common";
import { exec } from "child_process";

const cleanUp = async () => {
  const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const job = new CronJob(
    // every 24 hours at 12 AM
    "0 0 * * *",
    async () => {
      const startTime = Date.now();

      const logger = new Logger("CronJob");

      const isWindows = process.platform === "win32";

      if (isWindows) {
        // check if forfiles.exe exists
        try {
          await fs.access("C:\\Windows\\System32\\forfiles.exe");
        } catch (error) {
          logger.error("forfiles.exe not found, aborting job");
          logger.log(`Finished job in ${Date.now() - startTime}ms`);
          return;
        }

        const { stdout } = await exec(
          `forfiles /p ${uploadDir} /s /m tmp_* /D -1 /c "cmd /c del @path"`
        );

        stdout.on("data", (data) => {
          logger.log(data);
        });

        logger.log(`Finished job in ${Date.now() - startTime}ms`);

        return;
      }

      const isUnix =
        process.platform === "linux" ||
        process.platform === "darwin" ||
        process.platform === "freebsd" ||
        process.platform === "openbsd";

      if (isUnix) {
        const { stdout } = await exec(
          `find ${uploadDir} -type f -name "tmp_*" -mtime +1 -exec rm -f {} \\;`
        );

        stdout.on("data", (data) => {
          logger.log(data);
        });

        logger.log(`Finished job in ${Date.now() - startTime}ms`);

        return;
      } else {
        logger.log("OS not supported");
        logger.log(`Finished job in ${Date.now() - startTime}ms`);
        return;
      }
    },
    null,
    true,
    currentTimeZone
  );

  const supportedOS = ["win32", "linux", "darwin", "freebsd", "openbsd"];

  if (!supportedOS.includes(process.platform)) {
    return;
  }

  job.start();
};

cleanUp();
