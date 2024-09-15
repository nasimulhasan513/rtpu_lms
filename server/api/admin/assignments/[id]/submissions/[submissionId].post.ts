import { z } from 'zod';

const evaluationSchema = z.object({
  grade: z.number().min(0).max(100),
  feedback: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  const assignmentId = event.context.params?.id;
  const submissionId = event.context.params?.submissionId;

  if (!assignmentId || !submissionId) {
    throw createError({
      statusCode: 400,
      message: 'Assignment ID and Submission ID are required',
    });
  }

  const body = await readBody(event);
  const validatedData = evaluationSchema.parse(body);

  try {
    const updatedSubmission = await db.submission.update({
      where: { id: submissionId, assignmentId },
      data: {
        grade: validatedData.grade,
        feedback: validatedData.feedback,
        evaluatedAt: new Date(),
      },
    });

    return updatedSubmission;
  } catch (error) {
    console.error('Error evaluating submission:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to evaluate submission',
    });
  }
});