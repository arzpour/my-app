// "use client";
// // import { useGetCarByChassisNo } from "@/apis/mutations/cars";
// // import { useGetOperatorPercent } from "@/apis/mutations/detailsByChassisNo";
// import SearchableSelect from "@/components/ui/searchable-select";
// import useGetAllTransactions from "@/hooks/useGetAllTransaction";
// // import useGetAllCars from "@/hooks/useGetAllCars";
// // import useGetAllChassisNo from "@/hooks/useGetAllChassisNo";
// import useGetDealsByVin from "@/hooks/useGetDealsByVin";
// import useGetVehicles from "@/hooks/useGetVehicle";
// import useGetChequesByDealId from "@/hooks/useGetChequesByDealId";
// import useGetTransactionByDealId from "@/hooks/useGetTransactionByDealId";
// import { setChassisNo, setTotalVehicleCost } from "@/redux/slices/carSlice";
// import { RootState } from "@/redux/store";
// import React from "react";
// import { useDispatch, useSelector } from "react-redux";

// const Header = () => {
//   const { totalVehicleCost, chassisNo: chassisNoSaved } = useSelector(
//     (state: RootState) => state.cars
//   );
//   // const [selectedChassis, setSelectedChassis] =
//   //   React.useState<string>(chassisNoSaved);
//   // const [carInfo, setCarInfo] = React.useState<ICarRes | null>(null);
//   // const [operatorPercent, setOperatorPercent] =
//   //   React.useState<IOperatorPercent | null>(null);
//   // const [totalVehicleCostAmount, setTotalVehicleCostAmount] = React.useState<
//   //   number | null
//   // >(null);

//   // const { data: chassisNo } = useGetAllChassisNo();
//   // console.log("🚀 ~ Header ~ chassisNo:", chassisNo);\

//   // const { data: vin } = useGetAllVin();

//   // const { data: cars } = useGetAllCars();
//   // console.log("🚀 ~ Header ~ cars:", cars);

//   const { data: vehicles } = useGetVehicles();
//   console.log("🚀 ~ Header ~ vehicles:", vehicles);

//   // const getCarByChassisNo = useGetCarByChassisNo();
//   // console.log("🚀 ~ Header ~ getCarByChassisNo:", getCarByChassisNo);

//   // const getCarByChassisNo = vehicles?.find(
//   //   (vehicle) => vehicle.vin === chassisNoSaved
//   // );
//   // const getOperatorPercent = useGetOperatorPercent();
//   // console.log("🚀 ~ Header ~ getOperatorPercent:", getOperatorPercent);

//   const vin = vehicles?.map((vehicle) => vehicle.vin);
//   console.log("🚀 ~ Header ~ vin:", vin);

//   const getDealsByVin = useGetDealsByVin(chassisNoSaved);
//   console.log("🚀 ~ Header ~ getDealsByVin:", getDealsByVin.data);
//   const deals = getDealsByVin.data;

//   // const getAllTransactions = useGetAllTransactions();
//   // console.log("🚀 ~ Header ~ getAllTransactions:", getAllTransactions);

//   // const getTransactionsByDeal =
//   // const getDetailByChassisNo = useGetDetailByChassisNo();
//   // console.log("🚀 ~ Header ~ getDetailByChassisNo:", getDetailByChassisNo)

//   const getTransactionByDealId = useGetTransactionByDealId(
//     deals?._id.toString()
//   );
//   console.log(
//     "🚀 ~ Header ~ getTransactionByDealId:",
//     getTransactionByDealId.data
//   );
//   const transactions = getTransactionByDealId.data;

//   const getChequesByDealId = useGetChequesByDealId(deals?._id.toString());
//   console.log("🚀 ~ Header ~ getChequesByDealId:", getChequesByDealId.data);
//   const cheques = getChequesByDealId.data;

//   const dispatch = useDispatch();

//   const handleSelectChassis = async () => {
//     // setSelectedChassis(chassisNo);
//     dispatch(setChassisNo(deals?.vehicleSnapshot.vin ?? chassisNoSaved));
//     try {
//       // const res = await getCarByChassisNo.mutateAsync(chassisNo);
//       // const percents = await getOperatorPercent.mutateAsync();
//       // console.log("🚀 ~ handleSelectChassis ~ percents:", percents);
//       // setOperatorPercent(percents);
//       // setCarInfo(res);
//     } catch (error) {
//       console.log("🚀 ~ handleSelectChassis ~ error:", error);
//       // setCarInfo(null);
//     }
//   };

//   const normalize = (str?: string) =>
//     str ? str.trim().toLowerCase().replace(/\s+/g, " ") : "";

//   // ============================================
//   // CALCULATION FORMULAS
//   // ============================================

//   // 1. هزینه های جانبی (Other Costs)
//   // Sum of directCosts.otherCost + transactions where reason matches otherCost categories
//   const otherCostCategories =
//     deals?.directCosts?.otherCost?.map((cost) => cost.category) || [];
//   const otherCostsFromDirectCosts =
//     deals?.directCosts?.otherCost?.reduce(
//       (sum, cost) => sum + (cost.cost || 0),
//       0
//     ) || 0;
//   const otherCostsFromTransactions =
//     transactions
//       ?.filter(
//         (t) =>
//           t.type === "پرداخت" &&
//           otherCostCategories.some((category) => t.reason === category)
//       )
//       .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
//   const totalOtherCosts =
//     otherCostsFromDirectCosts + otherCostsFromTransactions;

//   // 2. سود ناخالص (Gross Profit): تفاضل مبلغ خرید و مبلغ فروش
//   // Formula: salePrice - purchasePrice
//   let grossProfit: number | null = null;
//   if (deals?.purchasePrice && deals?.salePrice) {
//     grossProfit = deals.salePrice - deals.purchasePrice;
//   }

//   // 3. درصد کارگزاران (Broker Commissions)
//   // Formula: (سود ناخالص - مجموع هزینه ها) * درصد کارگزار
//   let buyAmountWithPercent: number | null = null;
//   let sellAmountWithPercent: number | null = null;
//   const buyPercent = deals?.purchaseBroker?.commissionPercent
//     ? parseFloat(String(deals.purchaseBroker.commissionPercent)) * 100
//     : 0;
//   const sellPercent = deals?.saleBroker?.commissionPercent
//     ? parseFloat(String(deals.saleBroker.commissionPercent)) * 100
//     : 0;

//   if (grossProfit !== null) {
//     const amountWithoutPercent = grossProfit - totalOtherCosts;
//     buyAmountWithPercent =
//       amountWithoutPercent *
//       parseFloat(String(deals?.purchaseBroker?.commissionPercent || 0));
//     sellAmountWithPercent =
//       amountWithoutPercent *
//       parseFloat(String(deals?.saleBroker?.commissionPercent || 0));
//   }

//   // 4. سود خالص (Net Profit)
//   // Formula: سود ناخالص - (مجموع هزینه + مجموع درصد کارگزاران)
//   let netProfit: number | null = null;
//   if (grossProfit !== null) {
//     const totalBrokerCommissions =
//       (buyAmountWithPercent || 0) + (sellAmountWithPercent || 0);
//     netProfit = grossProfit - (totalOtherCosts + totalBrokerCommissions);
//   }

//   // 5. وضعیت تسویه حساب با طرف اول (Seller Settlement Status)
//   // Formula: (مجموع مبالغ پرداختی به طرف اول + مجموع مبالغ چک های صادره پاس شده)
//   // Compare with purchasePrice
//   const sellerPersonId = deals?.seller?.personId?.toString();
//   const paymentsToSeller =
//     transactions
//       ?.filter(
//         (t) => t.type === "پرداخت" && t.personId?.toString() === sellerPersonId
//       )
//       .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
//   const issuedPaidCheques =
//     cheques
//       ?.filter(
//         (c) =>
//           c.type === "issued" &&
//           c.status === "paid" &&
//           c.payer?.personId?.toString() === sellerPersonId
//       )
//       .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;
//   const totalPaidToSeller = paymentsToSeller + issuedPaidCheques;
//   const sellerSettlementAmount = deals?.purchasePrice || 0;
//   const sellerSettlementStatus =
//     totalPaidToSeller === sellerSettlementAmount
//       ? "تسویه شده"
//       : totalPaidToSeller < sellerSettlementAmount
//       ? "بدهکار"
//       : "بستانکار";

//   // 6. وضعیت تسویه حساب با طرف دوم (Buyer Settlement Status)
//   // Formula: (مجموع مبالغ دریافتی از طرف دوم + مجموع مبالغ چک های وارده پاس شده)
//   // Compare with salePrice
//   const buyerPersonId = deals?.buyer?.personId?.toString();
//   const receiptsFromBuyer =
//     transactions
//       ?.filter(
//         (t) => t.type === "دریافت" && t.personId?.toString() === buyerPersonId
//       )
//       .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
//   const receivedPaidCheques =
//     cheques
//       ?.filter(
//         (c) =>
//           c.type === "received" &&
//           c.status === "paid" &&
//           c.payee?.personId?.toString() === buyerPersonId
//       )
//       .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;
//   const totalReceivedFromBuyer = receiptsFromBuyer + receivedPaidCheques;
//   const buyerSettlementAmount = deals?.salePrice || 0;
//   const buyerSettlementStatus =
//     totalReceivedFromBuyer === buyerSettlementAmount
//       ? "تسویه شده"
//       : totalReceivedFromBuyer < buyerSettlementAmount
//       ? "بستانکار"
//       : "بدهکار";

//   // const handleCarDetailDataByChassisNoData = async (chassisNo: string) => {
//   //   if (!chassisNo) return;
//   //   try {
//   //     const details = await getDetailByChassisNo.mutateAsync(chassisNo);

//   //     const paidTransactions = details?.transactions?.filter(
//   //       (t) => t.TransactionType === "پرداخت"
//   //     );

//   //     const totalVehicleCost = paidTransactions
//   //       ?.filter(
//   //         (item) =>
//   //           item?.TransactionReason?.replace(/\s/g, "").includes(
//   //             "هزینهوسیله"
//   //           ) ||
//   //           item?.TransactionReason?.replace(/\s/g, "").includes("هزينهوسیله")
//   //       )
//   //       ?.reduce((sum, item) => sum + (item.TransactionAmount || 0), 0);

//   //     dispatch(setTotalVehicleCost(totalVehicleCost));
//   //     setTotalVehicleCostAmount(totalVehicleCost);
//   //   } catch (error) {
//   //     console.log("🚀 ~ handleSelectChassis ~ error:", error);
//   //     setTotalVehicleCostAmount(null);
//   //   }
//   // };

//   React.useEffect(() => {
//     // const initialChassis = chassisNoSaved;
//     // if (initialChassis) {
//     handleSelectChassis();
//     // }
//   }, [chassisNoSaved]);

//   React.useEffect(() => {
//     // handleCarDetailDataByChassisNoData(chassisNoSaved);
//   }, [chassisNoSaved]);

//   return (
//     <div className="border border-b-2 border-gray-300 rounded flex flex-col gap-2 p-4 pb-2.5 relative">
//       <div className="grid grid-cols-9 gap-3 auto-rows-min items-start justify-start place-items-stretch">
//         <div className="flex flex-col justify-between h-full space-y-1">
//           <h3 className="text-sm font-bold mb-2 text-blue-900">شاسی:</h3>
//           <SearchableSelect
//             value={chassisNoSaved}
//             onValueChange={handleSelectChassis}
//             options={vin ?? []}
//             placeholder="انتخاب شاسی"
//             className="w-[120px] text-sm"
//             searchPlaceholder="جستجوی شماره شاسی..."
//           />
//         </div>
//         <div className="flex flex-col justify-between h-full space-y-1">
//           <h3 className="text-sm text-blue-900 font-bold">مدل وسیله نقلیه</h3>
//           <h4 className="text-sm">{deals?.vehicleSnapshot.model ?? "—"}</h4>
//           <span className="text-xs text-green-600">
//             {deals?.vehicleSnapshot.plateNumber ?? "—"}
//           </span>
//         </div>
//         <div className="flex flex-col justify-between h-full space-y-1">
//           <h3 className="text-sm text-blue-900 font-bold">مبلغ خرید</h3>
//           <h4 className="text-sm">
//             {deals?.purchasePrice?.toLocaleString("en-US") ?? "—"}
//           </h4>
//           <span className="text-sm text-blue-500">
//             {deals?.purchaseDate ?? "—"}
//           </span>
//         </div>
//         <div className="flex flex-col justify-between h-full space-y-1">
//           <h3 className="text-sm text-blue-900 font-bold">مبلغ فروش</h3>
//           <h4 className="text-sm">
//             {deals?.salePrice?.toLocaleString("en-US") ?? "—"}
//           </h4>
//           <span className="text-sm text-blue-500">
//             {deals?.saleDate ?? "—"}
//           </span>
//         </div>
//         <div className="flex gap-2 items-right items-center text-sm">
//           <p className="text-sm text-blue-800">مجموع هزینه ها:</p>
//           <p className="text-sm text-orange-800">
//             {totalOtherCosts.toLocaleString("en-US")}
//           </p>
//         </div>
//         {/* <div className="flex flex-col justify-between h-full space-y-1">
//           <h3 className="text-sm text-blue-900 font-bold">سود:</h3>
//           <p className="text-sm text-green-700">
//             ناخالص:{" "}
//             <strong className="line-through text-black text-sm"> */}
//         {/* {carInfo ? carInfo.SaleAmount - carInfo.PurchaseAmount : "—"} */}
//         {/* {grossProfit?.toLocaleString("en-US") ?? "—"}
//             </strong>
//           </p>
//           <p className="text-sm text-green-700">
//             خالص:{" "}
//             <strong className="text-black text-sm"> */}
//         {/* {carInfo ? carInfo.SaleAmount - carInfo.PurchaseAmount : "—"} */}
//         {/* {netProfit?.toLocaleString("en-US") ?? "—"}
//             </strong>
//           </p>
//         </div> */}
//         <div className="flex flex-col justify-between h-full space-y-1">
//           <h3 className="text-sm text-blue-900 font-bold">
//             کارگزار خرید:{" "}
//             <span className="text-green-700 text-xs">
//               {buyPercent.toFixed(2)}%
//             </span>
//           </h3>
//           <p className="text-sm">{deals?.purchaseBroker?.fullName ?? "-"}</p>
//           <p className="text-sm text-green-700 font-bold">
//             {buyAmountWithPercent?.toLocaleString("en-US") ?? "—"}
//           </p>
//         </div>
//         <div className="flex flex-col justify-between h-full space-y-1">
//           <h3 className="text-sm text-blue-900 font-bold">
//             کارگزار فروش:{" "}
//             <span className="text-green-700 text-xs">
//               {sellPercent.toFixed(2)}%
//             </span>
//           </h3>
//           <p className="text-sm">{deals?.saleBroker?.fullName ?? "-"}</p>
//           <p className="text-sm text-green-700 font-bold">
//             {sellAmountWithPercent?.toLocaleString("en-US") ?? "—"}
//           </p>
//         </div>
//         <div className="flex flex-col justify-between h-full space-y-1">
//           <h3 className="text-sm text-blue-900 font-bold">
//             طرف اول: <span></span>
//           </h3>
//           <p className="text-sm">{deals?.seller.fullName ?? "-"}</p>
//           <p className="text-sm text-orange-500">
//             {deals?.seller.mobile ?? "-"}
//           </p>
//         </div>
//         <div className="flex flex-col justify-between h-full space-y-1">
//           <h3 className="text-sm text-blue-900 font-bold">
//             طرف دوم: <span></span>
//           </h3>
//           <p className="text-sm">{deals?.buyer.fullName ?? "-"}</p>
//           <p className="text-sm text-orange-500">
//             {deals?.buyer.mobile ?? "-"}
//           </p>
//         </div>
//       </div>
//       <hr />
//       <div className="grid grid-cols-5 gap-8 items-center justify-start place-items-stretch">
//         <div className="flex gap-2 items-right items-baseline text-sm">
//           <p className="text-sm">وضعیت خودرو:</p>
//           <p className="px-7 bg-green-400 text-red-900 rounded py-1 text-sm">
//             فروخته شد
//           </p>
//         </div>
//         {/* <div className="flex gap-2 items-right items-center text-sm">
//           <p className="text-sm text-blue-800">سایر هزینه ها:</p>
//           <p className="text-sm text-purple-700">هزینه وسیله</p>
//         </div> */}
//         {/* <div className="flex flex-col justify-between h-full space-y-1">
//           <h3 className="text-sm text-blue-900 font-bold">سود:</h3>
//           <p className="text-sm text-green-700">
//             ناخالص:{" "}
//             <strong className="line-through text-black text-sm"> */}
//         {/* {carInfo ? carInfo.SaleAmount - carInfo.PurchaseAmount : "—"} */}
//         {/* {grossProfit?.toLocaleString("en-US") ?? "—"}
//             </strong>
//           </p>
//           <p className="text-sm text-green-700">
//             خالص:{" "}
//             <strong className="text-black text-sm"> */}
//         {/* {carInfo ? carInfo.SaleAmount - carInfo.PurchaseAmount : "—"} */}
//         {/* {netProfit?.toLocaleString("en-US") ?? "—"}
//             </strong>
//           </p>
//         </div> */}

//         {/* <div className="flex gap-4 justify-between h-full space-y-1"> */}
//         {/* <h3 className="text-sm text-blue-900 font-bold">سود:</h3> */}
//         <p className="text-sm text-green-700">
//           سود ناخالص:{" "}
//           <strong className="line-through text-black text-sm">
//             {/* {carInfo ? carInfo.SaleAmount - carInfo.PurchaseAmount : "—"} */}
//             {grossProfit?.toLocaleString("en-US") ?? "—"}
//           </strong>
//         </p>
//         <p className="text-sm text-green-700">
//           سود خالص:{" "}
//           <strong className="text-black text-sm">
//             {/* {carInfo ? carInfo.SaleAmount - carInfo.PurchaseAmount : "—"} */}
//             {netProfit?.toLocaleString("en-US") ?? "—"}
//           </strong>
//         </p>
//         {/* </div> */}
//         <div className="flex gap-2 items-right items-baseline text-sm">
//           <p className="text-sm text-blue-800">وضعیت تسویه حساب با طرف اول:</p>
//           <p
//             className={`px-7 rounded py-1 text-sm ${
//               sellerSettlementStatus === "تسویه شده"
//                 ? "bg-green-400 text-green-900"
//                 : sellerSettlementStatus === "بدهکار"
//                 ? "bg-red-400 text-red-900"
//                 : "bg-yellow-400 text-yellow-900"
//             }`}
//           >
//             {sellerSettlementStatus}
//           </p>
//         </div>

//         <div className="flex gap-2 items-right items-baseline text-sm">
//           <p className="text-sm text-blue-800">وضعیت تسویه حساب با طرف دوم:</p>
//           <p
//             className={`px-7 rounded py-1 text-sm ${
//               buyerSettlementStatus === "تسویه شده"
//                 ? "bg-green-400 text-green-900"
//                 : buyerSettlementStatus === "بستانکار"
//                 ? "bg-yellow-400 text-yellow-900"
//                 : "bg-red-400 text-red-900"
//             }`}
//           >
//             {buyerSettlementStatus}
//           </p>
//         </div>
//       </div>
//       <p className="absolute right-2 -top-6 bg-white py-2 px-4 font-bold">
//         اطلاعات خودرو
//       </p>
//     </div>
//   );
// };

// export default Header;
