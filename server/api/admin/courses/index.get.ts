export default defineEventHandler(async (event) => {
  const role = event.context.user?.role;

  if (role === "contributor" && event.context.user?.id) {
    const courses = await db.contributor.findMany({
      where: {
        userId: event.context.user?.id as string,
      },
      include: {
        course: true,
      },
    });
    return {
      statusCode: 200,
      body: courses.map((course) => course.course),
    };
  }

  const courses = await db.course.findMany({});

  return {
    statusCode: 200,
    body: courses,
  };
});
