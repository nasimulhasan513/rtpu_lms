export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) {
    return createError({
      statusCode: 400,
      message: 'Exam ID is required',
    });
  }

  try {
    await db.exam.delete({
      where: { id },
    });

    return {
      statusCode: 200,
      body: { message: 'Exam deleted successfully' },
    };
  } catch (error) {
    console.error('Error deleting exam:', error);
    return createError({
      statusCode: 500,
      message: 'Failed to delete exam',
    });
  }
});