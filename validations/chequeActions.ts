import { z } from "zod";

export const chequeActionsSchema = z.object({
  chequeId: z.string().min(1, "انتخاب چک الزامی است"),
  actionType: z.enum(
    ["پاس شدن", "برگشت خوردن", "خرج کردن", "عودت دادن"] as const,
    {
      message: "نوع عملیات الزامی است",
    }
  ),
  actionDate: z.string().min(1, "تاریخ عملیات الزامی است"),
  description: z.string().optional(),
  businessAccountId: z.string().optional(), // If cheque is paid
});

export type chequeActionsSchemaType = z.infer<typeof chequeActionsSchema>;
