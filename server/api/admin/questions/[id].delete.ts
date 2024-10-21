export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN", "contributor"]);
  const body = await readBody(event);
  const questionId = event.context.params?.id;

  try {
    await db.option.deleteMany({
      where: { questionId: questionId },
    });

    const question = await db.question.findUnique({
      where: { id: questionId },
    });
    
    const examId = question?.examId;
    await deleteCache(`exam-questions-${examId}`);

    return {
      statusCode: 200,
      message: "Question deleted successfully",
    };
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    return createError({
      statusCode: 500,
      statusMessage: "An error occurred while deleting the question",
    });
  }
});
