export default defineEventHandler(async (event) => {
  await validateRequest(event);

  const transaction_id = event.context.params?.slug as string;

  const enrollment = await query(
    `
    SELECT ce.transaction_id,ce.payable_amount,ce.status,ce.enrolled_at, c.name as course_name, u.name as user_name, u.email as user_email
    FROM course_enrollments ce
    JOIN courses c ON ce.course_id = c.id
    JOIN users u ON ce.user_id = u.id
    WHERE ce.id = $1
  `,
    [transaction_id]
  );

  if (!enrollment[0]) {
    return createError({
      statusCode: 404,
      statusMessage: "Enrollment not found",
    });
  }

  return {
    message: "Payment details",
    data: enrollment[0],
  };
});
