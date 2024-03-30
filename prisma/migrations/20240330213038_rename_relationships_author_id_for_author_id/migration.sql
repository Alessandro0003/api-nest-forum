/*
  Warnings:

  - You are about to drop the column `authorId` on the `answers` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `questions` table. All the data in the column will be lost.
  - Added the required column `author_id` to the `answers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_id` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_authorId_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_authorId_fkey";

-- AlterTable
ALTER TABLE "answers" DROP COLUMN "authorId",
ADD COLUMN     "author_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "authorId",
ADD COLUMN     "author_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
