"use client";

import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  transactionChequeSchema,
  transactionChequeSchemaType,
} from "@/validations/transactionCheque";
import { toast } from "sonner";
import {
  createTransaction,
  getTransactionById,
} from "@/apis/client/transaction";
import { useUpdateTransaction } from "@/apis/mutations/transaction";
import { createCheque } from "@/apis/client/chequesNew";
import useGetAllPeople from "@/hooks/useGetAllPeople";
import { getAllBusinessAccounts } from "@/apis/client/businessAccounts";
import { getAllDeals } from "@/apis/client/deals";
import { useQuery } from "@tanstack/react-query";
import PersonSelect from "../ui/person-select";
import PersianDatePicker from "../global/persianDatePicker";
import {
  TRANSACTION_TYPES,
  TRANSACTION_REASONS_FOR_RECEIPT,
  PAYMENT_METHODS,
  BANK_NAMES,
  CHEQUE_STATUSES,
  TRANSACTION_REASONS_FOR_PAYMENT,
} from "@/utils/systemConstants";
import type { IPeople, IDeal } from "@/types/new-backend-types";
import useUpdateWalletHandler from "@/hooks/useUpdateWalletHandler";
import useGetChequesByDealId from "@/hooks/useGetChequesByDealId";

interface TransactionFormProps {
  onSuccess?: () => void;
  embedded?: boolean;
  mode?: "add" | "edit";
  transactionId?: string;
  dealId?: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  onSuccess,
  embedded = false,
  mode = "add",
  transactionId,
  dealId,
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
  const { data: transactionDataById } = useQuery({
    queryKey: ["get-transaction-by-id", transactionId],
    queryFn: () => getTransactionById(transactionId ?? ""),
    enabled: mode === "edit" && !!transactionId,
  });
  const { data: getChequeByDealId } = useGetChequesByDealId(dealId ?? "");
  const [selectedPerson, setSelectedPerson] = React.useState<IPeople | null>(
    null,
  );
  const [selectedDeal, setSelectedDeal] = React.useState<IDeal | null>(null);

  const selectedTransactionChequeInfo = getChequeByDealId?.filter(
    (el) => el.relatedTransactionId === transactionId,
  )[0];

  const defaultValuesOfForm =
    mode === "add"
      ? {
          type: "پرداخت" as const,
          reason: "",
          transactionDate: "",
          amount: "",
          personId: "",
          bussinessAccountId: "",
          paymentMethod: "نقد" as const,
          dealId: "",
          description: "",
          chequeDescription: "",
          chequeNumber: "",
          chequeBankName: "",
          chequeBranchName: "",
          chequeIssueDate: "",
          chequeDueDate: "",
          chequeType: "دریافتی" as const,
          chequeStatus: "در جریان",
          chequePayerPersonId: "",
          chequePayeePersonId: "",
          chequeRelatedDealId: "",
        }
      : {
          type:
            (transactionDataById?.type as "پرداخت" | "دریافت") ??
            ("پرداخت" as const),
          reason: transactionDataById?.reason ?? "",
          transactionDate: transactionDataById?.transactionDate ?? "",
          amount: transactionDataById?.amount?.toString() ?? "",
          personId: transactionDataById?.personId ?? "",
          bussinessAccountId: transactionDataById?.bussinessAccountId ?? "",
          paymentMethod:
            (transactionDataById?.paymentMethod as
              | "نقد"
              | "کارت به کارت"
              | "چک"
              | "شبا"
              | "مشتری به مشتری") ?? ("نقد" as const),
          dealId: transactionDataById?.dealId ?? "",
          description: transactionDataById?.description ?? "",
          chequeDescription: "",
          chequeNumber: "",
          chequeBankName: "",
          chequeBranchName: "",
          chequeIssueDate: "",
          chequeDueDate: "",
          chequeType: undefined as "دریافتی" | "پرداختی" | undefined,
          chequeStatus: "",
          chequePayerPersonId: "",
          chequePayeePersonId: "",
          chequeRelatedDealId: "",
        };
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm<transactionChequeSchemaType>({
    resolver: zodResolver(transactionChequeSchema),
    defaultValues: defaultValuesOfForm,
  });

  const paymentMethod = watch("paymentMethod");
  const transactionType = watch("type");
  const transactionReason = watch("reason");
  const chequeType = watch("chequeType");
  const transactionDealId = watch("dealId");

  const selectedDealIdInfo = allDeals?.filter(
    (d) => d._id === transactionDealId,
  );

  const getSellerInfoById = selectedDealIdInfo?.[0]?.seller?.personId;
  const getBuyerInfoById = selectedDealIdInfo?.[0]?.buyer?.personId;

  const peopleForDeal = allPeople?.filter(
    (p) => p._id === getSellerInfoById || p._id === getBuyerInfoById,
  );

  const showChequeFields = paymentMethod === "چک";
  const showPayer = showChequeFields && chequeType === "دریافتی";
  const showPayee = showChequeFields && chequeType === "پرداختی";
  const employees = (peopleForDeal ?? allPeople)?.filter((p) =>
    p.roles.includes("employee"),
  );
  const providers = allPeople?.filter((p) => p.roles.includes("provider"));

  const { updateWalletHandler } = useUpdateWalletHandler();
  const updateTransaction = useUpdateTransaction();

  // Reset form when transaction data is loaded in edit mode
  React.useEffect(() => {
    if (mode === "edit" && transactionDataById) {
      reset({
        type: (transactionDataById?.type as "پرداخت" | "دریافت") ?? "پرداخت",
        reason: transactionDataById?.reason ?? "",
        transactionDate: transactionDataById?.transactionDate ?? "",
        amount: transactionDataById?.amount?.toString() ?? "",
        personId: transactionDataById?.personId ?? "",
        bussinessAccountId: transactionDataById?.bussinessAccountId ?? "",
        paymentMethod:
          (transactionDataById?.paymentMethod as
            | "نقد"
            | "کارت به کارت"
            | "چک"
            | "شبا"
            | "مشتری به مشتری") ?? "نقد",
        dealId: transactionDataById?.dealId ?? "",
        description: transactionDataById?.description ?? "",
        chequeDescription: selectedTransactionChequeInfo?.description ?? "",
        chequeNumber: selectedTransactionChequeInfo?.chequeNumber ?? "",
        chequeBankName: selectedTransactionChequeInfo?.bankName ?? "",
        chequeBranchName: selectedTransactionChequeInfo?.branchName ?? "",
        chequeIssueDate: selectedTransactionChequeInfo?.issueDate ?? "",
        chequeDueDate: selectedTransactionChequeInfo?.dueDate ?? "",
        chequeType:
          selectedTransactionChequeInfo?.type === "received"
            ? "دریافتی"
            : "پرداختی",
        chequeStatus: selectedTransactionChequeInfo?.status ?? "",
        chequePayerPersonId:
          selectedTransactionChequeInfo?.payer.personId ?? "",
        chequePayeePersonId:
          selectedTransactionChequeInfo?.payee.personId ?? "",
        chequeRelatedDealId: selectedTransactionChequeInfo?.relatedDealId ?? "",
        chequeCustomerPersonId:
          selectedTransactionChequeInfo?.customer.personId ?? "",
        chequeSerial: selectedTransactionChequeInfo?.chequeSerial ?? "",
        sayadiID: selectedTransactionChequeInfo?.sayadiID ?? "",
      });
    }
  }, [transactionDataById, mode, reset, selectedTransactionChequeInfo]);

  const onSubmit: SubmitHandler<transactionChequeSchemaType> = async (data) => {
    try {
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

      let transaction;
      if (mode === "edit" && transactionId) {
        // Update existing transaction
        transaction = await updateTransaction.mutateAsync({
          id: transactionId,
          data: transactionData,
        });
      } else {
        // Create new transaction
        transaction = await createTransaction(transactionData);
      }

      // If payment method is cheque, create cheque record
      if (data.paymentMethod === "چک" && showChequeFields) {
        const payer =
          showPayer && data.chequePayerPersonId
            ? allPeople?.find(
                (p) => p._id?.toString() === data.chequePayerPersonId,
              )
            : null;

        const payee =
          showPayee && data.chequePayeePersonId
            ? allPeople?.find(
                (p) => p._id?.toString() === data.chequePayeePersonId,
              )
            : null;

        const customer =
          showPayer && data.chequeCustomerPersonId
            ? allPeople?.find(
                (p) => p._id?.toString() === data.chequeCustomerPersonId,
              )
            : null;

        const chequeData = {
          chequeNumber: data.chequeNumber?.trim() || "",
          chequeSerial: data.chequeNumber?.trim() || "",
          bankName: data.chequeBankName || "",
          branchName: data.chequeBranchName || "",
          vin: selectedDeal?.vehicleSnapshot?.vin || "",
          issueDate: data.chequeIssueDate || "",
          dueDate: data.chequeDueDate || "",
          amount: parseFloat(data.amount),
          type: data.chequeType === "دریافتی" ? "received" : "issued",
          status: data.chequeStatus || "در جریان",
          sayadiID: data.sayadiID ?? "",
          description: data.chequeDescription,
          customer: customer
            ? {
                personId: customer._id?.toString() || "",
                fullName: `${customer} ${customer.lastName}`,
                nationalId: customer.nationalId?.toString() || "",
              }
            : {
                personId: "",
                fullName: "",
                nationalId: "",
              },
          payer: payer
            ? {
                personId: payer._id?.toString() || "",
                fullName: `${payer.firstName} ${payer.lastName}`,
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
                fullName: `${payee.firstName} ${payee.lastName}`,
                nationalId: payee.nationalId?.toString() || "",
              }
            : {
                personId: "",
                fullName: "",
                nationalId: "",
              },
          relatedDealId: transaction.dealId || data.chequeRelatedDealId || "",
          relatedTransactionId: transaction._id || "",
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

      if (mode === "edit") {
        toast.success("تراکنش با موفقیت به‌روزرسانی شد");
      } else {
        toast.success("تراکنش با موفقیت ثبت شد");
        reset({
          amount: "",
          transactionDate: "",
        });

        const price = Number(data.amount);
        const walletData = {
          amount: data.type === "دریافت" ? price : -price,
          type: data.type,
          description: data.description,
        };
        updateWalletHandler(data.personId, walletData);
      }

      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating transaction:", error);
      toast.error(error?.response?.data?.message || "خطا در ثبت تراکنش");
    }
  };

  const TRANSACTION_REASONS =
    transactionType === "دریافت"
      ? TRANSACTION_REASONS_FOR_RECEIPT
      : TRANSACTION_REASONS_FOR_PAYMENT;

  const partnerFieldIsExist =
    (transactionType === "دریافت" && transactionReason === "سرمایه گذاری") ||
    (transactionType === "پرداخت" &&
      (transactionReason === "اصل سرمایه" ||
        transactionReason === "سود سرمایه"));

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
            {/* <input
              id="amount"
              {...register("amount")}
              type="number"
              placeholder="مبلغ تراکنش"
              className="w-full px-3 py-2 border rounded-md"
            /> */}

            <Controller
              name="amount"
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
                    id="amount"
                    placeholder="مبلغ تراکنش"
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
            <label className="block text-sm font-medium">
              مرتبط با معامله
              <span>
                {(transactionType === "پرداخت" &&
                  [
                    "خرید خودرو",
                    "درصد کارگزار",
                    "آپشن",
                    "جابجایی(وسیله نقلیه)",
                  ].includes(transactionReason)) ||
                (transactionType === "دریافت" &&
                  ["فروش خودرو"].includes(transactionReason))
                  ? " (اجباری) "
                  : " (اختیاری) "}
              </span>
            </label>
            <select
              {...register("dealId")}
              onChange={(e) => {
                const deal = allDeals?.find(
                  (d) => d._id?.toString() === e.target.value,
                );
                setSelectedDeal(deal || null);
                setValue("dealId", e.target.value);
                if (showChequeFields) {
                  setValue("chequeRelatedDealId", e.target.value);
                }
              }}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">
                انتخاب معامله
                <span>
                  {(transactionType === "پرداخت" &&
                    [
                      "خرید خودرو",
                      "درصد کارگزار",
                      "آپشن",
                      "جابجایی(وسیله نقلیه)",
                    ].includes(transactionReason)) ||
                  (transactionType === "دریافت" &&
                    ["فروش خودرو"].includes(transactionReason))
                    ? " (اجباری) "
                    : " (اختیاری) "}
                </span>
              </option>

              {allDeals?.map((deal) => (
                <option key={deal._id?.toString()} value={deal._id?.toString()}>
                  {deal.vehicleSnapshot.plateNumber || "بدون پلاک"} -{" "}
                  {deal.vehicleSnapshot.model} ({deal.vehicleSnapshot.vin})
                </option>
              ))}
            </select>
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
                    placeholder="انتخاب طرف حساب دوم"
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

          {partnerFieldIsExist ? (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium">نام شریک</label>
                {/* <PersonSelect
                value={partnership.partnerPersonId}
                onValueChange={(personId) =>
                  updatePartnership(index, "partnerPersonId", personId)
                }
                people={allPeople || []}
                placeholder="انتخاب شریک"
              /> */}

                <Controller
                  name="partnerPersonId"
                  control={control}
                  render={({ field }) => (
                    <PersonSelect
                      value={field.value}
                      onValueChange={(personId, person) => {
                        field.onChange(personId);
                      }}
                      people={allPeople || []}
                      placeholder="انتخاب شریک"
                    />
                  )}
                />
                {errors.personId && (
                  <p className="text-red-500 text-xs">
                    {errors.personId.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  مبلغ سرمایه (ریال)
                </label>
                <input
                  type="number"
                  {...register("partnershipInvestmentAmount")}
                  // value={partnership.investmentAmount.toLocaleString()}
                  // onChange={(e) =>
                  //   updatePartnership(index, "investmentAmount", e.target.value)
                  // }

                  placeholder="مبلغ سرمایه"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">درصد سود</label>
                <input
                  type="number"
                  // value={partnership.profitSharePercentage}
                  // onChange={(e) =>
                  //   updatePartnership(
                  //     index,
                  //     "profitSharePercentage",
                  //     e.target.value,
                  //   )
                  // }
                  {...register("partnershipProfitSharePercentage")}
                  placeholder="درصد"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </>
          ) : transactionReason === "آپشن" ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium">تامین کننده *</label>
              <Controller
                name="providerPersonId"
                control={control}
                render={({ field }) => (
                  <PersonSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    people={providers || []}
                    placeholder="انتخاب تامین کننده"
                  />
                )}
              />
              {errors.providerPersonId && (
                <p className="text-red-500 text-xs">
                  {errors.providerPersonId.message}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                {transactionReason === "سایر هزینه‌ها"
                  ? "طرف حساب (اختیاری)"
                  : "طرف حساب *"}
              </label>
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
                    people={
                      transactionReason === "حقوق"
                        ? employees
                        : (peopleForDeal ?? allPeople) || []
                    }
                    placeholder="انتخاب طرف حساب"
                  />
                )}
              />
              {errors.personId && (
                <p className="text-red-500 text-xs">
                  {errors.personId.message}
                </p>
              )}
            </div>
          )}

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
        <div className="space-y-4 bg-purple-100 p-6 rounded-xl">
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
                    value="پرداختی"
                    {...register("chequeType")}
                    className="w-4 h-4"
                  />
                  <span>پرداختی</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="دریافتی"
                    {...register("chequeType")}
                    className="w-4 h-4"
                  />
                  <span>دریافتی</span>
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
                htmlFor="chequeStatus"
                className="block text-sm font-medium"
              >
                وضعیت فعلی
              </label>
              <select
                id="chequeStatus"
                {...register("chequeStatus")}
                className="w-full px-3 py-2 border border-gray-600 rounded-md"
              >
                {CHEQUE_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="chequeNumber"
                className="block text-sm font-medium"
              >
                سری چک *
              </label>
              <input
                id="chequeNumber"
                {...register("chequeNumber")}
                type="text"
                inputMode="numeric"
                placeholder="شماره چک"
                className="w-full px-3 py-2 border border-gray-600 rounded-md"
              />
              {errors.chequeNumber && (
                <p className="text-red-500 text-xs">
                  {errors.chequeNumber.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="sayadiID" className="block text-sm font-medium">
                شناسه صیادی *
              </label>
              <input
                id="sayadiID"
                {...register("sayadiID")}
                type="text"
                inputMode="numeric"
                placeholder="شناسه صیادی"
                className="w-full px-3 py-2 border border-gray-600 rounded-md"
              />
              {errors.sayadiID && (
                <p className="text-red-500 text-xs">
                  {errors.sayadiID.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="chequeSerial"
                className="block text-sm font-medium"
              >
                سریال چک *
              </label>
              <input
                id="chequeSerial"
                {...register("chequeSerial")}
                type="text"
                inputMode="numeric"
                placeholder="سریال چک"
                className="w-full px-3 py-2 border border-gray-600 rounded-md"
              />
              {errors.chequeSerial && (
                <p className="text-red-500 text-xs">
                  {errors.chequeSerial.message}
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
                className="w-full px-3 py-2 border border-gray-600 rounded-md"
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
                className="w-full px-3 py-2 border border-gray-600 rounded-md"
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
                    className="border-gray-600"
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
                    className="border-gray-600"
                  />
                )}
              />
              {errors.chequeDueDate && (
                <p className="text-red-500 text-xs">
                  {errors.chequeDueDate.message}
                </p>
              )}
            </div>

            {showPayer && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  مشتری (Customer) *
                </label>
                <Controller
                  name="chequeCustomerPersonId"
                  control={control}
                  render={({ field }) => (
                    <PersonSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      people={allPeople || []}
                      placeholder="انتخاب مشتری"
                      className="border-gray-600"
                    />
                  )}
                />
                {errors.chequeCustomerPersonId && (
                  <p className="text-red-500 text-xs">
                    {errors.chequeCustomerPersonId.message}
                  </p>
                )}
              </div>
            )}

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
                      className="border-gray-600"
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
                      className="border-gray-600"
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

            <div className="space-y-2">
              <label
                htmlFor="chequeDescription"
                className="block text-sm font-medium"
              >
                توضیحات
              </label>
              <input
                id="chequeDescription"
                {...register("chequeDescription")}
                placeholder="توضیحات"
                className="w-full px-3 py-2 border border-gray-600 rounded-md"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t">
        <button
          type="submit"
          disabled={mode === "edit" && updateTransaction.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {mode === "edit"
            ? updateTransaction.isPending
              ? "در حال به‌روزرسانی..."
              : "به‌روزرسانی تراکنش"
            : "ثبت تراکنش"}
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
