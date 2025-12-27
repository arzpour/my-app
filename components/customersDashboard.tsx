
// "use client";
// import { useGetChequesByDealId } from "@/apis/mutations/cheques";
// import { useGetAllDeals } from "@/apis/mutations/deals";
// import { useGetTransactionsByDealId } from "@/apis/mutations/transaction";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import useGetAllPeople from "@/hooks/useGetAllPeople";
// import { IChequeNew, IDeal, ITransactionNew } from "@/types/new-backend-types";
// import React from "react";

// const CustomersDashboard = () => {
//   const [selectedNationalId, setSelectedNationalId] = React.useState<
//     string | null
//   >(null);
//   const [searchValue, setSearchValue] = React.useState<string>("");
//   const [allDeals, setAllDeals] = React.useState<IDeal[]>([]);
//   const [allPersonTransactions, setAllPersonTransactions] = React.useState<
//     ITransactionNew[]
//   >([]);
//   const [allDealsTransactions, setAllDealsTransactions] = React.useState<
//     ITransactionNew[]
//   >([]);
//   const [transactions, setTransactions] = React.useState<ITransactionNew[]>([]);
//   const [cheques, setCheques] = React.useState<IChequeNew[]>([]);
//   const [selectedDealId, setSelectedDealId] = React.useState<string | null>(
//     null
//   );

//   const getTransactionsByDealId = useGetTransactionsByDealId();
//   const getChequesByDealId = useGetChequesByDealId();
//   const { data: allPeople } = useGetAllPeople();
//   const getAllDeals = useGetAllDeals();

//   const peopleList = React.useMemo(() => {
//     if (!allPeople) return [];
//     return allPeople.filter((person) => person.roles?.includes("customer"));
//   }, [allPeople]);
//   // const peopleList = allPeople
//   //   ?.map((person) => (person.roles.includes("customer") ? person : null))
//   //   .filter((person) => person !== null);

//   const customerRolesMap = React.useMemo(() => {
//     const rolesMap = new Map<string, Set<string>>();

//     peopleList?.forEach((person) => {
//       const nationalId = person.nationalId?.toString();
//       if (!nationalId) return;

//       const roles = new Set<string>();

//       allDeals?.forEach((deal) => {
//         if (deal.buyer.nationalId?.toString() === nationalId) {
//           roles.add("خریدار");
//         }
//         if (deal.seller.nationalId?.toString() === nationalId) {
//           roles.add("فروشنده");
//         }
//       });

//       if (roles.size > 0) {
//         rolesMap.set(nationalId, roles);
//       }
//     });

//     return rolesMap;
//   }, [allDeals, peopleList]);

//   const getPersonRole = (nationalId: string): string => {
//     const roles = customerRolesMap.get(nationalId);
//     if (!roles || roles.size === 0) return "—";

//     if (roles.has("خریدار") && roles.has("فروشنده")) {
//       return "خریدار / فروشنده";
//     }
//     return Array.from(roles).join(" / ");
//   };

//   const handleAllDeals = async () => {
//     try {
//       const res = await getAllDeals.mutateAsync();
//       setAllDeals(res);
//     } catch (error) {
//       console.log("🚀 ~ handleSelectChassis ~ error:", error);
//       setAllDeals([]);
//     }
//   };

//   const selectedPersonDeals = React.useMemo(() => {
//     if (!selectedNationalId || allDeals.length === 0) return [];
//     return allDeals.filter(
//       (deal) =>
//         deal.buyer.nationalId === selectedNationalId ||
//         deal.seller.nationalId === selectedNationalId
//     );
//   }, [allDeals, selectedNationalId]);

//   const carSeller = React.useMemo(() => {
//     return selectedPersonDeals.filter(
//       (deal) => deal.seller.nationalId === selectedNationalId
//     );
//   }, [selectedPersonDeals, selectedNationalId]);

//   const carBuyer = React.useMemo(() => {
//     return selectedPersonDeals.filter(
//       (deal) => deal.buyer.nationalId === selectedNationalId
//     );
//   }, [selectedPersonDeals, selectedNationalId]);

//   const handleTransationDataByDealId = async (dealId: string) => {
//     try {
//       setSelectedDealId(dealId);
//       const res = await getTransactionsByDealId.mutateAsync(dealId ?? "");
//       const filtered = res.filter((t) => {
//         if (t.reason?.includes("حقوق") || t.reason?.includes("پرداخت حقوق")) {
//           return false;
//         }

//         if (t.type === "پرداخت") {
//           const reasonNormalized = t.reason?.replace(/\s/g, "") || "";
//           return (
//             t.reason === "خرید خودرو" ||
//             t.reason?.includes("خريد") ||
//             t.reason?.includes("خرید") ||
//             t.reason === "درصد کارگزار" ||
//             reasonNormalized.includes("هزینهوسیله") ||
//             reasonNormalized.includes("هزينهوسیله")
//           );
//         }

//         if (t.type === "دریافت") {
//           return t.reason === "فروش";
//         }

//         return false;
//       });
//       setTransactions(filtered);
//     } catch (error) {
//       console.log("🚀 ~ handleTransationDataByDealId ~ error:", error);
//     }
//   };

//   const handleChequeDataByDealId = async (dealId: string) => {
//     try {
//       const res = await getChequesByDealId.mutateAsync(dealId);
//       setCheques(res);
//     } catch (error) {
//       console.log("🚀 ~ handleChequeDataByDealId ~ error:", error);
//     }
//   };

//   const filteredPeopleList = React.useMemo(() => {
//     if (!searchValue) return peopleList;

//     const lowerSearch = searchValue.toLowerCase().trim();

//     return peopleList?.filter(
//       (user) =>
//         user.fullName?.toLowerCase().includes(lowerSearch) ||
//         user.nationalId?.toString().includes(lowerSearch)
//     );
//   }, [searchValue, peopleList]);

//   const totalBuyAmount = carBuyer.reduce(
//     (sum, deal) => sum + (deal.purchasePrice || 0),
//     0
//   );

//   const totalSellAmount = carSeller.reduce(
//     (sum, deal) => sum + (deal.salePrice || 0),
//     0
//   );

//   const diffBuySell = (totalSellAmount || 0) - (totalBuyAmount || 0);

//   const selectedPersonDealIds = React.useMemo(() => {
//     return selectedPersonDeals
//       .map((deal) => deal._id.toString())
//       .sort()
//       .join(",");
//   }, [selectedPersonDeals]);

//   const { totalReceived, totalPayment } = React.useMemo(() => {
//     if (!selectedNationalId) {
//       return { totalReceived: 0, totalPayment: 0 };
//     }

//     let received = 0;
//     let payment = 0;

//     if (transactions.length > 0) {
//       transactions.forEach((t) => {
//         const dealForTransaction = selectedPersonDeals.find(
//           (d) => d._id.toString() === t.dealId
//         );

//         if (dealForTransaction) {
//           const sellerNationalIdStr =
//             dealForTransaction.seller.nationalId?.toString() || "";
//           const buyerNationalIdStr =
//             dealForTransaction.buyer.nationalId?.toString() || "";
//           const selectedNationalIdStr = selectedNationalId?.toString() || "";

//           const isSeller = sellerNationalIdStr === selectedNationalIdStr;
//           const isBuyer = buyerNationalIdStr === selectedNationalIdStr;

//           if (isSeller && t.type === "پرداخت") {
//             if (
//               t.reason === "خرید خودرو" ||
//               t.reason?.includes("خريد") ||
//               t.reason?.includes("خرید")
//             ) {
//               payment += t.amount || 0;
//             }
//           }

//           if (isBuyer && t.type === "دریافت") {
//             if (t.reason === "فروش") {
//               received += t.amount || 0;
//             }
//           }
//         }
//       });
//     } else if (allPersonTransactions.length > 0) {
//       selectedPersonDeals.forEach((deal) => {
//         const dealTransactions = allPersonTransactions.filter(
//           (t) => t.dealId === deal._id.toString()
//         );

//         const vehicleRelatedTransactions = dealTransactions.filter((t) => {
//           if (t.reason?.includes("حقوق") || t.reason?.includes("پرداخت حقوق")) {
//             return false;
//           }

//           if (t.type === "پرداخت") {
//             const reasonNormalized = t.reason?.replace(/\s/g, "") || "";
//             return (
//               t.reason === "خرید خودرو" ||
//               t.reason?.includes("خريد") ||
//               t.reason?.includes("خرید") ||
//               t.reason === "درصد کارگزار" ||
//               reasonNormalized.includes("هزینهوسیله") ||
//               reasonNormalized.includes("هزينهوسیله")
//             );
//           }

//           if (t.type === "دریافت") {
//             return t.reason === "فروش";
//           }

//           return false;
//         });

//         if (deal.seller.nationalId?.toString() === selectedNationalId) {
//           const paymentsToSeller = vehicleRelatedTransactions
//             .filter((t) => {
//               return (
//                 t.type === "پرداخت" &&
//                 (t.reason === "خرید خودرو" ||
//                   t.reason?.includes("خريد") ||
//                   t.reason?.includes("خرید"))
//               );
//             })
//             .reduce((sum, t) => sum + (t.amount || 0), 0);

//           payment += paymentsToSeller;
//         }

//         if (deal.buyer.nationalId?.toString() === selectedNationalId) {
//           const receiptsFromBuyer = vehicleRelatedTransactions
//             .filter((t) => t.type === "دریافت" && t.reason === "فروش")
//             .reduce((sum, t) => sum + (t.amount || 0), 0);
//           received += receiptsFromBuyer;
//         }
//       });
//     }

//     return { totalReceived: received, totalPayment: payment };
//   }, [
//     selectedNationalId,
//     selectedPersonDealIds,
//     allPersonTransactions,
//     transactions,
//     selectedPersonDeals,
//   ]);

//   const diffPaymentReceived = (totalPayment || 0) - (totalReceived || 0);

//   React.useEffect(() => {
//     const fetchAllDealsTransactions = async () => {
//       if (allDeals.length === 0) {
//         setAllDealsTransactions([]);
//         return;
//       }

//       try {
//         const transactionsPromises = allDeals.map((deal) =>
//           getTransactionsByDealId.mutateAsync(deal._id.toString())
//         );
//         const transactionsArrays = await Promise.all(transactionsPromises);
//         const allTransactions = transactionsArrays.flat();
//         setAllDealsTransactions(allTransactions);
//       } catch (error) {
//         console.error("Error fetching all deals transactions:", error);
//         setAllDealsTransactions([]);
//       }
//     };

//     fetchAllDealsTransactions();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [allDeals]);

//   const customerStatusMap = React.useMemo(() => {
//     const statusMap = new Map<string, { status: string; amount: number }>();

//     peopleList?.forEach((person) => {
//       const nationalId = person.nationalId?.toString();
//       if (!nationalId) return;

//       const personDeals = allDeals.filter(
//         (deal) =>
//           deal.buyer.nationalId?.toString() === nationalId ||
//           deal.seller.nationalId?.toString() === nationalId
//       );

//       if (personDeals.length === 0) {
//         statusMap.set(nationalId, { status: "—", amount: 0 });
//         return;
//       }

//       let totalPaidToSeller = 0;
//       let totalPurchasePrice = 0;

//       personDeals.forEach((deal) => {
//         if (deal.seller.nationalId?.toString() === nationalId) {
//           totalPurchasePrice += deal.purchasePrice || 0;

//           const sellerPersonId = deal.seller.personId?.toString();
//           const dealTransactions = allDealsTransactions.filter(
//             (t) => t.dealId === deal._id.toString()
//           );

//           const paymentsToSeller = dealTransactions
//             .filter(
//               (t) =>
//                 t.type === "پرداخت" &&
//                 t.personId?.toString() === sellerPersonId &&
//                 (t.reason === "خرید خودرو" ||
//                   t.reason?.includes("خريد") ||
//                   t.reason?.includes("خرید"))
//             )
//             .reduce((sum, t) => sum + (t.amount || 0), 0);

//           totalPaidToSeller += paymentsToSeller;
//         }
//       });

//       let totalReceivedFromBuyer = 0;
//       let totalSalePrice = 0;

//       personDeals.forEach((deal) => {
//         if (deal.buyer.nationalId?.toString() === nationalId) {
//           totalSalePrice += deal.salePrice || 0;

//           const buyerPersonId = deal.buyer.personId?.toString();
//           const dealTransactions = allDealsTransactions.filter(
//             (t) => t.dealId === deal._id.toString()
//           );

//           const receiptsFromBuyer = dealTransactions
//             .filter(
//               (t) =>
//                 t.type === "دریافت" &&
//                 t.personId?.toString() === buyerPersonId &&
//                 t.reason === "فروش"
//             )
//             .reduce((sum, t) => sum + (t.amount || 0), 0);

//           totalReceivedFromBuyer += receiptsFromBuyer;
//         }
//       });

//       const sellerDebt = totalPurchasePrice - totalPaidToSeller;
//       const buyerDebt = totalSalePrice - totalReceivedFromBuyer;

//       const walletBalance = buyerDebt - sellerDebt;

//       const diff = Math.abs(walletBalance);
//       if (diff < 0.01) {
//         statusMap.set(nationalId, { status: "تسویه شده", amount: 0 });
//       } else {
//         statusMap.set(nationalId, {
//           status: walletBalance > 0 ? "بستانکار" : "بدهکار",
//           amount: Math.abs(walletBalance),
//         });
//       }
//     });

//     return statusMap;
//   }, [peopleList, allDeals, allDealsTransactions]);

//   const customerStatus = React.useMemo(() => {
//     if (!selectedNationalId) return null;
//     return customerStatusMap.get(selectedNationalId) || null;
//   }, [selectedNationalId, customerStatusMap]);

//   const isFetchingRef = React.useRef(false);
//   const lastFetchedIdsRef = React.useRef<string>("");
//   const lastSelectedNationalIdRef = React.useRef<string | null>(null);

//   React.useEffect(() => {
//     if (selectedNationalId !== lastSelectedNationalIdRef.current) {
//       lastFetchedIdsRef.current = "";
//       lastSelectedNationalIdRef.current = selectedNationalId;
//     }
//   }, [selectedNationalId]);

//   React.useEffect(() => {
//     if (selectedPersonDealIds === lastFetchedIdsRef.current) {
//       return;
//     }

//     const fetchAllPersonTransactions = async () => {
//       if (!selectedNationalId || selectedPersonDeals.length === 0) {
//         setAllPersonTransactions([]);
//         lastFetchedIdsRef.current = "";
//         return;
//       }

//       if (isFetchingRef.current) return;
//       isFetchingRef.current = true;

//       try {
//         const transactionsPromises = selectedPersonDeals.map((deal) =>
//           getTransactionsByDealId.mutateAsync(deal._id.toString())
//         );
//         const transactionsArrays = await Promise.all(transactionsPromises);
//         const allTransactions = transactionsArrays.flat();
//         setAllPersonTransactions(allTransactions);
//         lastFetchedIdsRef.current = selectedPersonDealIds;
//       } catch (error) {
//         console.log("🚀 ~ fetchAllPersonTransactions ~ error:", error);
//         setAllPersonTransactions([]);
//         lastFetchedIdsRef.current = "";
//       } finally {
//         isFetchingRef.current = false;
//       }
//     };

//     fetchAllPersonTransactions();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedNationalId, selectedPersonDealIds]);

//   React.useEffect(() => {
//     handleAllDeals();
//   }, []);

//   return (
//     <>
//       <div className="grid grid-cols-3 gap-9 justify-between items-center mt-3">
//         <div className="flex justify-between items-center">
//           <p className="text-sm">
//             مورد جستجو میتواند بخشی از نام و یا کد ملی مشتری باشد.
//           </p>
//           <input
//             type="text"
//             placeholder="اینجا تایپ کنید..."
//             className="w-32 border border-gray-600 p-0 h-7 rounded-md pr-2 placeholder:text-sm"
//             value={searchValue}
//             onChange={(e) => setSearchValue(e.target.value)}
//           />
//         </div>
//         <div className="flex justify-between items-center">
//           <p className="text-sm">تفاضل مبالغ خرید و فروش مشتری(فروش - خرید):</p>
//           <p className="text-yellow-900">
//             {diffBuySell?.toLocaleString("en-US")}
//           </p>
//         </div>
//         <div className="flex justify-between items-center">
//           <p className="text-sm">
//             تفاضل مبالغ دریافتی و پرداختی(پرداخت - دریافت):
//           </p>
//           <p className="text-yellow-900">
//             {diffPaymentReceived?.toLocaleString("en-US")}
//           </p>
//         </div>
//       </div>
//       <div className="grid grid-cols-3 gap-5 items-start mt-8">
//         <div className="h-[33.7rem] max-h-[33.7rem] border border-gray-300 p-4 rounded-md relative w-full">
//           <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
//             لیست مشتریان
//           </p>
//           <div className="h-[31rem] max-h-[31rem] overflow-y-auto rounded-md border w-full">
//             <Table className="min-w-full table-fixed text-right border-collapse">
//               <TableHeader className="top-0 sticky">
//                 <TableRow className="bg-gray-100">
//                   <TableHead className="w-[15%] text-center">ردیف</TableHead>
//                   <TableHead className="w-[65%] text-center">
//                     نام کامل
//                   </TableHead>
//                   <TableHead className="w-[50%] text-center">کدملی</TableHead>
//                   <TableHead className="w-[50%] text-center">نقش</TableHead>
//                   <TableHead className="w-[70%] text-center">وضعیت</TableHead>
//                   <TableHead className="w-[70%] text-center">
//                     تراز مالی
//                   </TableHead>
//                 </TableRow>
//               </TableHeader>

//               <TableBody>
//                 {(filteredPeopleList ?? peopleList ?? [])?.map(
//                   (person, index) => {
//                     return (
//                       <TableRow
//                         key={`${person?._id}-${index}`}
//                         onClick={() => {
//                           // handleAllDeals();
//                           setSelectedNationalId(person.nationalId.toString());
//                           setTransactions([]);
//                           setSelectedDealId(null);
//                         }}
//                         className={`cursor-pointer ${
//                           selectedNationalId?.toString() ===
//                           person.nationalId.toString()
//                             ? "bg-gray-200"
//                             : "bg-white"
//                         }`}
//                       >
//                         <TableCell className="text-center">
//                           {index + 1}
//                         </TableCell>
//                         <TableCell className="text-center">
//                           {person.fullName}
//                         </TableCell>
//                         <TableCell className="text-center">
//                           {person.nationalId}
//                         </TableCell>
//                         <TableCell className="text-center">
//                           {getPersonRole(person.nationalId?.toString() || "")}
//                         </TableCell>
//                         <TableCell className="text-center">
//                           {(() => {
//                             const status = customerStatusMap.get(
//                               person.nationalId?.toString() || ""
//                             );

//                             if (!status) return "—";
//                             return (
//                               <span
//                                 className={
//                                   status.status === "بدهکار"
//                                     ? "text-red-600"
//                                     : status.status === "بستانکار"
//                                     ? "text-green-600"
//                                     : "text-blue-600"
//                                 }
//                               >
//                                 {status.status}
//                                 {/* {status.amount > 0 && (
//                                   <span className="text-xs mr-1">
//                                     {" "}
//                                     ({status.amount.toLocaleString("en-US")})
//                                   </span>
//                                 )} */}
//                               </span>
//                             );
//                           })()}
//                         </TableCell>
//                         <TableCell className="text-center">
//                           {(() => {
//                             const status = customerStatusMap.get(
//                               person.nationalId?.toString() || ""
//                             );

//                             if (!status) return "—";
//                             return status.amount > 0 ? (
//                               <span className="text-xs mr-1">
//                                 {status.amount.toLocaleString("en-US")}
//                               </span>
//                             ) : (
//                               0
//                             );
//                           })()}
//                         </TableCell>
//                       </TableRow>
//                     );
//                   }
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//           {/* {selectedNationalId && customerStatus && (
//             <div className="mt-4 p-4 border border-gray-300 rounded-md bg-gray-50">
//               <h3 className="text-sm font-bold mb-2 text-blue-900">
//                 وضعیت نهایی مشتری
//               </h3>
//               <div className="flex justify-between items-center">
//                 <span className="text-sm">وضعیت:</span>
//                 <span
//                   className={`text-sm font-bold ${
//                     customerStatus.status === "بدهکار"
//                       ? "text-red-600"
//                       : customerStatus.status === "بستانکار"
//                       ? "text-green-600"
//                       : "text-blue-600"
//                   }`}
//                 >
//                   {customerStatus.status}
//                 </span>
//                 <span className="text-sm">مبلغ:</span>
//                 <span className="text-sm font-bold">
//                   {customerStatus.amount.toLocaleString("en-US")}
//                 </span>
//               </div>
//             </div>
//           )} */}
//         </div>
//         <div className="space-y-6">
//           <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
//             <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
//               فروشنده خودرو
//             </p>
//             <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
//               <Table className="min-w-full table-fixed text-right border-collapse">
//                 <TableHeader className="top-0 sticky">
//                   <TableRow className="bg-gray-100">
//                     <TableHead className="w-[15%] text-center">ردیف</TableHead>
//                     <TableHead className="w-[35%] text-center">شاسی</TableHead>
//                     <TableHead className="w-[55%] text-center">مدل</TableHead>
//                     <TableHead className="w-[35%] text-center">تاریخ</TableHead>
//                     <TableHead className="w-[30%] text-center">قیمت</TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 {carSeller && carSeller.length > 0
//                   ? carSeller.map((deal: IDeal, index: number) => (
//                       <TableRow
//                         key={`${deal?._id}-${index}`}
//                         onClick={() => {
//                           handleTransationDataByDealId(deal._id.toString());
//                           handleChequeDataByDealId(deal._id.toString());
//                         }}
//                         className="hover:bg-gray-50 cursor-pointer"
//                       >
//                         <TableCell className="text-center">
//                           {index + 1}
//                         </TableCell>
//                         <TableCell className="text-center">
//                           {deal.vehicleSnapshot?.vin}
//                         </TableCell>
//                         <TableCell className="text-center">
//                           {deal.vehicleSnapshot?.model}
//                         </TableCell>
//                         <TableCell className="text-center">
//                           {deal.saleDate}
//                         </TableCell>
//                         <TableCell className="text-center">
//                           {deal.salePrice?.toLocaleString("en-US")}
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   : null}
//               </Table>
//             </div>
//             {totalSellAmount && Number(totalSellAmount) > 0 ? (
//               <p className="text-green-400 mt-3 flex justify-end">
//                 {totalSellAmount?.toLocaleString("en-US")}
//               </p>
//             ) : null}
//           </div>
//           <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
//             <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
//               خریدار خودرو
//             </p>
//             <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
//               <Table className="min-w-full table-fixed text-right border-collapse">
//                 <TableHeader className="top-0 sticky">
//                   <TableRow className="bg-gray-100">
//                     <TableHead className="w-[15%] text-center">ردیف</TableHead>
//                     <TableHead className="w-[35%] text-center">شاسی</TableHead>
//                     <TableHead className="w-[55%] text-center">مدل</TableHead>
//                     <TableHead className="w-[35%] text-center">تاریخ</TableHead>
//                     <TableHead className="w-[30%] text-center">قیمت</TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 {carBuyer && carBuyer.length > 0 ? (
//                   <TableBody>
//                     {carBuyer.map((deal: IDeal, index: number) => (
//                       <TableRow
//                         key={`${deal?._id}-${index}`}
//                         onClick={() => {
//                           handleTransationDataByDealId(deal._id.toString());
//                           handleChequeDataByDealId(deal._id.toString());
//                         }}
//                         className="hover:bg-gray-50 cursor-pointer"
//                       >
//                         <TableCell className="text-center">
//                           {index + 1}
//                         </TableCell>
//                         <TableCell className="text-center">
//                           {deal.vehicleSnapshot?.vin}
//                         </TableCell>
//                         <TableCell className="text-center">
//                           {deal.vehicleSnapshot?.model}
//                         </TableCell>
//                         <TableCell className="text-center">
//                           {deal.purchaseDate}
//                         </TableCell>
//                         <TableCell className="text-center">
//                           {deal.purchasePrice?.toLocaleString("en-US")}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 ) : null}
//               </Table>
//             </div>
//             {totalBuyAmount && Number(totalBuyAmount) > 0 ? (
//               <p className="text-yellow-600 mt-3 flex justify-end">
//                 {totalBuyAmount?.toLocaleString("en-US")}
//               </p>
//             ) : null}
//           </div>
//         </div>
//         <div className="space-y-6">
//           <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
//             <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
//               دریافت و پرداخت
//             </p>
//             <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
//               <Table className="min-w-full table-fixed text-right border-collapse">
//                 <TableHeader className="top-0 sticky">
//                   <TableRow className="bg-gray-100">
//                     <TableHead className="w-12 text-center">ردیف</TableHead>
//                     <TableHead className="w-12 text-center">تاریخ</TableHead>
//                     <TableHead className="w-12 text-center">مبلغ</TableHead>
//                     <TableHead className="w-12 text-center">تراکنش</TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {transactions && transactions.length > 0
//                     ? transactions.map((item, index) => (
//                         <TableRow
//                           key={`${item?._id}-${index}`}
//                           className="hover:bg-gray-50 cursor-pointer"
//                         >
//                           <TableCell className="text-center">
//                             {index + 1}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item.transactionDate}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item?.amount?.toLocaleString("en-US") ?? ""}
//                           </TableCell>
//                           <TableCell className="text-center">
//                             {item.type} - {item.reason}
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     : null}
//                 </TableBody>
//               </Table>
//             </div>
//             {transactions && transactions.length > 0 && (
//               <div className="flex justify-between items-center gap-2">
//                 <div className="flex gap-3 items-baseline">
//                   <p className="text-sm">پرداخت</p>
//                   <p className="text-red-500 mt-3 flex justify-end">
//                     {totalPayment?.toLocaleString("en-US")}
//                   </p>
//                 </div>
//                 <div className="flex gap-3 items-baseline">
//                   <p className="text-sm">دریافت</p>
//                   <p className="text-blue-500 mt-3 flex justify-end">
//                     {totalReceived?.toLocaleString("en-US")}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//           <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
//             <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
//               لیست چک ها
//             </p>
//             <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
//               <Table className="min-w-full table-fixed text-right border-collapse">
//                 <TableHeader className="top-0 sticky">
//                   <TableRow className="bg-gray-100">
//                     <TableHead className="w-12 text-center">ردیف</TableHead>
//                     <TableHead className="w-12 text-center">سریال چک</TableHead>
//                     <TableHead className="w-12 text-center">
//                       شناسه صیادی
//                     </TableHead>
//                     <TableHead className="w-12 text-center">مبلغ</TableHead>
//                     <TableHead className="w-12 text-center">
//                       تاریخ سررسید
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {cheques?.map((item, index) => (
//                     <TableRow
//                       key={`${item?._id}-${index}`}
//                       className="hover:bg-gray-50 cursor-pointer"
//                     >
//                       <TableCell className="text-center">{index + 1}</TableCell>
//                       <TableCell className="text-center">
//                         {item?.chequeNumber ?? ""}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {item?.sayadiID ?? ""}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {item?.amount?.toLocaleString("en-US") ?? ""}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {item?.dueDate ?? ""}
//                       </TableCell>
//                     </TableRow>
//                   ))}
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
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CustomersDashboard;


"use client";
import { useGetChequesByDealId } from "@/apis/mutations/cheques";
import { useGetAllDeals } from "@/apis/mutations/deals";
import { useGetTransactionsByDealId } from "@/apis/mutations/transaction";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetAllPeople from "@/hooks/useGetAllPeople";
import { IChequeNew, IDeal, ITransactionNew } from "@/types/new-backend-types";
import React from "react";

const CustomersDashboard = () => {
  const [selectedNationalId, setSelectedNationalId] = React.useState<
    string | null
  >(null);
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [allDeals, setAllDeals] = React.useState<IDeal[]>([]);
  const [allPersonTransactions, setAllPersonTransactions] = React.useState<
    ITransactionNew[]
  >([]);
  const [allDealsTransactions, setAllDealsTransactions] = React.useState<
    ITransactionNew[]
  >([]);
  const [transactions, setTransactions] = React.useState<ITransactionNew[]>([]);
  const [cheques, setCheques] = React.useState<IChequeNew[]>([]);
  const [allPersonCheques, setAllPersonCheques] = React.useState<IChequeNew[]>([]);
  const [selectedDealId, setSelectedDealId] = React.useState<string | null>(
    null
  );

  const getTransactionsByDealId = useGetTransactionsByDealId();
  const getChequesByDealId = useGetChequesByDealId();
  const { data: allPeople } = useGetAllPeople();
  const getAllDeals = useGetAllDeals();

  const peopleList = React.useMemo(() => {
    if (!allPeople) return [];
    return allPeople.filter((person) => person.roles?.includes("customer"));
  }, [allPeople]);
  // const peopleList = allPeople
  //   ?.map((person) => (person.roles.includes("customer") ? person : null))
  //   .filter((person) => person !== null);

  const customerRolesMap = React.useMemo(() => {
    const rolesMap = new Map<string, Set<string>>();

    peopleList?.forEach((person) => {
      const nationalId = person.nationalId?.toString();
      if (!nationalId) return;

      const roles = new Set<string>();

      allDeals?.forEach((deal) => {
        if (deal.buyer.nationalId?.toString() === nationalId) {
          roles.add("خریدار");
        }
        if (deal.seller.nationalId?.toString() === nationalId) {
          roles.add("فروشنده");
        }
      });

      if (roles.size > 0) {
        rolesMap.set(nationalId, roles);
      }
    });

    return rolesMap;
  }, [allDeals, peopleList]);

  const getPersonRole = (nationalId: string): string => {
    const roles = customerRolesMap.get(nationalId);
    if (!roles || roles.size === 0) return "—";

    if (roles.has("خریدار") && roles.has("فروشنده")) {
      return "خریدار / فروشنده";
    }
    return Array.from(roles).join(" / ");
  };

  const handleAllDeals = async () => {
    try {
      const res = await getAllDeals.mutateAsync();
      setAllDeals(res);
    } catch (error) {
      console.log("🚀 ~ handleSelectChassis ~ error:", error);
      setAllDeals([]);
    }
  };

  const selectedPersonDeals = React.useMemo(() => {
    if (!selectedNationalId || allDeals.length === 0) return [];
    return allDeals.filter(
      (deal) =>
        deal.buyer.nationalId === selectedNationalId ||
        deal.seller.nationalId === selectedNationalId
    );
  }, [allDeals, selectedNationalId]);

  const carSeller = React.useMemo(() => {
    return selectedPersonDeals.filter(
      (deal) => deal.seller.nationalId === selectedNationalId
    );
  }, [selectedPersonDeals, selectedNationalId]);

  const carBuyer = React.useMemo(() => {
    return selectedPersonDeals.filter(
      (deal) => deal.buyer.nationalId === selectedNationalId
    );
  }, [selectedPersonDeals, selectedNationalId]);

  const handleTransationDataByDealId = async (dealId: string) => {
    try {
      setSelectedDealId(dealId);
      const res = await getTransactionsByDealId.mutateAsync(dealId ?? "");
      const filtered = res.filter((t) => {
        if (t.reason?.includes("حقوق") || t.reason?.includes("پرداخت حقوق")) {
          return false;
        }

        if (t.type === "پرداخت") {
          const reasonNormalized = t.reason?.replace(/\s/g, "") || "";
          return (
            t.reason === "خرید خودرو" ||
            t.reason?.includes("خريد") ||
            t.reason?.includes("خرید") ||
            t.reason === "درصد کارگزار" ||
            reasonNormalized.includes("هزینهوسیله") ||
            reasonNormalized.includes("هزينهوسیله")
          );
        }

        if (t.type === "دریافت") {
          return t.reason === "فروش";
        }

        return false;
      });
      setTransactions(filtered);
    } catch (error) {
      console.log("🚀 ~ handleTransationDataByDealId ~ error:", error);
    }
  };

  const handleChequeDataByDealId = async (dealId: string) => {
    try {
      const res = await getChequesByDealId.mutateAsync(dealId);
      setCheques(res);
    } catch (error) {
      console.log("🚀 ~ handleChequeDataByDealId ~ error:", error);
    }
  };

  React.useEffect(() => {
    const fetchAllDealsCheques = async () => {
      if (allDeals.length === 0) {
        setAllPersonCheques([]);
        return;
      }

      try {
        const chequesPromises = allDeals.map((deal) =>
          getChequesByDealId.mutateAsync(deal._id.toString())
        );
        const chequesArrays = await Promise.all(chequesPromises);
        const allCheques = chequesArrays.flat();
        setAllPersonCheques(allCheques);
      } catch (error) {
        console.error("Error fetching all deals cheques:", error);
        setAllPersonCheques([]);
      }
    };

    fetchAllDealsCheques();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDeals]);

  const displayedCheques = React.useMemo(() => {
    if (!selectedNationalId) return [];

    if (selectedDealId && cheques.length > 0) {
      const selectedDeal = selectedPersonDeals.find(
        (d) => d._id.toString() === selectedDealId
      );
      if (!selectedDeal) return [];

      const sellerNationalIdStr =
        selectedDeal.seller.nationalId?.toString() || "";
      const buyerNationalIdStr =
        selectedDeal.buyer.nationalId?.toString() || "";
      const selectedNationalIdStr = selectedNationalId?.toString() || "";

      const isSeller = sellerNationalIdStr === selectedNationalIdStr;
      const isBuyer = buyerNationalIdStr === selectedNationalIdStr;

      return cheques.filter((c) => {
        if (isSeller) {
          return (
            c.type === "issued" ||
            c.type === "صادره" ||
            c.payee?.nationalId?.toString() === selectedNationalIdStr
          );
        }
        if (isBuyer) {
          return (
            c.type === "received" ||
            c.type === "وارده" ||
            c.payer?.nationalId?.toString() === selectedNationalIdStr
          );
        }
        return false;
      });
    }

    if (allPersonCheques.length > 0) {
      const selectedNationalIdStr = selectedNationalId?.toString() || "";
      return allPersonCheques.filter((c) => {
        return (
          c.payer?.nationalId?.toString() === selectedNationalIdStr ||
          c.payee?.nationalId?.toString() === selectedNationalIdStr
        );
      });
    }

    return [];
  }, [
    selectedNationalId,
    selectedDealId,
    cheques,
    selectedPersonDeals,
    allPersonCheques,
  ]);

  const filteredPeopleList = React.useMemo(() => {
    if (!searchValue) return peopleList;

    const lowerSearch = searchValue.toLowerCase().trim();

    return peopleList?.filter(
      (user) =>
        user.fullName?.toLowerCase().includes(lowerSearch) ||
        user.nationalId?.toString().includes(lowerSearch)
    );
  }, [searchValue, peopleList]);

  const totalBuyAmount = carBuyer.reduce(
    (sum, deal) => sum + (deal.purchasePrice || 0),
    0
  );

  const totalSellAmount = carSeller.reduce(
    (sum, deal) => sum + (deal.salePrice || 0),
    0
  );

  const diffBuySell = (totalSellAmount || 0) - (totalBuyAmount || 0);

  const selectedPersonDealIds = React.useMemo(() => {
    return selectedPersonDeals
      .map((deal) => deal._id.toString())
      .sort()
      .join(",");
  }, [selectedPersonDeals]);

  const displayedTransactions = React.useMemo(() => {
    if (!selectedNationalId) return [];

    if (selectedDealId && transactions.length > 0) {
      const selectedDeal = selectedPersonDeals.find(
        (d) => d._id.toString() === selectedDealId
      );
      if (!selectedDeal) return [];

      const sellerNationalIdStr =
        selectedDeal.seller.nationalId?.toString() || "";
      const buyerNationalIdStr =
        selectedDeal.buyer.nationalId?.toString() || "";
      const selectedNationalIdStr = selectedNationalId?.toString() || "";

      const isSeller = sellerNationalIdStr === selectedNationalIdStr;
      const isBuyer = buyerNationalIdStr === selectedNationalIdStr;

      return transactions.filter((t) => {
        if (isSeller && t.type === "پرداخت") {
          return (
            t.reason === "خرید خودرو" ||
            t.reason?.includes("خريد") ||
            t.reason?.includes("خرید")
          );
        }
        if (isBuyer && t.type === "دریافت") {
          return t.reason === "فروش";
        }
        return false;
      });
    }

    // State 3: Only Customer selected - show all vehicle-related transactions for this customer
    // Filter: transactions must be from deals where this customer is involved (as seller or buyer)
    if (allPersonTransactions.length > 0) {
      return allPersonTransactions.filter((t) => {
        // First: exclude salary transactions
        if (t.reason?.includes("حقوق") || t.reason?.includes("پرداخت حقوق")) {
          return false;
        }

        // Second: check if transaction is vehicle-related
        let isVehicleRelated = false;
        if (t.type === "پرداخت") {
          const reasonNormalized = t.reason?.replace(/\s/g, "") || "";
          isVehicleRelated = (
            t.reason === "خرید خودرو" ||
            t.reason?.includes("خريد") ||
            t.reason?.includes("خرید") ||
            t.reason === "درصد کارگزار" ||
            reasonNormalized.includes("هزینهوسیله") ||
            reasonNormalized.includes("هزينهوسیله")
          );
        } else if (t.type === "دریافت") {
          isVehicleRelated = t.reason === "فروش";
        }

        if (!isVehicleRelated) return false;

        // Third: check if transaction is from a deal where this customer is involved
        const dealForTransaction = selectedPersonDeals.find(
          (d) => d._id.toString() === t.dealId
        );
        if (!dealForTransaction) return false;

        const sellerNationalIdStr =
          dealForTransaction.seller.nationalId?.toString() || "";
        const buyerNationalIdStr =
          dealForTransaction.buyer.nationalId?.toString() || "";
        const selectedNationalIdStr = selectedNationalId?.toString() || "";

        const isSeller = sellerNationalIdStr === selectedNationalIdStr;
        const isBuyer = buyerNationalIdStr === selectedNationalIdStr;

        // Show transaction if customer is involved in the deal
        // For seller: show payments (خرید خودرو) - these are payments TO seller
        // For buyer: show receipts (فروش) - these are receipts FROM buyer
        if (isSeller && t.type === "پرداخت") {
          return (
            t.reason === "خرید خودرو" ||
            t.reason?.includes("خريد") ||
            t.reason?.includes("خرید")
          );
        }
        if (isBuyer && t.type === "دریافت") {
          return t.reason === "فروش";
        }

        // Also show other vehicle-related transactions (broker commission, vehicle costs) 
        // if customer is involved in the deal
        if ((isSeller || isBuyer) && t.type === "پرداخت") {
          const reasonNormalized = t.reason?.replace(/\s/g, "") || "";
          return (
            t.reason === "درصد کارگزار" ||
            reasonNormalized.includes("هزینهوسیله") ||
            reasonNormalized.includes("هزينهوسیله")
          );
        }

        return false;
      });
    }

    return [];
  }, [
    selectedNationalId,
    selectedDealId,
    transactions,
    selectedPersonDeals,
    allPersonTransactions,
  ]);

  const { totalReceived, totalPayment } = React.useMemo(() => {
    if (!selectedNationalId) {
      return { totalReceived: 0, totalPayment: 0 };
    }

    let received = 0;
    let payment = 0;

    displayedTransactions.forEach((t) => {
      if (t.type === "پرداخت") {
        payment += t.amount || 0;
      } else if (t.type === "دریافت") {
        received += t.amount || 0;
      }
    });

    return { totalReceived: received, totalPayment: payment };
  }, [selectedNationalId, displayedTransactions]);

  // diffPaymentReceived should match walletBalance in state 3 (customer only)
  // In state 2 (customer + deal), it shows the difference for that specific deal
  const diffPaymentReceived = (totalPayment || 0) - (totalReceived || 0);

  React.useEffect(() => {
    const fetchAllDealsTransactions = async () => {
      if (allDeals.length === 0) {
        setAllDealsTransactions([]);
        return;
      }

      try {
        const transactionsPromises = allDeals.map((deal) =>
          getTransactionsByDealId.mutateAsync(deal._id.toString())
        );
        const transactionsArrays = await Promise.all(transactionsPromises);
        const allTransactions = transactionsArrays.flat();
        setAllDealsTransactions(allTransactions);
      } catch (error) {
        console.error("Error fetching all deals transactions:", error);
        setAllDealsTransactions([]);
      }
    };

    fetchAllDealsTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDeals]);

  const customerStatusMap = React.useMemo(() => {
    const statusMap = new Map<string, { status: string; amount: number }>();

    peopleList?.forEach((person) => {
      const nationalId = person.nationalId?.toString();
      if (!nationalId) return;

      const personDeals = allDeals.filter(
        (deal) =>
          deal.buyer.nationalId?.toString() === nationalId ||
          deal.seller.nationalId?.toString() === nationalId
      );

      if (personDeals.length === 0) {
        statusMap.set(nationalId, { status: "—", amount: 0 });
        return;
      }

      let totalPaidToSeller = 0;
      let totalPurchasePrice = 0;

      personDeals.forEach((deal) => {
        if (deal.seller.nationalId?.toString() === nationalId) {
          totalPurchasePrice += deal.purchasePrice || 0;

          const sellerPersonId = deal.seller.personId?.toString();
          const dealTransactions = allDealsTransactions.filter(
            (t) => t.dealId === deal._id.toString()
          );

          // Count all "خرید خودرو" transactions for this deal, not just those with matching personId
          const paymentsToSeller = dealTransactions
            .filter(
              (t) =>
                t.type === "پرداخت" &&
                (t.reason === "خرید خودرو" ||
                  t.reason?.includes("خريد") ||
                  t.reason?.includes("خرید"))
            )
            .reduce((sum, t) => sum + (t.amount || 0), 0);

          totalPaidToSeller += paymentsToSeller;
        }
      });

      let totalReceivedFromBuyer = 0;
      let totalSalePrice = 0;

      personDeals.forEach((deal) => {
        if (deal.buyer.nationalId?.toString() === nationalId) {
          totalSalePrice += deal.salePrice || 0;

          const buyerPersonId = deal.buyer.personId?.toString();
          const dealTransactions = allDealsTransactions.filter(
            (t) => t.dealId === deal._id.toString()
          );

          // Count all "فروش" transactions for this deal, not just those with matching personId
          const receiptsFromBuyer = dealTransactions
            .filter(
              (t) =>
                t.type === "دریافت" &&
                t.reason === "فروش"
            )
            .reduce((sum, t) => sum + (t.amount || 0), 0);

          totalReceivedFromBuyer += receiptsFromBuyer;
        }
      });

      // totalPaidToSeller: what we paid to this person when they were seller
      // totalReceivedFromBuyer: what we received from this person when they were buyer
      // 
      // If person was seller: we owe them (purchasePrice - paid) = sellerDebt (positive means we owe)
      // If person was buyer: they owe us (salePrice - received) = buyerDebt (positive means they owe)
      //
      // walletBalance from customer perspective:
      // - If they sold us a car: they should receive purchasePrice, we paid totalPaidToSeller
      //   So they are owed: purchasePrice - totalPaidToSeller (positive = بستانکار)
      // - If they bought a car: they should pay salePrice, we received totalReceivedFromBuyer
      //   So they owe: salePrice - totalReceivedFromBuyer (positive = بدهکار)
      //
      // Net balance: (what they are owed as seller) - (what they owe as buyer)
      // = (purchasePrice - totalPaidToSeller) - (salePrice - totalReceivedFromBuyer)
      // = (purchasePrice - salePrice) - (totalPaidToSeller - totalReceivedFromBuyer)
      const sellerCredit = totalPurchasePrice - totalPaidToSeller; // What we owe them (positive = they are بستانکار)
      const buyerDebt = totalSalePrice - totalReceivedFromBuyer; // What they owe us (positive = they are بدهکار)

      // Net balance: positive = they are بستانکار (we owe them), negative = they are بدهکار (they owe us)
      const walletBalance = sellerCredit - buyerDebt;

      const diff = Math.abs(walletBalance);
      // Use a larger threshold (10000 rials) for settlement check
      if (diff < 10000) {
        statusMap.set(nationalId, { status: "تسویه شده", amount: 0 });
      } else {
        statusMap.set(nationalId, {
          status: walletBalance > 0 ? "بستانکار" : "بدهکار",
          amount: Math.abs(walletBalance),
        });
      }
    });

    return statusMap;
  }, [peopleList, allDeals, allDealsTransactions]);

  const customerStatus = React.useMemo(() => {
    if (!selectedNationalId) return null;
    return customerStatusMap.get(selectedNationalId) || null;
  }, [selectedNationalId, customerStatusMap]);

  const isFetchingRef = React.useRef(false);
  const lastFetchedIdsRef = React.useRef<string>("");
  const lastSelectedNationalIdRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (selectedNationalId !== lastSelectedNationalIdRef.current) {
      lastFetchedIdsRef.current = "";
      lastSelectedNationalIdRef.current = selectedNationalId;
    }
  }, [selectedNationalId]);

  React.useEffect(() => {
    if (selectedPersonDealIds === lastFetchedIdsRef.current) {
      return;
    }

    const fetchAllPersonTransactions = async () => {
      if (!selectedNationalId || selectedPersonDeals.length === 0) {
        setAllPersonTransactions([]);
        lastFetchedIdsRef.current = "";
        return;
      }

      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      try {
        const transactionsPromises = selectedPersonDeals.map((deal) =>
          getTransactionsByDealId.mutateAsync(deal._id.toString())
        );
        const transactionsArrays = await Promise.all(transactionsPromises);
        const allTransactions = transactionsArrays.flat();
        setAllPersonTransactions(allTransactions);
        lastFetchedIdsRef.current = selectedPersonDealIds;
      } catch (error) {
        console.log("🚀 ~ fetchAllPersonTransactions ~ error:", error);
        setAllPersonTransactions([]);
        lastFetchedIdsRef.current = "";
      } finally {
        isFetchingRef.current = false;
      }
    };

    fetchAllPersonTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNationalId, selectedPersonDealIds]);

  React.useEffect(() => {
    handleAllDeals();
  }, []);

  return (
    <>
      <div className="grid grid-cols-3 gap-9 justify-between items-center mt-3">
        <div className="flex justify-between items-center">
          <p className="text-sm">
            مورد جستجو میتواند بخشی از نام و یا کد ملی مشتری باشد.
          </p>
          <input
            type="text"
            placeholder="اینجا تایپ کنید..."
            className="w-32 border border-gray-600 p-0 h-7 rounded-md pr-2 placeholder:text-sm"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm">تفاضل مبالغ خرید و فروش مشتری(فروش - خرید):</p>
          <p className="text-yellow-900">
            {diffBuySell?.toLocaleString("en-US")}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm">
            تفاضل مبالغ دریافتی و پرداختی(پرداخت - دریافت):
          </p>
          <p className="text-yellow-900">
            {diffPaymentReceived?.toLocaleString("en-US")}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-5 items-start mt-8">
        <div className="h-[33.7rem] max-h-[33.7rem] border border-gray-300 p-4 rounded-md relative w-full">
          <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
            لیست مشتریان
          </p>
          <div className="h-[31rem] max-h-[31rem] overflow-y-auto rounded-md border w-full">
            <Table className="min-w-full table-fixed text-right border-collapse">
              <TableHeader className="top-0 sticky">
                <TableRow className="bg-gray-100">
                  <TableHead className="w-[15%] text-center">ردیف</TableHead>
                  <TableHead className="w-[65%] text-center">
                    نام کامل
                  </TableHead>
                  <TableHead className="w-[50%] text-center">کدملی</TableHead>
                  <TableHead className="w-[50%] text-center">نقش</TableHead>
                  <TableHead className="w-[70%] text-center">وضعیت</TableHead>
                  <TableHead className="w-[70%] text-center">
                    تراز مالی
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {(filteredPeopleList ?? peopleList ?? [])?.map(
                  (person, index) => {
                    return (
                      <TableRow
                        key={`${person?._id}-${index}`}
                        onClick={() => {
                          // handleAllDeals();
                          setSelectedNationalId(person.nationalId.toString());
                          setTransactions([]);
                          setSelectedDealId(null);
                        }}
                        className={`cursor-pointer ${selectedNationalId?.toString() ===
                          person.nationalId.toString()
                          ? "bg-gray-200"
                          : "bg-white"
                          }`}
                      >
                        <TableCell className="text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-center">
                          {person.fullName}
                        </TableCell>
                        <TableCell className="text-center">
                          {person.nationalId}
                        </TableCell>
                        <TableCell className="text-center">
                          {getPersonRole(person.nationalId?.toString() || "")}
                        </TableCell>
                        <TableCell className="text-center">
                          {(() => {
                            const status = customerStatusMap.get(
                              person.nationalId?.toString() || ""
                            );

                            if (!status) return "—";
                            return (
                              <span
                                className={
                                  status.status === "بدهکار"
                                    ? "text-red-600"
                                    : status.status === "بستانکار"
                                      ? "text-green-600"
                                      : "text-blue-600"
                                }
                              >
                                {status.status}
                                {/* {status.amount > 0 && (
                                  <span className="text-xs mr-1">
                                    {" "}
                                    ({status.amount.toLocaleString("en-US")})
                                  </span>
                                )} */}
                              </span>
                            );
                          })()}
                        </TableCell>
                        <TableCell className="text-center">
                          {(() => {
                            const status = customerStatusMap.get(
                              person.nationalId?.toString() || ""
                            );

                            if (!status) return "—";
                            return status.amount > 0 ? (
                              <span className="text-xs mr-1">
                                {status.amount.toLocaleString("en-US")}
                              </span>
                            ) : (
                              0
                            );
                          })()}
                        </TableCell>
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          </div>
          {/* {selectedNationalId && customerStatus && (
            <div className="mt-4 p-4 border border-gray-300 rounded-md bg-gray-50">
              <h3 className="text-sm font-bold mb-2 text-blue-900">
                وضعیت نهایی مشتری
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-sm">وضعیت:</span>
                <span
                  className={`text-sm font-bold ${
                    customerStatus.status === "بدهکار"
                      ? "text-red-600"
                      : customerStatus.status === "بستانکار"
                      ? "text-green-600"
                      : "text-blue-600"
                  }`}
                >
                  {customerStatus.status}
                </span>
                <span className="text-sm">مبلغ:</span>
                <span className="text-sm font-bold">
                  {customerStatus.amount.toLocaleString("en-US")}
                </span>
              </div>
            </div>
          )} */}
        </div>
        <div className="space-y-6">
          <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
              فروشنده خودرو
            </p>
            <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-[15%] text-center">ردیف</TableHead>
                    <TableHead className="w-[35%] text-center">شاسی</TableHead>
                    <TableHead className="w-[55%] text-center">مدل</TableHead>
                    <TableHead className="w-[35%] text-center">تاریخ</TableHead>
                    <TableHead className="w-[30%] text-center">قیمت</TableHead>
                  </TableRow>
                </TableHeader>

                {carSeller && carSeller.length > 0
                  ? carSeller.map((deal: IDeal, index: number) => (
                    <TableRow
                      key={`${deal?._id}-${index}`}
                      onClick={() => {
                        handleTransationDataByDealId(deal._id.toString());
                        handleChequeDataByDealId(deal._id.toString());
                      }}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <TableCell className="text-center">
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-center">
                        {deal.vehicleSnapshot?.vin}
                      </TableCell>
                      <TableCell className="text-center">
                        {deal.vehicleSnapshot?.model}
                      </TableCell>
                      <TableCell className="text-center">
                        {deal.saleDate}
                      </TableCell>
                      <TableCell className="text-center">
                        {deal.salePrice?.toLocaleString("en-US")}
                      </TableCell>
                    </TableRow>
                  ))
                  : null}
              </Table>
            </div>
            {totalSellAmount && Number(totalSellAmount) > 0 ? (
              <p className="text-green-400 mt-3 flex justify-end">
                {totalSellAmount?.toLocaleString("en-US")}
              </p>
            ) : null}
          </div>
          <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
              خریدار خودرو
            </p>
            <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-[15%] text-center">ردیف</TableHead>
                    <TableHead className="w-[35%] text-center">شاسی</TableHead>
                    <TableHead className="w-[55%] text-center">مدل</TableHead>
                    <TableHead className="w-[35%] text-center">تاریخ</TableHead>
                    <TableHead className="w-[30%] text-center">قیمت</TableHead>
                  </TableRow>
                </TableHeader>

                {carBuyer && carBuyer.length > 0 ? (
                  <TableBody>
                    {carBuyer.map((deal: IDeal, index: number) => (
                      <TableRow
                        key={`${deal?._id}-${index}`}
                        onClick={() => {
                          handleTransationDataByDealId(deal._id.toString());
                          handleChequeDataByDealId(deal._id.toString());
                        }}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <TableCell className="text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-center">
                          {deal.vehicleSnapshot?.vin}
                        </TableCell>
                        <TableCell className="text-center">
                          {deal.vehicleSnapshot?.model}
                        </TableCell>
                        <TableCell className="text-center">
                          {deal.purchaseDate}
                        </TableCell>
                        <TableCell className="text-center">
                          {deal.purchasePrice?.toLocaleString("en-US")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                ) : null}
              </Table>
            </div>
            {totalBuyAmount && Number(totalBuyAmount) > 0 ? (
              <p className="text-yellow-600 mt-3 flex justify-end">
                {totalBuyAmount?.toLocaleString("en-US")}
              </p>
            ) : null}
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
              دریافت و پرداخت
            </p>
            <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-12 text-center">ردیف</TableHead>
                    <TableHead className="w-12 text-center">تاریخ</TableHead>
                    <TableHead className="w-12 text-center">مبلغ</TableHead>
                    <TableHead className="w-12 text-center">تراکنش</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {displayedTransactions && displayedTransactions.length > 0
                    ? displayedTransactions.map((item, index) => (
                      <TableRow
                        key={`${item?._id}-${index}`}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <TableCell className="text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.transactionDate}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.amount?.toLocaleString("en-US") ?? ""}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.type} - {item.reason}
                        </TableCell>
                      </TableRow>
                    ))
                    : null}
                </TableBody>
              </Table>
            </div>
            {displayedTransactions && displayedTransactions.length > 0 && (
              <div className="flex justify-between items-center gap-2">
                <div className="flex gap-3 items-baseline">
                  <p className="text-sm">پرداخت</p>
                  <p className="text-red-500 mt-3 flex justify-end">
                    {totalPayment?.toLocaleString("en-US")}
                  </p>
                </div>
                <div className="flex gap-3 items-baseline">
                  <p className="text-sm">دریافت</p>
                  <p className="text-blue-500 mt-3 flex justify-end">
                    {totalReceived?.toLocaleString("en-US")}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
              لیست چک ها
            </p>
            <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-12 text-center">ردیف</TableHead>
                    <TableHead className="w-12 text-center">سریال چک</TableHead>
                    <TableHead className="w-12 text-center">
                      شناسه صیادی
                    </TableHead>
                    <TableHead className="w-12 text-center">مبلغ</TableHead>
                    <TableHead className="w-12 text-center">
                      تاریخ سررسید
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {displayedCheques?.map((item, index) => (
                    <TableRow
                      key={`${item?._id}-${index}`}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center">
                        {item?.chequeNumber ?? ""}
                      </TableCell>
                      <TableCell className="text-center">
                        {item?.sayadiID ?? ""}
                      </TableCell>
                      <TableCell className="text-center">
                        {item?.amount?.toLocaleString("en-US") ?? ""}
                      </TableCell>
                      <TableCell className="text-center">
                        {item?.dueDate ?? ""}
                      </TableCell>
                    </TableRow>
                  ))}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomersDashboard;
