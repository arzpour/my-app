import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getTransactionsByDeal,
  getTransactionsByPerson,
  updateTransaction,
  deleteTransaction,
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

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) =>
      updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-transactions-by-deal-id"],
      });
      queryClient.invalidateQueries({ queryKey: ["get-transaction-by-id"] });
      toast.success("تراکنش با موفقیت به‌روزرسانی شد");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "خطا در به‌روزرسانی تراکنش",
      );
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-transactions-by-deal-id"],
      });
      toast.success("تراکنش با موفقیت حذف شد");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "خطا در حذف تراکنش");
    },
  });
};
