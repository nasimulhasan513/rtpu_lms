import { zh } from "h3-zod";
import { LessonSchema } from "~/schema/lesson.schema";

export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN", "contributor"]);

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
      subjectId: data.subjectId,
      chapterId: data.chapterId,
      teacherId: data.teacherId,
      source: data.source,
      content: data.content,
      pdf: data.pdf,
      order: data.order,
      is_archive: data.is_archive,
      is_downloadable: data.is_downloadable,
    },
  });

  if (data.courseIds && data.courseIds.length > 0) {
    await db.courseLesson.createMany({
      data: data.courseIds.map((courseId) => ({
        courseId,
        lessonId: lesson.id,
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
