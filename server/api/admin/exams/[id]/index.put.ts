import { z } from "zod";
import { formatDate } from "~/server/utils/format";

const examSchema = z.object({
  title: z.string(),
  courses: z.array(z.string()),
  subjectId: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  description: z.string().optional().nullable(),
  duration: z.number(),
  totalMarks: z.number(),
  resultPublishTime: z.string(),
  solutionPublishTime: z.string(),
  instantResult: z.boolean(),
  negativeMarking: z.boolean(),
});

export default defineEventHandler(async (event) => {
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
        startTime: formatDate(examData.startTime),
        endTime: formatDate(examData.endTime),
        resultPublishTime: formatDate(examData.resultPublishTime),
        solutionPublishTime: formatDate(examData.solutionPublishTime),
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
