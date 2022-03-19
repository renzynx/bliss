/*
  Warnings:

  - You are about to drop the column `uid` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User_uid_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `uid`;
