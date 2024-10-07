import { COURSE_CATEGORIES } from "~/server/utils/cachekeys";

export default defineEventHandler(async (event) => {
  try {
    
    const cachedData = await getCache(COURSE_CATEGORIES);

    if (cachedData) {
      return cachedData;
    }

    const categories = await db.category.findMany({
      include: {
        _count: {
          select: { courses: true }
        }
      },
    });

    const data = categories.map((category) => ({
      id: category.id,
      name: category.name,
      image: category.image,
      slug: category.slug,
      courseCount: category._count.courses,
    }))

    await setCache(COURSE_CATEGORIES, data, 60 * 60 * 24 * 7);

    return data;

  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      status: 500,
      body: { message: "An error occurred while fetching categories" },
    };
  }
});
