-- CreateTable
CREATE TABLE `DataStack` (
    `dataStackId` VARCHAR(191) NOT NULL,
    `systemId` VARCHAR(191) NOT NULL,
    `cropSessionId` VARCHAR(191) NOT NULL,
    `ageCount` INTEGER NOT NULL,
    `temperature` DOUBLE NOT NULL,
    `humidity` DOUBLE NOT NULL,
    `moisture` DOUBLE NOT NULL,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `DataStack_systemId_idx`(`systemId`),
    INDEX `DataStack_cropSessionId_idx`(`cropSessionId`),
    PRIMARY KEY (`dataStackId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
