"use client";

import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  purchaseDealSchema,
  purchaseDealSchemaType,
} from "@/validations/purchaseDeal";
import { toast } from "sonner";
import { useCreateDeal } from "@/apis/mutations/deals";
import { createVehicle } from "@/apis/client/vehicles";
import useGetAllPeople from "@/hooks/useGetAllPeople";
import PersonSelect from "../ui/person-select";
import PersianDatePicker from "../global/persianDatePicker";
import { PERSIAN_YEARS } from "@/utils/systemConstants";
import type { IPeople, IDeal, IVehicle } from "@/types/new-backend-types";
import PlateComponent from "./plate";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { resetPlateState } from "@/redux/slices/plateSlice";

interface PurchaseDealFormProps {
  dealData?: IDeal | null;
  mode?: "add" | "edit";
  onSuccess?: () => void;
  embedded?: boolean;
}

const PurchaseDealForm: React.FC<PurchaseDealFormProps> = ({
  dealData,
  mode = "add",
  onSuccess,
  embedded = false,
}) => {
  const createDeal = useCreateDeal();
  const { data: allPeople } = useGetAllPeople();
  const [selectedSeller, setSelectedSeller] = React.useState<IPeople | null>(
    null,
  );
  const [selectedBroker, setSelectedBroker] = React.useState<IPeople | null>(
    null,
  );
  const [partnerships, setPartnerships] = React.useState<
    Array<{
      partnerPersonId: string;
      investmentAmount: string;
      profitSharePercentage: string;
    }>
  >([]);

  const { centerAlphabet, centerDigits, ir, leftDigits } = useSelector(
    (state: RootState) => state.plate,
  );
  const dispatch = useDispatch();

  const customers = allPeople?.filter((el) => el.roles.includes("customer"));

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<purchaseDealSchemaType>({
    resolver: zodResolver(purchaseDealSchema),
    defaultValues: {
      vin: "",
      model: "",
      productionYear: "",
      plateNumber: "",
      color: "",
      sellerPersonId: "",
      purchasePrice: "",
      purchaseDate: "",
      purchaseBrokerPersonId: "",
      purchaseBrokerCommissionPercent: "",
      partnerships: [],
    },
  });

  const purchasePrice = watch("purchasePrice");
  const brokerCommissionPercent = watch("purchaseBrokerCommissionPercent");

  // Calculate broker commission
  React.useEffect(() => {
    if (purchasePrice && brokerCommissionPercent) {
      const price = parseFloat(purchasePrice);
      const percent = parseFloat(brokerCommissionPercent);
      if (!isNaN(price) && !isNaN(percent)) {
        // Commission amount is calculated on backend
      }
    }
  }, [purchasePrice, brokerCommissionPercent]);

  const addPartnership = () => {
    setPartnerships([
      ...partnerships,
      {
        partnerPersonId: "",
        investmentAmount: "",
        profitSharePercentage: "",
      },
    ]);
  };

  const removePartnership = (index: number) => {
    setPartnerships(partnerships.filter((_, i) => i !== index));
  };

  const updatePartnership = (index: number, field: string, value: string) => {
    const updated = [...partnerships];
    updated[index] = { ...updated[index], [field]: value };
    setPartnerships(updated);
    setValue("partnerships", updated);
  };

  const onSubmit: SubmitHandler<purchaseDealSchemaType> = async (data) => {
    const plateData = `${leftDigits} ${centerAlphabet} ${centerDigits} ${ir}`;
    try {
      const vehicleData: Partial<IVehicle> = {
        vin: data.vin,
        model: data.model,
        productionYear: parseInt(data.productionYear),
        plateNumber: plateData || data.plateNumber || "",
        color: data.color || "",
        dealHistoryIds: [],
        status: "in_stock",
      };

      const vehicle = await createVehicle(vehicleData);

      const seller = allPeople?.find(
        (p) => p._id?.toString() === data.sellerPersonId,
      );
      const vehicleIdNumber =
        (vehicle as any).id ||
        (vehicle as any).vehicleId ||
        (vehicle._id ? parseInt(vehicle._id.toString().slice(-8), 16) : 0);

      const dealData: Partial<IDeal> = {
        vehicleId: vehicleIdNumber,
        vehicleSnapshot: {
          vin: data.vin,
          model: data.model,
          productionYear: parseInt(data.productionYear),
          plateNumber: data.plateNumber || "",
        },
        status: "in_stock",
        purchaseDate: data.purchaseDate,
        purchasePrice: parseFloat(data.purchasePrice),
        seller: seller
          ? {
              personId: seller._id?.toString() || "",
              fullName: `${seller.firstName} ${seller.lastName}`,
              nationalId: seller.nationalId?.toString() || "",
              mobile: seller.phoneNumbers?.map((el) => el)?.toString() || "",
            }
          : undefined,
        purchaseBroker:
          selectedBroker && data.purchaseBrokerPersonId
            ? {
                personId: data.purchaseBrokerPersonId,
                fullName: `${selectedBroker.firstName} ${selectedBroker.lastName}`,
                commissionPercent: parseFloat(
                  data.purchaseBrokerCommissionPercent || "0",
                ),
                commissionAmount:
                  parseFloat(data.purchasePrice) *
                  (parseFloat(data.purchaseBrokerCommissionPercent || "0") /
                    100),
              }
            : undefined,
        partnerships: partnerships.map((p) => {
          const partner = allPeople?.find(
            (person) => person._id?.toString() === p.partnerPersonId,
          );
          return {
            partner: partner
              ? {
                  personId: partner._id?.toString() || "",
                  name:
                    partner.fullName ??
                    `${partner.firstName} ${partner.lastName}`,
                  nationalID: partner.nationalId?.toString() || "",
                  mobile: partner.phoneNumber?.toString() || "",
                }
              : {
                  personId: p.partnerPersonId,
                  name: "",
                  nationalID: "",
                  mobile: "",
                },
            investmentAmount: parseFloat(p.investmentAmount),
            profitSharePercentage: parseFloat(p.profitSharePercentage),
            payoutAmount: 0,
          };
        }),
        directCosts: {
          options: [],
          otherCost: [],
        },
      };

      await createDeal.mutateAsync(dealData);
      toast.success("خرید خودرو با موفقیت ثبت شد");
      dispatch(resetPlateState());
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating purchase deal:", error);
      toast.error(error?.response?.data?.message || "خطا در ثبت خرید خودرو");
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Vehicle Information */}
      <div className="space-y-4">
        <h3 className="text-base text-gray-800 font-semibold border-b pb-2">
          مشخصات خودرو
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="vin" className="block text-sm font-medium">
              شماره شاسی (VIN) *
            </label>
            <input
              id="vin"
              {...register("vin")}
              placeholder="شماره شاسی"
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.vin && (
              <p className="text-red-500 text-xs">{errors.vin.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="model" className="block text-sm font-medium">
              مدل خودرو *
            </label>
            <input
              id="model"
              {...register("model")}
              placeholder="مدل خودرو"
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.model && (
              <p className="text-red-500 text-xs">{errors.model.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="productionYear"
              className="block text-sm font-medium"
            >
              سال ساخت *
            </label>
            <select
              id="productionYear"
              {...register("productionYear")}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">انتخاب کنید</option>
              {PERSIAN_YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.productionYear && (
              <p className="text-red-500 text-xs">
                {errors.productionYear.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="color" className="block text-sm font-medium">
              رنگ
            </label>
            <input
              id="color"
              {...register("color")}
              placeholder="رنگ خودرو"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="plateNumber" className="block text-sm font-medium">
              شماره پلاک
            </label>
            {/* <input
              id="plateNumber"
              {...register("plateNumber")}
              placeholder="شماره پلاک"
              className="w-full px-3 py-2 border rounded-md"
            /> */}

            <PlateComponent />
          </div>
        </div>
      </div>

      {/* Deal Information */}
      <div className="space-y-4">
        <h3 className="text-base text-gray-800 font-semibold border-b pb-2">
          اطلاعات معامله
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">فروشنده *</label>
            <Controller
              name="sellerPersonId"
              control={control}
              render={({ field }) => {
                return (
                  <PersonSelect
                    value={field.value}
                    onValueChange={(personId, person) => {
                      field.onChange(personId);
                      setSelectedSeller((person as IPeople) || null);
                    }}
                    people={customers || []}
                    placeholder="انتخاب فروشنده"
                  />
                );
              }}
            />
            {errors.sellerPersonId && (
              <p className="text-red-500 text-xs">
                {errors.sellerPersonId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="purchasePrice"
              className="block text-sm font-medium"
            >
              قیمت خرید (ریال) *
            </label>
            {/* <input
              id="purchasePrice"
              {...register("purchasePrice")}
              type="text"
              inputMode="numeric"
              placeholder="قیمت خرید"
              className="w-full px-3 py-2 border rounded-md"
              value={Number(getValues().purchasePrice).toLocaleString("en-US")}
            /> */}
            <Controller
              name="purchasePrice"
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
                    placeholder="قیمت خرید"
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

            {errors.purchasePrice && (
              <p className="text-red-500 text-xs">
                {errors.purchasePrice.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">تاریخ خرید *</label>
            <Controller
              name="purchaseDate"
              control={control}
              render={({ field }) => (
                <PersianDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="تاریخ خرید"
                />
              )}
            />
            {errors.purchaseDate && (
              <p className="text-red-500 text-xs">
                {errors.purchaseDate.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Purchase Broker */}
      <div className="space-y-4">
        <h3 className="text-base text-gray-800 font-semibold border-b pb-2">
          کارگزار خرید
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">نام کارگزار</label>
            <Controller
              name="purchaseBrokerPersonId"
              control={control}
              render={({ field }) => (
                <PersonSelect
                  value={field.value}
                  onValueChange={(personId, person: IPeople) => {
                    field.onChange(personId);
                    setSelectedBroker((person as IPeople) || null);
                    if (person?.brokerDetails?.currentRates) {
                      setValue(
                        "purchaseBrokerCommissionPercent",
                        person.brokerDetails.currentRates
                          .purchaseCommissionPercent,
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
              htmlFor="purchaseBrokerCommissionPercent"
              className="block text-sm font-medium"
            >
              درصد کمیسیون
            </label>
            <input
              id="purchaseBrokerCommissionPercent"
              {...register("purchaseBrokerCommissionPercent")}
              type="number"
              step="0.001"
              placeholder="مثلاً 0.005"
              className="w-full px-3 py-2 border rounded-md"
            />
            {purchasePrice && brokerCommissionPercent && (
              <p className="text-xs text-gray-500">
                مبلغ کمیسیون:{" "}
                {(
                  parseFloat(purchasePrice) *
                  (parseFloat(brokerCommissionPercent || "0") / 100)
                ).toLocaleString()}{" "}
                ریال
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Partnerships */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-base text-gray-800 font-semibold">
            شرکا (Partners)
          </h3>
          <button
            type="button"
            onClick={addPartnership}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            افزودن شریک
          </button>
        </div>
        {partnerships.map((partnership, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-md"
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium">نام شریک</label>
              <PersonSelect
                value={partnership.partnerPersonId}
                onValueChange={(personId) =>
                  updatePartnership(index, "partnerPersonId", personId)
                }
                people={allPeople || []}
                placeholder="انتخاب شریک"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                مبلغ سرمایه (ریال)
              </label>
              <input
                type="number"
                value={partnership.investmentAmount.toLocaleString()}
                onChange={(e) =>
                  updatePartnership(index, "investmentAmount", e.target.value)
                }
                placeholder="مبلغ سرمایه"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">درصد سود</label>
              <input
                type="number"
                value={partnership.profitSharePercentage}
                onChange={(e) =>
                  updatePartnership(
                    index,
                    "profitSharePercentage",
                    e.target.value,
                  )
                }
                placeholder="درصد"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => removePartnership(index)}
                className="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <button
          type="submit"
          disabled={createDeal.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {createDeal.isPending ? "در حال ثبت..." : "ثبت خرید"}
        </button>
      </div>
    </form>
  );

  if (embedded) {
    return (
      <div dir="rtl">
        {/* <div className="mb-4">
          <h2 className="text-base text-gray-800 font-semibold">
            ثبت خرید خودرو
          </h2>
        </div> */}
        {formContent}
      </div>
    );
  }

  return <div dir="rtl">{formContent}</div>;
};

export default PurchaseDealForm;
