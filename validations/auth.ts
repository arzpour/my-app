import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string("نام کاربری را وارد کنید")
    .min(5, { message: "نام کاربری باید بیشتر از ۵ کاراکتر باشد" }),
  password: z
    .string("رمز عبور را وارد کنید")
    .min(5, { message: "رمز عبور باید بیشتر از ۵ کاراکتر باشد" }),
});

export type loginSchemaType = z.infer<typeof loginSchema>;
