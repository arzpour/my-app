import { z } from "zod";

// Integrated Transaction + Cheque Schema
export const transactionChequeSchema = z
  .object({
    // Transaction fields
    type: z.enum(["پرداخت", "دریافت"] as const, {
      message: "نوع تراکنش الزامی است",
    }),
    reason: z.string().min(1, "بابت تراکنش الزامی است"),
    transactionDate: z.string().min(1, "تاریخ تراکنش الزامی است"),
    amount: z.string().min(1, "مبلغ تراکنش الزامی است"),
    personId: z.string().optional(),
    secondPersonId: z.string().optional(),
    bussinessAccountId: z.string().min(1, "حساب بانکی الزامی است"),
    paymentMethod: z.enum(
      ["نقد", "کارت به کارت", "چک", "شبا", "مشتری به مشتری"] as const,
      {
        message: "روش پرداخت الزامی است",
      },
    ),
    dealId: z.string().optional(), // Optional - only if related to a deal
    description: z.string().optional(),
    chequeDescription: z.string().optional(),

    // Cheque fields (required if paymentMethod is "چک")
    chequeNumber: z.string().optional(),
    chequeSerial: z.string().optional(),
    sayadiID: z.string().optional(),
    chequeBankName: z.string().optional(),
    chequeBranchName: z.string().optional(),
    chequeIssueDate: z.string().optional(),
    chequeDueDate: z.string().optional(),
    chequeType: z.enum(["دریافتی", "پرداختی"]).optional(),
    chequeStatus: z.string().optional(),
    chequePayerPersonId: z.string().optional(),
    chequePayeePersonId: z.string().optional(),
    chequeCustomerPersonId: z.string().optional(),
    chequeRelatedDealId: z.string().optional(),
    chequeImage: z.any().optional(), // File upload
    partnerPersonId: z.string().optional(),
    // partnershipInvestmentAmount: z.string().optional(),
    partnershipProfitSharePercentage: z.string().optional(),
    providerPersonId: z.string().optional(),
    brokerPersonId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === "چک") {
      if (!data.chequeNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "شماره چک الزامی است",
          path: ["chequeNumber"],
        });
      }

      if (!data.chequeSerial) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "سریال چک الزامی است",
          path: ["chequeSerial"],
        });
      }

      if (!data.chequeBankName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "نام بانک الزامی است",
          path: ["chequeBankName"],
        });
      }

      if (!data.chequeIssueDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "تاریخ صدور الزامی است",
          path: ["chequeIssueDate"],
        });
      }

      if (!data.chequeDueDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "تاریخ سررسید الزامی است",
          path: ["chequeDueDate"],
        });
      }

      if (!data.chequeType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "نوع چک الزامی است",
          path: ["chequeType"],
        });
      }

      if (!data.chequeStatus) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "وضعیت چک الزامی است",
          path: ["chequeStatus"],
        });
      }
    }
  })
  .refine(
    (data) => {
      const isOptionReason = data.reason === "آپشن";

      const isPartnershipReason =
        (data.type === "دریافت" && data.reason === "سرمایه گذاری") ||
        (data.type === "پرداخت" &&
          (data.reason === "اصل سرمایه" || data.reason === "سود سرمایه"));

      const isCustomerToCustomer = data.paymentMethod === "مشتری به مشتری";

      if (isOptionReason || isPartnershipReason || isCustomerToCustomer) {
        return true;
      }

      return !!data.personId;
    },
    {
      message: "طرف حساب الزامی است",
      path: ["personId"],
    },
  )
  .refine(
    (data) => {
      if (data.reason === "درصد کارگزار") {
        return !!data.brokerPersonId;
      }
      return true;
    },
    {
      message: "کارگزار الزامی است",
      path: ["brokerPersonId"],
    },
  )
  .refine(
    (data) => {
      const isPartnershipReason =
        (data.type === "دریافت" && data.reason === "سرمایه گذاری") ||
        (data.type === "پرداخت" &&
          (data.reason === "اصل سرمایه" || data.reason === "سود سرمایه"));
      if (!isPartnershipReason) return true;
      return !!(data.partnerPersonId && data.partnerPersonId.trim());
    },
    {
      message: "نام شریک الزامی است",
      path: ["partnerPersonId"],
    },
  )
  .refine(
    (data) => {
      if (data.reason === "آپشن") {
        return data.providerPersonId;
      }
      return true;
    },
    {
      message: "تامین کننده الزامی است",
      path: ["providerPersonId"],
    },
  )
  .refine(
    (data) => {
      // If cheque type is received, payer is required
      if (data.paymentMethod === "چک" && data.chequeType === "دریافتی") {
        return data.chequePayerPersonId;
      }
      return true;
    },
    {
      message: "صادرکننده چک الزامی است",
      path: ["chequePayerPersonId"],
    },
  )
  .refine(
    (data) => {
      // If cheque type is issued, payee is required
      if (data.paymentMethod === "چک" && data.chequeType === "پرداختی") {
        return data.chequePayeePersonId;
      }
      return true;
    },
    {
      message: "گیرنده چک الزامی است",
      path: ["chequePayeePersonId"],
    },
  )
  .refine(
    (data) => {
      if (data.paymentMethod === "چک" && data.chequeType === "دریافتی") {
        return data.sayadiID;
      }
      return true;
    },
    {
      message: "شماره صیادی چک الزامی است",
      path: ["sayadiID"],
    },
  )
  .refine(
    (data) => {
      if (data.paymentMethod === "چک" && data.chequeType === "پرداختی") {
        return data.sayadiID;
      }
      return true;
    },
    {
      message: "شماره صیادی چک الزامی است",
      path: ["sayadiID"],
    },
  )
  .refine(
    (data) => {
      // If cheque type is issued, customer is required
      if (data.paymentMethod === "چک" && data.chequeType === "دریافتی") {
        return data.chequeCustomerPersonId;
      }
      return true;
    },
    {
      message: "مشتری الزامی است",
      path: ["chequeCustomerPersonId"],
    },
  )
  .refine(
    (data) => {
      if (data.paymentMethod === "مشتری به مشتری") {
        return data.secondPersonId;
      }
      return true;
    },
    {
      message: "طرف حساب دوم الزامی است",
      path: ["secondPersonId"],
    },
  );

export type transactionChequeSchemaType = z.infer<
  typeof transactionChequeSchema
>;
