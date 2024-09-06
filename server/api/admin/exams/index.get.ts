export default defineEventHandler(async (event) => {
  try {
    const exams = await db.exam.findMany({
      include: {
        courseExams: {
          include: {
            course: {
              select: {
                name: true,
              },
            },
          },
        },
        subject: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      statusCode: 200,
      body: exams,
    };
  } catch (error) {
    console.error("Error fetching exams:", error);
    return createError({
      statusCode: 500,
      message: "Failed to fetch exams",
    });
  }
});
