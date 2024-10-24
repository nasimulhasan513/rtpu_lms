import { z } from "zod";
import { examSchema } from "~/schema/exam.schema";
import { formatDate } from "~/server/utils/format";



export default defineEventHandler(async (event) => {
  await validateRequest(event, ["admin", "contributor"]);

  const body = await readBody(event);

  try {
    const examData = examSchema.parse(body);

    const exam = await db.exam.create({
      data: {
        title: examData.title,
        description: examData.description,
        startTime: formatDate(examData.startTime),
        endTime: formatDate(examData.endTime),
        duration: examData.duration,
        totalMarks: examData.totalMarks,
        instantResult: examData.instantResult,
        resultPublishTime: formatDate(examData.resultPublishTime),
        negativeMarking: examData.negativeMarking,
        passMarks: examData.passMarks,
        shuffleQuestion: examData.shuffleQuestion,
        subject: {
          connect: { id: examData.subjectId }
        },
        courseExams: {
          create: examData.courses.map((courseId) => ({ courseId }))
        }
      },
    });

    return {
      statusCode: 201,
      body: exam,
    };
  } catch (error) {
    console.error("Error creating exam:", error);
    return createError({
      statusCode: 400,
      message:
        error instanceof z.ZodError
          ? error.errors[0].message
          : "Invalid exam data",
    });
  }
});
