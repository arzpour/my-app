"use client";

import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { chequeNewSchema, chequeNewSchemaType } from "@/validations/chequeNew";
import { toast } from "sonner";
import { createCheque } from "@/apis/client/chequesNew";
import useGetAllPeople from "@/hooks/useGetAllPeople";
import { getAllDeals } from "@/apis/client/deals";
import { useQuery } from "@tanstack/react-query";
import PersonSelect from "../ui/person-select";
import PersianDatePicker from "../global/persianDatePicker";
import { BANK_NAMES, CHEQUE_STATUSES } from "@/utils/systemConstants";
import type { IPeople, IDeal, IChequeNew } from "@/types/new-backend-types";

interface ChequeFormNewProps {
  onSuccess?: () => void;
  embedded?: boolean;
}

const ChequeFormNew: React.FC<ChequeFormNewProps> = ({
  onSuccess,
  embedded = false,
}) => {
  const { data: allPeople } = useGetAllPeople();
  const { data: allDeals } = useQuery({
    queryKey: ["get-all-deals"],
    queryFn: getAllDeals,
  });
  const [selectedPayer, setSelectedPayer] = React.useState<IPeople | null>(
    null
  );
  const [selectedPayee, setSelectedPayee] = React.useState<IPeople | null>(
    null
  );
  const [selectedDeal, setSelectedDeal] = React.useState<IDeal | null>(null);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<chequeNewSchemaType>({
    resolver: zodResolver(chequeNewSchema) as any,
    defaultValues: {
      type: "دریافتی",
      chequeNumber: "",
      bankName: "",
      amount: "",
      issueDate: "",
      dueDate: "",
      status: "در جریان",
      payerPersonId: "",
      payeePersonId: "",
      relatedDealId: "",
      relatedTransactionId: "",
    },
  });

  const chequeType = watch("type");
  const showPayer = chequeType === "دریافتی";
  const showPayee = chequeType === "پرداختی";

  const onSubmit: SubmitHandler<chequeNewSchemaType> = async (data) => {
    try {
      const payer =
        showPayer && data.payerPersonId
          ? allPeople?.find((p) => p._id?.toString() === data.payerPersonId)
          : null;

      const payee =
        showPayee && data.payeePersonId
          ? allPeople?.find((p) => p._id?.toString() === data.payeePersonId)
          : null;

      const chequeData: Partial<IChequeNew> = {
        chequeNumber: parseInt(data.chequeNumber),
        bankName: data.bankName,
        branchName: "",
        vin: selectedDeal?.vehicleSnapshot?.vin || "",
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        amount: parseFloat(data.amount),
        type: data.type === "دریافتی" ? "received" : "issued",
        status: data.status,
        sayadiID: "",
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
        relatedDealId: data.relatedDealId ? parseInt(data.relatedDealId) : 0,
        relatedTransactionId: data.relatedTransactionId
          ? parseInt(data.relatedTransactionId)
          : 0,
        actions: [
          {
            actionType: "ثبت",
            actionDate: new Date().toISOString(),
            actorUserId: "", // TODO: Get from auth context
            description: "ثبت اولیه چک",
          },
        ],
      };

      await createCheque(chequeData);
      toast.success("چک با موفقیت ثبت شد");
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating cheque:", error);
      toast.error(error?.response?.data?.message || "خطا در ثبت چک");
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  {...register("type")}
                  className="w-4 h-4"
                />
                <span>دریافتی</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="پرداختی"
                  {...register("type")}
                  className="w-4 h-4"
                />
                <span>پرداختی</span>
              </label>
            </div>
            {errors.type && (
              <p className="text-red-500 text-xs">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="chequeNumber" className="block text-sm font-medium">
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
            <label htmlFor="bankName" className="block text-sm font-medium">
              نام بانک *
            </label>
            <select
              id="bankName"
              {...register("bankName")}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">انتخاب بانک</option>
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
            <label htmlFor="amount" className="block text-sm font-medium">
              مبلغ (ریال) *
            </label>
            <input
              id="amount"
              {...register("amount")}
              type="number"
              placeholder="مبلغ"
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.amount && (
              <p className="text-red-500 text-xs">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">تاریخ صدور *</label>
            <Controller
              name="issueDate"
              control={control}
              render={({ field }) => (
                <PersianDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="تاریخ صدور"
                />
              )}
            />
            {errors.issueDate && (
              <p className="text-red-500 text-xs">{errors.issueDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">تاریخ سررسید *</label>
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <PersianDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="تاریخ سررسید"
                />
              )}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-xs">{errors.dueDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium">
              وضعیت فعلی
            </label>
            <select
              id="status"
              {...register("status")}
              className="w-full px-3 py-2 border rounded-md"
            >
              {CHEQUE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-base text-gray-800 font-semibold border-b pb-2">
          طرفین چک
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {showPayer && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                صادرکننده (Payer)
              </label>
              <Controller
                name="payerPersonId"
                control={control}
                render={({ field }) => (
                  <PersonSelect
                    value={field.value}
                    onValueChange={(personId, person) => {
                      field.onChange(personId);
                      setSelectedPayer(person || null);
                    }}
                    people={allPeople || []}
                    placeholder="انتخاب صادرکننده"
                  />
                )}
              />
            </div>
          )}

          {showPayee && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                گیرنده (Payee)
              </label>
              <Controller
                name="payeePersonId"
                control={control}
                render={({ field }) => (
                  <PersonSelect
                    value={field.value}
                    onValueChange={(personId, person) => {
                      field.onChange(personId);
                      setSelectedPayee(person || null);
                    }}
                    people={allPeople || []}
                    placeholder="انتخاب گیرنده"
                  />
                )}
              />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-base text-gray-800 font-semibold border-b pb-2">
          ارتباطات
        </h3>
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            مرتبط با معامله (اختیاری)
          </label>
          <select
            {...register("relatedDealId")}
            onChange={(e) => {
              const deal = allDeals?.find(
                (d) => d._id?.toString() === e.target.value
              );
              setSelectedDeal(deal || null);
              setValue("relatedDealId", e.target.value);
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
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          ثبت چک
        </button>
      </div>
    </form>
  );

  if (embedded) {
    return (
      <div dir="rtl">
        {/* <div className="mb-4">
          <h2 className="text-xl font-bold">ثبت چک</h2>
        </div> */}
        {formContent}
      </div>
    );
  }

  return <div dir="rtl">{formContent}</div>;
};

export default ChequeFormNew;
