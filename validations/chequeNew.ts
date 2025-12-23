import { z } from "zod";

export const chequeNewSchema = z.object({
  type: z.enum(["دریافتی", "پرداختی"], {
    required_error: "نوع چک الزامی است",
  }),
  chequeNumber: z.string().min(1, "شماره چک الزامی است"),
  bankName: z.string().min(1, "نام بانک الزامی است"),
  amount: z.string().min(1, "مبلغ الزامی است"),
  issueDate: z.string().min(1, "تاریخ صدور الزامی است"),
  dueDate: z.string().min(1, "تاریخ سررسید الزامی است"),
  status: z.string().optional().default("در جریان"),
  payerPersonId: z.string().optional(), // If cheque is received
  payeePersonId: z.string().optional(), // If cheque is issued
  relatedDealId: z.string().optional(),
  relatedTransactionId: z.string().optional(),
});

export type chequeNewSchemaType = z.infer<typeof chequeNewSchema>;

