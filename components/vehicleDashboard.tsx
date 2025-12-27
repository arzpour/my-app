// // "use client";
// // import { useGetChequesByDealId } from "@/apis/mutations/cheques";
// // import { useGetTransactionsByDealId } from "@/apis/mutations/transaction";
// // import { getAllBusinessAccounts } from "@/apis/client/businessAccounts";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import useGetDealsByVin from "@/hooks/useGetDealsByVin";
// // import { setTotalVehicleCost } from "@/redux/slices/carSlice";
// // import { RootState } from "@/redux/store";
// // import {
// //   IBusinessAccounts,
// //   IChequeNew,
// //   IDeal,
// //   ITransactionNew,
// // } from "@/types/new-backend-types";
// // import React from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { useQuery } from "@tanstack/react-query";

// // const VehicleDashboard = () => {
// //   const { chassisNo, selectedDealId } = useSelector(
// //     (state: RootState) => state.cars
// //   );
// //   const [deal, setDeal] = React.useState<IDeal>();
// //   const [transactions, setTransactions] = React.useState<ITransactionNew[]>([]);
// //   const [cheques, setCheques] = React.useState<IChequeNew[] | null>(null);

// //   const dispatch = useDispatch();

// //   const getDealByVin = useGetDealsByVin(chassisNo);
// //   const dealsData = getDealByVin.data;

// //   const getTransactionsByDealId = useGetTransactionsByDealId();
// //   const getChequesByDealId = useGetChequesByDealId();

// //   // Fetch business accounts to map IDs to names
// //   const { data: businessAccounts } = useQuery({
// //     queryKey: ["get-all-business-accounts"],
// //     queryFn: getAllBusinessAccounts,
// //   });

// //   // Create a map from account ID to account name
// //   // Handle both ObjectId strings and numeric IDs
// //   const accountNameMap = React.useMemo(() => {
// //     if (!businessAccounts) return new Map<string, string>();
// //     const map = new Map<string, string>();
// //     businessAccounts.forEach((account) => {
// //       if (account._id) {
// //         const idStr = account._id.toString();
// //         map.set(idStr, account.accountName);
// //         // Also map numeric ID if it's a number
// //         const numericId = parseInt(idStr, 10);
// //         if (!isNaN(numericId)) {
// //           map.set(numericId.toString(), account.accountName);
// //         }
// //       }
// //     });
// //     return map;
// //   }, [businessAccounts]);

// //   const getTransactionsByDealIdHandler = async () => {
// //     if (!deal?._id) return;
// //     try {
// //       const transactions = await getTransactionsByDealId.mutateAsync(
// //         deal?._id.toString() ?? selectedDealId ?? ""
// //       );
// //       setTransactions(transactions);
// //     } catch (error) {
// //       console.log("🚀 ~ getTransactionsByDealIdHandler ~ error:", error);
// //     }
// //   };

// //   const getChequesByDealIdHandler = async () => {
// //     if (!deal?._id) return;
// //     try {
// //       const cheques = await getChequesByDealId.mutateAsync(
// //         deal?._id.toString() ?? selectedDealId ?? ""
// //       );
// //       setCheques(cheques);
// //     } catch (error) {
// //       console.log("🚀 ~ getChequesByDealIdHandler ~ error:", error);
// //     }
// //   };

// //   const isChequePaid = (cheque: IChequeNew): boolean => {
// //     const paidStatuses = ["paid", "پاس شده", "وصول شده", "پاس شده است"];
// //     return paidStatuses.some((status) =>
// //       cheque.status?.toLowerCase().includes(status.toLowerCase())
// //     );
// //   };

// //   const isIssuedCheque = (cheque: IChequeNew): boolean => {
// //     return (
// //       cheque.type === "issued" ||
// //       cheque.type === "صادره" ||
// //       cheque.type?.toLowerCase().includes("issued") ||
// //       cheque.type?.toLowerCase().includes("صادره")
// //     );
// //   };

// //   const isReceivedCheque = (cheque: IChequeNew): boolean => {
// //     return (
// //       cheque.type === "received" ||
// //       cheque.type === "وارده" ||
// //       cheque.type?.toLowerCase().includes("received") ||
// //       cheque.type?.toLowerCase().includes("وارده")
// //     );
// //   };

// //   // Check if transaction is related to a cheque that hasn't been paid yet
// //   // If payment method is "چک", check if there's an unpaid cheque with matching amount and deal
// //   const isTransactionFromUnpaidCheque = (
// //     transaction: ITransactionNew
// //   ): boolean => {
// //     if (!cheques || !deal?._id || transaction.paymentMethod !== "چک") {
// //       return false;
// //     }

// //     const dealIdStr = deal._id.toString();

// //     // Find cheques related to this deal that match the transaction amount
// //     // Match by: same deal ID and same amount (with small tolerance)
// //     const relatedCheques = cheques.filter((c) => {
// //       // Check if cheque is related to this deal
// //       const chequeDealIdMatch =
// //         c.relatedDealId?.toString() === dealIdStr ||
// //         (typeof c.relatedDealId === "number" &&
// //           dealIdStr.includes(c.relatedDealId.toString()));

// //       // Check if amount matches (with small tolerance for floating point)
// //       const amountMatch = Math.abs(c.amount - transaction.amount) < 0.01;

// //       return chequeDealIdMatch && amountMatch;
// //     });

// //     // If any related cheque is unpaid, exclude this transaction
// //     return relatedCheques.some((c) => !isChequePaid(c));
// //   };

// //   // Filter transactions to only show vehicle-related ones
// //   // Payments: "خرید خودرو" or includes "خريد"/"خرید", "درصد کارگزار", "هزینه وسیله"
// //   // Receipts: "فروش"
// //   // Exclude: salary payments (حقوق) and unpaid cheques
// //   const isVehicleRelatedTransaction = (
// //     transaction: ITransactionNew
// //   ): boolean => {
// //     // Exclude salary payments
// //     if (
// //       transaction.reason?.includes("حقوق") ||
// //       transaction.reason?.includes("پرداخت حقوق")
// //     ) {
// //       return false;
// //     }

// //     // For payments, only include: خرید خودرو (or includes "خريد"/"خرید"), درصد کارگزار, هزینه وسیله
// //     if (transaction.type === "پرداخت") {
// //       const reasonNormalized = transaction.reason?.replace(/\s/g, "") || "";
// //       return (
// //         transaction.reason === "خرید خودرو" ||
// //         transaction.reason?.includes("خريد") ||
// //         transaction.reason?.includes("خرید") ||
// //         transaction.reason === "درصد کارگزار" ||
// //         reasonNormalized.includes("هزینهوسیله") ||
// //         reasonNormalized.includes("هزينهوسیله")
// //       );
// //     }

// //     // For receipts, only include: فروش
// //     if (transaction.type === "دریافت") {
// //       return transaction.reason === "فروش";
// //     }

// //     // For investment transactions, include them
// //     if (
// //       transaction.type === "افزایش سرمایه" ||
// //       transaction.type === "برداشت سرمایه" ||
// //       transaction.reason === "افزایش سرمایه" ||
// //       transaction.reason === "کاهش سرمایه"
// //     ) {
// //       return true;
// //     }

// //     return false;
// //   };

// //   // Filter transactions: vehicle-related and not from unpaid cheques
// //   const filteredTransactions = React.useMemo(() => {
// //     if (!transactions || transactions.length === 0) return [];
// //     return transactions.filter(
// //       (t) => isVehicleRelatedTransaction(t) && !isTransactionFromUnpaidCheque(t)
// //     );
// //   }, [transactions, cheques, deal]);

// //   // Calculate cheque totals
// //   // Total issued cheques unpaid
// //   const totalIssuedChequesUnpaid =
// //     cheques
// //       ?.filter((c) => isIssuedCheque(c) && !isChequePaid(c))
// //       .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

// //   // Total issued cheques paid
// //   const totalIssuedChequesPaid =
// //     cheques
// //       ?.filter((c) => isIssuedCheque(c) && isChequePaid(c))
// //       .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

// //   // Total received cheques unpaid
// //   const totalReceivedChequesUnpaid =
// //     cheques
// //       ?.filter((c) => isReceivedCheque(c) && !isChequePaid(c))
// //       .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

// //   // Total received cheques paid
// //   const totalReceivedChequesPaid =
// //     cheques
// //       ?.filter((c) => isReceivedCheque(c) && isChequePaid(c))
// //       .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

// //   // const totalPaidToSellerAndOperator =
// //   //   transactions
// //   //     ?.filter(
// //   //       (t) =>
// //   //         (t.type === "پرداخت" && t.reason === "خريد") ||
// //   //         (t.type === "پرداخت" && t.reason === "درصد کارگزار")
// //   //     )
// //   //     .reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

// //   // Filter transactions for display
// //   const paidTransactions = filteredTransactions?.filter(
// //     (t) => t.type === "پرداخت"
// //   );
// //   const receivedTransactions = filteredTransactions?.filter(
// //     (t) => t.type === "دریافت"
// //   );

// //   // Calculate totals from filtered transactions
// //   // totalPaidToSeller: payments for purchase (خرید خودرو or includes "خريد"/"خرید")
// //   const totalPaidToSeller =
// //     paidTransactions
// //       ?.filter(
// //         (t) =>
// //           t.reason === "خرید خودرو" ||
// //           t.reason?.includes("خريد") ||
// //           t.reason?.includes("خرید")
// //       )
// //       ?.reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

// //   const totalPaidToSellerWithoutFilter =
// //     paidTransactions?.reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

// //   const totalReceived =
// //     receivedTransactions?.reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

// //   const remainingForBuyer =
// //     deal?.salePrice && totalReceived ? deal?.salePrice - totalReceived : 0;

// //   const totalPaidToBroker =
// //     paidTransactions
// //       ?.filter((t) => t.reason === "درصد کارگزار")
// //       .reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

// //   // const otherCostCategories =
// //   //   deal?.directCosts?.otherCost?.map((cost) => cost.category) || [];
// //   // const otherCostsFromDirectCosts =
// //   //   deal?.directCosts?.otherCost?.reduce(
// //   //     (sum, cost) => sum + (cost.cost || 0),
// //   //     0
// //   //   ) || 0;
// //   // const otherCostsFromTransactions =
// //   //   transactions
// //   //     ?.filter(
// //   //       (t) =>
// //   //         t.type === "پرداخت" &&
// //   //         otherCostCategories.some((category) => t.reason === category)
// //   //     )
// //   //     .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
// //   const vehicleCosts =
// //     paidTransactions
// //       ?.filter(
// //         (t) =>
// //           t.reason?.replace(/\s/g, "").includes("هزینهوسیله") ||
// //           t.reason?.replace(/\s/g, "").includes("هزينهوسیله")
// //       )
// //       .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

// //   const remainingToSeller =
// //     deal?.purchasePrice && totalPaidToSeller
// //       ? deal.purchasePrice - totalPaidToSeller
// //       : deal?.purchasePrice || 0;

// //   // const totalBrokerPercentage =
// //   //   deal?.partnerships?.reduce(
// //   //     (sum, p) => sum + (p.profitSharePercentage || 0),
// //   //     0
// //   //   ) || 0;

// //   const investmentTransactions = filteredTransactions?.filter(
// //     (t) =>
// //       t.reason === "افزایش سرمایه" ||
// //       t.reason === "کاهش سرمایه" ||
// //       t.type === "افزایش سرمایه" ||
// //       t.type === "برداشت سرمایه"
// //   );

// //   const totalPaidForInvestment =
// //     investmentTransactions
// //       ?.filter((t) => t.type === "پرداخت")
// //       .reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

// //   const totalReceivedForInvestment =
// //     investmentTransactions
// //       ?.filter((t) => t.type === "دریافت")
// //       .reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

// //   React.useEffect(() => {
// //     getTransactionsByDealIdHandler();
// //     getChequesByDealIdHandler();
// //   }, [deal?._id, selectedDealId]);

// //   React.useEffect(() => {
// //     if (dealsData?.length === 1) {
// //       setDeal(dealsData[0]);
// //     } else if (dealsData?.length && dealsData?.length > 1) {
// //       const selectedDeal = dealsData?.find(
// //         (deal) => deal._id.toString() === selectedDealId
// //       );
// //       setDeal(selectedDeal ?? undefined);
// //     }
// //   }, [dealsData, selectedDealId]);

// //   return (
// //     <>
// //       <div className="my-5 mb-7">
// //         <div className="w-full flex justify-center gap-4">
// //           <div className="h-[28rem] max-h-[28rem] border border-gray-300 p-4 rounded-md relative w-full">
// //             <p className="text-red-500 absolute right-2 -top-5 bg-white py-2 px-4">
// //               پرداخت های شما
// //             </p>
// //             <div className="h-[22rem] max-h-[22rem] overflow-y-auto rounded-md border w-full">
// //               <Table className="min-w-full table-fixed text-right border-collapse">
// //                 <TableHeader className="top-0 sticky">
// //                   <TableRow className="bg-gray-100">
// //                     <TableHead className="w-12 text-center">ردیف</TableHead>
// //                     <TableHead className="w-12 text-center">تاریخ</TableHead>
// //                     <TableHead className="w-12 text-center">مبلغ</TableHead>
// //                     <TableHead className="w-12 text-center">
// //                       دلیل تراکنش
// //                     </TableHead>
// //                     <TableHead className="w-12 text-center">
// //                       روش پرداخت
// //                     </TableHead>
// //                     <TableHead className="w-12 text-center">
// //                       حساب مبدا
// //                     </TableHead>
// //                   </TableRow>
// //                 </TableHeader>

// //                 <TableBody>
// //                   {paidTransactions &&
// //                     paidTransactions?.length > 0 &&
// //                     paidTransactions?.map((item, index) => {
// //                       const totalVehicleCost = paidTransactions
// //                         ?.filter(
// //                           (item) =>
// //                             item?.reason
// //                               ?.replace(/\s/g, "")
// //                               .includes("هزینهوسیله") ||
// //                             item?.reason
// //                               ?.replace(/\s/g, "")
// //                               .includes("هزينهوسیله")
// //                         )
// //                         ?.reduce((sum, item) => sum + (item.amount || 0), 0);

// //                       dispatch(setTotalVehicleCost(totalVehicleCost));

// //                       return (
// //                         <TableRow
// //                           key={`${item?._id}-${index}`}
// //                           className="hover:bg-gray-50"
// //                         >
// //                           <TableCell className="text-center">
// //                             {index + 1}
// //                           </TableCell>
// //                           <TableCell className="text-center">
// //                             {item?.transactionDate ?? ""}
// //                           </TableCell>
// //                           <TableCell className="text-center">
// //                             {item?.amount?.toLocaleString("en-US") ?? ""}
// //                           </TableCell>
// //                           <TableCell className="text-center">
// //                             {item?.reason ?? ""}
// //                           </TableCell>
// //                           <TableCell className="text-center">
// //                             {item?.paymentMethod ?? ""}
// //                           </TableCell>
// //                           <TableCell className="text-center">
// //                             {item?.bussinessAccountId
// //                               ? accountNameMap.get(item.bussinessAccountId) ||
// //                                 item.bussinessAccountId
// //                               : ""}
// //                           </TableCell>
// //                         </TableRow>
// //                       );
// //                     })}
// //                 </TableBody>
// //               </Table>
// //             </div>
// //             <div className="grid grid-cols-5 gap-3 items-start space-y-0">
// //               <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
// //                 <p className="text-xs">مجموع</p>
// //                 <p className="text-red-500 text-xs">
// //                   {totalPaidToSellerWithoutFilter
// //                     ? totalPaidToSellerWithoutFilter.toLocaleString("en-US")
// //                     : 0}
// //                 </p>
// //               </div>
// //               <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
// //                 <p className="text-xs">مجموع به طرف اول</p>
// //                 <p className="font-bold text-xs">
// //                   {totalPaidToSeller
// //                     ? totalPaidToSeller.toLocaleString("en-US")
// //                     : 0}
// //                 </p>
// //               </div>
// //               <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
// //                 <p className="text-xs">مجموع به کارگزار</p>
// //                 <p className="font-bold text-xs">
// //                   {totalPaidToBroker
// //                     ? totalPaidToBroker.toLocaleString("en-US")
// //                     : 0}
// //                 </p>
// //               </div>
// //               <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
// //                 <p className="text-xs">مجموع هزینه</p>
// //                 <p className="font-bold text-xs">
// //                   {vehicleCosts ? vehicleCosts.toLocaleString("en-US") : 0}
// //                 </p>
// //               </div>
// //               <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
// //                 <p className="text-xs">مانده</p>
// //                 <p className="font-bold text-xs">
// //                   {typeof remainingToSeller === "number"
// //                     ? remainingToSeller.toLocaleString("en-US")
// //                     : remainingToSeller ?? 0}
// //                 </p>
// //               </div>

// //               {/* <div>
// //                 <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
// //                   <p className="text-xs">مانده مبلغ قابل پرداخت به فروشنده</p>
// //                   <p className="font-bold text-sm">
// //                     {typeof remainingToSeller === "number"
// //                       ? remainingToSeller.toLocaleString("en-US")
// //                       : remainingToSeller ?? 0}
// //                   </p>
// //                 </div>
// //                 <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
// //                   <p className="text-xs">
// //                     مجموع پرداختی به فروشنده و کارگزاران
// //                   </p>
// //                   <p className="text-red-500 text-sm">
// //                     {totalPaidToSellerAndOperator
// //                       ? totalPaidToSellerAndOperator.toLocaleString("en-US")
// //                       : 0}
// //                   </p>
// //                 </div>
// //               </div>
// //               <div>
// //                 <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
// //                   <p className="text-xs">مجموع پرداختی به فروشنده</p>
// //                   <p className="text-red-500 text-sm">
// //                     {totalPaidToSeller
// //                       ? totalPaidToSeller.toLocaleString("en-US")
// //                       : 0}
// //                   </p>
// //                 </div>
// //                 <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
// //                   <p className="text-xs">مجموع کل پرداختی</p>
// //                   <p className="text-xs">مجموع</p>
// //                   <p className="text-red-500 text-sm">
// //                     {totalPaidToSellerWithoutFilter
// //                       ? totalPaidToSellerWithoutFilter.toLocaleString("en-US")
// //                       : 0}
// //                   </p>
// //                 </div>
// //               </div> */}
// //             </div>
// //           </div>

// //           <div className="h-[28rem] max-h-[28rem] border border-gray-300 p-4 rounded-md relative w-full">
// //             <p className="text-green-500 absolute right-2 -top-5 bg-white py-2 px-4">
// //               دریافت های شما
// //             </p>
// //             <div className="h-[22rem] max-h-[22rem] overflow-y-auto rounded-md border w-full">
// //               <Table className="min-w-full table-fixed text-right border-collapse">
// //                 <TableHeader className="top-0 sticky">
// //                   <TableRow className="hover:bg-transparent bg-gray-100">
// //                     <TableHead className="w-12 text-center">ردیف</TableHead>
// //                     <TableHead className="w-12 text-center">تاریخ</TableHead>
// //                     <TableHead className="w-12 text-center">مبلغ</TableHead>
// //                     <TableHead className="w-12 text-center">
// //                       دلیل تراکنش
// //                     </TableHead>
// //                     <TableHead className="w-12 text-center">
// //                       روش پرداخت
// //                     </TableHead>
// //                     <TableHead className="w-12 text-center">
// //                       حساب مبدا
// //                     </TableHead>
// //                   </TableRow>
// //                 </TableHeader>
// //                 <TableBody>
// //                   {receivedTransactions &&
// //                     receivedTransactions.length > 0 &&
// //                     receivedTransactions?.map((item, index) => (
// //                       <TableRow
// //                         key={`${item?._id}-${index}`}
// //                         className="hover:bg-gray-50"
// //                       >
// //                         <TableCell className="text-center">
// //                           {index + 1}
// //                         </TableCell>
// //                         <TableCell className="text-center">
// //                           {item?.transactionDate ?? ""}
// //                         </TableCell>
// //                         <TableCell className="text-center">
// //                           {item?.amount?.toLocaleString("en-US") ?? ""}
// //                         </TableCell>
// //                         <TableCell className="text-center">
// //                           {item?.reason ?? ""}
// //                         </TableCell>
// //                         <TableCell className="text-center">
// //                           {item?.paymentMethod ?? ""}
// //                         </TableCell>
// //                         <TableCell className="text-center">
// //                           {item?.bussinessAccountId
// //                             ? accountNameMap.get(item.bussinessAccountId) ||
// //                               item.bussinessAccountId
// //                             : ""}
// //                         </TableCell>
// //                       </TableRow>
// //                     ))}
// //                 </TableBody>
// //               </Table>
// //             </div>
// //             <div className="grid grid-cols-2 gap-3 items-center mt-3">
// //               <div className="flex gap-3 items-center">
// //                 {/* <p className="text-xs">مانده مبلغ قابل دریافت از خریدار</p> */}
// //                 <span className="text-xs">مانده</span>
// //                 <span className="font-bold text-xs">
// //                   {typeof remainingForBuyer === "number"
// //                     ? remainingForBuyer.toLocaleString("en-US")
// //                     : 0}
// //                 </span>
// //               </div>

// //               <div className="flex gap-3 items-center">
// //                 {/* <p className="text-xs">مجموع دریافتی از خریدار</p> */}
// //                 <span className="text-xs">مجموع</span>
// //                 <span className="text-green-500 text-xs">
// //                   {totalReceived ? totalReceived.toLocaleString("en-US") : 0}
// //                 </span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="mt-7">
// //         <div className="w-full flex justify-center gap-4">
// //           <div className="h-[18rem] max-h-[18rem] border border-gray-300 p-4 rounded-md relative w-full">
// //             <p className="text-blue-300 absolute right-2 -top-5 bg-white py-2 px-4">
// //               افزایش/کاهش سرمایه
// //             </p>
// //             <div className="h-[14rem] max-h-[14rem] overflow-y-auto rounded-md border w-full">
// //               <Table
// //                 className="min-w-full table-fixed text-right border-collapse"
// //                 dir="rtl"
// //               >
// //                 <TableHeader className="top-0 sticky">
// //                   <TableRow className="hover:bg-transparent bg-gray-100">
// //                     <TableHead className="text-center">ردیف</TableHead>
// //                     <TableHead className="text-center">تاریخ</TableHead>
// //                     <TableHead className="text-center">مبلغ</TableHead>
// //                     <TableHead className="text-center">شریک</TableHead>
// //                     <TableHead className="text-center">دلیل تراکنش</TableHead>
// //                     <TableHead className="text-center">روش پرداخت</TableHead>
// //                     <TableHead className="text-center">حساب مبدا</TableHead>
// //                   </TableRow>
// //                 </TableHeader>

// //                 <TableBody>
// //                   {deal?.partnerships && deal.partnerships.length > 0
// //                     ? deal.partnerships.map((partnership, index) => {
// //                         const relatedTransaction = transactions?.find(
// //                           (t) =>
// //                             t.type === "پرداخت" &&
// //                             t.personId?.toString() ===
// //                               partnership.partner.personId
// //                         );

// //                         return (
// //                           <TableRow
// //                             key={`${partnership.partner.personId}-${index}`}
// //                             className="hover:bg-gray-50"
// //                           >
// //                             <TableCell className="text-center">
// //                               {index + 1}
// //                             </TableCell>
// //                             <TableCell className="text-center">
// //                               {relatedTransaction?.transactionDate ||
// //                                 deal.createdAt?.split("T")[0] ||
// //                                 ""}
// //                             </TableCell>
// //                             <TableCell className="text-center">
// //                               {partnership.investmentAmount
// //                                 ? partnership.investmentAmount.toLocaleString(
// //                                     "en-US"
// //                                   )
// //                                 : ""}
// //                             </TableCell>
// //                             <TableCell className="text-center">
// //                               {partnership.partner.name || ""}
// //                             </TableCell>
// //                             <TableCell className="text-center">
// //                               {partnership.profitSharePercentage
// //                                 ? `${(
// //                                     partnership.profitSharePercentage * 100
// //                                   ).toFixed(2)}%`
// //                                 : ""}
// //                             </TableCell>
// //                             <TableCell className="text-center">
// //                               {partnership.investmentAmount > 0
// //                                 ? "اصل شرکت"
// //                                 : "سود شراکت"}
// //                             </TableCell>
// //                             <TableCell className="text-center">
// //                               {relatedTransaction?.paymentMethod || ""}
// //                             </TableCell>
// //                             <TableCell className="text-center">
// //                               {relatedTransaction?.bussinessAccountId
// //                                 ? accountNameMap.get(
// //                                     relatedTransaction.bussinessAccountId
// //                                   ) || relatedTransaction.bussinessAccountId
// //                                 : ""}
// //                             </TableCell>
// //                           </TableRow>
// //                         );
// //                       })
// //                     : null}
// //                 </TableBody>
// //               </Table>
// //             </div>
// //             <div className="flex gap-3 items-center justify-between mt-3">
// //               <p className="flex gap-2 items-center">
// //                 <span className="text-xs">مجموع دریافتی</span>
// //                 <span className="text-xs">
// //                   {totalReceivedForInvestment
// //                     ? totalReceivedForInvestment?.toLocaleString("en-US")
// //                     : 0}
// //                 </span>
// //               </p>
// //               <p className="flex gap-2 items-center">
// //                 <span className="text-xs">مجموع پرداختی</span>
// //                 <span className="text-xs">
// //                   {totalPaidForInvestment
// //                     ? totalPaidForInvestment?.toLocaleString("en-US")
// //                     : 0}
// //                 </span>
// //               </p>
// //             </div>
// //           </div>

// //           <div className="h-[18rem] max-h-[18rem] border border-gray-300 p-4 rounded-md relative w-full">
// //             <p className="text-blue-300 absolute right-2 -top-5 bg-white py-2 px-4">
// //               چک های صادره و وارده
// //             </p>
// //             <div className="h-[14rem] max-h-[14rem] overflow-y-auto rounded-md border w-full">
// //               <Table className="min-w-full table-fixed text-right border-collapse">
// //                 <TableHeader className="top-0 sticky">
// //                   <TableRow className="hover:bg-transparent bg-gray-100">
// //                     <TableHead className="text-center w-[30%]">ردیف</TableHead>
// //                     <TableHead className="text-center w-[50%]">
// //                       نوع چک
// //                     </TableHead>
// //                     <TableHead className="text-center w-[50%]">
// //                       نام مشتری
// //                     </TableHead>
// //                     <TableHead className="text-center w-[50%]">مبلغ</TableHead>
// //                     <TableHead className="text-center w-[50%]">
// //                       سررسید
// //                     </TableHead>
// //                     <TableHead className="text-center w-[50%]">وضعیت</TableHead>
// //                     <TableHead className="text-center w-[50%]">
// //                       شناسه صیادی
// //                     </TableHead>
// //                     <TableHead className="text-center w-[50%]">
// //                       سریال چک
// //                     </TableHead>
// //                   </TableRow>
// //                 </TableHeader>
// //                 <TableBody>
// //                   {cheques && cheques.length > 0
// //                     ? cheques?.map((item, index) => (
// //                         <TableRow
// //                           key={`${item?._id}-${index}`}
// //                           className="has-data-[state=checked]:bg-muted/50"
// //                         >
// //                           <TableCell className="text-center">
// //                             {index + 1}
// //                           </TableCell>
// //                           <TableCell className="text-center">
// //                             {item?.type}
// //                           </TableCell>
// //                           <TableCell className="text-center">
// //                             {item?.payer?.fullName}
// //                           </TableCell>
// //                           <TableCell className="text-center">
// //                             {item?.amount?.toLocaleString("en-US") ?? ""}
// //                           </TableCell>
// //                           <TableCell className="text-center">
// //                             {item?.dueDate}
// //                           </TableCell>
// //                           <TableCell className="text-center">
// //                             {item?.status}
// //                           </TableCell>
// //                           <TableCell className="text-center">
// //                             {item?.sayadiID ?? ""}
// //                           </TableCell>
// //                           <TableCell className="text-center">
// //                             {item?.chequeNumber}
// //                           </TableCell>
// //                         </TableRow>
// //                       ))
// //                     : null}

// //                   {[].length > 0
// //                     ? []?.map((item, index) => (
// //                         <TableRow
// //                           key={`${item}-${index}`}
// //                           className="has-data-[state=checked]:bg-muted/50"
// //                         >
// //                           <TableCell className="text-center">
// //                             {index + 1}
// //                           </TableCell>
// //                           <TableCell className="text-center">{item}</TableCell>
// //                           <TableCell className="text-center">
// //                             {item ?? ""}
// //                           </TableCell>
// //                           <TableCell className="text-center">{item}</TableCell>
// //                           <TableCell className="text-center">{item}</TableCell>
// //                           <TableCell className="text-center">{item}</TableCell>
// //                           <TableCell className="text-center">{item}</TableCell>
// //                           <TableCell className="text-center">{item}</TableCell>
// //                         </TableRow>
// //                       ))
// //                     : null}
// //                 </TableBody>
// //               </Table>
// //             </div>
// //             <div className="flex gap-3 items-center justify-end mt-3">
// //               <p className="flex gap-2 items-center">
// //                 <span className="text-xs">مجموع چک های صادره وصول نشده</span>
// //                 <span className="text-xs">
// //                   {totalIssuedChequesUnpaid
// //                     ? totalIssuedChequesUnpaid?.toLocaleString("en-US")
// //                     : 0}
// //                 </span>
// //               </p>
// //               <p className="flex gap-2 items-center">
// //                 <span className="text-xs">مجموع چک های صادره وصول شده</span>
// //                 <span className="text-xs">
// //                   {totalIssuedChequesPaid
// //                     ? totalIssuedChequesPaid?.toLocaleString("en-US")
// //                     : 0}
// //                 </span>
// //               </p>
// //               <p className="flex gap-2 items-center">
// //                 <span className="text-xs">مجموع چک های وارده وصول نشده</span>
// //                 <span className="text-xs">
// //                   {totalReceivedChequesUnpaid
// //                     ? totalReceivedChequesUnpaid?.toLocaleString("en-US")
// //                     : 0}
// //                 </span>
// //               </p>
// //               <p className="flex gap-2 items-center">
// //                 <span className="text-xs">مجموع چک های وارده وصول شده</span>
// //                 <span className="text-xs">
// //                   {totalReceivedChequesPaid
// //                     ? totalReceivedChequesPaid?.toLocaleString("en-US")
// //                     : 0}
// //                 </span>
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default VehicleDashboard;

// "use client";
// import { useGetChequesByDealId } from "@/apis/mutations/cheques";
// import { useGetTransactionsByDealId } from "@/apis/mutations/transaction";
// import { getAllBusinessAccounts } from "@/apis/client/businessAccounts";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import useGetDealsByVin from "@/hooks/useGetDealsByVin";
// import { setTotalVehicleCost } from "@/redux/slices/carSlice";
// import { RootState } from "@/redux/store";
// import { IChequeNew, IDeal, ITransactionNew } from "@/types/new-backend-types";
// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useQuery } from "@tanstack/react-query";

// const VehicleDashboard = () => {
//   const { chassisNo, selectedDealId } = useSelector(
//     (state: RootState) => state.cars
//   );
//   const [deal, setDeal] = React.useState<IDeal>();
//   const [transactions, setTransactions] = React.useState<ITransactionNew[]>([]);
//   const [cheques, setCheques] = React.useState<IChequeNew[] | null>(null);

//   const dispatch = useDispatch();

//   const getDealByVin = useGetDealsByVin(chassisNo);
//   const dealsData = getDealByVin.data;

//   const getTransactionsByDealId = useGetTransactionsByDealId();
//   const getChequesByDealId = useGetChequesByDealId();

//   const { data: businessAccounts } = useQuery({
//     queryKey: ["get-all-business-accounts"],
//     queryFn: getAllBusinessAccounts,
//   });

//   const accountNameMap = React.useMemo(() => {
//     if (!businessAccounts) return new Map<string, string>();
//     const map = new Map<string, string>();
//     businessAccounts.forEach((account) => {
//       if (account._id) {
//         const idStr = account._id.toString();
//         map.set(idStr, account.accountName);
//         const numericId = parseInt(idStr, 10);
//         if (!isNaN(numericId)) {
//           map.set(numericId.toString(), account.accountName);
//         }
//       }
//     });
//     return map;
//   }, [businessAccounts]);

//   const getTransactionsByDealIdHandler = async () => {
//     if (!deal?._id) return;
//     try {
//       const transactions = await getTransactionsByDealId.mutateAsync(
//         deal?._id.toString() ?? selectedDealId ?? ""
//       );
//       setTransactions(transactions);
//     } catch (error) {
//       console.log("🚀 ~ getTransactionsByDealIdHandler ~ error:", error);
//     }
//   };

//   const getChequesByDealIdHandler = async () => {
//     if (!deal?._id) return;
//     try {
//       const cheques = await getChequesByDealId.mutateAsync(
//         deal?._id.toString() ?? selectedDealId ?? ""
//       );
//       setCheques(cheques);
//     } catch (error) {
//       console.log("🚀 ~ getChequesByDealIdHandler ~ error:", error);
//     }
//   };

//   const isChequePaid = (cheque: IChequeNew): boolean => {
//     const paidStatuses = ["paid", "پاس شده", "وصول شده", "پاس شده است"];
//     return paidStatuses.some((status) =>
//       cheque.status?.toLowerCase().includes(status.toLowerCase())
//     );
//   };

//   const isIssuedCheque = (cheque: IChequeNew): boolean => {
//     return (
//       cheque.type === "issued" ||
//       cheque.type === "صادره" ||
//       cheque.type?.toLowerCase().includes("issued") ||
//       cheque.type?.toLowerCase().includes("صادره")
//     );
//   };

//   const isReceivedCheque = (cheque: IChequeNew): boolean => {
//     return (
//       cheque.type === "received" ||
//       cheque.type === "وارده" ||
//       cheque.type?.toLowerCase().includes("received") ||
//       cheque.type?.toLowerCase().includes("وارده")
//     );
//   };

//   const isTransactionFromUnpaidCheque = (
//     transaction: ITransactionNew
//   ): boolean => {
//     if (!cheques || !deal?._id || transaction.paymentMethod !== "چک") {
//       return false;
//     }

//     const dealIdStr = deal._id.toString();

//     const relatedCheques = cheques.filter((c) => {
//       const chequeDealIdMatch =
//         c.relatedDealId?.toString() === dealIdStr ||
//         (typeof c.relatedDealId === "number" &&
//           dealIdStr.includes(c.relatedDealId.toString()));

//       const amountMatch = Math.abs(c.amount - transaction.amount) < 0.01;

//       return chequeDealIdMatch && amountMatch;
//     });

//     return relatedCheques.some((c) => !isChequePaid(c));
//   };

//   const isVehicleRelatedTransaction = (
//     transaction: ITransactionNew
//   ): boolean => {
//     if (
//       transaction.reason?.includes("حقوق") ||
//       transaction.reason?.includes("پرداخت حقوق")
//     ) {
//       return false;
//     }

//     if (transaction.type === "پرداخت") {
//       const reasonNormalized = transaction.reason?.replace(/\s/g, "") || "";
//       return (
//         transaction.reason === "خرید خودرو" ||
//         transaction.reason?.includes("خريد") ||
//         transaction.reason?.includes("خرید") ||
//         transaction.reason === "درصد کارگزار" ||
//         reasonNormalized.includes("هزینهوسیله") ||
//         reasonNormalized.includes("هزينهوسیله")
//       );
//     }

//     if (transaction.type === "دریافت") {
//       return transaction.reason === "فروش";
//     }

//     if (
//       transaction.type === "افزایش سرمایه" ||
//       transaction.type === "برداشت سرمایه" ||
//       transaction.reason === "افزایش سرمایه" ||
//       transaction.reason === "کاهش سرمایه"
//     ) {
//       return true;
//     }

//     return false;
//   };

//   const filteredTransactions = React.useMemo(() => {
//     if (!transactions || transactions.length === 0) return [];
//     return transactions.filter(
//       (t) => isVehicleRelatedTransaction(t) && !isTransactionFromUnpaidCheque(t)
//     );
//   }, [transactions, cheques, deal]);

//   const unpaidCheques = React.useMemo(() => {
//     if (!cheques || cheques.length === 0) return [];
//     return cheques.filter((c) => !isChequePaid(c));
//   }, [cheques]);

//   const totalIssuedChequesUnpaid =
//     unpaidCheques
//       ?.filter((c) => isIssuedCheque(c))
//       .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

//   const totalIssuedChequesPaid =
//     cheques
//       ?.filter((c) => isIssuedCheque(c) && isChequePaid(c))
//       .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

//   const totalReceivedChequesUnpaid =
//     unpaidCheques
//       ?.filter((c) => isReceivedCheque(c))
//       .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

//   const totalReceivedChequesPaid =
//     cheques
//       ?.filter((c) => isReceivedCheque(c) && isChequePaid(c))
//       .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

//   const paidTransactions = filteredTransactions?.filter(
//     (t) => t.type === "پرداخت"
//   );
//   const receivedTransactions = filteredTransactions?.filter(
//     (t) => t.type === "دریافت"
//   );

//   const totalPaidToSeller =
//     paidTransactions
//       ?.filter(
//         (t) =>
//           t.reason === "خرید خودرو" ||
//           t.reason?.includes("خريد") ||
//           t.reason?.includes("خرید")
//       )
//       ?.reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

//   const totalPaidToSellerWithoutFilter =
//     paidTransactions?.reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

//   const totalReceived =
//     receivedTransactions?.reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

//   const remainingForBuyer =
//     deal?.salePrice && totalReceived ? deal?.salePrice - totalReceived : 0;

//   const totalPaidToBroker =
//     paidTransactions
//       ?.filter((t) => t.reason === "درصد کارگزار")
//       .reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

//   const vehicleCosts =
//     paidTransactions
//       ?.filter(
//         (t) =>
//           t.reason?.replace(/\s/g, "").includes("هزینهوسیله") ||
//           t.reason?.replace(/\s/g, "").includes("هزينهوسیله")
//       )
//       .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

//   const remainingToSeller =
//     deal?.purchasePrice && totalPaidToSeller
//       ? deal.purchasePrice - totalPaidToSeller
//       : deal?.purchasePrice || 0;

//   const investmentTransactions = filteredTransactions?.filter(
//     (t) =>
//       t.reason === "افزایش سرمایه" ||
//       t.reason === "کاهش سرمایه" ||
//       t.type === "افزایش سرمایه" ||
//       t.type === "برداشت سرمایه"
//   );

//   const totalPaidForInvestment =
//     investmentTransactions
//       ?.filter((t) => t.type === "پرداخت")
//       .reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

//   const totalReceivedForInvestment =
//     investmentTransactions
//       ?.filter((t) => t.type === "دریافت")
//       .reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

//   React.useEffect(() => {
//     getTransactionsByDealIdHandler();
//     getChequesByDealIdHandler();
//   }, [deal?._id, selectedDealId]);

//   React.useEffect(() => {
//     if (dealsData?.length === 1) {
//       setDeal(dealsData[0]);
//     } else if (dealsData?.length && dealsData?.length > 1) {
//       const selectedDeal = dealsData?.find(
//         (deal) => deal._id.toString() === selectedDealId
//       );
//       setDeal(selectedDeal ?? undefined);
//     }
//   }, [dealsData, selectedDealId]);

//   return (
//     <>
//       <div className="my-5 mb-7">
//         <div className="w-full flex justify-center gap-4">
//           <div className="h-[28rem] max-h-[28rem] border border-gray-300 p-4 rounded-md relative w-full">
//             <p className="text-red-500 absolute right-2 -top-5 bg-white py-2 px-4">
//               پرداخت های شما
//             </p>
//             <div className="h-[22rem] max-h-[22rem] overflow-y-auto rounded-md border w-full">
//               <Table className="min-w-full table-fixed text-right border-collapse">
//                 <TableHeader className="top-0 sticky">
//                   <TableRow className="bg-gray-100">
//                     <TableHead className="w-12 text-center">ردیف</TableHead>
//                     <TableHead className="w-12 text-center">تاریخ</TableHead>
//                     <TableHead className="w-12 text-center">مبلغ</TableHead>
//                     <TableHead className="w-12 text-center">
//                       دلیل تراکنش
//                     </TableHead>
//                     <TableHead className="w-12 text-center">
//                       روش پرداخت
//                     </TableHead>
//                     <TableHead className="w-12 text-center">
//                       حساب مبدا
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {paidTransactions &&
//                     paidTransactions?.length > 0 &&
//                     paidTransactions?.map((item, index) => {
//                       const totalVehicleCost = paidTransactions
//                         ?.filter(
//                           (item) =>
//                             item?.reason
//                               ?.replace(/\s/g, "")
//                               .includes("هزینهوسیله") ||
//                             item?.reason
//                               ?.replace(/\s/g, "")
//                               .includes("هزينهوسیله")
//                         )
//                         ?.reduce((sum, item) => sum + (item.amount || 0), 0);

//                       dispatch(setTotalVehicleCost(totalVehicleCost));

//                       return (
//                         <TableRow
//                           key={`${item?._id}-${index}`}
//                           className="hover:bg-gray-50"
//                         >
//                           <TableCell className="text-center">
//                             {index + 1}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item?.transactionDate ?? ""}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item?.amount?.toLocaleString("en-US") ?? ""}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item?.reason ?? ""}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item?.paymentMethod ?? ""}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item?.bussinessAccountId
//                               ? accountNameMap.get(item.bussinessAccountId) ||
//                                 item.bussinessAccountId
//                               : ""}
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
//                 </TableBody>
//               </Table>
//             </div>
//             <div className="flex justify-between gap-3 items-start space-y-0 mt-5">
//               <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-start gap-3">
//                 <p className="text-xs">مجموع</p>
//                 <p className="text-red-500 text-xs">
//                   {totalPaidToSellerWithoutFilter
//                     ? totalPaidToSellerWithoutFilter.toLocaleString("en-US")
//                     : 0}
//                 </p>
//               </div>
//               <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-start gap-3">
//                 <p className="text-xs">مجموع به طرف اول</p>
//                 <p className="font-bold text-xs">
//                   {totalPaidToSeller
//                     ? totalPaidToSeller.toLocaleString("en-US")
//                     : 0}
//                 </p>
//               </div>
//               <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-start gap-3">
//                 <p className="text-xs">مجموع به کارگزار</p>
//                 <p className="font-bold text-xs">
//                   {totalPaidToBroker
//                     ? totalPaidToBroker.toLocaleString("en-US")
//                     : 0}
//                 </p>
//               </div>
//               <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-start gap-3">
//                 <p className="text-xs">مجموع هزینه</p>
//                 <p className="font-bold text-xs">
//                   {vehicleCosts ? vehicleCosts.toLocaleString("en-US") : 0}
//                 </p>
//               </div>
//               <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-start gap-3">
//                 <p className="text-xs">مانده</p>
//                 <p className="font-bold text-xs">
//                   {typeof remainingToSeller === "number"
//                     ? remainingToSeller.toLocaleString("en-US")
//                     : remainingToSeller ?? 0}
//                 </p>
//               </div>

//               {/* <div>
//                 <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
//                   <p className="text-xs">مانده مبلغ قابل پرداخت به فروشنده</p>
//                   <p className="font-bold text-sm">
//                     {typeof remainingToSeller === "number"
//                       ? remainingToSeller.toLocaleString("en-US")
//                       : remainingToSeller ?? 0}
//                   </p>
//                 </div>
//                 <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
//                   <p className="text-xs">
//                     مجموع پرداختی به فروشنده و کارگزاران
//                   </p>
//                   <p className="text-red-500 text-sm">
//                     {totalPaidToSellerAndOperator
//                       ? totalPaidToSellerAndOperator.toLocaleString("en-US")
//                       : 0}
//                   </p>
//                 </div>
//               </div>
//               <div>
//                 <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
//                   <p className="text-xs">مجموع پرداختی به فروشنده</p>
//                   <p className="text-red-500 text-sm">
//                     {totalPaidToSeller
//                       ? totalPaidToSeller.toLocaleString("en-US")
//                       : 0}
//                   </p>
//                 </div>
//                 <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
//                   <p className="text-xs">مجموع کل پرداختی</p>
//                   <p className="text-xs">مجموع</p>
//                   <p className="text-red-500 text-sm">
//                     {totalPaidToSellerWithoutFilter
//                       ? totalPaidToSellerWithoutFilter.toLocaleString("en-US")
//                       : 0}
//                   </p>
//                 </div>
//               </div> */}
//             </div>
//           </div>

//           <div className="h-[28rem] max-h-[28rem] border border-gray-300 p-4 rounded-md relative w-full">
//             <p className="text-green-500 absolute right-2 -top-5 bg-white py-2 px-4">
//               دریافت های شما
//             </p>
//             <div className="h-[22rem] max-h-[22rem] overflow-y-auto rounded-md border w-full">
//               <Table className="min-w-full table-fixed text-right border-collapse">
//                 <TableHeader className="top-0 sticky">
//                   <TableRow className="hover:bg-transparent bg-gray-100">
//                     <TableHead className="w-12 text-center">ردیف</TableHead>
//                     <TableHead className="w-12 text-center">تاریخ</TableHead>
//                     <TableHead className="w-12 text-center">مبلغ</TableHead>
//                     <TableHead className="w-12 text-center">
//                       دلیل تراکنش
//                     </TableHead>
//                     <TableHead className="w-12 text-center">
//                       روش پرداخت
//                     </TableHead>
//                     <TableHead className="w-12 text-center">
//                       حساب مبدا
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {receivedTransactions &&
//                     receivedTransactions.length > 0 &&
//                     receivedTransactions?.map((item, index) => (
//                       <TableRow
//                         key={`${item?._id}-${index}`}
//                         className="hover:bg-gray-50"
//                       >
//                         <TableCell className="text-center">
//                           {index + 1}
//                         </TableCell>
//                         <TableCell className="text-center">
//                           {item?.transactionDate ?? ""}
//                         </TableCell>
//                         <TableCell className="text-center">
//                           {item?.amount?.toLocaleString("en-US") ?? ""}
//                         </TableCell>
//                         <TableCell className="text-center">
//                           {item?.reason ?? ""}
//                         </TableCell>
//                         <TableCell className="text-center">
//                           {item?.paymentMethod ?? ""}
//                         </TableCell>
//                         <TableCell className="text-center">
//                           {item?.bussinessAccountId
//                             ? accountNameMap.get(item.bussinessAccountId) ||
//                               item.bussinessAccountId
//                             : ""}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                 </TableBody>
//               </Table>
//             </div>
//             <div className="flex justify-between gap-3 items-center mt-4">
//               <div className="flex gap-3 items-center">
//                 {/* <p className="text-xs">مجموع دریافتی از خریدار</p> */}
//                 <span className="text-xs">مجموع</span>
//                 <span className="text-green-500 text-xs">
//                   {totalReceived ? totalReceived.toLocaleString("en-US") : 0}
//                 </span>
//               </div>

//               <div className="flex gap-3 items-center">
//                 {/* <p className="text-xs">مانده مبلغ قابل دریافت از خریدار</p> */}
//                 <span className="text-xs">مانده</span>
//                 <span className="font-bold text-xs">
//                   {typeof remainingForBuyer === "number"
//                     ? remainingForBuyer.toLocaleString("en-US")
//                     : 0}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mt-7">
//         <div className="w-full flex justify-center gap-4">
//           <div className="h-[18rem] max-h-[18rem] border border-gray-300 p-4 rounded-md relative w-full">
//             <p className="text-blue-300 absolute right-2 -top-5 bg-white py-2 px-4">
//               افزایش/کاهش سرمایه
//             </p>
//             <div className="h-[14rem] max-h-[14rem] overflow-y-auto rounded-md border w-full">
//               <Table
//                 className="min-w-full table-fixed text-right border-collapse"
//                 dir="rtl"
//               >
//                 <TableHeader className="top-0 sticky">
//                   <TableRow className="hover:bg-transparent bg-gray-100">
//                     <TableHead className="text-center">ردیف</TableHead>
//                     <TableHead className="text-center">تاریخ</TableHead>
//                     <TableHead className="text-center">مبلغ</TableHead>
//                     <TableHead className="text-center">شریک</TableHead>
//                     <TableHead className="text-center">دلیل تراکنش</TableHead>
//                     <TableHead className="text-center">روش پرداخت</TableHead>
//                     <TableHead className="text-center">حساب مبدا</TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {deal?.partnerships && deal.partnerships.length > 0
//                     ? deal.partnerships.map((partnership, index) => {
//                         const relatedTransaction = transactions?.find(
//                           (t) =>
//                             t.type === "پرداخت" &&
//                             t.personId?.toString() ===
//                               partnership.partner.personId
//                         );

//                         return (
//                           <TableRow
//                             key={`${partnership.partner.personId}-${index}`}
//                             className="hover:bg-gray-50"
//                           >
//                             <TableCell className="text-center">
//                               {index + 1}
//                             </TableCell>
//                             <TableCell className="text-center">
//                               {relatedTransaction?.transactionDate ||
//                                 deal.createdAt?.split("T")[0] ||
//                                 ""}
//                             </TableCell>
//                             <TableCell className="text-center">
//                               {partnership.investmentAmount
//                                 ? partnership.investmentAmount.toLocaleString(
//                                     "en-US"
//                                   )
//                                 : ""}
//                             </TableCell>
//                             <TableCell className="text-center">
//                               {partnership.partner.name || ""}
//                             </TableCell>
//                             <TableCell className="text-center">
//                               {partnership.profitSharePercentage
//                                 ? `${(
//                                     partnership.profitSharePercentage * 100
//                                   ).toFixed(2)}%`
//                                 : ""}
//                             </TableCell>
//                             <TableCell className="text-center">
//                               {partnership.investmentAmount > 0
//                                 ? "اصل شرکت"
//                                 : "سود شراکت"}
//                             </TableCell>
//                             <TableCell className="text-center">
//                               {relatedTransaction?.paymentMethod || ""}
//                             </TableCell>
//                             <TableCell className="text-center">
//                               {relatedTransaction?.bussinessAccountId
//                                 ? accountNameMap.get(
//                                     relatedTransaction.bussinessAccountId
//                                   ) || relatedTransaction.bussinessAccountId
//                                 : ""}
//                             </TableCell>
//                           </TableRow>
//                         );
//                       })
//                     : null}
//                 </TableBody>
//               </Table>
//             </div>
//             <div className="flex gap-3 items-center justify-between mt-3">
//               <p className="flex gap-2 items-center">
//                 <span className="text-xs">مجموع دریافتی</span>
//                 <span className="text-xs">
//                   {totalReceivedForInvestment
//                     ? totalReceivedForInvestment?.toLocaleString("en-US")
//                     : 0}
//                 </span>
//               </p>
//               <p className="flex gap-2 items-center">
//                 <span className="text-xs">مجموع پرداختی</span>
//                 <span className="text-xs">
//                   {totalPaidForInvestment
//                     ? totalPaidForInvestment?.toLocaleString("en-US")
//                     : 0}
//                 </span>
//               </p>
//             </div>
//           </div>

//           <div className="h-[18rem] max-h-[18rem] border border-gray-300 p-4 rounded-md relative w-full">
//             <p className="text-blue-300 absolute right-2 -top-5 bg-white py-2 px-4">
//               چک های صادره و وارده
//             </p>
//             <div className="h-[14rem] max-h-[14rem] overflow-y-auto rounded-md border w-full">
//               <Table className="min-w-full table-fixed text-right border-collapse">
//                 <TableHeader className="top-0 sticky">
//                   <TableRow className="hover:bg-transparent bg-gray-100">
//                     <TableHead className="text-center w-[30%]">ردیف</TableHead>
//                     <TableHead className="text-center w-[50%]">
//                       نوع چک
//                     </TableHead>
//                     <TableHead className="text-center w-[50%]">
//                       نام مشتری
//                     </TableHead>
//                     <TableHead className="text-center w-[50%]">مبلغ</TableHead>
//                     <TableHead className="text-center w-[50%]">
//                       سررسید
//                     </TableHead>
//                     <TableHead className="text-center w-[50%]">وضعیت</TableHead>
//                     <TableHead className="text-center w-[50%]">
//                       شناسه صیادی
//                     </TableHead>
//                     <TableHead className="text-center w-[50%]">
//                       سریال چک
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {unpaidCheques && unpaidCheques.length > 0
//                     ? unpaidCheques?.map((item, index) => (
//                         <TableRow
//                           key={`${item?._id}-${index}`}
//                           className="has-data-[state=checked]:bg-muted/50"
//                         >
//                           <TableCell className="text-center">
//                             {index + 1}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item?.type}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item?.payer?.fullName}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item?.amount?.toLocaleString("en-US") ?? ""}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item?.dueDate}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item?.status}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item?.sayadiID ?? ""}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item?.chequeNumber}
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     : null}

//                   {[].length > 0
//                     ? []?.map((item, index) => (
//                         <TableRow
//                           key={`${item}-${index}`}
//                           className="has-data-[state=checked]:bg-muted/50"
//                         >
//                           <TableCell className="text-center">
//                             {index + 1}
//                           </TableCell>
//                           <TableCell className="text-center">{item}</TableCell>
//                           <TableCell className="text-center">
//                             {item ?? ""}
//                           </TableCell>
//                           <TableCell className="text-center">{item}</TableCell>
//                           <TableCell className="text-center">{item}</TableCell>
//                           <TableCell className="text-center">{item}</TableCell>
//                           <TableCell className="text-center">{item}</TableCell>
//                           <TableCell className="text-center">{item}</TableCell>
//                         </TableRow>
//                       ))
//                     : null}
//                 </TableBody>
//               </Table>
//             </div>
//             <div className="grid grid-cols-4 gap-3 items-center justify-center mt-3">
//               <p className="flex gap-2 items-center">
//                 <span className="text-xs">صادره وصول نشده</span>
//                 <span className="text-xs">
//                   {totalIssuedChequesUnpaid
//                     ? totalIssuedChequesUnpaid?.toLocaleString("en-US")
//                     : 0}
//                 </span>
//               </p>
//               <p className="flex gap-2 items-center">
//                 <span className="text-xs">صادره وصول شده</span>
//                 <span className="text-xs">
//                   {totalIssuedChequesPaid
//                     ? totalIssuedChequesPaid?.toLocaleString("en-US")
//                     : 0}
//                 </span>
//               </p>
//               <p className="flex gap-2 items-center">
//                 <span className="text-xs">وارده وصول نشده</span>
//                 <span className="text-xs">
//                   {totalReceivedChequesUnpaid
//                     ? totalReceivedChequesUnpaid?.toLocaleString("en-US")
//                     : 0}
//                 </span>
//               </p>
//               <p className="flex gap-2 items-center">
//                 <span className="text-xs">وارده وصول شده</span>
//                 <span className="text-xs">
//                   {totalReceivedChequesPaid
//                     ? totalReceivedChequesPaid?.toLocaleString("en-US")
//                     : 0}
//                 </span>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default VehicleDashboard;

// "use client";
// import { useGetChequesByDealId } from "@/apis/mutations/cheques";
// import { useGetTransactionsByDealId } from "@/apis/mutations/transaction";
// import { getAllBusinessAccounts } from "@/apis/client/businessAccounts";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import useGetDealsByVin from "@/hooks/useGetDealsByVin";
// import { setTotalVehicleCost } from "@/redux/slices/carSlice";
// import { RootState } from "@/redux/store";
// import {
//   IBusinessAccounts,
//   IChequeNew,
//   IDeal,
//   ITransactionNew,
// } from "@/types/new-backend-types";
// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useQuery } from "@tanstack/react-query";

// const VehicleDashboard = () => {
//   const { chassisNo, selectedDealId } = useSelector(
//     (state: RootState) => state.cars
//   );
//   const [deal, setDeal] = React.useState<IDeal>();
//   const [transactions, setTransactions] = React.useState<ITransactionNew[]>([]);
//   const [cheques, setCheques] = React.useState<IChequeNew[] | null>(null);

//   const dispatch = useDispatch();

//   const getDealByVin = useGetDealsByVin(chassisNo);
//   const dealsData = getDealByVin.data;

//   const getTransactionsByDealId = useGetTransactionsByDealId();
//   const getChequesByDealId = useGetChequesByDealId();

//   // Fetch business accounts to map IDs to names
//   const { data: businessAccounts } = useQuery({
//     queryKey: ["get-all-business-accounts"],
//     queryFn: getAllBusinessAccounts,
//   });

//   // Create a map from account ID to account name
//   // Handle both ObjectId strings and numeric IDs
//   const accountNameMap = React.useMemo(() => {
//     if (!businessAccounts) return new Map<string, string>();
//     const map = new Map<string, string>();
//     businessAccounts.forEach((account) => {
//       if (account._id) {
//         const idStr = account._id.toString();
//         map.set(idStr, account.accountName);
//         // Also map numeric ID if it's a number
//         const numericId = parseInt(idStr, 10);
//         if (!isNaN(numericId)) {
//           map.set(numericId.toString(), account.accountName);
//         }
//       }
//     });
//     return map;
//   }, [businessAccounts]);

//   const getTransactionsByDealIdHandler = async () => {
//     if (!deal?._id) return;
//     try {
//       const transactions = await getTransactionsByDealId.mutateAsync(
//         deal?._id.toString() ?? selectedDealId ?? ""
//       );
//       setTransactions(transactions);
//     } catch (error) {
//       console.log("🚀 ~ getTransactionsByDealIdHandler ~ error:", error);
//     }
//   };

//   const getChequesByDealIdHandler = async () => {
//     if (!deal?._id) return;
//     try {
//       const cheques = await getChequesByDealId.mutateAsync(
//         deal?._id.toString() ?? selectedDealId ?? ""
//       );
//       setCheques(cheques);
//     } catch (error) {
//       console.log("🚀 ~ getChequesByDealIdHandler ~ error:", error);
//     }
//   };

//   const isChequePaid = (cheque: IChequeNew): boolean => {
//     const paidStatuses = ["paid", "پاس شده", "وصول شده", "پاس شده است"];
//     return paidStatuses.some((status) =>
//       cheque.status?.toLowerCase().includes(status.toLowerCase())
//     );
//   };

//   const isIssuedCheque = (cheque: IChequeNew): boolean => {
//     return (
//       cheque.type === "issued" ||
//       cheque.type === "صادره" ||
//       cheque.type?.toLowerCase().includes("issued") ||
//       cheque.type?.toLowerCase().includes("صادره")
//     );
//   };

//   const isReceivedCheque = (cheque: IChequeNew): boolean => {
//     return (
//       cheque.type === "received" ||
//       cheque.type === "وارده" ||
//       cheque.type?.toLowerCase().includes("received") ||
//       cheque.type?.toLowerCase().includes("وارده")
//     );
//   };

//   // Check if transaction is related to a cheque that hasn't been paid yet
//   // If payment method is "چک", check if there's an unpaid cheque with matching amount and deal
//   const isTransactionFromUnpaidCheque = (
//     transaction: ITransactionNew
//   ): boolean => {
//     if (!cheques || !deal?._id || transaction.paymentMethod !== "چک") {
//       return false;
//     }

//     const dealIdStr = deal._id.toString();

//     // Find cheques related to this deal that match the transaction amount
//     // Match by: same deal ID and same amount (with small tolerance)
//     const relatedCheques = cheques.filter((c) => {
//       // Check if cheque is related to this deal
//       const chequeDealIdMatch =
//         c.relatedDealId?.toString() === dealIdStr ||
//         (typeof c.relatedDealId === "number" &&
//           dealIdStr.includes(c.relatedDealId.toString()));

//       // Check if amount matches (with small tolerance for floating point)
//       const amountMatch = Math.abs(c.amount - transaction.amount) < 0.01;

//       return chequeDealIdMatch && amountMatch;
//     });

//     // If any related cheque is unpaid, exclude this transaction
//     return relatedCheques.some((c) => !isChequePaid(c));
//   };

//   // Filter transactions to only show vehicle-related ones
//   // Payments: "خرید خودرو" or includes "خريد"/"خرید", "درصد کارگزار", "هزینه وسیله"
//   // Receipts: "فروش"
//   // Exclude: salary payments (حقوق) and unpaid cheques
//   const isVehicleRelatedTransaction = (
//     transaction: ITransactionNew
//   ): boolean => {
//     // Exclude salary payments
//     if (
//       transaction.reason?.includes("حقوق") ||
//       transaction.reason?.includes("پرداخت حقوق")
//     ) {
//       return false;
//     }

//     // For payments, only include: خرید خودرو (or includes "خريد"/"خرید"), درصد کارگزار, هزینه وسیله
//     if (transaction.type === "پرداخت") {
//       const reasonNormalized = transaction.reason?.replace(/\s/g, "") || "";
//       return (
//         transaction.reason === "خرید خودرو" ||
//         transaction.reason?.includes("خريد") ||
//         transaction.reason?.includes("خرید") ||
//         transaction.reason === "درصد کارگزار" ||
//         reasonNormalized.includes("هزینهوسیله") ||
//         reasonNormalized.includes("هزينهوسیله")
//       );
//     }

//     // For receipts, only include: فروش
//     if (transaction.type === "دریافت") {
//       return transaction.reason === "فروش";
//     }

//     // For investment transactions, include them
//     if (
//       transaction.type === "افزایش سرمایه" ||
//       transaction.type === "برداشت سرمایه" ||
//       transaction.reason === "افزایش سرمایه" ||
//       transaction.reason === "کاهش سرمایه"
//     ) {
//       return true;
//     }

//     return false;
//   };

//   // Filter transactions: vehicle-related and not from unpaid cheques
//   const filteredTransactions = React.useMemo(() => {
//     if (!transactions || transactions.length === 0) return [];
//     return transactions.filter(
//       (t) => isVehicleRelatedTransaction(t) && !isTransactionFromUnpaidCheque(t)
//     );
//   }, [transactions, cheques, deal]);

//   // Calculate cheque totals
//   // Total issued cheques unpaid
//   const totalIssuedChequesUnpaid =
//     cheques
//       ?.filter((c) => isIssuedCheque(c) && !isChequePaid(c))
//       .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

//   // Total issued cheques paid
//   const totalIssuedChequesPaid =
//     cheques
//       ?.filter((c) => isIssuedCheque(c) && isChequePaid(c))
//       .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

//   // Total received cheques unpaid
//   const totalReceivedChequesUnpaid =
//     cheques
//       ?.filter((c) => isReceivedCheque(c) && !isChequePaid(c))
//       .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

//   // Total received cheques paid
//   const totalReceivedChequesPaid =
//     cheques
//       ?.filter((c) => isReceivedCheque(c) && isChequePaid(c))
//       .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

//   // const totalPaidToSellerAndOperator =
//   //   transactions
//   //     ?.filter(
//   //       (t) =>
//   //         (t.type === "پرداخت" && t.reason === "خريد") ||
//   //         (t.type === "پرداخت" && t.reason === "درصد کارگزار")
//   //     )
//   //     .reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

//   // Filter transactions for display
//   const paidTransactions = filteredTransactions?.filter(
//     (t) => t.type === "پرداخت"
//   );
//   const receivedTransactions = filteredTransactions?.filter(
//     (t) => t.type === "دریافت"
//   );

//   // Calculate totals from filtered transactions
//   // totalPaidToSeller: payments for purchase (خرید خودرو or includes "خريد"/"خرید")
//   const totalPaidToSeller =
//     paidTransactions
//       ?.filter(
//         (t) =>
//           t.reason === "خرید خودرو" ||
//           t.reason?.includes("خريد") ||
//           t.reason?.includes("خرید")
//       )
//       ?.reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

//   const totalPaidToSellerWithoutFilter =
//     paidTransactions?.reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

//   const totalReceived =
//     receivedTransactions?.reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

//   const remainingForBuyer =
//     deal?.salePrice && totalReceived ? deal?.salePrice - totalReceived : 0;

//   const totalPaidToBroker =
//     paidTransactions
//       ?.filter((t) => t.reason === "درصد کارگزار")
//       .reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

//   // const otherCostCategories =
//   //   deal?.directCosts?.otherCost?.map((cost) => cost.category) || [];
//   // const otherCostsFromDirectCosts =
//   //   deal?.directCosts?.otherCost?.reduce(
//   //     (sum, cost) => sum + (cost.cost || 0),
//   //     0
//   //   ) || 0;
//   // const otherCostsFromTransactions =
//   //   transactions
//   //     ?.filter(
//   //       (t) =>
//   //         t.type === "پرداخت" &&
//   //         otherCostCategories.some((category) => t.reason === category)
//   //     )
//   //     .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
//   const vehicleCosts =
//     paidTransactions
//       ?.filter(
//         (t) =>
//           t.reason?.replace(/\s/g, "").includes("هزینهوسیله") ||
//           t.reason?.replace(/\s/g, "").includes("هزينهوسیله")
//       )
//       .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

//   const remainingToSeller =
//     deal?.purchasePrice && totalPaidToSeller
//       ? deal.purchasePrice - totalPaidToSeller
//       : deal?.purchasePrice || 0;

//   // const totalBrokerPercentage =
//   //   deal?.partnerships?.reduce(
//   //     (sum, p) => sum + (p.profitSharePercentage || 0),
//   //     0
//   //   ) || 0;

//   const investmentTransactions = filteredTransactions?.filter(
//     (t) =>
//       t.reason === "افزایش سرمایه" ||
//       t.reason === "کاهش سرمایه" ||
//       t.type === "افزایش سرمایه" ||
//       t.type === "برداشت سرمایه"
//   );

//   const totalPaidForInvestment =
//     investmentTransactions
//       ?.filter((t) => t.type === "پرداخت")
//       .reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

//   const totalReceivedForInvestment =
//     investmentTransactions
//       ?.filter((t) => t.type === "دریافت")
//       .reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

//   React.useEffect(() => {
//     getTransactionsByDealIdHandler();
//     getChequesByDealIdHandler();
//   }, [deal?._id, selectedDealId]);

//   React.useEffect(() => {
//     if (dealsData?.length === 1) {
//       setDeal(dealsData[0]);
//     } else if (dealsData?.length && dealsData?.length > 1) {
//       const selectedDeal = dealsData?.find(
//         (deal) => deal._id.toString() === selectedDealId
//       );
//       setDeal(selectedDeal ?? undefined);
//     }
//   }, [dealsData, selectedDealId]);

//   return (
//     <>
//       <div className="my-5 mb-7">
//         <div className="w-full flex justify-center gap-4">
//           <div className="h-[28rem] max-h-[28rem] border border-gray-300 p-4 rounded-md relative w-full">
//             <p className="text-red-500 absolute right-2 -top-5 bg-white py-2 px-4">
//               پرداخت های شما
//             </p>
//             <div className="h-[22rem] max-h-[22rem] overflow-y-auto rounded-md border w-full">
//               <Table className="min-w-full table-fixed text-right border-collapse">
//                 <TableHeader className="top-0 sticky">
//                   <TableRow className="bg-gray-100">
//                     <TableHead className="w-12 text-center">ردیف</TableHead>
//                     <TableHead className="w-12 text-center">تاریخ</TableHead>
//                     <TableHead className="w-12 text-center">مبلغ</TableHead>
//                     <TableHead className="w-12 text-center">
//                       دلیل تراکنش
//                     </TableHead>
//                     <TableHead className="w-12 text-center">
//                       روش پرداخت
//                     </TableHead>
//                     <TableHead className="w-12 text-center">
//                       حساب مبدا
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {paidTransactions &&
//                     paidTransactions?.length > 0 &&
//                     paidTransactions?.map((item, index) => {
//                       const totalVehicleCost = paidTransactions
//                         ?.filter(
//                           (item) =>
//                             item?.reason
//                               ?.replace(/\s/g, "")
//                               .includes("هزینهوسیله") ||
//                             item?.reason
//                               ?.replace(/\s/g, "")
//                               .includes("هزينهوسیله")
//                         )
//                         ?.reduce((sum, item) => sum + (item.amount || 0), 0);

//                       dispatch(setTotalVehicleCost(totalVehicleCost));

//                       return (
//                         <TableRow
//                           key={`${item?._id}-${index}`}
//                           className="hover:bg-gray-50"
//                         >
//                           <TableCell className="text-center">
//                             {index + 1}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item?.transactionDate ?? ""}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item?.amount?.toLocaleString("en-US") ?? ""}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item?.reason ?? ""}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item?.paymentMethod ?? ""}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item?.bussinessAccountId
//                               ? accountNameMap.get(item.bussinessAccountId) ||
//                                 item.bussinessAccountId
//                               : ""}
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
//                 </TableBody>
//               </Table>
//             </div>
//             <div className="grid grid-cols-5 gap-3 items-start space-y-0">
//               <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
//                 <p className="text-xs">مجموع</p>
//                 <p className="text-red-500 text-xs">
//                   {totalPaidToSellerWithoutFilter
//                     ? totalPaidToSellerWithoutFilter.toLocaleString("en-US")
//                     : 0}
//                 </p>
//               </div>
//               <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
//                 <p className="text-xs">مجموع به طرف اول</p>
//                 <p className="font-bold text-xs">
//                   {totalPaidToSeller
//                     ? totalPaidToSeller.toLocaleString("en-US")
//                     : 0}
//                 </p>
//               </div>
//               <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
//                 <p className="text-xs">مجموع به کارگزار</p>
//                 <p className="font-bold text-xs">
//                   {totalPaidToBroker
//                     ? totalPaidToBroker.toLocaleString("en-US")
//                     : 0}
//                 </p>
//               </div>
//               <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
//                 <p className="text-xs">مجموع هزینه</p>
//                 <p className="font-bold text-xs">
//                   {vehicleCosts ? vehicleCosts.toLocaleString("en-US") : 0}
//                 </p>
//               </div>
//               <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
//                 <p className="text-xs">مانده</p>
//                 <p className="font-bold text-xs">
//                   {typeof remainingToSeller === "number"
//                     ? remainingToSeller.toLocaleString("en-US")
//                     : remainingToSeller ?? 0}
//                 </p>
//               </div>

//               {/* <div>
//                 <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
//                   <p className="text-xs">مانده مبلغ قابل پرداخت به فروشنده</p>
//                   <p className="font-bold text-sm">
//                     {typeof remainingToSeller === "number"
//                       ? remainingToSeller.toLocaleString("en-US")
//                       : remainingToSeller ?? 0}
//                   </p>
//                 </div>
//                 <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
//                   <p className="text-xs">
//                     مجموع پرداختی به فروشنده و کارگزاران
//                   </p>
//                   <p className="text-red-500 text-sm">
//                     {totalPaidToSellerAndOperator
//                       ? totalPaidToSellerAndOperator.toLocaleString("en-US")
//                       : 0}
//                   </p>
//                 </div>
//               </div>
//               <div>
//                 <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
//                   <p className="text-xs">مجموع پرداختی به فروشنده</p>
//                   <p className="text-red-500 text-sm">
//                     {totalPaidToSeller
//                       ? totalPaidToSeller.toLocaleString("en-US")
//                       : 0}
//                   </p>
//                 </div>
//                 <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
//                   <p className="text-xs">مجموع کل پرداختی</p>
//                   <p className="text-xs">مجموع</p>
//                   <p className="text-red-500 text-sm">
//                     {totalPaidToSellerWithoutFilter
//                       ? totalPaidToSellerWithoutFilter.toLocaleString("en-US")
//                       : 0}
//                   </p>
//                 </div>
//               </div> */}
//             </div>
//           </div>

//           <div className="h-[28rem] max-h-[28rem] border border-gray-300 p-4 rounded-md relative w-full">
//             <p className="text-green-500 absolute right-2 -top-5 bg-white py-2 px-4">
//               دریافت های شما
//             </p>
//             <div className="h-[22rem] max-h-[22rem] overflow-y-auto rounded-md border w-full">
//               <Table className="min-w-full table-fixed text-right border-collapse">
//                 <TableHeader className="top-0 sticky">
//                   <TableRow className="hover:bg-transparent bg-gray-100">
//                     <TableHead className="w-12 text-center">ردیف</TableHead>
//                     <TableHead className="w-12 text-center">تاریخ</TableHead>
//                     <TableHead className="w-12 text-center">مبلغ</TableHead>
//                     <TableHead className="w-12 text-center">
//                       دلیل تراکنش
//                     </TableHead>
//                     <TableHead className="w-12 text-center">
//                       روش پرداخت
//                     </TableHead>
//                     <TableHead className="w-12 text-center">
//                       حساب مبدا
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {receivedTransactions &&
//                     receivedTransactions.length > 0 &&
//                     receivedTransactions?.map((item, index) => (
//                       <TableRow
//                         key={`${item?._id}-${index}`}
//                         className="hover:bg-gray-50"
//                       >
//                         <TableCell className="text-center">
//                           {index + 1}
//                         </TableCell>
//                         <TableCell className="text-center">
//                           {item?.transactionDate ?? ""}
//                         </TableCell>
//                         <TableCell className="text-center">
//                           {item?.amount?.toLocaleString("en-US") ?? ""}
//                         </TableCell>
//                         <TableCell className="text-center">
//                           {item?.reason ?? ""}
//                         </TableCell>
//                         <TableCell className="text-center">
//                           {item?.paymentMethod ?? ""}
//                         </TableCell>
//                         <TableCell className="text-center">
//                           {item?.bussinessAccountId
//                             ? accountNameMap.get(item.bussinessAccountId) ||
//                               item.bussinessAccountId
//                             : ""}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                 </TableBody>
//               </Table>
//             </div>
//             <div className="grid grid-cols-2 gap-3 items-center mt-3">
//               <div className="flex gap-3 items-center">
//                 {/* <p className="text-xs">مانده مبلغ قابل دریافت از خریدار</p> */}
//                 <span className="text-xs">مانده</span>
//                 <span className="font-bold text-xs">
//                   {typeof remainingForBuyer === "number"
//                     ? remainingForBuyer.toLocaleString("en-US")
//                     : 0}
//                 </span>
//               </div>

//               <div className="flex gap-3 items-center">
//                 {/* <p className="text-xs">مجموع دریافتی از خریدار</p> */}
//                 <span className="text-xs">مجموع</span>
//                 <span className="text-green-500 text-xs">
//                   {totalReceived ? totalReceived.toLocaleString("en-US") : 0}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mt-7">
//         <div className="w-full flex justify-center gap-4">
//           <div className="h-[18rem] max-h-[18rem] border border-gray-300 p-4 rounded-md relative w-full">
//             <p className="text-blue-300 absolute right-2 -top-5 bg-white py-2 px-4">
//               افزایش/کاهش سرمایه
//             </p>
//             <div className="h-[14rem] max-h-[14rem] overflow-y-auto rounded-md border w-full">
//               <Table
//                 className="min-w-full table-fixed text-right border-collapse"
//                 dir="rtl"
//               >
//                 <TableHeader className="top-0 sticky">
//                   <TableRow className="hover:bg-transparent bg-gray-100">
//                     <TableHead className="text-center">ردیف</TableHead>
//                     <TableHead className="text-center">تاریخ</TableHead>
//                     <TableHead className="text-center">مبلغ</TableHead>
//                     <TableHead className="text-center">شریک</TableHead>
//                     <TableHead className="text-center">دلیل تراکنش</TableHead>
//                     <TableHead className="text-center">روش پرداخت</TableHead>
//                     <TableHead className="text-center">حساب مبدا</TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {deal?.partnerships && deal.partnerships.length > 0
//                     ? deal.partnerships.map((partnership, index) => {
//                         const relatedTransaction = transactions?.find(
//                           (t) =>
//                             t.type === "پرداخت" &&
//                             t.personId?.toString() ===
//                               partnership.partner.personId
//                         );

//                         return (
//                           <TableRow
//                             key={`${partnership.partner.personId}-${index}`}
//                             className="hover:bg-gray-50"
//                           >
//                             <TableCell className="text-center">
//                               {index + 1}
//                             </TableCell>
//                             <TableCell className="text-center">
//                               {relatedTransaction?.transactionDate ||
//                                 deal.createdAt?.split("T")[0] ||
//                                 ""}
//                             </TableCell>
//                             <TableCell className="text-center">
//                               {partnership.investmentAmount
//                                 ? partnership.investmentAmount.toLocaleString(
//                                     "en-US"
//                                   )
//                                 : ""}
//                             </TableCell>
//                             <TableCell className="text-center">
//                               {partnership.partner.name || ""}
//                             </TableCell>
//                             <TableCell className="text-center">
//                               {partnership.profitSharePercentage
//                                 ? `${(
//                                     partnership.profitSharePercentage * 100
//                                   ).toFixed(2)}%`
//                                 : ""}
//                             </TableCell>
//                             <TableCell className="text-center">
//                               {partnership.investmentAmount > 0
//                                 ? "اصل شرکت"
//                                 : "سود شراکت"}
//                             </TableCell>
//                             <TableCell className="text-center">
//                               {relatedTransaction?.paymentMethod || ""}
//                             </TableCell>
//                             <TableCell className="text-center">
//                               {relatedTransaction?.bussinessAccountId
//                                 ? accountNameMap.get(
//                                     relatedTransaction.bussinessAccountId
//                                   ) || relatedTransaction.bussinessAccountId
//                                 : ""}
//                             </TableCell>
//                           </TableRow>
//                         );
//                       })
//                     : null}
//                 </TableBody>
//               </Table>
//             </div>
//             <div className="flex gap-3 items-center justify-between mt-3">
//               <p className="flex gap-2 items-center">
//                 <span className="text-xs">مجموع دریافتی</span>
//                 <span className="text-xs">
//                   {totalReceivedForInvestment
//                     ? totalReceivedForInvestment?.toLocaleString("en-US")
//                     : 0}
//                 </span>
//               </p>
//               <p className="flex gap-2 items-center">
//                 <span className="text-xs">مجموع پرداختی</span>
//                 <span className="text-xs">
//                   {totalPaidForInvestment
//                     ? totalPaidForInvestment?.toLocaleString("en-US")
//                     : 0}
//                 </span>
//               </p>
//             </div>
//           </div>

//           <div className="h-[18rem] max-h-[18rem] border border-gray-300 p-4 rounded-md relative w-full">
//             <p className="text-blue-300 absolute right-2 -top-5 bg-white py-2 px-4">
//               چک های صادره و وارده
//             </p>
//             <div className="h-[14rem] max-h-[14rem] overflow-y-auto rounded-md border w-full">
//               <Table className="min-w-full table-fixed text-right border-collapse">
//                 <TableHeader className="top-0 sticky">
//                   <TableRow className="hover:bg-transparent bg-gray-100">
//                     <TableHead className="text-center w-[30%]">ردیف</TableHead>
//                     <TableHead className="text-center w-[50%]">
//                       نوع چک
//                     </TableHead>
//                     <TableHead className="text-center w-[50%]">
//                       نام مشتری
//                     </TableHead>
//                     <TableHead className="text-center w-[50%]">مبلغ</TableHead>
//                     <TableHead className="text-center w-[50%]">
//                       سررسید
//                     </TableHead>
//                     <TableHead className="text-center w-[50%]">وضعیت</TableHead>
//                     <TableHead className="text-center w-[50%]">
//                       شناسه صیادی
//                     </TableHead>
//                     <TableHead className="text-center w-[50%]">
//                       سریال چک
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {cheques && cheques.length > 0
//                     ? cheques?.map((item, index) => (
//                         <TableRow
//                           key={`${item?._id}-${index}`}
//                           className="has-data-[state=checked]:bg-muted/50"
//                         >
//                           <TableCell className="text-center">
//                             {index + 1}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item?.type}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item?.payer?.fullName}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item?.amount?.toLocaleString("en-US") ?? ""}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item?.dueDate}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item?.status}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item?.sayadiID ?? ""}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item?.chequeNumber}
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     : null}

//                   {[].length > 0
//                     ? []?.map((item, index) => (
//                         <TableRow
//                           key={`${item}-${index}`}
//                           className="has-data-[state=checked]:bg-muted/50"
//                         >
//                           <TableCell className="text-center">
//                             {index + 1}
//                           </TableCell>
//                           <TableCell className="text-center">{item}</TableCell>
//                           <TableCell className="text-center">
//                             {item ?? ""}
//                           </TableCell>
//                           <TableCell className="text-center">{item}</TableCell>
//                           <TableCell className="text-center">{item}</TableCell>
//                           <TableCell className="text-center">{item}</TableCell>
//                           <TableCell className="text-center">{item}</TableCell>
//                           <TableCell className="text-center">{item}</TableCell>
//                         </TableRow>
//                       ))
//                     : null}
//                 </TableBody>
//               </Table>
//             </div>
//             <div className="flex gap-3 items-center justify-end mt-3">
//               <p className="flex gap-2 items-center">
//                 <span className="text-xs">مجموع چک های صادره وصول نشده</span>
//                 <span className="text-xs">
//                   {totalIssuedChequesUnpaid
//                     ? totalIssuedChequesUnpaid?.toLocaleString("en-US")
//                     : 0}
//                 </span>
//               </p>
//               <p className="flex gap-2 items-center">
//                 <span className="text-xs">مجموع چک های صادره وصول شده</span>
//                 <span className="text-xs">
//                   {totalIssuedChequesPaid
//                     ? totalIssuedChequesPaid?.toLocaleString("en-US")
//                     : 0}
//                 </span>
//               </p>
//               <p className="flex gap-2 items-center">
//                 <span className="text-xs">مجموع چک های وارده وصول نشده</span>
//                 <span className="text-xs">
//                   {totalReceivedChequesUnpaid
//                     ? totalReceivedChequesUnpaid?.toLocaleString("en-US")
//                     : 0}
//                 </span>
//               </p>
//               <p className="flex gap-2 items-center">
//                 <span className="text-xs">مجموع چک های وارده وصول شده</span>
//                 <span className="text-xs">
//                   {totalReceivedChequesPaid
//                     ? totalReceivedChequesPaid?.toLocaleString("en-US")
//                     : 0}
//                 </span>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default VehicleDashboard;

"use client";
import { useGetChequesByDealId } from "@/apis/mutations/cheques";
import { useGetTransactionsByDealId } from "@/apis/mutations/transaction";
import { getAllBusinessAccounts } from "@/apis/client/businessAccounts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetDealsByVin from "@/hooks/useGetDealsByVin";
import { setTotalVehicleCost } from "@/redux/slices/carSlice";
import { RootState } from "@/redux/store";
import { IChequeNew, IDeal, ITransactionNew } from "@/types/new-backend-types";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

const VehicleDashboard = () => {
  const { chassisNo, selectedDealId } = useSelector(
    (state: RootState) => state.cars
  );
  const [deal, setDeal] = React.useState<IDeal>();
  const [transactions, setTransactions] = React.useState<ITransactionNew[]>([]);
  const [cheques, setCheques] = React.useState<IChequeNew[] | null>(null);

  const dispatch = useDispatch();

  const getDealByVin = useGetDealsByVin(chassisNo);
  const dealsData = getDealByVin.data;

  const getTransactionsByDealId = useGetTransactionsByDealId();
  const getChequesByDealId = useGetChequesByDealId();

  const { data: businessAccounts } = useQuery({
    queryKey: ["get-all-business-accounts"],
    queryFn: getAllBusinessAccounts,
  });

  const accountNameMap = React.useMemo(() => {
    if (!businessAccounts) return new Map<string, string>();
    const map = new Map<string, string>();
    businessAccounts.forEach((account) => {
      if (account._id) {
        const idStr = account._id.toString();
        map.set(idStr, account.accountName);
        const numericId = parseInt(idStr, 10);
        if (!isNaN(numericId)) {
          map.set(numericId.toString(), account.accountName);
        }
      }
    });
    return map;
  }, [businessAccounts]);

  const getTransactionsByDealIdHandler = async () => {
    if (!deal?._id) return;
    try {
      const transactions = await getTransactionsByDealId.mutateAsync(
        deal?._id.toString() ?? selectedDealId ?? ""
      );
      setTransactions(transactions);
    } catch (error) {
      console.log("🚀 ~ getTransactionsByDealIdHandler ~ error:", error);
    }
  };

  const getChequesByDealIdHandler = async () => {
    if (!deal?._id) return;
    try {
      const cheques = await getChequesByDealId.mutateAsync(
        deal?._id.toString() ?? selectedDealId ?? ""
      );
      setCheques(cheques);
    } catch (error) {
      console.log("🚀 ~ getChequesByDealIdHandler ~ error:", error);
    }
  };

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

  const isTransactionFromUnpaidCheque = (
    transaction: ITransactionNew
  ): boolean => {
    if (!cheques || !deal?._id || transaction.paymentMethod !== "چک") {
      return false;
    }

    const dealIdStr = deal._id.toString();

    const relatedCheques = cheques.filter((c) => {
      const chequeDealIdMatch =
        c.relatedDealId?.toString() === dealIdStr ||
        (typeof c.relatedDealId === "number" &&
          dealIdStr.includes(c.relatedDealId.toString()));

      const amountMatch = Math.abs(c.amount - transaction.amount) < 0.01;

      return chequeDealIdMatch && amountMatch;
    });

    return relatedCheques.some((c) => !isChequePaid(c));
  };

  const isVehicleRelatedTransaction = (
    transaction: ITransactionNew
  ): boolean => {
    if (
      transaction.reason?.includes("حقوق") ||
      transaction.reason?.includes("پرداخت حقوق")
    ) {
      return false;
    }

    if (transaction.type === "پرداخت") {
      const reasonNormalized = transaction.reason?.replace(/\s/g, "") || "";
      return (
        transaction.reason === "خرید خودرو" ||
        transaction.reason?.includes("خريد") ||
        transaction.reason?.includes("خرید") ||
        transaction.reason === "درصد کارگزار" ||
        reasonNormalized.includes("هزینهوسیله") ||
        reasonNormalized.includes("هزينهوسیله")
      );
    }

    if (transaction.type === "دریافت") {
      return transaction.reason === "فروش";
    }

    if (
      transaction.type === "افزایش سرمایه" ||
      transaction.type === "برداشت سرمایه" ||
      transaction.reason === "افزایش سرمایه" ||
      transaction.reason === "کاهش سرمایه"
    ) {
      return true;
    }

    return false;
  };

  const filteredTransactions = React.useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    return transactions.filter(
      (t) => isVehicleRelatedTransaction(t) && !isTransactionFromUnpaidCheque(t)
    );
  }, [transactions, cheques, deal]);

  const unpaidCheques = React.useMemo(() => {
    if (!cheques || cheques.length === 0) return [];
    return cheques;
  }, [cheques]);

  const totalIssuedChequesUnpaid =
    unpaidCheques
      ?.filter((c) => isIssuedCheque(c))
      .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

  const totalIssuedChequesPaid =
    cheques
      ?.filter((c) => isIssuedCheque(c) && isChequePaid(c))
      .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

  const totalReceivedChequesUnpaid =
    unpaidCheques
      ?.filter((c) => isReceivedCheque(c))
      .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

  const totalReceivedChequesPaid =
    cheques
      ?.filter((c) => isReceivedCheque(c) && isChequePaid(c))
      .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

  const paidTransactions = filteredTransactions?.filter(
    (t) => t.type === "پرداخت"
  );
  const receivedTransactions = filteredTransactions?.filter(
    (t) => t.type === "دریافت"
  );

  const totalPaidToSeller =
    paidTransactions
      ?.filter(
        (t) =>
          t.reason === "خرید خودرو" ||
          t.reason?.includes("خريد") ||
          t.reason?.includes("خرید")
      )
      ?.reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

  const totalPaidToSellerWithoutFilter =
    paidTransactions?.reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

  const totalReceived =
    receivedTransactions?.reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

  const remainingForBuyer =
    deal?.salePrice && totalReceived ? deal?.salePrice - totalReceived : 0;

  const totalPaidToBroker =
    paidTransactions
      ?.filter((t) => t.reason === "درصد کارگزار")
      .reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

  const vehicleCosts =
    paidTransactions
      ?.filter(
        (t) =>
          t.reason?.replace(/\s/g, "").includes("هزینهوسیله") ||
          t.reason?.replace(/\s/g, "").includes("هزينهوسیله")
      )
      .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

  const remainingToSeller =
    deal?.purchasePrice && totalPaidToSeller
      ? deal.purchasePrice - totalPaidToSeller
      : deal?.purchasePrice || 0;

  const investmentTransactions = filteredTransactions?.filter(
    (t) =>
      t.reason === "افزایش سرمایه" ||
      t.reason === "کاهش سرمایه" ||
      t.type === "افزایش سرمایه" ||
      t.type === "برداشت سرمایه"
  );

  const totalPaidForInvestment =
    investmentTransactions
      ?.filter((t) => t.type === "پرداخت")
      .reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

  const totalReceivedForInvestment =
    investmentTransactions
      ?.filter((t) => t.type === "دریافت")
      .reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

  React.useEffect(() => {
    getTransactionsByDealIdHandler();
    getChequesByDealIdHandler();
  }, [deal?._id, selectedDealId]);

  React.useEffect(() => {
    if (dealsData?.length === 1) {
      setDeal(dealsData[0]);
    } else if (dealsData?.length && dealsData?.length > 1) {
      const selectedDeal = dealsData?.find(
        (deal) => deal._id.toString() === selectedDealId
      );
      setDeal(selectedDeal ?? undefined);
    }
  }, [dealsData, selectedDealId]);

  return (
    <>
      <div className="my-5 mb-7">
        <div className="w-full flex justify-center gap-4">
          <div className="h-[28rem] max-h-[28rem] border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-red-500 absolute right-2 -top-5 bg-white py-2 px-4">
              پرداخت های شما
            </p>
            <div className="h-[22rem] max-h-[22rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-12 text-center">ردیف</TableHead>
                    <TableHead className="w-12 text-center">تاریخ</TableHead>
                    <TableHead className="w-12 text-center">مبلغ</TableHead>
                    <TableHead className="w-12 text-center">
                      دلیل تراکنش
                    </TableHead>
                    <TableHead className="w-12 text-center">
                      روش پرداخت
                    </TableHead>
                    <TableHead className="w-12 text-center">
                      حساب مبدا
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paidTransactions &&
                    paidTransactions?.length > 0 &&
                    paidTransactions?.map((item, index) => {
                      const totalVehicleCost = paidTransactions
                        ?.filter(
                          (item) =>
                            item?.reason
                              ?.replace(/\s/g, "")
                              .includes("هزینهوسیله") ||
                            item?.reason
                              ?.replace(/\s/g, "")
                              .includes("هزينهوسیله")
                        )
                        ?.reduce((sum, item) => sum + (item.amount || 0), 0);

                      dispatch(setTotalVehicleCost(totalVehicleCost));

                      return (
                        <TableRow
                          key={`${item?._id}-${index}`}
                          className="hover:bg-gray-50"
                        >
                          <TableCell className="text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.transactionDate ?? ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.amount?.toLocaleString("en-US") ?? ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.reason ?? ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.paymentMethod ?? ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.bussinessAccountId
                              ? accountNameMap.get(item.bussinessAccountId) ||
                              item.bussinessAccountId
                              : ""}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between gap-3 items-start space-y-0 mt-5">
              <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-start gap-3">
                <p className="text-xs">مجموع</p>
                <p className="text-red-500 text-xs">
                  {totalPaidToSellerWithoutFilter
                    ? totalPaidToSellerWithoutFilter.toLocaleString("en-US")
                    : 0}
                </p>
              </div>
              <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-start gap-3">
                <p className="text-xs">مجموع به طرف اول</p>
                <p className="font-bold text-xs">
                  {totalPaidToSeller
                    ? totalPaidToSeller.toLocaleString("en-US")
                    : 0}
                </p>
              </div>
              <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-start gap-3">
                <p className="text-xs">مجموع به کارگزار</p>
                <p className="font-bold text-xs">
                  {totalPaidToBroker
                    ? totalPaidToBroker.toLocaleString("en-US")
                    : 0}
                </p>
              </div>
              <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-start gap-3">
                <p className="text-xs">مجموع هزینه</p>
                <p className="font-bold text-xs">
                  {vehicleCosts ? vehicleCosts.toLocaleString("en-US") : 0}
                </p>
              </div>
              <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-start gap-3">
                <p className="text-xs">مانده</p>
                <p className="font-bold text-xs">
                  {typeof remainingToSeller === "number"
                    ? remainingToSeller.toLocaleString("en-US")
                    : remainingToSeller ?? 0}
                </p>
              </div>

              {/* <div>
                <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
                  <p className="text-xs">مانده مبلغ قابل پرداخت به فروشنده</p>
                  <p className="font-bold text-sm">
                    {typeof remainingToSeller === "number"
                      ? remainingToSeller.toLocaleString("en-US")
                      : remainingToSeller ?? 0}
                  </p>
                </div>
                <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
                  <p className="text-xs">
                    مجموع پرداختی به فروشنده و کارگزاران
                  </p>
                  <p className="text-red-500 text-sm">
                    {totalPaidToSellerAndOperator
                      ? totalPaidToSellerAndOperator.toLocaleString("en-US")
                      : 0}
                  </p>
                </div>
              </div>
              <div>
                <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
                  <p className="text-xs">مجموع پرداختی به فروشنده</p>
                  <p className="text-red-500 text-sm">
                    {totalPaidToSeller
                      ? totalPaidToSeller.toLocaleString("en-US")
                      : 0}
                  </p>
                </div>
                <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
                  <p className="text-xs">مجموع کل پرداختی</p>
                  <p className="text-xs">مجموع</p>
                  <p className="text-red-500 text-sm">
                    {totalPaidToSellerWithoutFilter
                      ? totalPaidToSellerWithoutFilter.toLocaleString("en-US")
                      : 0}
                  </p>
                </div>
              </div> */}
            </div>
          </div>

          <div className="h-[28rem] max-h-[28rem] border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-green-500 absolute right-2 -top-5 bg-white py-2 px-4">
              دریافت های شما
            </p>
            <div className="h-[22rem] max-h-[22rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="hover:bg-transparent bg-gray-100">
                    <TableHead className="w-12 text-center">ردیف</TableHead>
                    <TableHead className="w-12 text-center">تاریخ</TableHead>
                    <TableHead className="w-12 text-center">مبلغ</TableHead>
                    <TableHead className="w-12 text-center">
                      دلیل تراکنش
                    </TableHead>
                    <TableHead className="w-12 text-center">
                      روش پرداخت
                    </TableHead>
                    <TableHead className="w-12 text-center">
                      حساب مبدا
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receivedTransactions &&
                    receivedTransactions.length > 0 &&
                    receivedTransactions?.map((item, index) => (
                      <TableRow
                        key={`${item?._id}-${index}`}
                        className="hover:bg-gray-50"
                      >
                        <TableCell className="text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.transactionDate ?? ""}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.amount?.toLocaleString("en-US") ?? ""}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.reason ?? ""}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.paymentMethod ?? ""}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.bussinessAccountId
                            ? accountNameMap.get(item.bussinessAccountId) ||
                            item.bussinessAccountId
                            : ""}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between gap-3 items-center mt-4">
              <div className="flex gap-3 items-center">
                {/* <p className="text-xs">مجموع دریافتی از خریدار</p> */}
                <span className="text-xs">مجموع</span>
                <span className="text-green-500 text-xs">
                  {totalReceived ? totalReceived.toLocaleString("en-US") : 0}
                </span>
              </div>

              <div className="flex gap-3 items-center">
                {/* <p className="text-xs">مانده مبلغ قابل دریافت از خریدار</p> */}
                <span className="text-xs">مانده</span>
                <span className="font-bold text-xs">
                  {typeof remainingForBuyer === "number"
                    ? remainingForBuyer.toLocaleString("en-US")
                    : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-7">
        <div className="w-full flex justify-center gap-4">
          <div className="h-[18rem] max-h-[18rem] border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-300 absolute right-2 -top-5 bg-white py-2 px-4">
              افزایش/کاهش سرمایه
            </p>
            <div className="h-[14rem] max-h-[14rem] overflow-y-auto rounded-md border w-full">
              <Table
                className="min-w-full table-fixed text-right border-collapse"
                dir="rtl"
              >
                <TableHeader className="top-0 sticky">
                  <TableRow className="hover:bg-transparent bg-gray-100">
                    <TableHead className="text-center">ردیف</TableHead>
                    <TableHead className="text-center">تاریخ</TableHead>
                    <TableHead className="text-center">مبلغ</TableHead>
                    <TableHead className="text-center">شریک</TableHead>
                    <TableHead className="text-center">دلیل تراکنش</TableHead>
                    <TableHead className="text-center">روش پرداخت</TableHead>
                    <TableHead className="text-center">حساب مبدا</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {deal?.partnerships && deal.partnerships.length > 0
                    ? deal.partnerships.map((partnership, index) => {
                      const relatedTransaction = transactions?.find(
                        (t) =>
                          t.type === "پرداخت" &&
                          t.personId?.toString() ===
                          partnership.partner.personId
                      );

                      return (
                        <TableRow
                          key={`${partnership.partner.personId}-${index}`}
                          className="hover:bg-gray-50"
                        >
                          <TableCell className="text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-center">
                            {relatedTransaction?.transactionDate ||
                              deal.createdAt?.split("T")[0] ||
                              ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {partnership.investmentAmount
                              ? partnership.investmentAmount.toLocaleString(
                                "en-US"
                              )
                              : ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {partnership.partner.name || ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {partnership.profitSharePercentage
                              ? `${(
                                partnership.profitSharePercentage * 100
                              ).toFixed(2)}%`
                              : ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {partnership.investmentAmount > 0
                              ? "اصل شرکت"
                              : "سود شراکت"}
                          </TableCell>
                          <TableCell className="text-center">
                            {relatedTransaction?.paymentMethod || ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {relatedTransaction?.bussinessAccountId
                              ? accountNameMap.get(
                                relatedTransaction.bussinessAccountId
                              ) || relatedTransaction.bussinessAccountId
                              : ""}
                          </TableCell>
                        </TableRow>
                      );
                    })
                    : null}
                </TableBody>
              </Table>
            </div>
            <div className="flex gap-3 items-center justify-between mt-3">
              <p className="flex gap-2 items-center">
                <span className="text-xs">مجموع دریافتی</span>
                <span className="text-xs">
                  {totalReceivedForInvestment
                    ? totalReceivedForInvestment?.toLocaleString("en-US")
                    : 0}
                </span>
              </p>
              <p className="flex gap-2 items-center">
                <span className="text-xs">مجموع پرداختی</span>
                <span className="text-xs">
                  {totalPaidForInvestment
                    ? totalPaidForInvestment?.toLocaleString("en-US")
                    : 0}
                </span>
              </p>
            </div>
          </div>

          <div className="h-[18rem] max-h-[18rem] border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-300 absolute right-2 -top-5 bg-white py-2 px-4">
              چک های صادره و وارده
            </p>
            <div className="h-[14rem] max-h-[14rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="hover:bg-transparent bg-gray-100">
                    <TableHead className="text-center w-[30%]">ردیف</TableHead>
                    <TableHead className="text-center w-[50%]">
                      نوع چک
                    </TableHead>
                    <TableHead className="text-center w-[50%]">
                      نام مشتری
                    </TableHead>
                    <TableHead className="text-center w-[50%]">مبلغ</TableHead>
                    <TableHead className="text-center w-[50%]">
                      سررسید
                    </TableHead>
                    <TableHead className="text-center w-[50%]">وضعیت</TableHead>
                    <TableHead className="text-center w-[50%]">
                      شناسه صیادی
                    </TableHead>
                    <TableHead className="text-center w-[50%]">
                      سریال چک
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unpaidCheques && unpaidCheques.length > 0
                    ? unpaidCheques?.map((item, index) => (
                      <TableRow
                        key={`${item?._id}-${index}`}
                        className="has-data-[state=checked]:bg-muted/50"
                      >
                        <TableCell className="text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.type}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.payer?.fullName}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.amount?.toLocaleString("en-US") ?? ""}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.dueDate}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.status}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.sayadiID ?? ""}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.chequeNumber}
                        </TableCell>
                      </TableRow>
                    ))
                    : null}

                  {[].length > 0
                    ? []?.map((item, index) => (
                      <TableRow
                        key={`${item}-${index}`}
                        className="has-data-[state=checked]:bg-muted/50"
                      >
                        <TableCell className="text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-center">{item}</TableCell>
                        <TableCell className="text-center">
                          {item ?? ""}
                        </TableCell>
                        <TableCell className="text-center">{item}</TableCell>
                        <TableCell className="text-center">{item}</TableCell>
                        <TableCell className="text-center">{item}</TableCell>
                        <TableCell className="text-center">{item}</TableCell>
                        <TableCell className="text-center">{item}</TableCell>
                      </TableRow>
                    ))
                    : null}
                </TableBody>
              </Table>
            </div>
            <div className="grid grid-cols-4 gap-3 items-center justify-center mt-3">
              <p className="flex gap-2 items-center">
                <span className="text-xs">صادره وصول نشده</span>
                <span className="text-xs">
                  {totalIssuedChequesUnpaid
                    ? totalIssuedChequesUnpaid?.toLocaleString("en-US")
                    : 0}
                </span>
              </p>
              <p className="flex gap-2 items-center">
                <span className="text-xs">صادره وصول شده</span>
                <span className="text-xs">
                  {totalIssuedChequesPaid
                    ? totalIssuedChequesPaid?.toLocaleString("en-US")
                    : 0}
                </span>
              </p>
              <p className="flex gap-2 items-center">
                <span className="text-xs">وارده وصول نشده</span>
                <span className="text-xs">
                  {totalReceivedChequesUnpaid
                    ? totalReceivedChequesUnpaid?.toLocaleString("en-US")
                    : 0}
                </span>
              </p>
              <p className="flex gap-2 items-center">
                <span className="text-xs">وارده وصول شده</span>
                <span className="text-xs">
                  {totalReceivedChequesPaid
                    ? totalReceivedChequesPaid?.toLocaleString("en-US")
                    : 0}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleDashboard;
