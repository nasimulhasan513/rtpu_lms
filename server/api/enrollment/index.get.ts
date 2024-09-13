export default defineEventHandler(async (event) => {
  const { courseSlug } = getQuery(event);

  const userId = event.context.user?.id;
  console.log(userId);

  const enrollment = await db.enrollment.findFirst({
    where: {
      userId: userId as string,
      course: {
        slug: courseSlug as string,
      },
    },
    select: {
      id: true,
    },
  });

  console.log(enrollment);

  if (!enrollment) {
    return {
      enrollment: false,
    };
  }

  return {
    enrollment,
  };
});
