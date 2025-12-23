import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLoan, updateLoan } from "../client/loans";
import { toast } from "sonner";

export const useCreateLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLoan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-loans"] });
      queryClient.invalidateQueries({ queryKey: ["get-loans-by-borrower"] });
      toast.success("وام با موفقیت ثبت شد");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "خطا در ثبت وام");
    },
  });
};

export const useUpdateLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateLoan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-loans"] });
      queryClient.invalidateQueries({ queryKey: ["get-loans-by-borrower"] });
      toast.success("وام با موفقیت به‌روزرسانی شد");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "خطا در به‌روزرسانی وام"
      );
    },
  });
};

