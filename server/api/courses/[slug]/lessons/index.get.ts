import { z } from "zod";

const paramsSchema = z.object({
  slug: z.string(),
});

export default defineEventHandler(async (event) => {
  try {
    const { slug } = paramsSchema.parse(event.context.params);

    const is_archive = getQuery(event).is_archive === "true";

    const cacheKey = `courses:${slug}:lessons:${is_archive}`;

    const cachedCourse = await getCache(cacheKey);

    if (cachedCourse) {
      return cachedCourse;
    }

    const course = await db.course.findFirst({
      where: {
        slug,
      },
      include: {
        lessons: {
          where: {
            lesson: {
              is_archive,
            },
          },
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

    await setCache(cacheKey, course, 60 * 60 * 24 * 7);

    return course;
  } catch (error) {
    console.error("Error in lessons.get.ts:", error);
    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});
