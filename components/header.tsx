"use client";
import SearchableSelect from "@/components/ui/searchable-select";
import useGetVehicles from "@/hooks/useGetVehicle";
import useGetAllPeople from "@/hooks/useGetAllPeople";
import { setChassisNo, setSelectedDealId } from "@/redux/slices/carSlice";
import { RootState } from "@/redux/store";
import {
  IDeal,
  IPeople,
  IOptions,
} from "@/types/new-backend-types";
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
import { useLogout } from "@/apis/mutations/auth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatPrice } from "@/utils/systemConstants";
import OptionList from "./modals/optionList";
import {
  setNetProfit,
  setTotalCommissionPurchase,
  setTotalCommissionSale,
} from "@/redux/slices/transactionSlice";
import { useVehicleFinancialStatus } from "@/hooks/useVehicleFinancialStatus";
import useGetProfit from "@/hooks/useGetProfit";
import {
  deleteAccessToken,
  deleteCustomerSlug,
  getCustomerSlug,
} from "@/utils/session";

const Header = () => {
  const { chassisNo: chassisNoSaved } = useSelector(
    (state: RootState) => state.cars,
  );
  // const { peopleStatus } = useSelector((state: RootState) => state.transaction);
  const router = useRouter();
  const logout = useLogout();
  const queryClient = useQueryClient();
  const customerSlug = getCustomerSlug();

  const { data: vehicles } = useGetVehicles();
  const { data: allPeople } = useGetAllPeople();
  const vin = vehicles?.map((vehicle) => vehicle.vin);

  // const dealsData = getDealsByVin.data;
  // const allDeals = React.useMemo(() => {
  //   if (!dealsData) return [];
  //   if (Array.isArray(dealsData)) return dealsData;
  //   return [dealsData];
  // }, [dealsData]);

  const [selectedDeal, setSelectedDeal] = React.useState<IDeal | null>(null);
  const [showDealModal, setShowDealModal] = React.useState(false);
  const [buyerInfo, setBuyerInfo] = React.useState<IPeople | null>(null);
  const [sellerInfo, setSellerInfo] = React.useState<IPeople | null>(null);
  const [isOpenOptionList, setIsOpenOptionList] = React.useState(false);

  const { peopleStatus } = useVehicleFinancialStatus();
  const {
    buyAmountWithPercent,
    deal,
    lastGrossProfit,
    lastNetProfit,
    sellAmountWithPercent,
    totalOptionsDeals,
    totalOtherCosts,
    allDeals,
    lastNetProfitAfterPartner,
    partnerTotalShare,
  } = useGetProfit();

  // React.useEffect(() => {
  //   if (allDeals.length === 1) {
  //     setSelectedDeal(allDeals[0]);
  //     setShowDealModal(false);
  //   } else if (allDeals.length > 1) {
  //     if (!selectedDeal) {
  //       setShowDealModal(true);
  //     }
  //   } else {
  //     setSelectedDeal(null);
  //   }
  // }, [allDeals, selectedDeal]);

  // const deals = selectedDeal || allDeals[0] || null;

  // const dealId = deal?._id?.toString();
  // const getTransactionByDealId = useGetTransactionByDealId(dealId);
  // const transactions = getTransactionByDealId.data || [];

  // const getChequesByDealId = useGetChequesByDealId(dealId);
  // const cheques: IChequeNew[] = Array.isArray(getChequesByDealId.data)
  //   ? getChequesByDealId.data
  //   : [];

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

  const logoutHandler = async () => {
    try {
      await logout.mutateAsync();

      queryClient.clear();
      deleteAccessToken();
      deleteCustomerSlug();

      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }

      toast.success("با موفقیت خارج شدید");
      router.replace(`/${customerSlug}`);
    } catch (error) {
      console.error("Logout error:", error);
      queryClient.clear();
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }
      router.replace(`/${customerSlug}`);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // const otherCostCategories =
  //   deals?.directCosts?.otherCost?.map((cost) => cost.category) || [];
  // const otherCostsFromDirectCosts =
  //   deals?.directCosts?.otherCost?.reduce(
  //     (sum, cost) => sum + (cost.cost || 0),
  //     0,
  //   ) || 0;
  // const otherCostsFromTransactions =
  //   transactions
  //     ?.filter(
  //       (t) =>
  //         t.type === "پرداخت" &&
  //         otherCostCategories.some((category) => t.reason === category),
  //     )
  //     .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

  // const otherOptionsTransaction =
  //   transactions
  //     .filter((el) => el.reason === "سایر هزینه‌ها")
  //     .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

  // const totalOtherCosts =
  //   otherCostsFromDirectCosts +
  //   otherCostsFromTransactions +
  //   otherOptionsTransaction;

  // const totalOptionsDeals =
  //   deals?.directCosts?.options?.reduce(
  //     (sum, cost) => sum + (Number(cost.cost) || 0),
  //     0,
  //   ) || 0;

  // let lastGrossProfit: number | null = null;
  // if (deals?.purchasePrice && deals?.salePrice) {
  //   lastGrossProfit = (deals?.salePrice ?? 0) - (deals?.purchasePrice ?? 0);
  // }

  // let halfProfit: number | null = null;
  // halfProfit =
  //   (lastGrossProfit || 0) -
  //   totalOptionsDeals -
  //   // sellAmountWithPercent -
  //   // buyAmountWithPercent -
  //   totalOtherCosts;

  // let grossProfit: number | null = null;
  // if (deals?.purchasePrice || deals?.salePrice) {
  //   grossProfit = (deals.salePrice ?? 0) - (deals.purchasePrice ?? 0);
  // }

  // let buyAmountWithPercent: number | null = null;
  // let sellAmountWithPercent: number | null = null;

  // const buyAmountWithoutPercent = (deals?.purchasePrice ?? 0) - totalOtherCosts;
  // const sellAmountWithoutPercent = (deals?.salePrice ?? 0) - totalOtherCosts;

  // const isLastCalculate = process.env.NEXT_PUBLIC_PROFIT_CALCULATE;

  // if (isLastCalculate) {
  //   buyAmountWithPercent =
  //     (buyAmountWithoutPercent *
  //       parseFloat(String(deals?.purchaseBroker?.commissionPercent || 0))) /
  //     100;

  //   sellAmountWithPercent =
  //     (sellAmountWithoutPercent *
  //       parseFloat(String(deals?.saleBroker?.commissionPercent || 0))) /
  //     100;
  // } else {
  //   buyAmountWithPercent =
  //     (halfProfit *
  //       parseFloat(String(deals?.purchaseBroker?.commissionPercent || 0))) /
  //     100;
  //   sellAmountWithPercent =
  //     (halfProfit *
  //       parseFloat(String(deals?.saleBroker?.commissionPercent || 0))) /
  //     100;
  // }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // const buyPercent = deals?.purchaseBroker?.commissionPercent
  //   ? parseFloat(String(deals.purchaseBroker.commissionPercent)) * 100
  //   : 0;
  // console.log("🚀 ~ Header ~ deals:", deals);
  // const sellPercent = deals?.saleBroker?.commissionPercent
  //   ? parseFloat(String(deals.saleBroker.commissionPercent)) * 100
  //   : 0;

  // console.log("🚀 ~ Header ~ grossProfit:", grossProfit)
  // if (grossProfit !== null) {
  //   const amountWithoutPercent = grossProfit - totalOtherCosts;
  //   buyAmountWithPercent =
  //     (amountWithoutPercent *
  //       parseFloat(String(deals?.purchaseBroker?.commissionPercent || 0))) /
  //     100;
  //   sellAmountWithPercent =
  //     (amountWithoutPercent *
  //       parseFloat(String(deals?.saleBroker?.commissionPercent || 0))) /
  //     100;
  // }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // if (deals?.salePrice == null) {
  //   const amountWithoutPercent = (deals?.purchasePrice ?? 0) - totalOtherCosts;
  //   buyAmountWithPercent =
  //     (amountWithoutPercent *
  //       parseFloat(String(deals?.purchaseBroker?.commissionPercent || 0))) /
  //     100;
  // }

  // let netProfit: number | null = null;
  // if (grossProfit !== null) {
  //   const totalBrokerCommissions =
  //     (buyAmountWithPercent || 0) + (sellAmountWithPercent || 0);
  //   netProfit = grossProfit - (totalOtherCosts + totalBrokerCommissions);
  // }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // let lastNetProfit: number | null = null;
  // if (lastGrossProfit !== null && deals?.salePrice) {
  //   const totalBrokerCommissions =
  //     (buyAmountWithPercent || 0) + (sellAmountWithPercent || 0);
  //   lastNetProfit =
  //     lastGrossProfit - (totalOtherCosts + totalBrokerCommissions);
  // }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // if (isLastCalculate) {
  //   if (lastGrossProfit !== null && deals?.salePrice) {
  //     lastNetProfit =
  //       lastGrossProfit -
  //       totalOtherCosts -
  //       sellAmountWithPercent -
  //       buyAmountWithPercent -
  //       totalOptionsDeals;
  //   }
  // } else {
  //   if (lastGrossProfit !== null && deals?.salePrice) {
  //     lastNetProfit = halfProfit - buyAmountWithPercent - sellAmountWithPercent;
  //   }
  // }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  React.useEffect(() => {
    dispatch(setNetProfit(lastNetProfit || 0));
  }, [chassisNoSaved, lastNetProfit]);

  // const isChequePaid = (cheque: IChequeNew): boolean => {
  //   const paidStatuses = [
  //     "paid",
  //     "پاس شده",
  //     "وصول شده",
  //     "پاس شده است",
  //     "خرج شده",
  //   ];
  //   return paidStatuses.some((status) =>
  //     cheque.status?.toLowerCase().includes(status.toLowerCase()),
  //   );
  // };

  // const isIssuedCheque = (cheque: IChequeNew): boolean => {
  //   return (
  //     cheque.type === "issued" ||
  //     cheque.type === "صادره" ||
  //     cheque.type?.toLowerCase().includes("issued") ||
  //     cheque.type?.toLowerCase().includes("صادره")
  //   );
  // };

  // const isReceivedCheque = (cheque: IChequeNew): boolean => {
  //   return (
  //     cheque.type === "received" ||
  //     cheque.type === "وارده" ||
  //     cheque.type?.toLowerCase().includes("received") ||
  //     cheque.type?.toLowerCase().includes("وارده")
  //   );
  // };

  // const paymentsToSeller =
  //   transactions
  //     ?.filter(
  //       (t) =>
  //         t.type === "پرداخت" &&
  //         (t.reason === "خرید خودرو" || t.reason?.includes("خرید")),
  //     )
  //     .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

  // transactions
  //   ?.filter(
  //     (t) =>
  //       t.type === "پرداخت" &&
  //       (t.reason === "خرید خودرو" ||
  //         t.reason?.includes("خريد") ||
  //         t.reason?.includes("خرید")),
  //   )
  //   .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
  // const issuedPaidCheques =
  //   cheques
  //     ?.filter(
  //       (c) =>
  //         isIssuedCheque(c) &&
  //         isChequePaid(c) &&
  //         c.payee?.personId?.toString() === deals?.seller?.personId?.toString(),
  //     )
  //     .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;
  // const totalPaidToSeller = paymentsToSeller + issuedPaidCheques;
  // const sellerSettlementAmount = deals?.purchasePrice || 0;
  // const SETTLEMENT_TOLERANCE = 10000;
  // const sellerSettlementStatus = React.useMemo(() => {
  //   if (!deals?.purchasePrice) return "—";
  //   const diff = Math.abs(totalPaidToSeller - sellerSettlementAmount);
  //   console.log("🚀 ~ Header ~ diff:", diff);
  //   if (diff < SETTLEMENT_TOLERANCE) return "تسویه شده";
  //   console.log("🚀 ~ Header ~ totalPaidToSeller:", totalPaidToSeller);
  //   return totalPaidToSeller > sellerSettlementAmount ? "بدهکار" : "بستانکار";
  // }, [totalPaidToSeller, sellerSettlementAmount, deals?.purchasePrice]);

  // const sellerSettlementStatus = React.useMemo(() => {
  //   if (!deals?.purchasePrice) return "—";

  //   const diff = totalPaidToSeller - sellerSettlementAmount;

  //   if (Math.abs(diff) < SETTLEMENT_TOLERANCE) return "تسویه شده";

  //   return diff > 0 ? "بستانکار" : "بدهکار";
  // }, [totalPaidToSeller, sellerSettlementAmount, deals?.purchasePrice]);

  // const receiptsFromBuyer =
  //   transactions
  //     ?.filter(
  //       (t) =>
  //         t.type === "دریافت" &&
  //         (t.reason === "فروش خودرو" || t.reason?.includes("فروش")),
  //     )
  //     .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

  // const receivedPaidCheques =
  //   cheques
  //     ?.filter(
  //       (c) =>
  //         isReceivedCheque(c) &&
  //         isChequePaid(c) &&
  //         c.payer?.personId?.toString() === deals?.buyer?.personId?.toString(),
  //     )
  //     .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;
  // const totalReceivedFromBuyer = receiptsFromBuyer + receivedPaidCheques;
  // const buyerSettlementAmount = deals?.salePrice || 0;
  // const buyerSettlementStatus = React.useMemo(() => {
  //   if (!deals?.salePrice) return "—";
  //   const diff = Math.abs(totalReceivedFromBuyer - buyerSettlementAmount);
  //   if (diff < SETTLEMENT_TOLERANCE) return "تسویه شده";
  //   return totalReceivedFromBuyer < buyerSettlementAmount
  //     ? "بدهکار"
  //     : "بستانکار";
  // }, [totalReceivedFromBuyer, buyerSettlementAmount, deals?.salePrice]);

  // const buyerSettlementStatus = React.useMemo(() => {
  //   if (!deals?.salePrice) return "—";

  //   const diff = totalReceivedFromBuyer - buyerSettlementAmount;

  //   if (Math.abs(diff) < SETTLEMENT_TOLERANCE) return "تسویه شده";

  //   return diff > 0 ? "بستانکار" : "بدهکار";
  // }, [totalReceivedFromBuyer, buyerSettlementAmount, deals?.salePrice]);

  React.useEffect(() => {
    if (!deal) {
      setSellerInfo(null);
      setBuyerInfo(null);
      return;
    }

    setSellerInfo(
      allPeople?.find(
        (person) => person._id?.toString() === deal.seller?.personId,
      ) ?? null,
    );
    setBuyerInfo(
      allPeople?.find(
        (person) => person._id?.toString() === deal.buyer?.personId,
      ) ?? null,
    );
  }, [deal, allPeople]);

  React.useEffect(() => {
    dispatch(
      setTotalCommissionPurchase({
        totalCommissionPurchase: buyAmountWithPercent || 0,
        totalCommissionPurchasePercent:
          deal?.purchaseBroker?.commissionPercent || 0,
      }),
    );
  }, [buyAmountWithPercent, deal?.purchaseBroker?.commissionPercent]);

  React.useEffect(() => {
    dispatch(
      setTotalCommissionSale({
        totalCommissionSale: sellAmountWithPercent || 0,
        totalCommissionSalePercent: deal?.saleBroker?.commissionPercent || 0,
      }),
    );
  }, [sellAmountWithPercent, deal?.saleBroker?.commissionPercent]);

  const isCarExist = deal?.buyer ? "فروخته شد" : deal?.seller ? "موجود" : "-";

  return (
    <div className="border border-b-2 border-gray-300 rounded flex flex-col gap-2 p-4 pb-2.5 relative">
      <div className="grid grid-cols-10 gap-3 auto-rows-min items-start justify-start place-items-stretch">
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
            {allDeals?.length && allDeals?.length > 1 && (
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
          <h4 className="text-sm">{deal?.vehicleSnapshot?.model ?? "—"}</h4>
          <span className="text-xs text-green-600">
            {deal?.vehicleSnapshot?.plateNumber ?? "—"}
          </span>
        </div>
        <div className="flex flex-col justify-between h-full space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">مبلغ خرید</h3>
          <h4 className="text-sm">
            {formatPrice(deal?.purchasePrice?.toLocaleString("en-US")) ?? "—"}
          </h4>
          <span className="text-sm text-blue-500">
            {deal?.purchaseDate ?? "—"}
          </span>
        </div>
        <div className="flex flex-col justify-between h-full space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">مبلغ فروش</h3>
          <h4 className="text-sm">
            {formatPrice(deal?.salePrice?.toLocaleString("en-US")) ?? "—"}
          </h4>
          <span className="text-sm text-blue-500">{deal?.saleDate ?? "—"}</span>
        </div>
        <div
          onClick={() => setIsOpenOptionList(true)}
          className="flex flex-col gap-2 items-start text-sm cursor-pointer"
        >
          <p className="text-sm text-blue-800 font-bold">مجموع آپشن ها:</p>
          <p className="text-sm text-orange-800">
            {formatPrice(totalOptionsDeals.toLocaleString("en-US")) ?? "—"}
          </p>
        </div>
        <div className="flex flex-col gap-2 items-start text-sm">
          <p className="text-sm text-blue-800 font-bold">مجموع هزینه ها:</p>
          <p className="text-sm text-orange-800">
            {formatPrice(totalOtherCosts.toLocaleString("en-US")) ?? "—"}
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
              {deal?.purchaseBroker?.commissionPercent &&
                deal?.purchaseBroker?.commissionPercent > 0
                ? `${deal?.purchaseBroker?.commissionPercent}%`
                : "0%"}
            </span>
          </h3>
          <p className="text-sm">{deal?.purchaseBroker?.fullName ?? "-"}</p>
          <p dir="ltr" className="text-sm text-green-700 font-bold text-right">
            {lastNetProfit === null && lastGrossProfit === null ? "__" : formatPrice(buyAmountWithPercent?.toLocaleString("en-US")) ?? "—"}
          </p>
        </div>
        <div className="flex flex-col justify-between h-full space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">
            کارگزار فروش:{" "}
            <span className="text-green-700 text-xs">
              {deal?.saleBroker?.commissionPercent &&
                deal?.saleBroker?.commissionPercent > 0
                ? `${deal?.saleBroker?.commissionPercent}%`
                : "0%"}
            </span>
          </h3>
          <p className="text-sm">{deal?.saleBroker?.fullName ?? "-"}</p>
          <p dir="ltr" className="text-sm text-green-700 font-bold text-right">
            {formatPrice(sellAmountWithPercent?.toLocaleString("en-US")) ?? "—"}
          </p>
        </div>
        <div className="flex flex-col justify-between h-full space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">
            طرف اول: <span></span>
          </h3>
          <p className="text-sm">
            {deal?.seller?.personId
              ? sellerInfo?.firstName || sellerInfo?.lastName
                ? `${sellerInfo?.firstName} ${sellerInfo?.lastName}`
                : (sellerInfo?.fullName ?? deal?.seller?.fullName ?? "-")
              : "—"}
          </p>
          <p className="text-sm text-orange-500">
            {deal?.seller?.personId
              ? (sellerInfo?.phoneNumbers?.map((el) => el) ??
                deal?.seller?.mobile ??
                "-")
              : "—"}
          </p>
        </div>
        <div className="flex flex-col justify-between h-full space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">
            طرف دوم: <span></span>
          </h3>
          <p className="text-sm">
            {deal?.buyer?.personId
              ? buyerInfo?.firstName || buyerInfo?.lastName
                ? `${buyerInfo?.firstName} ${buyerInfo?.lastName}`
                : (buyerInfo?.fullName ?? deal?.buyer?.fullName ?? "-")
              : "—"}
          </p>
          <p className="text-sm text-orange-500">
            {deal?.buyer?.personId
              ? (buyerInfo?.phoneNumbers?.map((el) => el) ??
                deal?.buyer?.mobile ??
                "-")
              : "—"}
          </p>
        </div>
      </div>
      <hr />
      <div className="grid grid-cols-5 gap-4 xl:gap-8 items-center justify-start place-items-stretch">
        <div className="flex gap-2 items-right items-baseline text-sm">
          <p className="text-sm">وضعیت خودرو:</p>
          <p
            className={`px-7 rounded py-1 text-sm ${deal?.buyer
              ? "bg-red-400 text-white"
              : deal?.seller
                ? "bg-green-400 text-red-900"
                : "bg-yellow-400 text-red-900"
              }`}
          >
            {isCarExist}
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
        <p className="text-sm text-green-700 w-fit">
          سود ناخالص:{" "}
          <strong dir="ltr" className="line-through text-black text-sm">
            {/* {carInfo ? carInfo.SaleAmount - carInfo.PurchaseAmount : "—"} */}
            {formatPrice(lastGrossProfit?.toLocaleString("en-US")) ?? "—"}
          </strong>
        </p>
        <p className="text-sm text-green-700">
          سود خالص:{" "}
          {/* <strong dir="ltr" className="text-black text-sm"> */}
          {/* {carInfo ? carInfo.SaleAmount - carInfo.PurchaseAmount : "—"} */}
          {/* {formatPrice(lastNetProfit?.toLocaleString("en-US")) ?? "—"}
            {lastNetProfitAfterPartner && `(${lastNetProfitAfterPartner})`}
          </strong> */}
          <strong dir="ltr" className="text-black text-sm">
            <strong dir="ltr" className={`${lastNetProfitAfterPartner != null ? "line-through" : ""} text-black text-sm`}>
              {formatPrice(lastNetProfit?.toLocaleString("en-US")) ?? "—"}{" "}
            </strong>
            {lastNetProfitAfterPartner != null ? (
              <>
                {" "} {`(${formatPrice(lastNetProfitAfterPartner.toLocaleString("en-US"))})`}
                {/* {partnerTotalShare > 0 && (
                  <span className="text-xs text-red-600 mr-2">
                    (سهم شرکا: {formatPrice(partnerTotalShare.toLocaleString("en-US"))})
                  </span>
                )} */}
              </>
            ) : (
              "—"
            )}
          </strong>
        </p>
        {/* </div> */}
        <div className="flex gap-2 items-right items-baseline text-sm">
          <p className="text-sm text-blue-800 w-full whitespace-nowrap">
            وضعیت مالی با طرف اول:
          </p>
          <p
            className={`px-7 rounded py-1 text-sm whitespace-nowrap ${peopleStatus?.firstParty === "تسویه شده"
              ? "bg-green-400 text-green-900"
              : peopleStatus?.firstParty === "بدهکار"
                ? "bg-red-400 text-red-900"
                : peopleStatus?.firstParty === "بستانکار"
                  ? "bg-yellow-400 text-yellow-900"
                  : "bg-gray-200 text-gray-600"
              }`}
          >
            {/* {sellerSettlementStatus} */}
            {peopleStatus?.firstParty}
          </p>
        </div>

        <div className="flex gap-2 items-right items-baseline text-sm">
          <p className="text-sm text-blue-800 w-full whitespace-nowrap">
            وضعیت مالی با طرف دوم:
          </p>
          <p
            className={`px-7 rounded py-1 text-sm whitespace-nowrap ${isCarExist === "موجود" &&
              peopleStatus?.secondParty === "تسویه شده"
              ? "bg-gray-100"
              : peopleStatus?.secondParty === "تسویه شده"
                ? "bg-green-400 text-green-900"
                : peopleStatus?.secondParty === "بستانکار"
                  ? "bg-yellow-400 text-yellow-900"
                  : peopleStatus?.secondParty === "بدهکار"
                    ? "bg-red-400 text-red-900"
                    : "bg-gray-200 text-gray-600"
              }`}
          >
            {/* {buyerSettlementStatus} */}
            {isCarExist === "موجود" && peopleStatus?.secondParty === "تسویه شده"
              ? "-"
              : peopleStatus?.secondParty}
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
              انتخاب معامله ({allDeals?.length} معامله یافت شد)
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
                  {(allDeals || [])?.map((deal) => (
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
            {allDeals?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                معامله‌ای یافت نشد
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isOpenOptionList} onOpenChange={setIsOpenOptionList}>
        <DialogContent className="max-w-5xl mb-5">
          <DialogClose onClose={() => setIsOpenOptionList(false)} />
          <DialogHeader>
            <DialogTitle className="text-right text-lg font-semibold my-3 mb-8">
              لیست آپشن ها{" "}
            </DialogTitle>
          </DialogHeader>
          <OptionList
            options={deal?.directCosts?.options as IOptions[]}
            dealId={deal?._id ?? ""}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
