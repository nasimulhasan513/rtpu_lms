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

  const id = event.context.params?.id;

  await db.category.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      slug: data.slug,
      image: data.image,
    },
  });

  return {
    statusCode: 201,
    statusMessage: "Course created successfully",
  };
});
