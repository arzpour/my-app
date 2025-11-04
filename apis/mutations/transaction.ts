import { useMutation } from "@tanstack/react-query";
import { getTransactionByChassis } from "../client/transaction";

export const useGetTransactionByChassisNo = () => {
  return useMutation({
    mutationKey: ["get-transaction-by-chassis"],
    mutationFn: getTransactionByChassis,
  });
};
