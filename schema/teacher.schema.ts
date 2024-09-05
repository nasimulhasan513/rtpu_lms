import { z } from "zod";

export const teacherSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name should not exceed 100 characters"),
  image: z.string().url("Invalid URL format for image"),
  designation: z
    .string()
    .min(1, "Designation is required")
    .max(100, "Designation should not exceed 100 characters"),
  short_designation: z
    .string()
    .max(50, "Short designation should not exceed 50 characters"),
  biography: z
    .string()
    .min(10, "Biography should be at least 10 characters long")
    .max(5000, "Biography should not exceed 5000 characters")
    .optional(),
});

export const createTeacherSchema = teacherSchema;

export const updateTeacherSchema = teacherSchema.partial(); // Allows partial updates
