import { zh } from "h3-zod";
import { CategorySchema } from "~/schema/category.schema";

export default defineEventHandler(async (event) => {
  const { data, error } = await zh.useSafeValidatedBody(event, CategorySchema);

  if (error) {
    return {
      status: 400,
      statusMessage: error,
    };
  }

  await db.category.create({
    data: {
      name: data.name,
      image: data.image,
    },
  });

  return {
    statusCode: 201,
    statusMessage: "Course created successfully",
  };
});
