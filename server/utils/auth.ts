import { Lucia } from "lucia";
import { Google } from "arctic";
import type { H3Event } from "h3";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";

// For Vercel deployment need to use edge handlers
export const db = new PrismaClient();

const adapter = new PrismaAdapter(db.session, db.user);
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !import.meta.dev,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      google_id: attributes.google_id,
      name: attributes.name,
      image: attributes.image,
      phone: attributes.phone,
      email: attributes.email,
      institute: attributes.institute,
      hsc_batch: attributes.hsc_batch,
      role: attributes.role,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  google_id: number;
  name: string;
  image: string;
  phone: string;
  email: string;
  institute: string;
  hsc_batch: string;
  role: string;
}

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI!
);

// role enum type
export type Role = "ADMIN" | "USER" | "MODERATOR";

export const validateRequest = (
  event: H3Event,
  roles: Role[] = ["USER", "ADMIN", "MODERATOR"]
) => {
  if (!event.context.user) {
    throw createError({
      statusMessage: "Unauthorized",
      statusCode: 401,
    });
  }
  if (!roles.includes(event.context.user.role as Role)) {
    throw createError({
      statusMessage: "Forbidden",
      statusCode: 403,
    });
  }
};
