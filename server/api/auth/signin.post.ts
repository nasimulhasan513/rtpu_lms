import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { validateEmail, validatePhone } from "~/server/utils/otp";

export default eventHandler(async (event) => {
  const { cred, password, type } = await readBody(event);

  let email;
  let phone;

  // Check if cred is email or phone
  if (validateEmail(cred)) {
    email = cred;
  } else if (validatePhone(cred)) {
    phone = cred;
  } else {
    throw new Error("Invalid credential provided.");
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

  if (
    type === "email" &&
    (typeof email !== "string" ||
      !/^[A-Za-z0-9._-]+@[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(email))
  ) {
    console.log("====================================");
    console.log("Invalid email");
    console.log("====================================");
    throw createError({
      statusMessage: "Invalid email",
      statusCode: 400,
    });
  }

  if (type === "phone" && (typeof phone !== "string" || phone.length < 10)) {
    throw createError({
      statusMessage: "Invalid phone",
      statusCode: 400,
    });
  }

  const queryUser: {
    email?: string;
    phone?: string;
  } = {};

  if (type === "email") {
    queryUser.email = email;
  } else {
    queryUser.phone = phone;
  }

  let existingUser = await db.user.findFirst({
    where: queryUser,
  });

  if (!existingUser) {
    return createError({
      statusMessage: "User not found",
      statusCode: 404,
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
  await db.session.deleteMany({
    where: {
      id: {
        not: session.id,
      },
      userId: existingUser.id,
    },
  });
  appendHeader(
    event,
    "Set-Cookie",
    lucia.createSessionCookie(session.id).serialize()
  );
  return true;
});
