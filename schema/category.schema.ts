import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  image: z.string().url("Invalid image URL"),
  logo: z.string().url("Invalid logo URL"),
  platformName: z.string().min(1, "Platform name is required"),
});
