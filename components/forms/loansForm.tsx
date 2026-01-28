"use client";

import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loansSchema, loansSchemaType } from "@/validations/loans";
import { toast } from "sonner";
import { useCreateLoan } from "@/apis/mutations/loans";
import useGetAllPeople from "@/hooks/useGetAllPeople";
import PersonSelect from "../ui/person-select";
import PersianDatePicker from "../global/persianDatePicker";
import { LOAN_STATUSES } from "@/utils/systemConstants";
import type {  ILoan } from "@/types/new-backend-types";
import { useUpdateWallet } from "@/apis/mutations/people";

interface LoansFormProps {
  onSuccess?: () => void;
  embedded?: boolean;
}

const LoansForm: React.FC<LoansFormProps> = ({
  onSuccess,
  embedded = false,
}) => {
  const createLoan = useCreateLoan();
  const { data: allPeople } = useGetAllPeople();

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<loansSchemaType>({
    resolver: zodResolver(loansSchema) as any,
    defaultValues: {
      borrowerPersonId: "",
      totalAmount: "",
      loanDate: "",
      numberOfInstallments: "",
      installmentAmount: "",
      status: "در حال پرداخت",
      description: "",
    },
  });

  const totalAmount = watch("totalAmount");
  const numberOfInstallments = watch("numberOfInstallments");

  const updateWallet = useUpdateWallet();

  const addToWalletHandler = async (id: string, data: IUpdateWalletReq) => {
    try {
      const res = await updateWallet.mutateAsync({ id, data });
      console.log("🚀 ~ addToWalletHandler ~ res:", res);
    } catch (error) {
      console.log("🚀 ~ addToWalletHandler ~ error:", error);
    }
  };

  // Calculate installment amount
  React.useEffect(() => {
    if (totalAmount && numberOfInstallments) {
      const amount = parseFloat(totalAmount);
      const installments = parseFloat(numberOfInstallments);
      if (!isNaN(amount) && !isNaN(installments) && installments > 0) {
        const installmentAmount = (amount / installments).toFixed(0);
        setValue("installmentAmount", installmentAmount);
      }
    }
  }, [totalAmount, numberOfInstallments, setValue]);

  const onSubmit: SubmitHandler<loansSchemaType> = async (data) => {
    try {
      const borrower = allPeople?.find(
        (p) => p._id?.toString() === data.borrowerPersonId
      );

      if (!borrower) {
        toast.error("لطفاً کارمند را انتخاب کنید");
        return;
      }

      // Calculate installments
      const installments = [];
      // Parse Persian date to JavaScript Date
      // Assuming loanDate is in format YYYY/MM/DD
      const [year, month, day] = data.loanDate.split("/").map(Number);
      const loanDate = new Date(year, month - 1, day); // month is 0-indexed

      for (let i = 1; i <= parseInt(data.numberOfInstallments); i++) {
        const dueDate = new Date(loanDate);
        dueDate.setMonth(dueDate.getMonth() + i);

        // Convert back to YYYY/MM/DD format
        const dueDateStr = `${dueDate.getFullYear()}/${String(
          dueDate.getMonth() + 1
        ).padStart(2, "0")}/${String(dueDate.getDate()).padStart(2, "0")}`;

        installments.push({
          installmentNumber: i,
          dueDate: dueDateStr,
          amount: parseFloat(data.installmentAmount || "0"),
          status: "معوق",
          paymentDate: "",
          relatedSalaryPaymentId: 0,
        });
      }

      // Convert personId to number (backend expects number)
      // Try to parse as number, if fails use a hash of the string
      let personIdNumber = 0;
      if (borrower._id) {
        const idStr = borrower._id.toString();
        // Try to parse as number if it's numeric
        const parsed = parseInt(idStr);
        if (!isNaN(parsed)) {
          personIdNumber = parsed;
        } else {
          // Use hash of string as fallback
          personIdNumber = parseInt(idStr.slice(-8), 16) || 0;
        }
      }

      const loanData: Partial<ILoan> = {
        borrower: {
          personId: personIdNumber,
          fullName: `${borrower.firstName} ${borrower.lastName}`,
          nationalId: borrower.nationalId || 0,
        },
        totalAmount: parseFloat(data.totalAmount),
        loanDate: data.loanDate,
        numberOfInstallments: parseInt(data.numberOfInstallments),
        installmentAmount: parseFloat(data.installmentAmount || "0"),
        status: data.status || "در حال پرداخت",
        description: data.description || "",
        installments,
      };

      await createLoan.mutateAsync(loanData);
      onSuccess?.();

      const walletData = {
        amount: data.totalAmount,
        type: data.status,
        description: data.description,
      };
      addToWalletHandler(data.borrowerPersonId, walletData);
    } catch (error: any) {
      console.error("Error creating loan:", error);
      // Error is already handled by mutation hook
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-base text-gray-800 font-semibold border-b pb-2">
          اطلاعات وام
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">کارمند *</label>
            <Controller
              name="borrowerPersonId"
              control={control}
              render={({ field }) => (
                <PersonSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  people={
                    allPeople?.filter((p) => p.roles?.includes("employee")) ||
                    []
                  }
                  placeholder="انتخاب کارمند"
                  filterByRole={["employee"]}
                />
              )}
            />
            {errors.borrowerPersonId && (
              <p className="text-red-500 text-xs">
                {errors.borrowerPersonId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="totalAmount" className="block text-sm font-medium">
              مبلغ وام (ریال) *
            </label>
            {/* <input
              id="totalAmount"
              {...register("totalAmount")}
              type="number"
              placeholder="مبلغ وام"
              className="w-full px-3 py-2 border rounded-md"
            /> */}
            <Controller
              name="totalAmount"
              control={control}
              render={({ field }) => {
                const formattedValue = field.value
                  ? Number(field.value).toLocaleString("en-US")
                  : "";
                return (
                  <input
                    {...field}
                    type="text"
                    inputMode="numeric"
                    id="totalAmount"
                    placeholder="مبلغ وام"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formattedValue}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/,/g, "");
                      if (!isNaN(Number(rawValue))) {
                        field.onChange(rawValue);
                      }
                    }}
                  />
                );
              }}
            />
            {errors.totalAmount && (
              <p className="text-red-500 text-xs">
                {errors.totalAmount.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              تاریخ پرداخت وام *
            </label>
            <Controller
              name="loanDate"
              control={control}
              render={({ field }) => (
                <PersianDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="تاریخ پرداخت"
                />
              )}
            />
            {errors.loanDate && (
              <p className="text-red-500 text-xs">{errors.loanDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="numberOfInstallments"
              className="block text-sm font-medium"
            >
              تعداد اقساط *
            </label>
            <input
              id="numberOfInstallments"
              {...register("numberOfInstallments")}
              type="number"
              placeholder="تعداد اقساط"
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.numberOfInstallments && (
              <p className="text-red-500 text-xs">
                {errors.numberOfInstallments.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="installmentAmount"
              className="block text-sm font-medium"
            >
              مبلغ هر قسط (ریال)
            </label>
            {/* <input
              id="installmentAmount"
              {...register("installmentAmount")}
              type="number"
              readOnly
              className="w-full px-3 py-2 border rounded-md bg-gray-100"
            /> */}
            <Controller
              name="installmentAmount"
              control={control}
              render={({ field }) => {
                const formattedValue = field.value
                  ? Number(field.value).toLocaleString("en-US")
                  : "";
                return (
                  <input
                    {...field}
                    type="text"
                    inputMode="numeric"
                    id="installmentAmount"
                    placeholder="مبلغ وام"
                    className="w-full px-3 py-2 border rounded-md bg-gray-100"
                    value={formattedValue}
                    readOnly
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/,/g, "");
                      if (!isNaN(Number(rawValue))) {
                        field.onChange(rawValue);
                      }
                    }}
                  />
                );
              }}
            />
            {totalAmount && numberOfInstallments && (
              <p className="text-xs text-gray-500">
                محاسبه خودکار:{" "}
                {(
                  parseFloat(totalAmount) / parseFloat(numberOfInstallments)
                ).toLocaleString()}{" "}
                ریال
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium">
              وضعیت وام
            </label>
            <select
              id="status"
              {...register("status")}
              className="w-full px-3 py-2 border rounded-md"
            >
              {LOAN_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium">
              توضیحات
            </label>
            <input
              id="description"
              {...register("description")}
              placeholder="توضیحات"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <button
          type="submit"
          disabled={createLoan.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {createLoan.isPending ? "در حال ثبت..." : "ثبت وام"}
        </button>
      </div>
    </form>
  );

  if (embedded) {
    return (
      <div dir="rtl">
        {/* <div className="mb-4">
          <h2 className="text-xl font-bold">ثبت وام پرسنلی</h2>
        </div> */}
        {formContent}
      </div>
    );
  }

  return <div dir="rtl">{formContent}</div>;
};

export default LoansForm;
