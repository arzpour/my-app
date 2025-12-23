"use client";

import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  chequeActionsSchema,
  chequeActionsSchemaType,
} from "@/validations/chequeActions";
import { toast } from "sonner";
import { getAllBusinessAccounts } from "@/apis/client/businessAccounts";
import { useQuery } from "@tanstack/react-query";
import PersianDatePicker from "../global/persianDatePicker";
import { CHEQUE_ACTIONS } from "@/utils/systemConstants";
import type { IBusinessAccounts } from "@/types/new-backend-types";

interface ChequeActionsFormProps {
  chequeId?: string;
  onSuccess?: () => void;
  embedded?: boolean;
}

const ChequeActionsForm: React.FC<ChequeActionsFormProps> = ({
  chequeId,
  onSuccess,
  embedded = false,
}) => {
  const { data: allAccounts } = useQuery({
    queryKey: ["get-all-business-accounts"],
    queryFn: getAllBusinessAccounts,
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<chequeActionsSchemaType>({
    resolver: zodResolver(chequeActionsSchema),
    defaultValues: {
      chequeId: chequeId || "",
      actionType: "پاس شدن",
      actionDate: "",
      description: "",
      businessAccountId: "",
    },
  });

  const actionType = watch("actionType");
  const showAccountField = actionType === "پاس شدن";

  const onSubmit: SubmitHandler<chequeActionsSchemaType> = async (data) => {
    try {
      const actionData = {
        actionType: data.actionType,
        actionDate: data.actionDate,
        description: data.description || "",
        businessAccountId: data.businessAccountId || "",
      };

      // TODO: Call API to add action to cheque
      console.log("Cheque action data:", actionData);
      toast.success("عملیات با موفقیت ثبت شد");
      onSuccess?.();
    } catch (error: any) {
      console.error("Error adding cheque action:", error);
      toast.error(error?.response?.data?.message || "خطا در ثبت عملیات");
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">اطلاعات عملیات</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!chequeId && (
            <div className="space-y-2">
              <label htmlFor="chequeId" className="block text-sm font-medium">
                شماره چک *
              </label>
              <input
                id="chequeId"
                {...register("chequeId")}
                placeholder="شماره چک"
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.chequeId && (
                <p className="text-red-500 text-xs">
                  {errors.chequeId.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="actionType" className="block text-sm font-medium">
              نوع عملیات *
            </label>
            <select
              id="actionType"
              {...register("actionType")}
              className="w-full px-3 py-2 border rounded-md"
            >
              {CHEQUE_ACTIONS.map((action) => (
                <option key={action.value} value={action.label}>
                  {action.label}
                </option>
              ))}
            </select>
            {errors.actionType && (
              <p className="text-red-500 text-xs">
                {errors.actionType.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">تاریخ عملیات *</label>
            <Controller
              name="actionDate"
              control={control}
              render={({ field }) => (
                <PersianDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="تاریخ عملیات"
                />
              )}
            />
            {errors.actionDate && (
              <p className="text-red-500 text-xs">
                {errors.actionDate.message}
              </p>
            )}
          </div>

          {showAccountField && (
            <div className="space-y-2">
              <label
                htmlFor="businessAccountId"
                className="block text-sm font-medium"
              >
                حساب بانکی (اگر چک پاس شده)
              </label>
              <select
                id="businessAccountId"
                {...register("businessAccountId")}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">انتخاب حساب</option>
                {allAccounts
                  ?.filter((acc) => acc.isActive)
                  .map((acc) => (
                    <option
                      key={acc._id?.toString()}
                      value={acc._id?.toString()}
                    >
                      {acc.accountName} - {acc.bankName}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium">
              توضیحات (مثلاً شماره پیگیری)
            </label>
            <textarea
              id="description"
              {...register("description")}
              placeholder="توضیحات"
              rows={3}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          ثبت عملیات
        </button>
      </div>
    </form>
  );

  if (embedded) {
    return (
      <div dir="rtl">
        <div className="mb-4">
          <h2 className="text-xl font-bold">عملیات روی چک</h2>
        </div>
        {formContent}
      </div>
    );
  }

  return <div dir="rtl">{formContent}</div>;
};

export default ChequeActionsForm;
