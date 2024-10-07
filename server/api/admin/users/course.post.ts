import { contributorRoleSchema } from "~/schema/contributor-role.schema";

export default defineEventHandler(async (event) => {
  await validateRequest(event, ["admin"]);
  const body = await readBody(event);

  try {
    const { userId, courseId, permission } = contributorRoleSchema.parse(body);

    const contributor = await db.contributor.create({
      data: {
        userId,
        courseId,
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
