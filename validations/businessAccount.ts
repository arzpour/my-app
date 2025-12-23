import { z } from "zod";

export const businessAccountSchema = z.object({
  accountName: z.string().min(1, "نام نمایشی حساب الزامی است"),
  bankName: z.string().min(1, "نام بانک الزامی است"),
  branchName: z.string().min(1, "نام شعبه الزامی است"),
  accountNumber: z.string().min(1, "شماره حساب الزامی است"),
  iban: z
    .string()
    .min(24, "شماره شبا باید 24 کاراکتر باشد")
    .max(24, "شماره شبا باید 24 کاراکتر باشد"),
  cardNumber: z
    .string()
    .min(16, "شماره کارت باید 16 رقم باشد")
    .max(16, "شماره کارت باید 16 رقم باشد")
    .optional(),
  isActive: z.boolean().default(true),
  currentBalance: z.string().min(1, "موجودی اولیه الزامی است"),
});

export type businessAccountSchemaType = z.infer<typeof businessAccountSchema>;
