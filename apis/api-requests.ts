import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";

type getAllCarsType = () => Promise<ICarRes[]>;
export const getAllCars: getAllCarsType = async () => {
  const response = await axiosInstance.get(urls.cars.list);
  return response.data;
};

type getCarByChassisNoType = (chassisNo: string) => Promise<ICarRes>;
export const getCarByChassisNo: getCarByChassisNoType = async (chassisNo) => {
  const response = await axiosInstance.get(urls.cars.byChassisNo(chassisNo));
  return response.data;
};

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
