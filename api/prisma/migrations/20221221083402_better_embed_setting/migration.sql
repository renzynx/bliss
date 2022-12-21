/*
  Warnings:

  - You are about to drop the column `embed_author` on the `embed_settings` table. All the data in the column will be lost.
  - You are about to drop the column `embed_author_url` on the `embed_settings` table. All the data in the column will be lost.
  - You are about to drop the column `embed_site` on the `embed_settings` table. All the data in the column will be lost.
  - You are about to drop the column `embed_site_url` on the `embed_settings` table. All the data in the column will be lost.
  - Made the column `color` on table `embed_settings` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "embed_settings" DROP CONSTRAINT "embed_settings_user_id_fkey";

-- AlterTable
ALTER TABLE "embed_settings" DROP COLUMN "embed_author",
DROP COLUMN "embed_author_url",
DROP COLUMN "embed_site",
DROP COLUMN "embed_site_url",
ADD COLUMN     "author_name" TEXT,
ADD COLUMN     "author_url" TEXT,
ADD COLUMN     "provider_name" TEXT,
ADD COLUMN     "provider_url" TEXT,
ALTER COLUMN "color" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "embed_settings" ADD CONSTRAINT "embed_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
