// import { IDeal, ITransactionNew } from "@/types/new-backend-types";

// interface IUseGetProfit {
//   deals: IDeal | undefined;
//   transactions: ITransactionNew[] | undefined;
// }

// const useGetProfit = ({ deals, transactions }: IUseGetProfit) => {
//   const otherCostCategories =
//     deals?.directCosts?.otherCost?.map((cost) => cost.category) || [];
//   const otherCostsFromDirectCosts =
//     deals?.directCosts?.otherCost?.reduce(
//       (sum, cost) => sum + (cost.cost || 0),
//       0,
//     ) || 0;
//   const otherCostsFromTransactions =
//     (transactions ?? [])
//       ?.filter(
//         (t) =>
//           t.type === "پرداخت" &&
//           otherCostCategories.some((category) => t.reason === category),
//       )
//       .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

//   const otherOptionsTransaction =
//     transactions
//       ?.filter((el) => el.reason === "سایر هزینه‌ها")
//       .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

//   const totalOtherCosts =
//     otherCostsFromDirectCosts +
//     otherCostsFromTransactions +
//     otherOptionsTransaction;

//   const totalOptionsDeals =
//     deals?.directCosts?.options?.reduce(
//       (sum, cost) => sum + (Number(cost.cost) || 0),
//       0,
//     ) || 0;

//   let lastGrossProfit: number | null = null;
//   if (deals?.purchasePrice && deals?.salePrice) {
//     lastGrossProfit = (deals?.salePrice ?? 0) - (deals?.purchasePrice ?? 0);
//   }

//   let halfProfit: number | null = null;
//   halfProfit = (lastGrossProfit || 0) - totalOptionsDeals - totalOtherCosts;

//   let grossProfit: number | null = null;
//   if (deals?.purchasePrice || deals?.salePrice) {
//     grossProfit = (deals.salePrice ?? 0) - (deals.purchasePrice ?? 0);
//   }

//   let buyAmountWithPercent: number | null = null;
//   let sellAmountWithPercent: number | null = null;

//   const buyAmountWithoutPercent = (deals?.purchasePrice ?? 0) - totalOtherCosts;
//   const sellAmountWithoutPercent = (deals?.salePrice ?? 0) - totalOtherCosts;

//   const isLastCalculate = process.env.NEXT_PUBLIC_PROFIT_CALCULATE;

//   if (isLastCalculate) {
//     buyAmountWithPercent =
//       (buyAmountWithoutPercent *
//         parseFloat(String(deals?.purchaseBroker?.commissionPercent || 0))) /
//       100;

//     sellAmountWithPercent =
//       (sellAmountWithoutPercent *
//         parseFloat(String(deals?.saleBroker?.commissionPercent || 0))) /
//       100;
//   } else {
//     buyAmountWithPercent =
//       (halfProfit *
//         parseFloat(String(deals?.purchaseBroker?.commissionPercent || 0))) /
//       100;
//     sellAmountWithPercent =
//       (halfProfit *
//         parseFloat(String(deals?.saleBroker?.commissionPercent || 0))) /
//       100;
//   }

//   if (deals?.salePrice == null) {
//     const amountWithoutPercent = (deals?.purchasePrice ?? 0) - totalOtherCosts;
//     buyAmountWithPercent =
//       (amountWithoutPercent *
//         parseFloat(String(deals?.purchaseBroker?.commissionPercent || 0))) /
//       100;
//   }

//   let netProfit: number | null = null;
//   if (grossProfit !== null) {
//     const totalBrokerCommissions =
//       (buyAmountWithPercent || 0) + (sellAmountWithPercent || 0);
//     netProfit = grossProfit - (totalOtherCosts + totalBrokerCommissions);
//   }

//   let lastNetProfit: number | null = null;

//   if (isLastCalculate) {
//     if (lastGrossProfit !== null && deals?.salePrice) {
//       lastNetProfit =
//         lastGrossProfit -
//         totalOtherCosts -
//         sellAmountWithPercent -
//         buyAmountWithPercent -
//         totalOptionsDeals;
//     }
//   } else {
//     if (lastGrossProfit !== null && deals?.salePrice) {
//       lastNetProfit = halfProfit - buyAmountWithPercent - sellAmountWithPercent;
//     }
//   }

//   return {
//     lastNetProfit,
//     netProfit,
//     buyAmountWithPercent,
//     sellAmountWithPercent,
//     halfProfit,
//     totalOtherCosts,
//     totalOptionsDeals,
//     lastGrossProfit,
//     grossProfit,
//   };
// };

// export default useGetProfit;

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { IDeal, ITransactionNew } from "@/types/new-backend-types";
import useGetDealsByVin from "@/hooks/useGetDealsByVin";
import useGetTransactionByDealId from "@/hooks/useGetTransactionByDealId";
import React from "react";

const useGetProfit = () => {
  const { chassisNo } = useSelector((state: RootState) => state.cars);

  const { data: dealsData, isLoading: isDealsLoading } =
    useGetDealsByVin(chassisNo);

  const allDeals: IDeal[] = React.useMemo(() => {
    if (!dealsData) return [];
    if (Array.isArray(dealsData)) return dealsData;
    return [dealsData];
  }, [dealsData]);

  const selectedDeal = allDeals.length > 0 ? allDeals[0] : undefined;
  const dealId = selectedDeal?._id?.toString();
  console.log("🚀 ~ useGetProfit ~ selectedDeal:", selectedDeal)

  const { data: transactionsData } = useGetTransactionByDealId(dealId);
  const transactions: ITransactionNew[] = transactionsData || [];

  if (isDealsLoading || !selectedDeal) {
    return {
      lastNetProfit: null,
      netProfit: null,
      buyAmountWithPercent: null,
      sellAmountWithPercent: null,
      halfProfit: null,
      totalOtherCosts: 0,
      totalOptionsDeals: 0,
      lastGrossProfit: null,
      grossProfit: null,
      isLoading: true,
      deal: selectedDeal,
      transactions,
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

  // let lastNetProfitAfterPartner
  // // if(selectedDeal.)
  // const partnerExistsTransactions = transactions?.filter(t => !!t.partnerPersonId && t.partnerPersonId !== "")
  // console.log("🚀 ~ useGetProfit ~ partnerExistsTransactions:", partnerExistsTransactions)

  // lastNetProfitAfterPartner = partnerExistsTransactions.map(p => (((lastNetProfit || 0) - Number(p.partnershipProfitSharePercentage)) / 100))



    // --- PARTNER CALCULATION FIX ---
  
  // 1. Filter transactions that have a partner
  const partnerTransactions = transactions?.filter(
    (t) => !!t.partnerPersonId && t.partnerPersonId !== ""
  );

  // 2. Calculate total percentage owed to partners
  // Note: Ensure 'partnershipProfitSharePercentage' is stored as a number in your DB.
  // If it's stored as string, parse it.
  const totalPartnerPercentage = partnerTransactions?.reduce(
    (sum, t) => sum + (Number(t.partnershipProfitSharePercentage) || 0),
    0
  ) || 0;

  // 3. Calculate the actual monetary amount to be paid to partners
  // Formula: Net Profit * (Total Partner Percentage / 100)
  const partnerTotalShare = lastNetProfit != null 
    ? (lastNetProfit * (totalPartnerPercentage / 100)) 
    : 0;

  // 4. Calculate Net Profit AFTER paying partners (Owner's final profit)
  const lastNetProfitAfterPartner = lastNetProfit != null 
    ? lastNetProfit - partnerTotalShare 
    : null;

  return {
    lastNetProfit,
    netProfit,
    buyAmountWithPercent,
    sellAmountWithPercent,
    halfProfit,
    totalOtherCosts,
    totalOptionsDeals,
    lastGrossProfit,
    grossProfit,
    isLoading: false,
    deal: selectedDeal,
    transactions,
    allDeals,
    lastNetProfitAfterPartner,
    partnerTotalShare
  };
};

export default useGetProfit;
