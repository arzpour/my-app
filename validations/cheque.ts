import { z } from "zod";

export const transactionSchema = z.object({
  transactionType: z.string("نوع تراکنش الزامی است"),
  transactionReason: z.string("دلیل تراکنش الزامی است"),
  transactionWay: z.string("روش تراکنش الزامی است"),
  showRoomCard: z.string("کارت نمایشگاه الزامی است"),
  customerNationalCode: z.string("کد ملی مشتری الزامی است"),
  transactionAmount: z.string("مبلغ تراکنش الزامی است"),
  transactionDate: z.string("تاریخ تراکنش الزامی است"),
});

export type transactionSchemaType = z.infer<typeof transactionSchema>;
