export default defineEventHandler(async (event) => {
  // const cachedSubjects = await getCache("subjects");
  // if (cachedSubjects) {
  //   return {
  //     statusCode: 200,
  //     body: cachedSubjects,
  //   };
  // }
  const subjects = await db.subject.findMany({
    include: {
      chapters: true,
    },
    orderBy: {
      order: "asc",
    },
  });

  // await setCache("subjects", subjects);

  return {
    statusCode: 200,
    body: subjects,
  };
});
