export default defineEventHandler(async (event) => {
  const { email } = await readBody(event);
  const existingUser = await db.user.findFirst({
    where: { email },
  });

  if (!existingUser) {
    throw createError({
      statusMessage: "Incorrect email or password",
      statusCode: 400,
    });
  }
  return { user: existingUser };
});
