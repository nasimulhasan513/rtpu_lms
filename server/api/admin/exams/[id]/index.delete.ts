export default defineEventHandler(async (event) => {


  await validateRequest(event, ["ADMIN", "contributor"]);
  const id = event.context.params?.id;

  if (!id) {
    return createError({
      statusCode: 400,
      message: "Exam ID is required",
    });
  }

  try {
    // Delete related CourseExam entries
    await db.courseExam.deleteMany({
      where: {
        examId: id,
      },
    });

    // Delete related options and questions
    const questions = await db.question.findMany({
      where: {
        examId: id,
      },
      select: {
        id: true,
      },
    });

    const questionIds = questions.map((q) => q.id);

    await db.option.deleteMany({
      where: {
        questionId: {
          in: questionIds,
        },
      },
    });

    await db.question.deleteMany({
      where: {
        examId: id,
      },
    });

    // Delete related submissions
    await db.submission.deleteMany({
      where: {
        examId: id,
      },
    });

    // Delete the exam
    await db.exam.delete({
      where: { id },
    });

    return {
      statusCode: 200,
      body: { message: "Exam and related data deleted successfully" },
    };
  } catch (error) {
    console.error("Error deleting exam:", error);
    return createError({
      statusCode: 500,
      message: "Failed to delete exam",
    });
  }
});
