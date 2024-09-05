import * as z from "zod";

export const SignupSchema = z.object({
  name: z.string().min(3, {
    message: "Name is required",
  }),
  phone: z.string().min(3, {
    message: "Phone is required",
  }),

  institute: z.string().min(3, {
    message: "Institute is required",
  }),
  hsc_batch: z.string().min(3, {
    message: "HSC Batch is required",
  }),
});
