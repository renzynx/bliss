import { uploadDir } from "./constants";
import { promises as fs } from "fs";
import { CronJob } from "cron";
import { join } from "path";

const cleanUp = async () => {
  // find files start with tmp_ that are older than 24 hours
  const tmpFiles = (await fs.readdir(uploadDir))
    .filter((file) => file.startsWith("tmp_"))
    .filter(async (file) => {
      const { birthtime } = await fs.stat(join(uploadDir, file));
      return Date.now() - birthtime.getTime() > 1000 * 60 * 60 * 24;
    });

  const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const job = new CronJob(
    // every 24 hours at 12 AM
    "0 0 * * *",
    async () => {
      for (const file of tmpFiles) {
        await fs.unlink(join(uploadDir, file));
      }
    },
    null,
    true,
    currentTimeZone
  );

  job.start();
};

cleanUp();
