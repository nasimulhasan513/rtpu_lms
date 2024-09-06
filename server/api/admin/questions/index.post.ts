export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { question, options, subjectId, chapterId, difficulty, explain, examId } = body;

  if (!question || !options || !subjectId || !chapterId) {
    return {
      statusCode: 400,
      message: "Required fields are missing",
    };
  }

  let creatorId = event.context.user?.id;

  try {
    await db.question.create({
      data: {
        question,
        subject: {
          connect: {
            id: subjectId,
          },
        },
        exam: {
          connect: {
            id: examId,
          },
        },
        chapter: {
          connect: {
            id: chapterId,
          },
        },
        creator: {
          connect: {
            id: creatorId,
          },
        },
        difficulty: difficulty || "Medium",
        explain,
        options: {
          create: options.map((option) => ({
            option_text: option.option_text,
            correct: option.correct,
          })),
        },
      },
    });

    return {
      statusCode: 201,
      message: "Question created successfully",
    };
  } catch (error) {
    console.error(error);
    return createError({
      statusCode: 500,
      statusMessage: "An error occurred while creating the question",
    });
  }
});
