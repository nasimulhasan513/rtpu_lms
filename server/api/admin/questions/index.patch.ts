import { z } from "zod";
import { db } from "~/server/utils/auth";

const updateQuestionSchema = z.array(
  z.object({
    id: z.string(),
    serial: z.number().int().positive(),
  })
);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const questions = updateQuestionSchema.parse(body);

  try {
  
    await Promise.all(
      questions.map(async ({ id, serial }) => {
        await db.question.update({
          where: { id },
          data: { serial: serial || 0 },
        });
      })
    );

    return {
      statusCode: 200,
      body: "Questions updated successfully",
    };
  } catch (error) {
    console.error("Error updating question serials:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update question serials",
    });
  }
});
