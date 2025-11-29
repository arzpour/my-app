/**
 * ============================================
 * MIGRATION NOTES FOR NEW BACKEND API
 * ============================================
 * 
 * Investment/partnership data is now embedded in deals, not separate transactions.
 * 
 * NEW IMPLEMENTATION:
 * 1. GET /deals/vin/:vin - Get deal by VIN (chassisNo)
 * 2. Use deal.partnerships array for investment data
 * 3. Map partnerships to IInvestmentRes format if needed
 * 
 * Example:
 * const deal = await axiosInstance.get(`/deals/vin/${chassisNo}`);
 * const investmentData = deal.partnerships.map(p => ({
 *   Partner: p.partner.name,
 *   Broker: p.profitSharePercentage,
 *   TransactionAmount: p.investmentAmount,
 *   TransactionDate: deal.createdAt,
 *   TransactionReason: "اصل شرکت",
 *   TransactionMethod: "",
 *   _id: p.partner.personId,
 *   ChassisNo: deal.vehicleSnapshot.vin,
 *   ShowroomCard: "",
 *   CustomerNationalID: p.partner.nationalID,
 *   Notes: "",
 *   BankDocument: "",
 *   Partner: p.partner.name,
 *   status: ""
 * }));
 * 
 * Return as: { status: 200, data: investmentData }
 */
import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";
import type { IDeal } from "@/types/new-backend-types";

// Get investment data by chassis number - uses deal.partnerships
type getInvestmentByChassisType = (
  chassisNo: string
) => Promise<IInvestmentRes>;
export const getInvestmentByChassis: getInvestmentByChassisType = async (
  chassisNo
) => {
  // Get deal by VIN
  const { getDealByVin } = await import("./deals");
  const deal = await getDealByVin(chassisNo);

  // Map partnerships to investment format
  const investmentData: ITransactionRes[] = deal.partnerships.map((p) => ({
    _id: p.partner.personId,
    ChassisNo: deal.vehicleSnapshot.vin,
    TransactionType: "افزایش سرمایه",
    TransactionReason: "اصل شرکت",
    TransactionMethod: "",
    ShowroomCard: "",
    CustomerNationalID: p.partner.nationalID,
    TransactionAmount: p.investmentAmount,
    TransactionDate: deal.createdAt,
    Notes: "",
    BankDocument: "",
    Partner: p.partner.name,
    Broker: p.profitSharePercentage,
  }));

  return {
    status: 200,
    data: investmentData,
  };
};
