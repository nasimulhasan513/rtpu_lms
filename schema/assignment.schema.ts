import { z } from "zod";

export const assignmentSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  courseId: z.string().min(1),
  total_marks: z.number().int().positive(),
  startDate: z.string(),
  endDate: z.string(),
  pdf: z.string().url().optional().nullable(),
  status: z.enum(["draft", "published"]).default("draft"),
});
