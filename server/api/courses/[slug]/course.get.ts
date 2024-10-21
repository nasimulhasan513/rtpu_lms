export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug;

  if (!slug) {
    return {
      status: 400,
      body: { message: "Course slug is required" },
    };
  }

  try {
    const course = await db.course.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        sale_price: true,
        regular_price: true,
        duration: true,
        enrolled: true,
        teachers: {
          select: {
            teacher: {
              select: {
                name: true,
                image: true,
                designation: true,
              },
            },
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!course) {
      return {
        status: 404,
        body: { message: "Course not found" },
      };
    }

    return course;
  } catch (error) {
    console.error("Error fetching course:", error);
    return {
      status: 500,
      body: { message: "An error occurred while fetching the course" },
    };
  }
});
