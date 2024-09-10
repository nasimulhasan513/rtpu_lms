export default defineEventHandler(async (event) => {
  const { courseSlug } = getQuery(event);

  const userId = event.context.user?.id;

  const enrollment = await db.enrollment.findFirst({
    where: {
      userId: userId,
      course: {
        slug: courseSlug,
      },
    },
    select: {
      id: true,
    },
  });

  if (!enrollment) {
    return {
      enrollment: false,
    };
  }

  return {
    enrollment,
  };
});
