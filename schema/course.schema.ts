import { z } from "zod";

export const CourseSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  name: z.string().min(1, "Course name is required"),
  short_description: z.string().min(1, "Short description is required"),
  description: z.string().min(1, "Description is required"),
  category_id: z
    .string()
    .min(1, "Category  is required"),
  image: z.string().url("Image must be a valid URL"),
  promo_video: z
    .string()
    .url("Promo video must be a valid URL")
    .optional()
    .nullable(),
  status: z
    .enum(["published", "draft", "prebooking", "archieve"])
    .default("draft"),
  duration: z.number().min(1, "Duration is required"),
  enrolled: z
    .number()
    .min(0, "Enrolled must be a non-negative number")
    .default(0),
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
    )
    .nonempty("At least one teacher is required"),

  sale_price: z.number().min(0, "Sale price must be a non-negative number"),
  regular_price: z
    .number()
    .min(0, "Regular price must be a non-negative number"),
});

export const createCourseSchema = CourseSchema;

export const updateCourseSchema = CourseSchema.partial(); // Allows partial updates
