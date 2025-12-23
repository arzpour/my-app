import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSalary, updateSalary } from "../client/salaries";
import { toast } from "sonner";

export const useCreateSalary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSalary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-salaries"] });
      queryClient.invalidateQueries({ queryKey: ["get-salaries-by-employee"] });
      queryClient.invalidateQueries({ queryKey: ["get-salaries-by-period"] });
      toast.success("فیش حقوقی با موفقیت ثبت شد");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "خطا در ثبت فیش حقوقی");
    },
  });
};

export const useUpdateSalary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateSalary(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-salaries"] });
      queryClient.invalidateQueries({ queryKey: ["get-salaries-by-employee"] });
      toast.success("فیش حقوقی با موفقیت به‌روزرسانی شد");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "خطا در به‌روزرسانی فیش حقوقی"
      );
    },
  });
};

