import { useMutation } from "@tanstack/react-query";
import { getChequesByDeal, getChequesByVin } from "../client/cheques";

export const useGetChequesByDealId = () => {
  return useMutation({
    mutationKey: ["get-cheques-by-deal-id"],
    mutationFn: getChequesByDeal,
  });
};

export const useGetChequesByVin = () => {
  return useMutation({
    mutationKey: ["get-cheques-by-vin"],
    mutationFn: getChequesByVin,
  });
};
