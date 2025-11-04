import { useMutation } from "@tanstack/react-query";
import {
  getDetailsByChassisNo,
  getIOperatorPercent,
} from "../client/detailsByChassisNo";

export const useGetDetailByChassisNo = () => {
  return useMutation({
    mutationKey: ["get-details-by-chassis"],
    mutationFn: getDetailsByChassisNo,
  });
};
export const useGetOperatorPercent = () => {
  return useMutation({
    mutationKey: ["get-operator-Percent"],
    mutationFn: getIOperatorPercent,
  });
};
