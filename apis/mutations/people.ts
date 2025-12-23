import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPerson, updatePerson } from "../client/people";
import { toast } from "sonner";

export const useCreatePerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPerson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-people"] });
      toast.success("شخص با موفقیت ثبت شد");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "خطا در ثبت شخص");
    },
  });
};

export const useUpdatePerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updatePerson(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-people"] });
      toast.success("اطلاعات شخص با موفقیت به‌روزرسانی شد");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "خطا در به‌روزرسانی شخص");
    },
  });
};

