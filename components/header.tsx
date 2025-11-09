"use client";
import { useGetCarByChassisNo } from "@/apis/mutations/cars";
import {
  useGetDetailByChassisNo,
  useGetOperatorPercent,
} from "@/apis/mutations/detailsByChassisNo";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetAllChassisNo from "@/hooks/useGetAllChassisNo";
import { setChassisNo, setTotalVehicleCost } from "@/redux/slices/carSlice";
import { RootState } from "@/redux/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const Header = () => {
  const { totalVehicleCost, chassisNo: chassisNoSaved } = useSelector(
    (state: RootState) => state.cars
  );
  const [selectedChassis, setSelectedChassis] =
    React.useState<string>(chassisNoSaved);
  const [carInfo, setCarInfo] = React.useState<ICarRes | null>(null);
  const [operatorPercent, setOperatorPercent] =
    React.useState<IOperatorPercent | null>(null);
  const [totalVehicleCostAmount, setTotalVehicleCostAmount] = React.useState<
    number | null
  >(null);

  const { data: chassisNo } = useGetAllChassisNo();
  const getCarByChassisNo = useGetCarByChassisNo();
  const getOperatorPercent = useGetOperatorPercent();
  const getDetailByChassisNo = useGetDetailByChassisNo();
  const dispatch = useDispatch();

  const handleSelectChassis = async (chassisNo: string) => {
    setSelectedChassis(chassisNo);
    dispatch(setChassisNo(chassisNo));
    try {
      const res = await getCarByChassisNo.mutateAsync(chassisNo);
      const percents = await getOperatorPercent.mutateAsync();
      setOperatorPercent(percents);
      setCarInfo(res);
    } catch (error) {
      console.log("🚀 ~ handleSelectChassis ~ error:", error);
      setCarInfo(null);
    }
  };

  const normalize = (str?: string) =>
    str ? str.trim().toLowerCase().replace(/\s+/g, " ") : "";

  const buyPercentObj = operatorPercent?.data?.find(
    (item) => normalize(item.name) === normalize(carInfo?.PurchaseBroker)
  );
  const sellPercentObj = operatorPercent?.data?.find(
    (item) => normalize(item.name) === normalize(carInfo?.SaleBroker)
  );

  const buyPercent = buyPercentObj?.buyPercent ?? 0;
  const sellPercent = sellPercentObj?.sellPercent ?? 0;

  let grossProfit: number | null = null;
  let netProfit: number | null = null;
  let buyAmountWithPercent: number | null = null;
  let sellAmountWithPercent: number | null = null;

  if (carInfo?.PurchaseAmount && carInfo?.SaleAmount) {
    grossProfit = carInfo.PurchaseAmount - carInfo.SaleAmount;
    const amountWithoutPercent =
      grossProfit - (totalVehicleCostAmount ?? totalVehicleCost);

    buyAmountWithPercent = amountWithoutPercent * (buyPercent / 100);
    sellAmountWithPercent = amountWithoutPercent * (sellPercent / 100);

    const sumAmounts =
      buyAmountWithPercent +
      sellAmountWithPercent +
      (totalVehicleCostAmount ?? totalVehicleCost);

    netProfit = grossProfit - sumAmounts;
  }

  const handleCarDetailDataByChassisNoData = async (chassisNo: string) => {
    if (!chassisNo) return;
    try {
      const details = await getDetailByChassisNo.mutateAsync(chassisNo);

      const paidTransactions = details?.transactions?.filter(
        (t) => t.TransactionType === "پرداخت"
      );

      const totalVehicleCost = paidTransactions
        ?.filter(
          (item) =>
            item?.TransactionReason?.replace(/\s/g, "").includes(
              "هزینهوسیله"
            ) ||
            item?.TransactionReason?.replace(/\s/g, "").includes("هزينهوسیله")
        )
        ?.reduce((sum, item) => sum + (item.TransactionAmount || 0), 0);

      dispatch(setTotalVehicleCost(totalVehicleCost));
      setTotalVehicleCostAmount(totalVehicleCost);
    } catch (error) {
      console.log("🚀 ~ handleSelectChassis ~ error:", error);
      setTotalVehicleCostAmount(null);
    }
  };

  React.useEffect(() => {
    const initialChassis = selectedChassis || chassisNoSaved;
    if (initialChassis) {
      handleSelectChassis(initialChassis);
    }
  }, [chassisNoSaved]);

  React.useEffect(() => {
    handleCarDetailDataByChassisNoData(chassisNoSaved);
  }, [chassisNoSaved]);

  return (
    <div className="border border-b-2 border-gray-300 rounded flex flex-col gap-2 p-4 pb-2.5 relative">
      <div className="grid grid-cols-9 gap-3 auto-rows-min items-start justify-start place-items-stretch">
        <div className="flex flex-col justify-between h-full space-y-1">
          <h3 className="text-sm font-bold mb-2 text-blue-900">شاسی:</h3>
          <Select onValueChange={handleSelectChassis} value={chassisNoSaved}>
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
        <div className="flex flex-col justify-between h-full space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">مدل وسیله نقلیه</h3>
          <h4 className="text-sm">{carInfo?.CarModel ?? "—"}</h4>
          <span className="text-xs text-green-600">
            {carInfo?.LicensePlate ?? "—"}
          </span>
        </div>
        <div className="flex flex-col justify-between h-full space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">
            {"مبلغ فروش(خرید شما):"}
          </h3>
          <h4 className="text-sm">
            {carInfo?.SaleAmount?.toLocaleString("en-US") ?? "—"}
          </h4>
          <span className="text-sm text-blue-500">
            {carInfo?.SaleDate ?? "—"}
          </span>
        </div>
        <div className="flex flex-col justify-between h-full space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">
            {"مبلغ خرید(فروش شما):"}
          </h3>
          <h4 className="text-sm">
            {carInfo?.PurchaseAmount?.toLocaleString("en-US") ?? "—"}
          </h4>
          <span className="text-sm text-blue-500">
            {carInfo?.PurchaseDate ?? "—"}
          </span>
        </div>
        <div className="flex flex-col justify-between h-full space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">سود:</h3>
          <p className="text-sm text-green-700">
            ناخالص:{" "}
            <strong className="line-through text-black text-sm">
              {/* {carInfo ? carInfo.SaleAmount - carInfo.PurchaseAmount : "—"} */}
              {grossProfit?.toLocaleString("en-US") ?? "—"}
            </strong>
          </p>
          <p className="text-sm text-green-700">
            خالص:{" "}
            <strong className="text-black text-sm">
              {/* {carInfo ? carInfo.SaleAmount - carInfo.PurchaseAmount : "—"} */}
              {netProfit?.toLocaleString("en-US") ?? "—"}
            </strong>
          </p>
        </div>
        <div className="flex flex-col justify-between h-full space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">
            کارگزار خرید:{" "}
            <span className="text-green-700 text-xs">{buyPercent}/ %</span>
          </h3>
          <p className="text-sm">{carInfo?.PurchaseBroker ?? "-"}</p>
          <p className="text-sm text-green-700 font-bold">
            {buyAmountWithPercent?.toLocaleString("en-US") ?? "—"}
          </p>
        </div>
        <div className="flex flex-col justify-between h-full space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">
            کارگزار فروش:{" "}
            <span className="text-green-700 text-xs">{sellPercent}/ %</span>
          </h3>
          <p className="text-sm">{carInfo?.SaleBroker ?? "-"}</p>
          <p className="text-sm text-green-700 font-bold">
            {sellAmountWithPercent?.toLocaleString("en-US") ?? "—"}
          </p>
        </div>
        <div className="flex flex-col justify-between h-full space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">
            فروشنده: <span></span>
          </h3>
          <p className="text-sm">{carInfo?.SellerName ?? "-"}</p>
          <p className="text-sm text-orange-500">
            {carInfo?.SellerMobile ?? "-"}
          </p>
        </div>
        <div className="flex flex-col justify-between h-full space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">
            خریدار: <span></span>
          </h3>
          <p className="text-sm">{carInfo?.BuyerName ?? "-"}</p>
          <p className="text-sm text-orange-500">
            {carInfo?.BuyerMobile ?? "-"}
          </p>
        </div>
      </div>
      <hr />
      <div className="grid grid-cols-4 gap-8 items-center justify-start place-items-stretch">
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
          <p className="text-sm text-orange-800">
            {totalVehicleCostAmount?.toLocaleString("en-US") ??
              totalVehicleCost?.toLocaleString("en-US") ??
              "—"}
          </p>
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
