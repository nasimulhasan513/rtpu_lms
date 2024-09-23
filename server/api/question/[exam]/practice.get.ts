export default defineEventHandler(async (event) => {
  const id = event.context.params?.exam;
  const userId = event.context.user?.id;

  if (!userId || !id) {
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const exam = await db.exam.findUnique({
    where: { id: id },
  });

  if (!exam) {
    return createError({
      statusCode: 404,
      statusMessage: "Exam not found",
    });
  }

  // const cacheKey = `practice-questions-${id}`;

  // const cachedQuestions = await getCache(cacheKey);

  // if (cachedQuestions) {
  //   return {
  //     statusCode: 200,
  //     exam,
  //     questions: cachedQuestions,
  //   };
  // }

  const questions = await db.question.findMany({
    where: { examId: id },

    include: {
      options: {
        select: {
          id: true,
          option_text: true,
          correct: true,
        },
      },
      subject: {
        select: {
          name: true,
        },
      },
    },
  });

  // await setCache(cacheKey, questions);

  return {
    statusCode: 200,
    exam,
    questions,
  };
});
