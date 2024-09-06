import { zh } from "h3-zod";
import { z } from "zod";
import { LessonSchema } from "~/schema/lesson.schema";

const UpdateLessonSchema = LessonSchema.extend({
  courseIds: z.array(z.string()).optional(),
});

export default defineEventHandler(async (event) => {
  const { data, error } = await zh.useSafeValidatedBody(event, UpdateLessonSchema);

  if (error) {
    return {
      status: 400,
      statusMessage: error,
    };
  }

  const { courseIds, ...lessonData } = data;
  const lessonId = event.context.params?.id;

  await db.$transaction(async (tx) => {
    // Update lesson data
    await tx.lesson.update({
      where: { id: lessonId },
      data: lessonData,
    });

    if (courseIds) {
      // Remove existing course associations
      await tx.courseLesson.deleteMany({
        where: { lessonId },
      });

      // Add new course associations
      await tx.courseLesson.createMany({
        data: courseIds.map((courseId) => ({
          lessonId,
          courseId,
        })),
      });
    }
  });

  return {
    statusCode: 200,
    statusMessage: "Lesson updated successfully",
  };
});
