export default defineEventHandler(async (event) => {
  await validateRequest(event, ["admin", "contributor"]);

  const courseId = event.context.params?.id;

  if (!courseId) {
    return {
      status: 400,
      statusMessage: "Course ID is required",
    };
  }

  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        teachers: true,
        category: true,
      },
    });

    if (!course) {
      return {
        status: 404,
        statusMessage: "Course not found",
      };
    }

    return course;
  } catch (error) {
    console.error("Error fetching course:", error);
    return {
      status: 500,
      statusMessage: "An error occurred while fetching the course",
    };
  }
});
