import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";

type getInvestmentByChassisType = (
  chassisNo: string
) => Promise<IInvestmentRes>;
export const getInvestmentByChassis: getInvestmentByChassisType = async (
  chassisNo
) => {
  const response = await axiosInstance.get(urls.investmentByChassis(chassisNo));
  return response.data;
};
