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

type getCarByNationalIdType = (nationalId: string) => Promise<ICarRes>;
export const getCarByNationalId: getCarByNationalIdType = async (
  nationalId
) => {
  const response = await axiosInstance.get(urls.cars.byNationalId(nationalId));
  return response.data;
};

type getUniqeUsersDataType = () => Promise<IUniqeUsersData[]>;
export const getUniqeUsersData: getUniqeUsersDataType = async () => {
  const response = await axiosInstance.get(urls.cars.usersData);
  return response.data;
};

type getFilterByUserDataType = (data: {
  nationalId: string;
  userName: string;
}) => Promise<ICarDataByNationalIdOrName>;
export const getFilterByUserData: getFilterByUserDataType = async ({
  nationalId,
  userName,
}) => {
  const params: any = {};

  if (nationalId) params.nationalId = nationalId;
  if (userName) params.userName = userName;
  const response = await axiosInstance.get(urls.cars.filterByUser, { params });
  return response.data;
};
