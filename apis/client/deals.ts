import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";
import type { IDeal, IDealsByPersonResponse } from "@/types/new-backend-types";

// Get all deals
type getAllDealsType = () => Promise<IDeal[]>;
export const getAllDeals: getAllDealsType = async () => {
  const response = await axiosInstance.get(urls.deals.list);
  return response.data;
};

// Get deal by ID
type getDealByIdType = (id: string) => Promise<IDeal>;
export const getDealById: getDealByIdType = async (id) => {
  const response = await axiosInstance.get(urls.deals.byId(id));
  return response.data;
};

// Get deal by VIN (replaces getCarByChassisNo)
type getDealByVinType = (vin: string) => Promise<IDeal[]>;
export const getDealByVin: getDealByVinType = async (vin) => {
  const response = await axiosInstance.get(urls.deals.byVin(vin));
  return response.data;
};

// Get deals by vehicle ID
type getDealsByVehicleIdType = (vehicleId: string) => Promise<IDeal[]>;
export const getDealsByVehicleId: getDealsByVehicleIdType = async (
  vehicleId
) => {
  const response = await axiosInstance.get(urls.deals.byVehicleId(vehicleId));
  return response.data;
};

// Get deals by person ID (replaces getFilterByUserData)
type getDealsByPersonType = (
  personId: string
) => Promise<IDealsByPersonResponse>;
export const getDealsByPerson: getDealsByPersonType = async (personId) => {
  const response = await axiosInstance.get(urls.deals.byPerson(personId));
  return response.data;
};

// Get deals by status
type getDealsByStatusType = (status: string) => Promise<IDeal[]>;
export const getDealsByStatus: getDealsByStatusType = async (status) => {
  const response = await axiosInstance.get(urls.deals.byStatus(status));
  return response.data;
};

// Create new deal (replaces createCar)
type createDealType = (data: Partial<IDeal>) => Promise<IDeal>;
export const createDeal: createDealType = async (data) => {
  const response = await axiosInstance.post(urls.deals.create, data);
  return response.data;
};

// Update deal (replaces updateCar)
type updateDealType = (id: string, data: Partial<IDeal>) => Promise<IDeal>;
export const updateDeal: updateDealType = async (id, data) => {
  const response = await axiosInstance.put(urls.deals.update(id), data);
  return response.data;
};

// Delete deal
type deleteDealType = (id: string) => Promise<void>;
export const deleteDeal: deleteDealType = async (id) => {
  await axiosInstance.delete(urls.deals.delete(id));
};
