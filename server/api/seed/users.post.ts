import { z } from "zod";
import { faker } from "@faker-js/faker";

const countSchema = z.object({
  count: z.number().int().positive(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const { count } = countSchema.parse(body);

    

    const users = Array.from({ length: count }, () => ({
      id: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      phone: faker.phone.number(),
      image: faker.image.avatar(),
      institute: faker.company.name(),
      hsc_batch: faker.date.past().getFullYear().toString(),
    }));

    const createdUsers = await db.user.createMany({
      data: users,
    });

    return {
      statusCode: 201,
      message: `${createdUsers.count} users created successfully`,
    };
  } catch (error) {
    console.error("Error creating users:", error);
    return createError({
      statusCode: 400,
      message:
        error instanceof z.ZodError
          ? error.errors[0].message
          : "Invalid user data",
    });
  }
});
