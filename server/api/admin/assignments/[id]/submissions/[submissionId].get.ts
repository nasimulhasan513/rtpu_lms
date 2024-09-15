export default defineEventHandler(async (event) => {
  const assignmentId = event.context.params?.id;
  const submissionId = event.context.params?.submissionId;

  if (!assignmentId || !submissionId) {
    throw createError({
      statusCode: 400,
      message: "Assignment ID and Submission ID are required",
    });
  }

  try {
    const submission = await db.assignmentSubmission.findUnique({
      where: { id: submissionId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!submission) {
      throw createError({
        statusCode: 404,
        message: "Submission not found",
      });
    }

    return submission;
  } catch (error) {
    console.error("Error fetching submission:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch submission",
    });
  }
});
