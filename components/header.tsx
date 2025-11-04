"use client";
import { useGetCarByChassisNo } from "@/apis/mutations/cars";
import { useGetOperatorPercent } from "@/apis/mutations/detailsByChassisNo";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetAllChassisNo from "@/hooks/useGetAllChassisNo";
import { setChassisNo } from "@/redux/slices/carSlice";
import { RootState } from "@/redux/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const Header = () => {
  const { chassisNo: chassisNoSaved } = useSelector(
    (state: RootState) => state.cars
  );
  const [selectedChassis, setSelectedChassis] =
    React.useState<string>(chassisNoSaved);
  const [carInfo, setCarInfo] = React.useState<ICarRes | null>(null);
  console.log("🚀 ~ Header ~ carInfo:", carInfo);
  const [operatorPercent, setOperatorPercent] =
    React.useState<IOperatorPercent | null>(null);
  console.log("🚀 ~ Header ~ operatorPercent:", operatorPercent);

  const { data: chassisNo } = useGetAllChassisNo();
  const getCarByChassisNo = useGetCarByChassisNo();
  const getOperatorPercent = useGetOperatorPercent();
  const dispatch = useDispatch();

  const handleSelectChassis = async (chassisNo: string) => {
    setSelectedChassis(chassisNo);
    dispatch(setChassisNo(chassisNo));
    try {
      const res = await getCarByChassisNo.mutateAsync(chassisNo);
      const percents = await getOperatorPercent.mutateAsync();
      console.log("🚀 ~ handleSelectChassis ~ percents:", percents);
      setOperatorPercent(percents);
      setCarInfo(res);
    } catch (error) {
      console.log("🚀 ~ handleSelectChassis ~ error:", error);
      setCarInfo(null);
    }
  };

  const normalize = (str?: string) =>
    str ? str.trim().toLowerCase().replace(/\s+/g, " ") : "";

  const buyPercentObj = operatorPercent?.data.find(
    (item) => normalize(item.name) === normalize(carInfo?.PurchaseBroker)
  );
  const sellPercentObj = operatorPercent?.data.find(
    (item) => normalize(item.name) === normalize(carInfo?.SaleBroker)
  );

  const buyPercent = buyPercentObj?.buyPercent ?? 0;
  const sellPercent = sellPercentObj?.sellPercent ?? 0;

  const purchaseAmount = carInfo?.PurchaseAmount ?? 0;
  const saleAmount = carInfo?.SaleAmount ?? 0;

  const purchaseBrokerCost = (purchaseAmount * buyPercent) / 100;
  const saleBrokerCost = (saleAmount * sellPercent) / 100;

  const grossProfit = saleAmount - purchaseAmount;
  const netProfit = grossProfit - purchaseBrokerCost - saleBrokerCost;
  const totalCost = purchaseBrokerCost + saleBrokerCost;

  React.useEffect(() => {
    const initialChassis = selectedChassis || chassisNoSaved;
    if (initialChassis) {
      handleSelectChassis(initialChassis);
    }
  }, [chassisNoSaved]);

  return (
    <div className="border border-b-2 border-gray-300 rounded flex flex-col gap-2 p-4 pb-2.5 relative">
      <div className="grid grid-cols-9 gap-3 items-start justify-start">
        <div className="space-y-1">
          <h3 className="text-sm font-bold mb-2 text-blue-900">
            شاسی:
          </h3>
          <Select onValueChange={handleSelectChassis} value={selectedChassis}>
            <SelectTrigger className="w-[120px] text-sm">
              <SelectValue placeholder="انتخاب شاسی" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {(chassisNo ?? []).map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">مدل وسیله نقلیه</h3>
          <h4 className="text-sm">{carInfo?.CarModel ?? "—"}</h4>
          <span className="text-xs text-green-600">
            {carInfo?.LicensePlate ?? "—"}
          </span>
        </div>
        <div>
          <h3 className="text-sm text-blue-900 font-bold">
            {":مبلغ فروش(خرید شما)"}
          </h3>
          <h4 className="text-sm">{carInfo?.SaleAmount ?? "—"}</h4>
          <span className="text-sm text-blue-500">
            {carInfo?.SaleDate ?? "—"}
          </span>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">
            {":مبلغ خرید(فروش شما)"}
          </h3>
          <h4 className="text-sm">{carInfo?.PurchaseAmount ?? "—"}</h4>
          <span className="text-sm text-blue-500">
            {carInfo?.PurchaseDate ?? "—"}
          </span>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">سود:</h3>
          <p className="text-sm text-green-700">
            ناخالص:{" "}
            <strong className="line-through text-black">
              {/* {carInfo ? carInfo.SaleAmount - carInfo.PurchaseAmount : "—"} */}
              {grossProfit ?? "—"}
            </strong>
          </p>
          <p className="text-sm text-green-700">
            خالص:{" "}
            <strong className="text-black">
              {/* {carInfo ? carInfo.SaleAmount - carInfo.PurchaseAmount : "—"} */}
              {netProfit ?? "—"}
            </strong>
          </p>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">
            کارگزار خرید:{" "}
            <span className="text-green-700">
              {carInfo?.PurchaseBroker ?? "-"}
            </span>
          </h3>
          <p className="text-sm">بهادر شامل</p>
          <p className="text-sm text-green-700 font-bold">
            {carInfo ? carInfo.PurchaseAmount : "—"}
          </p>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">
            کارگزار فروش:{" "}
            <span className="text-green-700">{carInfo?.SaleBroker ?? "-"}</span>
          </h3>
          <p className="text-sm">بهادر شامل</p>
          <p className="text-sm text-green-700 font-bold">
            {carInfo ? carInfo.SaleAmount : "—"}
          </p>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">
            فروشنده: <span>{sellPercent}/ %</span>
          </h3>
          <p className="text-sm">{carInfo?.SellerName ?? "-"}</p>
          <p className="text-sm text-orange-500">
            {carInfo?.SellerMobile ?? "-"}
          </p>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">
            خریدار: <span>{buyPercent}/ %</span>
          </h3>
          <p className="text-sm">{carInfo?.BuyerName ?? "-"}</p>
          <p className="text-sm text-orange-500">
            {carInfo?.BuyerMobile ?? "-"}
          </p>
        </div>
      </div>
      <hr />
      <div className="grid grid-cols-4 gap-8 items-start justify-start">
        <div className="flex gap-2 items-right items-baseline text-sm">
          <p className="text-sm">وضعیت خودرو:</p>
          <p className="px-7 bg-green-400 text-red-900 rounded py-1 text-sm">
            فروخته شد
          </p>
        </div>
        <div className="flex gap-2 items-right items-center text-sm">
          <p className="text-sm text-blue-800">سایر هزینه ها:</p>
          <p className="text-sm text-purple-700">هزینه وسیله</p>
        </div>
        <div className="flex gap-2 items-right items-center text-sm">
          <p className="text-sm text-blue-800">مجموع هزینه ها:</p>
          <p className="text-sm text-orange-800">{totalCost ?? "—"}</p>
        </div>
        <div className="flex gap-2 items-right items-baseline text-sm">
          <p className="text-blue-800">وضعیت تسویه حساب:</p>
          <p className="px-7 bg-green-400 rounded py-1 text-sm">تسویه کامل</p>
        </div>
      </div>
      <p className="absolute right-2 -top-6 bg-white py-2 px-4 font-bold">
        اطلاعات خودرو
      </p>
    </div>
  );
};

export default Header;
