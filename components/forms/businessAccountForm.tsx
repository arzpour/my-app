"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  businessAccountSchema,
  businessAccountSchemaType,
} from "@/validations/businessAccount";
import { toast } from "sonner";
import {
  useCreateBusinessAccount,
  useUpdateBusinessAccount,
} from "@/apis/mutations/businessAccounts";
import { BANK_NAMES } from "@/utils/systemConstants";
import type { IBusinessAccounts } from "@/types/new-backend-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface BusinessAccountFormProps {
  accountData?: IBusinessAccounts | null;
  mode?: "add" | "edit";
  onSuccess?: () => void;
  embedded?: boolean; // If true, render without Dialog wrapper
}

const BusinessAccountForm: React.FC<BusinessAccountFormProps> = ({
  accountData,
  mode = "add",
  onSuccess,
  embedded = false,
}) => {
  const [open, setOpen] = React.useState(embedded);
  const createAccount = useCreateBusinessAccount();
  const updateAccount = useUpdateBusinessAccount();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<businessAccountSchemaType>({
    resolver: zodResolver(businessAccountSchema) as any,
    defaultValues: {
      accountName: "",
      bankName: "",
      branchName: "",
      accountNumber: "",
      iban: "",
      cardNumber: "",
      isActive: true,
      currentBalance: "",
    },
  });

  const isActive = watch("isActive");

  // Populate form when editing
  React.useEffect(() => {
    if (mode === "edit" && accountData) {
      reset({
        accountName: accountData.accountName || "",
        bankName: accountData.bankName || "",
        branchName: accountData.branchName || "",
        accountNumber: accountData.accountNumber?.toString() || "",
        iban: accountData.iban || "",
        cardNumber: accountData.cardNumber || "",
        isActive: accountData.isActive ?? true,
        currentBalance: accountData.currentBalance?.toString() || "",
      });
    }
  }, [accountData, mode, reset]);

  const onSubmit: SubmitHandler<businessAccountSchemaType> = async (
    data: any
  ) => {
    try {
      const payload: Partial<IBusinessAccounts> = {
        accountName: data.accountName,
        bankName: data.bankName,
        branchName: data.branchName,
        accountNumber: Number(data.accountNumber),
        iban: data.iban,
        cardNumber: data.cardNumber || "",
        isActive: data.isActive,
        currentBalance: Number(data.currentBalance),
      };

      if (mode === "edit" && accountData?._id) {
        await updateAccount.mutateAsync({
          id: accountData._id.toString(),
          data: payload,
        });
      } else {
        await createAccount.mutateAsync(payload);
      }

      reset();
      if (!embedded) setOpen(false);
      if (embedded && onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error saving business account:", error);
      toast.error(error?.response?.data?.message || "خطا در ثبت اطلاعات");
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="accountName" className="block text-sm font-medium">
            نام نمایشی حساب *
          </label>
          <input
            id="accountName"
            {...register("accountName")}
            placeholder="مثلاً حساب اصلی"
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.accountName && (
            <p className="text-red-500 text-xs">{errors.accountName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="bankName" className="block text-sm font-medium">
            نام بانک *
          </label>
          <select
            id="bankName"
            {...register("bankName")}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">انتخاب کنید</option>
            {BANK_NAMES.map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
          {errors.bankName && (
            <p className="text-red-500 text-xs">{errors.bankName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="branchName" className="block text-sm font-medium">
            نام شعبه *
          </label>
          <input
            id="branchName"
            {...register("branchName")}
            placeholder="نام شعبه"
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.branchName && (
            <p className="text-red-500 text-xs">{errors.branchName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="accountNumber" className="block text-sm font-medium">
            شماره حساب *
          </label>
          <input
            id="accountNumber"
            {...register("accountNumber")}
            placeholder="شماره حساب"
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.accountNumber && (
            <p className="text-red-500 text-xs">
              {errors.accountNumber.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="iban" className="block text-sm font-medium">
            شماره شبا *
          </label>
          <input
            id="iban"
            {...register("iban")}
            placeholder="IR..."
            maxLength={24}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.iban && (
            <p className="text-red-500 text-xs">{errors.iban.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="cardNumber" className="block text-sm font-medium">
            شماره کارت
          </label>
          <input
            id="cardNumber"
            {...register("cardNumber")}
            placeholder="16 رقم"
            maxLength={16}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.cardNumber && (
            <p className="text-red-500 text-xs">{errors.cardNumber.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="currentBalance" className="block text-sm font-medium">
            موجودی اولیه (ریال) *
          </label>
          <input
            id="currentBalance"
            {...register("currentBalance")}
            placeholder="0"
            type="number"
            disabled={mode === "edit"}
            className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
          />
          {errors.currentBalance && (
            <p className="text-red-500 text-xs">
              {errors.currentBalance.message}
            </p>
          )}
          {mode === "edit" && (
            <p className="text-xs text-muted-foreground">
              موجودی فقط در زمان ایجاد قابل ویرایش است
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">وضعیت فعالیت</label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              {...register("isActive")}
              className="w-4 h-4"
            />
            <label htmlFor="isActive" className="text-sm cursor-pointer">
              {isActive ? "فعال" : "غیرفعال"}
            </label>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <button
          type="button"
          onClick={() => {
            if (!embedded) setOpen(false);
            reset();
            if (embedded && onSuccess) onSuccess();
          }}
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          انصراف
        </button>
        <button
          type="submit"
          disabled={createAccount.isPending || updateAccount.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {createAccount.isPending || updateAccount.isPending
            ? "در حال ثبت..."
            : mode === "edit"
            ? "ذخیره تغییرات"
            : "ثبت"}
        </button>
      </div>
    </form>
  );

  if (embedded) {
    return (
      <div dir="rtl">
        <div className="mb-4">
          <h2 className="text-xl font-bold">
            {mode === "edit" ? "ویرایش حساب بانکی" : "ثبت حساب بانکی جدید"}
          </h2>
        </div>
        {formContent}
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {mode === "edit" ? "ویرایش" : "افزودن حساب بانکی جدید"}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <div dir="rtl">
            <DialogClose onClose={() => setOpen(false)} />
            <DialogHeader>
              <DialogTitle>
                {mode === "edit" ? "ویرایش حساب بانکی" : "ثبت حساب بانکی جدید"}
              </DialogTitle>
            </DialogHeader>
            {formContent}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BusinessAccountForm;
