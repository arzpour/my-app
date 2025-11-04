import { useMutation } from "@tanstack/react-query";
import { getCarByChassisNo, getCarByNationalId } from "../client/cars";

export const useGetCarByChassisNo = () => {
  return useMutation({
    mutationKey: ["get-car-by-chassis"],
    mutationFn: getCarByChassisNo,
  });
};

export const useGetCarByNationalId = () => {
  return useMutation({
    mutationKey: ["get-car-by-national-id"],
    mutationFn: getCarByNationalId,
  });
};

