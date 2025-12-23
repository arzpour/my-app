import { z } from "zod";

export const saleDealSchema = z.object({
  dealId: z.string().min(1, "انتخاب خودرو الزامی است"),
  buyerPersonId: z.string().min(1, "انتخاب خریدار الزامی است"),
  salePrice: z.string().min(1, "قیمت فروش الزامی است"),
  saleDate: z.string().min(1, "تاریخ فروش الزامی است"),
  saleBrokerPersonId: z.string().optional(),
  saleBrokerCommissionPercent: z.string().optional(),
});

export type saleDealSchemaType = z.infer<typeof saleDealSchema>;

