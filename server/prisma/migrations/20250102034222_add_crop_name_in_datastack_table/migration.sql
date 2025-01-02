/*
  Warnings:

  - Added the required column `cropName` to the `DataStack` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `DataStack` ADD COLUMN `cropName` VARCHAR(191) NOT NULL;
