import { z } from "zod";

export const loansSchema = z.object({
  borrowerPersonId: z.string().min(1, "انتخاب کارمند الزامی است"),
  totalAmount: z.string().min(1, "مبلغ وام الزامی است"),
  loanDate: z.string().min(1, "تاریخ پرداخت وام الزامی است"),
  numberOfInstallments: z.string().min(1, "تعداد اقساط الزامی است"),
  installmentAmount: z.string().optional(), // Calculated field
  status: z.string().optional().default("در حال پرداخت"),
  description: z.string().optional(),
});

export type loansSchemaType = z.infer<typeof loansSchema>;

