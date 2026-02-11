"use client";

import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saleDealSchema, saleDealSchemaType } from "@/validations/saleDeal";
import { toast } from "sonner";
import { useUpdateDeal, useGetAllDeals } from "@/apis/mutations/deals";
import { getAllDeals, getDealsByStatus } from "@/apis/client/deals";
import { useQuery } from "@tanstack/react-query";
import useGetAllPeople from "@/hooks/useGetAllPeople";
import PersonSelect from "../ui/person-select";
import PersianDatePicker from "../global/persianDatePicker";
import type { IPeople, IDeal } from "@/types/new-backend-types";
import useUpdateWalletHandler from "@/hooks/useUpdateWalletHandler";
import { useUpdateVehicle } from "@/apis/mutations/vehicle";

interface SaleDealFormProps {
  onSuccess?: () => void;
  embedded?: boolean;
}

const SaleDealForm: React.FC<SaleDealFormProps> = ({
  onSuccess,
  embedded = false,
}) => {
  const updateDeal = useUpdateDeal();
  const { data: allPeople } = useGetAllPeople();
  const [selectedBuyer, setSelectedBuyer] = React.useState<IPeople | null>(
    null,
  );
  const [selectedBroker, setSelectedBroker] = React.useState<IPeople | null>(
    null,
  );
  const [selectedDeal, setSelectedDeal] = React.useState<IDeal | null>(null);

  // Get in_stock deals
  // const { data: inStockDeals } = useQuery({
  //   queryKey: ["get-deals-by-status", "in_stock"],
  //   queryFn: () => getDealsByStatus("in_stock"),
  // });

  const { data: allDeals } = useQuery({
    queryKey: ["get-all-deals"],
    queryFn: getAllDeals,
  });

  const { updateWalletHandler } = useUpdateWalletHandler();
  const updateVehicle = useUpdateVehicle();

  const customers = allPeople?.filter((el) => el.roles.includes("customer"));

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<saleDealSchemaType>({
    resolver: zodResolver(saleDealSchema),
    defaultValues: {
      dealId: "",
      buyerPersonId: "",
      salePrice: "",
      saleDate: "",
      saleBrokerPersonId: "",
      saleBrokerCommissionPercent: "",
    },
  });

  const salePrice = watch("salePrice");
  const brokerCommissionPercent = watch("saleBrokerCommissionPercent");

  const onSubmit: SubmitHandler<saleDealSchemaType> = async (data) => {
    try {
      if (!selectedDeal) {
        toast.error("لطفاً خودرو را انتخاب کنید");
        return;
      }

      const buyer = allPeople?.find(
        (p) => p._id?.toString() === data.buyerPersonId,
      );

      const updateData: Partial<IDeal> = {
        buyer: buyer
          ? {
              personId: buyer._id?.toString() || "",
              fullName: `${buyer.firstName} ${buyer.lastName}`,
              nationalId: buyer.nationalId?.toString() || "",
              mobile: buyer.phoneNumbers?.map((el) => el)?.toString() || "",
            }
          : undefined,
        salePrice: parseFloat(data.salePrice),
        saleDate: data.saleDate,
        saleBroker:
          selectedBroker && data.saleBrokerPersonId
            ? {
                personId: data.saleBrokerPersonId,
                fullName: `${selectedBroker.firstName} ${selectedBroker.lastName}`,
                commissionPercent: parseFloat(
                  data.saleBrokerCommissionPercent || "0",
                ),
                commissionAmount:
                  parseFloat(data.salePrice) *
                  (parseFloat(data.saleBrokerCommissionPercent || "0") / 100),
              }
            : undefined,
        status: "sold",
      };

      await updateDeal.mutateAsync({
        id: data.dealId,
        data: updateData,
      });

      toast.success("فروش خودرو با موفقیت ثبت شد");

      await updateVehicle.mutateAsync({
        id: selectedDeal.vehicleId.toString(),
        data: { status: "sold" },
      });
      onSuccess?.();

      const price = Number(data.salePrice);
      const walletDataForBuyer = {
        amount: -price,
        type: "خرید ماشین",
        description: "خرید ماشین",
      };
      updateWalletHandler(data.buyerPersonId ?? "", walletDataForBuyer);

      const walletDataForSaleBroker = {
        amount: price,
        type: "فروش ماشین",
        description: "فروش ماشین",
      };
      updateWalletHandler(
        data.saleBrokerPersonId ?? "",
        walletDataForSaleBroker,
      );
    } catch (error: any) {
      console.error("Error updating sale deal:", error);
      toast.error(error?.response?.data?.message || "خطا در ثبت فروش خودرو");
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
            انتخاب خودرو (پلاک/مدل) *
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
            {allDeals
              ?.filter((d) => d.status === "in_stock")
              ?.map((deal) => (
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
          اطلاعات خریدار
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">خریدار *</label>
            <Controller
              name="buyerPersonId"
              control={control}
              render={({ field }) => (
                <PersonSelect
                  value={field.value}
                  onValueChange={(personId, person) => {
                    field.onChange(personId);
                    setSelectedBuyer(person || null);
                  }}
                  people={customers || []}
                  placeholder="انتخاب خریدار"
                />
              )}
            />
            {errors.buyerPersonId && (
              <p className="text-red-500 text-xs">
                {errors.buyerPersonId.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-base text-gray-800 font-semibold border-b pb-2">
          اطلاعات مالی فروش
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="salePrice" className="block text-sm font-medium">
              قیمت فروش نهایی (ریال) *
            </label>
            {/* <input
              id="salePrice"
              {...register("salePrice")}
              type="number"
              placeholder="قیمت فروش"
              className="w-full px-3 py-2 border rounded-md"
              value={getValues().salePrice.toLocaleString()}
            /> */}
            <Controller
              name="salePrice"
              control={control}
              render={({ field }) => {
                const formattedValue = field.value
                  ? Number(field.value).toLocaleString("en-US")
                  : "";

                return (
                  <input
                    {...field}
                    type="text"
                    id="salePrice"
                    inputMode="numeric"
                    placeholder="قیمت فروش"
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
            {errors.salePrice && (
              <p className="text-red-500 text-xs">{errors.salePrice.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">تاریخ فروش *</label>
            <Controller
              name="saleDate"
              control={control}
              render={({ field }) => (
                <PersianDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="تاریخ فروش"
                />
              )}
            />
            {errors.saleDate && (
              <p className="text-red-500 text-xs">{errors.saleDate.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-base text-gray-800 font-semibold border-b pb-2">
          کارگزار فروش
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">نام کارگزار</label>
            <Controller
              name="saleBrokerPersonId"
              control={control}
              render={({ field }) => (
                <PersonSelect
                  value={field.value}
                  onValueChange={(personId, person) => {
                    field.onChange(personId);
                    setSelectedBroker(person || null);
                    if (person?.brokerDetails?.currentRates) {
                      setValue(
                        "saleBrokerCommissionPercent",
                        person.brokerDetails.currentRates.saleCommissionPercent,
                      );
                    }
                  }}
                  people={
                    allPeople?.filter((p) => p.roles?.includes("broker")) || []
                  }
                  placeholder="انتخاب کارگزار"
                  filterByRole={["broker"]}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="saleBrokerCommissionPercent"
              className="block text-sm font-medium"
            >
              درصد کمیسیون
            </label>
            <input
              id="saleBrokerCommissionPercent"
              {...register("saleBrokerCommissionPercent")}
              type="number"
              step="0.001"
              placeholder="مثلاً 0.01"
              className="w-full px-3 py-2 border rounded-md"
            />
            {salePrice && brokerCommissionPercent && (
              <p className="text-xs text-gray-500">
                مبلغ کمیسیون:{" "}
                {(
                  parseFloat(salePrice) *
                  (parseFloat(brokerCommissionPercent || "0") / 100)
                ).toLocaleString()}{" "}
                ریال
              </p>
            )}
          </div>
        </div>
      </div>

      {selectedDeal && salePrice && (
        <div className="p-4 bg-blue-50 rounded-md">
          <h4 className="font-semibold mb-2">محاسبه سود (نمایشی)</h4>
          <div className="space-y-1 text-sm">
            <p>
              قیمت خرید: {selectedDeal.purchasePrice?.toLocaleString()} ریال
            </p>
            <p>قیمت فروش: {parseFloat(salePrice).toLocaleString()} ریال</p>
            <p className="font-semibold">
              سود خالص:{" "}
              {(
                parseFloat(salePrice) -
                (selectedDeal.purchasePrice || 0) -
                (selectedDeal.directCosts?.options?.reduce(
                  (sum, opt) => sum + opt.cost,
                  0,
                ) || 0) -
                (selectedDeal.directCosts?.otherCost?.reduce(
                  (sum, cost) => sum + cost.cost,
                  0,
                ) || 0) -
                (selectedDeal.purchaseBroker?.commissionAmount || 0) -
                (brokerCommissionPercent
                  ? parseFloat(salePrice) *
                    (parseFloat(brokerCommissionPercent) / 100)
                  : 0)
              ).toLocaleString()}{" "}
              ریال
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t">
        <button
          type="submit"
          disabled={updateDeal.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {updateDeal.isPending ? "در حال ثبت..." : "ثبت فروش"}
        </button>
      </div>
    </form>
  );

  if (embedded) {
    return (
      <div dir="rtl">
        {/* <div className="mb-4">
          <h2 className="text-xl font-bold">ثبت فروش خودرو</h2>
        </div> */}
        {formContent}
      </div>
    );
  }

  return <div dir="rtl">{formContent}</div>;
};

export default SaleDealForm;
