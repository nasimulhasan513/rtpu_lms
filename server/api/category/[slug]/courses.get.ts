import { z } from "zod";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  // Validate the slug
  const slugSchema = z.string().min(1);
  const parsedSlug = slugSchema.safeParse(slug);

  if (!parsedSlug.success) {
    throw createError({
      statusCode: 400,
      message: "Invalid slug provided",
    });
  }

  try {
    // Find the category by slug
    const courses = await db.course.findMany({
      where: {
        category: {
          slug: slug,
        },
      },
      cacheStrategy: {
        ttl: 60 * 60 * 24 * 7, // 1 week
      },
    });

    if (!courses) {
      return createError({
        statusCode: 404,
        message: "Courses not found",
      });
    }

    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw createError({
      statusCode: 500,
      message: "An error occurred while fetching courses",
    });
  }
});
