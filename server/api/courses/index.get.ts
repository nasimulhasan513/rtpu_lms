export default defineEventHandler(async (event) => {
  try {
    const courses = await query(
      `SELECT 
        c.id,
        c.name,
        c.slug,
        c.image,
        c.sale_price,
        c.regular_price,
        c.duration,
        c.enrolled,
        cat.name AS category_name,
        CASE WHEN ce.id IS NOT NULL THEN true ELSE false END AS is_enrolled
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN course_enrollments ce ON c.id = ce.course_id
      WHERE c.status = 'PUBLISHED'
    `
    );

    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      status: 500,
      body: { message: "An error occurred while fetching courses" },
    };
  }
});
