import { useMutation } from "@tanstack/react-query";
import { updateVehicle } from "../client/vehicles";

export const useUpdateVehicle = () => {
    return useMutation({
      mutationKey: ["update-vehicle"],
      mutationFn: updateVehicle,
    });
  };
  