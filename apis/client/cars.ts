import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";

type getAllCarsType = () => Promise<ICarRes[]>;
export const getAllCars: getAllCarsType = async () => {
  const response = await axiosInstance.get(urls.cars.list);
  return response.data;
};

type getAllCarChassisNoType = () => Promise<string[]>;
export const getAllCarChassisNo: getAllCarChassisNoType = async () => {
  const response = await axiosInstance.get(urls.cars.chassisNo);
  return response.data;
};

type getCarByChassisNoType = (chassisNo: string) => Promise<ICarRes>;
export const getCarByChassisNo: getCarByChassisNoType = async (chassisNo) => {
  const response = await axiosInstance.get(urls.cars.byChassisNo(chassisNo));
  return response.data;
};


