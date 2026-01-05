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
    personId: z.string().min(1, "طرف حساب الزامی است"),
    secondPartyId: z.string().optional(),
    bussinessAccountId: z.string().min(1, "حساب بانکی الزامی است"),
    paymentMethod: z.enum(
      ["نقد", "کارت به کارت", "چک", "شبا", "مشتری به مشتری"] as const,
      {
        message: "روش پرداخت الزامی است",
      }
    ),
    dealId: z.string().optional(), // Optional - only if related to a deal
    description: z.string().optional(),

    // Cheque fields (required if paymentMethod is "چک")
    chequeNumber: z.string().optional(),
    chequeBankName: z.string().optional(),
    chequeBranchName: z.string().optional(),
    chequeIssueDate: z.string().optional(),
    chequeDueDate: z.string().optional(),
    chequeType: z.enum(["دریافتی", "پرداختی"]).optional(),
    chequeStatus: z.string().optional(),
    chequePayerPersonId: z.string().optional(),
    chequePayeePersonId: z.string().optional(),
    chequeRelatedDealId: z.string().optional(),
    chequeImage: z.any().optional(), // File upload
  })
  .refine(
    (data) => {
      // If payment method is cheque, cheque fields are required
      if (data.paymentMethod === "چک") {
        return (
          data.chequeNumber &&
          data.chequeBankName &&
          data.chequeIssueDate &&
          data.chequeDueDate &&
          data.chequeType &&
          data.chequeStatus
        );
      }
      return true;
    },
    {
      message: "اطلاعات چک الزامی است",
      path: ["chequeNumber"],
    }
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
    }
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
    }
  )
  .refine(
    (data) => {
      if (data.paymentMethod === "مشتری به مشتری") {
        return data.secondPartyId;
      }
      return true;
    },
    {
      message: "طرف حساب دوم الزامی است",
      path: ["secondPartyId"],
    }
  );

export type transactionChequeSchemaType = z.infer<
  typeof transactionChequeSchema
>;
