import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  image: z.string().url("Invalid image URL").optional(),
});
