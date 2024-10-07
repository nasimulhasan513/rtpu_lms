import { zh } from "h3-zod";
import { CourseSchema } from "~/schema/course.schema";

export default defineEventHandler(async (event) => {
  await validateRequest(event, ["admin"]);

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
      status: data.status,
      duration: data.duration,
      enrolled: data.enrolled,
      fb_group: data.fb_group,
      tg_group: data.tg_group,
      keywords: { set: data.keywords },
      order: data.order,
      categoryId: data.categoryId,
      asg_shop_id: data.asg_shop_id,
      shop_charge: data.shop_charge,
      sms_charge: data.sms_charge,
      is_class: data.is_class,
      is_mcq: data.is_mcq,
      is_cq: data.is_cq,
      teachers: {
        deleteMany: {},
        create: data.teachers.map((id) => ({ teacherId: id })),
      },
    },
  });

  return {
    statusCode: 201,
    statusMessage: "Course created successfully",
  };
});
