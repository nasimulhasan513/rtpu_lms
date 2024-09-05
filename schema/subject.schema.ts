import * as z from "zod";
export const SubjectSchema = z.object({
  name: z
    .string()
    .min(3, { message: "name must be at least 3 characters long" }),
});
export const ChapterSchema = z.object({
  name: z
    .string()
    .min(3, { message: "name must be at least 3 characters long" }),
  subjectId: z.string().min(3, { message: "SubjectId must be a valid UUID" }),
});
