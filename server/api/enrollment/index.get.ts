export default defineEventHandler(async (event) => {
  const { courseSlug } = getQuery(event);

  const userId = event.context.user?.id;

  const role = event.context.user?.role;

  if (role !== "user") {
    return {
      enrollment: true,
    };
  }

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

  if (!enrollment) {
    return {
      enrollment: false,
    };
  }

  return {
    enrollment,
  };
});
