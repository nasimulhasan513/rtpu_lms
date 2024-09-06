import { z } from "zod";
import { faker } from "@faker-js/faker";

const countSchema = z.object({
  count: z.number().int().positive(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const { count } = countSchema.parse(body);

    const subjects = Array.from({ length: count }, () => ({
      name: faker.lorem.word(),
    }));

    const createdSubjects = await db.subject.createMany({
      data: subjects,
    });

    return {
      statusCode: 201,
      message: `${createdSubjects.count} subjects created successfully`,
    };
  } catch (error) {
    console.error("Error creating subjects:", error);
    return createError({
      statusCode: 400,
      message:
        error instanceof z.ZodError
          ? error.errors[0].message
          : "Invalid subject data",
    });
  }
});
