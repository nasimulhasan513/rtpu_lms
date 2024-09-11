import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { db } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = query.code?.toString() ?? null;
  const state = query.state?.toString() ?? null;
  const storedState = getCookie(event, "google_oauth_state") ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return sendRedirect(event, "/");
  }

  try {
    const codeVerifier = getCookie(event, "google_oauth_code_verifier") ?? null;
    if (!codeVerifier) {
      throw createError({
        status: 400,
        statusMessage: "Expired",
      });
    }

    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const googleUserResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );
    const googleUser: GoogleUser = await googleUserResponse.json();

    // Replace this with your own DB client.
    const existingUser = await db.user.findFirst({
      where: {
        email: googleUser.email,
      },
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});

      appendHeader(
        event,
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize()
      );
      return sendRedirect(event, "/courses/benjon25_26");
    }

    const userId = generateIdFromEntropySize(10); // 16 characters long

    // Replace this with your own DB client.
    await db.user.create({
      data: {
        id: userId,
        google_id: googleUser.sub,
        name: googleUser.name,
        email: googleUser.email,
        image: googleUser.picture,
      },
    });
    const session = await lucia.createSession(userId, {});
    appendHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize()
    );
    return sendRedirect(event, "/");
  } catch (e) {
    console.log(e);

    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      throw createError({
        status: 400,
      });
    }
    throw createError({
      status: 500,
    });
  }
});

interface GoogleUser {
  sub: string;
  email: string;
  name: string;
  picture: string;
}
