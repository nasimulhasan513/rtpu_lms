import { z } from "zod";

export const LessonSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title should not exceed 200 characters"),
  subjectId: z.string().min(1, "Subject ID is required"),
  chapterId: z.string().min(1, "Chapter ID is required"),
  source: z.string().url("Invalid URL format for source").optional(),
  content: z
    .string()
    .min(20, "Content should be at least 20 characters long")
    .max(5000, "Content should not exceed 5000 characters"),
  order: z.number().int().default(0),
});

export const createLessonSchema = LessonSchema;

export const updateLessonSchema = LessonSchema.partial(); // Allows partial updates
