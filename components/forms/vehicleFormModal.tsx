"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { createCar, updateCar } from "@/apis/client/cars";
import { useQueryClient } from "@tanstack/react-query";

interface VehicleFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleData?: ICarRes | null;
  mode: "add" | "edit";
}

interface VehicleFormData {
  RowNo: number | string;
  CarModel: string;
  SaleAmount: number | string;
  PurchaseAmount: number | string;
  LicensePlate: string;
  ChassisNo: string;
  SellerName: string;
  BuyerName: string;
  SaleDate: string;
  PurchaseDate: string;
  SellerMobile: string | number;
  BuyerMobile: string | number;
  PurchaseBroker: string;
  SaleBroker: string;
  Secretary: string;
  DocumentsCopy: string;
  SellerNationalID: string | number;
  BuyerNationalID: string | number;
}

const VehicleFormModal: React.FC<VehicleFormModalProps> = ({
  open,
  onOpenChange,
  vehicleData,
  mode,
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VehicleFormData>({
    defaultValues: vehicleData
      ? {
          RowNo: vehicleData.RowNo || "",
          CarModel: vehicleData.CarModel || "",
          SaleAmount: vehicleData.SaleAmount || "",
          PurchaseAmount: vehicleData.PurchaseAmount || "",
          LicensePlate: vehicleData.LicensePlate || "",
          ChassisNo: vehicleData.ChassisNo || "",
          SellerName: vehicleData.SellerName || "",
          BuyerName: vehicleData.BuyerName || "",
          SaleDate: vehicleData.SaleDate || "",
          PurchaseDate: vehicleData.PurchaseDate || "",
          SellerMobile: vehicleData.SellerMobile || "",
          BuyerMobile: vehicleData.BuyerMobile || "",
          PurchaseBroker: vehicleData.PurchaseBroker || "",
          SaleBroker: vehicleData.SaleBroker || "",
          Secretary: vehicleData.Secretary || "",
          DocumentsCopy: vehicleData.DocumentsCopy || "",
          SellerNationalID: vehicleData.SellerNationalID || "",
          BuyerNationalID: vehicleData.BuyerNationalID || "",
        }
      : {
          RowNo: "",
          CarModel: "",
          SaleAmount: "",
          PurchaseAmount: "",
          LicensePlate: "",
          ChassisNo: "",
          SellerName: "",
          BuyerName: "",
          SaleDate: "",
          PurchaseDate: "",
          SellerMobile: "",
          BuyerMobile: "",
          PurchaseBroker: "",
          SaleBroker: "",
          Secretary: "",
          DocumentsCopy: "",
          SellerNationalID: "",
          BuyerNationalID: "",
        },
  });

  React.useEffect(() => {
    if (vehicleData && mode === "edit") {
      reset({
        RowNo: vehicleData.RowNo || "",
        CarModel: vehicleData.CarModel || "",
        SaleAmount: vehicleData.SaleAmount || "",
        PurchaseAmount: vehicleData.PurchaseAmount || "",
        LicensePlate: vehicleData.LicensePlate || "",
        ChassisNo: vehicleData.ChassisNo || "",
        SellerName: vehicleData.SellerName || "",
        BuyerName: vehicleData.BuyerName || "",
        SaleDate: vehicleData.SaleDate || "",
        PurchaseDate: vehicleData.PurchaseDate || "",
        SellerMobile: vehicleData.SellerMobile || "",
        BuyerMobile: vehicleData.BuyerMobile || "",
        PurchaseBroker: vehicleData.PurchaseBroker || "",
        SaleBroker: vehicleData.SaleBroker || "",
        Secretary: vehicleData.Secretary || "",
        DocumentsCopy: vehicleData.DocumentsCopy || "",
        SellerNationalID: vehicleData.SellerNationalID || "",
        BuyerNationalID: vehicleData.BuyerNationalID || "",
      });
    } else if (mode === "add") {
      reset({
        RowNo: "",
        CarModel: "",
        SaleAmount: "",
        PurchaseAmount: "",
        LicensePlate: "",
        ChassisNo: "",
        SellerName: "",
        BuyerName: "",
        SaleDate: "",
        PurchaseDate: "",
        SellerMobile: "",
        BuyerMobile: "",
        PurchaseBroker: "",
        SaleBroker: "",
        Secretary: "",
        DocumentsCopy: "",
        SellerNationalID: "",
        BuyerNationalID: "",
      });
    }
  }, [vehicleData, mode, reset]);

  const onSubmit: SubmitHandler<VehicleFormData> = async (data) => {
    try {
      // Convert string numbers to actual numbers
      const payload = {
        ...data,
        RowNo: data.RowNo ? Number(data.RowNo) : undefined,
        SaleAmount: data.SaleAmount ? Number(data.SaleAmount) : undefined,
        PurchaseAmount: data.PurchaseAmount
          ? Number(data.PurchaseAmount)
          : undefined,
        SellerMobile: data.SellerMobile ? Number(data.SellerMobile) : undefined,
        BuyerMobile: data.BuyerMobile ? Number(data.BuyerMobile) : undefined,
        SellerNationalID: data.SellerNationalID
          ? Number(data.SellerNationalID)
          : undefined,
        BuyerNationalID: data.BuyerNationalID
          ? Number(data.BuyerNationalID)
          : undefined,
      };

      if (mode === "edit" && vehicleData?._id) {
        await updateCar(vehicleData._id, payload);
        toast("اطلاعات با موفقیت به‌روزرسانی شد", {
          icon: "✅",
          className: "!bg-green-100 !text-green-800 !shadow-md !h-[60px]",
        });
      } else {
        await createCar(payload);
        toast("اطلاعات با موفقیت ثبت شد", {
          icon: "✅",
          className: "!bg-green-100 !text-green-800 !shadow-md !h-[60px]",
        });
      }

      // Invalidate and refetch cars data
      queryClient.invalidateQueries({ queryKey: ["get-cars"] });
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving vehicle:", error);
      toast("خطا در ثبت اطلاعات", {
        className: "!bg-red-100 !text-red-800 !shadow-md !h-[60px]",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle className="text-right">
            {mode === "edit" ? "ویرایش اطلاعات خودرو" : "افزودن خودرو جدید"}
          </DialogTitle>
        </DialogHeader>

        <form dir="rtl" onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                شماره ردیف
              </label>
              <input
                type="number"
                {...register("RowNo")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                مدل ماشین
              </label>
              <input
                type="text"
                {...register("CarModel", { required: "مدل ماشین الزامی است" })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              {errors.CarModel && (
                <p className="text-red-500 text-xs">
                  {errors.CarModel.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                شماره شاسی
              </label>
              <input
                type="text"
                {...register("ChassisNo", {
                  required: "شماره شاسی الزامی است",
                })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              {errors.ChassisNo && (
                <p className="text-red-500 text-xs">
                  {errors.ChassisNo.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">پلاک</label>
              <input
                type="text"
                {...register("LicensePlate")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                مبلغ فروش
              </label>
              <input
                type="number"
                {...register("SaleAmount")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                مبلغ خرید
              </label>
              <input
                type="number"
                {...register("PurchaseAmount")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                نام فروشنده
              </label>
              <input
                type="text"
                {...register("SellerName")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                کد ملی فروشنده
              </label>
              <input
                type="text"
                {...register("SellerNationalID")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                موبایل فروشنده
              </label>
              <input
                type="text"
                {...register("SellerMobile")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                نام خریدار
              </label>
              <input
                type="text"
                {...register("BuyerName")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                کد ملی خریدار
              </label>
              <input
                type="text"
                {...register("BuyerNationalID")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                موبایل خریدار
              </label>
              <input
                type="text"
                {...register("BuyerMobile")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                تاریخ فروش
              </label>
              <input
                type="text"
                {...register("SaleDate")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                تاریخ خرید
              </label>
              <input
                type="text"
                {...register("PurchaseDate")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                کارگزار خرید
              </label>
              <input
                type="text"
                {...register("PurchaseBroker")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                کارگزار فروش
              </label>
              <input
                type="text"
                {...register("SaleBroker")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">منشی</label>
              <input
                type="text"
                {...register("Secretary")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                کپی مدارک
              </label>
              <input
                type="text"
                {...register("DocumentsCopy")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
            >
              {mode === "edit" ? "ذخیره تغییرات" : "ثبت اطلاعات"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleFormModal;
