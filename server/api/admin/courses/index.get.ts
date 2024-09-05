export default defineEventHandler(async (event) => {
  const courses = await db.course.findMany({
    cacheStrategy: { ttl: 60 },
  });

  return {
    statusCode: 200,
    body: courses,
  };
});
