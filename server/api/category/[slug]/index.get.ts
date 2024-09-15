import { z } from "zod";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  console.log(slug);

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
    const category = await db.category.findUnique({
      where: { slug: parsedSlug.data },
      cacheStrategy: {
        ttl: 60 * 60 * 24 * 7, // 1 week
      },
    });

    if (!category) {
      return createError({
        statusCode: 404,
        message: "Category not found",
      });
    }

    return category;
  } catch (error) {
    console.error("Error fetching category courses:", error);
    throw createError({
      statusCode: 500,
      message: "An error occurred while fetching category courses",
    });
  }
});
