export default defineEventHandler(async (event) => {
  await validateRequest(event);

  const user_id = event.context.user?.id;

  if (!user_id) {
    return createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const slug = event.context.params?.slug as string;

  if (!slug) {
    return createError({ statusCode: 400, statusMessage: "Slug is required" });
  }

  const course = await db.course.findFirst({ where: { slug } });

  if (!course) {
    return createError({ statusCode: 404, statusMessage: "Course not found" });
  }

  let enrollment = await db.courseEnrollment.findFirst({
    where: { course_id: course.id, user_id },
  });

  const transactionId = `${course.id}-${user_id}-${Date.now()}`;

  if (!enrollment) {
    enrollment = await db.courseEnrollment.create({
      data: {
        transaction_id: transactionId,
        course_id: course.id,
        user_id: user_id,
        price: course.sale_price,
        discount: 0,
        payable_amount: course.sale_price,
        paid_amount: 0,
        status: "pending",
      },
    });
  } else {
    await db.courseEnrollment.update({
      where: { id: enrollment.id },
      data: {
        payable_amount: course.sale_price,
        discount: 0,
        price: course.sale_price,
        status: "pending",
        updated_at: new Date(),
      },
    });
  }

  return {
    message: "Course purchase initiated",
  };
});
