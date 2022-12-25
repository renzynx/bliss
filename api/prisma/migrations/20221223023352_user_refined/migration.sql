/*
  Warnings:

  - You are about to drop the `verification_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "upload_limit" INTEGER NOT NULL DEFAULT 500;

-- DropTable
DROP TABLE "verification_tokens";

-- DropEnum
DROP TYPE "Token";
