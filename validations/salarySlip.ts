import { z } from "zod";

export const salarySlipSchema = z.object({
  employeePersonId: z.string().min(1, "انتخاب کارمند الزامی است"),
  forYear: z.string().min(1, "سال عملکرد الزامی است"),
  forMonth: z.string().min(1, "ماه عملکرد الزامی است"),
  paymentDate: z.string().min(1, "تاریخ پرداخت الزامی است"),
  baseSalary: z.string().min(1, "حقوق پایه الزامی است"),
  overtimePay: z.string().optional().default("0"),
  bonuses: z
    .array(
      z.object({
        amount: z.string(),
        description: z.string(),
      })
    )
    .optional()
    .default([]),
  insurance: z.string().optional().default("0"),
  tax: z.string().optional().default("0"),
  loanInstallments: z
    .array(
      z.object({
        loanId: z.string(),
        installmentNumber: z.string(),
        amount: z.string(),
      })
    )
    .optional()
    .default([]),
  otherDeductions: z
    .array(
      z.object({
        amount: z.string(),
        description: z.string(),
      })
    )
    .optional()
    .default([]),
  businessAccountId: z.string().min(1, "انتخاب حساب بانکی الزامی است"),
});

export type salarySlipSchemaType = z.infer<typeof salarySlipSchema>;

