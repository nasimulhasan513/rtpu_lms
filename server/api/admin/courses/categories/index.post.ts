import { db } from "~/server/utils/auth";
import { CategorySchema } from "~/schema/category.schema";
import { COURSE_CATEGORIES } from "~/server/utils/cachekeys";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const validatedData = CategorySchema.parse(body);

  const category = await db.category.create({
    data: {
      name: validatedData.name,
      slug: validatedData.slug,
      image: validatedData.image,
      logo: validatedData.logo,
      platformName: validatedData.platformName,
      price: validatedData.price,
      is_class: validatedData.is_class,
      is_mcq: validatedData.is_mcq,
      is_cq: validatedData.is_cq,
    },
  });


  await deleteCache(COURSE_CATEGORIES);

  return category;
});
