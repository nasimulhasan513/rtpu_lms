export default defineEventHandler(async (event) => {
  const { id } = event.context.params;

  await db.teacher.delete({
    where: {
      id,
    },
  });

  return {
    success: true,
    message: "Teacher deleted successfully",
  };
});
