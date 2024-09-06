import { z } from "zod";

const examSchema = z.object({
  title: z.string(),
  courses: z.array(z.string()), // Fix: Specify the type of array elements
  subjectId: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  duration: z.number(),
  totalMarks: z.number(),
  resultPublishTime: z.string(),
  solutionPublishTime: z.string(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const examData = examSchema.parse(body);

    const exam = await db.exam.create({
      data: {
        title: examData.title,
        startTime: new Date(examData.startTime),
        endTime: new Date(examData.endTime),
        duration: examData.duration,
        totalMarks: examData.totalMarks,
        resultPublishTime: new Date(examData.resultPublishTime),
        solutionPublishTime: new Date(examData.solutionPublishTime),
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
