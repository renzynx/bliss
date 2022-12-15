import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { ConfigModule } from "@nestjs/config";
import { RootService } from "./modules/root/root.service";
import { RootController } from "./modules/root/root.controller";
import { DeleteModule } from "./modules/delete/delete.module";
import { AppLoggerMiddleware } from "./modules/root/root.middleware";
import { ROUTES } from "lib/constants";
import { AdminModule } from "./modules/admin/admin.module";
import { S3Module } from "./modules/s3/s3.module";
import { PrismaService } from "modules/prisma/prisma.service";
import { UploadModule } from "modules/upload/upload.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UsersModule,
    AdminModule,
    DeleteModule,
    process.env.UPLOADER === "s3" ? S3Module : UploadModule,
  ],
  providers: [RootService, PrismaService],
  controllers: [RootController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes(ROUTES.USERS, ROUTES.AUTH);
  }
}
