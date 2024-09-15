export default defineEventHandler(async (event) => {
  try {
    const categories = await db.category.findMany({
      include: {
        courses: true,
      },
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      image: category.image,
      slug: category.slug,
      courseCount: category.courses.length,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      status: 500,
      body: { message: "An error occurred while fetching categories" },
    };
  }
});
