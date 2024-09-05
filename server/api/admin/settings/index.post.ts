
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const existingSetting = await db.settings.findUnique({
      where: { key: body.key },
    });

    if (existingSetting) {
      // Update the existing setting
      const updatedSetting = await db.settings.update({
        where: { key: body.key },
        data: {
          value: body.value,
        },
      });
      return updatedSetting;
    } else {
      // Create a new setting
      const newSetting = await db.settings.create({
        data: {
          key: body.key,
          value: body.value,
        },
      });
      return newSetting;
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to create or update setting",
    });
  }
});
