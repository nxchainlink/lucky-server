/*
  Warnings:

  - You are about to drop the column `developer_id` on the `Demand` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Demand" DROP COLUMN "developer_id";

-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "status" TEXT;
