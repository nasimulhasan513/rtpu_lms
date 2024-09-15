import { z } from "zod";

const submitSchema = z.object({
  images: z.array(z.string()),
});

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const body = await readBody(event);

  try {
    const { images } = submitSchema.parse(body);

    const submission = await db.assignmentSubmission.create({
      data: {
        assignment: { connect: { id } },
        user: { connect: { id: event.context.user?.id } },
        content: JSON.stringify(images),
      },
    });

    return { success: true, submissionId: submission.id };
  } catch (error) {
    throw createError({
      statusCode: 400,
      message:
        error instanceof z.ZodError
          ? error.errors[0].message
          : "Invalid submission data",
    });
  }
});
