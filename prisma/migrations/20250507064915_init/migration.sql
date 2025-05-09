/*
  Warnings:

  - You are about to drop the column `isActive` on the `Course` table. All the data in the column will be lost.
  - Added the required column `course_thumbnail_url` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Activation_Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "isActive",
ADD COLUMN     "activationStatus" "Activation_Status",
ADD COLUMN     "course_thumbnail_url" TEXT NOT NULL;
