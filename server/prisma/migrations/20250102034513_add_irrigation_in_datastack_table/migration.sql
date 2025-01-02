/*
  Warnings:

  - Added the required column `irrigated` to the `DataStack` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `DataStack` ADD COLUMN `irrigated` BOOLEAN NOT NULL;
