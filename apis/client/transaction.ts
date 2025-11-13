import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";

type getAllTransactionsType = () => Promise<ITransactionRes[]>;
export const getAllTransactions: getAllTransactionsType = async () => {
  const response = await axiosInstance.get(urls.transactions.list);
  return response.data;
};

type getTransactionByChassisType = (
  chassisNo: string
) => Promise<ITransactionRes[]>;
export const getTransactionByChassis: getTransactionByChassisType = async (
  chassisNo: string
) => {
  const response = await axiosInstance.get(
    urls.transactions.byChassisNo(chassisNo)
  );
  return response.data;
};

type createTransactionType = (
  data: Partial<ITransactionRes>
) => Promise<ITransactionRes>;
export const createTransaction: createTransactionType = async (data) => {
  const response = await axiosInstance.post(urls.transactions.create, data);
  return response.data;
};
