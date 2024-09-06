import { z } from "zod";
import { faker } from "@faker-js/faker";

const countSchema = z.object({
  count: z.number().int().positive(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const { count } = countSchema.parse(body);

    const categories = Array.from({ length: count }, () => ({
      name: faker.commerce.department(),
      image: faker.image.url(),
    }));

    const createdCategories = await db.category.createMany({
      data: categories,
    });

    return {
      statusCode: 201,
      message: `${createdCategories.count} categories created successfully`,
    };
  } catch (error) {
    console.error("Error creating categories:", error);
    return createError({
      statusCode: 400,
      message:
        error instanceof z.ZodError
          ? error.errors[0].message
          : "Invalid category data",
    });
  }
});
