"use client";

import React from "react";
// @ts-ignore - react-hook-form useForm: types sometimes not resolved (e.g. Next build); runtime is fine. Use @ts-ignore so Ubuntu build does not report "Unused directive".
import {
  useForm,
  Controller,
  SubmitHandler,
  ControllerRenderProps,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  dealExpensesSchema,
  dealExpensesSchemaType,
} from "@/validations/dealExpenses";
import { toast } from "sonner";
import { useEditDealOption, useUpdateDeal } from "@/apis/mutations/deals";
import { getAllDeals } from "@/apis/client/deals";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useGetAllPeople from "@/hooks/useGetAllPeople";
import PersonSelect from "../ui/person-select";
import PersianDatePicker from "../global/persianDatePicker";
import type { IDeal, IOptions } from "@/types/new-backend-types";
import useUpdateWalletHandler from "@/hooks/useUpdateWalletHandler";
import { useDispatch } from "react-redux";
import { setOptionUpdated } from "@/redux/slices/transactionSlice";
import useUpdateWalletTransferHandler from "@/hooks/useUpdateWalletTransferHandler";
// import { createTransaction } from "@/apis/client/transaction";

interface DealExpensesFormProps {
  onSuccess?: () => void;
  embedded?: boolean;
  mode?: "add" | "edit";
  dealId?: string;
  optionId?: string;
  optionIdForUpdateWallet?: string;
}

const DealExpensesForm: React.FC<DealExpensesFormProps> = ({
  onSuccess,
  embedded = false,
  mode = "add",
  dealId,
  optionId,
  optionIdForUpdateWallet,
}) => {
  const updateDealDirectCost = useUpdateDeal();
  const { data: allPeople } = useGetAllPeople();
  const [selectedDeal, setSelectedDeal] = React.useState<IDeal | null>(null);

  const { data: allDeals } = useQuery({
    queryKey: ["get-all-deals"],
    queryFn: getAllDeals,
  });
  const { updateWalletHandler } = useUpdateWalletHandler();
  const { updateWalletTransfer } = useUpdateWalletTransferHandler();
  const queryClient = useQueryClient();
  const editDealOption = useEditDealOption();
  const dispatch = useDispatch();

  const selectedOptionData: IOptions = allDeals
    ?.find((d) => d._id === dealId)
    ?.directCosts.options.filter((o) => o._id === optionId)[0] ?? {
    provider: {
      personId: "",
      name: "",
    },
    description: "",
    cost: 0,
    date: "",
    _id: "",
    id: "",
    optionId: "",
  };

  const providers = allPeople?.filter((el) => el.roles.includes("provider"));

  const defaultValueOfForm =
    mode === "add"
      ? {
          dealId: "",
          expenseType: "options" as const,
          providerPersonId: "",
          description: "",
          cost: "",
          date: "",
        }
      : {
          dealId: dealId ?? "",
          expenseType: "options" as const,
          providerPersonId: selectedOptionData?.provider?.personId ?? "",
          description: selectedOptionData?.description ?? "",
          cost: selectedOptionData?.cost?.toString() ?? "",
          date: selectedOptionData?.date ?? "",
        };

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<dealExpensesSchemaType>({
    resolver: zodResolver(dealExpensesSchema),
    defaultValues: defaultValueOfForm,
  });

  const expenseType = watch("expenseType");
  // const queryClient = useQueryClient();

  const onSubmit: SubmitHandler<dealExpensesSchemaType> = async (
    data: dealExpensesSchemaType,
  ) => {
    try {
      const provider = allPeople?.find(
        (p) => p._id?.toString() === data.providerPersonId,
      );

      const optionIdCreateId =
        `${data.dealId}${data.providerPersonId ?? ""}${data.cost}12` || "";

      if (mode === "edit") {
        const updateDealOption: Partial<IOptions> = {
          cost: parseFloat(data?.cost) || 0,
          date: data.date,
          description: data.description,
          provider: provider
            ? {
                personId: provider._id?.toString() || "",
                name: `${provider.firstName} ${provider.lastName}`,
              }
            : {
                personId: data.providerPersonId,
                name: "",
              },
        };

        await editDealOption.mutateAsync({
          dealId: dealId ?? "",
          optionId: optionId ?? "",
          data: updateDealOption,
        });

        dispatch(setOptionUpdated(optionIdForUpdateWallet ?? optionId ?? ""));

        const price = Number(data.cost);

        const walletData = {
          amount: price,
          type: `هزینه خودرو ${data.expenseType || ""}`,
          description: data.description || "هزینه خودرو",
          dealID: data.dealId ?? "",
          transactionID: "",
          optionId: optionIdForUpdateWallet ?? optionId ?? "",
        };
        if (data.providerPersonId) {
          updateWalletHandler(data.providerPersonId, walletData);
        }

        const walletUpdates: Array<{
          oldPersonId: string;
          newPersonId: string;
          amount: number;
          type: string;
          description: string;
          dealId?: string;
          transactionId: string;
          reason: "provider" | "broker" | "financier" | "person";
        }> = [];

        const newPersonId = data.providerPersonId;
        const oldPersonId = selectedOptionData?.provider?.personId;

        if (oldPersonId !== newPersonId && oldPersonId && newPersonId) {
          walletUpdates.push({
            oldPersonId,
            newPersonId,
            amount: price,
            type: `هزینه خودرو ${data.expenseType || ""}`,
            description:
              data.description || `تغییر طرف حساب - ${data.description}`,
            dealId: data.dealId,
            transactionId: "",
            reason: "provider",
          });
        }

        for (const update of walletUpdates) {
          try {
            await updateWalletTransfer(update);
          } catch (walletError) {
            console.error("Error updating wallet:", walletError);
          }
        }

        // queryClient.invalidateQueries({
        //   queryKey: ["get-all-deals"],
        // });

        ///////
      } else {
        if (!selectedDeal) {
          toast.error("لطفاً خودرو را انتخاب کنید");
          return;
        }

        // const expenseItem = {
        //   _id: new Date().getTime().toString(),
        //   id: new Date().getTime().toString(),
        //   provider: provider
        //     ? {
        //         personId: provider._id?.toString() || "",
        //         name: `${provider.firstName} ${provider.lastName}`,
        //       }
        //     : {
        //         personId: data.providerPersonId,
        //         name: "",
        //       },
        //   date: data.date,
        //   description: data.description,
        //   cost: parseFloat(data.cost) || 0,
        //   // optionId: optionId ?? Date.now().toString(),
        //   optionId: optionIdCreateId ?? optionId ?? "",
        // };

        // const updateData: Partial<IDeal> = {
        //   directCosts: {
        //     options:
        //       data.expenseType === "options"
        //         ? [...(selectedDeal.directCosts?.options || []), expenseItem]
        //         : selectedDeal.directCosts?.options || [],
        //     otherCost:
        //       data.expenseType === "otherCost"
        //         ? [
        //             ...(selectedDeal.directCosts?.otherCost || []),
        //             {
        //               _id: new Date().getTime().toString(),
        //               id: new Date().getTime().toString(), // ← اضافه کنید
        //               category: "",
        //               ...expenseItem,
        //             },
        //           ]
        //         : selectedDeal.directCosts?.otherCost || [],
        //   },
        // };

        const expenseItem = {
          _id: new Date().getTime().toString(),
          id: new Date().getTime().toString(),
          provider: provider
            ? {
                personId: provider._id?.toString() || "",
                name: `${provider.firstName} ${provider.lastName}`,
              }
            : {
                personId: data.providerPersonId,
                name: "",
              },
          date: data.date,
          description: data.description,
          cost: Number(data.cost) || 0,
          optionId: optionIdCreateId ?? optionId ?? "",
        };

        const updateData: Partial<IDeal> = {
          directCosts: {
            options:
              data.expenseType === "options"
                ? [...(selectedDeal.directCosts?.options || []), expenseItem]
                : selectedDeal.directCosts?.options || [],
            otherCost:
              data.expenseType === "otherCost"
                ? [
                    ...(selectedDeal.directCosts?.otherCost || []),
                    {
                      ...expenseItem,
                      category: "",
                    },
                  ]
                : selectedDeal.directCosts?.otherCost || [],
          },
        };

        const res = await updateDealDirectCost.mutateAsync({
          id: data.dealId,
          data: updateData,
        });

        toast.success("هزینه با موفقیت ثبت شد");

        // const transactionData = {
        //   type: "هزینه وسیله",
        //   reason: "هزینه وسیله",
        //   transactionDate: data.date ?? "",
        //   amount: parseFloat(data.cost) ?? "",
        //   personId: data.providerPersonId?.toString() || "",
        //   bussinessAccountId: "",
        //   paymentMethod: "-",
        //   dealId: selectedDeal._id || "",
        //   description: data.description ?? "",
        // };

        // await createTransaction(transactionData);
        // queryClient.invalidateQueries({
        //   queryKey: ["get-transactions-by-deal-id"],
        // });

        const price = Number(data.cost);

        const walletData = {
          amount: price,
          type: `هزینه خودرو ${data.expenseType || ""}`,
          description: data.description || "هزینه خودرو",
          dealID: data.dealId ?? "",
          transactionID: "",
          // optionId: optionId ?? Date.now().toString(),
          optionId: optionIdCreateId ?? optionId ?? "",
        };
        if (data.providerPersonId) {
          updateWalletHandler(data.providerPersonId, walletData);
        }
      }

      onSuccess?.();

      queryClient.invalidateQueries({
        queryKey: ["get-deals-by-vin"],
      });
    } catch (error: any) {
      console.error("Error adding expense:", error);
      toast.error(error?.response?.data?.message || "خطا در ثبت هزینه");
    } finally {
      dispatch(setOptionUpdated(optionIdForUpdateWallet ?? optionId ?? ""));
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-base text-gray-800 font-semibold border-b pb-2">
          انتخاب خودرو
        </h3>
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            {" "}
            انتخاب خودرو (پلاک/مدل) <span className="text-red-600">*</span>
          </label>
          <select
            {...register("dealId")}
            onChange={(e) => {
              const deal = allDeals?.find(
                (d) => d._id?.toString() === e.target.value,
              );
              setSelectedDeal(deal || null);
              setValue("dealId", e.target.value);
            }}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">انتخاب خودرو</option>
            {allDeals?.map((deal: IDeal) => (
              <option key={deal._id?.toString()} value={deal._id?.toString()}>
                {deal.vehicleSnapshot.plateNumber || "بدون پلاک"} -{" "}
                {deal.vehicleSnapshot.model} ({deal.vehicleSnapshot.vin})
              </option>
            ))}
          </select>
          {errors.dealId && (
            <p className="text-red-500 text-xs">{errors.dealId.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-base text-gray-800 font-semibold border-b pb-2">
          اطلاعات هزینه
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {" "}
              نوع هزینه <span className="text-red-600">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="options"
                  {...register("expenseType")}
                  className="w-4 h-4"
                />
                <span className="text-sm">آپشن</span>
              </label>
              <label className="flex items-center gap-2 opacity-50">
                <input
                  type="radio"
                  value="otherCost"
                  {...register("expenseType")}
                  className="w-4 h-4 disabled:opacity-70 cursor-not-allowed"
                  disabled
                />
                <span className="opacity-50 cursor-not-allowed text-sm">
                  سایر هزینه‌ها
                </span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                {expenseType === "otherCost" ? (
                  "تامین کننده"
                ) : (
                  <>
                    {" "}
                    تامین کننده <span className="text-red-600">*</span>
                  </>
                )}
              </label>
              <Controller
                name="providerPersonId"
                control={control}
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    dealExpensesSchemaType,
                    "providerPersonId"
                  >;
                }) => (
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

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium"
              >
                {" "}
                شرح هزینه/آپشن <span className="text-red-600">*</span>
              </label>
              <input
                id="description"
                {...register("description")}
                placeholder="شرح هزینه"
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.description && (
                <p className="text-red-500 text-xs">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="cost" className="block text-sm font-medium">
                {" "}
                مبلغ هزینه (ریال) <span className="text-red-600">*</span>
              </label>
              {/* <input
                id="cost"
                {...register("cost")}
                type="number"
                placeholder="مبلغ"
                className="w-full px-3 py-2 border rounded-md"
                value={Number(getValues().cost).toLocaleString("en-US")}
              /> */}
              <Controller
                name="cost"
                control={control}
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<dealExpensesSchemaType, "cost">;
                }) => {
                  const formattedValue = field.value
                    ? Number(field.value).toLocaleString("en-US")
                    : "";

                  return (
                    <input
                      {...field}
                      type="text"
                      id="cost"
                      inputMode="numeric"
                      placeholder="مبلغ"
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
              {errors.cost && (
                <p className="text-red-500 text-xs">{errors.cost.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                {" "}
                تاریخ <span className="text-red-600">*</span>
              </label>
              <Controller
                name="date"
                control={control}
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<dealExpensesSchemaType, "date">;
                }) => (
                  <PersianDatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="تاریخ"
                  />
                )}
              />
              {errors.date && (
                <p className="text-red-500 text-xs">{errors.date.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <button
          type="submit"
          disabled={
            (mode === "edit" && editDealOption.isPending) ||
            updateDealDirectCost.isPending
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {mode === "edit"
            ? editDealOption.isPending
              ? "در حال به‌روزرسانی..."
              : "به‌روزرسانی آپشن"
            : updateDealDirectCost.isPending
              ? "در حال ثبت..."
              : "ثبت هزینه"}
        </button>
      </div>
    </form>
  );

  if (embedded) {
    return (
      <div dir="rtl">
        {/* <div className="mb-4">
          <h2 className="text-xl font-bold">ثبت هزینه و آپشن</h2>
        </div> */}
        {formContent}
      </div>
    );
  }

  return <div dir="rtl">{formContent}</div>;
};

export default DealExpensesForm;
