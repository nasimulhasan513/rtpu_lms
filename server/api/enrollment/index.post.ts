import { z } from "zod";
import { ASG_SHOP_RESPONSE } from "~/server/utils/acs";

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
    const { courseId: slug, uniqueId } = enrollmentSchema.parse(body);

    let courseId = null;
    if (slug) {
      const course = await db.course.findFirst({
        where: {
          slug,
        },
      });

      courseId = course?.id as string;
    }

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

    // @ts-ignore
    const response: ASG_SHOP_RESPONSE | boolean = await ASG_SHOP(
      uniqueId,
      slug
    );

    if (!response) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error verifying unique ID",
      });
    }

    // Create the enrollment
    const enrollment = await db.enrollment.create({
      data: {
        userId,
        courseId: courseId as string,
        transactionId: uniqueId,
        status: "active",
      },
    });

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        institute: response.institution,
        hsc_batch: response.hsc_batch,
        phone: response.phone,
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
