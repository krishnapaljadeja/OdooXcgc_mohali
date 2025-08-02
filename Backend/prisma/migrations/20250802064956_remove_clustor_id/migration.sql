/*
  Warnings:

  - You are about to drop the column `clustorId` on the `problems` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."problems" DROP COLUMN "clustorId",
ADD COLUMN     "isAnonymous" BOOLEAN NOT NULL DEFAULT false;
