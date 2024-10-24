import { zh } from "h3-zod";
import { CategorySchema } from "~/schema/category.schema";
import { COURSE_CATEGORIES } from "~/server/utils/cachekeys";

export default defineEventHandler(async (event) => {
  await validateRequest(event, ["admin"]);

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
      logo: data.logo,
      platformName: data.platformName,
      price: data.price,
      is_class: data.is_class,
      is_mcq: data.is_mcq,
      is_cq: data.is_cq,
    },
  });

  await deleteCache(COURSE_CATEGORIES);

  return {
    statusCode: 201,
    statusMessage: "Course created successfully",
  };
});
