import { zh } from "h3-zod";
import { CourseSchema } from "~/schema/course.schema";

export default defineEventHandler(async (event) => {

  await validateRequest(event, ["ADMIN", "contributor"]);


  const { data, error } = await zh.useSafeValidatedBody(event, CourseSchema);

  if (error) {
    return {
      status: 400,
      statusMessage: error,
    };
  }
 
  await db.course.create({
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
      teachers: { create: data.teachers.map((id) => ({ teacherId: id })) },
      asg_shop_id: data.asg_shop_id,
      shop_charge: data.shop_charge,
      sms_charge: data.sms_charge,
      is_class: data.is_class,
      is_mcq: data.is_mcq,
      is_cq: data.is_cq,
    },
  });

  return {
    statusCode: 201,
    statusMessage: "Course created successfully",
  };
});
