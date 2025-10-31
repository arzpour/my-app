import { useMutation } from "@tanstack/react-query";
import { getCarByChassisNo } from "../client/cars";


export const useGetCarByChassisNo = () => {
  return useMutation({
    mutationKey: ["get-car-by-chassis"],
    mutationFn: getCarByChassisNo,
  });
};
