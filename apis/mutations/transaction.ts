import { useMutation } from "@tanstack/react-query";
import { getTransactionsByDeal } from "../client/transaction";

export const useGetTransactionsByDealId = () => {
  return useMutation({
    mutationKey: ["get-transactions-by-deal-id"],
    mutationFn: getTransactionsByDeal,
  });
};
