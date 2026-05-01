import { useMutation } from "@tanstack/react-query";
import {
  createVehicle,
  deleteVehicle,
  getVehicleByVin,
  updateVehicle,
} from "../client/vehicles";

export const useCreateVehicle = () => {
  return useMutation({
    mutationKey: ["create-vehicle"],
    mutationFn: createVehicle,
  });
};

export const useGetVehicleByVin = () => {
  return useMutation({
    mutationKey: ["get-vehicle-by-vin"],
    mutationFn: getVehicleByVin,
  });
};

export const useUpdateVehicle = () => {
  return useMutation({
    mutationKey: ["update-vehicle"],
    mutationFn: updateVehicle,
  });
};

export const useDeleteVehicle = () => {
  return useMutation({
    mutationKey: ["delete-vehicle"],
    mutationFn: deleteVehicle,
  });
};
