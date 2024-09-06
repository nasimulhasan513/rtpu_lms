export default defineEventHandler(async (event) => {
  const chapterId = event.context.params?.id;

  if (!chapterId) {
    return {
      statusCode: 400,
      statusMessage: "Invalid chapter id",
    };
  }

  await db.chapter.delete({
    where: {
      id: chapterId,
    },
  });

  return {
    statusCode: 204,
    statusMessage: "Chapter deleted successfully",
  };
});
