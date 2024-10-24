/*
  Warnings:

  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `_id` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Session` table. All the data in the column will be lost.
  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `categories` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `chapters` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `chapters` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `coupons` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `coupons` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `course_enrollments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `course_enrollments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `coupon_id` column on the `course_enrollments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `category_id` column on the `course_enrollments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `course_exams` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `course_exams` table. All the data in the column will be lost.
  - The primary key for the `course_lessons` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `courses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `courses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `exam_question_options` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `exam_questions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `exam_questions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `chapter_id` column on the `exam_questions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `exam_id` column on the `exam_questions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `creator_id` column on the `exam_questions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `exam_submissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `exam_submissions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `exams` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `exams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `subject_id` column on the `exams` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `lesson_progresses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `lesson_progresses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `notifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `reset_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `subjects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `subjects` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `teachers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `teachers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Lesson` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `expires_at` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `subject_id` on the `chapters` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `coupon_id` on the `coupon_courses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `course_id` on the `coupon_courses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `payable_amount` to the `course_enrollments` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `user_id` on the `course_enrollments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `course_id` on the `course_enrollments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `course_id` on the `course_exams` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `exam_id` on the `course_exams` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `course_id` on the `course_lessons` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `lesson_id` on the `course_lessons` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `course_id` on the `course_teachers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `teacher_id` on the `course_teachers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `category_id` on the `courses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `question_id` on the `exam_question_options` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `subject_id` on the `exam_questions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `exam_submissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `exam_id` on the `exam_submissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `lesson_progresses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `lesson_id` on the `lesson_progresses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `notification_receivers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `notification_id` on the `notification_receivers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `notifications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_chapter_id_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "chapters" DROP CONSTRAINT "chapters_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "coupon_courses" DROP CONSTRAINT "coupon_courses_coupon_id_fkey";

-- DropForeignKey
ALTER TABLE "coupon_courses" DROP CONSTRAINT "coupon_courses_course_id_fkey";

-- DropForeignKey
ALTER TABLE "course_enrollments" DROP CONSTRAINT "course_enrollments_category_id_fkey";

-- DropForeignKey
ALTER TABLE "course_enrollments" DROP CONSTRAINT "course_enrollments_coupon_id_fkey";

-- DropForeignKey
ALTER TABLE "course_enrollments" DROP CONSTRAINT "course_enrollments_course_id_fkey";

-- DropForeignKey
ALTER TABLE "course_enrollments" DROP CONSTRAINT "course_enrollments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "course_exams" DROP CONSTRAINT "course_exams_course_id_fkey";

-- DropForeignKey
ALTER TABLE "course_exams" DROP CONSTRAINT "course_exams_exam_id_fkey";

-- DropForeignKey
ALTER TABLE "course_lessons" DROP CONSTRAINT "course_lessons_course_id_fkey";

-- DropForeignKey
ALTER TABLE "course_lessons" DROP CONSTRAINT "course_lessons_lesson_id_fkey";

-- DropForeignKey
ALTER TABLE "course_teachers" DROP CONSTRAINT "course_teachers_course_id_fkey";

-- DropForeignKey
ALTER TABLE "course_teachers" DROP CONSTRAINT "course_teachers_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_category_id_fkey";

-- DropForeignKey
ALTER TABLE "exam_question_options" DROP CONSTRAINT "exam_question_options_question_id_fkey";

-- DropForeignKey
ALTER TABLE "exam_questions" DROP CONSTRAINT "exam_questions_chapter_id_fkey";

-- DropForeignKey
ALTER TABLE "exam_questions" DROP CONSTRAINT "exam_questions_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "exam_questions" DROP CONSTRAINT "exam_questions_exam_id_fkey";

-- DropForeignKey
ALTER TABLE "exam_questions" DROP CONSTRAINT "exam_questions_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "exam_submissions" DROP CONSTRAINT "exam_submissions_exam_id_fkey";

-- DropForeignKey
ALTER TABLE "exam_submissions" DROP CONSTRAINT "exam_submissions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "exams" DROP CONSTRAINT "exams_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "lesson_progresses" DROP CONSTRAINT "lesson_progresses_lesson_id_fkey";

-- DropForeignKey
ALTER TABLE "lesson_progresses" DROP CONSTRAINT "lesson_progresses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "notification_receivers" DROP CONSTRAINT "notification_receivers_notification_id_fkey";

-- DropForeignKey
ALTER TABLE "notification_receivers" DROP CONSTRAINT "notification_receivers_user_id_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_fkey";

-- AlterTable
ALTER TABLE "Session" DROP CONSTRAINT "Session_pkey",
DROP COLUMN "_id",
DROP COLUMN "expiresAt",
DROP COLUMN "userId",
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "categories" DROP CONSTRAINT "categories_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "chapters" DROP CONSTRAINT "chapters_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "subject_id",
ADD COLUMN     "subject_id" INTEGER NOT NULL,
ADD CONSTRAINT "chapters_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "coupon_courses" DROP COLUMN "coupon_id",
ADD COLUMN     "coupon_id" INTEGER NOT NULL,
DROP COLUMN "course_id",
ADD COLUMN     "course_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "coupons" DROP CONSTRAINT "coupons_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "coupons_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "course_enrollments" DROP CONSTRAINT "course_enrollments_pkey",
ADD COLUMN     "payable_amount" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
DROP COLUMN "course_id",
ADD COLUMN     "course_id" INTEGER NOT NULL,
DROP COLUMN "coupon_id",
ADD COLUMN     "coupon_id" INTEGER,
DROP COLUMN "category_id",
ADD COLUMN     "category_id" INTEGER,
ADD CONSTRAINT "course_enrollments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "course_exams" DROP CONSTRAINT "course_exams_pkey",
DROP COLUMN "id",
DROP COLUMN "course_id",
ADD COLUMN     "course_id" INTEGER NOT NULL,
DROP COLUMN "exam_id",
ADD COLUMN     "exam_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "course_lessons" DROP CONSTRAINT "course_lessons_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "course_id",
ADD COLUMN     "course_id" INTEGER NOT NULL,
DROP COLUMN "lesson_id",
ADD COLUMN     "lesson_id" INTEGER NOT NULL,
ADD CONSTRAINT "course_lessons_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "course_teachers" DROP COLUMN "course_id",
ADD COLUMN     "course_id" INTEGER NOT NULL,
DROP COLUMN "teacher_id",
ADD COLUMN     "teacher_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "courses" DROP CONSTRAINT "courses_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "category_id",
ADD COLUMN     "category_id" INTEGER NOT NULL,
ADD CONSTRAINT "courses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "exam_question_options" DROP CONSTRAINT "exam_question_options_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "question_id",
ADD COLUMN     "question_id" INTEGER NOT NULL,
ADD CONSTRAINT "exam_question_options_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "exam_questions" DROP CONSTRAINT "exam_questions_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "subject_id",
ADD COLUMN     "subject_id" INTEGER NOT NULL,
DROP COLUMN "chapter_id",
ADD COLUMN     "chapter_id" INTEGER,
DROP COLUMN "exam_id",
ADD COLUMN     "exam_id" INTEGER,
DROP COLUMN "creator_id",
ADD COLUMN     "creator_id" INTEGER,
ADD CONSTRAINT "exam_questions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "exam_submissions" DROP CONSTRAINT "exam_submissions_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
DROP COLUMN "exam_id",
ADD COLUMN     "exam_id" INTEGER NOT NULL,
ADD CONSTRAINT "exam_submissions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "exams" DROP CONSTRAINT "exams_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "subject_id",
ADD COLUMN     "subject_id" INTEGER,
ADD CONSTRAINT "exams_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "lesson_progresses" DROP CONSTRAINT "lesson_progresses_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
DROP COLUMN "lesson_id",
ADD COLUMN     "lesson_id" INTEGER NOT NULL,
ADD CONSTRAINT "lesson_progresses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "notification_receivers" DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
DROP COLUMN "notification_id",
ADD COLUMN     "notification_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "reset_tokens" DROP CONSTRAINT "reset_tokens_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "reset_tokens_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "subjects_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "teachers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Lesson";

-- CreateTable
CREATE TABLE "lessons" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "chapter_id" INTEGER NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "content" TEXT,
    "pdf" TEXT,
    "is_archive" BOOLEAN NOT NULL DEFAULT false,
    "is_downloadable" BOOLEAN NOT NULL DEFAULT false,
    "schedule" TIMESTAMP(3),
    "video_duration" INTEGER,
    "order" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lessons_subject_id_idx" ON "lessons"("subject_id");

-- CreateIndex
CREATE INDEX "lessons_chapter_id_idx" ON "lessons"("chapter_id");

-- CreateIndex
CREATE INDEX "lessons_teacher_id_idx" ON "lessons"("teacher_id");

-- CreateIndex
CREATE INDEX "lessons_is_archive_idx" ON "lessons"("is_archive");

-- CreateIndex
CREATE INDEX "lessons_schedule_idx" ON "lessons"("schedule");

-- CreateIndex
CREATE INDEX "chapters_subject_id_idx" ON "chapters"("subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "coupon_courses_coupon_id_course_id_key" ON "coupon_courses"("coupon_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "course_enrollments_user_id_course_id_key" ON "course_enrollments"("user_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "course_exams_course_id_exam_id_key" ON "course_exams"("course_id", "exam_id");

-- CreateIndex
CREATE INDEX "course_lessons_course_id_idx" ON "course_lessons"("course_id");

-- CreateIndex
CREATE INDEX "course_lessons_lesson_id_idx" ON "course_lessons"("lesson_id");

-- CreateIndex
CREATE UNIQUE INDEX "course_lessons_course_id_lesson_id_key" ON "course_lessons"("course_id", "lesson_id");

-- CreateIndex
CREATE INDEX "course_teachers_course_id_idx" ON "course_teachers"("course_id");

-- CreateIndex
CREATE INDEX "course_teachers_teacher_id_idx" ON "course_teachers"("teacher_id");

-- CreateIndex
CREATE UNIQUE INDEX "course_teachers_course_id_teacher_id_key" ON "course_teachers"("course_id", "teacher_id");

-- CreateIndex
CREATE INDEX "courses_category_id_idx" ON "courses"("category_id");

-- CreateIndex
CREATE INDEX "exam_question_options_question_id_idx" ON "exam_question_options"("question_id");

-- CreateIndex
CREATE INDEX "exam_questions_exam_id_idx" ON "exam_questions"("exam_id");

-- CreateIndex
CREATE INDEX "exam_questions_subject_id_idx" ON "exam_questions"("subject_id");

-- CreateIndex
CREATE INDEX "exam_questions_chapter_id_idx" ON "exam_questions"("chapter_id");

-- CreateIndex
CREATE INDEX "exam_questions_creator_id_idx" ON "exam_questions"("creator_id");

-- CreateIndex
CREATE INDEX "exam_submissions_user_id_exam_id_idx" ON "exam_submissions"("user_id", "exam_id");

-- CreateIndex
CREATE INDEX "exams_subject_id_idx" ON "exams"("subject_id");

-- CreateIndex
CREATE INDEX "lesson_progresses_user_id_idx" ON "lesson_progresses"("user_id");

-- CreateIndex
CREATE INDEX "lesson_progresses_lesson_id_idx" ON "lesson_progresses"("lesson_id");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_progresses_user_id_lesson_id_key" ON "lesson_progresses"("user_id", "lesson_id");

-- CreateIndex
CREATE INDEX "notification_receivers_user_id_notification_id_idx" ON "notification_receivers"("user_id", "notification_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_teachers" ADD CONSTRAINT "course_teachers_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_teachers" ADD CONSTRAINT "course_teachers_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_courses" ADD CONSTRAINT "coupon_courses_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_courses" ADD CONSTRAINT "coupon_courses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progresses" ADD CONSTRAINT "lesson_progresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progresses" ADD CONSTRAINT "lesson_progresses_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_lessons" ADD CONSTRAINT "course_lessons_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_lessons" ADD CONSTRAINT "course_lessons_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_question_options" ADD CONSTRAINT "exam_question_options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "exam_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_exams" ADD CONSTRAINT "course_exams_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_exams" ADD CONSTRAINT "course_exams_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_submissions" ADD CONSTRAINT "exam_submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_submissions" ADD CONSTRAINT "exam_submissions_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_receivers" ADD CONSTRAINT "notification_receivers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_receivers" ADD CONSTRAINT "notification_receivers_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
