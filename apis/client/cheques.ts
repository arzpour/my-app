import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";
import type {
  IChequeNew,
  IUnpaidChequesResponse,
  IChequesByPersonResponse,
} from "@/types/new-backend-types";

type getAllChequesType = () => Promise<IChequeNew[]>;
export const getAllCheques: getAllChequesType = async () => {
  const response = await axiosInstance.get(urls.cheques.list);
  return response.data;
};

type getChequesByIdType = (id: string) => Promise<IChequeNew>;
export const getChequesById: getChequesByIdType = async (id) => {
  const response = await axiosInstance.get(urls.chequesNew.byId(id));
  return response.data;
};

type getChequesByVinType = (vin: string) => Promise<IChequeNew[]>;
export const getChequesByVin: getChequesByVinType = async (vin) => {
  const response = await axiosInstance.get(urls.chequesNew.byVin(vin));
  return response.data;
};

// Legacy function - maps to new API
// type getChequeByChassisType = (chassisNo: string) => Promise<IChequeRes[]>;
// export const getChequeByChassis: getChequeByChassisType = async (
//   chassisNo: string
// ) => {
//   // First get deal by VIN to get dealId
//   const { getDealByVin } = await import("./deals");
//   const deal = await getDealByVin(chassisNo);
//   const dealId = deal._id.toString();

//   // Then get cheques by dealId
//   const cheques = await getChequesByDeal(dealId);

//   // Map to old format
//   return cheques.map(mapChequeToOldFormat);
// };

// New function: Get cheques by deal ID
type getChequesByDealType = (dealId: string) => Promise<IChequeNew[]>;
export const getChequesByDeal: getChequesByDealType = async (dealId) => {
  const response = await axiosInstance.get(urls.chequesNew.byDeal(dealId));
  return response.data;
};

// Get cheques by person ID
type getChequesByPersonType = (
  personId: string,
) => Promise<IChequesByPersonResponse>;
export const getChequesByPerson: getChequesByPersonType = async (personId) => {
  const response = await axiosInstance.get(urls.chequesNew.byPerson(personId));
  return response.data;
};

// Get cheques by status
type getChequesByStatusType = (status: string) => Promise<IChequeNew[]>;
export const getChequesByStatus: getChequesByStatusType = async (status) => {
  const response = await axiosInstance.get(urls.chequesNew.byStatus(status));
  return response.data;
};

// Legacy function - maps to new API
// type getUnpaidChequesType = (chassisNo: string) => Promise<IUnpaidCheque>;
// export const getUnpaidCheques: getUnpaidChequesType = async (
//   chassisNo: string
// ) => {
//   // First get deal by VIN to get dealId
//   const { getDealByVin } = await import("./deals");
//   const deal = await getDealByVin(chassisNo);
//   const dealId = deal._id.toString();

//   // Then get unpaid cheques by dealId
//   const unpaidData = await getUnpaidChequesByDeal(dealId);

//   // Map to old format
//   return {
//     status: 200,
//     data: {
//       cheques: unpaidData.cheques.map(mapChequeToOldFormat),
//       totals: unpaidData.totals,
//     },
//   };
// };

// New function: Get unpaid cheques by deal ID
type getUnpaidChequesByDealType = (
  dealId: string,
) => Promise<IUnpaidChequesResponse>;
export const getUnpaidChequesByDeal: getUnpaidChequesByDealType = async (
  dealId,
) => {
  const response = await axiosInstance.get(
    urls.chequesNew.unpaidByDeal(dealId),
  );
  return response.data;
};

// Create cheque - accepts both old and new format
// type createChequeType = (
//   data: Partial<IChequeRes> | Partial<IChequeNew>
// ) => Promise<IChequeNew>;
// export const createCheque: createChequeType = async (data) => {
//   // If data has old format fields, convert to new format
//   const newData = isOldChequeFormat(data)
//     ? await mapOldChequeToNew(data as Partial<IChequeRes>)
//     : data;

//   const response = await axiosInstance.post(urls.chequesNew.create, newData);
//   return response.data;
// };

// // Helper function to check if data is in old format
// function isOldChequeFormat(data: any): boolean {
//   return (
//     data.ChequeType !== undefined ||
//     data.ChequeAmount !== undefined ||
//     data.CarChassisNo !== undefined
//   );
// }

// // Helper function to map old cheque format to new
// async function mapOldChequeToNew(
//   oldData: Partial<IChequeRes>
// ): Promise<Partial<IChequeNew>> {
//   // Convert VIN to dealId if needed
//   let relatedDealId = 0;
//   if (oldData.CarChassisNo) {
//     try {
//       const { getDealByVin } = await import("./deals");
//       const deal = await getDealByVin(oldData.CarChassisNo.toString());
//       relatedDealId = parseInt(deal._id.toString());
//     } catch (error) {
//       console.error("Error converting VIN to dealId:", error);
//     }
//   }

//   // Determine payer/payee based on ChequeType
//   const isIssued = oldData.ChequeType === "صادره";

//   return {
//     chequeNumber: oldData.ChequeSerial || 0,
//     bankName: oldData.Bank || "",
//     issueDate: oldData.ChequeRegisterDate || new Date().toISOString(),
//     dueDate: oldData.ChequeDueDate || "",
//     amount: oldData.ChequeAmount || 0,
//     type: isIssued ? "issued" : "received",
//     status: oldData.ChequeStatus || "unpaid",
//     payer: isIssued
//       ? {
//           personId: oldData.CustomerNationalID || "",
//           fullName: oldData.CustomerName || "",
//           nationalId: oldData.CustomerNationalID || "",
//         }
//       : {
//           personId: "",
//           fullName: "",
//           nationalId: "",
//         },
//     payee: !isIssued
//       ? {
//           personId: oldData.CustomerNationalID || "",
//           fullName: oldData.CustomerName || "",
//           nationalId: oldData.CustomerNationalID || "",
//         }
//       : {
//           personId: "",
//           fullName: "",
//           nationalId: "",
//         },
//     relatedDealId: relatedDealId,
//     relatedTransactionId: 0,
//     actions: [],
//   };
// }

// // Helper function to map new cheque format to old
// function mapChequeToOldFormat(newData: IChequeNew): IChequeRes {
//   const isIssued = newData.type === "issued";
//   const customer = isIssued ? newData.payer : newData.payee;

//   return {
//     _id: newData._id.toString(),
//     CarChassisNo: newData.relatedDealId,
//     CustomerName: customer.fullName,
//     CustomerNationalID: customer.nationalId,
//     AccountHolderName: customer.fullName,
//     AccountHolderNationalID: customer.nationalId,
//     ChequeSeries: "",
//     ChequeSerial: newData.chequeNumber,
//     SayadiID: "",
//     ChequeAmount: newData.amount,
//     ChequeDueDate: newData.dueDate,
//     ChequeRegisterDate: newData.issueDate,
//     LastActionDate:
//       newData.actions.length > 0
//         ? newData.actions[newData.actions.length - 1].actionDate
//         : "",
//     LastAction:
//       newData.actions.length > 0
//         ? newData.actions[newData.actions.length - 1].actionType
//         : "",
//     ChequeStatus: newData.status,
//     ChequeType: isIssued ? "صادره" : "وارده",
//     ChequeNotes: "",
//     CirculationStage: "",
//     Bank: newData.bankName,
//     Branch: "",
//     PrevChequeNo: 0,
//     ShowroomAccountCard: "",
//   };
// }
