export default defineEventHandler(async (event) => {
  await validateRequest(event);

  const id = event.context.params?.id;
  const user_id = event.context.user?.id;

  const assignments = await db.assignment.findMany({
    where: {
      id: id,
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
