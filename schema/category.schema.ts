import { z } from "zod";

export const CategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name should not exceed 100 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug should not exceed 100 characters"),
  image: z.string().url("Invalid URL format for image"),
});
