import { z } from "zod";

export const purchaseDealSchema = z.object({
  // Vehicle Information
  vin: z.string().min(1, "شماره شاسی الزامی است"),
  model: z.string().min(1, "مدل خودرو الزامی است"),
  productionYear: z.string().min(1, "سال ساخت الزامی است"),
  plateNumber: z.string().optional(),
  color: z.string().optional(),

  // Seller Information
  sellerPersonId: z.string().min(1, "انتخاب فروشنده الزامی است"),

  // Purchase Information
  purchasePrice: z.string().min(1, "قیمت خرید الزامی است"),
  purchaseDate: z.string().min(1, "تاریخ خرید الزامی است"),

  // Purchase Broker (Optional)
  purchaseBrokerPersonId: z.string().optional(),
  purchaseBrokerCommissionPercent: z.string().optional(),

  // Partnerships (Optional - array)
  partnerships: z
    .array(
      z.object({
        partnerPersonId: z.string(),
        investmentAmount: z.string(),
        profitSharePercentage: z.string(),
      })
    )
    .optional(),
});

export type purchaseDealSchemaType = z.infer<typeof purchaseDealSchema>;

