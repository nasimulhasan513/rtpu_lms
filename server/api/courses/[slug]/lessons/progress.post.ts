export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const userId = event.context.user?.id;

    if (!userId) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    const updatedProgress = await db.lessonProgress.update({
      where: {
        id: body.id,
      },
      data: {
        bookmark: body.bookmark,
        completed: body.completed,
        note: body.note,
      },
    });

    return {
      progress: updatedProgress,
    };
  } catch (error) {
    console.error("Error in lessons/progress.post.ts:", error);
    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});
