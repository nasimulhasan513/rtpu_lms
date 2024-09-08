export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const liveClasses = await db.liveClass.findMany({
    where: {
      hostId: user.id,
    },
    orderBy: {
      startTime: "desc",
    },
  });

  return liveClasses;
});
