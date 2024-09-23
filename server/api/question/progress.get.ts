export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id;

  if (!userId) {
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const submissions = await db.submission.findMany({
    where: {
      userId: userId,
      status: "submitted",
    },
    select: {
      id: true,
      exam: {
        select: {
          title: true,
        },
      },
      marks: true,
      correct: true,
      wrong: true,
    },
  });

  return {
    submissions,
  };
});
