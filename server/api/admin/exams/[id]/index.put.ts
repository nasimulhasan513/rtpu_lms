import { z } from 'zod';

const examSchema = z.object({
  title: z.string(),
  courseId: z.string(),
  subjectId: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  duration: z.number(),
  totalMarks: z.number(),
  resultPublishTime: z.string(),
  solutionPublishTime: z.string(),
});

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const body = await readBody(event);

  if (!id) {
    return createError({
      statusCode: 400,
      message: 'Exam ID is required',
    });
  }

  try {
    const examData = examSchema.parse(body);

    const updatedExam = await db.exam.update({
      where: { id },
      data: {
        ...examData,
        startTime: new Date(examData.startTime),
        endTime: new Date(examData.endTime),
        resultPublishTime: new Date(examData.resultPublishTime),
        solutionPublishTime: new Date(examData.solutionPublishTime),
        courseExams: {
          update: {
            where: {
              examId_courseId: {
                examId: id,
                courseId: examData.courseId,
              },
            },
            data: {
              courseId: examData.courseId,
            },
          },
        },
      },
    });

    return {
      statusCode: 200,
      body: updatedExam,
    };
  } catch (error) {
    console.error('Error updating exam:', error);
    return createError({
      statusCode: 400,
      message: error instanceof z.ZodError ? error.errors[0].message : 'Invalid exam data',
    });
  }
});