import { zh } from "h3-zod";
import { z } from "zod";

const AssignCoursesSchema = z.object({
  lessonIds: z.array(z.string()),
  courseIds: z.array(z.string()),
});

export default defineEventHandler(async (event) => {
  const { data, error } = await zh.useSafeValidatedBody(event, AssignCoursesSchema);

  await validateRequest(event, ["ADMIN", "contributor"]);

  if (error) {
    return {
      status: 400,
      statusMessage: error,
    };
  }

  const { lessonIds, courseIds } = data;

  try {
    await db.$transaction(async (tx) => {
      for (const lessonId of lessonIds) {
        // Remove existing course associations for this lesson
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
      status: 200,
      statusMessage: "Lessons assigned to courses successfully",
    };
  } catch (error) {
    console.error("Error assigning lessons to courses:", error);
    return {
      status: 500,
      statusMessage: "An error occurred while assigning lessons to courses",
    };
  }
});