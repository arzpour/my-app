import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";
import type { IChequeNew } from "@/types/new-backend-types";

// Create cheque
type createChequeType = (data: Partial<IChequeNew>) => Promise<IChequeNew>;
export const createCheque: createChequeType = async (data) => {
  const response = await axiosInstance.post(urls.chequesNew.create, data);
  return response.data;
};

// Update cheque
type updateChequeType = (id: string, data: Partial<IChequeNew>) => Promise<IChequeNew>;
export const updateCheque: updateChequeType = async (id, data) => {
  const response = await axiosInstance.put(urls.chequesNew.update(id), data);
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
  }
) => Promise<IChequeNew>;
export const addChequeAction: addChequeActionType = async (id, action) => {
  const response = await axiosInstance.post(urls.chequesNew.addAction(id), action);
  return response.data;
};

