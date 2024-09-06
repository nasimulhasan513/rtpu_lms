export default defineEventHandler(async (event) => {
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
        teachers: {
          include: {
            teacher: true,
          },
        },
        category: true,
      },
    });

    if (!course) {
      return {
        status: 404,
        statusMessage: "Course not found",
      };
    }

    return {
      status: 200,
      body: {
        ...course,
        teachers: course.teachers.map(ct => ct.teacher),
      },
    };
  } catch (error) {
    console.error("Error fetching course:", error);
    return {
      status: 500,
      statusMessage: "An error occurred while fetching the course",
    };
  }
});