/**
 * ============================================
 * MIGRATION NOTES FOR NEW BACKEND API
 * ============================================
 *
 * This function combines car, transactions, and cheques data.
 * In the new backend, this needs to be done in multiple steps:
 *
 * NEW IMPLEMENTATION:
 * 1. GET /deals/vin/:vin - Get deal by VIN (chassisNo)
 * 2. Extract deal._id as dealId
 * 3. GET /transactions/deal/:dealId - Get transactions
 * 4. GET /cheques/deal/:dealId - Get cheques
 * 5. Combine into IDetailsByChassis-like structure OR refactor to use IDeal directly
 *
 * Example:
 * const deal = await axiosInstance.get(`/deals/vin/${chassisNo}`);
 * const transactions = await axiosInstance.get(`/transactions/deal/${deal._id}`);
 * const cheques = await axiosInstance.get(`/cheques/deal/${deal._id}`);
 *
 * Then map to old structure or refactor components to use new structure:
 * {
 *   car: {
 *     // Map deal fields to car fields
 *     ChassisNo: deal.vehicleSnapshot.vin,
 *     PurchaseAmount: deal.purchasePrice,
 *     SaleAmount: deal.salePrice,
 *     // ... etc
 *   },
 *   transactions: transactions.map(t => ({
 *     // Map transaction fields
 *     TransactionType: t.type,
 *     TransactionAmount: t.amount,
 *     // ... etc
 *   })),
 *   cheques: cheques.map(c => ({
 *     // Map cheque fields
 *     ChequeType: c.type === "issued" ? "صادره" : "وارده",
 *     // ... etc
 *   }))
 * }
 */
// import { urls } from "@/utils/urls";
// import { axiosInstance } from "./instance";
// import type { IDeal } from "@/types/new-backend-types";

// // Get details by chassis number - combines deal, transactions, and cheques
// type getDetailsByChassisNoType = (
//   chassisNo: string
// ) => Promise<IDetailsByChassis>;
// export const getDetailsByChassisNo: getDetailsByChassisNoType = async (
//   chassisNo
// ) => {
//   // Get deal by VIN
//   const { getDealByVin } = await import("./deals");
//   const deal = await getDealByVin(chassisNo);
//   const dealId = deal._id.toString();

//   // Get transactions and cheques in parallel
//   const [transactions, cheques] = await Promise.all([
//     import("./transaction").then((m) => m.getTransactionsByDeal(dealId)),
//     import("./cheques").then((m) => m.getChequesByDeal(dealId)),
//   ]);

//   // Map deal to car format
//   const car: ICarRes = {
//     _id: deal._id.toString(),
//     RowNo: 0,
//     CarModel: deal.vehicleSnapshot.model,
//     SaleAmount: deal.salePrice,
//     PurchaseAmount: deal.purchasePrice,
//     LicensePlate: deal.vehicleSnapshot.plateNumber,
//     ChassisNo: deal.vehicleSnapshot.vin,
//     SellerName: deal.seller.fullName,
//     BuyerName: deal.buyer.fullName,
//     SaleDate: deal.saleDate,
//     PurchaseDate: deal.purchaseDate,
//     SellerMobile: parseInt(deal.seller.mobile) || 0,
//     BuyerMobile: parseInt(deal.buyer.mobile) || 0,
//     PurchaseBroker: deal.purchaseBroker?.fullName || "",
//     SaleBroker: deal.saleBroker?.fullName || "",
//     Secretary: "",
//     DocumentsCopy: "",
//     SellerNationalID: parseInt(deal.seller.nationalId) || 0,
//     BuyerNationalID: parseInt(deal.buyer.nationalId) || 0,
//     status: deal.status,
//   };

//   // Map transactions to old format
//   const mappedTransactions: ITransactionRes[] = transactions.map((t) => ({
//     _id: t._id.toString(),
//     ChassisNo: t.dealId,
//     TransactionType: t.type,
//     TransactionReason: t.reason,
//     TransactionMethod: t.paymentMethod,
//     ShowroomCard: t.bussinessAccountId,
//     CustomerNationalID: t.personId,
//     TransactionAmount: t.amount,
//     TransactionDate: t.transactionDate,
//     Notes: t.description,
//     BankDocument: "",
//     Partner: "",
//     Broker: 0,
//   }));

//   // Map cheques to old format
//   const mappedCheques: IChequeRes[] = cheques.map((c) => {
//     const isIssued = c.type === "issued";
//     const customer = isIssued ? c.payer : c.payee;
//     return {
//       _id: c._id.toString(),
//       CarChassisNo: c.relatedDealId,
//       CustomerName: customer.fullName,
//       CustomerNationalID: customer.nationalId,
//       AccountHolderName: customer.fullName,
//       AccountHolderNationalID: customer.nationalId,
//       ChequeSeries: "",
//       ChequeSerial: c.chequeNumber,
//       SayadiID: "",
//       ChequeAmount: c.amount,
//       ChequeDueDate: c.dueDate,
//       ChequeRegisterDate: c.issueDate,
//       LastActionDate:
//         c.actions.length > 0
//           ? c.actions[c.actions.length - 1].actionDate
//           : "",
//       LastAction:
//         c.actions.length > 0
//           ? c.actions[c.actions.length - 1].actionType
//           : "",
//       ChequeStatus: c.status,
//       ChequeType: isIssued ? "صادره" : "وارده",
//       ChequeNotes: "",
//       CirculationStage: "",
//       Bank: c.bankName,
//       Branch: "",
//       PrevChequeNo: 0,
//       ShowroomAccountCard: "",
//     };
//   });

//   return {
//     car,
//     transactions: mappedTransactions,
//     cheques: mappedCheques,
//   };
// };

// type getIOperatorPercentType = () => Promise<IOperatorPercent>;
// export const getIOperatorPercent: getIOperatorPercentType = async () => {
//   const response = await axiosInstance.get(urls.others.brokers);
//   return response.data;
// };

// type getTransactionFormOptionsType = () => Promise<IOperatorPercent>;
// export const getTransactionFormOptions: getTransactionFormOptionsType =
//   async () => {
//     const response = await axiosInstance.get(
//       urls.others.transactionFormOptions
//     );
//     return response.data;
//   };
