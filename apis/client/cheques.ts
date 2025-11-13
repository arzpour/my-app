import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";

type getAllChequesType = () => Promise<IChequeRes[]>;
export const getAllCheques: getAllChequesType = async () => {
  const response = await axiosInstance.get(urls.cheques.list);
  return response.data;
};

type getChequeByChassisType = (chassisNo: string) => Promise<IChequeRes[]>;
export const getChequeByChassis: getChequeByChassisType = async (
  chassisNo: string
) => {
  const response = await axiosInstance.get(urls.cheques.byChassisNo(chassisNo));
  return response.data;
};

type getUnpaidChequesType = (chassisNo: string) => Promise<IUnpaidCheque>;
export const getUnpaidCheques: getUnpaidChequesType = async (
  chassisNo: string
) => {
  const response = await axiosInstance.get(urls.cheques.unpaid(chassisNo));
  return response.data;
};

type createChequeType = (data: Partial<IChequeRes>) => Promise<IChequeRes>;
export const createCheque: createChequeType = async (data) => {
  const response = await axiosInstance.post(urls.cheques.create, data);
  return response.data;
};
