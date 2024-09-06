import { z } from "zod";

export const LessonSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title should not exceed 200 characters"),
  subjectId: z.string().min(1, "Subject ID is required"),
  chapterId: z.string().min(1, "Chapter ID is required"),
  source: z.string().min(1, "Source is required"),
  content: z.string().url("Invalid URL format for source").optional(),
  pdf: z.string().url("Invalid URL format for PDF").optional(),
  order: z.number().int().default(0),
});

export const createLessonSchema = LessonSchema;

export const updateLessonSchema = LessonSchema.partial(); // Allows partial updates
