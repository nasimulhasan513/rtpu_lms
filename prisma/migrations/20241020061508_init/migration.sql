-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MODERATOR', 'STUDENT');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "QuestionDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "google_id" TEXT,
    "image" TEXT,
    "institute" TEXT,
    "hsc_batch" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reset_tokens" (
    "id" UUID NOT NULL,
    "otp" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "short_description" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category_id" UUID NOT NULL,
    "image" TEXT NOT NULL,
    "promo_video" TEXT,
    "sale_price" INTEGER NOT NULL,
    "regular_price" INTEGER NOT NULL,
    "status" "CourseStatus" NOT NULL DEFAULT 'DRAFT',
    "duration" INTEGER NOT NULL,
    "enrolled" INTEGER NOT NULL,
    "fb_group" TEXT,
    "tg_group" TEXT,
    "deleted_at" TIMESTAMP(3),
    "keywords" TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_teachers" (
    "course_id" UUID NOT NULL,
    "teacher_id" UUID NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "max_usage_limit" INTEGER NOT NULL DEFAULT 1,
    "used" INTEGER NOT NULL DEFAULT 1,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupon_courses" (
    "coupon_id" UUID NOT NULL,
    "course_id" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "course_enrollments" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" UUID NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL,
    "gateway_response" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coupon_id" UUID,
    "category_id" UUID,
    "enrolled_by" TEXT,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "course_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapters" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "subject_id" UUID NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "subject_id" UUID NOT NULL,
    "chapter_id" UUID NOT NULL,
    "teacher_id" UUID NOT NULL,
    "source" TEXT NOT NULL,
    "content" TEXT,
    "pdf" TEXT,
    "is_archive" BOOLEAN NOT NULL DEFAULT false,
    "is_downloadable" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "schedule" TIMESTAMP(3),
    "video_duration" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_progresses" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "lesson_id" UUID NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "bookmark" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "last_visited" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_progresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_lessons" (
    "id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "lesson_id" UUID NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "course_lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_question_options" (
    "id" UUID NOT NULL,
    "option_text" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "question_id" UUID NOT NULL,

    CONSTRAINT "exam_question_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_questions" (
    "id" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "difficulty" "QuestionDifficulty" NOT NULL DEFAULT 'MEDIUM',
    "subject_id" UUID NOT NULL,
    "chapter_id" UUID,
    "exam_id" UUID,
    "explain" TEXT,
    "serial" INTEGER,
    "creator_id" TEXT,
    "tags" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "exam_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exams" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "total_marks" INTEGER NOT NULL,
    "instant_result" BOOLEAN NOT NULL DEFAULT false,
    "negative_marking" BOOLEAN NOT NULL DEFAULT false,
    "shuffle_question" BOOLEAN NOT NULL DEFAULT false,
    "result_publish_time" TIMESTAMP(3),
    "pass_marks" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "subject_id" UUID,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_exams" (
    "id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "exam_id" UUID NOT NULL,

    CONSTRAINT "course_exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_submissions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "exam_id" UUID NOT NULL,
    "answers" JSONB,
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "marks" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "correct" INTEGER DEFAULT 0,
    "wrong" INTEGER DEFAULT 0,
    "skipped" INTEGER DEFAULT 0,
    "duration" INTEGER,
    "rank" INTEGER,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "submitted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_receivers" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "notification_id" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_receivers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_google_id_idx" ON "users"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");

-- CreateIndex
CREATE INDEX "courses_category_id_idx" ON "courses"("category_id");

-- CreateIndex
CREATE INDEX "courses_slug_idx" ON "courses"("slug");

-- CreateIndex
CREATE INDEX "courses_status_idx" ON "courses"("status");

-- CreateIndex
CREATE INDEX "courses_created_at_idx" ON "courses"("created_at");

-- CreateIndex
CREATE INDEX "course_teachers_course_id_idx" ON "course_teachers"("course_id");

-- CreateIndex
CREATE INDEX "course_teachers_teacher_id_idx" ON "course_teachers"("teacher_id");

-- CreateIndex
CREATE UNIQUE INDEX "course_teachers_course_id_teacher_id_key" ON "course_teachers"("course_id", "teacher_id");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");

-- CreateIndex
CREATE INDEX "coupons_expiry_date_idx" ON "coupons"("expiry_date");

-- CreateIndex
CREATE INDEX "coupons_code_idx" ON "coupons"("code");

-- CreateIndex
CREATE UNIQUE INDEX "coupon_courses_coupon_id_course_id_key" ON "coupon_courses"("coupon_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "course_enrollments_transaction_id_key" ON "course_enrollments"("transaction_id");

-- CreateIndex
CREATE INDEX "course_enrollments_transaction_id_idx" ON "course_enrollments"("transaction_id");

-- CreateIndex
CREATE INDEX "course_enrollments_status_idx" ON "course_enrollments"("status");

-- CreateIndex
CREATE INDEX "course_enrollments_enrolled_at_idx" ON "course_enrollments"("enrolled_at");

-- CreateIndex
CREATE UNIQUE INDEX "course_enrollments_user_id_course_id_key" ON "course_enrollments"("user_id", "course_id");

-- CreateIndex
CREATE INDEX "chapters_subject_id_idx" ON "chapters"("subject_id");

-- CreateIndex
CREATE INDEX "Lesson_subject_id_idx" ON "Lesson"("subject_id");

-- CreateIndex
CREATE INDEX "Lesson_chapter_id_idx" ON "Lesson"("chapter_id");

-- CreateIndex
CREATE INDEX "Lesson_teacher_id_idx" ON "Lesson"("teacher_id");

-- CreateIndex
CREATE INDEX "Lesson_is_archive_idx" ON "Lesson"("is_archive");

-- CreateIndex
CREATE INDEX "Lesson_schedule_idx" ON "Lesson"("schedule");

-- CreateIndex
CREATE INDEX "lesson_progresses_user_id_idx" ON "lesson_progresses"("user_id");

-- CreateIndex
CREATE INDEX "lesson_progresses_lesson_id_idx" ON "lesson_progresses"("lesson_id");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_progresses_user_id_lesson_id_key" ON "lesson_progresses"("user_id", "lesson_id");

-- CreateIndex
CREATE INDEX "course_lessons_course_id_idx" ON "course_lessons"("course_id");

-- CreateIndex
CREATE INDEX "course_lessons_lesson_id_idx" ON "course_lessons"("lesson_id");

-- CreateIndex
CREATE UNIQUE INDEX "course_lessons_course_id_lesson_id_key" ON "course_lessons"("course_id", "lesson_id");

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
CREATE INDEX "exams_subject_id_idx" ON "exams"("subject_id");

-- CreateIndex
CREATE INDEX "exams_start_time_idx" ON "exams"("start_time");

-- CreateIndex
CREATE INDEX "exams_end_time_idx" ON "exams"("end_time");

-- CreateIndex
CREATE UNIQUE INDEX "course_exams_course_id_exam_id_key" ON "course_exams"("course_id", "exam_id");

-- CreateIndex
CREATE INDEX "exam_submissions_user_id_exam_id_idx" ON "exam_submissions"("user_id", "exam_id");

-- CreateIndex
CREATE INDEX "exam_submissions_status_idx" ON "exam_submissions"("status");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notification_receivers_user_id_notification_id_idx" ON "notification_receivers"("user_id", "notification_id");

-- CreateIndex
CREATE INDEX "notification_receivers_is_read_idx" ON "notification_receivers"("is_read");

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
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progresses" ADD CONSTRAINT "lesson_progresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progresses" ADD CONSTRAINT "lesson_progresses_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_lessons" ADD CONSTRAINT "course_lessons_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_lessons" ADD CONSTRAINT "course_lessons_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
