import { z } from "zod";

export const transactionSchema = z.object({
  transactionType: z.string("نوع تراکنش الزامی است"),
  transactionReason: z.string("دلیل تراکنش الزامی است"),
  transactionWay: z.string("روش تراکنش الزامی است"),
  transactionType: z.string("کارت نمایشگاه الزامی است"),
  transactionType: z.string("کد ملی مشتری الزامی است"),
  transactionType: z.string("مبلغ تراکنش الزامی است"),
  transactionType: z.string("تاریخ تراکنش الزامی است"),
});

export type transactionSchemaType = z.infer<typeof transactionSchema>;
