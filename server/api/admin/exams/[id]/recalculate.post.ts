export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) {
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const exam = await db.exam.findUnique({
    where: { id },
    select: {
      negativeMarking: true,
      totalMarks: true,
      passMarks: true,
    },
  });

  if (!exam) {
    return createError({
      statusCode: 404,
      statusMessage: "Exam not found",
    });
  }

  const submissions = await db.submission.findMany({
    where: { examId: id },
    select: {
      id: true,
      answers: true,
    },
    take: 10,
  });

  if (submissions.length === 0) {
    return createError({
      statusCode: 404,
      statusMessage: "No submissions found",
    });
  }

  const subjectBasedTotalMarks = await db.question.groupBy({
    by: ["subjectId"],
    where: { examId: id },
    _count: { id: true },
  });

  const subjectNames = await db.subject.findMany({
    where: {
      id: { in: subjectBasedTotalMarks.map((s) => s.subjectId) },
    },
    select: { id: true, name: true },
  });

  const questions = await db.question.findMany({
    where: {
      examId: id,
    },
    select: {
      id: true,
      options: {
        where: {
          correct: true,
        },
        select: {
          id: true,
          correct: true,
        },
      },
    },
  });

  const correctOptionIds = [
    ...new Set(questions.map((q) => q.options.map((o) => o.id)).flat()),
  ];

  await Promise.all(
    submissions.map(async (submission) => {
      const answers = submission?.answers;

      const subjectMarks = subjectBasedTotalMarks.map((s) => {
        const subjectAnswers = answers.filter((a) => a.s === s.subjectId);

        const correct = subjectAnswers.filter((a) =>
          correctOptionIds.includes(a.a)
        ).length;
        const wrong = subjectAnswers.length - correct;
        const skipped = s._count.id - (correct + wrong);
        const marks = exam.negativeMarking ? correct - wrong * 0.25 : correct;
        const isPassed = marks >= s._count.id * ((exam.passMarks || 33) / 100);

        return {
          subjectId: s.subjectId,
          subjectName: subjectNames.find((sbm) => sbm.id === s.subjectId)?.name,
          correct,
          wrong,
          skipped,
          negativeMarks: exam.negativeMarking ? wrong * 0.25 : 0,
          marks,
          isPassed,
        };
      });

      const totalCorrect = subjectMarks.reduce(
        (acc, curr) => acc + curr.correct,
        0
      );
      const totalWrong = subjectMarks.reduce(
        (acc, curr) => acc + curr.wrong,
        0
      );
      const totalSkipped = subjectMarks.reduce(
        (acc, curr) => acc + curr.skipped,
        0
      );
      const totalMarks = subjectMarks.reduce(
        (acc, curr) => acc + curr.marks,
        0
      );
      const isPassed = subjectMarks.every((s) => s.isPassed);

      await db.submission.update({
        where: { id: submission.id },
        data: {
          correct: totalCorrect,
          wrong: totalWrong,
          skipped: totalSkipped,
          subjectBreakDown: subjectMarks,
          marks: totalMarks,
          passed: isPassed,
        },
      });
    })
  );

  return {
    statusCode: 200,
    statusMessage: "Recalculation completed successfully",
  };
});
