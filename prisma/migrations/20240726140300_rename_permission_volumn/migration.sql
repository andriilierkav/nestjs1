/*
  Warnings:

  - You are about to drop the column `permisions` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "permisions",
ADD COLUMN     "permissions" TEXT;
