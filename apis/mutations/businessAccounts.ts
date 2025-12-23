import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBusinessAccount, updateBusinessAccount } from "../client/businessAccounts";
import { toast } from "sonner";

export const useCreateBusinessAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBusinessAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-business-accounts"] });
      toast.success("حساب بانکی با موفقیت ثبت شد");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "خطا در ثبت حساب بانکی");
    },
  });
};

export const useUpdateBusinessAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateBusinessAccount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-business-accounts"] });
      toast.success("اطلاعات حساب بانکی با موفقیت به‌روزرسانی شد");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "خطا در به‌روزرسانی حساب بانکی");
    },
  });
};

