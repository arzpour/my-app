import { useMutation } from "@tanstack/react-query";
import { getChequeByChassis, getUnpaidCheques } from "../client/cheques";

export const useGetChequeByChassisNo = () => {
  return useMutation({
    mutationKey: ["get-cheque-by-chassis"],
    mutationFn: getChequeByChassis,
  });
};

export const useGetUnpaidCheques = () => {
  return useMutation({
    mutationKey: ["get-unpaid-cheque-by-chassis"],
    mutationFn: getUnpaidCheques,
  });
};
