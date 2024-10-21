import { CourseStatus } from "@prisma/client";
import { zh } from "h3-zod";
import { CourseSchema } from "~/schema/course.schema";

export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);

  const { data, error } = await zh.useSafeValidatedBody(event, CourseSchema);

  if (error) {
    return {
      status: 400,
      statusMessage: error,
    };
  }

  const courseId = event.context.params?.id;

  if (!courseId) {
    return {
      statusCode: 400,
      statusMessage: "Invalid course id",
    };
  }

  await db.course.update({
    where: {
      id: courseId,
    },
    data: {
      slug: data.slug,
      name: data.name,
      short_description: data.short_description,
      description: data.description,
      image: data.image,
      promo_video: data.promo_video,
      sale_price: data.sale_price,
      regular_price: data.regular_price,
      status: data.status as CourseStatus,
      duration: data.duration,
      enrolled: data.enrolled,
      fb_group: data.fb_group,
      tg_group: data.tg_group,
      keywords: { set: data.keywords },
      order: data.order,
      category_id: data.category_id,
      teachers: {
        deleteMany: {},
        create: data.teachers.map((id) => ({ teacher_id: id })),
      },
    },
  });

  return {
    statusCode: 201,
    statusMessage: "Course created successfully",
  };
});
