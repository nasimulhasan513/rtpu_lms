import { z } from "zod";

const paramsSchema = z.object({
  slug: z.string(),
});

const querySchema = z.object({
  chapterId: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const { slug } = paramsSchema.parse(event.context.params);
    const query = getQuery(event);
    const { chapterId } = querySchema.parse(query);

    const course = await db.course.findUnique({
      where: { slug },
      include: {
        lessons: {
          include: {
            lesson: {
              include: {
                subject: true,
                chapter: true,
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!course) {
      throw createError({
        statusCode: 404,
        message: "Course not found",
      });
    }

    return {
      lessons: course.lessons,
    };
  } catch (error) {
    console.error("Error in lessons.get.ts:", error);
    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});
