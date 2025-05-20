/*
  Warnings:

  - Added the required column `preRequisites` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whatYouWillLearn` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "preRequisites" TEXT NOT NULL,
ADD COLUMN     "whatYouWillLearn" TEXT NOT NULL;
