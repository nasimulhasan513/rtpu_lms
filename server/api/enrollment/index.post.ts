import { z } from "zod";

const enrollmentSchema = z.object({
  courseId: z.string(),
  uniqueId: z.string(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const userId = event.context.user?.id;

  if (!userId) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  try {
    const { courseId, uniqueId } = enrollmentSchema.parse(body);

    // Verify the unique ID with the 3rd party API
    const verificationResponse = 200; //await ASG_SHOP(uniqueId, "", "");

    if (verificationResponse !== 200) {
      throw createError({
        statusCode: 400,
        message: "Invalid unique ID",
      });
    }

    // Check if the user is already enrolled in the course
    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw createError({
        statusCode: 400,
        message: "You are already enrolled in this course",
      });
    }

    // Create the enrollment
    const enrollment = await db.enrollment.create({
      data: {
        userId,
        courseId,
        transactionId: uniqueId,
        status: "active",
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
        message: "Invalid input",
      });
    }
    throw error;
  }
});
