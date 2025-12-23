import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";
import type { IBusinessAccounts } from "@/types/new-backend-types";

// Get all business accounts
type getAllBusinessAccountsType = () => Promise<IBusinessAccounts[]>;
export const getAllBusinessAccounts: getAllBusinessAccountsType = async () => {
  const response = await axiosInstance.get(urls.businessAccounts.list);
  return response.data;
};

// Get active business accounts
type getActiveBusinessAccountsType = () => Promise<IBusinessAccounts[]>;
export const getActiveBusinessAccounts: getActiveBusinessAccountsType = async () => {
  const response = await axiosInstance.get(urls.businessAccounts.active);
  return response.data;
};

// Get business account by ID
type getBusinessAccountByIdType = (id: string) => Promise<IBusinessAccounts>;
export const getBusinessAccountById: getBusinessAccountByIdType = async (id) => {
  const response = await axiosInstance.get(urls.businessAccounts.byId(id));
  return response.data;
};

// Create new business account
type createBusinessAccountType = (data: Partial<IBusinessAccounts>) => Promise<IBusinessAccounts>;
export const createBusinessAccount: createBusinessAccountType = async (data) => {
  const response = await axiosInstance.post(urls.businessAccounts.create, data);
  return response.data;
};

// Update business account
type updateBusinessAccountType = (id: string, data: Partial<IBusinessAccounts>) => Promise<IBusinessAccounts>;
export const updateBusinessAccount: updateBusinessAccountType = async (id, data) => {
  const response = await axiosInstance.put(urls.businessAccounts.update(id), data);
  return response.data;
};

// Delete business account
type deleteBusinessAccountType = (id: string) => Promise<void>;
export const deleteBusinessAccount: deleteBusinessAccountType = async (id) => {
  await axiosInstance.delete(urls.businessAccounts.delete(id));
};

