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
  });

  if (!submissions || submissions.length === 0) {
    return createError({
      statusCode: 404,
      statusMessage: "Submission not found",
    });
  }

  await Promise.all(
    submissions.map(async (submission) => {
      if (
        !submission.answers ||
        !Array.isArray(submission.answers) ||
        submission.answers.length === 0
      )
        return;

      const optionIds = submission?.answers.map((a) => a.a);

      const marks = await db.option.count({
        where: {
          id: {
            in: optionIds,
          },
          correct: true,
        },
      });

      const negMarks = exam.negativeMarking
        ? (optionIds.length - marks) * 0.25
        : 0;

      const correct = marks;
      const wrong = optionIds.length - marks;
      const skipped = exam.totalMarks - (correct + wrong);
      console.log(correct, wrong, skipped, marks, negMarks);

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
