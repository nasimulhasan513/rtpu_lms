import { Lucia } from "lucia";
import { Google } from "arctic";
import type { H3Event } from "h3";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// For Vercel deployment need to use edge handlers
export const db = new PrismaClient().$extends(withAccelerate());

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
      googleId: attributes.google_id,
      name: attributes.name,
      image: attributes.image,
      phone: attributes.phone,
      district: attributes.district,
      thana: attributes.thana,
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
  district: string;
  thana: string;
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
export type Role = "admin" | "user" | "sales";

export const validateRequest = (
  event: H3Event,
  roles: Role[] = ["user", "admin", "sales"]
) => {
  // if (!event.context.user) {
  //   throw createError({
  //     statusMessage: "Unauthorized",
  //     statusCode: 401,
  //   });
  // }
  // // Check if the user's role is included in the allowed roles
  // if (!roles.includes(event.context.user.role as Role)) {
  //   throw createError({
  //     statusMessage: "Forbidden",
  //     statusCode: 403,
  //   });
  // }
};
