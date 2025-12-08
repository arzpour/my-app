import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getChequeByChassis,
  getUnpaidCheques,
  createCheque,
  getChequesByDeal,
} from "../client/cheques";

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

export const useCreateCheque = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-cheque"],
    mutationFn: createCheque,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-cheques"] });
    },
  });
};

export const useGetChequesByDealId = () => {
  return useMutation({
    mutationKey: ["get-cheques-by-deal-id"],
    mutationFn: getChequesByDeal,
  });
};
