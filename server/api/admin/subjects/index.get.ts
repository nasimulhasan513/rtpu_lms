export default defineEventHandler(async (event) => {
  const subjects = await db.subject.findMany({
    include: {
      chapters: true,
    },
    orderBy: {
      order: "asc",
    },
  });

  return {
    statusCode: 200,
    body: subjects,
  };
});
