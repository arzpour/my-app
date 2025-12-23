"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import useGetAllCategoryWithOptionSettings from "@/hooks/useGetCategoriesSetting";
import useGetAllPeople from "@/hooks/useGetAllPeople";
import { getAllDeals } from "@/apis/client/deals";
import { getAllTransactions } from "@/apis/client/transaction";
import { useQuery } from "@tanstack/react-query";
import type { IDeal, ITransactionNew, IPeople } from "@/types/new-backend-types";

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
  const [selectedOperatorPersonId, setSelectedOperatorPersonId] = React.useState<string>("");
  const [reportType, setReportType] = React.useState<"buy" | "sell">("sell");
  const [topOperatorsType, setTopOperatorsType] = React.useState<
    "buy" | "sell"
  >("sell");

  const { data: getAllCategoryWithOptionSettings } =
    useGetAllCategoryWithOptionSettings();
  const { data: allPeople } = useGetAllPeople();
  const { data: allDeals } = useQuery({
    queryKey: ["get-all-deals"],
    queryFn: getAllDeals,
  });
  const { data: allTransactions } = useQuery({
    queryKey: ["get-all-transactions"],
    queryFn: getAllTransactions,
  });

  // Get operators from settings or people with broker role
  const operatorsNameOptions =
    getAllCategoryWithOptionSettings?.filter(
      (item) => item.category === "operators"
    ) || [];

  const operatorOptionsFromSettings =
    operatorsNameOptions?.[0]?.options?.filter(Boolean) || [];

  // Get brokers from people
  const brokerPeople = allPeople?.filter((p) => p.roles?.includes("broker")) || [];

  // Combine both sources, prefer people if available
  const operatorOptions = React.useMemo(() => {
    const fromPeople = brokerPeople.map((p) => p.fullName);
    const combined = [...new Set([...fromPeople, ...operatorOptionsFromSettings])];
    return combined;
  }, [brokerPeople, operatorOptionsFromSettings]);

  // Find selected operator person ID
  React.useEffect(() => {
    if (selectedOperator) {
      const broker = brokerPeople.find(
        (p) => normalize(p.fullName) === normalize(selectedOperator)
      );
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

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (!filteredDeals.length || !selectedOperatorPersonId) {
      return {
        totalPurchase: 0,
        totalSale: 0,
        totalProfitPurchase: 0,
        totalProfitSale: 0,
        totalCommissionPurchase: 0,
        totalCommissionSale: 0,
        totalCommission: 0,
        avgPercentPurchase: 0,
        avgPercentSale: 0,
        totalPaidToOperator: 0,
        remainingCommission: 0,
      };
    }

    let totalPurchase = 0;
    let totalSale = 0;
    let totalProfitPurchase = 0;
    let totalProfitSale = 0;
    let totalCommissionPurchase = 0;
    let totalCommissionSale = 0;
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

      // Calculate profits and commissions
      if (deal.purchasePrice && deal.salePrice) {
        const profit = deal.salePrice - deal.purchasePrice;

        if (isPurchaseBroker && deal.purchaseBroker?.commissionAmount) {
          totalProfitPurchase += profit;
          totalCommissionPurchase += deal.purchaseBroker.commissionAmount;
        }

        if (isSaleBroker && deal.saleBroker?.commissionAmount) {
          totalProfitSale += profit;
          totalCommissionSale += deal.saleBroker.commissionAmount;
        }
      } else {
        // If deal is not sold yet, use commission from purchase price
        if (isPurchaseBroker && deal.purchaseBroker?.commissionAmount) {
          totalCommissionPurchase += deal.purchaseBroker.commissionAmount;
        }
      }
    });

    const totalCommission = totalCommissionPurchase + totalCommissionSale;
    const avgPercentPurchase =
      purchaseCount > 0 ? totalPercentPurchase / purchaseCount : 0;
    const avgPercentSale =
      saleCount > 0 ? totalPercentSale / saleCount : 0;

    // Get transactions where reason is "درصد کارگزار" and related to filtered deals
    const filteredDealIds = new Set(
      filteredDeals.map((deal) => deal._id?.toString()).filter(Boolean)
    );
    
    const operatorTransactions = (allTransactions as ITransactionNew[])?.filter(
      (t) =>
        t.reason === "درصد کارگزار" &&
        t.personId === selectedOperatorPersonId &&
        t.dealId &&
        filteredDealIds.has(t.dealId)
    ) || [];

    const totalPaidToOperator = operatorTransactions.reduce(
      (sum, t) => sum + (t.amount || 0),
      0
    );

    const remainingCommission = totalCommission - totalPaidToOperator;

    return {
      totalPurchase,
      totalSale,
      totalProfitPurchase,
      totalProfitSale,
      totalCommissionPurchase,
      totalCommissionSale,
      totalCommission,
      avgPercentPurchase,
      avgPercentSale,
      totalPaidToOperator,
      remainingCommission,
    };
  }, [
    filteredDeals,
    selectedOperatorPersonId,
    allTransactions,
  ]);

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
      filteredDeals.map((deal) => deal._id?.toString()).filter(Boolean)
    );
    
    return (
      (allTransactions as ITransactionNew[])
        ?.filter((t) => t.dealId && filteredDealIds.has(t.dealId))
        .map((t, index) => {
          const deal = filteredDeals.find(
            (d) => d._id?.toString() === t.dealId
          );
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
          };
        }) || []
    );
  }, [selectedOperatorPersonId, allTransactions, filteredDeals]);

  // Get operator performance report (deals with details)
  const operatorPerformanceReport = React.useMemo(() => {
    if (!selectedOperatorPersonId || !filteredDeals.length) return [];
    
    return filteredDeals.map((deal, index) => {
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

      return {
        id: (index + 1).toString(),
        chassisNo: deal.vehicleSnapshot?.vin || "",
        date: dateStr,
        price: amount.toLocaleString("en-US"),
        transactionReason: reportType === "buy" ? "خرید" : "فروش",
      };
    });
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
                <TableHead className="w-32 text-center">قیمت</TableHead>
                <TableHead className="w-32 text-center">دلیل تراکنش</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {operatorTransactionsForDisplay.length > 0 ? (
                operatorTransactionsForDisplay.map((item, index) => (
                  <TableRow
                    key={`${item.id}-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <TableCell className="text-center">{item.id}</TableCell>
                    <TableCell className="text-center">
                      {item.chassisNo}
                    </TableCell>
                    <TableCell className="text-center">{item.date}</TableCell>
                    <TableCell className="text-center">{item.price}</TableCell>
                    <TableCell className="text-center">
                      {item.transactionReason}
                    </TableCell>
                  </TableRow>
                ))
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
                <TableHead className="w-32 text-center">دلیل تراکنش</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {operatorPerformanceReport.length > 0 ? (
                operatorPerformanceReport.map((item, index) => (
                  <TableRow
                    key={`${item.id}-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <TableCell className="text-center">{item.id}</TableCell>
                    <TableCell className="text-center">
                      {item.chassisNo}
                    </TableCell>
                    <TableCell className="text-center">{item.date}</TableCell>
                    <TableCell className="text-center">{item.price}</TableCell>
                    <TableCell className="text-center">
                      {item.transactionReason}
                    </TableCell>
                  </TableRow>
                ))
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
        <div className="grid grid-cols-[1fr_1fr_1.5fr_1fr_1fr] gap-6 items-start">
          <div className="space-y-1">
            <h3 className="text-var(--title) text-sm font-bold mb-2 text-blue-900">
              انتخاب کارگزار:
            </h3>
            <Select
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
            </Select>
          </div>
          <div>
            <div className="space-y-1 flex items-center gap-4">
              <h3 className="text-sm text-blue-900 font-bold">مجموع خرید:</h3>
              <p className="text-sm font-medium">
                {stats.totalPurchase.toLocaleString("en-US")}
              </p>
            </div>
            <div className="space-y-1 flex items-center gap-4">
              <h3 className="text-sm text-blue-900 font-bold">مجموع فروش:</h3>
              <p className="text-sm font-medium">
                {stats.totalSale.toLocaleString("en-US")}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <div className="space-y-1 flex items-center gap-4">
                <h3 className="text-sm text-blue-900 font-bold">
                  مجموع سود خرید:
                </h3>
                <p className="text-sm font-medium">
                  {stats.totalProfitPurchase.toLocaleString("en-US")}
                </p>
              </div>
              <div>
                <div className="space-y-1 flex items-center gap-4">
                  <h3 className="text-sm text-blue-900 font-bold">
                    مجموع سود فروش:
                  </h3>
                  <p className="text-sm font-medium">
                    {stats.totalProfitSale.toLocaleString("en-US")}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-purple-500">
                میانگین درصد کارمزد خرید: {stats.avgPercentPurchase.toFixed(2)}%
              </p>
              <p className="text-sm text-purple-500">
                میانگین درصد کارمزد فروش: {stats.avgPercentSale.toFixed(2)}%
              </p>
            </div>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <div className="space-y-1 flex items-center gap-4">
                <h3 className="text-sm text-blue-900 font-bold">
                  مجموع کارمزد خرید:
                </h3>
                <p className="text-sm font-medium">
                  {stats.totalCommissionPurchase.toLocaleString("en-US")}
                </p>
              </div>
              <div>
                <div className="space-y-1 flex items-center gap-4">
                  <h3 className="text-sm text-blue-900 font-bold">
                    مجموع کارمزد فروش:
                  </h3>
                  <p className="text-sm font-medium">
                    {stats.totalCommissionSale.toLocaleString("en-US")}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-green-700">
                ({stats.avgPercentPurchase.toFixed(2)}%)
              </p>
              <p className="text-xs text-green-700">({stats.avgPercentSale.toFixed(2)}%)</p>
            </div>
          </div>
          <div>
            <div className="space-y-1 flex items-center gap-4">
              <h3 className="text-sm text-blue-900 font-bold">
                مجموع کل کارمزد:
              </h3>
              <p className="text-sm font-medium text-purple-600">
                {stats.totalCommission.toLocaleString("en-US")}
              </p>
            </div>
            <div>
              <div className="space-y-1 flex items-center gap-4">
                <h3 className="text-sm text-blue-900 font-bold">
                  مانده کارمزد:
                </h3>
                <p className="text-sm font-medium text-red-500">
                  {stats.remainingCommission.toLocaleString("en-US")}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-[2fr_1fr] gap-6 items-start mt-7">
          <div className="border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-500 absolute left-2 -top-5 bg-white py-2 px-4 font-bold">
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
                  <p className="absolute left-2 -top-5 bg-white py-2 px-4 font-bold">
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
                  <h4 className="text-green-700 flex justify-end font-semibold text-base my-2">
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
                  className="h-full w-full flex justify-end items-end"
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
                  <p className="text-blue-700 font-bold">
                    مجموع مبالغ پرداخت شده به کارگزار
                  </p>
                  <p className="text-green-700 font-bold text-sm">
                    {stats.totalPaidToOperator.toLocaleString("en-US")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-500 absolute left-2 -top-5 bg-white py-2 px-4">
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
                <p className="text-green-600 font-semibold">
                  نمایش لیست سالانه
                </p>
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
