/**
 * ============================================
 * MIGRATION NOTES FOR NEW BACKEND API
 * ============================================
 *
 * This file handles transaction operations. In the new backend:
 * - Transactions use dealId instead of ChassisNo
 * - Field names are changed (camelCase instead of PascalCase)
 * - Type: ITransactionNew instead of ITransactionRes
 *
 * NEW API ENDPOINTS TO USE:
 * - GET /transactions - Get all transactions
 * - GET /transactions/deal/:dealId - Get transactions by deal ID (replaces byChassisNo)
 * - GET /transactions/person/:personId - Get transactions by person ID
 * - GET /transactions/type/:type - Get transactions by type
 * - GET /transactions/date-range?startDate=&endDate= - Get by date range
 * - POST /transactions - Create new transaction
 * - PUT /transactions/id/:id - Update transaction
 * - DELETE /transactions/id/:id - Delete transaction
 *
 * FIELD MAPPINGS:
 * - TransactionType -> type
 * - TransactionReason -> reason
 * - TransactionAmount -> amount
 * - TransactionDate -> transactionDate
 * - TransactionMethod -> paymentMethod
 * - CustomerNationalID -> personId
 * - ChassisNo -> dealId (but need to get dealId from VIN first)
 * - ShowroomCard -> bussinessAccountId
 * - Notes -> description
 */
import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";
import type { ITransactionNew } from "@/types/new-backend-types";

/**
 * MIGRATION: Replace with GET /transactions
 * Returns: ITransactionNew[] instead of ITransactionRes[]
 */
type getAllTransactionsType = () => Promise<ITransactionRes[]>;
export const getAllTransactions: getAllTransactionsType = async () => {
  const response = await axiosInstance.get(urls.transactions.list);
  return response.data;
};

// Legacy function - maps to new API
// type getTransactionByChassisType = (
//   chassisNo: string
// ) => Promise<ITransactionRes[]>;
// export const getTransactionByChassis: getTransactionByChassisType = async (
//   chassisNo: string
// ) => {
//   // First get deal by VIN to get dealId
//   const { getDealByVin } = await import("./deals");
//   const deal = await getDealByVin(chassisNo);
//   const dealId = deal?._id.toString();

//   // Then get transactions by dealId
//   const transactions = await getTransactionsByDeal(dealId);

//   // Map to old format
//   return transactions.map(mapTransactionToOldFormat);
// };

// New function: Get transactions by deal ID
type getTransactionsByDealType = (dealId: string) => Promise<ITransactionNew[]>;
export const getTransactionsByDeal: getTransactionsByDealType = async (
  dealId
) => {
  const response = await axiosInstance.get(urls.transactionsNew.byDeal(dealId));
  return response.data;
};

// Get transaction by ID
type getTransactionByIdType = (id: string) => Promise<ITransactionNew>;
export const getTransactionById: getTransactionByIdType = async (
  id
) => {
  const response = await axiosInstance.get(urls.transactionsNew.byId(id));
  return response.data;
};

// Get transactions by person ID
type getTransactionsByPersonType = (
  personId: string
) => Promise<ITransactionNew[]>;
export const getTransactionsByPerson: getTransactionsByPersonType = async (
  personId
) => {
  const response = await axiosInstance.get(
    urls.transactionsNew.byPerson(personId)
  );
  return response.data;
};

// Get transactions by type
type getTransactionsByTypeType = (type: string) => Promise<ITransactionNew[]>;
export const getTransactionsByType: getTransactionsByTypeType = async (
  type
) => {
  const response = await axiosInstance.get(urls.transactionsNew.byType(type));
  return response.data;
};

// Get transactions by date range
type getTransactionsByDateRangeType = (
  startDate: string,
  endDate: string
) => Promise<ITransactionNew[]>;
export const getTransactionsByDateRange: getTransactionsByDateRangeType =
  async (startDate, endDate) => {
    const response = await axiosInstance.get(urls.transactionsNew.byDateRange, {
      params: { startDate, endDate },
    });
    return response.data;
  };

// Helper function to map new transaction format to old
function mapTransactionToOldFormat(newData: ITransactionNew): ITransactionRes {
  return {
    _id: newData._id.toString(),
    ChassisNo: newData.dealId,
    TransactionType: newData.type,
    TransactionReason: newData.reason,
    TransactionMethod: newData.paymentMethod,
    ShowroomCard: newData.bussinessAccountId,
    CustomerNationalID: newData.personId,
    TransactionAmount: newData.amount,
    TransactionDate: newData.transactionDate,
    Notes: newData.description,
    BankDocument: "",
    Partner: "",
    Broker: 0,
  };
}

// Create transaction
type createTransactionType = (data: Partial<ITransactionNew>) => Promise<ITransactionNew>;
export const createTransaction: createTransactionType = async (data) => {
  const response = await axiosInstance.post(
    urls.transactionsNew.create,
    data
  );
  return response.data;
};

// // Helper function to check if data is in old format
// function isOldTransactionFormat(data: any): boolean {
//   return (
//     data.TransactionType !== undefined ||
//     data.TransactionAmount !== undefined ||
//     data.ChassisNo !== undefined
//   );
// }

// Helper function to map old transaction format to new
// async function mapOldTransactionToNew(
//   oldData: Partial<ITransactionRes>
// ): Promise<Partial<ITransactionNew>> {
//   // Convert VIN to dealId if needed
//   let dealId = oldData.ChassisNo;
//   if (oldData.ChassisNo && typeof oldData.ChassisNo === "string") {
//     try {
//       const { getDealByVin } = await import("./deals");
//       const deal = await getDealByVin(oldData.ChassisNo);
//       dealId = deal._id.toString();
//     } catch (error) {
//       console.error("Error converting VIN to dealId:", error);
//     }
//   }

//   return {
//     amount: oldData.TransactionAmount,
//     transactionDate: oldData.TransactionDate,
//     type: oldData.TransactionType,
//     reason: oldData.TransactionReason,
//     paymentMethod: oldData.TransactionMethod,
//     personId: oldData.CustomerNationalID,
//     dealId: dealId || "",
//     bussinessAccountId: oldData.ShowroomCard,
//     description: oldData.Notes,
//   };
// }
