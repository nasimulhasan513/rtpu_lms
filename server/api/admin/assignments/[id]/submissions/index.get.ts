export default defineEventHandler(async (event) => {
  const assignmentId = event.context.params?.id;

  if (!assignmentId) {
    throw createError({
      statusCode: 400,
      message: "Assignment ID and Submission ID are required",
    });
  }

  try {
    const submissions = await db.assignmentSubmission.findMany({
      where: { assignmentId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!submissions) {
      throw createError({
        statusCode: 404,
        message: "Submission not found",
      });
    }

    return submissions;
  } catch (error) {
    console.error("Error fetching submissions:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch submission",
    });
  }
});
