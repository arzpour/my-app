"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useGetAllPeople from "@/hooks/useGetAllPeople";
import type { ITransactionNew } from "@/types/new-backend-types";
import SelectForFilterCheques from "./selectForFilterCheques";
import useGetAllTransactions from "@/hooks/useGetAllTransaction";
import useGetAllDeals from "@/hooks/useGetAllDeals";
import { formatPrice } from "@/utils/systemConstants";
import useGetProfit from "@/hooks/useGetProfit";

// Persian month names
const persianMonths = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

// Helper function to get month from Persian date (YYYY/MM/DD)
const getMonthFromDate = (dateStr: string): number | null => {
  if (!dateStr) return null;
  const parts = dateStr.split("/");
  if (parts.length >= 2) {
    const month = parseInt(parts[1], 10);
    return month >= 1 && month <= 12 ? month : null;
  }
  return null;
};

// Helper function to normalize names for comparison
const normalize = (str?: string) =>
  str ? str.trim().toLowerCase().replace(/\s+/g, " ") : "";

const OperatorsDashboard = () => {
  const [selectedOperator, setSelectedOperator] = React.useState<string>("");
  const [selectedOperatorPersonId, setSelectedOperatorPersonId] =
    React.useState<string>("");
  const [reportType, setReportType] = React.useState<"buy" | "sell">("sell");
  const [topOperatorsType, setTopOperatorsType] = React.useState<
    "buy" | "sell"
  >("sell");

  // const { data: getAllCategoryWithOptionSettings } =
  //   useGetAllCategoryWithOptionSettings();
  const { data: allPeople } = useGetAllPeople();
  // const { data: allDeals } = useQuery({
  //   queryKey: ["get-all-deals"],
  //   queryFn: getAllDeals,
  // });
  const { data: allDeals } = useGetAllDeals();
  const { data: allTransactions } = useGetAllTransactions();

  const { lastGrossProfit, lastNetProfit, buyAmountWithPercent } = useGetProfit();

  // const getTransactionByDealId = useGetTransactionByDealId(dealId);
  // const otherOptionsTransaction =
  //   allTransactions
  //     ?.filter((t) => t.brokerPersonId === selectedOperator)
  //     ?.filter((el) => el.reason === "سایر هزینه‌ها")
  //     .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
  // const otherOptionsTransaction =
  //   allTransactions
  //     ?.filter((t) => t.brokerPersonId === selectedOperator)
  //     ?.filter((el) => el.reason === "سایر هزینه‌ها")
  //     .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
  // console.log(
  //   "🚀 ~ OperatorsDashboard ~ transactions:",
  //   otherOptionsTransaction,
  // );
  //  getTransactionByDealId.data || [];

  // const transactions =
  //   allTransactions?.filter((t) => {
  //     return t.brokerPersonId === selectedOperatorPersonId;
  //   }) ?? [];

  // const otherOptionsTransaction =
  //   transactions
  //     ?.filter((el) => el.reason === "سایر هزینه‌ها")
  //     .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

  // const purchaseBrokerOtherCostCategories =
  //   allDeals
  //     ?.filter((d) => d?.saleBroker?.personId === selectedOperatorPersonId)
  //     .flatMap((pd) => pd.directCosts.otherCost.map((cost) => cost.category)) ??
  //   [];

  // const saleBrokerOtherCostCategories =
  //   allDeals
  //     ?.filter((d) => d?.saleBroker?.personId === selectedOperatorPersonId)
  //     .flatMap((pd) => pd.directCosts.otherCost.map((cost) => cost.category)) ??
  //   [];

  // const purchaseOtherCostsFromTransactions =
  //   transactions
  //     ?.filter(
  //       (t) =>
  //         t.type === "پرداخت" &&
  //         purchaseBrokerOtherCostCategories?.some(
  //           (category) => t.reason === category,
  //         ),
  //     )
  //     .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

  // const saleOtherCostsFromTransactions =
  //   transactions
  //     ?.filter(
  //       (t) =>
  //         t.type === "پرداخت" &&
  //         saleBrokerOtherCostCategories?.some(
  //           (category) => t.reason === category,
  //         ),
  //     )
  //     .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

  // const purchaseBrokerOtherCostsFromDirectCosts =
  //   allDeals
  //     ?.filter((d) => d.purchaseBroker?.personId === selectedOperatorPersonId)
  //     .map(
  //       (pd) =>
  //         pd.directCosts.otherCost.reduce(
  //           (sum, cost) => sum + (cost.cost || 0),
  //           0,
  //         ) || 0,
  //     )
  //     ?.reduce((a, b) => a + b, 0) ?? 0;

  // const saleBrokerOtherCostsFromDirectCosts =
  //   allDeals
  //     ?.filter((d) => d.saleBroker?.personId === selectedOperatorPersonId)
  //     .map(
  //       (pd) =>
  //         pd.directCosts.otherCost.reduce(
  //           (sum, cost) => sum + (cost.cost || 0),
  //           0,
  //         ) || 0,
  //     )
  //     ?.reduce((a, b) => a + b, 0) ?? 0;

  // const directCostsSum =
  //   saleBrokerOtherCostsFromDirectCosts?.reduce((a, b) => a + b, 0) ?? 0;

  // const totalSaleBrokerOtherCosts =
  //   saleBrokerOtherCostsFromDirectCosts +
  //   saleOtherCostsFromTransactions +
  //   otherOptionsTransaction;

  // const totalPurchaseBrokerOtherCosts =
  //   (purchaseBrokerOtherCostsFromDirectCosts ?? 0) +
  //   (purchaseOtherCostsFromTransactions ?? 0) +
  //   (otherOptionsTransaction || 0);

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
  //     ?.filter((el) => el.reason === "سایر هزینه‌ها")
  //     .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
  // const totalOtherCosts =
  //   otherCostsFromDirectCosts +
  //   otherCostsFromTransactions +
  //   otherOptionsTransaction;

  // const { purchaseBroker, saleBroker } = useSelector(
  //   (state: RootState) => state.transaction,
  // );

  // const { data: allTransactions } = useQuery({
  //   queryKey: ["get-all-transactions"],
  //   queryFn: getAllTransactions,
  // });

  // Get operators from settings or people with broker role
  // const operatorsNameOptions =
  //   getAllCategoryWithOptionSettings?.filter(
  //     (item) => item.category === "operators",
  //   ) || [];

  // const operatorOptionsFromSettings =
  //   operatorsNameOptions?.[0]?.options?.filter(Boolean) || [];

  // Get brokers from people
  const brokerPeople =
    allPeople?.filter((p) => p.roles?.includes("broker")) || [];

  // Combine both sources, prefer people if available
  const operatorOptions = React.useMemo(() => {
    const fromPeople = brokerPeople.map((p) => `${p.firstName} ${p.lastName}`);
    const combined = [...new Set([...fromPeople])];
    return combined;
  }, [brokerPeople]);

  const brokerCommissions = React.useMemo(() => {
    if (!selectedOperatorPersonId || !allDeals) {
      return {
        totalPurchaseCommission: 0,
        totalSaleCommission: 0,
        purchaseCommissionPercent: 0,
        saleCommissionPercent: 0,
      };
    }

    let totalPurchaseCommission = 0;
    let totalSaleCommission = 0;
    let purchaseCount = 0;
    let saleCount = 0;
    let totalPurchasePercent = 0;
    let totalSalePercent = 0;
    let isSold = false;

    const purchaseDealsForThisOperator = allDeals?.filter(
      (d) => d?.purchaseBroker?.fullName.trim() === selectedOperator.trim(),
    );

    const saleDealsForThisOperator = allDeals?.filter(
      (d) => d?.saleBroker?.fullName.trim() === selectedOperator.trim(),
    );

    const purchaseAllTransactionAboutRelatedDeal = allTransactions
      ?.filter((t) =>
        purchaseDealsForThisOperator.some((d) => d._id === t.dealId),
      )
      .filter((st) => st.reason === "سایر هزینه‌ها");

    const saleAllTransactionAboutRelatedDeal = allTransactions
      ?.filter((t) => saleDealsForThisOperator.some((d) => d._id === t.dealId))
      .filter((st) => st.reason === "سایر هزینه‌ها");

    const purchaseOtherCosts =
      purchaseAllTransactionAboutRelatedDeal?.reduce(
        (sum, t) => sum + (t.amount || 0),
        0,
      ) || 0;
    const saleOtherCosts =
      saleAllTransactionAboutRelatedDeal?.reduce(
        (sum, t) => sum + (t.amount || 0),
        0,
      ) || 0;

    allDeals.forEach((deal) => {
      const isPurchaseBroker =
        deal.purchaseBroker?.fullName.trim() === selectedOperator.trim();

      isSold = !!deal?.purchaseBroker?.personId ? true : false;

      const isSaleBroker =
        deal.saleBroker?.fullName.trim() === selectedOperator.trim();

      const otherCosts =
        deal.directCosts?.otherCost?.reduce(
          (sum, c) => sum + (c.cost || 0),
          0,
        ) || 0;

      const buyAmountWithoutPercent =
        (deal.purchasePrice ?? 0) - otherCosts - purchaseOtherCosts;

      const sellAmountWithoutPercent =
        (deal.salePrice ?? 0) - otherCosts - saleOtherCosts;

      if (isPurchaseBroker && deal.purchaseBroker?.commissionPercent) {
        const commissionPercent =
          parseFloat(String(deal.purchaseBroker.commissionPercent)) || 0;
        // const commission = (buyAmountWithoutPercent * commissionPercent) / 100;
        totalPurchaseCommission += buyAmountWithPercent || 0;
        totalPurchasePercent += commissionPercent;
        purchaseCount++;
      }

      if (isSaleBroker && deal.saleBroker?.commissionPercent) {
        const commissionPercent =
          parseFloat(String(deal.saleBroker.commissionPercent)) || 0;
        const commission = (sellAmountWithoutPercent * commissionPercent) / 100;
        totalSaleCommission += commission;
        totalSalePercent += commissionPercent;
        saleCount++;
      }
    });

    return {
      totalPurchaseCommission,
      totalSaleCommission,
      purchaseCommissionPercent:
        purchaseCount > 0 ? totalPurchasePercent / purchaseCount : 0,
      saleCommissionPercent: saleCount > 0 ? totalSalePercent / saleCount : 0,
      isSold,
    };
  }, [selectedOperatorPersonId, allDeals]);

  // Find selected operator person ID
  React.useEffect(() => {
    if (selectedOperator) {
      const broker = brokerPeople.find((p) => {
        return (
          normalize(`${p.firstName} ${p.lastName}`) ===
          normalize(selectedOperator)
        );
      });
      setSelectedOperatorPersonId(broker?._id?.toString() || "");
    } else {
      setSelectedOperatorPersonId("");
    }
  }, [selectedOperator, brokerPeople]);

  // Filter deals by selected operator
  const filteredDeals = React.useMemo(() => {
    if (!selectedOperatorPersonId || !allDeals) return [];
    return allDeals.filter((deal) => {
      const isPurchaseBroker =
        deal.purchaseBroker?.personId === selectedOperatorPersonId;
      const isSaleBroker =
        deal.saleBroker?.personId === selectedOperatorPersonId;
      return isPurchaseBroker || isSaleBroker;
    });
  }, [selectedOperatorPersonId, allDeals]);

  // Calculate monthly breakdown
  const monthlyData = React.useMemo(() => {
    const months: Record<number, { count: number; totalAmount: number }> = {};

    // Initialize all months
    for (let i = 1; i <= 12; i++) {
      months[i] = { count: 0, totalAmount: 0 };
    }

    filteredDeals.forEach((deal) => {
      const isPurchaseBroker =
        deal.purchaseBroker?.personId === selectedOperatorPersonId;
      const isSaleBroker =
        deal.saleBroker?.personId === selectedOperatorPersonId;

      let dateStr = "";
      let amount = 0;

      if (reportType === "buy" && isPurchaseBroker) {
        dateStr = deal.purchaseDate || "";
        amount = deal.purchasePrice || 0;
      } else if (reportType === "sell" && isSaleBroker) {
        dateStr = deal.saleDate || "";
        amount = deal.salePrice || 0;
      }

      if (dateStr) {
        const month = getMonthFromDate(dateStr);
        if (month) {
          months[month].count++;
          months[month].totalAmount += amount;
        }
      }
    });

    return months;
  }, [filteredDeals, selectedOperatorPersonId, reportType]);

  // Get all transactions for deals where operator is involved
  const operatorTransactionsForDisplay = React.useMemo(() => {
    if (!selectedOperatorPersonId || !allTransactions || !filteredDeals.length)
      return [];
    const filteredDealIds = new Set(
      filteredDeals.map((deal) => deal._id?.toString()).filter(Boolean),
    );
    return (
      (allTransactions as unknown as ITransactionNew[])
        ?.filter((t) => {
          return (
            t.dealId &&
            filteredDealIds.has(t.dealId) &&
            t.brokerPersonId === selectedOperatorPersonId
          );
        })
        .map((t, index) => {
          const deal = filteredDeals.find(
            (d) => d._id?.toString() === t.dealId,
          );
          if (!deal) return null;

          const isPurchaseBroker =
            deal.purchaseBroker?.personId === selectedOperatorPersonId;
          const isSaleBroker =
            deal.saleBroker?.personId === selectedOperatorPersonId;

          if (!isPurchaseBroker && !isSaleBroker) {
            return null;
          }
          return {
            id: (index + 1).toString(),
            price: t.amount?.toLocaleString("en-US") || "0",
            date: t.transactionDate || "",
            paymentWay: t.paymentMethod || "",
            cart: t.bussinessAccountId || "",
            etc: t.description || "",
            chassisNo: deal?.vehicleSnapshot?.vin || "",
            transactionType: t.type || "",
            transactionReason: t.reason || "",
            model: deal?.vehicleSnapshot?.model || "",
            role: isPurchaseBroker ? "خریدار" : "فروشنده",
            brokerPercentage: isPurchaseBroker
              ? deal.purchaseBroker.commissionPercent
              : deal.saleBroker.commissionPercent,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null) || []
    );
  }, [selectedOperatorPersonId, allTransactions, filteredDeals]);

  const operatorPerformanceReport = React.useMemo(() => {
    if (!selectedOperatorPersonId || !filteredDeals.length) return [];

    return filteredDeals
      .map((deal, index) => {
        const isPurchaseBroker =
          deal.purchaseBroker?.personId === selectedOperatorPersonId;
        const isSaleBroker =
          deal.saleBroker?.personId === selectedOperatorPersonId;
        let dateStr = "";
        let amount = 0;
        let brokerPercentage = 0;
        if (reportType === "buy" && isPurchaseBroker) {
          dateStr = deal.purchaseDate || "";
          amount = deal.purchasePrice || 0;
          brokerPercentage = deal.purchaseBroker.commissionPercent;
        } else if (reportType === "sell" && isSaleBroker) {
          dateStr = deal.saleDate || "";
          amount = deal.salePrice || 0;
          brokerPercentage = deal.saleBroker.commissionPercent;
        }
        if (dateStr && amount) {
          return {
            id: (index + 1).toString(),
            chassisNo: deal.vehicleSnapshot?.vin || "",
            date: dateStr,
            price: amount.toLocaleString("en-US"),
            transactionReason: reportType === "buy" ? "خرید" : "فروش",
            brokerPercentage: brokerPercentage,
          };
        }
        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [filteredDeals, selectedOperatorPersonId, reportType]);

  const TabsTableOperationTransactionComponent = () => {
    return (
      <div className="max-h-[28rem] h-[28rem] overflow-y-auto rounded-md border w-full">
        <div className="overflow-x-auto">
          <Table className="min-w-max text-right border-collapse">
            <TableHeader className="top-0 sticky">
              <TableRow className="bg-gray-100">
                <TableHead className="w-12 text-center">ردیف</TableHead>
                <TableHead className="w-32 text-center">شاسی</TableHead>
                <TableHead className="w-32 text-center">تاریخ</TableHead>
                <TableHead className="w-32 text-center">مبلغ</TableHead>
                <TableHead className="w-32 text-center">دلیل تراکنش</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {operatorTransactionsForDisplay.length > 0 ? (
                operatorTransactionsForDisplay
                  .filter(Boolean)
                  .map((item, index) => {
                    return (
                      <TableRow
                        key={`${item?.id}-${index}`}
                        className="hover:bg-gray-50"
                      >
                        <TableCell className="text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.chassisNo}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.date}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.price}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.transactionReason}
                        </TableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-gray-500 py-4"
                  >
                    داده‌ای یافت نشد
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  const TabsTableOperatorPerformanceReportComponent = () => {
    return (
      <div className="max-h-[28rem] h-[28rem] overflow-y-auto rounded-md border w-full">
        <div className="overflow-x-auto">
          <Table className="min-w-max text-right border-collapse">
            <TableHeader className="top-0 sticky">
              <TableRow className="bg-gray-100">
                <TableHead className="w-12 text-center">ردیف</TableHead>
                <TableHead className="w-32 text-center">شاسی</TableHead>
                <TableHead className="w-32 text-center">تاریخ</TableHead>
                <TableHead className="w-32 text-center">قیمت</TableHead>
                <TableHead className="w-32 text-center">درصد کارگزار</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {operatorPerformanceReport.length > 0 ? (
                operatorPerformanceReport.filter(Boolean).map((item, index) => {
                  return (
                    <TableRow
                      key={`${item?.id}-${index}`}
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center">
                        {item?.chassisNo}
                      </TableCell>
                      <TableCell className="text-center">
                        {item?.date}
                      </TableCell>
                      <TableCell className="text-center">
                        {item?.price}
                      </TableCell>
                      <TableCell className="text-center">
                        {item?.brokerPercentage}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-gray-500 py-4"
                  >
                    داده‌ای یافت نشد
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  const tabs = [
    {
      id: "operationTransaction",
      title: "تراکنش های کارگزار",
      content: <TabsTableOperationTransactionComponent />,
    },
    {
      id: "operatorPerformanceReport",
      title: "جزییات گزارش عملکرد کارگزار",
      content: <TabsTableOperatorPerformanceReportComponent />,
    },
  ];


  // Calculate statistics
  const stats = React.useMemo(() => {
    if (!filteredDeals.length || !selectedOperatorPersonId) {
      return {
        totalPurchase: 0,
        totalSale: 0,
        totalProfitPurchase: 0,
        totalProfitSale: 0,
        // totalCommissionPurchase: 0,
        // totalCommissionSale: 0,
        totalCommission: 0,
        // avgPercentPurchase: 0,
        // avgPercentSale: 0,
        totalPaidToOperator: 0,
        remainingCommission: 0,
      };
    }

    let totalPurchase = 0;
    let totalSale = 0;
    let totalProfitPurchase = 0;
    let totalProfitSale = 0;
    // let totalCommissionPurchase = 0;
    // let totalCommissionSale = 0;
    let purchaseCount = 0;
    let saleCount = 0;
    let totalPercentPurchase = 0;
    let totalPercentSale = 0;

    filteredDeals.forEach((deal) => {
      const isPurchaseBroker =
        deal.purchaseBroker?.personId === selectedOperatorPersonId;
      const isSaleBroker =
        deal.saleBroker?.personId === selectedOperatorPersonId;

      // Sum purchase amounts only for deals where operator is PurchaseBroker
      if (isPurchaseBroker && deal.purchasePrice) {
        totalPurchase += deal.purchasePrice || 0;
        if (deal.purchaseBroker?.commissionPercent) {
          totalPercentPurchase += deal.purchaseBroker.commissionPercent;
          purchaseCount++;
        }
      }

      // Sum sale amounts only for deals where operator is SaleBroker
      if (isSaleBroker && deal.salePrice) {
        totalSale += deal.salePrice || 0;
        if (deal.saleBroker?.commissionPercent) {
          totalPercentSale += deal.saleBroker.commissionPercent;
          saleCount++;
        }
      }

      //       let buyAmountWithPercent: number | null = null;
      // let sellAmountWithPercent: number | null = null;
      // Calculate profits and commissions
      if (deal.purchasePrice && deal.salePrice) {
        // const profit = deal.salePrice - deal.purchasePrice;
        const profit = lastNetProfit;

        if (isPurchaseBroker && deal.purchaseBroker?.commissionAmount) {
          totalProfitPurchase += profit || 0
          // totalCommissionPurchase += deal.purchaseBroker.commissionAmount;

          //          const otherCostCategories =
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

          // const buyAmountWithoutPercent = (deal?.purchasePrice ?? 0) - totalOtherCosts;
          // const sellAmountWithoutPercent = (deal?.salePrice ?? 0) - totalOtherCosts;
        }

        if (isSaleBroker && deal.saleBroker?.commissionAmount) {
          totalProfitSale += profit;
          // totalCommissionSale += deal.saleBroker.commissionAmount;
        }
      } else {
        // If deal is not sold yet, use commission from purchase price
        // if (isPurchaseBroker && deal.purchaseBroker?.commissionAmount) {
        //   totalCommissionPurchase += deal.purchaseBroker.commissionAmount;
        // }
      }
    });
    // const totalCommissionPurchase = 0

    const totalCommission =
      brokerCommissions.totalPurchaseCommission +
      brokerCommissions.totalSaleCommission;
    // const avgPercentPurchase =
    //   purchaseCount > 0 ? totalPercentPurchase / purchaseCount : 0;
    // const avgPercentSale = saleCount > 0 ? totalPercentSale / saleCount : 0;

    const totalPaidToOperator = operatorTransactionsForDisplay.reduce(
      (sum, t) => {
        const price = parseFloat(t.price.toString().replace(/,/g, ""));
        return sum + (price || 0);
      },
      0,
    );

    const remainingCommission = totalCommission - totalPaidToOperator;

    return {
      totalPurchase,
      totalSale,
      totalProfitPurchase,
      totalProfitSale,
      // purchaseBroker,
      // saleBroker,
      brokerCommissions,
      totalCommission,
      // avgPercentPurchase,
      // avgPercentSale,
      totalPaidToOperator,
      remainingCommission,
    };
  }, [filteredDeals, selectedOperatorPersonId, allTransactions]);

  // Calculate total count and amount for year
  const yearlyTotal = React.useMemo(() => {
    let totalCount = 0;
    let totalAmount = 0;
    Object.values(monthlyData).forEach((month) => {
      totalCount += month.count;
      totalAmount += month.totalAmount;
    });
    return { totalCount, totalAmount };
  }, [monthlyData]);

  return (
    <div>
      <div className="flex justify-end">
        <span className="p-2 bg-gray-200 rounded-t-md text-xs">1404</span>
      </div>
      <div className="border p-4">
        <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr] gap-6 items-start mb-14 mt-5">
          <div className="space-y-3 flex flex-col gap-4">
            {/* <h3 className="text-var(--title) text-sm font-semibold mb-2 text-blue-900">
              انتخاب کارگزار:
            </h3> */}
            {/* <SearchableSelect
              value={selectedOperator}
              onValueChange={(financier) => {
                setSelectedOperator(financier);
              }}
              options={operatorOptions ?? []}
              placeholder="انتخاب کارگزار"
              className="w-[120px] text-sm"
              searchPlaceholder="جستجوی کارگزار..."
            /> */}
            <SelectForFilterCheques
              data={["همه", ...operatorOptions]}
              title="انتخاب کارگزار"
              setSelectedSubject={setSelectedOperator}
              selectedValue={selectedOperator}
              className="!w-[300px] font-medium"
            />
            {/* <Select
              value={selectedOperator}
              onValueChange={setSelectedOperator}
            >
              <SelectTrigger className="w-[120px] text-sm">
                <SelectValue placeholder="انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {operatorOptions.map((item, index) => (
                    <SelectItem key={`${item}-${index}`} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select> */}
          </div>
          <div className="flex flex-col gap-4">
            <div className="space-y-1 flex items-center gap-4">
              <h3 className="text-sm text-blue-900 font-medium">مجموع خرید:</h3>
              <p className="text-sm font-medium">
                {formatPrice(stats.totalPurchase.toLocaleString("en-US"))}
              </p>
            </div>
            <div className="space-y-1 flex items-center gap-4">
              <h3 className="text-sm text-blue-900 font-medium">مجموع فروش:</h3>
              <p className="text-sm font-medium">
                {formatPrice(stats.totalSale.toLocaleString("en-US"))}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-4">
              <div className="space-y-1 flex items-center gap-4">
                <h3 className="text-sm text-blue-900 font-medium">
                  مجموع سود خرید:
                </h3>
                <p className="text-sm font-medium">
                  {formatPrice(
                    stats.totalProfitPurchase.toLocaleString("en-US"),
                  )}
                </p>
              </div>
              <div>
                <div className="space-y-1 flex items-center gap-4">
                  <h3 className="text-sm text-blue-900 font-medium">
                    مجموع سود فروش:
                  </h3>
                  <p className="text-sm font-medium">
                    {formatPrice(stats.totalProfitSale.toLocaleString("en-US"))}
                  </p>
                </div>
              </div>
            </div>
            {/* <div>
              <p className="text-sm text-purple-500">
                میانگین درصد کارمزد خرید: {stats.avgPercentPurchase.toFixed(2)}%
              </p>
              <p className="text-sm text-purple-500">
                میانگین درصد کارمزد فروش: {stats.avgPercentSale.toFixed(2)}%
              </p>
            </div> */}
          </div>
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-4">
              <div className="space-y-1 flex items-center gap-4">
                <h3 className="text-sm text-blue-900 font-medium">
                  مجموع کارمزد خرید:
                </h3>
                <p className="text-sm font-medium">
                  {/* {purchaseBroker.totalCommissionPurchase?.toLocaleString(
                    "en-US",
                  )} */}
                  {!brokerCommissions.isSold
                    ? 0
                    : formatPrice(
                        brokerCommissions.totalPurchaseCommission.toLocaleString(
                          "en-US",
                        ),
                      )}
                </p>
              </div>
              <div>
                <div className="space-y-1 flex items-center gap-4">
                  <h3 className="text-sm text-blue-900 font-medium">
                    مجموع کارمزد فروش:
                  </h3>
                  <p className="text-sm font-medium">
                    {/* {saleBroker.totalCommissionSale?.toLocaleString("en-US")} */}
                    {formatPrice(
                      brokerCommissions.totalSaleCommission.toLocaleString(
                        "en-US",
                      ),
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-xs text-green-700">
                {/* ({purchaseBroker?.totalCommissionPurchasePercent?.toFixed(2)}%) */}
                {brokerCommissions.purchaseCommissionPercent.toFixed(2)}%
              </p>
              <p className="text-xs text-green-700">
                {/* ({saleBroker?.totalCommissionSalePercent?.toFixed(2)}%) */}
                {brokerCommissions.saleCommissionPercent.toFixed(2)}%
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="space-y-1 flex items-center gap-4">
              <h3 className="text-sm text-blue-900 font-medium">
                مجموع کل کارمزد:
              </h3>
              <p className="text-sm font-medium text-purple-600">
                {formatPrice(stats.totalCommission.toLocaleString("en-US"))}
              </p>
            </div>
            <div>
              <div className="space-y-1 flex items-center gap-4">
                <h3 className="text-sm text-blue-900 font-medium">
                  مانده کارمزد:
                </h3>
                <p className="text-sm font-medium text-red-500">
                  {formatPrice(
                    stats.remainingCommission.toLocaleString("en-US"),
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-[2fr_1fr] gap-6 items-start mt-7">
          <div className="border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4 font-medium">
              گزارش انفرادی کارگزاران
            </p>
            <div className="grid grid-cols-2 gap-4 items-start mt-5">
              <div>
                <RadioGroup
                  value={reportType}
                  onValueChange={(value) =>
                    setReportType(value as "buy" | "sell")
                  }
                  className="flex gap-6 justify-end text-blue-500 mb-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="buy" id="r1" />
                    <label htmlFor="r1" className="text-blue-500">
                      خرید
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="sell" id="r2" />
                    <label htmlFor="r2" className="text-blue-500">
                      فروش
                    </label>
                  </div>
                </RadioGroup>
                <div className="border border-gray-300 p-4 rounded-md relative w-full">
                  <p className="absolute right-2 -top-5 bg-white py-2 px-4 font-medium">
                    گزارش خلاصه عملکرد
                  </p>
                  <div className="max-h-[28rem] overflow-y-auto rounded-md w-full grid grid-cols-2 gap-6 items-start p-4">
                    <div className="space-y-5">
                      {persianMonths.slice(0, 6).map((month, index) => {
                        const monthNum = index + 1;
                        const monthData = monthlyData[monthNum];
                        return (
                          <div key={month}>
                            <div className="flex gap-4 items-start">
                              <p className="text-orange-500 text-sm">{month}</p>
                              <p className="text-yellow-900 font-medium text-sm">
                                {monthData.count}
                              </p>
                            </div>
                            <p className="font-medium text-sm">
                              {monthData.totalAmount.toLocaleString("en-US")}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="space-y-5">
                      {persianMonths.slice(6, 12).map((month, index) => {
                        const monthNum = index + 7;
                        const monthData = monthlyData[monthNum];
                        return (
                          <div key={month}>
                            <div className="flex gap-4 items-start">
                              <p className="text-blue-500 text-sm">{month}</p>
                              <p className="text-yellow-900 font-medium text-sm">
                                {monthData.count}
                              </p>
                            </div>
                            <p className="font-medium text-sm">
                              {monthData.totalAmount.toLocaleString("en-US")}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <hr />
                  <h4 className="text-green-700 flex justify-end font-medium text-base my-2">
                    اطلاعات کل سال
                  </h4>
                  <div className="space-y-3">
                    <div className="flex gap-4 items-start justify-between w-full">
                      <p className="font-medium">مجموع خرید/فروش شما:</p>
                      <p className="font-medium">
                        {yearlyTotal.totalAmount.toLocaleString("en-US")}
                      </p>
                    </div>
                    <div className="flex gap-4 items-start justify-between w-full">
                      <p className="font-medium">تعداد خرید/فروش:</p>
                      <p className="font-medium">
                        {yearlyTotal.totalCount.toLocaleString("en-US")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Tabs
                  defaultValue="operationTransaction"
                  orientation="vertical"
                  className="h-full w-full flex justify-end items-start"
                  dir="rtl"
                >
                  <TabsList>
                    {tabs.map((tab) => (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="bg-gray-100 cursor-pointer"
                      >
                        {tab.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {tabs.map((tab) => (
                    <TabsContent
                      key={tab.id}
                      value={tab.id}
                      className="w-full bg-white rounded-2xl"
                    >
                      {tab.content}
                    </TabsContent>
                  ))}
                </Tabs>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-blue-700 font-medium">
                    مجموع مبالغ پرداخت شده به کارگزار
                  </p>
                  <p className="text-green-700 font-medium text-sm">
                    {stats.totalPaidToOperator.toLocaleString("en-US")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
              کارگزاران برتر
            </p>
            <RadioGroup
              value={topOperatorsType}
              onValueChange={(value) =>
                setTopOperatorsType(value as "buy" | "sell")
              }
              className="flex gap-6 justify-end text-blue-500 mb-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="buy" id="r3" />
                <label htmlFor="r3" className="text-blue-500">
                  خرید
                </label>
              </div>

              <div className="flex items-center gap-2">
                <RadioGroupItem value="sell" id="r4" />
                <label htmlFor="r4" className="text-blue-500">
                  فروش
                </label>
              </div>
            </RadioGroup>
            <div className="border border-gray-300 p-4 rounded-md relative w-full bg-pink-200">
              <p className="text-blue-500 absolute left-2 -top-5 py-2 rounded-md bg-pink-200 px-4">
                لیست ماهانه
              </p>

              <div className="w-full">
                <p className="text-green-600 font-medium">نمایش لیست سالانه</p>
                <div className="grid grid-cols-4 space-y-5 mt-2">
                  <div>
                    {persianMonths.slice(0, 3).map((month) => (
                      <div key={month} className="text-sm text-green-600">
                        {month}
                      </div>
                    ))}
                  </div>
                  <div>
                    {persianMonths.slice(3, 6).map((month) => (
                      <div key={month} className="text-sm text-green-600">
                        {month}
                      </div>
                    ))}
                  </div>
                  <div>
                    {persianMonths.slice(6, 9).map((month) => (
                      <div key={month} className="text-sm text-green-600">
                        {month}
                      </div>
                    ))}
                  </div>
                  <div>
                    {persianMonths.slice(9, 12).map((month) => (
                      <div key={month} className="text-sm text-green-600">
                        {month}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorsDashboard;
