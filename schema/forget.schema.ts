import * as z from "zod";
export const ForgetSchema = z.object({
  email: z.string().min(3, {
    message: "Credential is required",
  }),
});

export const ResetSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 8 characters long",
  }),
  confirm_password: z.string().min(6, {
    message: "Password must be at least 8 characters long",
  }),
  // .refine((data) => data === this.password, {
  //   message: "Passwords do not match",
  // }),
});
