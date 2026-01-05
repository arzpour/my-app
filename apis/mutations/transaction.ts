import { useMutation } from "@tanstack/react-query";
import {
  getTransactionsByDeal,
  getTransactionsByPerson,
} from "../client/transaction";

export const useGetTransactionsByDealId = () => {
  return useMutation({
    mutationKey: ["get-transactions-by-deal-id"],
    mutationFn: getTransactionsByDeal,
  });
};

export const useGetTransactionsByPersonId = () => {
  return useMutation({
    mutationKey: ["get-transactions-by-person-id"],
    mutationFn: getTransactionsByPerson,
  });
};
