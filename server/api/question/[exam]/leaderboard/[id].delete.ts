export default defineEventHandler(async (event) => {
  const exam = event.context.params?.exam;
  const id = event.context.params?.id;

  if (!exam || !id) {
    throw createError({
      statusCode: 400,
      statusMessage: "examId and id query parameters are required",
    });
  }

  await db.submission.delete({
    where: {
      id,
    },
  });

  return {
    statusCode: 200,
    statusMessage: "Leaderboard deleted successfully",
  };
});
