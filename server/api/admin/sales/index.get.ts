export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);

  const urlQuery = getQuery(event);
  const page = parseInt(urlQuery.page as string) || 1;
  const limit = parseInt(urlQuery.limit as string) || 10;
  const offset = (page - 1) * limit;

  const start = (urlQuery.start as string) || "2024-01-01";
  const end = (urlQuery.end as string) || new Date().toISOString();
  const status = urlQuery.status as string;

  const statusCondition =
    status && status !== "all"
      ? `AND ce.status = '${status}'`
      : "AND ce.status = 'success'";

  const rawQuery = `
    SELECT 
      ce.id,
      ce.enrolled_at,
      ce.transaction_id,
      ce.payable_amount,
      ce.paid_amount,
      ce.status,
      c.name AS course_name,
      u.id AS user_id,
      u.name AS user_name,
      u.email AS user_email
    FROM course_enrollments ce
    JOIN courses c ON ce.course_id = c.id
    JOIN users u ON ce.user_id = u.id
    WHERE ce.enrolled_at >= $1
      AND ce.enrolled_at <= $2
      ${statusCondition}
    ORDER BY ce.enrolled_at DESC
    LIMIT $3
    OFFSET $4
  `;

  const courseEnrollments = await query(rawQuery, [start, end, limit, offset]);

  // Get total count for pagination
  const countQuery = `
    SELECT COUNT(*) as total
    FROM course_enrollments ce
    WHERE ce.enrolled_at >= $1
      AND ce.enrolled_at <= $2
      ${statusCondition}
  `;

  const [{ total }] = await query(countQuery, [start, end]);

  return {
    courseEnrollments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
});
