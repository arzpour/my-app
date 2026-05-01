// "use client";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { FileDown, Pencil, Trash } from "lucide-react";
// import React from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { getAllVehicles } from "@/apis/client/vehicles";
// import { IDeal, IVehicle } from "@/types/new-backend-types";
// import VehicleFormModal from "@/components/forms/vehicleFormModal";
// import useGetAllDeals from "@/hooks/useGetAllDeals";
// import { setChassisNo } from "@/redux/slices/carSlice";
// import { useDispatch, useSelector } from "react-redux";
// import useGetTransactionByDealId from "@/hooks/useGetTransactionByDealId";
// import { toast } from "sonner";
// import DeleteModal from "@/components/modals/deleteModal";
// import { useDeleteVehicle } from "@/apis/mutations/vehicle";
// import { formatPrice } from "@/utils/systemConstants";
// import { useDeleteWalletTransaction } from "@/apis/mutations/people";
// import { useDeleteDeal } from "@/apis/mutations/deals";
// import { Switch } from "../ui/switch";
// import useGetVehicles from "@/hooks/useGetVehicle";
// import { exportToExcel } from "@/utils/exportToExcel";
// import { RootState } from "@/redux/store";
// import useGetProfit from "@/hooks/useGetProfit";
// import useCalculateVehicleProfit from "@/hooks/useGetProfit";

// const VehicleList = () => {
//   // const { data: vehicles, isLoading: vehiclesLoading } = useQuery({
//   //   queryKey: ["get-all-vehicles"],
//   //   queryFn: getAllVehicles,
//   // });
//   const { data: vehicles, isLoading: vehiclesLoading } = useGetVehicles();
//   const { data: allDeals } = useGetAllDeals();
//   const [isModalOpen, setIsModalOpen] = React.useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
//   const [selectedDealId, setSelectedDealId] = React.useState<
//     string | undefined
//   >(undefined);
//   const [selectedVehicle, setSelectedVehicle] = React.useState<IVehicle | null>(
//     null,
//   );
//   const [relatedDeal, setRelatedDeal] = React.useState<IDeal | undefined>(
//     undefined,
//   );
//   const [modalMode, setModalMode] = React.useState<"add" | "edit">("add");
//   const [existCars, setExistCars] = React.useState(false);

//   const dispatch = useDispatch();
//   const deleteVehicleMutation = useDeleteVehicle();
//   const deleteDealById = useDeleteDeal();

//   const getTransactionByDealId = useGetTransactionByDealId(selectedDealId);

//   // const { netProfit } = useSelector((state: RootState) => state.transaction);

//   //   React.useEffect(() => {
//   //     const fetchDeals = async () => {
//   //       try {
//   //        const res = await getAllDeals.mutateAsync();
//   // setAllDeals(res)
//   //       } catch (error) {
//   //         console.error("Error fetching deals:", error);
//   //       }
//   //     };
//   //     fetchDeals();
//   //   }, []);

//   // const deals = getAllDeals.data || [];

//   // const vinToDealMap = React.useMemo(() => {
//   //   const map = new Map<string, IDeal>();
//   //   deals.forEach((deal) => {
//   //     const vin = deal.vehicleSnapshot?.vin;
//   //     if (vin) {
//   //       const existingDeal = map.get(vin);
//   //       if (!existingDeal) {
//   //         map.set(vin, deal);
//   //       } else {
//   //         const existingDate =
//   //           existingDeal.saleDate || existingDeal.purchaseDate;
//   //         const currentDate = deal.saleDate || deal.purchaseDate;
//   //         if (currentDate > existingDate) {
//   //           map.set(vin, deal);
//   //         }
//   //       }
//   //     }
//   //   });
//   //   return map;
//   // }, [deals]);

//   const handleEdit = (vehicle: IVehicle) => {
//     setSelectedVehicle(vehicle);
//     setModalMode("edit");
//     setIsModalOpen(true);
//   };

//   const handleDeleteClick = (vehicle: IVehicle) => {
//     const relatedDeal = (allDeals ?? []).find(
//       (el) => el.vehicleSnapshot?.vin === vehicle.vin,
//     );
//     setSelectedVehicle(vehicle);
//     setSelectedDealId(relatedDeal?._id?.toString());
//     setIsDeleteModalOpen(true);
//   };

//   const queryClient = useQueryClient();
//   const deleteWalletTransaction = useDeleteWalletTransaction();

//   const handleConfirmDelete = async () => {
//     if (!selectedVehicle?._id) return;
//     const relatedDeal = (allDeals ?? []).find(
//       (el) => el.vehicleSnapshot?.vin === selectedVehicle.vin,
//     );
//     const hasTransactions = (getTransactionByDealId.data?.length ?? 0) > 0;
//     const hasDirectCosts =
//       (relatedDeal?.directCosts?.otherCost?.length ?? 0) > 0 ||
//       (relatedDeal?.directCosts?.options?.length ?? 0) > 0;
//     if (hasTransactions || hasDirectCosts) {
//       toast.error(
//         "این خودرو قابل حذف نیست، برای حذف ابتدا تراکنش های مربوط به این خودرو را حذف کنید",
//       );
//       return;
//     }

//     try {
//       await deleteVehicleMutation.mutateAsync(selectedVehicle._id);
//       queryClient.invalidateQueries({ queryKey: ["get-all-vehicles"] });
//       setIsDeleteModalOpen(false);
//     } catch (error) {
//       console.error("Error deleting vehicle:", error);
//     }

//     try {
//       await deleteDealById.mutateAsync(selectedDealId ?? "");

//       // queryClient.invalidateQueries({ queryKey: ["get-all-vehicles"] });
//     } catch (error) {
//       console.error("Error deleting vehicle:", error);
//     }

//     const deleteTransactions = async () => {
//       try {
//         await deleteWalletTransaction.mutateAsync({
//           id: relatedDeal?.buyer.personId ?? "",
//           data: {
//             dealID: selectedDealId ?? "",
//             transactionID: "",
//           },
//         });
//       } catch (error) {
//         console.error("Error deleting buyer transaction:", error);
//       }

//       try {
//         await deleteWalletTransaction.mutateAsync({
//           id: relatedDeal?.seller.personId ?? "",
//           data: {
//             dealID: selectedDealId ?? "",
//             transactionID: "",
//           },
//         });
//       } catch (error) {
//         console.error("Error deleting seller transaction:", error);
//       }

//       try {
//         relatedDeal?.partnerships.forEach(async (partnership) => {
//           await deleteWalletTransaction.mutateAsync({
//             id: partnership.partner.personId,
//             data: {
//               dealID: selectedDealId ?? "",
//               transactionID: "",
//             },
//           });
//         });
//       } catch (error) {
//         console.error("Error deleting partnership transaction:", error);
//       }

//       try {
//         await deleteWalletTransaction.mutateAsync({
//           id: relatedDeal?.purchaseBroker.personId ?? "",
//           data: {
//             dealID: selectedDealId ?? "",
//             transactionID: "",
//           },
//         });
//       } catch (error) {
//         console.error("Error deleting purchase broker transaction:", error);
//       }

//       try {
//         await deleteWalletTransaction.mutateAsync({
//           id: relatedDeal?.saleBroker.personId ?? "",
//           data: {
//             dealID: selectedDealId ?? "",
//             transactionID: "",
//           },
//         });
//       } catch (error) {
//         console.error("Error deleting sale broker transaction:", error);
//       }
//     };

//     deleteTransactions();
//     queryClient.invalidateQueries({
//       queryKey: ["get-vehicles"],
//     });

//     dispatch(setChassisNo(""));

//     // try {
//     //   await deleteVehicleMutation.mutateAsync(selectedVehicle._id);
//     //   setIsDeleteModalOpen(false);
//     //   // setSelectedDealId(undefined);
//     //   // setSelectedVehicle(null);
//     //   queryClient.invalidateQueries({ queryKey: ["get-all-vehicles"] });

//     //   await deleteWalletTransaction.mutateAsync({
//     //     id: relatedDeal?.buyer.personId ?? "",
//     //     data: {
//     //       dealID: selectedDealId ?? "",
//     //       transactionID: "",
//     //     },
//     //   });
//     //   await deleteWalletTransaction.mutateAsync({
//     //     id: relatedDeal?.seller.personId ?? "",
//     //     data: {
//     //       dealID: selectedDealId ?? "",
//     //       transactionID: "",
//     //     },
//     //   });
//     //   await deleteWalletTransaction.mutateAsync({
//     //     id: relatedDeal?.partnerships ?? "",
//     //     data: {
//     //       dealID: selectedDealId ?? "",
//     //       transactionID: "",
//     //     },
//     //   });
//     //   await deleteWalletTransaction.mutateAsync({
//     //     id: relatedDeal?.purchaseBroker.personId ?? "",
//     //     data: {
//     //       dealID: selectedDealId ?? "",
//     //       transactionID: "",
//     //     },
//     //   });
//     //   await deleteWalletTransaction.mutateAsync({
//     //     id: relatedDeal?.saleBroker.personId ?? "",
//     //     data: {
//     //       dealID: selectedDealId ?? "",
//     //       transactionID: "",
//     //     },
//     //   });
//     // } catch (error) {
//     //   console.error("Error deleting vehicle:", error);
//     // }
//   };

//   // const handleAdd = () => {
//   //   setSelectedVehicle(null);
//   //   setModalMode("add");
//   //   setIsModalOpen(true);
//   // };

//   // const vehiclesList = vehicles || [];

//   const filteredVehicleList = existCars
//     ? vehicles?.filter((v) => v.status === "in_stock")
//     : (vehicles ?? []);

//   // const { netProfit } = useGetProfit();

//   // const { netProfit } = useGetProfit({
//   //   deals: relatedDeal || undefined,
//   //   transactions: getTransactionByDealId || undefined,
//   // });
//   // console.log("🚀 ~ VehicleList ~ netProfit :", netProfit);

//   return (
//     <>
//       <div className="flex justify-between items-center gap-2 my-4 mt-6">
//         <h4 className="font-semibold text-gray-700">اطلاعات خودرو</h4>
//         {/* <button
//           onClick={handleAdd}
//           className="px-6 py-2 text-white bg-indigo-400 cursor-pointer rounded-md hover:bg-indigo-500 transition-colors"
//         >
//           افزودن مورد جدید
//         </button> */}
//         <div className="flex gap-6 items-center ml-3">
//           <button
//             onClick={() =>
//               exportToExcel({ allDeals, filteredVehicleList, })
//             }
//             title="خروجی اکسل"
//             className="cursor-pointer"
//           >
//             <FileDown className="w-6 h-6 text-gray-600" />
//           </button>
//           <Switch checked={existCars} onCheckedChange={setExistCars} />
//         </div>
//       </div>
//       {vehiclesLoading ? (
//         <div className="border border-gray-300 p-4 rounded-md w-full mt-7 text-center text-gray-500">
//           در حال بارگذاری...
//         </div>
//       ) : (filteredVehicleList ?? []).length > 0 ? (
//         <div className="border border-gray-300 p-4 rounded-md w-full mt-7">
//           <div className="max-h-[33rem] overflow-y-auto rounded-md border w-full">
//             <Table className="min-w-full table-fixed text-right border-collapse">
//               <TableHeader className="top-0 sticky">
//                 <TableRow className="hover:bg-transparent bg-gray-100">
//                   <TableHead className="text-center w-12">ردیف</TableHead>
//                   <TableHead className="text-center">شاسی</TableHead>
//                   <TableHead className="text-center">مدل ماشین</TableHead>
//                   <TableHead className="text-center">پلاک</TableHead>
//                   <TableHead className="text-center">
//                     {/* طرف اول(فروشنده) */}
//                     طرف اول
//                   </TableHead>
//                   {/* <TableHead className="text-center">طرف دوم(خریدار)</TableHead> */}
//                   <TableHead className="text-center">طرف دوم</TableHead>
//                   <TableHead className="text-center w-36">
//                     کارگزار خرید
//                   </TableHead>
//                   <TableHead className="text-center w-36">
//                     کارگزار فروش
//                   </TableHead>
//                   <TableHead className="text-center">مبلغ خرید</TableHead>
//                   <TableHead className="text-center">مبلغ فروش</TableHead>
//                   <TableHead className="text-center">آپشن</TableHead>
//                   <TableHead className="text-center">هزینه</TableHead>
//                   <TableHead className="text-center">سود خالص</TableHead>
//                   <TableHead className="text-center">منشی</TableHead>
//                   <TableHead className="text-center">مدارک</TableHead>
//                   <TableHead className="text-center">عملیات</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {(filteredVehicleList ?? []).map((vehicle, index) => {
//                   const relatedDeal = (allDeals ?? []).find(
//                     (el) => el.vehicleSnapshot?.vin === vehicle.vin,
//                   );
//                   // setRelatedDeal(relatedDeal);

//                   const options = relatedDeal?.directCosts.options.reduce(
//                     (sum, t) => sum + parseInt(t?.cost.toString()),
//                     0,
//                   );

//                   const costs = relatedDeal?.directCosts.otherCost.reduce(
//                     (sum, t) => sum + parseInt(t?.cost.toString()),
//                     0,
//                   );

//                   const { netProfit, isLoading: profitLoading } =
//                     useCalculateVehicleProfit(vehicle.vin);

//                   return (
//                     <TableRow
//                       key={`${vehicle._id}-${index}`}
//                       className="has-data-[state=checked]:bg-muted/50"
//                     >
//                       <TableCell className="text-center">{index + 1}</TableCell>
//                       <TableCell className="text-center">
//                         {vehicle.vin || "—"}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {vehicle.model || "—"}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {vehicle?.plateNumber || "—"}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {relatedDeal?.seller?.fullName || "—"}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {relatedDeal?.buyer?.fullName || "—"}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {relatedDeal?.purchaseBroker?.fullName || "—"} /{" "}
//                         {relatedDeal?.purchaseBroker?.commissionPercent || "—"}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {relatedDeal?.saleBroker?.fullName || "—"} /{" "}
//                         {relatedDeal?.saleBroker?.commissionPercent || "—"}
//                       </TableCell>
//                       <TableCell
//                         title={formatPrice(relatedDeal?.purchasePrice)}
//                         className="text-center truncate"
//                       >
//                         {relatedDeal?.purchasePrice != null
//                           ? formatPrice(relatedDeal.purchasePrice)
//                           : "—"}
//                       </TableCell>
//                       <TableCell
//                         title={formatPrice(relatedDeal?.salePrice)}
//                         className="text-center truncate"
//                       >
//                         {relatedDeal?.salePrice != null
//                           ? formatPrice(relatedDeal.salePrice)
//                           : "—"}
//                       </TableCell>
//                       <TableCell
//                         title={formatPrice(options)}
//                         className="text-center truncate"
//                       >
//                         {formatPrice(options) || "—"}
//                       </TableCell>
//                       <TableCell
//                         title={formatPrice(costs)}
//                         className="text-center truncate"
//                       >
//                         {formatPrice(costs) || "—"}
//                       </TableCell>

//                       <TableCell className="text-center">
//                         {vehicle.status !== "sold" ? "—" :  formatPrice(netProfit || 0) || "—"}
//                       </TableCell>

//                       <TableCell
//                         title={vehicle.SecretaryName}
//                         className="text-center truncate"
//                       >
//                         {vehicle.SecretaryName || "—"}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {Array.isArray(vehicle.documents)
//                           ? vehicle.documents.length === 0
//                             ? "فاقد مدارک"
//                             : vehicle.documents.length >= 4
//                               ? "کامل"
//                               : "ناقص"
//                           : (vehicle.documents ?? "—")}
//                       </TableCell>
//                       <TableCell className="text-center flex gap-3 items-center justify-center">
//                         <Pencil
//                           className="w-4 h-4 cursor-pointer hover:text-indigo-500"
//                           onClick={() => {
//                             handleEdit(vehicle);
//                             dispatch(setChassisNo(vehicle.vin));
//                           }}
//                         />
//                         <Trash
//                           className="w-4 h-4 cursor-pointer hover:text-red-500"
//                           onClick={() => handleDeleteClick(vehicle)}
//                         />
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </div>
//         </div>
//       ) : (
//         <div className="border border-gray-300 p-4 rounded-md w-full mt-7 text-center text-gray-500">
//           هیچ خودرویی یافت نشد
//         </div>
//       )}
//       <VehicleFormModal
//         open={isModalOpen}
//         onOpenChange={setIsModalOpen}
//         vehicleData={selectedVehicle as any}
//         mode={modalMode}
//       />
//       {isDeleteModalOpen && (
//         <DeleteModal
//           isOpenDeleteModal={isDeleteModalOpen}
//           setIsOpenDeleteModal={setIsDeleteModalOpen}
//           handleConfirmDelete={handleConfirmDelete}
//           setIdToDelete={setSelectedDealId}
//           title="خودرو"
//           deletePending={deleteVehicleMutation.isPending}
//         />
//       )}
//     </>
//   );
// };

// export default VehicleList;

// // "use client";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import { FileDown, Pencil, Trash } from "lucide-react";
// // import React from "react";
// // import { useQueryClient } from "@tanstack/react-query";
// // import { IDeal, IVehicle, ITransactionNew } from "@/types/new-backend-types";
// // import VehicleFormModal from "@/components/forms/vehicleFormModal";
// // import useGetAllDeals from "@/hooks/useGetAllDeals";
// // import { setChassisNo } from "@/redux/slices/carSlice";
// // import { useDispatch, useSelector } from "react-redux";
// // // import useGetTransactionByDealId from "@/hooks/useGetTransactionByDealId"; // Removed: Cannot use inside loop/helper
// // import { toast } from "sonner";
// // import DeleteModal from "@/components/modals/deleteModal";
// // import { useDeleteVehicle } from "@/apis/mutations/vehicle";
// // import { formatPrice } from "@/utils/systemConstants";
// // import { useDeleteWalletTransaction } from "@/apis/mutations/people";
// // import { useDeleteDeal } from "@/apis/mutations/deals";
// // import { Switch } from "../ui/switch";
// // import useGetVehicles from "@/hooks/useGetVehicle";
// // import { exportToExcel } from "@/utils/exportToExcel";
// // // import useGetProfit from "@/hooks/useGetProfit"; // Removed: Cannot use inside helper

// // // 1. Pure function for profit calculation (No Hooks allowed here)
// // const calculateVehicleProfitPure = (
// //   deals: IDeal | undefined,
// //   transactions: ITransactionNew[] | undefined,
// // ): {
// //   netProfit: number | null;
// //   lastNetProfit: number | null;
// //   totalOtherCosts: number;
// //   totalOptionsDeals: number;
// //   grossProfit: number | null;
// //   lastGrossProfit: number | null;
// //   buyAmountWithPercent: number | null;
// //   sellAmountWithPercent: number | null;
// //   halfProfit: number | null;
// // } => {
// //   if (!deals) {
// //     return {
// //       netProfit: null,
// //       lastNetProfit: null,
// //       totalOtherCosts: 0,
// //       totalOptionsDeals: 0,
// //       grossProfit: null,
// //       lastGrossProfit: null,
// //       buyAmountWithPercent: null,
// //       sellAmountWithPercent: null,
// //       halfProfit: null,
// //     };
// //   }

// //   const otherCostCategories =
// //     deals?.directCosts?.otherCost?.map((cost) => cost.category) || [];
// //   const otherCostsFromDirectCosts =
// //     deals?.directCosts?.otherCost?.reduce(
// //       (sum, cost) => sum + (cost.cost || 0),
// //       0,
// //     ) || 0;
// //   const otherCostsFromTransactions =
// //     (transactions ?? [])
// //       ?.filter(
// //         (t) =>
// //           t.type === "پرداخت" &&
// //           otherCostCategories.some((category) => t.reason === category),
// //       )
// //       .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

// //   const otherOptionsTransaction =
// //     transactions
// //       ?.filter((el) => el.reason === "سایر هزینه‌ها")
// //       .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

// //   const totalOtherCosts =
// //     otherCostsFromDirectCosts +
// //     otherCostsFromTransactions +
// //     otherOptionsTransaction;

// //   const totalOptionsDeals =
// //     deals?.directCosts?.options?.reduce(
// //       (sum, cost) => sum + (Number(cost.cost) || 0),
// //       0,
// //     ) || 0;

// //   let lastGrossProfit: number | null = null;
// //   if (deals?.purchasePrice && deals?.salePrice) {
// //     lastGrossProfit = (deals?.salePrice ?? 0) - (deals?.purchasePrice ?? 0);
// //   }

// //   let halfProfit: number | null = null;
// //   halfProfit = (lastGrossProfit || 0) - totalOptionsDeals - totalOtherCosts;

// //   let grossProfit: number | null = null;
// //   if (deals?.purchasePrice || deals?.salePrice) {
// //     grossProfit = (deals.salePrice ?? 0) - (deals.purchasePrice ?? 0);
// //   }

// //   let buyAmountWithPercent: number | null = null;
// //   let sellAmountWithPercent: number | null = null;

// //   const buyAmountWithoutPercent = (deals?.purchasePrice ?? 0) - totalOtherCosts;
// //   const sellAmountWithoutPercent = (deals?.salePrice ?? 0) - totalOtherCosts;

// //   const isLastCalculate = process.env.NEXT_PUBLIC_PROFIT_CALCULATE;

// //   if (isLastCalculate) {
// //     buyAmountWithPercent =
// //       (buyAmountWithoutPercent *
// //         parseFloat(String(deals?.purchaseBroker?.commissionPercent || 0))) /
// //       100;

// //     sellAmountWithPercent =
// //       (sellAmountWithoutPercent *
// //         parseFloat(String(deals?.saleBroker?.commissionPercent || 0))) /
// //       100;
// //   } else {
// //     buyAmountWithPercent =
// //       (halfProfit *
// //         parseFloat(String(deals?.purchaseBroker?.commissionPercent || 0))) /
// //       100;
// //     sellAmountWithPercent =
// //       (halfProfit *
// //         parseFloat(String(deals?.saleBroker?.commissionPercent || 0))) /
// //       100;
// //   }

// //   if (deals?.salePrice == null) {
// //     const amountWithoutPercent = (deals?.purchasePrice ?? 0) - totalOtherCosts;
// //     buyAmountWithPercent =
// //       (amountWithoutPercent *
// //         parseFloat(String(deals?.purchaseBroker?.commissionPercent || 0))) /
// //       100;
// //   }

// //   let netProfit: number | null = null;
// //   if (grossProfit !== null) {
// //     const totalBrokerCommissions =
// //       (buyAmountWithPercent || 0) + (sellAmountWithPercent || 0);
// //     netProfit = grossProfit - (totalOtherCosts + totalBrokerCommissions);
// //   }

// //   let lastNetProfit: number | null = null;

// //   if (isLastCalculate) {
// //     if (lastGrossProfit !== null && deals?.salePrice) {
// //       lastNetProfit =
// //         lastGrossProfit -
// //         totalOtherCosts -
// //         sellAmountWithPercent -
// //         buyAmountWithPercent -
// //         totalOptionsDeals;
// //     }
// //   } else {
// //     if (lastGrossProfit !== null && deals?.salePrice) {
// //       lastNetProfit = halfProfit - buyAmountWithPercent - sellAmountWithPercent;
// //     }
// //   }

// //   return {
// //     lastNetProfit,
// //     netProfit,
// //     buyAmountWithPercent,
// //     sellAmountWithPercent,
// //     halfProfit,
// //     totalOtherCosts,
// //     totalOptionsDeals,
// //     lastGrossProfit,
// //     grossProfit,
// //   };
// // };

// // const VehicleList = () => {
// //   const { data: vehicles, isLoading: vehiclesLoading } = useGetVehicles();
// //   const { data: allDeals } = useGetAllDeals();

// //   // We need a way to get transactions.
// //   // Since we can't use hooks in loops, we assume for now that we don't have transaction data
// //   // OR we need to fetch all transactions via a separate hook if available.
// //   // For this fix, I will pass undefined transactions to the pure function.
// //   // If you have a 'useGetAllTransactions' hook, use it here.
// //   // const { data: allTransactions } = useGetAllTransactions(); // Suggested improvement

// //   const [isModalOpen, setIsModalOpen] = React.useState(false);
// //   const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
// //   const [selectedDealId, setSelectedDealId] = React.useState<
// //     string | undefined
// //   >(undefined);
// //   const [selectedVehicle, setSelectedVehicle] = React.useState<IVehicle | null>(
// //     null,
// //   );
// //   const [modalMode, setModalMode] = React.useState<"add" | "edit">("add");
// //   const [existCars, setExistCars] = React.useState(false);

// //   const dispatch = useDispatch();
// //   const deleteVehicleMutation = useDeleteVehicle();
// //   const deleteDealById = useDeleteDeal();
// //   const queryClient = useQueryClient();
// //   const deleteWalletTransaction = useDeleteWalletTransaction();

// //   // Helper to find deal for a vehicle
// //   const getDealForVehicle = (vin: string | undefined) => {
// //     return (allDeals ?? []).find((el) => el.vehicleSnapshot?.vin === vin);
// //   };

// //   const handleEdit = (vehicle: IVehicle) => {
// //     setSelectedVehicle(vehicle);
// //     setModalMode("edit");
// //     setIsModalOpen(true);
// //   };

// //   const handleDeleteClick = (vehicle: IVehicle) => {
// //     const relatedDeal = getDealForVehicle(vehicle.vin);
// //     setSelectedVehicle(vehicle);
// //     setSelectedDealId(relatedDeal?._id?.toString());
// //     setIsDeleteModalOpen(true);
// //   };

// //   const handleConfirmDelete = async () => {
// //     if (!selectedVehicle?._id) return;

// //     const relatedDeal = getDealForVehicle(selectedVehicle.vin);

// //     // Note: Without transaction data, we can't accurately check hasTransactions
// //     // You should ideally fetch all transactions once and filter here.
// //     // For now, assuming direct costs check is sufficient for demo.
// //     const hasDirectCosts =
// //       (relatedDeal?.directCosts?.otherCost?.length ?? 0) > 0 ||
// //       (relatedDeal?.directCosts?.options?.length ?? 0) > 0;

// //     // If you have transaction data, check it here too.
// //     if (hasDirectCosts) {
// //       toast.error(
// //         "این خودرو قابل حذف نیست، برای حذف ابتدا تراکنش‌های مربوط به این خودرو را حذف کنید",
// //       );
// //       return;
// //     }

// //     try {
// //       await deleteVehicleMutation.mutateAsync(selectedVehicle._id);
// //       queryClient.invalidateQueries({ queryKey: ["get-all-vehicles"] });
// //       setIsDeleteModalOpen(false);

// //       if (relatedDeal) {
// //         await deleteWalletTransaction.mutateAsync({
// //           id: relatedDeal.buyer.personId ?? "",
// //           data: { dealID: selectedDealId ?? "", transactionID: "" },
// //         });
// //         await deleteWalletTransaction.mutateAsync({
// //           id: relatedDeal.seller.personId ?? "",
// //           data: { dealID: selectedDealId ?? "", transactionID: "" },
// //         });

// //         if (relatedDeal.purchaseBroker) {
// //           await deleteWalletTransaction.mutateAsync({
// //             id: relatedDeal.purchaseBroker.personId,
// //             data: { dealID: selectedDealId ?? "", transactionID: "" },
// //           });
// //         }
// //         if (relatedDeal.saleBroker) {
// //           await deleteWalletTransaction.mutateAsync({
// //             id: relatedDeal.saleBroker.personId,
// //             data: { dealID: selectedDealId ?? "", transactionID: "" },
// //           });
// //         }

// //         if (relatedDeal.partnerships) {
// //           await Promise.all(
// //             relatedDeal.partnerships.map(async (partnership) => {
// //               await deleteWalletTransaction.mutateAsync({
// //                 id: partnership.partner.personId,
// //                 data: { dealID: selectedDealId ?? "", transactionID: "" },
// //               });
// //             }),
// //           );
// //         }
// //       }
// //       if (selectedDealId) {
// //         await deleteDealById.mutateAsync(selectedDealId);
// //       }

// //       dispatch(setChassisNo(""));
// //     } catch (error) {
// //       console.error("Error deleting vehicle:", error);
// //       toast.error("خطا در حذف خودرو");
// //     }
// //   };

// //   const filteredVehicleList = existCars
// //     ? vehicles?.filter((v) => v.status === "in_stock")
// //     : (vehicles ?? []);

// //   return (
// //     <>
// //       <div className="flex justify-between items-center gap-2 my-4 mt-6">
// //         <h4 className="font-semibold text-gray-700">اطلاعات خودرو</h4>
// //         <div className="flex gap-6 items-center ml-3">
// //           <button
// //             onClick={() =>
// //               exportToExcel({ allDeals, filteredVehicleList, netProfit: 0 })
// //             }
// //             title="خروجی اکسل"
// //           >
// //             <FileDown className="w-6 h-6 text-gray-600" />
// //           </button>
// //           <Switch checked={existCars} onCheckedChange={setExistCars} />
// //         </div>
// //       </div>
// //       {vehiclesLoading ? (
// //         <div className="border border-gray-300 p-4 rounded-md w-full mt-7 text-center text-gray-500">
// //           در حال بارگذاری...
// //         </div>
// //       ) : (filteredVehicleList ?? []).length > 0 ? (
// //         <div className="border border-gray-300 p-4 rounded-md w-full mt-7">
// //           <div className="max-h-[33rem] overflow-y-auto rounded-md border w-full">
// //             <Table className="min-w-full table-fixed text-right border-collapse">
// //               <TableHeader className="top-0 sticky">
// //                 <TableRow className="hover:bg-transparent bg-gray-100">
// //                   <TableHead className="text-center w-12">ردیف</TableHead>
// //                   <TableHead className="text-center">شاسی</TableHead>
// //                   <TableHead className="text-center">مدل ماشین</TableHead>
// //                   <TableHead className="text-center">پلاک</TableHead>
// //                   <TableHead className="text-center">طرف اول</TableHead>
// //                   <TableHead className="text-center">طرف دوم</TableHead>
// //                   <TableHead className="text-center w-36">
// //                     کارگزار خرید
// //                   </TableHead>
// //                   <TableHead className="text-center w-36">
// //                     کارگزار فروش
// //                   </TableHead>
// //                   <TableHead className="text-center">مبلغ خرید</TableHead>
// //                   <TableHead className="text-center">مبلغ فروش</TableHead>
// //                   <TableHead className="text-center">آپشن</TableHead>
// //                   <TableHead className="text-center">هزینه</TableHead>
// //                   <TableHead className="text-center">سود خالص</TableHead>
// //                   <TableHead className="text-center">منشی</TableHead>
// //                   <TableHead className="text-center">مدارک</TableHead>
// //                   <TableHead className="text-center">عملیات</TableHead>
// //                 </TableRow>
// //               </TableHeader>
// //               <TableBody>
// //                 {(filteredVehicleList ?? []).map((vehicle, index) => {
// //                   const relatedDeal = getDealForVehicle(vehicle.vin);

// //                   // Note: We pass undefined for transactions here because we removed the hook call.
// //                   // To fix this properly, you need a 'useGetAllTransactions' hook and filter client-side.
// //                   // Without it, transaction-based costs will be 0.
// //                   const {netProfit} = calculateVehicleProfitPure(
// //                     relatedDeal,
// //                     undefined,
// //                   );
// //                   console.log("🚀 ~ VehicleList ~ netProfit:", netProfit)

// //                   const options = relatedDeal?.directCosts.options.reduce(
// //                     (sum, t) => sum + parseInt(t?.cost.toString() || "0"),
// //                     0,
// //                   );
// //                   const costs = relatedDeal?.directCosts.otherCost.reduce(
// //                     (sum, t) => sum + parseInt(t?.cost.toString() || "0"),
// //                     0,
// //                   );

// //                   const documentsStatus = Array.isArray(vehicle.documents)
// //                     ? vehicle.documents.length === 0
// //                       ? "فاقد مدارک"
// //                       : vehicle.documents.length >= 4
// //                         ? "کامل"
// //                         : "ناقص"
// //                     : (vehicle.documents ?? "—");

// //                   return (
// //                     <TableRow
// //                       key={`${vehicle._id}-${index}`}
// //                       className="has-data-[state=checked]:bg-muted/50"
// //                     >
// //                       <TableCell className="text-center">{index + 1}</TableCell>
// //                       <TableCell className="text-center">
// //                         {vehicle.vin || "—"}
// //                       </TableCell>
// //                       <TableCell className="text-center">
// //                         {vehicle.model || "—"}
// //                       </TableCell>
// //                       <TableCell className="text-center">
// //                         {vehicle?.plateNumber || "—"}
// //                       </TableCell>
// //                       <TableCell className="text-center">
// //                         {relatedDeal?.seller?.fullName || "—"}
// //                       </TableCell>
// //                       <TableCell className="text-center">
// //                         {relatedDeal?.buyer?.fullName || "—"}
// //                       </TableCell>
// //                       <TableCell className="text-center">
// //                         {relatedDeal?.purchaseBroker?.fullName || "—"} /{" "}
// //                         {relatedDeal?.purchaseBroker?.commissionPercent || "—"}
// //                       </TableCell>
// //                       <TableCell className="text-center">
// //                         {relatedDeal?.saleBroker?.fullName || "—"} /{" "}
// //                         {relatedDeal?.saleBroker?.commissionPercent || "—"}
// //                       </TableCell>
// //                       <TableCell
// //                         title={formatPrice(relatedDeal?.purchasePrice)}
// //                         className="text-center truncate"
// //                       >
// //                         {relatedDeal?.purchasePrice != null
// //                           ? formatPrice(relatedDeal.purchasePrice)
// //                           : "—"}
// //                       </TableCell>
// //                       <TableCell
// //                         title={formatPrice(relatedDeal?.salePrice)}
// //                         className="text-center truncate"
// //                       >
// //                         {relatedDeal?.salePrice != null
// //                           ? formatPrice(relatedDeal.salePrice)
// //                           : "—"}
// //                       </TableCell>
// //                       <TableCell
// //                         title={formatPrice(options)}
// //                         className="text-center truncate"
// //                       >
// //                         {formatPrice(options) || "—"}
// //                       </TableCell>
// //                       <TableCell
// //                         title={formatPrice(costs)}
// //                         className="text-center truncate"
// //                       >
// //                         {formatPrice(costs) || "—"}
// //                       </TableCell>
// //                       <TableCell className="text-center">
// //                         {formatPrice(netProfit || 0) || "—"}
// //                       </TableCell>
// //                       <TableCell
// //                         title={vehicle.SecretaryName}
// //                         className="text-center truncate"
// //                       >
// //                         {vehicle.SecretaryName || "—"}
// //                       </TableCell>
// //                       <TableCell className="text-center">
// //                         {documentsStatus}
// //                       </TableCell>
// //                       <TableCell className="text-center flex gap-3 items-center justify-center">
// //                         <Pencil
// //                           className="w-4 h-4 cursor-pointer hover:text-indigo-500"
// //                           onClick={() => {
// //                             handleEdit(vehicle);
// //                             dispatch(setChassisNo(vehicle.vin));
// //                           }}
// //                         />
// //                         <Trash
// //                           className="w-4 h-4 cursor-pointer hover:text-red-500"
// //                           onClick={() => handleDeleteClick(vehicle)}
// //                         />
// //                       </TableCell>
// //                     </TableRow>
// //                   );
// //                 })}
// //               </TableBody>
// //             </Table>
// //           </div>
// //         </div>
// //       ) : (
// //         <div className="border border-gray-300 p-4 rounded-md w-full mt-7 text-center text-gray-500">
// //           هیچ خودرویی یافت نشد
// //         </div>
// //       )}
// //       <VehicleFormModal
// //         open={isModalOpen}
// //         onOpenChange={setIsModalOpen}
// //         vehicleData={selectedVehicle as any}
// //         mode={modalMode}
// //       />
// //       {isDeleteModalOpen && (
// //         <DeleteModal
// //           isOpenDeleteModal={isDeleteModalOpen}
// //           setIsOpenDeleteModal={setIsDeleteModalOpen}
// //           handleConfirmDelete={handleConfirmDelete}
// //           setIdToDelete={setSelectedDealId}
// //           title="خودرو"
// //           deletePending={deleteVehicleMutation.isPending}
// //         />
// //       )}
// //     </>
// //   );
// // };
// // export default VehicleList;

"use client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { IDeal, IVehicle } from "@/types/new-backend-types";
import VehicleFormModal from "@/components/forms/vehicleFormModal";
import useGetAllDeals from "@/hooks/useGetAllDeals";
import { setChassisNo } from "@/redux/slices/carSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import DeleteModal from "@/components/modals/deleteModal";
import { useDeleteVehicle } from "@/apis/mutations/vehicle";
import { useDeleteWalletTransaction } from "@/apis/mutations/people";
import { useDeleteDeal } from "@/apis/mutations/deals";
import { Switch } from "../ui/switch";
import useGetVehicles from "@/hooks/useGetVehicle";
import VehicleRow from "./vehicleRow";
import { ExportExcelVehicleReport } from "./exportExcelVehicleReport";
import useGetTransactionByDealId from "@/hooks/useGetTransactionByDealId";

const VehicleList = () => {
  const { data: vehicles, isLoading: vehiclesLoading } = useGetVehicles();
  const { data: allDeals } = useGetAllDeals();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedDealId, setSelectedDealId] = React.useState<
    string | undefined
  >(undefined);
  const [selectedVehicle, setSelectedVehicle] = React.useState<IVehicle | null>(
    null,
  );
  const [modalMode, setModalMode] = React.useState<"add" | "edit">("add");
  const [existCars, setExistCars] = React.useState(false);

  const dispatch = useDispatch();
  const deleteVehicleMutation = useDeleteVehicle();
  const deleteDealById = useDeleteDeal();
  const queryClient = useQueryClient();
  const deleteWalletTransaction = useDeleteWalletTransaction();
  const getTransactionByDealId = useGetTransactionByDealId(selectedDealId);


  const getDealForVehicle = (vin: string | undefined): IDeal | undefined => {
    return (allDeals ?? []).find((el) => el.vehicleSnapshot?.vin === vin);
  };

  const handleEdit = (vehicle: IVehicle) => {
    setSelectedVehicle(vehicle);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDeleteClick = (vehicle: IVehicle) => {
    const relatedDeal = getDealForVehicle(vehicle.vin);
    setSelectedVehicle(vehicle);
    setSelectedDealId(relatedDeal?._id?.toString());
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedVehicle?._id) return;

    const relatedDeal = getDealForVehicle(selectedVehicle.vin);
    const hasTransactions = (getTransactionByDealId.data?.length ?? 0) > 0;

    const hasDirectCosts =
      (relatedDeal?.directCosts?.otherCost?.length ?? 0) > 0 ||
      (relatedDeal?.directCosts?.options?.length ?? 0) > 0;

    if (hasDirectCosts || hasTransactions) {
      toast.error(
        "این خودرو قابل حذف نیست، برای حذف ابتدا تراکنش‌های مربوط به این خودرو را حذف کنید",
      );
      return;
    }

    try {
      await deleteVehicleMutation.mutateAsync(selectedVehicle._id);
      queryClient.invalidateQueries({ queryKey: ["get-all-vehicles"] });
      setIsDeleteModalOpen(false);

      if (relatedDeal) {
        const deleteTx = async (personId: string | undefined) => {
          if (personId) {
            await deleteWalletTransaction.mutateAsync({
              id: personId,
              data: { dealID: selectedDealId ?? "", transactionID: "" },
            });
          }
        };

        await deleteTx(relatedDeal.buyer?.personId);
        await deleteTx(relatedDeal.seller?.personId);
        await deleteTx(relatedDeal.purchaseBroker?.personId);
        await deleteTx(relatedDeal.saleBroker?.personId);

        if (relatedDeal.partnerships) {
          await Promise.all(
            relatedDeal.partnerships.map((p) => deleteTx(p.partner.personId)),
          );
        }
      }

      if (selectedDealId) {
        await deleteDealById.mutateAsync(selectedDealId);
      }
      queryClient.invalidateQueries({
        queryKey: ["get-vehicles"],
      });

      dispatch(setChassisNo(""));
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("خطا در حذف خودرو");
    }
  };

  //   const handleConfirmDelete = async () => {
  //     if (!selectedVehicle?._id) return;
  //     const relatedDeal = (allDeals ?? []).find(
  //       (el) => el.vehicleSnapshot?.vin === selectedVehicle.vin,
  //     );
  //     const hasTransactions = (getTransactionByDealId.data?.length ?? 0) > 0;
  //     const hasDirectCosts =
  //       (relatedDeal?.directCosts?.otherCost?.length ?? 0) > 0 ||
  //       (relatedDeal?.directCosts?.options?.length ?? 0) > 0;
  //     if (hasTransactions || hasDirectCosts) {
  //       toast.error(
  //         "این خودرو قابل حذف نیست، برای حذف ابتدا تراکنش های مربوط به این خودرو را حذف کنید",
  //       );
  //       return;
  //     }

  //     try {
  //       await deleteVehicleMutation.mutateAsync(selectedVehicle._id);
  //       queryClient.invalidateQueries({ queryKey: ["get-all-vehicles"] });
  //       setIsDeleteModalOpen(false);
  //     } catch (error) {
  //       console.error("Error deleting vehicle:", error);
  //     }

  //     try {
  //       await deleteDealById.mutateAsync(selectedDealId ?? "");

  //       // queryClient.invalidateQueries({ queryKey: ["get-all-vehicles"] });
  //     } catch (error) {
  //       console.error("Error deleting vehicle:", error);
  //     }

  //     const deleteTransactions = async () => {
  //       try {
  //         await deleteWalletTransaction.mutateAsync({
  //           id: relatedDeal?.buyer.personId ?? "",
  //           data: {
  //             dealID: selectedDealId ?? "",
  //             transactionID: "",
  //           },
  //         });
  //       } catch (error) {
  //         console.error("Error deleting buyer transaction:", error);
  //       }

  //       try {
  //         await deleteWalletTransaction.mutateAsync({
  //           id: relatedDeal?.seller.personId ?? "",
  //           data: {
  //             dealID: selectedDealId ?? "",
  //             transactionID: "",
  //           },
  //         });
  //       } catch (error) {
  //         console.error("Error deleting seller transaction:", error);
  //       }

  //       try {
  //         relatedDeal?.partnerships.forEach(async (partnership) => {
  //           await deleteWalletTransaction.mutateAsync({
  //             id: partnership.partner.personId,
  //             data: {
  //               dealID: selectedDealId ?? "",
  //               transactionID: "",
  //             },
  //           });
  //         });
  //       } catch (error) {
  //         console.error("Error deleting partnership transaction:", error);
  //       }

  //       try {
  //         await deleteWalletTransaction.mutateAsync({
  //           id: relatedDeal?.purchaseBroker.personId ?? "",
  //           data: {
  //             dealID: selectedDealId ?? "",
  //             transactionID: "",
  //           },
  //         });
  //       } catch (error) {
  //         console.error("Error deleting purchase broker transaction:", error);
  //       }

  //       try {
  //         await deleteWalletTransaction.mutateAsync({
  //           id: relatedDeal?.saleBroker.personId ?? "",
  //           data: {
  //             dealID: selectedDealId ?? "",
  //             transactionID: "",
  //           },
  //         });
  //       } catch (error) {
  //         console.error("Error deleting sale broker transaction:", error);
  //       }
  //     };

  //     deleteTransactions();
  //     queryClient.invalidateQueries({
  //       queryKey: ["get-vehicles"],
  //     });

  //     dispatch(setChassisNo(""));

  //     // try {
  //     //   await deleteVehicleMutation.mutateAsync(selectedVehicle._id);
  //     //   setIsDeleteModalOpen(false);
  //     //   // setSelectedDealId(undefined);
  //     //   // setSelectedVehicle(null);
  //     //   queryClient.invalidateQueries({ queryKey: ["get-all-vehicles"] });

  //     //   await deleteWalletTransaction.mutateAsync({
  //     //     id: relatedDeal?.buyer.personId ?? "",
  //     //     data: {
  //     //       dealID: selectedDealId ?? "",
  //     //       transactionID: "",
  //     //     },
  //     //   });
  //     //   await deleteWalletTransaction.mutateAsync({
  //     //     id: relatedDeal?.seller.personId ?? "",
  //     //     data: {
  //     //       dealID: selectedDealId ?? "",
  //     //       transactionID: "",
  //     //     },
  //     //   });
  //     //   await deleteWalletTransaction.mutateAsync({
  //     //     id: relatedDeal?.partnerships ?? "",
  //     //     data: {
  //     //       dealID: selectedDealId ?? "",
  //     //       transactionID: "",
  //     //     },
  //     //   });
  //     //   await deleteWalletTransaction.mutateAsync({
  //     //     id: relatedDeal?.purchaseBroker.personId ?? "",
  //     //     data: {
  //     //       dealID: selectedDealId ?? "",
  //     //       transactionID: "",
  //     //     },
  //     //   });
  //     //   await deleteWalletTransaction.mutateAsync({
  //     //     id: relatedDeal?.saleBroker.personId ?? "",
  //     //     data: {
  //     //       dealID: selectedDealId ?? "",
  //     //       transactionID: "",
  //     //     },
  //     //   });
  //     // } catch (error) {
  //     //   console.error("Error deleting vehicle:", error);
  //     // }
  //   };

  const filteredVehicleList = existCars
    ? vehicles?.filter((v) => v.status === "in_stock")
    : (vehicles ?? []);

  //    const { data: dealsData, isLoading: isDealsLoading } = useGetDealsByVin(
  //   vin || "",
  // );

  //    const selectedDeal: IDeal | undefined = useMemo(() => {
  //         if (!dealsData) return undefined;
  //         const deals = Array.isArray(dealsData) ? dealsData : [dealsData];
  //         return deals.length > 0 ? deals[0] : undefined;
  //       }, [dealsData]);

  //       const dealId = selectedDeal?._id?.toString();

  //       const { data: transactionsData, isLoading: isTransactionsLoading } =
  //         useGetTransactionByDealId(dealId);

  //  const { data: dealsData, isLoading: isDealsLoading } = useGetDealsByVin(
  //     vin || "",
  //   );

  //   const selectedDeal: IDeal | undefined = useMemo(() => {
  //     if (!dealsData) return undefined;
  //     const deals = Array.isArray(dealsData) ? dealsData : [dealsData];
  //     return deals.length > 0 ? deals[0] : undefined;
  //   }, [dealsData]);

  //   const dealId = selectedDeal?._id?.toString();

  //   const { data: transactionsData, isLoading: isTransactionsLoading } =
  //     useGetTransactionByDealId(dealId);

  //   const transactions: ITransactionNew[] = transactionsData || [];

  return (
    <>
      <div className="flex justify-between items-center gap-2 my-4 mt-6">
        <h4 className="font-semibold text-gray-700">اطلاعات خودرو</h4>
        <div className="flex gap-6 items-center ml-3">
          {/* <button
            onClick={() =>
              exportToExcel({
                allDeals,
                filteredVehicleList,
              })
            }
            //  onClick={() =>
            //   exportToExcel({
            //     selectedDeal,
            //     filteredVehicleList,
            //     transactionsData
            //   })
            // }
            title="خروجی اکسل"
            className="cursor-pointer"
          >
            <FileDown className="w-6 h-6 text-gray-600" />
          </button> */}
          <ExportExcelVehicleReport
            allDeals={allDeals as IDeal[]}
            filteredVehicleList={filteredVehicleList}
          />
          <Switch checked={existCars} onCheckedChange={setExistCars} />
        </div>
      </div>

      {vehiclesLoading ? (
        <div className="border border-gray-300 p-4 rounded-md w-full mt-7 text-center text-gray-500">
          در حال بارگذاری...
        </div>
      ) : (filteredVehicleList ?? []).length > 0 ? (
        <div className="border border-gray-300 p-4 rounded-md w-full mt-7">
          <div className="max-h-[33rem] overflow-y-auto rounded-md border w-full">
            <Table className="min-w-full table-fixed text-right border-collapse">
              <TableHeader className="top-0 sticky">
                <TableRow className="hover:bg-transparent bg-gray-100">
                  <TableHead className="text-center w-12">ردیف</TableHead>
                  <TableHead className="text-center">شاسی</TableHead>
                  <TableHead className="text-center">مدل ماشین</TableHead>
                  <TableHead className="text-center">پلاک</TableHead>
                  <TableHead className="text-center">طرف اول</TableHead>
                  <TableHead className="text-center">طرف دوم</TableHead>
                  <TableHead className="text-center w-36">
                    کارگزار خرید
                  </TableHead>
                  <TableHead className="text-center w-36">
                    کارگزار فروش
                  </TableHead>
                  <TableHead className="text-center">مبلغ خرید</TableHead>
                  <TableHead className="text-center">مبلغ فروش</TableHead>
                  <TableHead className="text-center">آپشن</TableHead>
                  <TableHead className="text-center">هزینه</TableHead>
                  <TableHead className="text-center">سود خالص</TableHead>
                  <TableHead className="text-center">منشی</TableHead>
                  <TableHead className="text-center">مدارک</TableHead>
                  <TableHead className="text-center">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(filteredVehicleList ?? []).map((vehicle, index) => {
                  const relatedDeal = getDealForVehicle(vehicle.vin);

                  return (
                    <VehicleRow
                      key={`${vehicle._id}-${index}`}
                      vehicle={vehicle}
                      index={index}
                      relatedDeal={relatedDeal}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="border border-gray-300 p-4 rounded-md w-full mt-7 text-center text-gray-500">
          هیچ خودرویی یافت نشد
        </div>
      )}

      <VehicleFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        vehicleData={selectedVehicle}
        mode={modalMode}
      />
      {isDeleteModalOpen && (
        <DeleteModal
          isOpenDeleteModal={isDeleteModalOpen}
          setIsOpenDeleteModal={setIsDeleteModalOpen}
          handleConfirmDelete={handleConfirmDelete}
          setIdToDelete={setSelectedDealId}
          title="خودرو"
          deletePending={deleteVehicleMutation.isPending}
        />
      )}
    </>
  );
};

export default VehicleList;
