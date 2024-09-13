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

  if (
    new Date(exam.startTime) > new Date() ||
    new Date(exam.endTime) < new Date()
  ) {
    return createError({
      statusCode: 403,
      statusMessage: "Exam is not active",
    });
  }

  const questions = await db.question.findMany({
    where: { examId: id },

    include: {
      options: {
        select: {
          id: true,
          option_text: true,
        },
      },
      subject: {
        select: {
          name: true,
        },
      },
      explain: false,
    },
  });

  let submission = await db.submission.findFirst({
    where: {
      examId: id,
      userId: userId,
    },
  });

  if (submission && submission?.status !== "pending") {
    return createError({
      statusCode: 403,
      statusMessage: "Submission is not pending",
    });
  }

  if (!submission) {
    submission = await db.submission.create({
      data: {
        examId: id,
        userId: userId,
        status: "pending",
      },
    });
  }

  return {
    statusCode: 200,
    exam,
    questions,
    submission,
  };
});
