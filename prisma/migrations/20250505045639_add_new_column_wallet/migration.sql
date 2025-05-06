/*
  Warnings:

  - Added the required column `wallet` to the `ContractorProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContractorProfile" ADD COLUMN     "wallet" TEXT NOT NULL;
