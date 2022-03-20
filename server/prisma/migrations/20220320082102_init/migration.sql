/*
  Warnings:

  - You are about to alter the column `used_by` on the `Invite` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Invite` MODIFY `used_by` INTEGER NULL;
