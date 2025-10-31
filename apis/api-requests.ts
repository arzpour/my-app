import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";

type getAllCarsType = () => Promise<any>;
export const getAllCars: getAllCarsType = async () => {
  const response = await axiosInstance.get(urls.cars);
  return response.data;
};

type getAllChequesType = () => Promise<any>;
export const getAllCheques: getAllChequesType = async () => {
  const response = await axiosInstance.get(urls.cheques);
  return response.data;
};

type getAllTransactionsType = () => Promise<any>;
export const getAllTransactions: getAllTransactionsType = async () => {
  const response = await axiosInstance.get(urls.transactions);
  return response.data;
};
