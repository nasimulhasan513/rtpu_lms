export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) {
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const exam = await db.exam.findUnique({
    where: {
      id: id,
    },
    select: {
      negativeMarking: true,
      totalMarks: true,
    },
  });

  if (!exam) {
    return createError({
      statusCode: 404,
      statusMessage: "Exam not found",
    });
  }

  let submissions = await db.submission.findMany({
    where: {
      examId: id,
    },
    select: {
      id: true,
      answers: true,
    },
  });

  if (!submissions || submissions.length === 0) {
    return createError({
      statusCode: 404,
      statusMessage: "Submission not found",
    });
  }

  const optionIds = submissions.flatMap(
    (submission) => submission.answers?.map((a) => a.a) || []
  );

  const correctOptions = await db.option.findMany({
    where: {
      id: {
        in: optionIds,
      },
      correct: true,
    },
    select: {
      id: true,
    },
  });

  const correctOptionIds = new Set(correctOptions.map((option) => option.id));

  await Promise.all(
    submissions.map(async (submission) => {
      if (
        !submission.answers ||
        !Array.isArray(submission.answers) ||
        submission.answers.length === 0
      )
        return;

      const submissionOptionIds = submission.answers.map((a) => a.a);
      const marks = submissionOptionIds.filter((id) =>
        correctOptionIds.has(id)
      ).length;

      const negMarks = exam.negativeMarking
        ? (submissionOptionIds.length - marks) * 0.25
        : 0;

      const correct = marks;
      const wrong = submissionOptionIds.length - marks;
      const skipped = exam.totalMarks - (correct + wrong);
     
      await db.submission.update({
        where: {
          id: submission.id,
        },
        data: {
          correct,
          wrong,
          skipped,
          marks: marks - negMarks,
        },
      });
    })
  );

  return {
    statusCode: 200,
    statusMessage: "Submitted successfully",
  };
});
