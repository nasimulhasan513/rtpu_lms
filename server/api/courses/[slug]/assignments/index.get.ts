export default defineEventHandler(async (event) => {
  await validateRequest(event);

  const slug = event.context.params?.slug;
  const user_id = event.context.user?.id;

  const assignments = await db.assignment.findMany({
    where: {
      course: {
        slug: slug,
      },
    },
    include: {
      submissions: {
        where: {
          userId: user_id,
        },
      },
      subject: true,
    },
  });

  return assignments;
});
