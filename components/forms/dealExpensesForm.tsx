"use client";

import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  dealExpensesSchema,
  dealExpensesSchemaType,
} from "@/validations/dealExpenses";
import { toast } from "sonner";
import { useUpdateDeal } from "@/apis/mutations/deals";
import { getAllDeals } from "@/apis/client/deals";
import { useQuery } from "@tanstack/react-query";
import useGetAllPeople from "@/hooks/useGetAllPeople";
import PersonSelect from "../ui/person-select";
import PersianDatePicker from "../global/persianDatePicker";
import type { IDeal } from "@/types/new-backend-types";

interface DealExpensesFormProps {
  onSuccess?: () => void;
  embedded?: boolean;
}

const DealExpensesForm: React.FC<DealExpensesFormProps> = ({
  onSuccess,
  embedded = false,
}) => {
  const updateDeal = useUpdateDeal();
  const { data: allPeople } = useGetAllPeople();
  const [selectedDeal, setSelectedDeal] = React.useState<IDeal | null>(null);

  const { data: allDeals } = useQuery({
    queryKey: ["get-all-deals"],
    queryFn: getAllDeals,
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<dealExpensesSchemaType>({
    resolver: zodResolver(dealExpensesSchema),
    defaultValues: {
      dealId: "",
      expenseType: "options",
      providerPersonId: "",
      description: "",
      cost: "",
      date: "",
    },
  });

  const expenseType = watch("expenseType");

  const onSubmit: SubmitHandler<dealExpensesSchemaType> = async (data) => {
    try {
      if (!selectedDeal) {
        toast.error("لطفاً خودرو را انتخاب کنید");
        return;
      }

      const provider = allPeople?.find(
        (p) => p._id?.toString() === data.providerPersonId
      );

      const expenseItem = {
        id: new Date().getTime().toString(),
        provider: provider
          ? {
              personId: provider._id?.toString() || "",
              name: provider.fullName,
            }
          : {
              personId: data.providerPersonId,
              name: "",
            },
        date: data.date,
        description: data.description,
        cost: parseFloat(data.cost),
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

      await updateDeal.mutateAsync({
        id: data.dealId,
        data: updateData,
      });

      toast.success("هزینه با موفقیت ثبت شد");
      onSuccess?.();
    } catch (error: any) {
      console.error("Error adding expense:", error);
      toast.error(error?.response?.data?.message || "خطا در ثبت هزینه");
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">انتخاب خودرو</h3>
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            انتخاب خودرو (پلاک/مدل) *
          </label>
          <select
            {...register("dealId")}
            onChange={(e) => {
              const deal = allDeals?.find(
                (d) => d._id?.toString() === e.target.value
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
        <h3 className="text-lg font-semibold border-b pb-2">اطلاعات هزینه</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">نوع هزینه *</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="options"
                  {...register("expenseType")}
                  className="w-4 h-4"
                />
                <span>آپشن</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="otherCost"
                  {...register("expenseType")}
                  className="w-4 h-4"
                />
                <span>سایر هزینه‌ها</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">تامین کننده *</label>
              <Controller
                name="providerPersonId"
                control={control}
                render={({ field }) => (
                  <PersonSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    people={allPeople || []}
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
                شرح هزینه/آپشن *
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
                مبلغ هزینه (ریال) *
              </label>
              <input
                id="cost"
                {...register("cost")}
                type="number"
                placeholder="مبلغ"
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.cost && (
                <p className="text-red-500 text-xs">{errors.cost.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">تاریخ *</label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
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
          disabled={updateDeal.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {updateDeal.isPending ? "در حال ثبت..." : "ثبت هزینه"}
        </button>
      </div>
    </form>
  );

  if (embedded) {
    return (
      <div dir="rtl">
        <div className="mb-4">
          <h2 className="text-xl font-bold">ثبت هزینه و آپشن</h2>
        </div>
        {formContent}
      </div>
    );
  }

  return <div dir="rtl">{formContent}</div>;
};

export default DealExpensesForm;
