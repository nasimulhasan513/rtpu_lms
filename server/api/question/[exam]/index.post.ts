export default defineEventHandler(async (event) => {
  const id = event.context.params?.exam;
  const userId = event.context.user?.id;

  const { answers } = await readBody(event);

  if (!userId || !id) {
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
      passMarks: true,
    },
  });

  if (!exam) {
    return createError({
      statusCode: 404,
      statusMessage: "Exam not found",
    });
  }

  let submission = await db.submission.findFirst({
    where: {
      examId: id,
      userId: userId,
      status: "pending",
    },
  });

  if (!submission) {
    return createError({
      statusCode: 404,
      statusMessage: "Submission not found",
    });
  }

  let duration =
    new Date().getTime() - new Date(submission?.createdAt).getTime();
  const optionIds = answers.map((a) => a.a);
  const subjectBasedTotalMarks = await db.question.groupBy({
    by: ["subjectId"],
    where: {
      examId: id,
    },
    _count: {
      id: true,
    },
  });

  const subjectNames = await db.subject.findMany({
    where: {
      id: {
        in: subjectBasedTotalMarks.map((s) => s.subjectId),
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

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

  const subjectMarks = subjectBasedTotalMarks.map((s: any) => {
    const correct = answers.filter(
      (a) => a.s === s.subjectId && correctOptions.find((o) => o.id === a.a)
    ).length;
    const wrong = answers.filter(
      (a) => a.s === s.subjectId && !correctOptions.find((o) => o.id === a.a)
    ).length;
    // @ts-ignore
    const skipped =
      subjectBasedTotalMarks.find((sbm) => sbm.subjectId === s.subjectId)
        ?._count.id -
      (correct + wrong);
    const marks = exam.negativeMarking ? correct - wrong * 0.25 : correct;

    const isPassed =
      marks >= (correct + wrong + skipped) * ((exam.passMarks || 33) / 100);

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

  const negMarks = subjectMarks.reduce(
    (acc, curr) => acc + curr.negativeMarks,
    0
  );

  const correct = subjectMarks.reduce((acc, curr) => acc + curr.correct, 0);
  const wrong = subjectMarks.reduce((acc, curr) => acc + curr.wrong, 0);
  const skipped = subjectMarks.reduce((acc, curr) => acc + curr.skipped, 0);
  const marks = subjectMarks.reduce((acc, curr) => acc + curr.marks, 0);

  const isPassed = subjectMarks.every((s) => s.isPassed);

  await db.submission.update({
    where: {
      id: submission.id,
    },
    data: {
      correct,
      wrong,
      skipped,
      answers,
      duration,
      subjectBreakDown: subjectMarks,
      submittedAt: new Date(),
      marks: marks,
      status: "submitted",
      passed: Boolean(isPassed),
    },
  });

  return {
    statusCode: 200,
    statusMessage: "Submitted successfully",
  };
});
