import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";


type getAllChequesType = () => Promise<IChequeRes[]>;
export const getAllCheques: getAllChequesType = async () => {
  const response = await axiosInstance.get(urls.cheques);
  return response.data;
};

type getAllTransactionsType = () => Promise<ITransactionRes>;
export const getAllTransactions: getAllTransactionsType = async () => {
  const response = await axiosInstance.get(urls.transactions);
  return response.data;
};
