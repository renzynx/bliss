import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  /**
   * Injest the PrismaClient into the NestJS DI system
   * @returns Promise
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Close NestJS connection before exiting
   * @returns Promise
   *
   */
  async enableShutdownHooks(app: INestApplication) {
    this.$on("beforeExit", async () => {
      await app.close();
    });
  }
}
