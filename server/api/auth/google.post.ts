import { OAuth2Client } from "google-auth-library";

import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { db } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { accessToken } = body;

  if (!accessToken) {
    throw createError({
      status: 400,
    });
  }
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const googleUserResponse = await client.verifyIdToken({
      idToken: accessToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const googleUser = googleUserResponse.getPayload();
  
    if (!googleUser) {
      throw createError({
        status: 400,
      });
    }

    const existingUser = await db.user.findFirst({
      where: {
        email: googleUser.email,
      },
    });
    if (existingUser) {
      if (!existingUser.image) {
        await db.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            image: googleUser.picture,
            
          },
        });
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

    return true;
  } catch (e) {
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
