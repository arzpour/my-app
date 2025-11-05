import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";

type getDetailsByChassisNoType = (
  chassisNo: string
) => Promise<IDetailsByChassis>;
export const getDetailsByChassisNo: getDetailsByChassisNoType = async (
  chassisNo
) => {
  const response = await axiosInstance.get(urls.detailsByChassisNo(chassisNo));
  return response.data;
};

type getIOperatorPercentType = () => Promise<IOperatorPercent>;
export const getIOperatorPercent: getIOperatorPercentType = async () => {
  const response = await axiosInstance.get(urls.others.brokers);
  return response.data;
};

type getTransactionFormOptionsType = () => Promise<IOperatorPercent>;
export const getTransactionFormOptions: getTransactionFormOptionsType =
  async () => {
    const response = await axiosInstance.get(
      urls.others.transactionFormOptions
    );
    return response.data;
  };
