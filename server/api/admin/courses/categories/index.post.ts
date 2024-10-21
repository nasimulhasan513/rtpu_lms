import { db } from "~/server/utils/auth";
import { CategorySchema } from "~/schema/category.schema";
import { COURSE_CATEGORIES } from "~/server/utils/cachekeys";

export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);

  const body = await readBody(event);
  const validatedData = CategorySchema.parse(body);

  const category = await db.category.create({
    data: {
      name: validatedData.name,
      slug: validatedData.slug,
      image: validatedData.image,
    },
  });

  await deleteCache(COURSE_CATEGORIES);

  return category;
});
