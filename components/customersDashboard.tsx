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
import {
  useDeleteCheque,
  useGetChequesByDealId,
  useGetChequesByPersonId,
} from "@/apis/mutations/cheques";
import useGetAllDeals from "@/hooks/useGetAllDeals";
import useGetAllTransactions from "@/hooks/useGetAllTransaction";
import useGetAllCheques from "@/hooks/useGetAllCheques";
import {
  useDeleteTransaction,
  useGetTransactionsByDealId,
  useGetTransactionsByPersonId,
} from "@/apis/mutations/transaction";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetAllPeople from "@/hooks/useGetAllPeople";
import {
  IChequeNew,
  IDeal,
  IDealWithRole,
  ITransactionNew,
} from "@/types/new-backend-types";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setChassisNo,
  setSelectedDealId as setSelectedDealIdRedux,
} from "@/redux/slices/carSlice";
import { formatPrice } from "@/utils/systemConstants";
import { RootState } from "@/redux/store";
import {
  Pencil,
  Printer,
  PrinterCheck,
  RefreshCcwIcon,
  Trash,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import TransactionForm from "./forms/transactionForm";
import DeleteModal from "./modals/deleteModal";
import { useDeleteWalletTransaction } from "@/apis/mutations/people";
import { setVehicleUpdated } from "@/redux/slices/transactionSlice";
import useGetDealsByVin from "@/hooks/useGetDealsByVin";

const CustomersDashboard = () => {
  const [selectedNationalId, setSelectedNationalId] = React.useState<
    string | null
  >(null);
  const [selectedChassisNo, setSelectedChassisNo] = React.useState<
    string | null
  >(null);
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [transactions, setTransactions] = React.useState<ITransactionNew[]>([]);
  const [cheques, setCheques] = React.useState<IChequeNew[]>([]);
  const [selectedDealId, setSelectedDealId] = React.useState<string | null>(
    null,
  );
  const [selectedPersonId, setSelectedPersonId] = React.useState<string | null>(
    null,
  );
  const [selectedVin, setSelectedVin] = React.useState<string | null>(null);

  const [isOpenEditModal, setIsOpenEditModal] = React.useState<boolean>(false);
  const [transactionId, setTransactionId] = React.useState<string | undefined>(
    undefined,
  );
  const [dealId, setDealId] = React.useState<string | undefined>(undefined);
  const [isOpenDeleteModal, setIsOpenDeleteModal] =
    React.useState<boolean>(false);
  const [transactionToDelete, setTransactionToDelete] = React.useState<
    string | undefined
  >(undefined);
  const [dealToDelete, setDealToDelete] = React.useState<string | undefined>(
    undefined,
  );
  // const [secondTransactionToDelete, setSecondTransactionToDelete] =
  //   React.useState<string | undefined>(undefined);
  const [secondDealToDelete, setSecondDealToDelete] = React.useState<
    string | undefined
  >(undefined);
  const [secondPersonId, setSecondPersonId] = React.useState<
    string | undefined
  >(undefined);
  const [isCustomerToCustomer, setIsCustomerToCustomer] =
    React.useState<boolean>(false);
  const [personId, setPersonId] = React.useState<string | undefined>(undefined);
  const [isChequeTransaction, setIsChequeTransaction] =
    React.useState<boolean>(false);
  const [deal, setDeal] = React.useState<IDeal>();

  const { vehicleUpdated, optionUpdated, transactionCreated } = useSelector(
    (state: RootState) => state.transaction,
  );

  const { chassisNo, selectedDealId: selectedDealIdFromRedux } = useSelector(
    (state: RootState) => state.cars,
  );

  const dispatch = useDispatch();
  const getTransactionsByDealId = useGetTransactionsByDealId();
  const getChequesByDealId = useGetChequesByDealId();
  const getChequesByPersonId = useGetChequesByPersonId();
  const { data: allPeople } = useGetAllPeople();
  const { data: allDeals = [] } = useGetAllDeals();
  const { data: allTransactionsData } = useGetAllTransactions();
  const { data: allPersonCheques = [] } = useGetAllCheques();
  const allDealsTransactions = allTransactionsData ?? [];
  const getTransactionsByPersonId = useGetTransactionsByPersonId();
  const queryClient = useQueryClient();
  const deleteTransaction = useDeleteTransaction();
  const deleteWalletTransaction = useDeleteWalletTransaction();
  const deleteCheque = useDeleteCheque();
  const getDealByVin = useGetDealsByVin(chassisNo);
  const dealsData = getDealByVin.data;

  const peopleList = React.useMemo(() => {
    if (!allPeople) return [];
    return allPeople
      .filter(
        (person) =>
          person.roles?.includes("customer") ||
          person.roles?.includes("moneyChanger"),
      )
      .sort((a, b) => {
        const aIsMoneyChanger = a.roles?.includes("moneyChanger") ? 1 : 0;
        const bIsMoneyChanger = b.roles?.includes("moneyChanger") ? 1 : 0;

        return bIsMoneyChanger - aIsMoneyChanger;
      });
  }, [allPeople, vehicleUpdated]);
  // const peopleList = allPeople
  //   ?.map((person) => (person.roles.includes("customer") ? person : null))
  //   .filter((person) => person !== null);

  const transactionsByPersonId = async (personId: string) => {
    try {
      const res = await getTransactionsByPersonId.mutateAsync(personId ?? "");
      setTransactions(res);
    } catch (error) {
      console.log("🚀 ~ CustomersDashboard ~ error:", error);
    }
  };

  const customerRolesMap = React.useMemo(() => {
    const rolesMap = new Map<string, Set<string>>();

    peopleList?.forEach((person) => {
      const nationalId = person?.nationalId?.toString();
      if (!nationalId) return;

      const roles = new Set<string>();

      if (person.roles?.includes("moneyChanger")) {
        roles.add("صراف");
      }

      allDeals?.forEach((deal) => {
        if (deal?.buyer?.nationalId?.toString() === nationalId) {
          roles.add("خریدار");
        }
        if (deal?.seller?.nationalId?.toString() === nationalId) {
          roles.add("فروشنده");
        }
      });

      if (roles?.size > 0) {
        rolesMap.set(nationalId, roles);
      }
    });

    return rolesMap;
  }, [allDeals, peopleList]);

  const getPersonRole = (nationalId: string): string => {
    const roles = customerRolesMap.get(nationalId);
    if (!roles || roles?.size === 0) return "—";

    // if (roles.has("خریدار") && roles.has("فروشنده")) {
    //   return "خریدار / فروشنده";
    // }
    // return Array.from(roles).join(" / ");
    const order = ["صراف", "فروشنده", "خریدار"];

    const sortedRoles = order.filter((r) => roles.has(r));

    return sortedRoles.join(" / ");
  };

  const selectedPersonDeals = React.useMemo(() => {
    if (!selectedNationalId || allDeals.length === 0) return [];
    return allDeals.filter(
      (deal) =>
        deal?.buyer?.nationalId === selectedNationalId ||
        deal?.seller?.nationalId === selectedNationalId,
    );
  }, [allDeals, selectedNationalId]);

  const carSeller = React.useMemo(() => {
    return selectedPersonDeals.filter(
      (deal) => deal?.seller?.nationalId === selectedNationalId,
    );
  }, [selectedPersonDeals, selectedNationalId]);

  const carBuyer = React.useMemo(() => {
    return selectedPersonDeals.filter(
      (deal) => deal?.buyer?.nationalId === selectedNationalId,
    );
  }, [selectedPersonDeals, selectedNationalId]);

  const mergedDeals = React.useMemo(() => {
    const buyers: IDealWithRole[] = carBuyer.map((deal) => ({
      ...deal,
      roleType: "buyer",
    }));

    const sellers: IDealWithRole[] = carSeller.map((deal) => ({
      ...deal,
      roleType: "seller",
    }));

    return [...buyers, ...sellers];
  }, [carBuyer, carSeller]);

  const handleTransationDataByDealId = async (dealId: string) => {
    try {
      setSelectedDealId(dealId);
      dispatch(setSelectedDealIdRedux(dealId));
      const selectedDeal = selectedPersonDeals.find(
        (d) => d._id.toString() === dealId,
      );
      if (selectedDeal) {
        const chassisNo = selectedDeal?.vehicleSnapshot?.vin || null;
        setSelectedChassisNo(chassisNo);
        if (chassisNo) {
          dispatch(setChassisNo(chassisNo));
        }
      }
      // const res = await getTransactionsByDealId.mutateAsync(dealId ?? "");
      // const filtered = res.filter((t) => {
      //   if (t.reason?.includes("حقوق") || t.reason?.includes("پرداخت حقوق")) {
      //     return false;
      //   }

      //   if (t.type === "پرداخت") {
      //     const reasonNormalized = t?.reason?.replace(/\s/g, "") || "";
      //     return (
      //       t.reason === "خرید خودرو" ||
      //       t.reason?.includes("خريد") ||
      //       t.reason?.includes("خرید") ||
      //       t.reason === "درصد کارگزار" ||
      //       reasonNormalized.includes("هزینهوسیله") ||
      //       reasonNormalized.includes("هزينهوسیله")
      //     );
      //   }

      //   if (t.type === "دریافت") {
      //     return t.reason === "فروش";
      //   }

      //   return false;
      // });

      // const filteredTransactions = filtered.filter(
      //   (el) => el?.personId === selectedPersonId,
      // );
      // setTransactions(filteredTransactions);
    } catch (error) {
      console.log("🚀 ~ handleTransationDataByDealId ~ error:", error);
    }
  };

  const handleChequeDataByDealId = async (dealId: string) => {
    try {
      const res = await getChequesByDealId.mutateAsync(dealId);

      if (selectedNationalId) {
        const filteredCheques = res.filter((cheque) => {
          const payerNationalId = cheque?.payer?.nationalId?.toString();
          const payeeNationalId = cheque?.payee?.nationalId?.toString();
          const selectedNationalIdStr = selectedNationalId?.toString() || "";

          return (
            payerNationalId === selectedNationalIdStr ||
            payeeNationalId === selectedNationalIdStr
          );
        });

        setCheques(filteredCheques);
      } else {
        setCheques(res);
      }
    } catch (error) {
      console.log("🚀 ~ handleChequeDataByDealId ~ error:", error);
    }
  };

  const handleChequeDataByPersonlId = async (personId: string) => {
    try {
      const res = await getChequesByPersonId.mutateAsync(personId);
      setCheques(res.cheques);
    } catch (error) {
      console.log("🚀 ~ handleChequeDataByDealId ~ error:", error);
    }
  };

  const handleDeleteClick = (transactionId: string) => {
    setTransactionToDelete(transactionId);
    setIsOpenDeleteModal(true);
  };

  const handleEditSuccess = () => {
    setIsOpenEditModal(false);
    setTransactionId(undefined);
    // getTransactionsByDealIdHandler();
    handleAllDeals();
    transactionsByPersonId(selectedPersonId ?? "");
    handleTransationDataByDealId(selectedDealId ?? "");
    handleChequeDataByDealId(selectedDealId ?? "");
    handleChequeDataByPersonlId(selectedPersonId ?? "");
    queryClient.invalidateQueries({
      queryKey: ["get-all-transaction"],
    });
  };

  const deleteBrokersWalletHandler = async () => {
    if (!deal) return;
    try {
      await deleteWalletTransaction.mutateAsync({
        id: deal.purchaseBroker.personId ?? "",
        data: {
          dealID: deal._id ?? "",
          transactionID: transactionToDelete ?? "",
        },
      });
      await deleteWalletTransaction.mutateAsync({
        id: deal.saleBroker.personId ?? "",
        data: {
          dealID: deal._id ?? "",
          transactionID: transactionToDelete ?? "",
        },
      });
    } catch (error) {
      console.log("🚀 ~ deleteBrokersWalletHandler ~ error:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (transactionToDelete) {
      try {
        await deleteTransaction.mutateAsync(transactionToDelete);
        setIsOpenDeleteModal(false);
        setTransactionToDelete(undefined);
        // Refresh transactions after delete
        // await getTransactionsByDealIdHandler();

        queryClient.invalidateQueries({
          queryKey: ["get-all-transaction"],
        });

        deleteBrokersWalletHandler();

        await deleteWalletTransaction.mutateAsync({
          id: personId ?? "",
          data: {
            dealID: dealToDelete ?? "",
            transactionID: transactionToDelete ?? "",
          },
        });

        if (isCustomerToCustomer) {
          await deleteWalletTransaction.mutateAsync({
            id: secondPersonId ?? "",
            data: {
              dealID: dealToDelete ?? secondDealToDelete ?? "",
              transactionID: transactionToDelete ?? "",
            },
          });
        }

        dispatch(setVehicleUpdated(transactionToDelete));

        const chequeId =
          cheques?.filter(
            (c) => c.relatedTransactionId === transactionToDelete,
          )[0]?._id ?? "";
        queryClient.invalidateQueries({
          queryKey: ["get-all-people"],
        });

        if (isChequeTransaction) {
          await deleteCheque.mutateAsync(chequeId);
          // toast.success("تراکنش با موفقیت ثبت شد");
          // getChequesByDealIdHandler();
        }
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  React.useEffect(() => {
    if (dealsData?.length === 1) {
      setDeal(dealsData[0]);
    } else if (dealsData?.length && dealsData?.length > 1) {
      const selectedDeal = dealsData?.find(
        (deal) => deal._id.toString() === selectedDealIdFromRedux,
      );
      setDeal(selectedDeal ?? undefined);
    }
  }, [dealsData, selectedDealIdFromRedux]);

  const transactionsWithValidCheques = transactions?.filter((t) => {
    if (t.paymentMethod !== "چک") return true;

    const relatedCheque = allPersonCheques.find(
      (c) => c.relatedTransactionId?.toString() === t._id?.toString(),
    );
    // if (selectedVin) {
    //   return relatedCheque?.vin === selectedVin;
    // }
    return (
      relatedCheque?.status === "وصول شده" ||
      relatedCheque?.status === "خرج شده"
    );
  });

  //////////////////////////////////////////////

  const filteredTransactionsWithValidCheques = selectedVin
    ? transactionsWithValidCheques.filter((t) => t.vin === selectedVin)
    : transactionsWithValidCheques;

  // const displayedCheques = React.useMemo(() => {
  //   if (!selectedNationalId) return [];

  //   if (selectedDealId && cheques.length > 0) {
  //     const selectedDeal = selectedPersonDeals.find(
  //       (d) => d._id.toString() === selectedDealId,
  //     );
  //     if (!selectedDeal) return [];

  //     const sellerNationalIdStr =
  //       selectedDeal?.seller?.nationalId?.toString() || "";
  //     const buyerNationalIdStr =
  //       selectedDeal?.buyer?.nationalId?.toString() || "";
  //     const selectedNationalIdStr = selectedNationalId?.toString() || "";

  //     const isSeller = sellerNationalIdStr === selectedNationalIdStr;
  //     const isBuyer = buyerNationalIdStr === selectedNationalIdStr;

  //     return cheques.filter((c) => {
  //       if (isSeller) {
  //         return (
  //           c.type === "issued" ||
  //           c.type === "صادره" ||
  //           c.payee?.nationalId?.toString() === selectedNationalIdStr
  //         );
  //       }
  //       if (isBuyer) {
  //         return (
  //           c.type === "received" ||
  //           c.type === "وارده" ||
  //           c.payer?.nationalId?.toString() === selectedNationalIdStr
  //         );
  //       }
  //       return false;
  //     });
  //   }

  //   if (allPersonCheques.length > 0) {
  //     const selectedNationalIdStr = selectedNationalId?.toString() || "";
  //     return allPersonCheques.filter((c) => {
  //       return (
  //         c?.payer?.nationalId?.toString() === selectedNationalIdStr ||
  //         c?.payee?.nationalId?.toString() === selectedNationalIdStr
  //       );
  //     });
  //   }

  //   return [];
  // }, [
  //   selectedNationalId,
  //   selectedDealId,
  //   cheques,
  //   selectedPersonDeals,
  //   allPersonCheques,
  // ]);

  const filteredPeopleList = React.useMemo(() => {
    if (!searchValue) return peopleList;

    const lowerSearch = searchValue.toLowerCase().trim();

    return peopleList?.filter(
      (user) =>
        user?.fullName?.toLowerCase().includes(lowerSearch) ||
        user?.nationalId?.toString().includes(lowerSearch),
    );
  }, [searchValue, peopleList]);

  const totalBuyAmount = carBuyer.reduce(
    (sum, deal) => sum + (deal?.salePrice || 0),
    0,
  );

  const totalSellAmount = carSeller.reduce(
    (sum, deal) => sum + (deal?.purchasePrice || 0),
    0,
  );

  const diffBuySell = (totalSellAmount || 0) - (totalBuyAmount || 0);

  const selectedPersonDealIds = React.useMemo(() => {
    return selectedPersonDeals
      .map((deal) => deal?._id.toString())
      .sort()
      .join(",");
  }, [selectedPersonDeals]);

  // const displayedTransactions = React.useMemo(() => {
  //   if (!selectedNationalId) return [];

  //   if (selectedDealId && transactions?.length > 0) {
  //     const selectedDeal = selectedPersonDeals.find(
  //       (d) => d?._id.toString() === selectedDealId,
  //     );
  //     if (!selectedDeal) return [];

  //     const sellerNationalIdStr =
  //       selectedDeal?.seller?.nationalId?.toString() || "";
  //     const buyerNationalIdStr =
  //       selectedDeal?.buyer?.nationalId?.toString() || "";
  //     const selectedNationalIdStr = selectedNationalId?.toString() || "";

  //     const isSeller = sellerNationalIdStr === selectedNationalIdStr;
  //     const isBuyer = buyerNationalIdStr === selectedNationalIdStr;

  //     return transactions.filter((t) => {
  //       if (t?.reason?.includes("حقوق") || t?.reason?.includes("پرداخت حقوق")) {
  //         return false;
  //       }

  //       if (t.type === "پرداخت") {
  //         const reasonNormalized = t.reason?.replace(/\s/g, "") || "";
  //         const isVehicleRelated =
  //           t?.reason === "خرید خودرو" ||
  //           t?.reason?.includes("خريد") ||
  //           t?.reason?.includes("خرید") ||
  //           t?.reason === "درصد کارگزار" ||
  //           reasonNormalized.includes("هزینهوسیله") ||
  //           reasonNormalized.includes("هزينهوسیله");

  //         if (isSeller && isVehicleRelated) {
  //           return true;
  //         }
  //       }

  //       if (t.type === "دریافت") {
  //         if (isBuyer && t.reason === "فروش") {
  //           return true;
  //         }
  //       }

  //       return false;
  //     });
  //   } else if (allPersonTransactions.length > 0) {
  //     const allFilteredTransactions: ITransactionNew[] = [];

  //     selectedPersonDeals.forEach((deal) => {
  //       const dealTransactions = allPersonTransactions.filter(
  //         (t) => t?.dealId === deal?._id.toString(),
  //       );

  //       const vehicleRelatedTransactions = dealTransactions.filter((t) => {
  //         if (
  //           t?.reason?.includes("حقوق") ||
  //           t?.reason?.includes("پرداخت حقوق")
  //         ) {
  //           return false;
  //         }

  //         if (t.type === "پرداخت") {
  //           const reasonNormalized = t?.reason?.replace(/\s/g, "") || "";
  //           return (
  //             t?.reason === "خرید خودرو" ||
  //             t?.reason?.includes("خريد") ||
  //             t?.reason?.includes("خرید") ||
  //             t?.reason === "درصد کارگزار" ||
  //             reasonNormalized.includes("هزینهوسیله") ||
  //             reasonNormalized.includes("هزينهوسیله")
  //           );
  //         }

  //         if (t.type === "دریافت") {
  //           return t?.reason === "فروش";
  //         }

  //         return false;
  //       });

  //       const sellerNationalIdStr = deal?.seller?.nationalId?.toString() || "";
  //       const buyerNationalIdStr = deal?.buyer?.nationalId?.toString() || "";
  //       const selectedNationalIdStr = selectedNationalId?.toString() || "";

  //       const isSeller = sellerNationalIdStr === selectedNationalIdStr;
  //       const isBuyer = buyerNationalIdStr === selectedNationalIdStr;

  //       vehicleRelatedTransactions.forEach((t) => {
  //         if (isSeller && t?.type === "پرداخت") {
  //           if (
  //             t?.reason === "خرید خودرو" ||
  //             t?.reason?.includes("خريد") ||
  //             t?.reason?.includes("خرید")
  //           ) {
  //             allFilteredTransactions.push(t);
  //           }
  //         }

  //         if (isBuyer && t?.type === "دریافت" && t?.reason === "فروش") {
  //           allFilteredTransactions.push(t);
  //         }
  //       });
  //     });

  //     return allFilteredTransactions;
  //   }

  //   return [];
  // }, [
  //   selectedNationalId,
  //   selectedDealId,
  //   transactions,
  //   selectedPersonDeals,
  //   allPersonTransactions,
  // ]);

  const costumerRefreshHandler = () => {
    queryClient.invalidateQueries({
      queryKey: ["get-all-people"],
    });
  };

  const { totalReceived, totalPayment } = React.useMemo(() => {
    if (!selectedNationalId) {
      return { totalReceived: 0, totalPayment: 0 };
    }

    let received = 0;
    let payment = 0;

    filteredTransactionsWithValidCheques.forEach((t) => {
      // (transactions ?? [])?.forEach((t) => {
      if (t?.type === "دریافت" || t?.type === "received") {
        payment += t?.amount || 0;
      } else if (t?.type === "پرداخت" || t?.type === "issued") {
        received += t?.amount || 0;
      }
    });
    return { totalReceived: received, totalPayment: payment };
  }, [selectedNationalId, filteredTransactionsWithValidCheques]);

  // }, [selectedNationalId, displayedTransactions]);

  const diffPaymentReceived = (totalPayment || 0) - (totalReceived || 0);

  const customerStatusMap = React.useMemo(() => {
    const statusMap = new Map<string, { status: string; amount: number }>();

    peopleList?.forEach((person) => {
      const nationalId = person?.nationalId?.toString();
      if (!nationalId) return;

      const personDeals = allDeals.filter(
        (deal) =>
          deal?.buyer?.nationalId?.toString() === nationalId ||
          deal?.seller?.nationalId?.toString() === nationalId,
      );

      if (personDeals?.length === 0) {
        statusMap.set(nationalId, { status: "—", amount: 0 });
        return;
      }

      let totalPaidToSeller = 0;
      let totalPurchasePrice = 0;

      personDeals.forEach((deal) => {
        if (deal?.seller?.nationalId?.toString() === nationalId) {
          totalPurchasePrice += deal?.purchasePrice || 0;

          // const sellerPersonId = deal?.seller?.personId?.toString();
          const dealTransactions = allDealsTransactions?.filter(
            (t) => t?.dealId === deal?._id.toString(),
          );

          const paymentsToSeller = dealTransactions
            .filter(
              (t) =>
                t?.type === "پرداخت" &&
                (t?.reason === "خرید خودرو" ||
                  t?.reason?.includes("خريد") ||
                  t?.reason?.includes("خرید")),
            )
            .reduce((sum, t) => sum + (t?.amount || 0), 0);

          totalPaidToSeller += paymentsToSeller;
        }
      });

      let totalReceivedFromBuyer = 0;
      let totalSalePrice = 0;

      personDeals.forEach((deal) => {
        if (deal?.buyer?.nationalId?.toString() === nationalId) {
          totalSalePrice += deal?.salePrice || 0;

          // const buyerPersonId = deal?.buyer?.personId?.toString();
          const dealTransactions = allDealsTransactions?.filter(
            (t) => t?.dealId === deal?._id.toString(),
          );

          const receiptsFromBuyer = dealTransactions
            .filter((t) => t?.type === "دریافت" && t?.reason === "فروش")
            .reduce((sum, t) => sum + (t?.amount || 0), 0);

          totalReceivedFromBuyer += receiptsFromBuyer;
        }
      });

      const sellerDebt = totalPurchasePrice - totalPaidToSeller;
      const buyerDebt = totalSalePrice - totalReceivedFromBuyer;

      const walletBalance = buyerDebt - sellerDebt;

      const diff = Math.abs(walletBalance);
      if (diff < 0.01) {
        statusMap.set(nationalId, { status: "تسویه شده", amount: 0 });
      } else {
        statusMap.set(nationalId, {
          status: walletBalance > 0 ? "بدهکار" : "بستانکار",
          amount: Math.abs(walletBalance),
        });
      }
    });

    return statusMap;
  }, [peopleList, allDeals, allDealsTransactions]);

  // const customerStatus = React.useMemo(() => {
  //   if (!selectedNationalId) return null;
  //   return customerStatusMap.get(selectedNationalId) || null;
  // }, [selectedNationalId, customerStatusMap]);

  React.useEffect(() => {
    if (vehicleUpdated || optionUpdated || transactionCreated) {
      queryClient.invalidateQueries({ queryKey: ["get-all-deals"] });
      queryClient.invalidateQueries({ queryKey: ["get-all-transaction"] });
      queryClient.invalidateQueries({ queryKey: ["get-all-cheques"] });
      transactionsByPersonId(selectedPersonId ?? "");
      handleTransationDataByDealId(selectedDealId ?? "");
      handleChequeDataByDealId(selectedDealId ?? "");
      handleChequeDataByPersonlId(selectedPersonId ?? "");
    }
  }, [
    vehicleUpdated,
    optionUpdated,
    transactionCreated,
    selectedPersonId,
    selectedDealId,
    queryClient,
  ]);

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
          <p dir="ltr" className="text-yellow-900">
            {formatPrice(diffBuySell?.toLocaleString("en-US"))}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm">
            تفاضل مبالغ دریافتی و پرداختی(پرداخت - دریافت):
          </p>
          <p dir="ltr" className="text-yellow-900">
            {formatPrice(diffPaymentReceived?.toLocaleString("en-US"))}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-5 items-start mt-8">
        <div className="h-[33.7rem] max-h-[33.7rem] border border-gray-300 p-4 rounded-md relative w-full">
          <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
            لیست مشتریان
          </p>
          <div
            className="text-blue-500 absolute left-2 -top-5 bg-white py-2 px-4 cursor-pointer"
            onClick={costumerRefreshHandler}
          >
            <RefreshCcwIcon className="w-5 h-4" />
          </div>
          <div className="h-[31rem] max-h-[31rem] overflow-y-auto rounded-md border w-full">
            <Table className="min-w-full table-fixed text-right border-collapse">
              <TableHeader className="top-0 sticky">
                <TableRow className="bg-gray-100">
                  <TableHead className="w-[15%] text-center">ردیف</TableHead>
                  <TableHead className="w-[70%] text-center">
                    نام کامل
                  </TableHead>
                  <TableHead className="w-[80%] text-center">کدملی</TableHead>
                  <TableHead className="w-[100%] text-center">نقش</TableHead>
                  <TableHead className="w-[70%] text-center">وضعیت</TableHead>
                  <TableHead className="w-[90%] text-center">
                    تراز مالی
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {(filteredPeopleList ?? peopleList ?? [])?.map(
                  (person, index) => {
                    const customerStatus =
                      person.wallet.balance > 0
                        ? "بستانکار"
                        : person.wallet.balance < 0
                          ? "بدهکار"
                          : person.wallet.balance === 0
                            ? "تسویه"
                            : "-";

                    return (
                      <TableRow
                        key={`${person?._id}-${index}`}
                        onClick={() => {
                          setSelectedPersonId(person._id);
                          setSelectedNationalId(person.nationalId.toString());

                          transactionsByPersonId(person._id);
                          handleChequeDataByPersonlId(person._id);

                          setTransactions([]);
                          setSelectedDealId(null);
                          setSelectedChassisNo(null);
                          setSelectedVin(null);
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
                          {person.firstName} {person.lastName}
                        </TableCell>
                        <TableCell className="text-center">
                          {person.nationalId}
                        </TableCell>
                        <TableCell
                          title={getPersonRole(
                            person.nationalId?.toString() || "",
                          )}
                          className="text-center"
                        >
                          {getPersonRole(person.nationalId?.toString() || "")}
                        </TableCell>
                        <TableCell className="text-center">
                          {(() => {
                            const status = customerStatusMap.get(
                              person.nationalId?.toString() || "",
                            );

                            if (!status) return "—";
                            return (
                              <span
                                className={
                                  customerStatus === "تسویه"
                                    ? "text-blue-600"
                                    : customerStatus === "بدهکار"
                                      ? "text-red-600"
                                      : customerStatus === "بستانکار"
                                        ? "text-green-600"
                                        : "text-blue-600"
                                }
                              >
                                {customerStatus}
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
                          {/* {(() => {
                            const status = customerStatusMap.get(
                              person.nationalId?.toString() || "",
                            );

                            if (!status) return "—";
                            return status.amount > 0 ? (
                              <span className="text-xs mr-1">
                                {formatPrice(
                                  status.amount.toLocaleString("en-US"),
                                )}
                              </span>
                            ) : (
                              0
                            );
                          })()} */}
                          {formatPrice(
                            person.wallet.balance.toLocaleString("en-US"),
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  },
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
        {/* <div className="space-y-6">
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
                          setSelectedDealId(deal._id.toString());
                          handleChequeDataByDealId(deal._id.toString());
                          setSelectedVin(deal?.vehicleSnapshot.vin);
                        }}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          selectedDealId === deal._id.toString() &&
                          selectedChassisNo === deal.vehicleSnapshot?.vin
                            ? "bg-blue-100"
                            : ""
                        }`}
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
                          {formatPrice(
                            deal.purchasePrice?.toLocaleString("en-US"),
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  : null}
              </Table>
            </div>
            {totalSellAmount && Number(totalSellAmount) > 0 ? (
              <p dir="ltr" className="text-green-400 mt-3 flex justify-end">
                {formatPrice(totalSellAmount?.toLocaleString("en-US"))}
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
                          setSelectedDealId(deal._id.toString());
                          handleChequeDataByDealId(deal._id.toString());
                          setSelectedVin(deal?.vehicleSnapshot.vin);
                        }}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          selectedDealId === deal._id.toString() &&
                          selectedChassisNo === deal.vehicleSnapshot?.vin
                            ? "bg-blue-100"
                            : ""
                        }`}
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
                          {formatPrice(deal.salePrice?.toLocaleString("en-US"))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                ) : null}
              </Table>
            </div>
            {totalBuyAmount && Number(totalBuyAmount) > 0 ? (
              <p dir="ltr" className="text-yellow-600 mt-3 flex justify-end">
                {formatPrice(totalBuyAmount?.toLocaleString("en-US"))}
              </p>
            ) : null}
          </div>
        </div> */}
        <div className="space-y-6">
          <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
              فروشنده و خریدار خودرو
            </p>
            <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-[15%] text-center">ردیف</TableHead>
                    <TableHead className="w-[15%] text-center"></TableHead>
                    <TableHead className="w-[35%] text-center">شاسی</TableHead>
                    <TableHead className="w-[55%] text-center">مدل</TableHead>
                    <TableHead className="w-[35%] text-center">تاریخ</TableHead>
                    <TableHead className="w-[30%] text-center">قیمت</TableHead>
                  </TableRow>
                </TableHeader>

                {mergedDeals && mergedDeals.length > 0 ? (
                  <TableBody>
                    {mergedDeals.map((deal: IDealWithRole, index: number) => {
                      return (
                        <TableRow
                          key={`${deal?._id}-${index}`}
                          onClick={() => {
                            handleTransationDataByDealId(deal._id.toString());
                            setSelectedDealId(deal._id.toString());
                            handleChequeDataByDealId(deal._id.toString());
                            setSelectedVin(deal?.vehicleSnapshot.vin);
                          }}
                          className={`hover:bg-gray-50 cursor-pointer ${selectedDealId === deal._id.toString() &&
                              selectedChassisNo === deal.vehicleSnapshot?.vin
                              ? "bg-blue-100"
                              : ""
                            }`}
                        >
                          <TableCell className="text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-center">
                            {deal.roleType === "buyer" && (
                              <div className="w-3 h-3 rounded-full bg-green-500 mx-auto" />
                            )}

                            {deal.roleType === "seller" && (
                              <div className="w-3 h-3 rounded-full bg-red-500 mx-auto" />
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {deal.vehicleSnapshot?.vin}
                          </TableCell>
                          <TableCell className="text-center">
                            {deal.vehicleSnapshot?.model}
                          </TableCell>
                          <TableCell className="text-center">
                            {deal.roleType === "buyer" ? deal.saleDate : deal.roleType === "seller" ? deal.purchaseDate : ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {/* {formatPrice(
                              deal.salePrice?.toLocaleString("en-US") ||
                              deal.purchasePrice?.toLocaleString("en-US"),
                            )} */}
                            {deal.roleType === "buyer" ? formatPrice(deal.salePrice?.toLocaleString("en-US")) : deal.roleType === "seller" ? formatPrice(deal.purchasePrice?.toLocaleString("en-US")) : ""}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                ) : null}
              </Table>
            </div>
            <div className="flex justify-between items-center gap-2">
              {totalBuyAmount && Number(totalBuyAmount) > 0 ? (
                <div className="flex gap-3 items-baseline">
                  <p className="text-sm">خرید</p>
                  <p dir="ltr" className="text-green-400 mt-3 flex justify-end">
                    {formatPrice(totalBuyAmount?.toLocaleString("en-US"))}
                  </p>
                </div>
              ) : null}
              {totalSellAmount && Number(totalSellAmount) > 0 ? (
                <div className="flex gap-3 items-baseline">
                  <p className="text-sm">فروش</p>
                  <p dir="ltr" className="text-red-400 mt-3 flex justify-end">
                    {formatPrice(totalSellAmount?.toLocaleString("en-US"))}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
          <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
              لیست چک ها
            </p>
            <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-[30%] text-center">ردیف</TableHead>
                    <TableHead className="w-[70%] text-center">
                      سریال چک
                    </TableHead>
                    <TableHead className="w-[70%] text-center">
                      شناسه صیادی
                    </TableHead>
                    <TableHead className="w-[90%] text-center">مبلغ</TableHead>
                    <TableHead className="w-[60%] text-center">
                      تاریخ سررسید
                    </TableHead>
                    <TableHead className="w-[50%] text-center">
                      روش پرداخت
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {// (displayedCheques.length > 0
                    //   ? displayedCheques
                    //   : cheques
                    // )
                    cheques?.map((item, index) => (
                      <TableRow
                        key={`${item?._id}-${index}`}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell className="text-center">
                          {item?.chequeSerial ?? ""}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.sayadiID ?? ""}
                        </TableCell>
                        <TableCell className="text-center">
                          {formatPrice(item?.amount?.toLocaleString("en-US")) ??
                            ""}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.dueDate ?? "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.type === "issued" || item?.type === "صادره"
                            ? "صادره"
                            : item?.type === "received" || item?.type === "وارده"
                              ? "وارده"
                              : "-"}
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
        <div className="space-y-6">
          <div className="h-[33.7rem] max-h-[33.7rem] border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
              دریافت و پرداخت
            </p>
            <div className="h-[30rem] max-h-[30rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-[20%] text-center">ردیف</TableHead>
                    <TableHead className="w-[20%] text-center"></TableHead>
                    <TableHead className="w-[60%] text-center">تاریخ</TableHead>
                    <TableHead className="w-[60%] text-center">مبلغ</TableHead>
                    <TableHead className="w-[30%] text-center">
                      تراکنش
                    </TableHead>
                    <TableHead className="w-[60%] text-center">
                      روش پرداخت
                    </TableHead>
                    <TableHead className="w-[60%] text-center">
                      عملیات
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredTransactionsWithValidCheques &&
                    filteredTransactionsWithValidCheques.length > 0
                    ? filteredTransactionsWithValidCheques.map(
                      (item, index) => {
                        let customerReason;
                        let customerType;

                        // if (item.reason === "خرید خودرو") {
                        //   customerReason = "فروش خودرو";
                        // } else if (item.reason === "فروش خودرو") {
                        //   customerReason = "خرید خودرو";
                        // } else {
                        //   customerReason = item.reason;
                        // }

                        if (item.reason === "خرید خودرو") {
                          customerReason = "فروش";
                        } else if (item.reason === "فروش خودرو") {
                          customerReason = "خرید";
                        } else if (item.reason === "خرید خودروـ صراف") {
                          customerReason = "فروش";
                        } else if (item.reason === "فروش خودروـ صراف") {
                          customerReason = "خرید";
                        } else if (item.reason === "سایر هزینه‌ها") {
                          customerReason = "هزینه";
                        } else {
                          customerReason = item.reason;
                        }

                        if (item.type === "دریافت") {
                          customerType = "پرداخت";
                        } else if (item.type === "پرداخت") {
                          customerType = "دریافت";
                        } else {
                          customerType = item.type;
                        }

                        return (
                          <TableRow
                            key={`${item?._id}-${index}`}
                            className="hover:bg-gray-50 cursor-pointer"
                          >
                            <TableCell className="text-center">
                              {index + 1}
                            </TableCell>
                            <TableCell className="text-center">
                              {customerType === "دریافت" && (
                                <div className="w-3 h-3 rounded-full bg-blue-500 mx-auto" />
                              )}

                              {customerType === "پرداخت" && (
                                <div className="w-3 h-3 rounded-full bg-red-500 mx-auto" />
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {item.transactionDate}
                            </TableCell>
                            <TableCell className="text-center">
                              {formatPrice(
                                item?.amount?.toLocaleString("en-US"),
                              ) ?? ""}
                            </TableCell>
                            {/* <TableCell className="text-center">
                                {customerType} - {customerReason}
                              </TableCell> */}
                            <TableCell className="text-center">
                              {customerReason}
                            </TableCell>
                            <TableCell
                              title={item.paymentMethod}
                              className="text-center truncate"
                            >
                              {item.paymentMethod}
                            </TableCell>
                            <TableCell className="text-center flex gap-3 justify-center items-center">
                              <Pencil
                                className="w-4 h-4 cursor-pointer hover:text-indigo-500"
                                onClick={() => {
                                  setIsOpenEditModal(true);
                                  setTransactionId(item._id?.toString());
                                  setDealId(
                                    (item as ITransactionNew)?.dealId,
                                  );
                                }}
                              />
                              <Trash
                                className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-700"
                                onClick={() => {
                                  handleDeleteClick(
                                    item._id?.toString() || "",
                                  );
                                  setDealToDelete(
                                    item?.dealId?.toString() || "",
                                  );
                                  setPersonId(
                                    item.personId ||
                                    item.brokerPersonId ||
                                    item.partnerPersonId ||
                                    item.providerPersonId ||
                                    "",
                                  );
                                  setIsCustomerToCustomer(
                                    item.paymentMethod === "مشتری به مشتری"
                                      ? true
                                      : false,
                                  );
                                  setSecondDealToDelete(
                                    item.secondDealId ?? "",
                                  );
                                  setSecondPersonId(
                                    item.secondPersonId ?? "",
                                  );

                                  // setBrokerPersonId(item.brokerPersonId);
                                  setIsChequeTransaction(
                                    item.paymentMethod === "چک"
                                      ? true
                                      : false,
                                  );
                                  // setBrokerPersonId(item.brokerPersonId);
                                  setIsChequeTransaction(
                                    item.paymentMethod === "چک"
                                      ? true
                                      : false,
                                  );
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      },
                    )
                    : null}
                </TableBody>
              </Table>
            </div>
            {/* {displayedTransactions && displayedTransactions.length > 0 && ( */}
            {/* {transactions && transactions.length > 0 && ( */}
            {filteredTransactionsWithValidCheques &&
              filteredTransactionsWithValidCheques.length > 0 && (
                <div className="flex justify-between items-center gap-2">
                  <div className="flex gap-3 items-baseline">
                    <p className="text-sm">پرداخت</p>
                    <p dir="ltr" className="text-red-500 mt-3 flex justify-end">
                      {formatPrice(totalPayment?.toLocaleString("en-US"))}
                    </p>
                  </div>
                  <div className="flex gap-3 items-baseline">
                    <p className="text-sm">دریافت</p>
                    <p
                      dir="ltr"
                      className="text-blue-500 mt-3 flex justify-end"
                    >
                      {formatPrice(totalReceived?.toLocaleString("en-US"))}
                    </p>
                  </div>
                </div>
              )}
          </div>
          {/* <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
              لیست چک ها
            </p>
            <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-[30%] text-center">ردیف</TableHead>
                    <TableHead className="w-[70%] text-center">
                      سریال چک
                    </TableHead>
                    <TableHead className="w-[70%] text-center">
                      شناسه صیادی
                    </TableHead>
                    <TableHead className="w-[90%] text-center">مبلغ</TableHead>
                    <TableHead className="w-[60%] text-center">
                      تاریخ سررسید
                    </TableHead>
                    <TableHead className="w-[50%] text-center">
                      روش پرداخت
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {// (displayedCheques.length > 0
                  //   ? displayedCheques
                  //   : cheques
                  // )
                  cheques?.map((item, index) => (
                    <TableRow
                      key={`${item?._id}-${index}`}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center">
                        {item?.chequeSerial ?? ""}
                      </TableCell>
                      <TableCell className="text-center">
                        {item?.sayadiID ?? ""}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatPrice(item?.amount?.toLocaleString("en-US")) ??
                          ""}
                      </TableCell>
                      <TableCell className="text-center">
                        {item?.dueDate ?? "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {item?.type === "issued" || item?.type === "صادره"
                          ? "صادره"
                          : item?.type === "received" || item?.type === "وارده"
                            ? "وارده"
                            : "-"}
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
          </div> */}
        </div>
      </div>

      {isOpenEditModal && (
        <Dialog open={isOpenEditModal} onOpenChange={setIsOpenEditModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="mb-9">ویرایش تراکنش</DialogTitle>
              <DialogClose
                onClose={() => {
                  setIsOpenEditModal(false);
                  setTransactionId(undefined);
                }}
              />
            </DialogHeader>
            <TransactionForm
              mode="edit"
              transactionId={transactionId}
              onSuccess={handleEditSuccess}
              dealId={dealId}
            />
          </DialogContent>
        </Dialog>
      )}

      {isOpenDeleteModal && (
        <DeleteModal
          deletePending={deleteTransaction.isPending}
          handleConfirmDelete={handleConfirmDelete}
          isOpenDeleteModal={isOpenDeleteModal}
          setIdToDelete={setTransactionToDelete}
          setIsOpenDeleteModal={setIsOpenDeleteModal}
          title="تراکنش"
        />
      )}
    </>
  );
};

export default CustomersDashboard;
