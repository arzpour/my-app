import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDeal, updateDeal } from "../client/deals";
import { toast } from "sonner";

import { getAllDeals } from "../client/deals";

export const useGetAllDeals = () => {
  return useMutation({
    mutationKey: ["get-all-deals"],
    mutationFn: getAllDeals,
  });
};

export const useCreateDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-deals"] });
      queryClient.invalidateQueries({ queryKey: ["get-deal-by-vin"] });
      toast.success("معامله با موفقیت ثبت شد");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "خطا در ثبت معامله");
    },
  });
};

export const useUpdateDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateDeal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-deals"] });
      queryClient.invalidateQueries({ queryKey: ["get-deal-by-vin"] });
      toast.success("معامله با موفقیت به‌روزرسانی شد");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "خطا در به‌روزرسانی معامله"
      );
    },
  });
};
