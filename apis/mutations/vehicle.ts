import { useMutation } from "@tanstack/react-query";
import { deleteVehicle, updateVehicle } from "../client/vehicles";

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