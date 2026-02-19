import { z } from "zod";

export const dealExpensesSchema = z
  .object({
    dealId: z.string().min(1, "انتخاب خودرو الزامی است"),
    expenseType: z.enum(["options", "otherCost"], {
      message: "نوع هزینه الزامی است",
    }),
    providerPersonId: z.string().optional(),
    description: z.string().min(1, "شرح هزینه الزامی است"),
    cost: z.string().min(1, "مبلغ هزینه الزامی است"),
    date: z.string().min(1, "تاریخ الزامی است"),
  })
  .refine((data) => {
    if (data.expenseType === "options") {
      return typeof data.providerPersonId === "string" && data.providerPersonId.trim().length > 0;
    }
    return true;
  }, {
    message: "انتخاب تامین کننده الزامی است",
    path: ["providerPersonId"],
  });

export type dealExpensesSchemaType = z.infer<typeof dealExpensesSchema>;
