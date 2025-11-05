import { useMutation } from "@tanstack/react-query";
import { getInvestmentByChassis } from "../client/investment";

export const useGetInvestmentByChassis = () => {
  return useMutation({
    mutationKey: ["get-investment-by-chassis"],
    mutationFn: getInvestmentByChassis,
  });
};
