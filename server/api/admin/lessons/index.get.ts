export default defineEventHandler(async (event) => {
  const lessons = await db.lesson.findMany({
    include: {
      chapter: true,
      subject: true,
    },
  });

  return {
    statusCode: 200,
    body: lessons,
  };
});
