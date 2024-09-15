import { z } from "zod";

export const contributorRoleSchema = z.object({
  userId: z.string(),
  courseId: z.string(),
  permission: z.enum(["EDIT", "VIEW", "MANAGE"]),
});
