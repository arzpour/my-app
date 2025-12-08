import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTransactionByChassis,
  createTransaction,
  getTransactionsByDeal,
} from "../client/transaction";

export const useGetTransactionByChassisNo = () => {
  return useMutation({
    mutationKey: ["get-transaction-by-chassis"],
    mutationFn: getTransactionByChassis,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-transaction"],
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-transactions"] });
    },
  });
};

export const useGetTransactionsByDealId = () => {
  return useMutation({
    mutationKey: ["get-transactions-by-deal-id"],
    mutationFn: getTransactionsByDeal,
  });
};
