import { useMemo } from "react";
import useGetDealsByVin from "@/hooks/useGetDealsByVin";
import useGetTransactionByDealId from "@/hooks/useGetTransactionByDealId";
import { IDeal, ITransactionNew } from "@/types/new-backend-types";

interface ProfitResult {
  netProfit: number | null;
  lastNetProfit: number | null;
  totalOtherCosts: number;
  totalOptionsDeals: number;
  grossProfit: number | null;
  lastGrossProfit: number | null;
  isLoading: boolean;
}

const useCalculateVehicleProfit = (vin: string | undefined): ProfitResult => {
  const { data: dealsData, isLoading: isDealsLoading } = useGetDealsByVin(
    vin || "",
  );

  const selectedDeal: IDeal | undefined = useMemo(() => {
    if (!dealsData) return undefined;
    const deals = Array.isArray(dealsData) ? dealsData : [dealsData];
    return deals.length > 0 ? deals[0] : undefined;
  }, [dealsData]);

  const dealId = selectedDeal?._id?.toString();

  const { data: transactionsData, isLoading: isTransactionsLoading } =
    useGetTransactionByDealId(dealId);

  const transactions: ITransactionNew[] = transactionsData || [];

  if (isDealsLoading || isTransactionsLoading || !selectedDeal) {
    return {
      netProfit: null,
      lastNetProfit: null,
      totalOtherCosts: 0,
      totalOptionsDeals: 0,
      grossProfit: null,
      lastGrossProfit: null,
      isLoading: true,
    };
  }

  const otherCostCategories =
    selectedDeal.directCosts?.otherCost?.map((cost) => cost.category) || [];

  const otherCostsFromDirectCosts =
    selectedDeal.directCosts?.otherCost?.reduce(
      (sum, cost) => sum + (cost.cost || 0),
      0,
    ) || 0;

  const otherCostsFromTransactions =
    (transactions ?? [])
      ?.filter(
        (t) =>
          t.type === "پرداخت" &&
          otherCostCategories.some((category) => t.reason === category),
      )
      .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

  const otherOptionsTransaction =
    transactions
      ?.filter((el) => el.reason === "سایر هزینه‌ها")
      .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

  const totalOtherCosts =
    otherCostsFromDirectCosts +
    otherCostsFromTransactions +
    otherOptionsTransaction;

  const totalOptionsDeals =
    selectedDeal.directCosts?.options?.reduce(
      (sum, cost) => sum + (Number(cost.cost) || 0),
      0,
    ) || 0;

  let lastGrossProfit: number | null = null;
  if (selectedDeal.purchasePrice != null && selectedDeal.salePrice != null) {
    lastGrossProfit = selectedDeal.salePrice - selectedDeal.purchasePrice;
  }

  let halfProfit: number | null = null;
  halfProfit = (lastGrossProfit || 0) - totalOptionsDeals - totalOtherCosts;

  let grossProfit: number | null = null;
  if (selectedDeal.purchasePrice != null || selectedDeal.salePrice != null) {
    grossProfit =
      (selectedDeal.salePrice ?? 0) - (selectedDeal.purchasePrice ?? 0);
  }

  let buyAmountWithPercent: number | null = null;
  let sellAmountWithPercent: number | null = null;

  const buyAmountWithoutPercent =
    (selectedDeal.purchasePrice ?? 0) - totalOtherCosts;
  const sellAmountWithoutPercent =
    (selectedDeal.salePrice ?? 0) - totalOtherCosts;

  const isLastCalculate = process.env.NEXT_PUBLIC_PROFIT_CALCULATE;

  if (isLastCalculate) {
    buyAmountWithPercent =
      (buyAmountWithoutPercent *
        parseFloat(
          String(selectedDeal.purchaseBroker?.commissionPercent || 0),
        )) /
      100;
    sellAmountWithPercent =
      (sellAmountWithoutPercent *
        parseFloat(String(selectedDeal.saleBroker?.commissionPercent || 0))) /
      100;
  } else {
    buyAmountWithPercent =
      ((halfProfit || 0) *
        parseFloat(
          String(selectedDeal.purchaseBroker?.commissionPercent || 0),
        )) /
      100;
    sellAmountWithPercent =
      ((halfProfit || 0) *
        parseFloat(String(selectedDeal.saleBroker?.commissionPercent || 0))) /
      100;
  }

  if (selectedDeal.salePrice == null) {
    const amountWithoutPercent =
      (selectedDeal.purchasePrice ?? 0) - totalOtherCosts;
    buyAmountWithPercent =
      (amountWithoutPercent *
        parseFloat(
          String(selectedDeal.purchaseBroker?.commissionPercent || 0),
        )) /
      100;
  }

  let netProfit: number | null = null;
  if (grossProfit !== null) {
    const totalBrokerCommissions =
      (buyAmountWithPercent || 0) + (sellAmountWithPercent || 0);
    netProfit = grossProfit - (totalOtherCosts + totalBrokerCommissions);
  }

  let lastNetProfit: number | null = null;
  if (isLastCalculate) {
    if (lastGrossProfit !== null && selectedDeal.salePrice != null) {
      lastNetProfit =
        lastGrossProfit -
        totalOtherCosts -
        sellAmountWithPercent -
        buyAmountWithPercent -
        totalOptionsDeals;
    }
  } else {
    if (lastGrossProfit !== null && selectedDeal.salePrice != null) {
      lastNetProfit = halfProfit - buyAmountWithPercent - sellAmountWithPercent;
    }
  }

  return {
    netProfit,
    lastNetProfit,
    totalOtherCosts,
    totalOptionsDeals,
    grossProfit,
    lastGrossProfit,
    isLoading: false,
  };
};

export default useCalculateVehicleProfit;
