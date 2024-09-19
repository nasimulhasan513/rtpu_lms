import { z } from "zod";
import { formatDate } from "~/server/utils/format";

const examSchema = z.object({
  title: z.string(),
  courses: z.array(z.string()), // Fix: Specify the type of array elements
  subjectId: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  description: z.string().optional().nullable(),
  duration: z.number(),
  totalMarks: z.number(),
  instantResult: z.boolean(),
  resultPublishTime: z.string().optional(),
  solutionPublishTime: z.string().optional(),
  negativeMarking: z.boolean(),
});

export default defineEventHandler(async (event) => {
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
        resultPublishTime: examData.resultPublishTime ? formatDate(examData.resultPublishTime) : undefined,
        solutionPublishTime: examData.solutionPublishTime ? formatDate(examData.solutionPublishTime) : undefined,
        negativeMarking: examData.negativeMarking,
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
