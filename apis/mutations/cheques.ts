import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getChequesByDeal,
  getChequesByPersonId,
  getChequesByVin,
} from "../client/cheques";
import { toast } from "sonner";
import { updateCheque } from "../client/chequesNew";
import { IChequeNew } from "@/types/new-backend-types";

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

export const useGetChequesByPersonId = () => {
  return useMutation({
    mutationKey: ["get-cheques-by-person-id"],
    mutationFn: getChequesByPersonId,
  });
};

export const useUpdateCheque = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IChequeNew> }) =>
      updateCheque(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-cheques"] });
      queryClient.invalidateQueries({ queryKey: ["get-cheque-by-id"] });
      toast.success("معامله با موفقیت به‌روزرسانی شد");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "خطا در به‌روزرسانی چک");
    },
  });
};
