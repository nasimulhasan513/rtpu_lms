export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Lesson ID is required",
    });
  }

  try {
    // First, delete all related CourseLessons
    await db.courseLesson.deleteMany({
      where: { lessonId: id },
    });

    // Then, delete the Lesson
    await db.lesson.delete({
      where: { id },
    });

    return { message: "Lesson deleted successfully" };
  } catch (error) {
    console.error("Error deleting lesson:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error deleting lesson",
    });
  }
});
