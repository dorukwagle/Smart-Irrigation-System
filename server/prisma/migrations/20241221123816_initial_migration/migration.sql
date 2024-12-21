/*
  Warnings:

  - You are about to drop the `Todos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Todos` DROP FOREIGN KEY `Todos_userId_fkey`;

-- DropTable
DROP TABLE `Todos`;

-- CreateTable
CREATE TABLE `Systems` (
    `systemId` VARCHAR(191) NOT NULL,
    `systemName` VARCHAR(191) NOT NULL,
    `pumpFlowRate` DOUBLE NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`systemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CropSessions` (
    `cropSessionId` VARCHAR(191) NOT NULL,
    `cropName` VARCHAR(191) NOT NULL,
    `initialCropAge` INTEGER NOT NULL DEFAULT 1,
    `ageCount` INTEGER NOT NULL DEFAULT 1,
    `sessionActive` BOOLEAN NOT NULL DEFAULT true,
    `systemId` VARCHAR(191) NOT NULL,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`cropSessionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SystemSessions` (
    `systemSessionId` VARCHAR(191) NOT NULL,
    `systemIdentifier` VARCHAR(191) NOT NULL,
    `currentSchedule` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `systemId` VARCHAR(191) NOT NULL,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SystemSessions_systemIdentifier_key`(`systemIdentifier`),
    UNIQUE INDEX `SystemSessions_systemId_key`(`systemId`),
    PRIMARY KEY (`systemSessionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Schedules` (
    `scheduleId` VARCHAR(191) NOT NULL,
    `cropAge` INTEGER NOT NULL,
    `irrigationStartTime` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `irrigationStopTime` TIMESTAMP(3) NULL,
    `cropSessionId` VARCHAR(191) NOT NULL,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`scheduleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SystemPreferences` (
    `systemPreferenceId` VARCHAR(191) NOT NULL,
    `isManualOverride` BOOLEAN NOT NULL DEFAULT false,
    `isIrrigationActive` BOOLEAN NOT NULL DEFAULT false,
    `systemId` VARCHAR(191) NOT NULL,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SystemPreferences_systemId_key`(`systemId`),
    PRIMARY KEY (`systemPreferenceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LiveStatus` (
    `liveStatusId` VARCHAR(191) NOT NULL,
    `irrigationStatus` ENUM('ON', 'OFF') NOT NULL DEFAULT 'OFF',
    `temperature` DOUBLE NOT NULL,
    `humidity` DOUBLE NOT NULL,
    `moisture` DOUBLE NOT NULL,
    `systemId` VARCHAR(191) NOT NULL,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `LiveStatus_systemId_key`(`systemId`),
    PRIMARY KEY (`liveStatusId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Systems` ADD CONSTRAINT `Systems_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CropSessions` ADD CONSTRAINT `CropSessions_systemId_fkey` FOREIGN KEY (`systemId`) REFERENCES `Systems`(`systemId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SystemSessions` ADD CONSTRAINT `SystemSessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SystemSessions` ADD CONSTRAINT `SystemSessions_systemId_fkey` FOREIGN KEY (`systemId`) REFERENCES `Systems`(`systemId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedules` ADD CONSTRAINT `Schedules_cropSessionId_fkey` FOREIGN KEY (`cropSessionId`) REFERENCES `CropSessions`(`cropSessionId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SystemPreferences` ADD CONSTRAINT `SystemPreferences_systemId_fkey` FOREIGN KEY (`systemId`) REFERENCES `Systems`(`systemId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveStatus` ADD CONSTRAINT `LiveStatus_systemId_fkey` FOREIGN KEY (`systemId`) REFERENCES `Systems`(`systemId`) ON DELETE RESTRICT ON UPDATE CASCADE;
