"use client";

import React from "react";
import {
  useForm,
  Controller,
  SubmitHandler,
  useFieldArray,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  salarySlipSchema,
  salarySlipSchemaType,
} from "@/validations/salarySlip";
import { toast } from "sonner";
import { useCreateSalary } from "@/apis/mutations/salaries";
import { createTransaction } from "@/apis/client/transaction";
import { getLoansByBorrower } from "@/apis/client/loans";
import useGetAllPeople from "@/hooks/useGetAllPeople";
import { getAllBusinessAccounts } from "@/apis/client/businessAccounts";
import { useQuery } from "@tanstack/react-query";
import PersonSelect from "../ui/person-select";
import PersianDatePicker from "../global/persianDatePicker";
import { PERSIAN_YEARS, PERSIAN_MONTHS } from "@/utils/systemConstants";
import type { IPeople, ILoan, ISalaries } from "@/types/new-backend-types";

interface SalarySlipFormProps {
  onSuccess?: () => void;
  embedded?: boolean;
}

const SalarySlipForm: React.FC<SalarySlipFormProps> = ({
  onSuccess,
  embedded = false,
}) => {
  const createSalary = useCreateSalary();
  const { data: allPeople } = useGetAllPeople();
  const { data: allAccounts } = useQuery({
    queryKey: ["get-all-business-accounts"],
    queryFn: getAllBusinessAccounts,
  });
  const [selectedEmployee, setSelectedEmployee] =
    React.useState<IPeople | null>(null);
  const [employeeLoans, setEmployeeLoans] = React.useState<ILoan[]>([]);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<salarySlipSchemaType>({
    resolver: zodResolver(salarySlipSchema) as any,
    defaultValues: {
      employeePersonId: "",
      forYear: "",
      forMonth: "",
      paymentDate: "",
      baseSalary: "",
      overtimePay: "0",
      bonuses: [],
      insurance: "0",
      tax: "0",
      loanInstallments: [],
      otherDeductions: [],
      businessAccountId: "",
    },
  });

  const {
    fields: bonusFields,
    append: appendBonus,
    remove: removeBonus,
  } = useFieldArray({
    control,
    name: "bonuses",
  });

  const {
    fields: deductionFields,
    append: appendDeduction,
    remove: removeDeduction,
  } = useFieldArray({
    control,
    name: "otherDeductions",
  });

  const baseSalary = watch("baseSalary");
  const overtimePay = watch("overtimePay");
  const bonuses = watch("bonuses");
  const insurance = watch("insurance");
  const tax = watch("tax");
  const loanInstallments = watch("loanInstallments");
  const otherDeductions = watch("otherDeductions");
  const forYear = watch("forYear");
  const forMonth = watch("forMonth");

  // Load employee loans when employee is selected
  React.useEffect(() => {
    if (selectedEmployee?._id) {
      getLoansByBorrower(selectedEmployee._id.toString())
        .then((loans) => {
          const activeLoans = loans.filter(
            (loan) => loan.status === "در حال پرداخت"
          );
          setEmployeeLoans(activeLoans);
        })
        .catch((error) => {
          console.error("Error loading loans:", error);
        });
    }
  }, [selectedEmployee]);

  // Get current month installments from active loans
  const getCurrentMonthInstallments = () => {
    if (!forYear || !forMonth || !employeeLoans.length) return [];

    const installments: Array<{
      loanId: string;
      installmentNumber: string;
      amount: string;
    }> = [];

    employeeLoans.forEach((loan) => {
      const currentMonthInstallments = loan.installments?.filter((inst) => {
        if (inst.status === "پرداخت شده") return false;
        // Parse dueDate (format: YYYY/MM/DD)
        const [dueYear, dueMonth] = inst.dueDate.split("/").map(Number);
        return dueYear === parseInt(forYear) && dueMonth === parseInt(forMonth);
      });

      currentMonthInstallments?.forEach((inst) => {
        installments.push({
          loanId: loan._id?.toString() || "",
          installmentNumber: inst.installmentNumber.toString(),
          amount: inst.amount.toString(),
        });
      });
    });

    return installments;
  };

  const currentInstallments = React.useMemo(
    () => getCurrentMonthInstallments(),
    [employeeLoans, forYear, forMonth]
  );

  // Calculate totals
  const grossPay = React.useMemo(() => {
    const base = parseFloat(baseSalary || "0");
    const overtime = parseFloat(overtimePay || "0");
    const bonusTotal =
      bonuses?.reduce((sum, b) => sum + parseFloat(b.amount || "0"), 0) || 0;
    return base + overtime + bonusTotal;
  }, [baseSalary, overtimePay, bonuses]);

  const totalDeductions = React.useMemo(() => {
    const ins = parseFloat(insurance || "0");
    const taxAmount = parseFloat(tax || "0");
    const loanTotal =
      loanInstallments?.reduce(
        (sum, l) => sum + parseFloat(l.amount || "0"),
        0
      ) || 0;
    const otherTotal =
      otherDeductions?.reduce(
        (sum, d) => sum + parseFloat(d.amount || "0"),
        0
      ) || 0;
    return ins + taxAmount + loanTotal + otherTotal;
  }, [insurance, tax, loanInstallments, otherDeductions]);

  const netPay = grossPay - totalDeductions;

  // Load employee base salary when selected
  React.useEffect(() => {
    if (selectedEmployee?.employmentDetails?.baseSalary) {
      setValue(
        "baseSalary",
        selectedEmployee.employmentDetails.baseSalary.toString()
      );
    }
  }, [selectedEmployee, setValue]);

  const onSubmit: SubmitHandler<salarySlipSchemaType> = async (data) => {
    try {
      if (!selectedEmployee) {
        toast.error("لطفاً کارمند را انتخاب کنید");
        return;
      }

      // Convert personId to number (backend expects number)
      let personIdNumber = 0;
      if (selectedEmployee._id) {
        const idStr = selectedEmployee._id.toString();
        const parsed = parseInt(idStr);
        if (!isNaN(parsed)) {
          personIdNumber = parsed;
        } else {
          personIdNumber = parseInt(idStr.slice(-8), 16) || 0;
        }
      }

      // First, create transaction
      const transactionData = {
        type: "payment",
        reason: "پرداخت حقوق",
        transactionDate: data.paymentDate,
        amount: netPay,
        personId: selectedEmployee._id?.toString() || "",
        bussinessAccountId: data.businessAccountId,
        paymentMethod: "bank_transfer",
        description: `پرداخت حقوق ${data.forYear}/${data.forMonth} - ${selectedEmployee.fullName}`,
      };

      const transaction = await createTransaction(transactionData);

      // Convert transaction._id to number for relatedTransactionId
      let transactionIdNumber = 0;
      if (transaction._id) {
        const idStr = transaction._id.toString();
        const parsed = parseInt(idStr);
        if (!isNaN(parsed)) {
          transactionIdNumber = parsed;
        } else {
          transactionIdNumber = parseInt(idStr.slice(-8), 16) || 0;
        }
      }

      // Then, create salary record
      const salaryData: Partial<ISalaries> = {
        employee: {
          personId: personIdNumber,
          fullName: selectedEmployee.fullName,
          nationalId: selectedEmployee.nationalId || 0,
        },
        forYear: parseInt(data.forYear),
        forMonth: parseInt(data.forMonth),
        paymentDate: data.paymentDate,
        baseSalary: parseFloat(data.baseSalary),
        overtimePay: parseFloat(data.overtimePay || "0"),
        bonuses:
          data.bonuses?.map((b) => ({
            amount: parseFloat(b.amount),
            description: b.description,
          })) || [],
        grossPay,
        totalDeductions,
        netPay,
        relatedTransactionId: transactionIdNumber,
        deductions: {
          insurance: parseFloat(data.insurance || "0"),
          tax: parseFloat(data.tax || "0"),
          loanInstallments:
            data.loanInstallments?.map((l) => ({
              loanId: parseInt(l.loanId),
              installmentNumber: parseInt(l.installmentNumber),
              amount: parseFloat(l.amount),
            })) || [],
          otherDeductions:
            data.otherDeductions?.map((d) => ({
              amount: parseFloat(d.amount),
              description: d.description,
            })) || [],
        },
      };

      await createSalary.mutateAsync(salaryData);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating salary slip:", error);
      // Error is already handled by mutation hook
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">
          اطلاعات کارمند و دوره
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">کارمند *</label>
            <Controller
              name="employeePersonId"
              control={control}
              render={({ field }) => (
                <PersonSelect
                  value={field.value}
                  onValueChange={(personId, person) => {
                    field.onChange(personId);
                    setSelectedEmployee(person || null);
                  }}
                  people={
                    allPeople?.filter((p) => p.roles?.includes("employee")) ||
                    []
                  }
                  placeholder="انتخاب کارمند"
                  filterByRole={["employee"]}
                />
              )}
            />
            {errors.employeePersonId && (
              <p className="text-red-500 text-xs">
                {errors.employeePersonId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="forYear" className="block text-sm font-medium">
              سال عملکرد *
            </label>
            <select
              id="forYear"
              {...register("forYear")}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">انتخاب سال</option>
              {PERSIAN_YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.forYear && (
              <p className="text-red-500 text-xs">{errors.forYear.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="forMonth" className="block text-sm font-medium">
              ماه عملکرد *
            </label>
            <select
              id="forMonth"
              {...register("forMonth")}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">انتخاب ماه</option>
              {PERSIAN_MONTHS.map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
            {errors.forMonth && (
              <p className="text-red-500 text-xs">{errors.forMonth.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">تاریخ پرداخت *</label>
            <Controller
              name="paymentDate"
              control={control}
              render={({ field }) => (
                <PersianDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="تاریخ پرداخت"
                />
              )}
            />
            {errors.paymentDate && (
              <p className="text-red-500 text-xs">
                {errors.paymentDate.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">درآمدها</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="baseSalary" className="block text-sm font-medium">
              حقوق پایه (ریال) *
            </label>
            <input
              id="baseSalary"
              {...register("baseSalary")}
              type="number"
              placeholder="حقوق پایه"
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.baseSalary && (
              <p className="text-red-500 text-xs">
                {errors.baseSalary.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="overtimePay" className="block text-sm font-medium">
              اضافه کاری (ریال)
            </label>
            <input
              id="overtimePay"
              {...register("overtimePay")}
              type="number"
              placeholder="0"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium">پاداش‌ها</label>
            <button
              type="button"
              onClick={() => appendBonus({ amount: "", description: "" })}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              افزودن پاداش
            </button>
          </div>
          {bonusFields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-2 gap-2 p-2 border rounded"
            >
              <input
                {...register(`bonuses.${index}.amount`)}
                type="number"
                placeholder="مبلغ"
                className="px-2 py-1 border rounded"
              />
              <div className="flex gap-2">
                <input
                  {...register(`bonuses.${index}.description`)}
                  placeholder="علت"
                  className="flex-1 px-2 py-1 border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeBonus(index)}
                  className="px-2 py-1 text-sm bg-red-600 text-white rounded"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-2 bg-gray-50 rounded">
          <p className="text-sm font-semibold">
            جمع ناخالص: {grossPay.toLocaleString()} ریال
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">کسورات</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="insurance" className="block text-sm font-medium">
              بیمه (ریال)
            </label>
            <input
              id="insurance"
              {...register("insurance")}
              type="number"
              placeholder="0"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tax" className="block text-sm font-medium">
              مالیات (ریال)
            </label>
            <input
              id="tax"
              {...register("tax")}
              type="number"
              placeholder="0"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">اقساط وام</label>
          {currentInstallments.length > 0 ? (
            <div className="space-y-2">
              {currentInstallments.map((inst, index) => {
                const loan = employeeLoans.find(
                  (l) => l._id?.toString() === inst.loanId
                );
                return (
                  <label
                    key={index}
                    className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={loanInstallments?.some(
                        (li) =>
                          li.loanId === inst.loanId &&
                          li.installmentNumber === inst.installmentNumber
                      )}
                      onChange={(e) => {
                        const current = loanInstallments || [];
                        if (e.target.checked) {
                          setValue("loanInstallments", [...current, inst]);
                        } else {
                          setValue(
                            "loanInstallments",
                            current.filter(
                              (li) =>
                                !(
                                  li.loanId === inst.loanId &&
                                  li.installmentNumber ===
                                    inst.installmentNumber
                                )
                            )
                          );
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">
                      قسط {inst.installmentNumber} وام{" "}
                      {loan?.totalAmount?.toLocaleString()} ریال - مبلغ:{" "}
                      {parseFloat(inst.amount).toLocaleString()} ریال
                    </span>
                  </label>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-500">
              {selectedEmployee && forYear && forMonth
                ? "اقساط وام فعال برای این ماه یافت نشد"
                : "لطفاً کارمند، سال و ماه را انتخاب کنید"}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium">سایر کسورات</label>
            <button
              type="button"
              onClick={() => appendDeduction({ amount: "", description: "" })}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              افزودن
            </button>
          </div>
          {deductionFields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-2 gap-2 p-2 border rounded"
            >
              <input
                {...register(`otherDeductions.${index}.amount`)}
                type="number"
                placeholder="مبلغ"
                className="px-2 py-1 border rounded"
              />
              <div className="flex gap-2">
                <input
                  {...register(`otherDeductions.${index}.description`)}
                  placeholder="توضیحات"
                  className="flex-1 px-2 py-1 border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeDeduction(index)}
                  className="px-2 py-1 text-sm bg-red-600 text-white rounded"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-2 bg-gray-50 rounded">
          <p className="text-sm font-semibold">
            جمع کسورات: {totalDeductions.toLocaleString()} ریال
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-md">
          <p className="text-lg font-bold">
            پرداختی نهایی: {netPay.toLocaleString()} ریال
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="businessAccountId"
            className="block text-sm font-medium"
          >
            پرداخت از حساب *
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
                <option key={acc._id?.toString()} value={acc._id?.toString()}>
                  {acc.accountName} - {acc.bankName}
                </option>
              ))}
          </select>
          {errors.businessAccountId && (
            <p className="text-red-500 text-xs">
              {errors.businessAccountId.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <button
          type="submit"
          disabled={createSalary.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {createSalary.isPending ? "در حال ثبت..." : "ثبت فیش حقوقی"}
        </button>
      </div>
    </form>
  );

  if (embedded) {
    return (
      <div dir="rtl">
        <div className="mb-4">
          <h2 className="text-xl font-bold">محاسبه و صدور فیش حقوقی</h2>
        </div>
        {formContent}
      </div>
    );
  }

  return <div dir="rtl">{formContent}</div>;
};

export default SalarySlipForm;
