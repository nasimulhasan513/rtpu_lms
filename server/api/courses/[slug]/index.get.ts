import { query } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug;

  if (!slug) {
    return {
      status: 400,
      body: { message: "Course slug is required" },
    };
  }

  try {
    const courseQuery = `
      SELECT 
             c.name,
             c.slug,
             c.short_description,
             c.description,
             c.image,
             c.sale_price,
             c.regular_price,
             c.promo_video,
             c.duration,
             c.enrolled,
             c.keywords,
             json_agg(json_build_object(
               'id', t.id,
               'name', t.name,
               'image', t.image,
               'designation', t.designation
             )) AS teachers
      FROM courses c
      LEFT JOIN course_teachers ct ON c.id = ct.course_id
      LEFT JOIN teachers t ON ct.teacher_id = t.id
      WHERE c.slug = $1 AND t.deleted_at IS NULL
      GROUP BY c.id
    `;

    const result = await query(courseQuery, [slug]);

    if (result.length === 0) {
      return {
        status: 404,
        body: { message: "Course not found" },
      };
    }

    return result;
  } catch (error) {
    console.error("Error fetching course:", error);
    return {
      status: 500,
      body: { message: "An error occurred while fetching the course" },
    };
  }
});
