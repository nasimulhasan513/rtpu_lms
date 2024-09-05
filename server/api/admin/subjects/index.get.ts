export default defineEventHandler(async (event) => {
  const subjects = await db.subject.findMany({
    include: {
      chapters: true,
    },
  });

  return {
    statusCode: 200,
    body: subjects,
  };
});
