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

  const questionId = event.context.params?.id;

  

  try {
    // Update the question details
    const updatedQuestion = await db.question.update({
      where: { id: questionId },
      data: {
        question,
        subject: {
          connect: {
            id: subjectId,
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
      },
    });
 // Update the options
 await Promise.all(
  options.map(async (option) => {
    console.log('====================================');
    console.log(option);
    console.log('====================================');
    if (option.id) {
      // Update existing option
      await db.option.update({
        where: { id: option.id },
        data: {
          option_text: option.option_text,
          correct: option.correct,
        },
      });
    } 
  })
);
   

    return {
      statusCode: 200,
      message: "Question updated successfully",
      data: updatedQuestion,
    };
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    return createError({
      statusCode: 500,
      statusMessage: "An error occurred while updating the question",
    });
  }
});
