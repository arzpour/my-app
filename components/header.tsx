"use client";
import SearchableSelect from "@/components/ui/searchable-select";
import useGetDealsByVin from "@/hooks/useGetDealsByVin";
import useGetVehicles from "@/hooks/useGetVehicle";
import useGetTransactionByDealId from "@/hooks/useGetTransactionByDealId";
import useGetChequesByDealId from "@/hooks/useGetChequesByDealId";
import { setChassisNo, setSelectedDealId } from "@/redux/slices/carSlice";
import { RootState } from "@/redux/store";
import { IDeal, IChequeNew } from "@/types/new-backend-types";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { LucideLogOut, SettingsIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const Header = () => {
  const { chassisNo: chassisNoSaved } = useSelector(
    (state: RootState) => state.cars
  );
  const router = useRouter();

  const { data: vehicles } = useGetVehicles();

  const vin = vehicles?.map((vehicle) => vehicle.vin);

  const getDealsByVin = useGetDealsByVin(chassisNoSaved);

  const dealsData = getDealsByVin.data;
  const allDeals = React.useMemo(() => {
    if (!dealsData) return [];
    if (Array.isArray(dealsData)) return dealsData;
    return [dealsData];
  }, [dealsData]);

  const [selectedDeal, setSelectedDeal] = React.useState<IDeal | null>(null);
  const [showDealModal, setShowDealModal] = React.useState(false);

  React.useEffect(() => {
    if (allDeals.length === 1) {
      setSelectedDeal(allDeals[0]);
      setShowDealModal(false);
    } else if (allDeals.length > 1) {
      if (!selectedDeal) {
        setShowDealModal(true);
      }
    } else {
      setSelectedDeal(null);
    }
  }, [allDeals, selectedDeal]);

  const deals = selectedDeal || allDeals[0] || null;

  const dealId = deals?._id?.toString();
  const getTransactionByDealId = useGetTransactionByDealId(dealId);
  const transactions = getTransactionByDealId.data || [];

  const getChequesByDealId = useGetChequesByDealId(dealId);
  const cheques: IChequeNew[] = Array.isArray(getChequesByDealId.data)
    ? getChequesByDealId.data
    : [];

  const dispatch = useDispatch();

  const handleSelectChassis = async (vin: string) => {
    dispatch(setChassisNo(vin));
    setSelectedDeal(null);
  };

  const handleSelectDeal = (deal: IDeal) => {
    setSelectedDeal(deal);
    setShowDealModal(false);
    dispatch(setChassisNo(deal.vehicleSnapshot.vin));
    dispatch(setSelectedDealId(deal._id.toString()));
  };

  const logoutHandler = () => {
    router.push("/");
  };

  const otherCostCategories =
    deals?.directCosts?.otherCost?.map((cost) => cost.category) || [];
  const otherCostsFromDirectCosts =
    deals?.directCosts?.otherCost?.reduce(
      (sum, cost) => sum + (cost.cost || 0),
      0
    ) || 0;
  const otherCostsFromTransactions =
    transactions
      ?.filter(
        (t) =>
          t.type === "پرداخت" &&
          otherCostCategories.some((category) => t.reason === category)
      )
      .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
  const totalOtherCosts =
    otherCostsFromDirectCosts + otherCostsFromTransactions;

  let grossProfit: number | null = null;
  if (deals?.purchasePrice && deals?.salePrice) {
    grossProfit = deals.salePrice - deals.purchasePrice;
  }

  let buyAmountWithPercent: number | null = null;
  let sellAmountWithPercent: number | null = null;
  const buyPercent = deals?.purchaseBroker?.commissionPercent
    ? parseFloat(String(deals.purchaseBroker.commissionPercent)) * 100
    : 0;
  const sellPercent = deals?.saleBroker?.commissionPercent
    ? parseFloat(String(deals.saleBroker.commissionPercent)) * 100
    : 0;

  if (grossProfit !== null) {
    const amountWithoutPercent = grossProfit - totalOtherCosts;
    buyAmountWithPercent =
      amountWithoutPercent *
      parseFloat(String(deals?.purchaseBroker?.commissionPercent || 0));
    sellAmountWithPercent =
      amountWithoutPercent *
      parseFloat(String(deals?.saleBroker?.commissionPercent || 0));
  }

  let netProfit: number | null = null;
  if (grossProfit !== null) {
    const totalBrokerCommissions =
      (buyAmountWithPercent || 0) + (sellAmountWithPercent || 0);
    netProfit = grossProfit - (totalOtherCosts + totalBrokerCommissions);
  }

  const isChequePaid = (cheque: IChequeNew): boolean => {
    const paidStatuses = ["paid", "پاس شده", "وصول شده", "پاس شده است"];
    return paidStatuses.some((status) =>
      cheque.status?.toLowerCase().includes(status.toLowerCase())
    );
  };

  const isIssuedCheque = (cheque: IChequeNew): boolean => {
    return (
      cheque.type === "issued" ||
      cheque.type === "صادره" ||
      cheque.type?.toLowerCase().includes("issued") ||
      cheque.type?.toLowerCase().includes("صادره")
    );
  };

  const isReceivedCheque = (cheque: IChequeNew): boolean => {
    return (
      cheque.type === "received" ||
      cheque.type === "وارده" ||
      cheque.type?.toLowerCase().includes("received") ||
      cheque.type?.toLowerCase().includes("وارده")
    );
  };

  const sellerPersonId = deals?.seller?.personId?.toString();
  const paymentsToSeller =
    transactions
      ?.filter(
        (t) => t.type === "پرداخت" && t.personId?.toString() === sellerPersonId
      )
      .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
  const issuedPaidCheques =
    cheques
      ?.filter(
        (c) =>
          isIssuedCheque(c) &&
          isChequePaid(c) &&
          c.payee?.personId?.toString() === sellerPersonId
      )
      .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;
  const totalPaidToSeller = paymentsToSeller + issuedPaidCheques;
  const sellerSettlementAmount = deals?.purchasePrice || 0;
  const sellerSettlementStatus = React.useMemo(() => {
    if (!deals?.purchasePrice) return "—";
    const diff = Math.abs(totalPaidToSeller - sellerSettlementAmount);
    if (diff < 0.01) return "تسویه شده";
    return totalPaidToSeller < sellerSettlementAmount ? "بدهکار" : "بستانکار";
  }, [totalPaidToSeller, sellerSettlementAmount, deals?.purchasePrice]);

  const buyerPersonId = deals?.buyer?.personId?.toString();
  const receiptsFromBuyer =
    transactions
      ?.filter(
        (t) => t.type === "دریافت" && t.personId?.toString() === buyerPersonId
      )
      .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
  const receivedPaidCheques =
    cheques
      ?.filter(
        (c) =>
          isReceivedCheque(c) &&
          isChequePaid(c) &&
          c.payer?.personId?.toString() === buyerPersonId
      )
      .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;
  const totalReceivedFromBuyer = receiptsFromBuyer + receivedPaidCheques;
  const buyerSettlementAmount = deals?.salePrice || 0;
  const buyerSettlementStatus = React.useMemo(() => {
    if (!deals?.salePrice) return "—";
    const diff = Math.abs(totalReceivedFromBuyer - buyerSettlementAmount);
    if (diff < 0.01) return "تسویه شده";
    return totalReceivedFromBuyer < buyerSettlementAmount
      ? "بستانکار"
      : "بدهکار";
  }, [totalReceivedFromBuyer, buyerSettlementAmount, deals?.salePrice]);

  return (
    <div className="border border-b-2 border-gray-300 rounded flex flex-col gap-2 p-4 pb-2.5 relative">
      <div className="grid grid-cols-9 gap-3 auto-rows-min items-start justify-start place-items-stretch">
        <div className="flex flex-col justify-between h-full space-y-1">
          <h3 className="text-sm font-bold mb-2 text-blue-900">شاسی:</h3>
          <div className="flex gap-2 items-center">
            <SearchableSelect
              value={chassisNoSaved}
              onValueChange={(vin) => handleSelectChassis(vin)}
              options={vin ?? []}
              placeholder="انتخاب شاسی"
              className="w-[120px] text-sm"
              searchPlaceholder="جستجوی شماره شاسی..."
            />
            {allDeals.length > 1 && (
              <button
                title="انتخاب معامله"
                onClick={() => setShowDealModal(true)}
              >
                <SettingsIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-between h-full space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">مدل وسیله نقلیه</h3>
          <h4 className="text-sm">{deals?.vehicleSnapshot?.model ?? "—"}</h4>
          <span className="text-xs text-green-600">
            {deals?.vehicleSnapshot?.plateNumber ?? "—"}
          </span>
        </div>
        <div className="flex flex-col justify-between h-full space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">مبلغ خرید</h3>
          <h4 className="text-sm">
            {deals?.purchasePrice?.toLocaleString("en-US") ?? "—"}
          </h4>
          <span className="text-sm text-blue-500">
            {deals?.purchaseDate ?? "—"}
          </span>
        </div>
        <div className="flex flex-col justify-between h-full space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">مبلغ فروش</h3>
          <h4 className="text-sm">
            {deals?.salePrice?.toLocaleString("en-US") ?? "—"}
          </h4>
          <span className="text-sm text-blue-500">
            {deals?.saleDate ?? "—"}
          </span>
        </div>
        <div className="flex flex-col gap-2 items-right items-center text-sm">
          <p className="text-sm text-blue-800">مجموع هزینه ها:</p>
          <p className="text-sm text-orange-800">
            {totalOtherCosts.toLocaleString("en-US")}
          </p>
        </div>
        {/* <div className="flex flex-col justify-between h-full space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">سود:</h3>
          <p className="text-sm text-green-700">
            ناخالص:{" "}
            <strong className="line-through text-black text-sm"> */}
        {/* {carInfo ? carInfo.SaleAmount - carInfo.PurchaseAmount : "—"} */}
        {/* {grossProfit?.toLocaleString("en-US") ?? "—"}
            </strong>
          </p>
          <p className="text-sm text-green-700">
            خالص:{" "}
            <strong className="text-black text-sm"> */}
        {/* {carInfo ? carInfo.SaleAmount - carInfo.PurchaseAmount : "—"} */}
        {/* {netProfit?.toLocaleString("en-US") ?? "—"}
            </strong>
          </p>
        </div> */}
        <div className="flex flex-col justify-between h-full space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">
            کارگزار خرید:{" "}
            <span className="text-green-700 text-xs">
              {buyPercent > 0 ? `${buyPercent.toFixed(2)}%` : "0%"}
            </span>
          </h3>
          <p className="text-sm">{deals?.purchaseBroker?.fullName ?? "-"}</p>
          <p className="text-sm text-green-700 font-bold">
            {buyAmountWithPercent?.toLocaleString("en-US") ?? "—"}
          </p>
        </div>
        <div className="flex flex-col justify-between h-full space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">
            کارگزار فروش:{" "}
            <span className="text-green-700 text-xs">
              {sellPercent > 0 ? `${sellPercent.toFixed(2)}%` : "0%"}
            </span>
          </h3>
          <p className="text-sm">{deals?.saleBroker?.fullName ?? "-"}</p>
          <p className="text-sm text-green-700 font-bold">
            {sellAmountWithPercent?.toLocaleString("en-US") ?? "—"}
          </p>
        </div>
        <div className="flex flex-col justify-between h-full space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">
            طرف اول: <span></span>
          </h3>
          <p className="text-sm">{deals?.seller?.fullName ?? "-"}</p>
          <p className="text-sm text-orange-500">
            {deals?.seller?.mobile ?? "-"}
          </p>
        </div>
        <div className="flex flex-col justify-between h-full space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">
            طرف دوم: <span></span>
          </h3>
          <p className="text-sm">{deals?.buyer?.fullName ?? "-"}</p>
          <p className="text-sm text-orange-500">
            {deals?.buyer?.mobile ?? "-"}
          </p>
        </div>
      </div>
      <hr />
      <div className="grid grid-cols-5 gap-8 items-center justify-start place-items-stretch">
        <div className="flex gap-2 items-right items-baseline text-sm">
          <p className="text-sm">وضعیت خودرو:</p>
          <p className="px-7 bg-green-400 text-red-900 rounded py-1 text-sm">
            فروخته شد
          </p>
        </div>
        {/* <div className="flex gap-2 items-right items-center text-sm">
          <p className="text-sm text-blue-800">سایر هزینه ها:</p>
          <p className="text-sm text-purple-700">هزینه وسیله</p>
        </div> */}
        {/* <div className="flex flex-col justify-between h-full space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">سود:</h3>
          <p className="text-sm text-green-700">
            ناخالص:{" "}
            <strong className="line-through text-black text-sm"> */}
        {/* {carInfo ? carInfo.SaleAmount - carInfo.PurchaseAmount : "—"} */}
        {/* {grossProfit?.toLocaleString("en-US") ?? "—"}
            </strong>
          </p>
          <p className="text-sm text-green-700">
            خالص:{" "}
            <strong className="text-black text-sm"> */}
        {/* {carInfo ? carInfo.SaleAmount - carInfo.PurchaseAmount : "—"} */}
        {/* {netProfit?.toLocaleString("en-US") ?? "—"}
            </strong>
          </p>
        </div> */}

        {/* <div className="flex gap-4 justify-between h-full space-y-1"> */}
        {/* <h3 className="text-sm text-blue-900 font-bold">سود:</h3> */}
        <p className="text-sm text-green-700">
          سود ناخالص:{" "}
          <strong className="line-through text-black text-sm">
            {/* {carInfo ? carInfo.SaleAmount - carInfo.PurchaseAmount : "—"} */}
            {grossProfit?.toLocaleString("en-US") ?? "—"}
          </strong>
        </p>
        <p className="text-sm text-green-700">
          سود خالص:{" "}
          <strong className="text-black text-sm">
            {/* {carInfo ? carInfo.SaleAmount - carInfo.PurchaseAmount : "—"} */}
            {netProfit?.toLocaleString("en-US") ?? "—"}
          </strong>
        </p>
        {/* </div> */}
        <div className="flex gap-2 items-right items-baseline text-sm">
          <p className="text-sm text-blue-800">وضعیت تسویه حساب با طرف اول:</p>
          <p
            className={`px-7 rounded py-1 text-sm ${
              sellerSettlementStatus === "تسویه شده"
                ? "bg-green-400 text-green-900"
                : sellerSettlementStatus === "بدهکار"
                ? "bg-red-400 text-red-900"
                : sellerSettlementStatus === "بستانکار"
                ? "bg-yellow-400 text-yellow-900"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {sellerSettlementStatus}
          </p>
        </div>

        <div className="flex gap-2 items-right items-baseline text-sm">
          <p className="text-sm text-blue-800">وضعیت تسویه حساب با طرف دوم:</p>
          <p
            className={`px-7 rounded py-1 text-sm ${
              buyerSettlementStatus === "تسویه شده"
                ? "bg-green-400 text-green-900"
                : buyerSettlementStatus === "بستانکار"
                ? "bg-yellow-400 text-yellow-900"
                : buyerSettlementStatus === "بدهکار"
                ? "bg-red-400 text-red-900"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {buyerSettlementStatus}
          </p>
        </div>
      </div>
      <p className="absolute right-2 -top-6 bg-white py-2 px-4 font-bold">
        اطلاعات خودرو
      </p>
      <button
        title="خروج"
        className="absolute left-2 -top-4 cursor-pointer bg-white py-2 px-4"
        onClick={logoutHandler}
      >
        <LucideLogOut className="w-5 h-5" />
      </button>

      {/* Deal Selection Modal */}
      <Dialog open={showDealModal} onOpenChange={setShowDealModal}>
        <DialogContent className="max-w-5xl">
          <DialogClose onClose={() => setShowDealModal(false)} />
          <DialogHeader>
            <DialogTitle className="text-right text-base font-medium">
              انتخاب معامله ({allDeals.length} معامله یافت شد)
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" dir="rtl">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="border p-3 text-right text-sm font-medium text-gray-700">
                      طرف اول
                    </th>
                    <th className="border p-3 text-right text-sm font-medium text-gray-700">
                      طرف دوم
                    </th>
                    <th className="border p-3 text-right text-sm font-medium text-gray-700">
                      پلاک
                    </th>
                    <th className="border p-3 text-right text-sm font-medium text-gray-700">
                      تاریخ خرید
                    </th>
                    <th className="border p-3 text-right text-sm font-medium text-gray-700">
                      تاریخ فروش
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allDeals.map((deal) => (
                    <tr
                      key={deal._id.toString()}
                      onClick={() => handleSelectDeal(deal)}
                      className="cursor-pointer hover:bg-blue-50 transition-colors border-b"
                    >
                      <td className="border p-3 text-sm text-right">
                        {deal.seller?.fullName || "—"}
                      </td>
                      <td className="border p-3 text-sm text-right">
                        {deal.buyer?.fullName || "—"}
                      </td>
                      <td className="border p-3 text-sm text-right font-medium text-blue-600">
                        {deal.vehicleSnapshot?.plateNumber || "—"}
                      </td>
                      <td className="border p-3 text-sm text-right">
                        {deal.purchaseDate || "—"}
                      </td>
                      <td className="border p-3 text-sm text-right">
                        {deal.saleDate || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {allDeals.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                معامله‌ای یافت نشد
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
