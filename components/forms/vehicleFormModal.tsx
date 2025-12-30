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
import { createVehicle, updateVehicle } from "@/apis/client/vehicles";
import { useQueryClient } from "@tanstack/react-query";
import PersianDatePicker from "../global/persianDatePicker";
import { IVehicle, IDeal } from "@/types/new-backend-types";
import { useGetAllDeals } from "@/apis/mutations/deals";

interface VehicleFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleData?: ICarRes | IVehicle | null;
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
  const getAllDeals = useGetAllDeals();

  const isIVehicle = (data: any): data is IVehicle => {
    return data && "vin" in data && "model" in data;
  };

  const isICarRes = (data: any): data is ICarRes => {
    return data && "ChassisNo" in data && "CarModel" in data;
  };

  const relatedDeal = React.useMemo(() => {
    if (!vehicleData || !isIVehicle(vehicleData) || !getAllDeals.data) {
      return null;
    }
    const deals = getAllDeals.data || [];
    return deals.find((deal) => deal.vehicleSnapshot?.vin === vehicleData.vin);
  }, [vehicleData, getAllDeals.data]);

  const convertVehicleToCarRes = React.useMemo(() => {
    if (!vehicleData) return null;

    if (isICarRes(vehicleData)) {
      return vehicleData;
    }

    if (isIVehicle(vehicleData)) {
      if (relatedDeal) {
        return {
          _id: vehicleData._id.toString(),
          RowNo: 0,
          CarModel: vehicleData.model || "",
          SaleAmount: relatedDeal.salePrice || 0,
          PurchaseAmount: relatedDeal.purchasePrice || 0,
          LicensePlate: vehicleData.plateNumber || "",
          ChassisNo: vehicleData.vin || "",
          SellerName: relatedDeal.seller?.fullName || "",
          BuyerName: relatedDeal.buyer?.fullName || "",
          SaleDate: relatedDeal.saleDate || "",
          PurchaseDate: relatedDeal.purchaseDate || "",
          SellerMobile: parseInt(relatedDeal.seller?.mobile || "0") || 0,
          BuyerMobile: parseInt(relatedDeal.buyer?.mobile || "0") || 0,
          PurchaseBroker: relatedDeal.purchaseBroker?.fullName || "",
          SaleBroker: relatedDeal.saleBroker?.fullName || "",
          Secretary: "",
          DocumentsCopy: "",
          SellerNationalID: parseInt(relatedDeal.seller?.nationalId || "0") || 0,
          BuyerNationalID: parseInt(relatedDeal.buyer?.nationalId || "0") || 0,
        } as ICarRes;
      } else {
        return {
          _id: vehicleData._id.toString(),
          RowNo: 0,
          CarModel: vehicleData.model || "",
          SaleAmount: 0,
          PurchaseAmount: 0,
          LicensePlate: vehicleData.plateNumber || "",
          ChassisNo: vehicleData.vin || "",
          SellerName: "",
          BuyerName: "",
          SaleDate: "",
          PurchaseDate: "",
          SellerMobile: 0,
          BuyerMobile: 0,
          PurchaseBroker: "",
          SaleBroker: "",
          Secretary: "",
          DocumentsCopy: "",
          SellerNationalID: 0,
          BuyerNationalID: 0,
        } as ICarRes;
      }
    }

    return null;
  }, [vehicleData, relatedDeal]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm<VehicleFormData>({
    defaultValues: convertVehicleToCarRes
      ? {
        RowNo: convertVehicleToCarRes.RowNo || "",
        CarModel: convertVehicleToCarRes.CarModel || "",
        SaleAmount: convertVehicleToCarRes.SaleAmount || "",
        PurchaseAmount: convertVehicleToCarRes.PurchaseAmount || "",
        LicensePlate: convertVehicleToCarRes.LicensePlate || "",
        ChassisNo: convertVehicleToCarRes.ChassisNo || "",
        SellerName: convertVehicleToCarRes.SellerName || "",
        BuyerName: convertVehicleToCarRes.BuyerName || "",
        SaleDate: convertVehicleToCarRes.SaleDate || "",
        PurchaseDate: convertVehicleToCarRes.PurchaseDate || "",
        SellerMobile: convertVehicleToCarRes.SellerMobile || "",
        BuyerMobile: convertVehicleToCarRes.BuyerMobile || "",
        PurchaseBroker: convertVehicleToCarRes.PurchaseBroker || "",
        SaleBroker: convertVehicleToCarRes.SaleBroker || "",
        Secretary: convertVehicleToCarRes.Secretary || "",
        DocumentsCopy: convertVehicleToCarRes.DocumentsCopy || "",
        SellerNationalID: convertVehicleToCarRes.SellerNationalID || "",
        BuyerNationalID: convertVehicleToCarRes.BuyerNationalID || "",
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
    if (open && mode === "edit" && isIVehicle(vehicleData)) {
      if (!getAllDeals.data) {
        getAllDeals.mutate();
      }
    }
  }, [open, mode, vehicleData, getAllDeals.data]);

  React.useEffect(() => {
    if (mode === "edit") {
      if (convertVehicleToCarRes) {
        reset({
          RowNo: convertVehicleToCarRes.RowNo || "",
          CarModel: convertVehicleToCarRes.CarModel || "",
          SaleAmount: convertVehicleToCarRes.SaleAmount || "",
          PurchaseAmount: convertVehicleToCarRes.PurchaseAmount || "",
          LicensePlate: convertVehicleToCarRes.LicensePlate || "",
          ChassisNo: convertVehicleToCarRes.ChassisNo || "",
          SellerName: convertVehicleToCarRes.SellerName || "",
          BuyerName: convertVehicleToCarRes.BuyerName || "",
          SaleDate: convertVehicleToCarRes.SaleDate || "",
          PurchaseDate: convertVehicleToCarRes.PurchaseDate || "",
          SellerMobile: convertVehicleToCarRes.SellerMobile || "",
          BuyerMobile: convertVehicleToCarRes.BuyerMobile || "",
          PurchaseBroker: convertVehicleToCarRes.PurchaseBroker || "",
          SaleBroker: convertVehicleToCarRes.SaleBroker || "",
          Secretary: convertVehicleToCarRes.Secretary || "",
          DocumentsCopy: convertVehicleToCarRes.DocumentsCopy || "",
          SellerNationalID: convertVehicleToCarRes.SellerNationalID || "",
          BuyerNationalID: convertVehicleToCarRes.BuyerNationalID || "",
        });
      } else if (isIVehicle(vehicleData)) {
        reset({
          RowNo: "",
          CarModel: vehicleData.model || "",
          SaleAmount: "",
          PurchaseAmount: "",
          LicensePlate: vehicleData.plateNumber || "",
          ChassisNo: vehicleData.vin || "",
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
  }, [convertVehicleToCarRes, mode, reset, vehicleData]);

  const onSubmit: SubmitHandler<VehicleFormData> = async (data) => {
    try {
      const vehiclePayload: Partial<IVehicle> = {
        vin: data.ChassisNo || "",
        model: data.CarModel || "",
        plateNumber: data.LicensePlate || "",
        ...(mode === "edit" && isIVehicle(vehicleData)
          ? {
            productionYear: vehicleData.productionYear,
            color: vehicleData.color || "",
          }
          : {
            color: "",
          }),
      };

      if (mode === "edit" && vehicleData?._id) {
        const vehicleId = isIVehicle(vehicleData)
          ? vehicleData._id.toString()
          : vehicleData._id;
        await updateVehicle(vehicleId, vehiclePayload);
        toast("اطلاعات با موفقیت به‌روزرسانی شد", {
          icon: "✅",
          className: "!bg-green-100 !text-green-800 !shadow-md !h-[60px]",
        });
      } else {
        await createVehicle(vehiclePayload);
        toast("اطلاعات با موفقیت ثبت شد", {
          icon: "✅",
          className: "!bg-green-100 !text-green-800 !shadow-md !h-[60px]",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["get-all-vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["get-deals"] });
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

        <form
          dir="rtl"
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 space-y-4"
        >
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
              {/* <input
                type="text"
                {...register("SaleDate")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              /> */}
              <PersianDatePicker
                value={getValues().SaleDate}
                onChange={(date: string) => setValue("SaleDate", date)}
                placeholder="تاریخ فروش"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                تاریخ خرید
              </label>
              {/* <input
                type="text"
                {...register("PurchaseDate")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              /> */}
              <PersianDatePicker
                value={getValues().PurchaseDate}
                onChange={(date: string) => setValue("PurchaseDate", date)}
                placeholder="تاریخ خرید"
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
