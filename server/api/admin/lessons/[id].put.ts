import { zh } from "h3-zod";
import { LessonSchema } from "~/schema/lesson.schema";

export default defineEventHandler(async (event) => {
  const { data, error } = await zh.useSafeValidatedBody(event, LessonSchema);

  if (error) {
    return {
      status: 400,
      statusMessage: error,
    };
  }

  const lessonId = event.context.params?.id;

  if (!lessonId) {
    return {
      status: 400,
      statusMessage: "Lesson ID is required",
    };
  }

  const { courseIds, ...lessonData } = data;

  const updatedLesson = await db.lesson.update({
    where: { id: lessonId },
    data: {
      title: lessonData.title,
      subjectId: lessonData.subjectId,
      chapterId: lessonData.chapterId,
      teacherId: lessonData.teacherId,
      source: lessonData.source,
      content: lessonData.content,
      pdf: lessonData.pdf,
      order: lessonData.order,
      is_archive: lessonData.is_archive,
      is_downloadable: lessonData.is_downloadable,
    },
    
  });

  if (courseIds) {
    // Remove existing course associations
    await db.courseLesson.deleteMany({
      where: { lessonId },
    });

    // Add new course associations
    if (courseIds.length > 0) {
      await db.courseLesson.createMany({
        data: courseIds.map((courseId) => ({
          courseId,
          lessonId,
        })),
      });
    }
  }


  const courseSlugs = await db.course.findMany({
    where: {
      id: {
        in: courseIds,
      },
    },
    select: {
      slug: true,
    },
  });

  const cacheKeys = courseSlugs.map((course) => `courses:${course.slug}:lessons:${lessonData.is_archive}`);

  for (const cacheKey of cacheKeys) {
    await deleteCache(cacheKey);
  }

  const cacheKey = `lesson:${lessonId}`;
  await deleteCache(cacheKey);

  return {
    statusCode: 200,
    statusMessage: "Lesson updated successfully",
    data: updatedLesson,
  };
});
