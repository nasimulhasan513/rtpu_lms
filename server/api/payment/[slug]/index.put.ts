export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { slug } = body;

  const user_id = event.context.user?.id;

  if (!user_id) {
    return createError({ statusCode: 401, statusMessage: "Unauthorized" });
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
        course_id: course.id,
        user_id: user_id,
        transaction_id: transactionId,
        price: course.sale_price,
        discount: 0,
        payable_amount: course.sale_price,
      },
    });
  }
});
