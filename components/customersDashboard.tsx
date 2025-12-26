// // // "use client";
// // // import { useGetChequesByDealId } from "@/apis/mutations/cheques";
// // // import { useGetAllDeals } from "@/apis/mutations/deals";
// // // import { useGetTransactionsByDealId } from "@/apis/mutations/transaction";
// // // import {
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableHead,
// // //   TableHeader,
// // //   TableRow,
// // // } from "@/components/ui/table";
// // // import useGetAllPeople from "@/hooks/useGetAllPeople";
// // // import { IChequeNew, IDeal, ITransactionNew } from "@/types/new-backend-types";
// // // import React from "react";

// // // const CustomersDashboard = () => {
// // //   const [selectedNationalId, setSelectedNationalId] = React.useState<
// // //     string | null
// // //   >(null);
// // //   const [searchValue, setSearchValue] = React.useState<string>("");
// // //   const [allDeals, setAllDeals] = React.useState<IDeal[]>([]);
// // //   const [allPersonTransactions, setAllPersonTransactions] = React.useState<
// // //     ITransactionNew[]
// // //   >([]);
// // //   const [transactions, setTransactions] = React.useState<ITransactionNew[]>([]);
// // //   const [cheques, setCheques] = React.useState<IChequeNew[]>([]);

// // //   const getTransactionsByDealId = useGetTransactionsByDealId();
// // //   const getChequesByDealId = useGetChequesByDealId();
// // //   const { data: allPeople } = useGetAllPeople();
// // //   const getAllDeals = useGetAllDeals();

// // //   const peopleList = React.useMemo(() => {
// // //     if (!allPeople) return [];
// // //     return allPeople.filter((person) => person.roles?.includes("customer"));
// // //   }, [allPeople]);
// // //   // const peopleList = allPeople
// // //   //   ?.map((person) => (person.roles.includes("customer") ? person : null))
// // //   //   .filter((person) => person !== null);

// // //   // Calculate customer roles correctly
// // //   const customerRolesMap = React.useMemo(() => {
// // //     const rolesMap = new Map<string, Set<string>>();

// // //     peopleList?.forEach((person) => {
// // //       const nationalId = person.nationalId?.toString();
// // //       if (!nationalId) return;

// // //       const roles = new Set<string>();

// // //       allDeals?.forEach((deal) => {
// // //         if (deal.buyer.nationalId?.toString() === nationalId) {
// // //           roles.add("خریدار");
// // //         }
// // //         if (deal.seller.nationalId?.toString() === nationalId) {
// // //           roles.add("فروشنده");
// // //         }
// // //       });

// // //       if (roles.size > 0) {
// // //         rolesMap.set(nationalId, roles);
// // //       }
// // //     });

// // //     return rolesMap;
// // //   }, [allDeals, peopleList]);

// // //   // Get role display string for a person
// // //   const getPersonRole = (nationalId: string): string => {
// // //     const roles = customerRolesMap.get(nationalId);
// // //     if (!roles || roles.size === 0) return "—";

// // //     if (roles.has("خریدار") && roles.has("فروشنده")) {
// // //       return "خریدار / فروشنده";
// // //     }
// // //     return Array.from(roles).join(" / ");
// // //   };

// // //   const handleAllDeals = async () => {
// // //     try {
// // //       const res = await getAllDeals.mutateAsync();
// // //       setAllDeals(res);
// // //     } catch (error) {
// // //       console.log("🚀 ~ handleSelectChassis ~ error:", error);
// // //       setAllDeals([]);
// // //     }
// // //   };

// // //   const selectedPersonDeals = React.useMemo(() => {
// // //     if (!selectedNationalId || allDeals.length === 0) return [];
// // //     return allDeals.filter(
// // //       (deal) =>
// // //         deal.buyer.nationalId === selectedNationalId ||
// // //         deal.seller.nationalId === selectedNationalId
// // //     );
// // //   }, [allDeals, selectedNationalId]);

// // //   const carSeller = React.useMemo(() => {
// // //     return selectedPersonDeals.filter(
// // //       (deal) => deal.seller.nationalId === selectedNationalId
// // //     );
// // //   }, [selectedPersonDeals, selectedNationalId]);

// // //   const carBuyer = React.useMemo(() => {
// // //     return selectedPersonDeals.filter(
// // //       (deal) => deal.buyer.nationalId === selectedNationalId
// // //     );
// // //   }, [selectedPersonDeals, selectedNationalId]);

// // //   const handleTransationDataByDealId = async (dealId: string) => {
// // //     try {
// // //       const res = await getTransactionsByDealId.mutateAsync(dealId ?? "");
// // //       // Filter vehicle-related transactions only (similar to vehicle dashboard)
// // //       const filtered = res.filter((t) => {
// // //         // Exclude salary payments
// // //         if (t.reason?.includes("حقوق") || t.reason?.includes("پرداخت حقوق")) {
// // //           return false;
// // //         }

// // //         // For payments: only include خرید خودرو (or includes "خريد"/"خرید"), درصد کارگزار, هزینه وسیله
// // //         if (t.type === "پرداخت") {
// // //           const reasonNormalized = t.reason?.replace(/\s/g, "") || "";
// // //           return (
// // //             t.reason === "خرید خودرو" ||
// // //             t.reason?.includes("خريد") ||
// // //             t.reason?.includes("خرید") ||
// // //             t.reason === "درصد کارگزار" ||
// // //             reasonNormalized.includes("هزینهوسیله") ||
// // //             reasonNormalized.includes("هزينهوسیله")
// // //           );
// // //         }

// // //         // For receipts: only include فروش
// // //         if (t.type === "دریافت") {
// // //           return t.reason === "فروش";
// // //         }

// // //         return false;
// // //       });
// // //       setTransactions(filtered);
// // //     } catch (error) {
// // //       console.log("🚀 ~ handleTransationDataByDealId ~ error:", error);
// // //     }
// // //   };

// // //   const handleChequeDataByDealId = async (dealId: string) => {
// // //     try {
// // //       const res = await getChequesByDealId.mutateAsync(dealId);
// // //       setCheques(res);
// // //     } catch (error) {
// // //       console.log("🚀 ~ handleChequeDataByDealId ~ error:", error);
// // //     }
// // //   };

// // //   const filteredPeopleList = React.useMemo(() => {
// // //     if (!searchValue) return peopleList;

// // //     const lowerSearch = searchValue.toLowerCase().trim();

// // //     return peopleList?.filter(
// // //       (user) =>
// // //         user.fullName?.toLowerCase().includes(lowerSearch) ||
// // //         user.nationalId?.toString().includes(lowerSearch)
// // //     );
// // //   }, [searchValue, peopleList]);

// // //   // const personsRole = React.useMemo(() => {
// // //   //   return filteredPeopleList?.map((person) =>
// // //   //     person.wallet.transactions.map((transaction) =>
// // //   //       transaction.type === "commission"
// // //   //         ? "فروشنده"
// // //   //         : transaction.type === "deposit"
// // //   //         ? "خریدار"
// // //   //         : ["commission", "deposit"].includes(transaction.type)
// // //   //         ? "خریدار / فروشنده"
// // //   //         : "-"
// // //   //     )
// // //   //   );
// // //   // }, [peopleList]);

// // //   // const personsRole2 = filteredPeopleList?.map((person) =>
// // //   //   person.wallet.transactions.map((transaction) =>
// // //   //     transaction.type === "commission"
// // //   //       ? "فروشنده"
// // //   //       : transaction.type === "deposit"
// // //   //       ? "خریدار"
// // //   //       : ["commission", "deposit"].includes(transaction.type)
// // //   //       ? "خریدار / فروشنده"
// // //   //       : "-"
// // //   //   )
// // //   // );
// // //   // console.log("🚀 ~ CustomersDashboard ~ personsRole:", personsRole);
// // //   // console.log("🚀 ~ CustomersDashboard ~ personsRole2:", personsRole2);

// // //   const totalBuyAmount = carBuyer.reduce(
// // //     (sum, deal) => sum + (deal.purchasePrice || 0),
// // //     0
// // //   );

// // //   const totalSellAmount = carSeller.reduce(
// // //     (sum, deal) => sum + (deal.salePrice || 0),
// // //     0
// // //   );

// // //   const diffBuySell = (totalSellAmount || 0) - (totalBuyAmount || 0);

// // //   // const calculateCustomerStatus = (person: any) => {
// // //   //   if (selectedNationalId === person.nationalId.toString() && customerStatus) {
// // //   //     return customerStatus.status;
// // //   //   }
// // //   //   return "—";
// // //   // };

// // //   const selectedPersonDealIds = React.useMemo(() => {
// // //     return selectedPersonDeals
// // //       .map((deal) => deal._id.toString())
// // //       .sort()
// // //       .join(",");
// // //   }, [selectedPersonDeals]);

// // //   // Calculate total received and payment correctly
// // //   // Filter transactions similar to vehicle dashboard: only vehicle-related transactions
// // //   const { totalReceived, totalPayment } = React.useMemo(() => {
// // //     if (!selectedNationalId || allPersonTransactions.length === 0) {
// // //       return { totalReceived: 0, totalPayment: 0 };
// // //     }

// // //     let received = 0;
// // //     let payment = 0;

// // //     selectedPersonDeals.forEach((deal) => {
// // //       const dealTransactions = allPersonTransactions.filter(
// // //         (t) => t.dealId === deal._id.toString()
// // //       );

// // //       // Filter vehicle-related transactions only
// // //       const vehicleRelatedTransactions = dealTransactions.filter((t) => {
// // //         // Exclude salary payments
// // //         if (t.reason?.includes("حقوق") || t.reason?.includes("پرداخت حقوق")) {
// // //           return false;
// // //         }

// // //         // For payments: only include خرید خودرو (or includes "خريد"/"خرید"), درصد کارگزار, هزینه وسیله
// // //         if (t.type === "پرداخت") {
// // //           const reasonNormalized = t.reason?.replace(/\s/g, "") || "";
// // //           return (
// // //             t.reason === "خرید خودرو" ||
// // //             t.reason?.includes("خريد") ||
// // //             t.reason?.includes("خرید") ||
// // //             t.reason === "درصد کارگزار" ||
// // //             reasonNormalized.includes("هزینهوسیله") ||
// // //             reasonNormalized.includes("هزينهوسیله")
// // //           );
// // //         }

// // //         // For receipts: only include فروش
// // //         if (t.type === "دریافت") {
// // //           return t.reason === "فروش";
// // //         }

// // //         return false;
// // //       });

// // //       // Calculate as seller: payments TO seller (for purchase - خرید خودرو)
// // //       if (deal.seller.nationalId === selectedNationalId) {
// // //         const sellerPersonId = deal.seller.personId?.toString();
// // //         const paymentsToSeller = vehicleRelatedTransactions
// // //           .filter(
// // //             (t) =>
// // //               t.type === "پرداخت" &&
// // //               t.personId?.toString() === sellerPersonId &&
// // //               (t.reason === "خرید خودرو" ||
// // //                 t.reason?.includes("خريد") ||
// // //                 t.reason?.includes("خرید"))
// // //           )
// // //           .reduce((sum, t) => sum + (t.amount || 0), 0);
// // //         payment += paymentsToSeller;
// // //       }

// // //       // Calculate as buyer: receipts FROM buyer (for sale - فروش)
// // //       if (deal.buyer.nationalId === selectedNationalId) {
// // //         const buyerPersonId = deal.buyer.personId?.toString();
// // //         const receiptsFromBuyer = vehicleRelatedTransactions
// // //           .filter(
// // //             (t) =>
// // //               t.type === "دریافت" &&
// // //               t.personId?.toString() === buyerPersonId &&
// // //               t.reason === "فروش"
// // //           )
// // //           .reduce((sum, t) => sum + (t.amount || 0), 0);
// // //         received += receiptsFromBuyer;
// // //       }
// // //     });

// // //     return { totalReceived: received, totalPayment: payment };
// // //   }, [selectedNationalId, selectedPersonDealIds, allPersonTransactions]);

// // //   const diffPaymentReceived = (totalPayment || 0) - (totalReceived || 0);

// // //   // const uniqeUsersRole = (userRole: string[] | undefined) => {
// // //   //   if (!userRole || userRole.length === 0) {
// // //   //     return "—";
// // //   //   }

// // //   //   const roles = userRole.map((r) => r.toLowerCase());
// // //   //   const hasBuyer = roles.includes("buyer") || roles.includes("خریدار");
// // //   //   const hasSeller = roles.includes("seller") || roles.includes("فروشنده");
// // //   //   const hasBroker = roles.includes("broker") || roles.includes("کارگزار");
// // //   //   const hasCustomer = roles.includes("customer") || roles.includes("مشتری");

// // //   //   // Build role labels array
// // //   //   const roleLabels: string[] = [];

// // //   //   if (hasBuyer && hasSeller) {
// // //   //     roleLabels.push("خریدار / فروشنده");
// // //   //   } else {
// // //   //     if (hasBuyer) roleLabels.push("خریدار");
// // //   //     if (hasSeller) roleLabels.push("فروشنده");
// // //   //   }

// // //   //   if (hasBroker) roleLabels.push("کارگزار");
// // //   //   if (hasCustomer && !hasBuyer && !hasSeller) roleLabels.push("مشتری");

// // //   //   return roleLabels.length > 0 ? roleLabels.join(" / ") : "—";
// // //   // };

// // //   // Calculate customer status (wallet balance) for each person
// // //   const customerStatusMap = React.useMemo(() => {
// // //     const statusMap = new Map<string, { status: string; amount: number }>();

// // //     peopleList?.forEach((person) => {
// // //       const nationalId = person.nationalId?.toString();
// // //       if (!nationalId) return;

// // //       // Get all deals for this person
// // //       const personDeals = allDeals.filter(
// // //         (deal) =>
// // //           deal.buyer.nationalId?.toString() === nationalId ||
// // //           deal.seller.nationalId?.toString() === nationalId
// // //       );

// // //       if (personDeals.length === 0) {
// // //         statusMap.set(nationalId, { status: "—", amount: 0 });
// // //         return;
// // //       }

// // //       // Calculate as seller
// // //       let totalPaidToSeller = 0;
// // //       let totalPurchasePrice = 0;

// // //       personDeals.forEach((deal) => {
// // //         if (deal.seller.nationalId?.toString() === nationalId) {
// // //           totalPurchasePrice += deal.purchasePrice || 0;

// // //           const sellerPersonId = deal.seller.personId?.toString();
// // //           const dealTransactions = allPersonTransactions.filter(
// // //             (t) => t.dealId === deal._id.toString()
// // //           );

// // //           // Filter vehicle-related payments only (خرید خودرو)
// // //           const paymentsToSeller = dealTransactions
// // //             .filter(
// // //               (t) =>
// // //                 t.type === "پرداخت" &&
// // //                 t.personId?.toString() === sellerPersonId &&
// // //                 (t.reason === "خرید خودرو" ||
// // //                   t.reason?.includes("خريد") ||
// // //                   t.reason?.includes("خرید"))
// // //             )
// // //             .reduce((sum, t) => sum + (t.amount || 0), 0);

// // //           totalPaidToSeller += paymentsToSeller;
// // //         }
// // //       });

// // //       // Calculate as buyer
// // //       let totalReceivedFromBuyer = 0;
// // //       let totalSalePrice = 0;

// // //       personDeals.forEach((deal) => {
// // //         if (deal.buyer.nationalId?.toString() === nationalId) {
// // //           totalSalePrice += deal.salePrice || 0;

// // //           const buyerPersonId = deal.buyer.personId?.toString();
// // //           const dealTransactions = allPersonTransactions.filter(
// // //             (t) => t.dealId === deal._id.toString()
// // //           );

// // //           // Filter vehicle-related receipts only (فروش)
// // //           const receiptsFromBuyer = dealTransactions
// // //             .filter(
// // //               (t) =>
// // //                 t.type === "دریافت" &&
// // //                 t.personId?.toString() === buyerPersonId &&
// // //                 t.reason === "فروش"
// // //             )
// // //             .reduce((sum, t) => sum + (t.amount || 0), 0);

// // //           totalReceivedFromBuyer += receiptsFromBuyer;
// // //         }
// // //       });

// // //       const sellerDebt = totalPurchasePrice - totalPaidToSeller;
// // //       const buyerDebt = totalSalePrice - totalReceivedFromBuyer;

// // //       // Net wallet balance: positive = creditor (بستانکار), negative = debtor (بدهکار)
// // //       const walletBalance = buyerDebt - sellerDebt;

// // //       const diff = Math.abs(walletBalance);
// // //       if (diff < 0.01) {
// // //         statusMap.set(nationalId, { status: "تسویه شده", amount: 0 });
// // //       } else {
// // //         statusMap.set(nationalId, {
// // //           status: walletBalance > 0 ? "بستانکار" : "بدهکار",
// // //           amount: Math.abs(walletBalance),
// // //         });
// // //       }
// // //     });

// // //     return statusMap;
// // //   }, [peopleList, allDeals, allPersonTransactions]);

// // //   // Get customer status for selected person (for detailed view)
// // //   const customerStatus = React.useMemo(() => {
// // //     if (!selectedNationalId) return null;
// // //     return customerStatusMap.get(selectedNationalId) || null;
// // //   }, [selectedNationalId, customerStatusMap]);

// // //   const isFetchingRef = React.useRef(false);
// // //   const lastFetchedIdsRef = React.useRef<string>("");
// // //   const lastSelectedNationalIdRef = React.useRef<string | null>(null);

// // //   React.useEffect(() => {
// // //     if (selectedNationalId !== lastSelectedNationalIdRef.current) {
// // //       lastFetchedIdsRef.current = "";
// // //       lastSelectedNationalIdRef.current = selectedNationalId;
// // //     }
// // //   }, [selectedNationalId]);

// // //   React.useEffect(() => {
// // //     if (selectedPersonDealIds === lastFetchedIdsRef.current) {
// // //       return;
// // //     }

// // //     const fetchAllPersonTransactions = async () => {
// // //       if (!selectedNationalId || selectedPersonDeals.length === 0) {
// // //         setAllPersonTransactions([]);
// // //         lastFetchedIdsRef.current = "";
// // //         return;
// // //       }

// // //       if (isFetchingRef.current) return;
// // //       isFetchingRef.current = true;

// // //       try {
// // //         const transactionsPromises = selectedPersonDeals.map((deal) =>
// // //           getTransactionsByDealId.mutateAsync(deal._id.toString())
// // //         );
// // //         const transactionsArrays = await Promise.all(transactionsPromises);
// // //         const allTransactions = transactionsArrays.flat();
// // //         setAllPersonTransactions(allTransactions);
// // //         lastFetchedIdsRef.current = selectedPersonDealIds;
// // //       } catch (error) {
// // //         console.log("🚀 ~ fetchAllPersonTransactions ~ error:", error);
// // //         setAllPersonTransactions([]);
// // //         lastFetchedIdsRef.current = "";
// // //       } finally {
// // //         isFetchingRef.current = false;
// // //       }
// // //     };

// // //     fetchAllPersonTransactions();
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [selectedNationalId, selectedPersonDealIds]);

// // //   React.useEffect(() => {
// // //     handleAllDeals();
// // //   }, []);

// // //   return (
// // //     <>
// // //       <div className="grid grid-cols-3 gap-9 justify-between items-center mt-3">
// // //         <div className="flex justify-between items-center">
// // //           <p className="text-sm">
// // //             مورد جستجو میتواند بخشی از نام و یا کد ملی مشتری باشد.
// // //           </p>
// // //           <input
// // //             type="text"
// // //             placeholder="اینجا تایپ کنید..."
// // //             className="w-32 border border-gray-600 p-0 h-7 rounded-md pr-2 placeholder:text-sm"
// // //             value={searchValue}
// // //             onChange={(e) => setSearchValue(e.target.value)}
// // //           />
// // //         </div>
// // //         <div className="flex justify-between items-center">
// // //           <p className="text-sm">تفاضل مبالغ خرید و فروش مشتری(فروش - خرید):</p>
// // //           <p className="text-yellow-900">
// // //             {diffBuySell?.toLocaleString("en-US")}
// // //           </p>
// // //         </div>
// // //         <div className="flex justify-between items-center">
// // //           <p className="text-sm">
// // //             تفاضل مبالغ دریافتی و پرداختی(پرداخت - دریافت):
// // //           </p>
// // //           <p className="text-yellow-900">
// // //             {diffPaymentReceived?.toLocaleString("en-US")}
// // //           </p>
// // //         </div>
// // //       </div>
// // //       <div className="grid grid-cols-3 gap-5 items-start mt-8">
// // //         <div className="h-[33.7rem] max-h-[33.7rem] border border-gray-300 p-4 rounded-md relative w-full">
// // //           <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
// // //             لیست مشتریان
// // //           </p>
// // //           <div className="h-[25rem] max-h-[25rem] overflow-y-auto rounded-md border w-full">
// // //             <Table className="min-w-full table-fixed text-right border-collapse">
// // //               <TableHeader className="top-0 sticky">
// // //                 <TableRow className="bg-gray-100">
// // //                   <TableHead className="w-[15%] text-center">ردیف</TableHead>
// // //                   <TableHead className="w-[65%] text-center">
// // //                     نام کامل
// // //                   </TableHead>
// // //                   <TableHead className="w-[50%] text-center">کدملی</TableHead>
// // //                   <TableHead className="w-[40%] text-center">نقش</TableHead>
// // //                   <TableHead className="w-[60%] text-center">وضعیت</TableHead>
// // //                 </TableRow>
// // //               </TableHeader>

// // //               <TableBody>
// // //                 {(filteredPeopleList ?? peopleList ?? [])?.map(
// // //                   (person, index) => {
// // //                     return (
// // //                       <TableRow
// // //                         key={`${person?._id}-${index}`}
// // //                         onClick={() => {
// // //                           // handleAllDeals();
// // //                           setSelectedNationalId(person.nationalId.toString());
// // //                           setTransactions([]);
// // //                         }}
// // //                         className={`cursor-pointer ${
// // //                           selectedNationalId?.toString() ===
// // //                           person.nationalId.toString()
// // //                             ? "bg-gray-200"
// // //                             : "bg-white"
// // //                         }`}
// // //                       >
// // //                         <TableCell className="text-center">
// // //                           {index + 1}
// // //                         </TableCell>
// // //                         <TableCell className="text-center">
// // //                           {person.fullName}
// // //                         </TableCell>
// // //                         <TableCell className="text-center">
// // //                           {person.nationalId}
// // //                         </TableCell>
// // //                         <TableCell className="text-center">
// // //                           {getPersonRole(person.nationalId?.toString() || "")}
// // //                         </TableCell>
// // //                         <TableCell className="text-center">
// // //                           {(() => {
// // //                             const status = customerStatusMap.get(
// // //                               person.nationalId?.toString() || ""
// // //                             );
// // //                             if (!status) return "—";
// // //                             return (
// // //                               <span
// // //                                 className={
// // //                                   status.status === "بدهکار"
// // //                                     ? "text-red-600"
// // //                                     : status.status === "بستانکار"
// // //                                     ? "text-green-600"
// // //                                     : "text-blue-600"
// // //                                 }
// // //                               >
// // //                                 {status.status}
// // //                                 {/* {status.amount > 0 && (
// // //                                   <span className="text-xs mr-1">
// // //                                     {" "}
// // //                                     ({status.amount.toLocaleString("en-US")})
// // //                                   </span>
// // //                                 )} */}
// // //                               </span>
// // //                             );
// // //                           })()}
// // //                         </TableCell>
// // //                       </TableRow>
// // //                     );
// // //                   }
// // //                 )}
// // //               </TableBody>
// // //             </Table>
// // //           </div>
// // //           {/* {selectedNationalId && customerStatus && (
// // //             <div className="mt-4 p-4 border border-gray-300 rounded-md bg-gray-50">
// // //               <h3 className="text-sm font-bold mb-2 text-blue-900">
// // //                 وضعیت نهایی مشتری
// // //               </h3>
// // //               <div className="flex justify-between items-center">
// // //                 <span className="text-sm">وضعیت:</span>
// // //                 <span
// // //                   className={`text-sm font-bold ${
// // //                     customerStatus.status === "بدهکار"
// // //                       ? "text-red-600"
// // //                       : customerStatus.status === "بستانکار"
// // //                       ? "text-green-600"
// // //                       : "text-blue-600"
// // //                   }`}
// // //                 >
// // //                   {customerStatus.status}
// // //                 </span>
// // //                 <span className="text-sm">مبلغ:</span>
// // //                 <span className="text-sm font-bold">
// // //                   {customerStatus.amount.toLocaleString("en-US")}
// // //                 </span>
// // //               </div>
// // //             </div>
// // //           )} */}
// // //         </div>
// // //         <div className="space-y-6">
// // //           <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
// // //             <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
// // //               فروشنده خودرو
// // //             </p>
// // //             <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
// // //               <Table className="min-w-full table-fixed text-right border-collapse">
// // //                 <TableHeader className="top-0 sticky">
// // //                   <TableRow className="bg-gray-100">
// // //                     <TableHead className="w-[15%] text-center">ردیف</TableHead>
// // //                     <TableHead className="w-[35%] text-center">شاسی</TableHead>
// // //                     <TableHead className="w-[55%] text-center">مدل</TableHead>
// // //                     <TableHead className="w-[35%] text-center">تاریخ</TableHead>
// // //                     <TableHead className="w-[30%] text-center">قیمت</TableHead>
// // //                   </TableRow>
// // //                 </TableHeader>

// // //                 {carSeller && carSeller.length > 0
// // //                   ? carSeller.map((deal: IDeal, index: number) => (
// // //                       <TableRow
// // //                         key={`${deal?._id}-${index}`}
// // //                         onClick={() => {
// // //                           handleTransationDataByDealId(deal._id.toString());
// // //                           handleChequeDataByDealId(deal._id.toString());
// // //                         }}
// // //                         className="hover:bg-gray-50 cursor-pointer"
// // //                       >
// // //                         <TableCell className="text-center">
// // //                           {index + 1}
// // //                         </TableCell>
// // //                         <TableCell className="text-center">
// // //                           {deal.vehicleSnapshot?.vin}
// // //                         </TableCell>
// // //                         <TableCell className="text-center">
// // //                           {deal.vehicleSnapshot?.model}
// // //                         </TableCell>
// // //                         <TableCell className="text-center">
// // //                           {deal.saleDate}
// // //                         </TableCell>
// // //                         <TableCell className="text-center">
// // //                           {deal.salePrice?.toLocaleString("en-US")}
// // //                         </TableCell>
// // //                       </TableRow>
// // //                     ))
// // //                   : null}
// // //               </Table>
// // //             </div>
// // //             {totalSellAmount && Number(totalSellAmount) > 0 ? (
// // //               <p className="text-green-400 mt-3 flex justify-end">
// // //                 {totalSellAmount?.toLocaleString("en-US")}
// // //               </p>
// // //             ) : null}
// // //           </div>
// // //           <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
// // //             <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
// // //               خریدار خودرو
// // //             </p>
// // //             <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
// // //               <Table className="min-w-full table-fixed text-right border-collapse">
// // //                 <TableHeader className="top-0 sticky">
// // //                   <TableRow className="bg-gray-100">
// // //                     <TableHead className="w-[15%] text-center">ردیف</TableHead>
// // //                     <TableHead className="w-[35%] text-center">شاسی</TableHead>
// // //                     <TableHead className="w-[55%] text-center">مدل</TableHead>
// // //                     <TableHead className="w-[35%] text-center">تاریخ</TableHead>
// // //                     <TableHead className="w-[30%] text-center">قیمت</TableHead>
// // //                   </TableRow>
// // //                 </TableHeader>

// // //                 {carBuyer && carBuyer.length > 0 ? (
// // //                   <TableBody>
// // //                     {carBuyer.map((deal: IDeal, index: number) => (
// // //                       <TableRow
// // //                         key={`${deal?._id}-${index}`}
// // //                         onClick={() => {
// // //                           handleTransationDataByDealId(deal._id.toString());
// // //                           handleChequeDataByDealId(deal._id.toString());
// // //                         }}
// // //                         className="hover:bg-gray-50 cursor-pointer"
// // //                       >
// // //                         <TableCell className="text-center">
// // //                           {index + 1}
// // //                         </TableCell>
// // //                         <TableCell className="text-center">
// // //                           {deal.vehicleSnapshot?.vin}
// // //                         </TableCell>
// // //                         <TableCell className="text-center">
// // //                           {deal.vehicleSnapshot?.model}
// // //                         </TableCell>
// // //                         <TableCell className="text-center">
// // //                           {deal.purchaseDate}
// // //                         </TableCell>
// // //                         <TableCell className="text-center">
// // //                           {deal.purchasePrice?.toLocaleString("en-US")}
// // //                         </TableCell>
// // //                       </TableRow>
// // //                     ))}
// // //                   </TableBody>
// // //                 ) : null}
// // //               </Table>
// // //             </div>
// // //             {totalBuyAmount && Number(totalBuyAmount) > 0 ? (
// // //               <p className="text-yellow-600 mt-3 flex justify-end">
// // //                 {totalBuyAmount?.toLocaleString("en-US")}
// // //               </p>
// // //             ) : null}
// // //           </div>
// // //         </div>
// // //         <div className="space-y-6">
// // //           <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
// // //             <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
// // //               دریافت و پرداخت
// // //             </p>
// // //             <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
// // //               <Table className="min-w-full table-fixed text-right border-collapse">
// // //                 <TableHeader className="top-0 sticky">
// // //                   <TableRow className="bg-gray-100">
// // //                     <TableHead className="w-12 text-center">ردیف</TableHead>
// // //                     <TableHead className="w-12 text-center">تاریخ</TableHead>
// // //                     <TableHead className="w-12 text-center">مبلغ</TableHead>
// // //                     <TableHead className="w-12 text-center">تراکنش</TableHead>
// // //                   </TableRow>
// // //                 </TableHeader>

// // //                 <TableBody>
// // //                   {transactions && transactions.length > 0
// // //                     ? transactions.map((item, index) => (
// // //                         <TableRow
// // //                           key={`${item?._id}-${index}`}
// // //                           className="hover:bg-gray-50 cursor-pointer"
// // //                         >
// // //                           <TableCell className="text-center">
// // //                             {index + 1}
// // //                           </TableCell>
// // //                           <TableCell className="text-center">
// // //                             {item.transactionDate}
// // //                           </TableCell>
// // //                           <TableCell className="text-center">
// // //                             {item?.amount?.toLocaleString("en-US") ?? ""}
// // //                           </TableCell>
// // //                           <TableCell className="text-center">
// // //                             {item.type} - {item.reason}
// // //                           </TableCell>
// // //                         </TableRow>
// // //                       ))
// // //                     : null}
// // //                 </TableBody>
// // //               </Table>
// // //             </div>
// // //             {transactions && transactions.length > 0 && (
// // //               <div className="flex justify-between items-center gap-2">
// // //                 <div className="flex gap-3 items-baseline">
// // //                   <p className="text-sm">پرداخت</p>
// // //                   <p className="text-red-500 mt-3 flex justify-end">
// // //                     {totalPayment?.toLocaleString("en-US")}
// // //                   </p>
// // //                 </div>
// // //                 <div className="flex gap-3 items-baseline">
// // //                   <p className="text-sm">دریافت</p>
// // //                   <p className="text-blue-500 mt-3 flex justify-end">
// // //                     {totalReceived?.toLocaleString("en-US")}
// // //                   </p>
// // //                 </div>
// // //               </div>
// // //             )}
// // //           </div>
// // //           <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
// // //             <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
// // //               لیست چک ها
// // //             </p>
// // //             <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
// // //               <Table className="min-w-full table-fixed text-right border-collapse">
// // //                 <TableHeader className="top-0 sticky">
// // //                   <TableRow className="bg-gray-100">
// // //                     <TableHead className="w-12 text-center">ردیف</TableHead>
// // //                     <TableHead className="w-12 text-center">سریال چک</TableHead>
// // //                     <TableHead className="w-12 text-center">
// // //                       شناسه صیادی
// // //                     </TableHead>
// // //                     <TableHead className="w-12 text-center">مبلغ</TableHead>
// // //                     <TableHead className="w-12 text-center">
// // //                       تاریخ سررسید
// // //                     </TableHead>
// // //                   </TableRow>
// // //                 </TableHeader>

// // //                 <TableBody>
// // //                   {cheques?.map((item, index) => (
// // //                     <TableRow
// // //                       key={`${item?._id}-${index}`}
// // //                       className="hover:bg-gray-50 cursor-pointer"
// // //                     >
// // //                       <TableCell className="text-center">{index + 1}</TableCell>
// // //                       <TableCell className="text-center">
// // //                         {item?.chequeNumber ?? ""}
// // //                       </TableCell>
// // //                       <TableCell className="text-center">
// // //                         {item?.sayadiID ?? ""}
// // //                       </TableCell>
// // //                       <TableCell className="text-center">
// // //                         {item?.amount?.toLocaleString("en-US") ?? ""}
// // //                       </TableCell>
// // //                       <TableCell className="text-center">
// // //                         {item?.dueDate ?? ""}
// // //                       </TableCell>
// // //                     </TableRow>
// // //                   ))}
// // //                   {[].length > 0
// // //                     ? []?.map((item, index) => (
// // //                         <TableRow
// // //                           key={`${item}-${index}`}
// // //                           className="has-data-[state=checked]:bg-muted/50"
// // //                         >
// // //                           <TableCell className="text-center">
// // //                             {index + 1}
// // //                           </TableCell>
// // //                           <TableCell className="text-center">{item}</TableCell>
// // //                           <TableCell className="text-center">
// // //                             {item ?? ""}
// // //                           </TableCell>
// // //                           <TableCell className="text-center">{item}</TableCell>
// // //                           <TableCell className="text-center">{item}</TableCell>
// // //                           <TableCell className="text-center">{item}</TableCell>
// // //                           <TableCell className="text-center">{item}</TableCell>
// // //                           <TableCell className="text-center">{item}</TableCell>
// // //                         </TableRow>
// // //                       ))
// // //                     : null}
// // //                 </TableBody>
// // //               </Table>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </>
// // //   );
// // // };

// // // export default CustomersDashboard;

// // "use client";
// // import { useGetChequesByDealId } from "@/apis/mutations/cheques";
// // import { useGetAllDeals } from "@/apis/mutations/deals";
// // import { useGetTransactionsByDealId } from "@/apis/mutations/transaction";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import useGetAllPeople from "@/hooks/useGetAllPeople";
// // import { IChequeNew, IDeal, ITransactionNew } from "@/types/new-backend-types";
// // import React from "react";

// // const CustomersDashboard = () => {
// //   const [selectedNationalId, setSelectedNationalId] = React.useState<
// //     string | null
// //   >(null);
// //   const [searchValue, setSearchValue] = React.useState<string>("");
// //   const [allDeals, setAllDeals] = React.useState<IDeal[]>([]);
// //   const [allPersonTransactions, setAllPersonTransactions] = React.useState<
// //     ITransactionNew[]
// //   >([]);
// //   const [transactions, setTransactions] = React.useState<ITransactionNew[]>([]);
// //   const [cheques, setCheques] = React.useState<IChequeNew[]>([]);
// //   const [selectedDealId, setSelectedDealId] = React.useState<string | null>(
// //     null
// //   );

// //   const getTransactionsByDealId = useGetTransactionsByDealId();
// //   const getChequesByDealId = useGetChequesByDealId();
// //   const { data: allPeople } = useGetAllPeople();
// //   const getAllDeals = useGetAllDeals();

// //   const peopleList = React.useMemo(() => {
// //     if (!allPeople) return [];
// //     return allPeople.filter((person) => person.roles?.includes("customer"));
// //   }, [allPeople]);
// //   // const peopleList = allPeople
// //   //   ?.map((person) => (person.roles.includes("customer") ? person : null))
// //   //   .filter((person) => person !== null);

// //   // Calculate customer roles correctly
// //   const customerRolesMap = React.useMemo(() => {
// //     const rolesMap = new Map<string, Set<string>>();

// //     peopleList?.forEach((person) => {
// //       const nationalId = person.nationalId?.toString();
// //       if (!nationalId) return;

// //       const roles = new Set<string>();

// //       allDeals?.forEach((deal) => {
// //         if (deal.buyer.nationalId?.toString() === nationalId) {
// //           roles.add("خریدار");
// //         }
// //         if (deal.seller.nationalId?.toString() === nationalId) {
// //           roles.add("فروشنده");
// //         }
// //       });

// //       if (roles.size > 0) {
// //         rolesMap.set(nationalId, roles);
// //       }
// //     });

// //     return rolesMap;
// //   }, [allDeals, peopleList]);

// //   // Get role display string for a person
// //   const getPersonRole = (nationalId: string): string => {
// //     const roles = customerRolesMap.get(nationalId);
// //     if (!roles || roles.size === 0) return "—";

// //     if (roles.has("خریدار") && roles.has("فروشنده")) {
// //       return "خریدار / فروشنده";
// //     }
// //     return Array.from(roles).join(" / ");
// //   };

// //   const handleAllDeals = async () => {
// //     try {
// //       const res = await getAllDeals.mutateAsync();
// //       setAllDeals(res);
// //     } catch (error) {
// //       console.log("🚀 ~ handleSelectChassis ~ error:", error);
// //       setAllDeals([]);
// //     }
// //   };

// //   const selectedPersonDeals = React.useMemo(() => {
// //     if (!selectedNationalId || allDeals.length === 0) return [];
// //     return allDeals.filter(
// //       (deal) =>
// //         deal.buyer.nationalId === selectedNationalId ||
// //         deal.seller.nationalId === selectedNationalId
// //     );
// //   }, [allDeals, selectedNationalId]);

// //   const carSeller = React.useMemo(() => {
// //     return selectedPersonDeals.filter(
// //       (deal) => deal.seller.nationalId === selectedNationalId
// //     );
// //   }, [selectedPersonDeals, selectedNationalId]);

// //   const carBuyer = React.useMemo(() => {
// //     return selectedPersonDeals.filter(
// //       (deal) => deal.buyer.nationalId === selectedNationalId
// //     );
// //   }, [selectedPersonDeals, selectedNationalId]);

// //   const handleTransationDataByDealId = async (dealId: string) => {
// //     try {
// //       setSelectedDealId(dealId);
// //       const res = await getTransactionsByDealId.mutateAsync(dealId ?? "");
// //       // Filter vehicle-related transactions only (similar to vehicle dashboard)
// //       const filtered = res.filter((t) => {
// //         // Exclude salary payments
// //         if (t.reason?.includes("حقوق") || t.reason?.includes("پرداخت حقوق")) {
// //           return false;
// //         }

// //         // For payments: only include خرید خودرو (or includes "خريد"/"خرید"), درصد کارگزار, هزینه وسیله
// //         if (t.type === "پرداخت") {
// //           const reasonNormalized = t.reason?.replace(/\s/g, "") || "";
// //           return (
// //             t.reason === "خرید خودرو" ||
// //             t.reason?.includes("خريد") ||
// //             t.reason?.includes("خرید") ||
// //             t.reason === "درصد کارگزار" ||
// //             reasonNormalized.includes("هزینهوسیله") ||
// //             reasonNormalized.includes("هزينهوسیله")
// //           );
// //         }

// //         // For receipts: only include فروش
// //         if (t.type === "دریافت") {
// //           return t.reason === "فروش";
// //         }

// //         return false;
// //       });
// //       setTransactions(filtered);
// //     } catch (error) {
// //       console.log("🚀 ~ handleTransationDataByDealId ~ error:", error);
// //     }
// //   };

// //   const handleChequeDataByDealId = async (dealId: string) => {
// //     try {
// //       const res = await getChequesByDealId.mutateAsync(dealId);
// //       setCheques(res);
// //     } catch (error) {
// //       console.log("🚀 ~ handleChequeDataByDealId ~ error:", error);
// //     }
// //   };

// //   const filteredPeopleList = React.useMemo(() => {
// //     if (!searchValue) return peopleList;

// //     const lowerSearch = searchValue.toLowerCase().trim();

// //     return peopleList?.filter(
// //       (user) =>
// //         user.fullName?.toLowerCase().includes(lowerSearch) ||
// //         user.nationalId?.toString().includes(lowerSearch)
// //     );
// //   }, [searchValue, peopleList]);

// //   // const personsRole = React.useMemo(() => {
// //   //   return filteredPeopleList?.map((person) =>
// //   //     person.wallet.transactions.map((transaction) =>
// //   //       transaction.type === "commission"
// //   //         ? "فروشنده"
// //   //         : transaction.type === "deposit"
// //   //         ? "خریدار"
// //   //         : ["commission", "deposit"].includes(transaction.type)
// //   //         ? "خریدار / فروشنده"
// //   //         : "-"
// //   //     )
// //   //   );
// //   // }, [peopleList]);

// //   // const personsRole2 = filteredPeopleList?.map((person) =>
// //   //   person.wallet.transactions.map((transaction) =>
// //   //     transaction.type === "commission"
// //   //       ? "فروشنده"
// //   //       : transaction.type === "deposit"
// //   //       ? "خریدار"
// //   //       : ["commission", "deposit"].includes(transaction.type)
// //   //       ? "خریدار / فروشنده"
// //   //       : "-"
// //   //   )
// //   // );
// //   // console.log("🚀 ~ CustomersDashboard ~ personsRole:", personsRole);
// //   // console.log("🚀 ~ CustomersDashboard ~ personsRole2:", personsRole2);

// //   const totalBuyAmount = carBuyer.reduce(
// //     (sum, deal) => sum + (deal.purchasePrice || 0),
// //     0
// //   );

// //   const totalSellAmount = carSeller.reduce(
// //     (sum, deal) => sum + (deal.salePrice || 0),
// //     0
// //   );

// //   const diffBuySell = (totalSellAmount || 0) - (totalBuyAmount || 0);

// //   // const calculateCustomerStatus = (person: any) => {
// //   //   if (selectedNationalId === person.nationalId.toString() && customerStatus) {
// //   //     return customerStatus.status;
// //   //   }
// //   //   return "—";
// //   // };

// //   const selectedPersonDealIds = React.useMemo(() => {
// //     return selectedPersonDeals
// //       .map((deal) => deal._id.toString())
// //       .sort()
// //       .join(",");
// //   }, [selectedPersonDeals]);

// //   // Calculate total received and payment correctly
// //   // When a deal is selected and transactions are displayed, calculate from those transactions
// //   // Otherwise, calculate from all person transactions
// //   const { totalReceived, totalPayment } = React.useMemo(() => {
// //     if (!selectedNationalId) {
// //       return { totalReceived: 0, totalPayment: 0 };
// //     }
// //     // if (totalPayment) {
// //     //   console.log(totalPayment, "tooooooooo");
// //     // }

// //     let received = 0;
// //     let payment = 0;

// //     // If transactions are displayed (specific deal selected), calculate from those
// //     if (transactions.length > 0 && selectedDealId) {
// //       const selectedDeal = selectedPersonDeals.find(
// //         (d) => d._id.toString() === selectedDealId
// //       );

// //       if (selectedDeal) {
// //         const isSeller = selectedDeal.seller.nationalId === selectedNationalId;
// //         const isBuyer = selectedDeal.buyer.nationalId === selectedNationalId;

// //         transactions.forEach((t) => {
// //           if (isSeller && t.type === "پرداخت") {
// //             // If person is seller, count payments with reason "خرید خودرو" (we pay them)
// //             if (
// //               t.reason === "خرید خودرو" ||
// //               t.reason?.includes("خريد") ||
// //               t.reason?.includes("خرید")
// //             ) {
// //               payment += t.amount || 0;
// //             }
// //           } else if (isBuyer && t.type === "دریافت") {
// //             // If person is buyer, count receipts with reason "فروش" (we receive from them)
// //             if (t.reason === "فروش") {
// //               received += t.amount || 0;
// //             }
// //           }
// //         });
// //       }
// //     } else if (allPersonTransactions.length > 0) {
// //       // Calculate from all person transactions across all deals
// //       selectedPersonDeals.forEach((deal) => {
// //         const dealTransactions = allPersonTransactions.filter(
// //           (t) => t.dealId === deal._id.toString()
// //         );

// //         // Filter vehicle-related transactions only
// //         const vehicleRelatedTransactions = dealTransactions.filter((t) => {
// //           // Exclude salary payments
// //           if (t.reason?.includes("حقوق") || t.reason?.includes("پرداخت حقوق")) {
// //             return false;
// //           }

// //           // For payments: only include خرید خودرو (or includes "خريد"/"خرید"), درصد کارگزار, هزینه وسیله
// //           if (t.type === "پرداخت") {
// //             const reasonNormalized = t.reason?.replace(/\s/g, "") || "";
// //             return (
// //               t.reason === "خرید خودرو" ||
// //               t.reason?.includes("خريد") ||
// //               t.reason?.includes("خرید") ||
// //               t.reason === "درصد کارگزار" ||
// //               reasonNormalized.includes("هزینهوسیله") ||
// //               reasonNormalized.includes("هزينهوسیله")
// //             );
// //           }

// //           // For receipts: only include فروش
// //           if (t.type === "دریافت") {
// //             return t.reason === "فروش";
// //           }

// //           return false;
// //         });

// //         // Calculate as seller: payments TO seller (for purchase - خرید خودرو)
// //         if (deal.seller.nationalId === selectedNationalId) {
// //           const paymentsToSeller = vehicleRelatedTransactions
// //             .filter(
// //               (t) =>
// //                 t.type === "پرداخت" &&
// //                 (t.reason === "خرید خودرو" ||
// //                   t.reason?.includes("خريد") ||
// //                   t.reason?.includes("خرید"))
// //             )
// //             .reduce((sum, t) => sum + (t.amount || 0), 0);
// //           payment += paymentsToSeller;
// //         }

// //         // Calculate as buyer: receipts FROM buyer (for sale - فروش)
// //         if (deal.buyer.nationalId === selectedNationalId) {
// //           const receiptsFromBuyer = vehicleRelatedTransactions
// //             .filter((t) => t.type === "دریافت" && t.reason === "فروش")
// //             .reduce((sum, t) => sum + (t.amount || 0), 0);
// //           received += receiptsFromBuyer;
// //         }
// //       });
// //     }

// //     return { totalReceived: received, totalPayment: payment };
// //   }, [
// //     selectedNationalId,
// //     selectedPersonDealIds,
// //     allPersonTransactions,
// //     transactions,
// //     selectedDealId,
// //     selectedPersonDeals,
// //   ]);
// //   console.log("🚀 ~ CustomersDashboard ~ totalPayment:", totalPayment);
// //   console.log("🚀 ~ CustomersDashboard ~ totalPayment:", totalPayment);
// //   console.log("🚀 ~ CustomersDashboard ~ totalPayment:", totalPayment);
// //   console.log("🚀 ~ CustomersDashboard ~ totalPayment:", totalPayment);

// //   const diffPaymentReceived = (totalPayment || 0) - (totalReceived || 0);

// //   // const uniqeUsersRole = (userRole: string[] | undefined) => {
// //   //   if (!userRole || userRole.length === 0) {
// //   //     return "—";
// //   //   }

// //   //   const roles = userRole.map((r) => r.toLowerCase());
// //   //   const hasBuyer = roles.includes("buyer") || roles.includes("خریدار");
// //   //   const hasSeller = roles.includes("seller") || roles.includes("فروشنده");
// //   //   const hasBroker = roles.includes("broker") || roles.includes("کارگزار");
// //   //   const hasCustomer = roles.includes("customer") || roles.includes("مشتری");

// //   //   // Build role labels array
// //   //   const roleLabels: string[] = [];

// //   //   if (hasBuyer && hasSeller) {
// //   //     roleLabels.push("خریدار / فروشنده");
// //   //   } else {
// //   //     if (hasBuyer) roleLabels.push("خریدار");
// //   //     if (hasSeller) roleLabels.push("فروشنده");
// //   //   }

// //   //   if (hasBroker) roleLabels.push("کارگزار");
// //   //   if (hasCustomer && !hasBuyer && !hasSeller) roleLabels.push("مشتری");

// //   //   return roleLabels.length > 0 ? roleLabels.join(" / ") : "—";
// //   // };

// //   // Calculate customer status (wallet balance) for each person
// //   const customerStatusMap = React.useMemo(() => {
// //     const statusMap = new Map<string, { status: string; amount: number }>();

// //     peopleList?.forEach((person) => {
// //       const nationalId = person.nationalId?.toString();
// //       if (!nationalId) return;

// //       // Get all deals for this person
// //       const personDeals = allDeals.filter(
// //         (deal) =>
// //           deal.buyer.nationalId?.toString() === nationalId ||
// //           deal.seller.nationalId?.toString() === nationalId
// //       );

// //       if (personDeals.length === 0) {
// //         statusMap.set(nationalId, { status: "—", amount: 0 });
// //         return;
// //       }

// //       // Calculate as seller
// //       let totalPaidToSeller = 0;
// //       let totalPurchasePrice = 0;

// //       personDeals.forEach((deal) => {
// //         if (deal.seller.nationalId?.toString() === nationalId) {
// //           totalPurchasePrice += deal.purchasePrice || 0;

// //           const sellerPersonId = deal.seller.personId?.toString();
// //           const dealTransactions = allPersonTransactions.filter(
// //             (t) => t.dealId === deal._id.toString()
// //           );

// //           // Filter vehicle-related payments only (خرید خودرو)
// //           const paymentsToSeller = dealTransactions
// //             .filter(
// //               (t) =>
// //                 t.type === "پرداخت" &&
// //                 t.personId?.toString() === sellerPersonId &&
// //                 (t.reason === "خرید خودرو" ||
// //                   t.reason?.includes("خريد") ||
// //                   t.reason?.includes("خرید"))
// //             )
// //             .reduce((sum, t) => sum + (t.amount || 0), 0);

// //           totalPaidToSeller += paymentsToSeller;
// //         }
// //       });

// //       // Calculate as buyer
// //       let totalReceivedFromBuyer = 0;
// //       let totalSalePrice = 0;

// //       personDeals.forEach((deal) => {
// //         if (deal.buyer.nationalId?.toString() === nationalId) {
// //           totalSalePrice += deal.salePrice || 0;

// //           const buyerPersonId = deal.buyer.personId?.toString();
// //           const dealTransactions = allPersonTransactions.filter(
// //             (t) => t.dealId === deal._id.toString()
// //           );

// //           // Filter vehicle-related receipts only (فروش)
// //           const receiptsFromBuyer = dealTransactions
// //             .filter(
// //               (t) =>
// //                 t.type === "دریافت" &&
// //                 t.personId?.toString() === buyerPersonId &&
// //                 t.reason === "فروش"
// //             )
// //             .reduce((sum, t) => sum + (t.amount || 0), 0);

// //           totalReceivedFromBuyer += receiptsFromBuyer;
// //         }
// //       });

// //       const sellerDebt = totalPurchasePrice - totalPaidToSeller;
// //       const buyerDebt = totalSalePrice - totalReceivedFromBuyer;

// //       // Net wallet balance: positive = creditor (بستانکار), negative = debtor (بدهکار)
// //       const walletBalance = buyerDebt - sellerDebt;

// //       const diff = Math.abs(walletBalance);
// //       if (diff < 0.01) {
// //         statusMap.set(nationalId, { status: "تسویه شده", amount: 0 });
// //       } else {
// //         statusMap.set(nationalId, {
// //           status: walletBalance > 0 ? "بستانکار" : "بدهکار",
// //           amount: Math.abs(walletBalance),
// //         });
// //       }
// //     });

// //     return statusMap;
// //   }, [peopleList, allDeals, allPersonTransactions]);

// //   // Get customer status for selected person (for detailed view)
// //   const customerStatus = React.useMemo(() => {
// //     if (!selectedNationalId) return null;
// //     return customerStatusMap.get(selectedNationalId) || null;
// //   }, [selectedNationalId, customerStatusMap]);

// //   const isFetchingRef = React.useRef(false);
// //   const lastFetchedIdsRef = React.useRef<string>("");
// //   const lastSelectedNationalIdRef = React.useRef<string | null>(null);

// //   React.useEffect(() => {
// //     if (selectedNationalId !== lastSelectedNationalIdRef.current) {
// //       lastFetchedIdsRef.current = "";
// //       lastSelectedNationalIdRef.current = selectedNationalId;
// //     }
// //   }, [selectedNationalId]);

// //   React.useEffect(() => {
// //     if (selectedPersonDealIds === lastFetchedIdsRef.current) {
// //       return;
// //     }

// //     const fetchAllPersonTransactions = async () => {
// //       if (!selectedNationalId || selectedPersonDeals.length === 0) {
// //         setAllPersonTransactions([]);
// //         lastFetchedIdsRef.current = "";
// //         return;
// //       }

// //       if (isFetchingRef.current) return;
// //       isFetchingRef.current = true;

// //       try {
// //         const transactionsPromises = selectedPersonDeals.map((deal) =>
// //           getTransactionsByDealId.mutateAsync(deal._id.toString())
// //         );
// //         const transactionsArrays = await Promise.all(transactionsPromises);
// //         const allTransactions = transactionsArrays.flat();
// //         setAllPersonTransactions(allTransactions);
// //         lastFetchedIdsRef.current = selectedPersonDealIds;
// //       } catch (error) {
// //         console.log("🚀 ~ fetchAllPersonTransactions ~ error:", error);
// //         setAllPersonTransactions([]);
// //         lastFetchedIdsRef.current = "";
// //       } finally {
// //         isFetchingRef.current = false;
// //       }
// //     };

// //     fetchAllPersonTransactions();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [selectedNationalId, selectedPersonDealIds]);

// //   React.useEffect(() => {
// //     handleAllDeals();
// //   }, []);

// //   return (
// //     <>
// //       <div className="grid grid-cols-3 gap-9 justify-between items-center mt-3">
// //         <div className="flex justify-between items-center">
// //           <p className="text-sm">
// //             مورد جستجو میتواند بخشی از نام و یا کد ملی مشتری باشد.
// //           </p>
// //           <input
// //             type="text"
// //             placeholder="اینجا تایپ کنید..."
// //             className="w-32 border border-gray-600 p-0 h-7 rounded-md pr-2 placeholder:text-sm"
// //             value={searchValue}
// //             onChange={(e) => setSearchValue(e.target.value)}
// //           />
// //         </div>
// //         <div className="flex justify-between items-center">
// //           <p className="text-sm">تفاضل مبالغ خرید و فروش مشتری(فروش - خرید):</p>
// //           <p className="text-yellow-900">
// //             {diffBuySell?.toLocaleString("en-US")}
// //           </p>
// //         </div>
// //         <div className="flex justify-between items-center">
// //           <p className="text-sm">
// //             تفاضل مبالغ دریافتی و پرداختی(پرداخت - دریافت):
// //           </p>
// //           <p className="text-yellow-900">
// //             {diffPaymentReceived?.toLocaleString("en-US")}
// //           </p>
// //         </div>
// //       </div>
// //       <div className="grid grid-cols-3 gap-5 items-start mt-8">
// //         <div className="h-[33.7rem] max-h-[33.7rem] border border-gray-300 p-4 rounded-md relative w-full">
// //           <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
// //             لیست مشتریان
// //           </p>
// //           <div className="h-[25rem] max-h-[25rem] overflow-y-auto rounded-md border w-full">
// //             <Table className="min-w-full table-fixed text-right border-collapse">
// //               <TableHeader className="top-0 sticky">
// //                 <TableRow className="bg-gray-100">
// //                   <TableHead className="w-[15%] text-center">ردیف</TableHead>
// //                   <TableHead className="w-[65%] text-center">
// //                     نام کامل
// //                   </TableHead>
// //                   <TableHead className="w-[50%] text-center">کدملی</TableHead>
// //                   <TableHead className="w-[40%] text-center">نقش</TableHead>
// //                   <TableHead className="w-[60%] text-center">وضعیت</TableHead>
// //                 </TableRow>
// //               </TableHeader>

// //               <TableBody>
// //                 {(filteredPeopleList ?? peopleList ?? [])?.map(
// //                   (person, index) => {
// //                     return (
// //                       <TableRow
// //                         key={`${person?._id}-${index}`}
// //                         onClick={() => {
// //                           // handleAllDeals();
// //                           setSelectedNationalId(person.nationalId.toString());
// //                           setTransactions([]);
// //                           setSelectedDealId(null);
// //                         }}
// //                         className={`cursor-pointer ${
// //                           selectedNationalId?.toString() ===
// //                           person.nationalId.toString()
// //                             ? "bg-gray-200"
// //                             : "bg-white"
// //                         }`}
// //                       >
// //                         <TableCell className="text-center">
// //                           {index + 1}
// //                         </TableCell>
// //                         <TableCell className="text-center">
// //                           {person.fullName}
// //                         </TableCell>
// //                         <TableCell className="text-center">
// //                           {person.nationalId}
// //                         </TableCell>
// //                         <TableCell className="text-center">
// //                           {getPersonRole(person.nationalId?.toString() || "")}
// //                         </TableCell>
// //                         <TableCell className="text-center">
// //                           {(() => {
// //                             const status = customerStatusMap.get(
// //                               person.nationalId?.toString() || ""
// //                             );
// //                             if (!status) return "—";
// //                             return (
// //                               <span
// //                                 className={
// //                                   status.status === "بدهکار"
// //                                     ? "text-red-600"
// //                                     : status.status === "بستانکار"
// //                                     ? "text-green-600"
// //                                     : "text-blue-600"
// //                                 }
// //                               >
// //                                 {status.status}
// //                                 {/* {status.amount > 0 && (
// //                                   <span className="text-xs mr-1">
// //                                     {" "}
// //                                     ({status.amount.toLocaleString("en-US")})
// //                                   </span>
// //                                 )} */}
// //                               </span>
// //                             );
// //                           })()}
// //                         </TableCell>
// //                       </TableRow>
// //                     );
// //                   }
// //                 )}
// //               </TableBody>
// //             </Table>
// //           </div>
// //           {/* {selectedNationalId && customerStatus && (
// //             <div className="mt-4 p-4 border border-gray-300 rounded-md bg-gray-50">
// //               <h3 className="text-sm font-bold mb-2 text-blue-900">
// //                 وضعیت نهایی مشتری
// //               </h3>
// //               <div className="flex justify-between items-center">
// //                 <span className="text-sm">وضعیت:</span>
// //                 <span
// //                   className={`text-sm font-bold ${
// //                     customerStatus.status === "بدهکار"
// //                       ? "text-red-600"
// //                       : customerStatus.status === "بستانکار"
// //                       ? "text-green-600"
// //                       : "text-blue-600"
// //                   }`}
// //                 >
// //                   {customerStatus.status}
// //                 </span>
// //                 <span className="text-sm">مبلغ:</span>
// //                 <span className="text-sm font-bold">
// //                   {customerStatus.amount.toLocaleString("en-US")}
// //                 </span>
// //               </div>
// //             </div>
// //           )} */}
// //         </div>
// //         <div className="space-y-6">
// //           <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
// //             <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
// //               فروشنده خودرو
// //             </p>
// //             <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
// //               <Table className="min-w-full table-fixed text-right border-collapse">
// //                 <TableHeader className="top-0 sticky">
// //                   <TableRow className="bg-gray-100">
// //                     <TableHead className="w-[15%] text-center">ردیف</TableHead>
// //                     <TableHead className="w-[35%] text-center">شاسی</TableHead>
// //                     <TableHead className="w-[55%] text-center">مدل</TableHead>
// //                     <TableHead className="w-[35%] text-center">تاریخ</TableHead>
// //                     <TableHead className="w-[30%] text-center">قیمت</TableHead>
// //                   </TableRow>
// //                 </TableHeader>

// //                 {carSeller && carSeller.length > 0
// //                   ? carSeller.map((deal: IDeal, index: number) => (
// //                       <TableRow
// //                         key={`${deal?._id}-${index}`}
// //                         onClick={() => {
// //                           handleTransationDataByDealId(deal._id.toString());
// //                           handleChequeDataByDealId(deal._id.toString());
// //                         }}
// //                         className="hover:bg-gray-50 cursor-pointer"
// //                       >
// //                         <TableCell className="text-center">
// //                           {index + 1}
// //                         </TableCell>
// //                         <TableCell className="text-center">
// //                           {deal.vehicleSnapshot?.vin}
// //                         </TableCell>
// //                         <TableCell className="text-center">
// //                           {deal.vehicleSnapshot?.model}
// //                         </TableCell>
// //                         <TableCell className="text-center">
// //                           {deal.saleDate}
// //                         </TableCell>
// //                         <TableCell className="text-center">
// //                           {deal.salePrice?.toLocaleString("en-US")}
// //                         </TableCell>
// //                       </TableRow>
// //                     ))
// //                   : null}
// //               </Table>
// //             </div>
// //             {totalSellAmount && Number(totalSellAmount) > 0 ? (
// //               <p className="text-green-400 mt-3 flex justify-end">
// //                 {totalSellAmount?.toLocaleString("en-US")}
// //               </p>
// //             ) : null}
// //           </div>
// //           <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
// //             <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
// //               خریدار خودرو
// //             </p>
// //             <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
// //               <Table className="min-w-full table-fixed text-right border-collapse">
// //                 <TableHeader className="top-0 sticky">
// //                   <TableRow className="bg-gray-100">
// //                     <TableHead className="w-[15%] text-center">ردیف</TableHead>
// //                     <TableHead className="w-[35%] text-center">شاسی</TableHead>
// //                     <TableHead className="w-[55%] text-center">مدل</TableHead>
// //                     <TableHead className="w-[35%] text-center">تاریخ</TableHead>
// //                     <TableHead className="w-[30%] text-center">قیمت</TableHead>
// //                   </TableRow>
// //                 </TableHeader>

// //                 {carBuyer && carBuyer.length > 0 ? (
// //                   <TableBody>
// //                     {carBuyer.map((deal: IDeal, index: number) => (
// //                       <TableRow
// //                         key={`${deal?._id}-${index}`}
// //                         onClick={() => {
// //                           handleTransationDataByDealId(deal._id.toString());
// //                           handleChequeDataByDealId(deal._id.toString());
// //                         }}
// //                         className="hover:bg-gray-50 cursor-pointer"
// //                       >
// //                         <TableCell className="text-center">
// //                           {index + 1}
// //                         </TableCell>
// //                         <TableCell className="text-center">
// //                           {deal.vehicleSnapshot?.vin}
// //                         </TableCell>
// //                         <TableCell className="text-center">
// //                           {deal.vehicleSnapshot?.model}
// //                         </TableCell>
// //                         <TableCell className="text-center">
// //                           {deal.purchaseDate}
// //                         </TableCell>
// //                         <TableCell className="text-center">
// //                           {deal.purchasePrice?.toLocaleString("en-US")}
// //                         </TableCell>
// //                       </TableRow>
// //                     ))}
// //                   </TableBody>
// //                 ) : null}
// //               </Table>
// //             </div>
// //             {totalBuyAmount && Number(totalBuyAmount) > 0 ? (
// //               <p className="text-yellow-600 mt-3 flex justify-end">
// //                 {totalBuyAmount?.toLocaleString("en-US")}
// //               </p>
// //             ) : null}
// //           </div>
// //         </div>
// //         <div className="space-y-6">
// //           <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
// //             <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
// //               دریافت و پرداخت
// //             </p>
// //             <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
// //               <Table className="min-w-full table-fixed text-right border-collapse">
// //                 <TableHeader className="top-0 sticky">
// //                   <TableRow className="bg-gray-100">
// //                     <TableHead className="w-12 text-center">ردیف</TableHead>
// //                     <TableHead className="w-12 text-center">تاریخ</TableHead>
// //                     <TableHead className="w-12 text-center">مبلغ</TableHead>
// //                     <TableHead className="w-12 text-center">تراکنش</TableHead>
// //                   </TableRow>
// //                 </TableHeader>

// //                 <TableBody>
// //                   {transactions && transactions.length > 0
// //                     ? transactions.map((item, index) => (
// //                         <TableRow
// //                           key={`${item?._id}-${index}`}
// //                           className="hover:bg-gray-50 cursor-pointer"
// //                         >
// //                           <TableCell className="text-center">
// //                             {index + 1}
// //                           </TableCell>
// //                           <TableCell className="text-center">
// //                             {item.transactionDate}
// //                           </TableCell>
// //                           <TableCell className="text-center">
// //                             {item?.amount?.toLocaleString("en-US") ?? ""}
// //                           </TableCell>
// //                           <TableCell className="text-center">
// //                             {item.type} - {item.reason}
// //                           </TableCell>
// //                         </TableRow>
// //                       ))
// //                     : null}
// //                 </TableBody>
// //               </Table>
// //             </div>
// //             {transactions && transactions.length > 0 && (
// //               <div className="flex justify-between items-center gap-2">
// //                 <div className="flex gap-3 items-baseline">
// //                   <p className="text-sm">پرداخت</p>
// //                   <p className="text-red-500 mt-3 flex justify-end">
// //                     {totalPayment?.toLocaleString("en-US")}
// //                   </p>
// //                 </div>
// //                 <div className="flex gap-3 items-baseline">
// //                   <p className="text-sm">دریافت</p>
// //                   <p className="text-blue-500 mt-3 flex justify-end">
// //                     {totalReceived?.toLocaleString("en-US")}
// //                   </p>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //           <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
// //             <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
// //               لیست چک ها
// //             </p>
// //             <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
// //               <Table className="min-w-full table-fixed text-right border-collapse">
// //                 <TableHeader className="top-0 sticky">
// //                   <TableRow className="bg-gray-100">
// //                     <TableHead className="w-12 text-center">ردیف</TableHead>
// //                     <TableHead className="w-12 text-center">سریال چک</TableHead>
// //                     <TableHead className="w-12 text-center">
// //                       شناسه صیادی
// //                     </TableHead>
// //                     <TableHead className="w-12 text-center">مبلغ</TableHead>
// //                     <TableHead className="w-12 text-center">
// //                       تاریخ سررسید
// //                     </TableHead>
// //                   </TableRow>
// //                 </TableHeader>

// //                 <TableBody>
// //                   {cheques?.map((item, index) => (
// //                     <TableRow
// //                       key={`${item?._id}-${index}`}
// //                       className="hover:bg-gray-50 cursor-pointer"
// //                     >
// //                       <TableCell className="text-center">{index + 1}</TableCell>
// //                       <TableCell className="text-center">
// //                         {item?.chequeNumber ?? ""}
// //                       </TableCell>
// //                       <TableCell className="text-center">
// //                         {item?.sayadiID ?? ""}
// //                       </TableCell>
// //                       <TableCell className="text-center">
// //                         {item?.amount?.toLocaleString("en-US") ?? ""}
// //                       </TableCell>
// //                       <TableCell className="text-center">
// //                         {item?.dueDate ?? ""}
// //                       </TableCell>
// //                     </TableRow>
// //                   ))}
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
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default CustomersDashboard;

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
  const [transactions, setTransactions] = React.useState<ITransactionNew[]>([]);
  const [cheques, setCheques] = React.useState<IChequeNew[]>([]);
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

  const { totalReceived, totalPayment } = React.useMemo(() => {
    if (!selectedNationalId) {
      return { totalReceived: 0, totalPayment: 0 };
    }

    let received = 0;
    let payment = 0;

    if (transactions.length > 0) {
      transactions.forEach((t) => {
        const dealForTransaction = selectedPersonDeals.find(
          (d) => d._id.toString() === t.dealId
        );

        if (dealForTransaction) {
          const sellerNationalIdStr =
            dealForTransaction.seller.nationalId?.toString() || "";
          const buyerNationalIdStr =
            dealForTransaction.buyer.nationalId?.toString() || "";
          const selectedNationalIdStr = selectedNationalId?.toString() || "";

          const isSeller = sellerNationalIdStr === selectedNationalIdStr;
          const isBuyer = buyerNationalIdStr === selectedNationalIdStr;

          if (isSeller && t.type === "پرداخت") {
            if (
              t.reason === "خرید خودرو" ||
              t.reason?.includes("خريد") ||
              t.reason?.includes("خرید")
            ) {
              payment += t.amount || 0;
            }
          }

          if (isBuyer && t.type === "دریافت") {
            if (t.reason === "فروش") {
              received += t.amount || 0;
            }
          }
        }
      });
    } else if (allPersonTransactions.length > 0) {
      selectedPersonDeals.forEach((deal) => {
        const dealTransactions = allPersonTransactions.filter(
          (t) => t.dealId === deal._id.toString()
        );

        const vehicleRelatedTransactions = dealTransactions.filter((t) => {
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

        if (deal.seller.nationalId?.toString() === selectedNationalId) {
          const paymentsToSeller = vehicleRelatedTransactions
            .filter((t) => {
              return (
                t.type === "پرداخت" &&
                (t.reason === "خرید خودرو" ||
                  t.reason?.includes("خريد") ||
                  t.reason?.includes("خرید"))
              );
            })
            .reduce((sum, t) => sum + (t.amount || 0), 0);

          payment += paymentsToSeller;
        }

        if (deal.buyer.nationalId?.toString() === selectedNationalId) {
          const receiptsFromBuyer = vehicleRelatedTransactions
            .filter((t) => t.type === "دریافت" && t.reason === "فروش")
            .reduce((sum, t) => sum + (t.amount || 0), 0);
          received += receiptsFromBuyer;
        }
      });
    }

    return { totalReceived: received, totalPayment: payment };
  }, [
    selectedNationalId,
    selectedPersonDealIds,
    allPersonTransactions,
    transactions,
    selectedPersonDeals,
  ]);

  const diffPaymentReceived = (totalPayment || 0) - (totalReceived || 0);

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
          const dealTransactions = allPersonTransactions.filter(
            (t) => t.dealId === deal._id.toString()
          );

          const paymentsToSeller = dealTransactions
            .filter(
              (t) =>
                t.type === "پرداخت" &&
                t.personId?.toString() === sellerPersonId &&
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
          const dealTransactions = allPersonTransactions.filter(
            (t) => t.dealId === deal._id.toString()
          );

          const receiptsFromBuyer = dealTransactions
            .filter(
              (t) =>
                t.type === "دریافت" &&
                t.personId?.toString() === buyerPersonId &&
                t.reason === "فروش"
            )
            .reduce((sum, t) => sum + (t.amount || 0), 0);

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
          status: walletBalance > 0 ? "بستانکار" : "بدهکار",
          amount: Math.abs(walletBalance),
        });
      }
    });

    return statusMap;
  }, [peopleList, allDeals, allPersonTransactions]);

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
          <div className="h-[25rem] max-h-[25rem] overflow-y-auto rounded-md border w-full">
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
                        className={`cursor-pointer ${
                          selectedNationalId?.toString() ===
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
                                {" "}
                                {status.amount.toLocaleString("en-US")}
                              </span>
                            ) : (
                              0
                            );

                            // {/* {status.amount > 0 && (
                            //   <span className="text-xs mr-1">
                            //     {" "}
                            //     ({status.amount.toLocaleString("en-US")})
                            //   </span>
                            // )} */}
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
                  {transactions && transactions.length > 0
                    ? transactions.map((item, index) => (
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
            {transactions && transactions.length > 0 && (
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
                  {cheques?.map((item, index) => (
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

//   // Calculate customer roles correctly
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

//   // Get role display string for a person
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
//       // Filter vehicle-related transactions only (similar to vehicle dashboard)
//       const filtered = res.filter((t) => {
//         // Exclude salary payments
//         if (t.reason?.includes("حقوق") || t.reason?.includes("پرداخت حقوق")) {
//           return false;
//         }

//         // For payments: only include خرید خودرو (or includes "خريد"/"خرید"), درصد کارگزار, هزینه وسیله
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

//         // For receipts: only include فروش
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

//   // const personsRole = React.useMemo(() => {
//   //   return filteredPeopleList?.map((person) =>
//   //     person.wallet.transactions.map((transaction) =>
//   //       transaction.type === "commission"
//   //         ? "فروشنده"
//   //         : transaction.type === "deposit"
//   //         ? "خریدار"
//   //         : ["commission", "deposit"].includes(transaction.type)
//   //         ? "خریدار / فروشنده"
//   //         : "-"
//   //     )
//   //   );
//   // }, [peopleList]);

//   // const personsRole2 = filteredPeopleList?.map((person) =>
//   //   person.wallet.transactions.map((transaction) =>
//   //     transaction.type === "commission"
//   //       ? "فروشنده"
//   //       : transaction.type === "deposit"
//   //       ? "خریدار"
//   //       : ["commission", "deposit"].includes(transaction.type)
//   //       ? "خریدار / فروشنده"
//   //       : "-"
//   //   )
//   // );
//   // console.log("🚀 ~ CustomersDashboard ~ personsRole:", personsRole);
//   // console.log("🚀 ~ CustomersDashboard ~ personsRole2:", personsRole2);

//   const totalBuyAmount = carBuyer.reduce(
//     (sum, deal) => sum + (deal.purchasePrice || 0),
//     0
//   );

//   const totalSellAmount = carSeller.reduce(
//     (sum, deal) => sum + (deal.salePrice || 0),
//     0
//   );

//   const diffBuySell = (totalSellAmount || 0) - (totalBuyAmount || 0);

//   // const calculateCustomerStatus = (person: any) => {
//   //   if (selectedNationalId === person.nationalId.toString() && customerStatus) {
//   //     return customerStatus.status;
//   //   }
//   //   return "—";
//   // };

//   const selectedPersonDealIds = React.useMemo(() => {
//     return selectedPersonDeals
//       .map((deal) => deal._id.toString())
//       .sort()
//       .join(",");
//   }, [selectedPersonDeals]);

//   // Calculate total received and payment correctly
//   // When a deal is selected and transactions are displayed, calculate from those transactions
//   // Otherwise, calculate from all person transactions
//   const { totalReceived, totalPayment } = React.useMemo(() => {
//     if (!selectedNationalId) {
//       return { totalReceived: 0, totalPayment: 0 };
//     }

//     let received = 0;
//     let payment = 0;

//     // If transactions are displayed (specific deal selected), calculate from those
//     // Check both transactions length and selectedDealId to ensure we're in the right context
//     if (transactions.length > 0 && selectedDealId) {
//       // For each displayed transaction, find the deal and check person's role
//       transactions.forEach((t) => {
//         const dealForTransaction = selectedPersonDeals.find(
//           (d) => d._id.toString() === t.dealId
//         );

//         if (dealForTransaction) {
//           // Normalize both sides to string for comparison
//           const sellerNationalIdStr =
//             dealForTransaction.seller.nationalId?.toString() || "";
//           const buyerNationalIdStr =
//             dealForTransaction.buyer.nationalId?.toString() || "";
//           const selectedNationalIdStr = selectedNationalId?.toString() || "";

//           const isSeller = sellerNationalIdStr === selectedNationalIdStr;
//           const isBuyer = buyerNationalIdStr === selectedNationalIdStr;

//           // If person is seller: count payments with "خرید خودرو" (we pay them for the car they sold)
//           if (isSeller && t.type === "پرداخت") {
//             if (
//               t.reason === "خرید خودرو" ||
//               t.reason?.includes("خريد") ||
//               t.reason?.includes("خرید")
//             ) {
//               payment += t.amount || 0;
//             }
//           }

//           // If person is buyer: count receipts with "فروش" (we receive from them for the car they bought)
//           if (isBuyer && t.type === "دریافت") {
//             if (t.reason === "فروش") {
//               received += t.amount || 0;
//             }
//           }
//         }
//       });
//     } else if (allPersonTransactions.length > 0) {
//       // Calculate from all person transactions across all deals
//       selectedPersonDeals.forEach((deal) => {
//         const dealIdStr = deal._id.toString();
//         const dealTransactions = allPersonTransactions.filter((t) => {
//           // Match dealId with flexible comparison
//           const transactionDealId = t.dealId?.toString() || "";
//           return (
//             transactionDealId === dealIdStr ||
//             transactionDealId === deal._id.toString() ||
//             (typeof t.dealId === "string" && t.dealId === dealIdStr)
//           );
//         });

//         // Filter vehicle-related transactions only
//         const vehicleRelatedTransactions = dealTransactions.filter((t) => {
//           // Exclude salary payments
//           if (t.reason?.includes("حقوق") || t.reason?.includes("پرداخت حقوق")) {
//             return false;
//           }

//           // For payments: only include خرید خودرو (or includes "خريد"/"خرید"), درصد کارگزار, هزینه وسیله
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

//           // For receipts: only include فروش
//           if (t.type === "دریافت") {
//             return t.reason === "فروش";
//           }

//           return false;
//         });

//         // Calculate as seller: payments TO seller (for purchase - خرید خودرو)
//         // Don't filter by personId - just count all vehicle-related payments for this deal
//         if (deal.seller.nationalId?.toString() === selectedNationalId) {
//           // Filter for payments with "خرید خودرو" reason
//           const purchasePayments = vehicleRelatedTransactions.filter((t) => {
//             if (t.type !== "پرداخت") return false;
//             const reason = t.reason || "";
//             return (
//               reason === "خرید خودرو" ||
//               reason.includes("خريد") ||
//               reason.includes("خرید")
//             );
//           });

//           const paymentsToSeller = purchasePayments.reduce(
//             (sum, t) => sum + (t.amount || 0),
//             0
//           );
//           payment += paymentsToSeller;
//         }

//         // Calculate as buyer: receipts FROM buyer (for sale - فروش)
//         // Don't filter by personId - just count all vehicle-related receipts for this deal
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

//   // const uniqeUsersRole = (userRole: string[] | undefined) => {
//   //   if (!userRole || userRole.length === 0) {
//   //     return "—";
//   //   }

//   //   const roles = userRole.map((r) => r.toLowerCase());
//   //   const hasBuyer = roles.includes("buyer") || roles.includes("خریدار");
//   //   const hasSeller = roles.includes("seller") || roles.includes("فروشنده");
//   //   const hasBroker = roles.includes("broker") || roles.includes("کارگزار");
//   //   const hasCustomer = roles.includes("customer") || roles.includes("مشتری");

//   //   // Build role labels array
//   //   const roleLabels: string[] = [];

//   //   if (hasBuyer && hasSeller) {
//   //     roleLabels.push("خریدار / فروشنده");
//   //   } else {
//   //     if (hasBuyer) roleLabels.push("خریدار");
//   //     if (hasSeller) roleLabels.push("فروشنده");
//   //   }

//   //   if (hasBroker) roleLabels.push("کارگزار");
//   //   if (hasCustomer && !hasBuyer && !hasSeller) roleLabels.push("مشتری");

//   //   return roleLabels.length > 0 ? roleLabels.join(" / ") : "—";
//   // };

//   // Calculate customer status (wallet balance) for each person
//   const customerStatusMap = React.useMemo(() => {
//     const statusMap = new Map<string, { status: string; amount: number }>();

//     peopleList?.forEach((person) => {
//       const nationalId = person.nationalId?.toString();
//       if (!nationalId) return;

//       // Get all deals for this person
//       const personDeals = allDeals.filter(
//         (deal) =>
//           deal.buyer.nationalId?.toString() === nationalId ||
//           deal.seller.nationalId?.toString() === nationalId
//       );

//       if (personDeals.length === 0) {
//         statusMap.set(nationalId, { status: "—", amount: 0 });
//         return;
//       }

//       // Calculate as seller
//       let totalPaidToSeller = 0;
//       let totalPurchasePrice = 0;

//       personDeals.forEach((deal) => {
//         if (deal.seller.nationalId?.toString() === nationalId) {
//           totalPurchasePrice += deal.purchasePrice || 0;

//           const sellerPersonId = deal.seller.personId?.toString();
//           const dealTransactions = allPersonTransactions.filter(
//             (t) => t.dealId === deal._id.toString()
//           );

//           // Filter vehicle-related payments only (خرید خودرو)
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

//       // Calculate as buyer
//       let totalReceivedFromBuyer = 0;
//       let totalSalePrice = 0;

//       personDeals.forEach((deal) => {
//         if (deal.buyer.nationalId?.toString() === nationalId) {
//           totalSalePrice += deal.salePrice || 0;

//           const buyerPersonId = deal.buyer.personId?.toString();
//           const dealTransactions = allPersonTransactions.filter(
//             (t) => t.dealId === deal._id.toString()
//           );

//           // Filter vehicle-related receipts only (فروش)
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

//       // Net wallet balance: positive = creditor (بستانکار), negative = debtor (بدهکار)
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
//   }, [peopleList, allDeals, allPersonTransactions]);

//   // Get customer status for selected person (for detailed view)
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
//           <div className="h-[25rem] max-h-[25rem] overflow-y-auto rounded-md border w-full">
//             <Table className="min-w-full table-fixed text-right border-collapse">
//               <TableHeader className="top-0 sticky">
//                 <TableRow className="bg-gray-100">
//                   <TableHead className="w-[15%] text-center">ردیف</TableHead>
//                   <TableHead className="w-[65%] text-center">
//                     نام کامل
//                   </TableHead>
//                   <TableHead className="w-[50%] text-center">کدملی</TableHead>
//                   <TableHead className="w-[40%] text-center">نقش</TableHead>
//                   <TableHead className="w-[60%] text-center">وضعیت</TableHead>
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
