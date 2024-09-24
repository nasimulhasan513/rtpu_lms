import { z } from "zod";
const enrollmentSchema = z.object({
  courseId: z.string(),
  uniqueId: z.string(),
  userId: z.string(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const { courseId, uniqueId, userId } = enrollmentSchema.parse(body);

    // Check if the user is already enrolled in the course
    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: courseId as string,
        },
      },
    });

    if (existingEnrollment) {
      throw createError({
        statusCode: 400,
        statusMessage: "You have already enrolled in this course",
      });
    }

    const enrollment = await db.enrollment.create({
      data: {
        userId,
        courseId: courseId as string,
        transactionId: uniqueId,
        status: "active",
        enrolled_by: event.context.user?.id,
      },
    });

    return {
      message: "Enrollment successful",
      enrollment,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid input",
      });
    }
    throw error;
  }
});
