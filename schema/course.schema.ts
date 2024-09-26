import { z } from "zod";

export const CourseSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be a valid URL slug"),
  name: z.string().min(1, "Course name is required"),
  short_description: z.string().min(1, "Short description is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z
    .string()
    .min(1, "Category  is required")
    .regex(/^[a-f\d]{24}$/i, "Invalid category ID"),
  image: z.string().url("Image must be a valid URL"),
  promo_video: z.string().url("Promo video must be a valid URL").optional(),
  productCode: z.string().min(3, "Product code is required"),
  status: z
    .enum(["published", "draft", "prebooking", "archieve"])
    .default("draft"),
  fb_group: z.string().url("Facebook group must be a valid URL").optional(),
  tg_group: z.string().url("Telegram group must be a valid URL").optional(),
  keywords: z
    .array(z.string().min(1, "Keyword cannot be empty"))
    .nonempty("At least one keyword is required"),
  order: z
    .number()
    .int()
    .min(0, "Order must be a non-negative integer")
    .default(0),
  teachers: z
    .array(
      z
        .string()
        .min(1, "Teacher ID is required")
        .regex(/^[a-f\d]{24}$/i, "Invalid teacher ID")
    )
    .nonempty("At least one teacher is required"),
});

export const createCourseSchema = CourseSchema;

export const updateCourseSchema = CourseSchema.partial(); // Allows partial updates
