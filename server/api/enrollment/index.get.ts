export default defineEventHandler(async (event) => {
  await validateRequest(event);

  const { courseSlug } = getQuery(event);

  const userId = event.context.user?.id;

  const role = event.context.user?.role;

  if (role !== "USER") {
    return {
      enrollment: true,
    };
  }

  const enrollment = await query(
    `SELECT ce.id
     FROM course_enrollments ce
     JOIN courses c ON ce.course_id = c.id
     WHERE ce.user_id = $1 AND c.slug = $2 AND ce.status = 'success'
     LIMIT 1`,
    [userId, courseSlug]
  );

  if (enrollment.length === 0) {
    return {
      enrollment: false,
    };
  }

  return {
    enrollment,
  };
});
