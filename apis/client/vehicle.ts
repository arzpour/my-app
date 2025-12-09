import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";

type getAllVehiclesType = () => Promise<any[]>;
export const getAllVehicles: getAllVehiclesType = async () => {
  const response = await axiosInstance.get(urls.vehicles.list);
  return response.data;
};
