import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";
import type { IVehicle } from "@/types/new-backend-types";

// Get all vehicles
type getAllVehiclesType = () => Promise<IVehicle[]>;
export const getAllVehicles: getAllVehiclesType = async () => {
  const response = await axiosInstance.get(urls.vehicles.list);
  return response.data;
};

// Get vehicle by ID
type getVehicleByIdType = (id: string) => Promise<IVehicle>;
export const getVehicleById: getVehicleByIdType = async (id) => {
  const response = await axiosInstance.get(urls.vehicles.byId(id));
  return response.data;
};

// Get vehicle by VIN
type getVehicleByVinType = (vin: string) => Promise<IVehicle>;
export const getVehicleByVin: getVehicleByVinType = async (vin) => {
  const response = await axiosInstance.get(urls.vehicles.byVin(vin));
  return response.data;
};

// Create new vehicle
type createVehicleType = (data: Partial<IVehicle>) => Promise<IVehicle>;
export const createVehicle: createVehicleType = async (data) => {
  const response = await axiosInstance.post(urls.vehicles.create, data);
  return response.data;
};

// Update vehicle
type updateVehicleType = (id: string, data: Partial<IVehicle>) => Promise<IVehicle>;
export const updateVehicle: updateVehicleType = async (id, data) => {
  const response = await axiosInstance.put(urls.vehicles.update(id), data);
  return response.data;
};

// Delete vehicle
type deleteVehicleType = (id: string) => Promise<void>;
export const deleteVehicle: deleteVehicleType = async (id) => {
  await axiosInstance.delete(urls.vehicles.delete(id));
};

