import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";

type getDetailsByChassisNoType = (chassisNo: string) => Promise<IDetailsByChassis>;
export const getDetailsByChassisNo: getDetailsByChassisNoType = async (
  chassisNo
) => {
  const response = await axiosInstance.get(urls.detailsByChassisNo(chassisNo));
  return response.data;
};
