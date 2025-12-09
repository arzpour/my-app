import { useMutation } from "@tanstack/react-query";
import { getAllDeals } from "../client/deals";

export const useGetAllDeals = () => {
  return useMutation({
    mutationKey: ["get-all-deals"],
    mutationFn: getAllDeals,
  });
};
