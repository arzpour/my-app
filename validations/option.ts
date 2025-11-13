import { z } from "zod";

export const chequeSchema = z.object({
  customerName: z.string().min(1, "نام مشتری الزامی است"),
  customerNationalCode: z.string().min(1, "کد ملی مشتری الزامی است"),
  chequeChargeOwner: z.string().min(1, "صاحب حساب چک الزامی است"),
  chequeOwnerNationalCode: z.string().min(1, "کد ملی صاحب حساب چک الزامی است"),
  sayadiId: z.string().min(1, "شناسه صیادی الزامی است"),
  seri: z.string().min(1, "سری الزامی است"),
  serial: z.string().min(1, "سریال الزامی است"),
  bankName: z.string().min(1, "نام بانک الزامی است"),
  bankBranch: z.string().min(1, "شعبه الزامی است"),
  chequeAmount: z.string().min(1, "مبلغ چک الزامی است"),
  chequeDatebook: z.string().min(1, "تاریخ سررسید الزامی است"),
  chequeStatus: z.string().min(1, "وضعیت چک الزامی است"),
  lastAction: z.string().min(1, "آخرین اقدام الزامی است"),
  lastActionDate: z.string().min(1, "تاریخ اقدام الزامی است"),
});

export type chequeSchemaType = z.infer<typeof chequeSchema>;
