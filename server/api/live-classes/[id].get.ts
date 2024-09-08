export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) {
    return {
      status: 400,
      body: { message: "Missing live class ID" },
    };
  }

  const liveClass = await db.liveClass.findUnique({
    where: { id },
  });

  return liveClass;
});
