import { generateId } from "lucia";
import { Argon2id } from "oslo/password";

export default eventHandler(async (event) => {
  const { email, password } = await readBody(event);

  if (
    typeof email !== "string" ||
    email.length < 3 ||
    email.length > 31 ||
    !/^[A-Za-z0-9_-]+@[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(email)
  ) {
    throw createError({
      statusMessage: "Invalid email",
      statusCode: 400,
    });
  }

  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    throw createError({
      statusMessage: "Invalid password",
      statusCode: 400,
    });
  }

  let existingUser = await db.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    existingUser = await db.user.create({
      data: {
        id: generateId(15),
        email,
        password: await new Argon2id().hash(password),
      },
    });
  } else if (existingUser && existingUser.password) {
    const validPassword = await new Argon2id().verify(
      existingUser.password,
      password
    );

    if (!validPassword) {
      throw createError({
        statusMessage: "Incorrect email or password",
        statusCode: 400,
      });
    }
  }

  const session = await lucia.createSession(existingUser.id, {});
  appendHeader(
    event,
    "Set-Cookie",
    lucia.createSessionCookie(session.id).serialize()
  );
  return true;
});
