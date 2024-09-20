export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) {
    return createError({
      statusCode: 400,
      message: "Exam ID is required",
    });
  }
  
  try {
    const exam = await db.exam.findUnique({
      where: { id },
      include: {
        courseExams: {
          include: {
            course: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!exam) {
      return createError({
        statusCode: 404,
        message: "Exam not found",
      });
    }

    return exam;
  } catch (error) {
    console.error("Error fetching exam:", error);
    return createError({
      statusCode: 500,
      message: "Failed to fetch exam",
    });
  }
});
