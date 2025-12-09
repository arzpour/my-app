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
// import useGetAllCars from "@/hooks/useGetAllCars";
import useGetAllTransactions from "@/hooks/useGetAllTransaction";
// import { useGetOperatorPercent } from "@/apis/mutations/detailsByChassisNo";

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
  const [reportType, setReportType] = React.useState<"buy" | "sell">("sell");
  const [topOperatorsType, setTopOperatorsType] = React.useState<
    "buy" | "sell"
  >("sell");

  const { data: getAllCategoryWithOptionSettings } =
    useGetAllCategoryWithOptionSettings();
  // const { data: allCars } = useGetAllCars();
  const { data: allTransactions } = useGetAllTransactions();
  // const getOperatorPercent = useGetOperatorPercent();

  // Get operators from settings
  const operatorsNameOptions =
    getAllCategoryWithOptionSettings?.filter(
      (item) => item.category === "operators"
    ) || [];

  const operatorOptions =
    operatorsNameOptions?.[0]?.options?.filter(Boolean) || [];

  // Get operator percentages
  // React.useEffect(() => {
  //   if (operatorOptions.length > 0) {
  //     getOperatorPercent.mutateAsync().catch(console.error);
  //   }
  // }, [operatorOptions.length]);

  // const operatorPercentData = getOperatorPercent.data;

  // // Filter cars by selected operator
  // const filteredCars = React.useMemo(() => {
  //   if (!selectedOperator || !allCars) return [];
  //   return allCars.filter(
  //     (car) =>
  //       normalize(car.PurchaseBroker) === normalize(selectedOperator) ||
  //       normalize(car.SaleBroker) === normalize(selectedOperator)
  //   );
  // }, [selectedOperator, allCars]);

  // // Get operator percent for selected operator
  // const selectedOperatorPercent = React.useMemo(() => {
  //   if (!selectedOperator || !operatorPercentData?.data) {
  //     return null;
  //   }
  //   const found = operatorPercentData.data.find(
  //     (item) => normalize(item.name) === normalize(selectedOperator)
  //   );

  //   return found || null;
  // }, [selectedOperator, operatorPercentData]);

  // Calculate statistics
  // const stats = React.useMemo(() => {
  //   if (!filteredCars.length || !selectedOperator) {
  //     return {
  //       totalPurchase: 0,
  //       totalSale: 0,
  //       totalProfitPurchase: 0,
  //       totalProfitSale: 0,
  //       totalCommissionPurchase: 0,
  //       totalCommissionSale: 0,
  //       totalCommission: 0,
  //       avgPercentPurchase: 0,
  //       avgPercentSale: 0,
  //       totalPaidToOperator: 0,
  //       remainingCommission: 0,
  //     };
  //   }

  //   // Calculate totals - only count when operator matches
  //   let totalPurchase = 0;
  //   let totalSale = 0;
  //   let totalProfitPurchase = 0;
  //   let totalProfitSale = 0;
  //   let totalCommissionPurchase = 0;
  //   let totalCommissionSale = 0;
  //   let purchaseCount = 0;
  //   let saleCount = 0;

  //   filteredCars.forEach((car) => {
  //     const isPurchaseBroker =
  //       normalize(car.PurchaseBroker) === normalize(selectedOperator);
  //     const isSaleBroker =
  //       normalize(car.SaleBroker) === normalize(selectedOperator);

  //     // Sum purchase amounts only for cars where operator is PurchaseBroker
  //     if (isPurchaseBroker && car.PurchaseAmount) {
  //       totalPurchase += car.PurchaseAmount || 0;
  //     }

  //     // Sum sale amounts only for cars where operator is SaleBroker
  //     if (isSaleBroker && car.SaleAmount) {
  //       totalSale += car.SaleAmount || 0;
  //     }

  //     // Calculate profits and commissions
  //     if (car.PurchaseAmount && car.SaleAmount) {
  //       // Based on header.tsx: grossProfit = PurchaseAmount - SaleAmount
  //       // So profit = PurchaseAmount - SaleAmount
  //       const profit = car.PurchaseAmount - car.SaleAmount;

  //       if (isPurchaseBroker) {
  //         if (selectedOperatorPercent) {
  //           // Calculate commission from profit
  //           const commission =
  //             profit * (selectedOperatorPercent.buyPercent / 100);
  //           totalProfitPurchase += profit;
  //           totalCommissionPurchase += commission;
  //           purchaseCount++;
  //         } else {
  //           // Still count profit even if percent not found
  //           totalProfitPurchase += profit;
  //           purchaseCount++;
  //         }
  //       }

  //       if (isSaleBroker) {
  //         if (selectedOperatorPercent) {
  //           // Calculate commission from profit
  //           const commission =
  //             profit * (selectedOperatorPercent.sellPercent / 100);
  //           totalProfitSale += profit;
  //           totalCommissionSale += commission;
  //           saleCount++;
  //         } else {
  //           // Still count profit even if percent not found
  //           totalProfitSale += profit;
  //           saleCount++;
  //         }
  //       }
  //     }
  //   });

  //   const totalCommission = totalCommissionPurchase + totalCommissionSale;
  //   const avgPercentPurchase =
  //     purchaseCount > 0 ? selectedOperatorPercent?.buyPercent || 0 : 0;
  //   const avgPercentSale =
  //     saleCount > 0 ? selectedOperatorPercent?.sellPercent || 0 : 0;

  //   // Get transactions where Broker field exists
  //   // Filter transactions that are related to cars where this operator is involved
  //   // We match transactions by ChassisNo to filtered cars
  //   const filteredChassisNos = new Set(
  //     filteredCars.map((car) => car.ChassisNo).filter(Boolean)
  //   );
  //   const operatorTransactions =
  //     allTransactions?.filter(
  //       (t) =>
  //         t.Broker &&
  //         t.Broker > 0 &&
  //         t.TransactionReason === "درصد کارگزار" &&
  //         filteredChassisNos.has(t.ChassisNo)
  //     ) || [];
  //   const totalPaidToOperator = operatorTransactions.reduce(
  //     (sum, t) => sum + (t.Broker || 0),
  //     0
  //   );

  //   const remainingCommission = totalCommission - totalPaidToOperator;

  //   const result = {
  //     totalPurchase,
  //     totalSale,
  //     totalProfitPurchase,
  //     totalProfitSale,
  //     totalCommissionPurchase,
  //     totalCommissionSale,
  //     totalCommission,
  //     avgPercentPurchase,
  //     avgPercentSale,
  //     totalPaidToOperator,
  //     remainingCommission,
  //   };

  //   return result;
  // }, [
  //   filteredCars,
  //   selectedOperator,
  //   selectedOperatorPercent,
  //   allTransactions,
  // ]);

  // // Calculate monthly breakdown
  // const monthlyData = React.useMemo(() => {
  //   const months: Record<number, { count: number; totalAmount: number }> = {};

  //   // Initialize all months
  //   for (let i = 1; i <= 12; i++) {
  //     months[i] = { count: 0, totalAmount: 0 };
  //   }

  //   filteredCars.forEach((car) => {
  //     const isPurchaseBroker =
  //       normalize(car.PurchaseBroker) === normalize(selectedOperator);
  //     const isSaleBroker =
  //       normalize(car.SaleBroker) === normalize(selectedOperator);

  //     let dateStr = "";
  //     let amount = 0;

  //     if (reportType === "buy" && isPurchaseBroker) {
  //       dateStr = car.PurchaseDate || "";
  //       amount = car.PurchaseAmount || 0;
  //     } else if (reportType === "sell" && isSaleBroker) {
  //       dateStr = car.SaleDate || "";
  //       amount = car.SaleAmount || 0;
  //     }

  //     if (dateStr) {
  //       const month = getMonthFromDate(dateStr);
  //       if (month) {
  //         months[month].count++;
  //         months[month].totalAmount += amount;
  //       }
  //     }
  //   });

  //   return months;
  // }, [filteredCars, selectedOperator, reportType]);

  // // Get all transactions for chassis numbers where operator is involved
  // const operatorTransactionsForDisplay = React.useMemo(() => {
  //   if (!selectedOperator || !allTransactions || !filteredCars.length)
  //     return [];
  //   // Get all chassis numbers where the operator is involved
  //   const filteredChassisNos = new Set(
  //     filteredCars.map((car) => car.ChassisNo).filter(Boolean)
  //   );
  //   // Filter all transactions that match these chassis numbers
  //   return (
  //     allTransactions
  //       ?.filter((t) => t.ChassisNo && filteredChassisNos.has(t.ChassisNo))
  //       .map((t, index) => ({
  //         id: (index + 1).toString(),
  //         price: t.TransactionAmount?.toLocaleString("en-US") || "0",
  //         date: t.TransactionDate || "",
  //         paymentWay: t.TransactionMethod || "",
  //         cart: t.ShowroomCard || "",
  //         etc: t.Notes || "",
  //         chassisNo: t.ChassisNo || "",
  //         transactionType: t.TransactionType || "",
  //         transactionReason: t.TransactionReason || "",
  //         model: t.Partner || "",
  //       })) || []
  //   );
  // }, [selectedOperator, allTransactions, filteredCars]);

  // const TabsTableOperationTransactionComponent = () => {
  //   return (
  //     <div className="max-h-[28rem] h-[28rem] overflow-y-auto rounded-md border w-full">
  //       <div className="overflow-x-auto">
  //         <Table className="min-w-max text-right border-collapse">
  //           <TableHeader className="top-0 sticky">
  //             <TableRow className="bg-gray-100">
  //               <TableHead className="w-12 text-center">ردیف</TableHead>
  //               <TableHead className="w-32 text-center">شاسی</TableHead>
  //               <TableHead className="w-32 text-center">تاریخ</TableHead>
  //               <TableHead className="w-32 text-center">قیمت</TableHead>
  //               <TableHead className="w-32 text-center">دلیل تراکنش</TableHead>
  //             </TableRow>
  //           </TableHeader>

  //           <TableBody>
  //             {operatorTransactionsForDisplay.length > 0 ? (
  //               operatorTransactionsForDisplay.map((item, index) => (
  //                 <TableRow
  //                   key={`${item.id}-${index}`}
  //                   className="hover:bg-gray-50"
  //                 >
  //                   <TableCell className="text-center">{item.id}</TableCell>
  //                   <TableCell className="text-center">
  //                     {item.chassisNo}
  //                   </TableCell>
  //                   <TableCell className="text-center">{item.date}</TableCell>
  //                   <TableCell className="text-center">{item.price}</TableCell>
  //                   <TableCell className="text-center">
  //                     {item.transactionReason}
  //                   </TableCell>
  //                 </TableRow>
  //               ))
  //             ) : (
  //               <TableRow>
  //                 <TableCell
  //                   colSpan={6}
  //                   className="text-center text-gray-500 py-4"
  //                 >
  //                   داده‌ای یافت نشد
  //                 </TableCell>
  //               </TableRow>
  //             )}
  //           </TableBody>
  //         </Table>
  //       </div>
  //     </div>
  //   );
  // };

  // const TabsTableOperatorPerformanceReportComponent = () => {
  //   return (
  //     <div className="max-h-[28rem] h-[28rem] overflow-y-auto rounded-md border w-full">
  //       <div className="overflow-x-auto">
  //         <Table className="min-w-max text-right border-collapse">
  //           <TableHeader className="top-0 sticky">
  //             <TableRow className="bg-gray-100">
  //               <TableHead className="w-12 text-center">ردیف</TableHead>
  //               <TableHead className="w-32 text-center">شاسی</TableHead>
  //               <TableHead className="w-32 text-center">تاریخ</TableHead>
  //               <TableHead className="w-32 text-center">قیمت</TableHead>
  //               <TableHead className="w-32 text-center">دلیل تراکنش</TableHead>
  //             </TableRow>
  //           </TableHeader>

  //           <TableBody>
  //             {[].length > 0 ? (
  //               [].map((item, index) => (
  //                 <TableRow
  //                   key={`${item}-${index}`}
  //                   className="hover:bg-gray-50"
  //                 >
  //                   <TableCell className="text-center">{item}</TableCell>
  //                   <TableCell className="text-center">{item}</TableCell>
  //                   <TableCell className="text-center">{item}</TableCell>
  //                   <TableCell className="text-center">{item}</TableCell>
  //                   <TableCell className="text-center">{item}</TableCell>
  //                 </TableRow>
  //               ))
  //             ) : (
  //               <TableRow>
  //                 <TableCell
  //                   colSpan={6}
  //                   className="text-center text-gray-500 py-4"
  //                 >
  //                   داده‌ای یافت نشد
  //                 </TableCell>
  //               </TableRow>
  //             )}
  //           </TableBody>
  //         </Table>
  //       </div>
  //     </div>
  //   );
  // };

  // const tabs = [
  //   {
  //     id: "operationTransaction",
  //     title: "تراکنش های کارگزار",
  //     content: <TabsTableOperationTransactionComponent />,
  //   },
  //   {
  //     id: "operatorPerformanceReport",
  //     title: "جزییات گزارش عملکرد کارگزار",
  //     content: <TabsTableOperatorPerformanceReportComponent />,
  //   },
  // ];

  // // Calculate total count and amount for year
  // const yearlyTotal = React.useMemo(() => {
  //   let totalCount = 0;
  //   let totalAmount = 0;
  //   Object.values(monthlyData).forEach((month) => {
  //     totalCount += month.count;
  //     totalAmount += month.totalAmount;
  //   });
  //   return { totalCount, totalAmount };
  // }, [monthlyData]);

  return (
    <></>
    // <div>
    //   <div className="flex justify-end">
    //     <span className="p-2 bg-gray-200 rounded-t-md text-xs">1404</span>
    //   </div>
    //   <div className="border p-4">
    //     <div className="grid [grid-template-columns:1fr_1fr_1.5fr_1fr_1fr] gap-6 items-start">
    //       <div className="space-y-1">
    //         <h3 className="text-var(--title) text-sm font-bold mb-2 text-blue-900">
    //           انتخاب کارگزار:
    //         </h3>
    //         <Select
    //           value={selectedOperator}
    //           onValueChange={setSelectedOperator}
    //         >
    //           <SelectTrigger className="w-[120px] text-sm">
    //             <SelectValue placeholder="انتخاب کنید" />
    //           </SelectTrigger>
    //           <SelectContent>
    //             <SelectGroup>
    //               {operatorOptions.map((item, index) => (
    //                 <SelectItem key={`${item}-${index}`} value={item}>
    //                   {item}
    //                 </SelectItem>
    //               ))}
    //             </SelectGroup>
    //           </SelectContent>
    //         </Select>
    //       </div>
    //       <div>
    //         <div className="space-y-1 flex items-center gap-4">
    //           <h3 className="text-sm text-blue-900 font-bold">مجموع خرید:</h3>
    //           <p className="text-sm font-medium">
    //             {stats.totalPurchase.toLocaleString("en-US")}
    //           </p>
    //         </div>
    //         <div className="space-y-1 flex items-center gap-4">
    //           <h3 className="text-sm text-blue-900 font-bold">مجموع فروش:</h3>
    //           <p className="text-sm font-medium">
    //             {stats.totalSale.toLocaleString("en-US")}
    //           </p>
    //         </div>
    //       </div>
    //       <div className="flex justify-between items-start">
    //         <div>
    //           <div className="space-y-1 flex items-center gap-4">
    //             <h3 className="text-sm text-blue-900 font-bold">
    //               مجموع سود خرید:
    //             </h3>
    //             <p className="text-sm font-medium">
    //               {stats.totalProfitPurchase.toLocaleString("en-US")}
    //             </p>
    //           </div>
    //           <div>
    //             <div className="space-y-1 flex items-center gap-4">
    //               <h3 className="text-sm text-blue-900 font-bold">
    //                 مجموع سود فروش:
    //               </h3>
    //               <p className="text-sm font-medium">
    //                 {stats.totalProfitSale.toLocaleString("en-US")}
    //               </p>
    //             </div>
    //           </div>
    //         </div>
    //         {/* <div>
    //           <p className="text-sm text-purple-500">
    //             میانگین درصد کارمزد خرید: {stats.avgPercentPurchase}%
    //           </p>
    //           <p className="text-sm text-purple-500">
    //             میانگین درصد کارمزد فروش: {stats.avgPercentSale}%
    //           </p>
    //         </div> */}
    //       </div>
    //       <div className="flex justify-between items-start">
    //         <div>
    //           <div className="space-y-1 flex items-center gap-4">
    //             <h3 className="text-sm text-blue-900 font-bold">
    //               مجموع کارمزد خرید:
    //             </h3>
    //             <p className="text-sm font-medium">
    //               {stats.totalCommissionPurchase.toLocaleString("en-US")}
    //             </p>
    //           </div>
    //           <div>
    //             <div className="space-y-1 flex items-center gap-4">
    //               <h3 className="text-sm text-blue-900 font-bold">
    //                 مجموع کارمزد فروش:
    //               </h3>
    //               <p className="text-sm font-medium">
    //                 {stats.totalCommissionSale.toLocaleString("en-US")}
    //               </p>
    //             </div>
    //           </div>
    //         </div>
    //         {/* <div>
    //           <p className="text-xs text-green-700">
    //             ({stats.avgPercentPurchase})
    //           </p>
    //           <p className="text-xs text-green-700">({stats.avgPercentSale})</p>
    //         </div> */}
    //       </div>
    //       <div>
    //         <div className="space-y-1 flex items-center gap-4">
    //           <h3 className="text-sm text-blue-900 font-bold">
    //             مجموع کل کارمزد:
    //           </h3>
    //           <p className="text-sm font-medium text-purple-600">
    //             {stats.totalCommission.toLocaleString("en-US")}
    //           </p>
    //         </div>
    //         <div>
    //           <div className="space-y-1 flex items-center gap-4">
    //             <h3 className="text-sm text-blue-900 font-bold">
    //               مانده کارمزد:
    //             </h3>
    //             <p className="text-sm font-medium text-red-500">
    //               {stats.remainingCommission.toLocaleString("en-US")}
    //             </p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="grid [grid-template-columns:2fr_1fr] gap-6 items-start mt-7">
    //       <div className="border border-gray-300 p-4 rounded-md relative w-full">
    //         <p className="text-blue-500 absolute left-2 -top-5 bg-white py-2 px-4 font-bold">
    //           گزارش انفرادی کارگزاران
    //         </p>
    //         <div className="grid grid-cols-2 gap-4 items-start mt-5">
    //           <div>
    //             <RadioGroup
    //               value={reportType}
    //               onValueChange={(value) =>
    //                 setReportType(value as "buy" | "sell")
    //               }
    //               className="flex gap-6 justify-end text-blue-500 mb-4"
    //             >
    //               <div className="flex items-center gap-2">
    //                 <RadioGroupItem value="buy" id="r1" />
    //                 <label htmlFor="r1" className="text-blue-500">
    //                   خرید
    //                 </label>
    //               </div>

    //               <div className="flex items-center gap-2">
    //                 <RadioGroupItem value="sell" id="r2" />
    //                 <label htmlFor="r2" className="text-blue-500">
    //                   فروش
    //                 </label>
    //               </div>
    //             </RadioGroup>
    //             <div className="border border-gray-300 p-4 rounded-md relative w-full">
    //               <p className="absolute left-2 -top-5 bg-white py-2 px-4 font-bold">
    //                 گزارش خلاصه عملکرد
    //               </p>
    //               <div className="max-h-[28rem] overflow-y-auto rounded-md w-full grid grid-cols-2 gap-6 items-start p-4">
    //                 <div className="space-y-5">
    //                   {persianMonths.slice(0, 6).map((month, index) => {
    //                     const monthNum = index + 1;
    //                     const monthData = monthlyData[monthNum];
    //                     return (
    //                       <div key={month}>
    //                         <div className="flex gap-4 items-start">
    //                           <p className="text-orange-500 text-sm">{month}</p>
    //                           <p className="text-yellow-900 font-medium text-sm">
    //                             {monthData.count}
    //                           </p>
    //                         </div>
    //                         <p className="font-medium text-sm">
    //                           {monthData.totalAmount.toLocaleString("en-US")}
    //                         </p>
    //                       </div>
    //                     );
    //                   })}
    //                 </div>
    //                 <div className="space-y-5">
    //                   {persianMonths.slice(6, 12).map((month, index) => {
    //                     const monthNum = index + 7;
    //                     const monthData = monthlyData[monthNum];
    //                     return (
    //                       <div key={month}>
    //                         <div className="flex gap-4 items-start">
    //                           <p className="text-blue-500 text-sm">{month}</p>
    //                           <p className="text-yellow-900 font-medium text-sm">
    //                             {monthData.count}
    //                           </p>
    //                         </div>
    //                         <p className="font-medium text-sm">
    //                           {monthData.totalAmount.toLocaleString("en-US")}
    //                         </p>
    //                       </div>
    //                     );
    //                   })}
    //                 </div>
    //               </div>
    //               <hr />
    //               <h4 className="text-green-700 flex justify-end font-semibold text-base my-2">
    //                 اطلاعات کل سال
    //               </h4>
    //               <div className="space-y-3">
    //                 <div className="flex gap-4 items-start justify-between w-full">
    //                   <p className="font-medium">مجموع خرید/فروش شما:</p>
    //                   <p className="font-medium">
    //                     {yearlyTotal.totalAmount.toLocaleString("en-US")}
    //                   </p>
    //                 </div>
    //                 <div className="flex gap-4 items-start justify-between w-full">
    //                   <p className="font-medium">تعداد خرید/فروش:</p>
    //                   <p className="font-medium">
    //                     {yearlyTotal.totalCount.toLocaleString("en-US")}
    //                   </p>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>

    //           <div>
    //             <Tabs
    //               defaultValue="operationTransaction"
    //               orientation="vertical"
    //               className="h-full w-full flex justify-end items-end"
    //               dir="rtl"
    //             >
    //               <TabsList>
    //                 {tabs.map((tab) => (
    //                   <TabsTrigger
    //                     key={tab.id}
    //                     value={tab.id}
    //                     className="bg-gray-100 cursor-pointer"
    //                   >
    //                     {tab.title}
    //                   </TabsTrigger>
    //                 ))}
    //               </TabsList>

    //               {tabs.map((tab) => (
    //                 <TabsContent
    //                   key={tab.id}
    //                   value={tab.id}
    //                   className="w-full bg-white rounded-2xl"
    //                 >
    //                   {tab.content}
    //                 </TabsContent>
    //               ))}
    //             </Tabs>
    //             <div className="flex justify-between items-center mt-4">
    //               <p className="text-blue-700 font-bold">
    //                 مجموع مبالغ پرداخت شده به کارگزار
    //               </p>
    //               <p className="text-green-700 font-bold text-sm">
    //                 {stats.totalPaidToOperator.toLocaleString("en-US")}
    //               </p>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //       <div className="border border-gray-300 p-4 rounded-md relative w-full">
    //         <p className="text-blue-500 absolute left-2 -top-5 bg-white py-2 px-4">
    //           کارگزاران برتر
    //         </p>
    //         <RadioGroup
    //           value={topOperatorsType}
    //           onValueChange={(value) =>
    //             setTopOperatorsType(value as "buy" | "sell")
    //           }
    //           className="flex gap-6 justify-end text-blue-500 mb-4"
    //         >
    //           <div className="flex items-center gap-2">
    //             <RadioGroupItem value="buy" id="r3" />
    //             <label htmlFor="r3" className="text-blue-500">
    //               خرید
    //             </label>
    //           </div>

    //           <div className="flex items-center gap-2">
    //             <RadioGroupItem value="sell" id="r4" />
    //             <label htmlFor="r4" className="text-blue-500">
    //               فروش
    //             </label>
    //           </div>
    //         </RadioGroup>
    //         <div className="border border-gray-300 p-4 rounded-md relative w-full bg-pink-200">
    //           <p className="text-blue-500 absolute left-2 -top-5 py-2 rounded-md bg-pink-200 px-4">
    //             لیست ماهانه
    //           </p>

    //           <div className="w-full">
    //             <p className="text-green-600 font-semibold">
    //               نمایش لیست سالانه
    //             </p>
    //             <div className="grid grid-cols-4 space-y-5 mt-2">
    //               <div>
    //                 {persianMonths.slice(0, 3).map((month) => (
    //                   <div key={month} className="text-sm text-green-600">
    //                     {month}
    //                   </div>
    //                 ))}
    //               </div>
    //               <div>
    //                 {persianMonths.slice(3, 6).map((month) => (
    //                   <div key={month} className="text-sm text-green-600">
    //                     {month}
    //                   </div>
    //                 ))}
    //               </div>
    //               <div>
    //                 {persianMonths.slice(6, 9).map((month) => (
    //                   <div key={month} className="text-sm text-green-600">
    //                     {month}
    //                   </div>
    //                 ))}
    //               </div>
    //               <div>
    //                 {persianMonths.slice(9, 12).map((month) => (
    //                   <div key={month} className="text-sm text-green-600">
    //                     {month}
    //                   </div>
    //                 ))}
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default OperatorsDashboard;
