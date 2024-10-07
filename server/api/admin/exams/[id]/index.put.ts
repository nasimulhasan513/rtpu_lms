import { z } from "zod";
import { examSchema } from "~/schema/exam.schema";
import { formatDate } from "~/server/utils/format";

export default defineEventHandler(async (event) => {
  await validateRequest(event, ["admin", "contributor"]);
  const id = event.context.params?.id;
  const body = await readBody(event);

  if (!id) {
    return createError({
      statusCode: 400,
      message: "Exam ID is required",
    });
  }

  try {
    const examData = examSchema.parse(body);

    const updatedExam = await db.exam.update({
      where: { id },
      data: {
        title: examData.title,
        description: examData.description,
        subjectId: examData.subjectId,
        duration: examData.duration,
        totalMarks: examData.totalMarks,
        negativeMarking: examData.negativeMarking,
        instantResult: examData.instantResult,
        shuffleQuestion: examData.shuffleQuestion,
        passMarks: examData.passMarks,
        startTime: formatDate(examData.startTime),
        endTime: formatDate(examData.endTime),
        resultPublishTime: formatDate(examData.resultPublishTime),
        courseExams: {
          deleteMany: {},
          create: examData.courses.map((courseId) => ({
            courseId,
          })),
        },
      },
    });

    return {
      statusCode: 200,
      body: "Exam updated successfully",
    };
  } catch (error) {
    console.error("Error updating exam:", error);
    return createError({
      statusCode: 400,
      message:
        error instanceof z.ZodError
          ? error.errors[0].message
          : "Invalid exam data",
    });
  }
});
