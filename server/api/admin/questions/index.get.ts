export default defineEventHandler(async (event) => {
  // await validateRequest(event, ["ADMIN"]);

  const { subject, chapter } = getQuery(event);

  const query: {
    subjectId?: string;
    chapterId?: string;
  } = {};

  if (subject) {
    query.subjectId = subject as string;
  }

  if (chapter) {
    query.chapterId = chapter as string;
  }

  const questions = await db.question.findMany({
    where: query,
    include: {
      options: true,
      subject: {
        select: {
          name: true,
        },
      },
      chapter: {
        select: {
          name: true,
        },
      },
      creator: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return {
    statusCode: 200,
    body: {
      questions,
    },
  };
});