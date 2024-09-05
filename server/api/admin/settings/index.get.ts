export default defineEventHandler(async (event) => {
  const { key } = await getQuery(event);

  if (!key) {
    throw createError({
      statusCode: 400,
      message: "Missing key parameter",
    });
  }

  const settings = await db.settings.findFirst({
    where: {
      key: key as string,
    },
  });

  // format the response - key value pair
  return settings?.value || {};
});
