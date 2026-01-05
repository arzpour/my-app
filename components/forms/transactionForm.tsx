"use client";

import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  transactionChequeSchema,
  transactionChequeSchemaType,
} from "@/validations/transactionCheque";
import { toast } from "sonner";
import { createTransaction } from "@/apis/client/transaction";
import { createCheque } from "@/apis/client/chequesNew";
import useGetAllPeople from "@/hooks/useGetAllPeople";
import { getAllBusinessAccounts } from "@/apis/client/businessAccounts";
import { getAllDeals } from "@/apis/client/deals";
import { useQuery } from "@tanstack/react-query";
import PersonSelect from "../ui/person-select";
import PersianDatePicker from "../global/persianDatePicker";
import {
  TRANSACTION_TYPES,
  TRANSACTION_REASONS,
  PAYMENT_METHODS,
  BANK_NAMES,
  CHEQUE_STATUSES,
} from "@/utils/systemConstants";
import type { IPeople, IDeal } from "@/types/new-backend-types";

interface TransactionFormProps {
  onSuccess?: () => void;
  embedded?: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  onSuccess,
  embedded = false,
}) => {
  const { data: allPeople } = useGetAllPeople();
  const { data: allAccounts } = useQuery({
    queryKey: ["get-all-business-accounts"],
    queryFn: getAllBusinessAccounts,
  });
  const { data: allDeals } = useQuery({
    queryKey: ["get-all-deals"],
    queryFn: getAllDeals,
  });
  const [selectedPerson, setSelectedPerson] = React.useState<IPeople | null>(
    null
  );
  const [selectedDeal, setSelectedDeal] = React.useState<IDeal | null>(null);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<transactionChequeSchemaType>({
    resolver: zodResolver(transactionChequeSchema),
    defaultValues: {
      type: "پرداخت",
      reason: "",
      transactionDate: "",
      amount: "",
      personId: "",
      bussinessAccountId: "",
      paymentMethod: "نقد",
      dealId: "",
      description: "",
      chequeNumber: "",
      chequeBankName: "",
      chequeBranchName: "",
      chequeIssueDate: "",
      chequeDueDate: "",
      chequeType: "دریافتی",
      chequeStatus: "در جریان",
      chequePayerPersonId: "",
      chequePayeePersonId: "",
      chequeRelatedDealId: "",
    },
  });

  const paymentMethod = watch("paymentMethod");
  const chequeType = watch("chequeType");
  const showChequeFields = paymentMethod === "چک";
  const showPayer = showChequeFields && chequeType === "دریافتی";
  const showPayee = showChequeFields && chequeType === "پرداختی";

  const onSubmit: SubmitHandler<transactionChequeSchemaType> = async (data) => {
    try {
      // First, create transaction
      const transactionData = {
        type: data.type,
        reason: data.reason,
        transactionDate: data.transactionDate,
        amount: parseFloat(data.amount),
        personId: data.personId,
        bussinessAccountId: data.bussinessAccountId,
        paymentMethod: data.paymentMethod,
        dealId: data.dealId || undefined,
        description: data.description || "",
      };

      const transaction = await createTransaction(transactionData);

      // If payment method is cheque, create cheque record
      if (data.paymentMethod === "چک" && showChequeFields) {
        const payer =
          showPayer && data.chequePayerPersonId
            ? allPeople?.find(
                (p) => p._id?.toString() === data.chequePayerPersonId
              )
            : null;

        const payee =
          showPayee && data.chequePayeePersonId
            ? allPeople?.find(
                (p) => p._id?.toString() === data.chequePayeePersonId
              )
            : null;

        const chequeData = {
          chequeNumber: parseInt(data.chequeNumber || "0"),
          bankName: data.chequeBankName || "",
          branchName: data.chequeBranchName || "",
          vin: selectedDeal?.vehicleSnapshot?.vin || "",
          issueDate: data.chequeIssueDate || "",
          dueDate: data.chequeDueDate || "",
          amount: parseFloat(data.amount),
          type: data.chequeType === "دریافتی" ? "received" : "issued",
          status: data.chequeStatus || "در جریان",
          sayadiID: "",
          payer: payer
            ? {
                personId: payer._id?.toString() || "",
                fullName: payer.fullName,
                nationalId: payer.nationalId?.toString() || "",
              }
            : {
                personId: "",
                fullName: "",
                nationalId: "",
              },
          payee: payee
            ? {
                personId: payee._id?.toString() || "",
                fullName: payee.fullName,
                nationalId: payee.nationalId?.toString() || "",
              }
            : {
                personId: "",
                fullName: "",
                nationalId: "",
              },
          relatedDealId: data.chequeRelatedDealId
            ? parseInt(data.chequeRelatedDealId)
            : 0,
          relatedTransactionId: transaction._id
            ? parseInt(transaction._id.toString().slice(-8), 16)
            : 0,
          actions: [
            {
              actionType: "ثبت",
              actionDate: new Date().toISOString(),
              actorUserId: "",
              description: "ثبت اولیه چک",
            },
          ],
        };

        await createCheque(chequeData);
      }

      toast.success("تراکنش با موفقیت ثبت شد");
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating transaction:", error);
      toast.error(error?.response?.data?.message || "خطا در ثبت تراکنش");
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-base text-gray-800 font-semibold border-b pb-2">
          اطلاعات تراکنش
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="type" className="block text-sm font-medium">
              نوع تراکنش *
            </label>
            <select
              id="type"
              {...register("type")}
              className="w-full px-3 py-2 border rounded-md"
            >
              {TRANSACTION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-red-500 text-xs">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="reason" className="block text-sm font-medium">
              بابت (Reason) *
            </label>
            <select
              id="reason"
              {...register("reason")}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">انتخاب کنید</option>
              {TRANSACTION_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
            {errors.reason && (
              <p className="text-red-500 text-xs">{errors.reason.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">تاریخ تراکنش *</label>
            <Controller
              name="transactionDate"
              control={control}
              render={({ field }) => (
                <PersianDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="تاریخ تراکنش"
                />
              )}
            />
            {errors.transactionDate && (
              <p className="text-red-500 text-xs">
                {errors.transactionDate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium">
              مبلغ (ریال) *
            </label>
            <input
              id="amount"
              {...register("amount")}
              type="number"
              placeholder="مبلغ تراکنش"
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.amount && (
              <p className="text-red-500 text-xs">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="paymentMethod"
              className="block text-sm font-medium"
            >
              روش پرداخت *
            </label>
            <select
              id="paymentMethod"
              {...register("paymentMethod")}
              className="w-full px-3 py-2 border rounded-md"
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
            {errors.paymentMethod && (
              <p className="text-red-500 text-xs">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">طرف حساب *</label>
            <Controller
              name="personId"
              control={control}
              render={({ field }) => (
                <PersonSelect
                  value={field.value}
                  onValueChange={(personId, person) => {
                    field.onChange(personId);
                    setSelectedPerson(person || null);
                  }}
                  people={allPeople || []}
                  placeholder="انتخاب طرف حساب"
                />
              )}
            />
            {errors.personId && (
              <p className="text-red-500 text-xs">{errors.personId.message}</p>
            )}
          </div>

          {getValues().paymentMethod === "مشتری به مشتری" ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                طرف حساب دوم *
              </label>
              <Controller
                name="secondPartyId"
                control={control}
                render={({ field }) => (
                  <PersonSelect
                    value={field.value}
                    onValueChange={(personId, person) => {
                      field.onChange(personId);
                      setSelectedPerson(person || null);
                    }}
                    people={allPeople || []}
                    placeholder=" انتخاب طرف حساب دوم"
                  />
                )}
              />
              {errors.personId && (
                <p className="text-red-500 text-xs">
                  {errors.personId.message}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <label
                htmlFor="bussinessAccountId"
                className="block text-sm font-medium"
              >
                حساب بانکی *
              </label>
              <select
                id="bussinessAccountId"
                {...register("bussinessAccountId")}
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
              {errors.bussinessAccountId && (
                <p className="text-red-500 text-xs">
                  {errors.bussinessAccountId.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              مرتبط با معامله (اختیاری)
            </label>
            <select
              {...register("dealId")}
              onChange={(e) => {
                const deal = allDeals?.find(
                  (d) => d._id?.toString() === e.target.value
                );
                setSelectedDeal(deal || null);
                setValue("dealId", e.target.value);
                if (showChequeFields) {
                  setValue("chequeRelatedDealId", e.target.value);
                }
              }}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">انتخاب معامله (اختیاری)</option>
              {allDeals?.map((deal) => (
                <option key={deal._id?.toString()} value={deal._id?.toString()}>
                  {deal.vehicleSnapshot.plateNumber || "بدون پلاک"} -{" "}
                  {deal.vehicleSnapshot.model} ({deal.vehicleSnapshot.vin})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium">
              شرح
            </label>
            <textarea
              id="description"
              {...register("description")}
              placeholder="توضیحات تراکنش"
              rows={3}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Cheque Fields */}
      {showChequeFields && (
        <div className="space-y-4">
          <h3 className="text-base text-gray-800 font-semibold border-b pb-2">
            اطلاعات چک
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">نوع چک *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="دریافتی"
                    {...register("chequeType")}
                    className="w-4 h-4"
                  />
                  <span>دریافتی</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="پرداختی"
                    {...register("chequeType")}
                    className="w-4 h-4"
                  />
                  <span>پرداختی</span>
                </label>
              </div>
              {errors.chequeType && (
                <p className="text-red-500 text-xs">
                  {errors.chequeType.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="chequeNumber"
                className="block text-sm font-medium"
              >
                شماره چک *
              </label>
              <input
                id="chequeNumber"
                {...register("chequeNumber")}
                type="number"
                placeholder="شماره چک"
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.chequeNumber && (
                <p className="text-red-500 text-xs">
                  {errors.chequeNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="chequeBankName"
                className="block text-sm font-medium"
              >
                نام بانک *
              </label>
              <select
                id="chequeBankName"
                {...register("chequeBankName")}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">انتخاب بانک</option>
                {BANK_NAMES.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
              {errors.chequeBankName && (
                <p className="text-red-500 text-xs">
                  {errors.chequeBankName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="chequeBranchName"
                className="block text-sm font-medium"
              >
                نام شعبه
              </label>
              <input
                id="chequeBranchName"
                {...register("chequeBranchName")}
                placeholder="نام شعبه"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">تاریخ صدور *</label>
              <Controller
                name="chequeIssueDate"
                control={control}
                render={({ field }) => (
                  <PersianDatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="تاریخ صدور"
                  />
                )}
              />
              {errors.chequeIssueDate && (
                <p className="text-red-500 text-xs">
                  {errors.chequeIssueDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                تاریخ سررسید *
              </label>
              <Controller
                name="chequeDueDate"
                control={control}
                render={({ field }) => (
                  <PersianDatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="تاریخ سررسید"
                  />
                )}
              />
              {errors.chequeDueDate && (
                <p className="text-red-500 text-xs">
                  {errors.chequeDueDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="chequeStatus"
                className="block text-sm font-medium"
              >
                وضعیت فعلی
              </label>
              <select
                id="chequeStatus"
                {...register("chequeStatus")}
                className="w-full px-3 py-2 border rounded-md"
              >
                {CHEQUE_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {showPayer && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  صادرکننده (Payer) *
                </label>
                <Controller
                  name="chequePayerPersonId"
                  control={control}
                  render={({ field }) => (
                    <PersonSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      people={allPeople || []}
                      placeholder="انتخاب صادرکننده"
                    />
                  )}
                />
                {errors.chequePayerPersonId && (
                  <p className="text-red-500 text-xs">
                    {errors.chequePayerPersonId.message}
                  </p>
                )}
              </div>
            )}

            {showPayee && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  گیرنده (Payee) *
                </label>
                <Controller
                  name="chequePayeePersonId"
                  control={control}
                  render={({ field }) => (
                    <PersonSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      people={allPeople || []}
                      placeholder="انتخاب گیرنده"
                    />
                  )}
                />
                {errors.chequePayeePersonId && (
                  <p className="text-red-500 text-xs">
                    {errors.chequePayeePersonId.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          ثبت تراکنش
        </button>
      </div>
    </form>
  );

  if (embedded) {
    return (
      <div dir="rtl">
        <div className="mb-4">
          <h2 className="text-xl font-bold">ثبت تراکنش</h2>
        </div>
        {formContent}
      </div>
    );
  }

  return <div dir="rtl">{formContent}</div>;
};

export default TransactionForm;
