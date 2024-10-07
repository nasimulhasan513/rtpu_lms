import {  PRACTICE_QUESTIONS } from "~/server/utils/cachekeys";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.exam;
  const userId = event.context.user?.id;

  if (!userId || !id) {
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }


  const cacheKey = `${PRACTICE_QUESTIONS}:${id}`;
  const cachedSolution = await getCache(cacheKey);  
  let exam;
  let questions;

  if(cachedSolution){
    exam = cachedSolution.exam;
    questions = cachedSolution.questions;
  }
  else{
    exam = await db.exam.findUnique({
      where: { id: id },
    });
  
    if (!exam) {
      return createError({
        statusCode: 404,
        statusMessage: "Exam not found",
      });
    }
  
  
     questions = await db.question.findMany({
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
  }

  




  const submissionData = await db.submission.findFirst({
    where: {
      examId: id,
      userId: userId,
    },

    select: {
      answers: true,
      correct: true,
      wrong: true,
      skipped: true,
      subjectBreakDown: true,
    },
  });

  

  const submission =
    // @ts-ignore
    submissionData && submissionData?.answers ? submissionData.answers : [];

  const data = {
    statusCode: 200,
    exam: {
      ...exam,
      correct: submissionData?.correct,
      wrong: submissionData?.wrong,
      skipped: submissionData?.skipped,
    },
    questions,
    submission,
    subjectBreakDown: submissionData?.subjectBreakDown,
  };

  await setCache(cacheKey, data, 60 * 60 * 24 * 7);

  return data;
});
