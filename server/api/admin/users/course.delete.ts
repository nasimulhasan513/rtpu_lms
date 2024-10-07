export default defineEventHandler(async (event) => {
  await validateRequest(event, ["admin"]);
  const body = await readBody(event);

  try {
    const contributor = await db.contributor.delete({
      where: {
        id: body.id,
      },
    });

    return {
      success: true,
      data: contributor,
    };
  } catch (error) {
    console.error("Error assigning contributor:", error);

    if (error.code === "P2002") {
      throw createError({
        statusCode: 400,
        message: "This user is already a contributor for this course",
      });
    }

    throw createError({
      statusCode: 500,
      message: "An error occurred while assigning the contributor",
    });
  }
});
