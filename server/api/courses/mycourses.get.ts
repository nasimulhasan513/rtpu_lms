export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id;

  const enrollments = await query(
    `SELECT ce.transaction_id, c.name as course_name, c.slug as course_slug, c.image as course_thumbnail, c.fb_group as course_fb_group 
    FROM course_enrollments ce
    JOIN courses c ON ce.course_id = c.id
    WHERE ce.user_id = $1`,
    [userId]
  );

  return {
    message: "Course enrollments fetched successfully",
    enrollments,
  };
});
