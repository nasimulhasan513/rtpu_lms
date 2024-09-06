export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const featured = query.featured === "true";
  const limit = parseInt(query.limit as string) || 20;

  try {
    const courses = await db.course.findMany({
      where: featured ? { status: "published" } : {},
      take: limit,
      //   orderBy: { createdAt: "desc" },
      include: {
        category: true,
      },
    });

    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      status: 500,
      body: { message: "An error occurred while fetching courses" },
    };
  }
});
