import { zh } from "h3-zod";
import { LessonSchema } from "~/schema/lesson.schema";

export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN", "MODERATOR"]);

  const { data, error } = await zh.useSafeValidatedBody(event, LessonSchema);

  if (error) {
    return {
      status: 400,
      statusMessage: error,
    };
  }

  const lesson = await db.lesson.create({
    data: {
      title: data.title,
    subject_id: data.subjectId,
      chapter_id: data.chapterId,
      teacher_id: data.teacherId,
      source: data.source,
      content: data.content,
      pdf: data.pdf,
      is_archive: data.is_archive,
      is_downloadable: data.is_downloadable,
    },
  });

  if (data.courseIds && data.courseIds.length > 0) {
    await db.courseLesson.createMany({
      data: data.courseIds.map((courseId) => ({
        course_id: courseId,
        lesson_id: lesson.id,
      })),
    });
  }

  const courseSlugs = await db.course.findMany({
    where: {
      id: {
        in: data.courseIds,
      },
    },
  });

  const cacheKeys = courseSlugs.map((course) => `courses:${course.slug}:lessons:${data.is_archive}`);

  for (const cacheKey of cacheKeys) {
    await deleteCache(cacheKey);
  }
  return {
    statusCode: 201,
    statusMessage: "Lesson created successfully",
    data: lesson,
  };
});
