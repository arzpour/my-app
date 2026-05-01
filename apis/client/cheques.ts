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

// Get cheques by deal ID
type getChequesByDealType = (dealId: string) => Promise<IChequeNew[]>;
export const getChequesByDeal: getChequesByDealType = async (dealId) => {
  const response = await axiosInstance.get(urls.chequesNew.byDeal(dealId));
  return response.data;
};

// Get cheques by person ID
type getChequesByPersonIdType = (
  personId: string,
) => Promise<IChequesByPersonResponse>;
export const getChequesByPersonId: getChequesByPersonIdType = async (
  personId,
) => {
  const response = await axiosInstance.get(urls.chequesNew.byPerson(personId));
  return response.data;
};

// Get cheques by status
type getChequesByStatusType = (status: string) => Promise<IChequeNew[]>;
export const getChequesByStatus: getChequesByStatusType = async (status) => {
  const response = await axiosInstance.get(urls.chequesNew.byStatus(status));
  return response.data;
};

//  Get unpaid cheques by deal ID
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

// Create cheque
type createChequeType = (data: Partial<IChequeNew>) => Promise<IChequeNew>;
export const createCheque: createChequeType = async (data) => {
  const response = await axiosInstance.post(urls.chequesNew.create, data);
  return response.data;
};

// Update cheque
type updateChequeType = (
  id: string,
  data: Partial<IChequeNew>,
) => Promise<IChequeNew>;
export const updateCheque: updateChequeType = async (id, data) => {
  const response = await axiosInstance.put(urls.chequesNew.update(id), data);
  return response.data;
};

// Get cheque byDeal
type getChequeByDealIdType = (id: string) => Promise<IChequeNew>;
export const getChequeByDealId: getChequeByDealIdType = async (id) => {
  const response = await axiosInstance.get(urls.chequesNew.byDeal(id));
  return response.data;
};

// Add action to cheque
type addChequeActionType = (
  id: string,
  action: {
    actionType: string;
    actionDate: string;
    actorUserId: string;
    description: string;
  },
) => Promise<IChequeNew>;
export const addChequeAction: addChequeActionType = async (id, action) => {
  const response = await axiosInstance.post(
    urls.chequesNew.addAction(id),
    action,
  );
  return response.data;
};

// Delete cheque
type deleteChequeType = (id: string) => Promise<void>;
export const deleteCheque: deleteChequeType = async (id) => {
  const response = await axiosInstance.delete(urls.chequesNew.delete(id));
  return response.data;
};
