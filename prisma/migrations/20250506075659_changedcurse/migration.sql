/*
  Warnings:

  - You are about to drop the column `status` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "status",
ADD COLUMN     "isActive" BOOLEAN;
