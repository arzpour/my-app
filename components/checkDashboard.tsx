// // "use client";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import React, { useMemo } from "react";
// // import SelectForFilterCheques from "./selectForFilterCheques";
// // import PersianDatePicker from "./global/persianDatePicker";
// // import { Minus, Plus } from "lucide-react";
// // import { useGetChequesByVin } from "@/apis/mutations/cheques";
// // import { IChequeNew } from "@/types/new-backend-types";
// // import { RootState } from "@/redux/store";
// // import { useSelector } from "react-redux";
// // import useGetAllCheques from "@/hooks/useGetAllCheques";

// // // const parsePersianDate = (date: string) => {
// // //   if (!date) return 0;
// // //   const parts = date.split("/");
// // //   const eng = parts.map((p) =>
// // //     p.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
// // //   );
// // //   return Number(eng.join(""));
// // // };

// // const CheckDashboard = () => {
// //   const [showFilter, setShowFilter] = React.useState(false);
// //   const [selectedChequeSerial, setSelectedChequeSerial] = React.useState("همه");
// //   const [selectedSayadiId, setSelectedSayadiId] = React.useState("همه");
// //   const [selectedCustomerType, setSelectedCustomerType] = React.useState("همه");
// //   const [selectedCustomerName, setSelectedCustomerName] = React.useState("همه");
// //   const [selectedNationalID, setSelectedNationalID] = React.useState("همه");
// //   const [selectedBank, setSelectedBank] = React.useState("همه");
// //   const [selectedBranch, setSelectedBranch] = React.useState("همه");
// //   const [selectedChequeStatus, setSelectedChequeStatus] = React.useState("همه");
// //   const [selectedOperationType, setSelectedOperationType] =
// //     React.useState("همه");
// //   const [fromDate, setFromDate] = React.useState(""); // YYYY/MM/DD
// //   const [toDate, setToDate] = React.useState(""); // YYYY/MM/DD
// //   const [maxAmount, setMaxAmount] = React.useState<number | undefined>();
// //   // const [cheques, setCheques] = React.useState<IChequeNew[]>([]);

// //   const { chassisNo } = useSelector((state: RootState) => state.cars);

// //   const { data: allCheques } = useGetAllCheques();
// //   console.log("🚀 ~ CheckDashboard ~ allCheques:", allCheques);
// //   // const getChequesByVin = useGetChequesByVin();

// //   // const getChequesByVinHandler = async () => {
// //   //   if (!chassisNo) return;
// //   //   try {
// //   //     const cheques = await getChequesByVin.mutateAsync(chassisNo);
// //   //     setCheques(cheques);
// //   //   } catch (error) {
// //   //     console.log("🚀 ~ getChequesByVinHandler ~ error:", error);
// //   //   }
// //   // };

// //   const cheques = allCheques?.filter((cheque) => cheque.vin === chassisNo);
// //   const issuedCheques = cheques?.filter((cheque) => cheque.type === "صادره");
// //   const importedCheques = cheques?.filter((cheque) => cheque.type === "وارده");

// //   const sayadiIDOptions = Array.from(
// //     new Set(cheques?.map((cheque) => cheque.sayadiID))
// //   );
// //   const chequeNumberOptions = Array.from(
// //     new Set(cheques?.map((cheque) => cheque.chequeNumber?.toString()))
// //   );
// //   const bankNameOptions = Array.from(
// //     new Set(cheques?.map((cheque) => cheque.bankName))
// //   );
// //   const branchNameOptions = Array.from(
// //     new Set(cheques?.map((cheque) => cheque.branchName))
// //   );

// //   const getOptions = (key: string) => {
// //     const values = cheques?.map((d: any) => d[key] ?? "") ?? [];
// //     const uniqueValues = Array.from(new Set(values.filter(Boolean)));
// //     return ["همه", ...uniqueValues];
// //   };

// //   const chequeSerialOptions = getOptions("ChequeSerial").filter(Boolean);
// //   const sayadiIdOptions = getOptions("SayadiID").filter(Boolean);
// //   const customerTypeOptions = getOptions("ChequeType").filter(Boolean);
// //   const customerNameOptions = getOptions("CustomerName")
// //     .concat(getOptions("ShowroomAccountCard"))
// //     .filter(Boolean);
// //   const nationalIDOptions = getOptions("CustomerNationalID")
// //     .concat(getOptions("AccountHolderNationalID"))
// //     .filter(Boolean);
// //   const bankOptions = getOptions("Bank").filter(Boolean);
// //   const branchOptions = getOptions("Branch").filter(Boolean);
// //   const chequeStatusOptions = getOptions("ChequeStatus").filter(Boolean);
// //   const operationTypeOptions = getOptions("LastAction").filter(Boolean);

// //   const filteredData = useMemo(() => {
// //     return cheques?.filter((item) => {
// //       if (
// //         selectedChequeSerial !== "همه" &&
// //         item.chequeNumber?.toString() !== selectedChequeSerial
// //       )
// //         return false;
// //       if (selectedSayadiId !== "همه" && item.sayadiID !== selectedSayadiId)
// //         return false;
// //       if (selectedCustomerType !== "همه" && item.type !== selectedCustomerType)
// //         return false;
// //       if (
// //         selectedCustomerName !== "همه" &&
// //         // (item.CustomerName ?? item.ShowroomAccountCard) !== selectedCustomerName
// //         (item.payer?.fullName ?? item.payee?.fullName) !== selectedCustomerName
// //       )
// //         return false;
// //       if (
// //         selectedNationalID !== "همه" &&
// //         // (item.CustomerNationalID ?? item.AccountHolderNationalID) !==
// //         //   selectedNationalID
// //         (item.payer?.nationalId ?? item.payee?.nationalId) !==
// //           selectedNationalID
// //       )
// //         return false;
// //       if (selectedBank !== "همه" && (item.bankName ?? "") !== selectedBank)
// //         return false;
// //       if (
// //         selectedBranch !== "همه" &&
// //         (item.branchName ?? "") !== selectedBranch
// //       )
// //         return false;
// //       if (
// //         selectedChequeStatus !== "همه" &&
// //         (item.status ?? "") !== selectedChequeStatus
// //       )
// //         return false;
// //       if (
// //         selectedOperationType !== "همه" &&
// //         // (item.LastAction ?? "") !== selectedOperationType
// //         (item.actions[item.actions.length - 1]?.actionType ?? "") !==
// //           selectedOperationType
// //       )
// //         return false;
// //       if (maxAmount !== undefined && item.amount > maxAmount) return false;
// //       if (fromDate && item.dueDate < fromDate) return false;
// //       if (toDate && item.dueDate > toDate) return false;
// //       return true;
// //     });
// //   }, [
// //     cheques,
// //     selectedChequeSerial,
// //     selectedSayadiId,
// //     selectedCustomerType,
// //     selectedCustomerName,
// //     selectedNationalID,
// //     selectedBank,
// //     selectedBranch,
// //     selectedChequeStatus,
// //     selectedOperationType,
// //     maxAmount,
// //     fromDate,
// //     toDate,
// //   ]);

// //   const issued = useMemo(
// //     () => filteredData?.filter((item) => item.type === "صادره"),
// //     [filteredData]
// //   );
// //   const imported = useMemo(
// //     () => filteredData?.filter((item) => item.type === "وارده"),
// //     [filteredData]
// //   );

// //   // const totalIssuedAmount = issued?.reduce((sum, t) => sum + t.amount, 0);
// //   // const totalImportedAmount = imported?.reduce((sum, t) => sum + t.amount, 0);

// //   const handleResetFilters = () => {
// //     setSelectedChequeSerial("همه");
// //     setSelectedSayadiId("همه");
// //     setSelectedCustomerType("همه");
// //     setSelectedCustomerName("همه");
// //     setSelectedNationalID("همه");
// //     setSelectedBank("همه");
// //     setSelectedBranch("همه");
// //     setSelectedChequeStatus("همه");
// //     setSelectedOperationType("همه");
// //     setFromDate("");
// //     setToDate("");
// //     setMaxAmount(undefined);
// //   };

// //   const stats = useMemo(() => {
// //     const now = new Date();
// //     const currentMonth = now.getMonth() + 1;
// //     const currentYear = now.getFullYear();
// //     const pending =
// //       filteredData?.filter((i) => i.status !== "وصول شد")?.length || 0;
// //     const returned =
// //       filteredData?.filter((i) => i.status === "برگشتی")?.length || 0;
// //     const importedThisMonth =
// //       imported?.filter((i) => {
// //         const [year, month] = i.dueDate.split("/").map(Number);
// //         return year === currentYear && month === currentMonth;
// //       })?.length || 0;
// //     const issuedThisMonth =
// //       issued?.filter((i) => {
// //         const [year, month] = i.dueDate.split("/").map(Number);
// //         return year === currentYear && month === currentMonth;
// //       })?.length || 0;
// //     const totalIssuedAmount = filteredData?.reduce(
// //       (sum, t) => sum + (t.type === "صادره" ? t.amount : 0),
// //       0
// //     );
// //     const totalIssuedPendingAmount = filteredData
// //       ?.filter((i) => i.type === "صادره" && i.status === "وصول نشده")
// //       ?.reduce((sum, t) => sum + t.amount, 0);
// //     const totalIssuedPaidAmount = filteredData
// //       ?.filter((i) => i.type === "صادره" && i.status === "وصول شده")
// //       ?.reduce((sum, t) => sum + t.amount, 0);

// //     const totalImportedAmount = filteredData?.reduce(
// //       (sum, t) => sum + (t.type === "وارده" ? t.amount : 0),
// //       0
// //     );
// //     const totalImportedPendingAmount = filteredData
// //       ?.filter((i) => i.type === "وارده" && i.status === "وصول نشده")
// //       ?.reduce((sum, t) => sum + t.amount, 0);
// //     const totalImportedPaidAmount = filteredData
// //       ?.filter((i) => i.type === "وارده" && i.status === "وصول شده")
// //       ?.reduce((sum, t) => sum + t.amount, 0);

// //     const totalIssuedReturnedAmount = filteredData
// //       ?.filter((i) => i.type === "صادره" && i.status === "برگشتی")
// //       ?.reduce((sum, t) => sum + t.amount, 0);
// //     const totalImportedReturnedAmount = filteredData
// //       ?.filter((i) => i.type === "وارده" && i.status === "برگشتی")
// //       ?.reduce((sum, t) => sum + t.amount, 0);

// //     return {
// //       pending,
// //       returned,
// //       importedThisMonth,
// //       issuedThisMonth,
// //       totalIssuedAmount,
// //       totalIssuedPendingAmount,
// //       totalIssuedPaidAmount,
// //       totalImportedAmount,
// //       totalImportedPendingAmount,
// //       totalImportedPaidAmount,
// //       totalIssuedReturnedAmount,
// //       totalImportedReturnedAmount,
// //     };
// //   }, [filteredData, imported, issued]);

// //   // React.useEffect(() => {
// //   //   getChequesByVinHandler();
// //   // }, [chassisNo]);

// //   return (
// //     <div>
// //       <button
// //         onClick={() => setShowFilter(!showFilter)}
// //         className="flex justify-end w-full"
// //       >
// //         {showFilter ? (
// //           <Minus className="cursor-pointer" />
// //         ) : (
// //           <Plus className="cursor-pointer" />
// //         )}
// //       </button>
// //       {showFilter && (
// //         // <div className="grid [grid-template-columns:1fr_1fr_1fr_0.5fr_0.5fr] gap-6 items-start justify-start mt-4">
// //         <div className="flex gap-9 items-start justify-start mt-4">
// //           <div className="space-y-6 min-w-[140px] w-[340px]">
// //             <div className="border border-gray-300 p-4 rounded-md relative h-[7rem]">
// //               <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
// //                 اطلاعات چک
// //               </p>

// //               <div className="flex gap-4 overflow-auto min-w-[140px] scrollbar-hide">
// //                 <SelectForFilterCheques
// //                   // data={chequeSerialOptions.filter(Boolean)}
// //                   data={["همه", ...chequeNumberOptions.filter(Boolean)]}
// //                   title="سریال چک"
// //                   setSelectedSubject={setSelectedChequeSerial}
// //                   selectedValue={selectedChequeSerial}
// //                 />
// //                 <SelectForFilterCheques
// //                   // data={sayadiIdOptions.filter(Boolean)}
// //                   data={["همه", ...sayadiIDOptions.filter(Boolean)]}
// //                   title="شناسه صیادی"
// //                   setSelectedSubject={setSelectedSayadiId}
// //                   selectedValue={selectedSayadiId}
// //                 />
// //               </div>
// //             </div>
// //             <div className="border border-gray-300 p-4 rounded-md relative h-[7rem]">
// //               <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
// //                 نوع تاریخ / مبلغ
// //               </p>
// //               <div className="flex gap-4 items-center overflow-auto min-w-[140px] scrollbar-hide">
// //                 <div className="space-y-1">
// //                   <h3 className="text-sm font-bold mb-2 text-blue-900">
// //                     حداکثر مبلغ:
// //                   </h3>
// //                   <input type="text" className="border rounded w-[130px]" />
// //                 </div>
// //                 <SelectForFilterCheques
// //                   data={["غیرفعال", "فعال"]}
// //                   title="نوع عملیات تاریخ"
// //                   selectedValue="غیرفعال"
// //                 />
// //               </div>
// //             </div>
// //           </div>
// //           <div className="space-y-6 min-w-[140px] w-[340px]">
// //             <div className="border border-gray-300 p-4 rounded-md relative h-[7rem]">
// //               <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
// //                 اطلاعات مشتری/صاحب چک
// //               </p>

// //               <div className="flex gap-4 overflow-auto min-w-[140px]">
// //                 <SelectForFilterCheques
// //                   data={customerTypeOptions.filter(Boolean)}
// //                   title="نوع کاربر"
// //                   setSelectedSubject={setSelectedCustomerType}
// //                   selectedValue={selectedCustomerType}
// //                 />
// //                 <SelectForFilterCheques
// //                   data={customerNameOptions.filter(Boolean)}
// //                   title="نام و نام خانوادگی"
// //                   setSelectedSubject={setSelectedCustomerName}
// //                   selectedValue={selectedCustomerName}
// //                 />
// //                 <SelectForFilterCheques
// //                   data={nationalIDOptions.filter(Boolean)}
// //                   title="کدملی"
// //                   setSelectedSubject={setSelectedNationalID}
// //                   selectedValue={selectedNationalID}
// //                 />
// //               </div>
// //             </div>{" "}
// //             <div className="border border-gray-300 p-4 rounded-md relative h-[7rem]">
// //               <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
// //                 بازه زمانی
// //               </p>
// //               <div className="flex gap-4 overflow-auto min-w-[140px]">
// //                 <div className="space-y-1">
// //                   <h3 className="text-sm font-bold mb-2 text-purple-700">
// //                     از تاریخ:
// //                   </h3>
// //                   <PersianDatePicker
// //                     value={fromDate}
// //                     onChange={(date) => setFromDate(date)}
// //                     placeholder="از تاریخ"
// //                   />
// //                 </div>

// //                 <div className="space-y-1">
// //                   <h3 className="text-sm font-bold mb-2 text-purple-700">
// //                     تا تاریخ:
// //                   </h3>
// //                   <PersianDatePicker
// //                     value={toDate}
// //                     onChange={(date) => setToDate(date)}
// //                     placeholder="تا تاریخ"
// //                   />
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //           <div className="space-y-6 min-w-[140px] w-[340px]">
// //             <div className="border border-gray-300 p-4 rounded-md relative h-[7rem]">
// //               <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
// //                 اطلاعات بانک
// //               </p>
// //               <div className="flex overflow-auto min-w-[140px] gap-4">
// //                 <SelectForFilterCheques
// //                   // data={bankOptions.filter(Boolean)}
// //                   data={["همه", ...bankNameOptions.filter(Boolean)]}
// //                   title="بانک"
// //                   setSelectedSubject={setSelectedBank}
// //                   selectedValue={selectedBank}
// //                 />

// //                 <SelectForFilterCheques
// //                   // data={branchOptions.filter(Boolean)}
// //                   data={["همه", ...branchNameOptions.filter(Boolean)]}
// //                   title="شعبه"
// //                   setSelectedSubject={setSelectedBranch}
// //                   selectedValue={selectedBranch}
// //                 />
// //               </div>
// //             </div>
// //             <div className="border border-gray-300 p-4 rounded-md relative h-[7rem]">
// //               <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
// //                 وضعیت و عملیات انجام شده
// //               </p>
// //               <div className="flex overflow-auto min-w-[140px] gap-4">
// //                 <SelectForFilterCheques
// //                   data={chequeStatusOptions.filter(Boolean)}
// //                   title="وضعیت چک"
// //                   setSelectedSubject={setSelectedChequeStatus}
// //                   selectedValue={selectedChequeStatus}
// //                 />
// //                 <SelectForFilterCheques
// //                   data={operationTypeOptions.filter(Boolean)}
// //                   title="نوع عملیات"
// //                   setSelectedSubject={setSelectedOperationType}
// //                   selectedValue={selectedOperationType}
// //                 />
// //               </div>
// //             </div>
// //           </div>
// //           <div className="space-y-3 flex flex-col w-32">
// //             <button
// //               onClick={handleResetFilters}
// //               className="border rounded-lg shadow-lg px-4 py-2 w-36 whitespace-nowrap cursor-pointer"
// //             >
// //               حدف تمام فیلترها
// //             </button>
// //           </div>
// //           <div className="space-y-3 border p-4 w-72 rounded">
// //             <div className="flex items-center justify-between">
// //               <p>تعداد چک های وصول نشده:</p>
// //               <span className="text-sm">{stats.pending}</span>
// //             </div>
// //             <div className="flex items-center justify-between">
// //               <p>تعداد چک های برگشتی:</p>
// //               <span className="text-sm">{stats.returned}</span>
// //             </div>
// //             <div className="flex items-center justify-between">
// //               <p>تعداد چک های وارده ماه جاری:</p>
// //               <span className="text-sm">{stats.importedThisMonth}</span>
// //             </div>
// //             <div className="flex items-center justify-between">
// //               <p>تعداد چک های صادره ماه جاری:</p>
// //               <span className="text-sm">{stats.issuedThisMonth}</span>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //       <div className="grid grid-cols-2 gap-6 items-start mt-7">
// //         <div>
// //           <div className="border border-gray-300 p-4 rounded-md relative w-full h-[30rem]">
// //             <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
// //               چک های صادره
// //             </p>
// //             <div className="max-h-[28rem] overflow-y-auto rounded-md border w-full">
// //               <Table className="min-w-full table-fixed text-right border-collapse">
// //                 <TableHeader className="top-0 sticky">
// //                   <TableRow className="bg-gray-100">
// //                     <TableHead className="w-[10%] text-center">ردیف</TableHead>
// //                     <TableHead className="w-[50%] text-center">
// //                       نام مشتری
// //                     </TableHead>
// //                     <TableHead className="w-[30%] text-center">مبلغ</TableHead>
// //                     <TableHead className="w-[30%] text-center">
// //                       تاریخ سررسید
// //                     </TableHead>
// //                     <TableHead className="w-[30%] text-center">وضعیت</TableHead>
// //                     <TableHead className="w-[30%] text-center">
// //                       شناسه صیادی
// //                     </TableHead>
// //                     <TableHead className="w-[50%] text-center">
// //                       سریال چک
// //                     </TableHead>
// //                   </TableRow>
// //                 </TableHeader>

// //                 <TableBody>
// //                   {(issuedCheques ?? [])?.map((item, index) => (
// //                     <TableRow
// //                       key={`${item?.chequeNumber}-${index}`}
// //                       className="hover:bg-gray-50"
// //                     >
// //                       <TableCell className="text-center">{index + 1}</TableCell>
// //                       <TableCell className="text-center">
// //                         {item.payee?.fullName ?? item.payer?.fullName}
// //                       </TableCell>
// //                       <TableCell className="text-center">
// //                         {item.amount?.toLocaleString("en-US")}
// //                       </TableCell>
// //                       <TableCell className="text-center">
// //                         {item.dueDate}
// //                       </TableCell>
// //                       <TableCell className="text-center">
// //                         {item.status}
// //                       </TableCell>
// //                       <TableCell className="text-center">
// //                         {item.sayadiID}
// //                       </TableCell>
// //                       <TableCell className="text-center">
// //                         {item.chequeNumber}
// //                       </TableCell>
// //                     </TableRow>
// //                   ))}
// //                 </TableBody>
// //               </Table>
// //             </div>
// //           </div>
// //           {/* {totalIssuedAmount && (
// //             <p className="text-green-400 font-bold text-sm mt-3 text-left">
// //               {totalIssuedAmount?.toLocaleString("en-US")}
// //             </p>
// //           )} */}
// //           <div className="grid grid-cols-3 gap-2 mt-3">
// //             {/* <div className="flex items-center gap-2">
// //               <p className="text-sm">مجموع:</p>
// //               <span className="text-sm">
// //                 {stats.totalIssuedAmount?.toLocaleString("en-US")}
// //               </span>
// //             </div> */}
// //             <div className="flex items-center gap-2">
// //               <p className="text-sm">صادره وصول نشده:</p>
// //               <span className="text-sm">
// //                 {stats.totalIssuedPendingAmount?.toLocaleString("en-US")}
// //               </span>
// //             </div>
// //             <div className="flex items-center gap-2">
// //               <p className="text-sm">صادره وصول شده:</p>
// //               <span className="text-sm">
// //                 {stats.totalIssuedPaidAmount?.toLocaleString("en-US")}
// //               </span>
// //             </div>
// //             <div className="flex items-center gap-2">
// //               <p className="text-sm">صادره برگشتی:</p>
// //               <span className="text-sm">
// //                 {stats.totalIssuedReturnedAmount?.toLocaleString("en-US")}
// //               </span>
// //             </div>
// //           </div>
// //         </div>
// //         <div>
// //           <div className="border border-gray-300 p-4 rounded-md relative w-full h-[30rem]">
// //             <p className="text-red-500 absolute right-2 -top-5 bg-white py-2 px-4">
// //               چک های وارده
// //             </p>
// //             <div className="max-h-[28rem] overflow-y-auto rounded-md border w-full">
// //               <Table className="min-w-full table-fixed text-right border-collapse">
// //                 <TableHeader className="top-0 sticky">
// //                   <TableRow className="bg-gray-100">
// //                     <TableHead className="w-[10%] text-center">ردیف</TableHead>
// //                     <TableHead className="w-[50%] text-center">
// //                       نام مشتری
// //                     </TableHead>
// //                     <TableHead className="w-[30%] text-center">مبلغ</TableHead>
// //                     <TableHead className="w-[30%] text-center">
// //                       تاریخ سررسید
// //                     </TableHead>
// //                     <TableHead className="w-[30%] text-center">وضعیت</TableHead>
// //                     <TableHead className="w-[30%] text-center">
// //                       شناسه صیادی
// //                     </TableHead>
// //                     <TableHead className="w-[50%] text-center">
// //                       سریال چک
// //                     </TableHead>
// //                   </TableRow>
// //                 </TableHeader>

// //                 <TableBody>
// //                   {(importedCheques ?? [])?.map((item, index) => (
// //                     <TableRow
// //                       key={`${item?.chequeNumber}-${index}`}
// //                       className="hover:bg-gray-50"
// //                     >
// //                       <TableCell className="text-center">{index + 1}</TableCell>
// //                       <TableCell className="text-center">
// //                         {/* {item.ShowroomAccountCard ?? item.CustomerName} */}
// //                         {item.payee?.fullName ?? item.payer?.fullName}
// //                       </TableCell>
// //                       <TableCell className="text-center">
// //                         {item.amount?.toLocaleString("en-US")}
// //                       </TableCell>
// //                       <TableCell className="text-center">
// //                         {item.dueDate}
// //                       </TableCell>
// //                       <TableCell className="text-center">
// //                         {item.status}
// //                       </TableCell>
// //                       <TableCell className="text-center">
// //                         {item.sayadiID}
// //                       </TableCell>
// //                       <TableCell className="text-center">
// //                         {item.chequeNumber}
// //                       </TableCell>
// //                     </TableRow>
// //                   ))}
// //                 </TableBody>
// //               </Table>
// //             </div>
// //           </div>
// //           {/* {totalImportedAmount && ( */}
// //           {/* //{" "}
// //           <p className="text-red-400 font-bold text-sm mt-3 text-left">
// //             // {totalImportedAmount?.toLocaleString("en-US")}
// //             //{" "}
// //           </p> */}
// //           <div className="grid grid-cols-3 gap-2 mt-3">
// //             {/* <div className="flex items-center gap-2">
// //               <p className="text-sm">مجموع:</p>
// //               <span className="text-sm">
// //                 {stats.totalImportedAmount?.toLocaleString("en-US")}
// //               </span>
// //             </div> */}
// //             <div className="flex items-center gap-2">
// //               <p className="text-sm">وارده وصول نشده:</p>
// //               <span className="text-sm">
// //                 {stats.totalImportedPendingAmount?.toLocaleString("en-US")}
// //               </span>
// //             </div>
// //             <div className="flex items-center gap-2">
// //               <p className="text-sm">وارده وصول شده:</p>
// //               <span className="text-sm">
// //                 {stats.totalImportedPaidAmount?.toLocaleString("en-US")}
// //               </span>
// //             </div>
// //             <div className="flex items-center gap-2">
// //               <p className="text-sm">وارده برگشتی:</p>
// //               <span className="text-sm">
// //                 {stats.totalImportedReturnedAmount?.toLocaleString("en-US")}
// //               </span>
// //             </div>
// //           </div>
// //           {/* )} */}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CheckDashboard;

// "use client";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import React, { useMemo } from "react";
// import SelectForFilterCheques from "./selectForFilterCheques";
// import PersianDatePicker from "./global/persianDatePicker";
// import { Minus, Plus } from "lucide-react";
// import { useGetChequesByVin } from "@/apis/mutations/cheques";
// import { IChequeNew } from "@/types/new-backend-types";
// import { RootState } from "@/redux/store";
// import { useSelector } from "react-redux";
// import useGetAllCheques from "@/hooks/useGetAllCheques";

// // const parsePersianDate = (date: string) => {
// //   if (!date) return 0;
// //   const parts = date.split("/");
// //   const eng = parts.map((p) =>
// //     p.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
// //   );
// //   return Number(eng.join(""));
// // };

// const CheckDashboard = () => {
//   const [showFilter, setShowFilter] = React.useState(false);
//   const [selectedChequeSerial, setSelectedChequeSerial] = React.useState("همه");
//   const [selectedSayadiId, setSelectedSayadiId] = React.useState("همه");
//   const [selectedCustomerType, setSelectedCustomerType] = React.useState("همه");
//   const [selectedCustomerName, setSelectedCustomerName] = React.useState("همه");
//   const [selectedNationalID, setSelectedNationalID] = React.useState("همه");
//   const [selectedBank, setSelectedBank] = React.useState("همه");
//   const [selectedBranch, setSelectedBranch] = React.useState("همه");
//   const [selectedChequeStatus, setSelectedChequeStatus] = React.useState("همه");
//   const [selectedOperationType, setSelectedOperationType] =
//     React.useState("همه");
//   const [fromDate, setFromDate] = React.useState(""); // YYYY/MM/DD
//   const [toDate, setToDate] = React.useState(""); // YYYY/MM/DD
//   const [maxAmount, setMaxAmount] = React.useState<number | undefined>();
//   // const [cheques, setCheques] = React.useState<IChequeNew[]>([]);

//   // const { chassisNo } = useSelector((state: RootState) => state.cars);

//   const { data: allCheques } = useGetAllCheques();
//   // const getChequesByVin = useGetChequesByVin();

//   // const getChequesByVinHandler = async () => {
//   //   if (!chassisNo) return;
//   //   try {
//   //     const cheques = await getChequesByVin.mutateAsync(chassisNo);
//   //     setCheques(cheques);
//   //   } catch (error) {
//   //     console.log("🚀 ~ getChequesByVinHandler ~ error:", error);
//   //   }
//   // };

//   // Don't filter by chassisNo - show all cheques
//   // const cheques = allCheques?.filter((cheque) => cheque.vin === chassisNo);
//   const cheques = allCheques;
//   const issuedCheques = cheques?.filter((cheque) => cheque.type === "صادره");
//   const importedCheques = cheques?.filter((cheque) => cheque.type === "وارده");

//   const sayadiIDOptions = Array.from(
//     new Set(cheques?.map((cheque) => cheque.sayadiID))
//   );
//   const chequeNumberOptions = Array.from(
//     new Set(cheques?.map((cheque) => cheque.chequeNumber?.toString()))
//   );
//   const bankNameOptions = Array.from(
//     new Set(cheques?.map((cheque) => cheque.bankName))
//   );
//   const branchNameOptions = Array.from(
//     new Set(cheques?.map((cheque) => cheque.branchName))
//   );

//   const getOptions = (key: string) => {
//     const values = cheques?.map((d: any) => d[key] ?? "") ?? [];
//     const uniqueValues = Array.from(new Set(values.filter(Boolean)));
//     return ["همه", ...uniqueValues];
//   };

//   const chequeSerialOptions = getOptions("ChequeSerial").filter(Boolean);
//   const sayadiIdOptions = getOptions("SayadiID").filter(Boolean);
//   const customerTypeOptions = getOptions("ChequeType").filter(Boolean);
//   const customerNameOptions = getOptions("CustomerName")
//     .concat(getOptions("ShowroomAccountCard"))
//     .filter(Boolean);
//   const nationalIDOptions = getOptions("CustomerNationalID")
//     .concat(getOptions("AccountHolderNationalID"))
//     .filter(Boolean);
//   const bankOptions = getOptions("Bank").filter(Boolean);
//   const branchOptions = getOptions("Branch").filter(Boolean);
//   const chequeStatusOptions = getOptions("ChequeStatus").filter(Boolean);
//   const operationTypeOptions = getOptions("LastAction").filter(Boolean);

//   const filteredData = useMemo(() => {
//     return cheques?.filter((item) => {
//       if (
//         selectedChequeSerial !== "همه" &&
//         item.chequeNumber?.toString() !== selectedChequeSerial
//       )
//         return false;
//       if (selectedSayadiId !== "همه" && item.sayadiID !== selectedSayadiId)
//         return false;
//       if (selectedCustomerType !== "همه" && item.type !== selectedCustomerType)
//         return false;
//       if (
//         selectedCustomerName !== "همه" &&
//         // (item.CustomerName ?? item.ShowroomAccountCard) !== selectedCustomerName
//         (item.payer?.fullName ?? item.payee?.fullName) !== selectedCustomerName
//       )
//         return false;
//       if (
//         selectedNationalID !== "همه" &&
//         // (item.CustomerNationalID ?? item.AccountHolderNationalID) !==
//         //   selectedNationalID
//         (item.payer?.nationalId ?? item.payee?.nationalId) !==
//           selectedNationalID
//       )
//         return false;
//       if (selectedBank !== "همه" && (item.bankName ?? "") !== selectedBank)
//         return false;
//       if (
//         selectedBranch !== "همه" &&
//         (item.branchName ?? "") !== selectedBranch
//       )
//         return false;
//       if (
//         selectedChequeStatus !== "همه" &&
//         (item.status ?? "") !== selectedChequeStatus
//       )
//         return false;
//       if (
//         selectedOperationType !== "همه" &&
//         // (item.LastAction ?? "") !== selectedOperationType
//         (item.actions[item.actions.length - 1]?.actionType ?? "") !==
//           selectedOperationType
//       )
//         return false;
//       if (maxAmount !== undefined && item.amount > maxAmount) return false;
//       if (fromDate && item.dueDate < fromDate) return false;
//       if (toDate && item.dueDate > toDate) return false;
//       return true;
//     });
//   }, [
//     cheques,
//     selectedChequeSerial,
//     selectedSayadiId,
//     selectedCustomerType,
//     selectedCustomerName,
//     selectedNationalID,
//     selectedBank,
//     selectedBranch,
//     selectedChequeStatus,
//     selectedOperationType,
//     maxAmount,
//     fromDate,
//     toDate,
//   ]);

//   const issued = useMemo(
//     () => filteredData?.filter((item) => item.type === "صادره"),
//     [filteredData]
//   );
//   const imported = useMemo(
//     () => filteredData?.filter((item) => item.type === "وارده"),
//     [filteredData]
//   );

//   // const totalIssuedAmount = issued?.reduce((sum, t) => sum + t.amount, 0);
//   // const totalImportedAmount = imported?.reduce((sum, t) => sum + t.amount, 0);

//   const handleResetFilters = () => {
//     setSelectedChequeSerial("همه");
//     setSelectedSayadiId("همه");
//     setSelectedCustomerType("همه");
//     setSelectedCustomerName("همه");
//     setSelectedNationalID("همه");
//     setSelectedBank("همه");
//     setSelectedBranch("همه");
//     setSelectedChequeStatus("همه");
//     setSelectedOperationType("همه");
//     setFromDate("");
//     setToDate("");
//     setMaxAmount(undefined);
//   };

//   const stats = useMemo(() => {
//     const now = new Date();
//     const currentMonth = now.getMonth() + 1;
//     const currentYear = now.getFullYear();
//     const pending =
//       filteredData?.filter((i) => i.status !== "وصول شد")?.length || 0;
//     const returned =
//       filteredData?.filter((i) => i.status === "برگشتی")?.length || 0;
//     const importedThisMonth =
//       imported?.filter((i) => {
//         const [year, month] = i.dueDate.split("/").map(Number);
//         return year === currentYear && month === currentMonth;
//       })?.length || 0;
//     const issuedThisMonth =
//       issued?.filter((i) => {
//         const [year, month] = i.dueDate.split("/").map(Number);
//         return year === currentYear && month === currentMonth;
//       })?.length || 0;
//     const totalIssuedAmount = filteredData?.reduce(
//       (sum, t) => sum + (t.type === "صادره" ? t.amount : 0),
//       0
//     );
//     const totalIssuedPendingAmount = filteredData
//       ?.filter((i) => i.type === "صادره" && i.status === "وصول نشده")
//       ?.reduce((sum, t) => sum + t.amount, 0);
//     const totalIssuedPaidAmount = filteredData
//       ?.filter((i) => i.type === "صادره" && i.status === "وصول شده")
//       ?.reduce((sum, t) => sum + t.amount, 0);

//     const totalImportedAmount = filteredData?.reduce(
//       (sum, t) => sum + (t.type === "وارده" ? t.amount : 0),
//       0
//     );
//     const totalImportedPendingAmount = filteredData
//       ?.filter((i) => i.type === "وارده" && i.status === "وصول نشده")
//       ?.reduce((sum, t) => sum + t.amount, 0);
//     const totalImportedPaidAmount = filteredData
//       ?.filter((i) => i.type === "وارده" && i.status === "وصول شده")
//       ?.reduce((sum, t) => sum + t.amount, 0);

//     const totalIssuedReturnedAmount = filteredData
//       ?.filter((i) => i.type === "صادره" && i.status === "برگشتی")
//       ?.reduce((sum, t) => sum + t.amount, 0);
//     const totalImportedReturnedAmount = filteredData
//       ?.filter((i) => i.type === "وارده" && i.status === "برگشتی")
//       ?.reduce((sum, t) => sum + t.amount, 0);

//     return {
//       pending,
//       returned,
//       importedThisMonth,
//       issuedThisMonth,
//       totalIssuedAmount,
//       totalIssuedPendingAmount,
//       totalIssuedPaidAmount,
//       totalImportedAmount,
//       totalImportedPendingAmount,
//       totalImportedPaidAmount,
//       totalIssuedReturnedAmount,
//       totalImportedReturnedAmount,
//     };
//   }, [filteredData, imported, issued]);

//   // React.useEffect(() => {
//   //   getChequesByVinHandler();
//   // }, [chassisNo]);

//   return (
//     <div>
//       <button
//         onClick={() => setShowFilter(!showFilter)}
//         className="flex justify-end w-full"
//       >
//         {showFilter ? (
//           <Minus className="cursor-pointer" />
//         ) : (
//           <Plus className="cursor-pointer" />
//         )}
//       </button>
//       {showFilter && (
//         // <div className="grid [grid-template-columns:1fr_1fr_1fr_0.5fr_0.5fr] gap-6 items-start justify-start mt-4">
//         <div className="flex gap-9 items-start justify-start mt-4">
//           <div className="space-y-6 min-w-[140px] w-[340px]">
//             <div className="border border-gray-300 p-4 rounded-md relative h-[7rem]">
//               <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
//                 اطلاعات چک
//               </p>

//               <div className="flex gap-4 overflow-auto min-w-[140px] scrollbar-hide">
//                 <SelectForFilterCheques
//                   // data={chequeSerialOptions.filter(Boolean)}
//                   data={["همه", ...chequeNumberOptions.filter(Boolean)]}
//                   title="سریال چک"
//                   setSelectedSubject={setSelectedChequeSerial}
//                   selectedValue={selectedChequeSerial}
//                 />
//                 <SelectForFilterCheques
//                   // data={sayadiIdOptions.filter(Boolean)}
//                   data={["همه", ...sayadiIDOptions.filter(Boolean)]}
//                   title="شناسه صیادی"
//                   setSelectedSubject={setSelectedSayadiId}
//                   selectedValue={selectedSayadiId}
//                 />
//               </div>
//             </div>
//             <div className="border border-gray-300 p-4 rounded-md relative h-[7rem]">
//               <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
//                 نوع تاریخ / مبلغ
//               </p>
//               <div className="flex gap-4 items-center overflow-auto min-w-[140px] scrollbar-hide">
//                 <div className="space-y-1">
//                   <h3 className="text-sm font-bold mb-2 text-blue-900">
//                     حداکثر مبلغ:
//                   </h3>
//                   <input type="text" className="border rounded w-[130px]" />
//                 </div>
//                 <SelectForFilterCheques
//                   data={["غیرفعال", "فعال"]}
//                   title="نوع عملیات تاریخ"
//                   selectedValue="غیرفعال"
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="space-y-6 min-w-[140px] w-[340px]">
//             <div className="border border-gray-300 p-4 rounded-md relative h-[7rem]">
//               <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
//                 اطلاعات مشتری/صاحب چک
//               </p>

//               <div className="flex gap-4 overflow-auto min-w-[140px]">
//                 <SelectForFilterCheques
//                   data={customerTypeOptions.filter(Boolean)}
//                   title="نوع کاربر"
//                   setSelectedSubject={setSelectedCustomerType}
//                   selectedValue={selectedCustomerType}
//                 />
//                 <SelectForFilterCheques
//                   data={customerNameOptions.filter(Boolean)}
//                   title="نام و نام خانوادگی"
//                   setSelectedSubject={setSelectedCustomerName}
//                   selectedValue={selectedCustomerName}
//                 />
//                 <SelectForFilterCheques
//                   data={nationalIDOptions.filter(Boolean)}
//                   title="کدملی"
//                   setSelectedSubject={setSelectedNationalID}
//                   selectedValue={selectedNationalID}
//                 />
//               </div>
//             </div>{" "}
//             <div className="border border-gray-300 p-4 rounded-md relative h-[7rem]">
//               <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
//                 بازه زمانی
//               </p>
//               <div className="flex gap-4 overflow-auto min-w-[140px]">
//                 <div className="space-y-1">
//                   <h3 className="text-sm font-bold mb-2 text-purple-700">
//                     از تاریخ:
//                   </h3>
//                   <PersianDatePicker
//                     value={fromDate}
//                     onChange={(date) => setFromDate(date)}
//                     placeholder="از تاریخ"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <h3 className="text-sm font-bold mb-2 text-purple-700">
//                     تا تاریخ:
//                   </h3>
//                   <PersianDatePicker
//                     value={toDate}
//                     onChange={(date) => setToDate(date)}
//                     placeholder="تا تاریخ"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="space-y-6 min-w-[140px] w-[340px]">
//             <div className="border border-gray-300 p-4 rounded-md relative h-[7rem]">
//               <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
//                 اطلاعات بانک
//               </p>
//               <div className="flex overflow-auto min-w-[140px] gap-4">
//                 <SelectForFilterCheques
//                   // data={bankOptions.filter(Boolean)}
//                   data={["همه", ...bankNameOptions.filter(Boolean)]}
//                   title="بانک"
//                   setSelectedSubject={setSelectedBank}
//                   selectedValue={selectedBank}
//                 />

//                 <SelectForFilterCheques
//                   // data={branchOptions.filter(Boolean)}
//                   data={["همه", ...branchNameOptions.filter(Boolean)]}
//                   title="شعبه"
//                   setSelectedSubject={setSelectedBranch}
//                   selectedValue={selectedBranch}
//                 />
//               </div>
//             </div>
//             <div className="border border-gray-300 p-4 rounded-md relative h-[7rem]">
//               <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
//                 وضعیت و عملیات انجام شده
//               </p>
//               <div className="flex overflow-auto min-w-[140px] gap-4">
//                 <SelectForFilterCheques
//                   data={chequeStatusOptions.filter(Boolean)}
//                   title="وضعیت چک"
//                   setSelectedSubject={setSelectedChequeStatus}
//                   selectedValue={selectedChequeStatus}
//                 />
//                 <SelectForFilterCheques
//                   data={operationTypeOptions.filter(Boolean)}
//                   title="نوع عملیات"
//                   setSelectedSubject={setSelectedOperationType}
//                   selectedValue={selectedOperationType}
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="space-y-3 flex flex-col w-32">
//             <button
//               onClick={handleResetFilters}
//               className="border rounded-lg shadow-lg px-4 py-2 w-36 whitespace-nowrap cursor-pointer"
//             >
//               حدف تمام فیلترها
//             </button>
//           </div>
//           <div className="space-y-3 border p-4 w-72 rounded">
//             <div className="flex items-center justify-between">
//               <p>تعداد چک های وصول نشده:</p>
//               <span className="text-sm">{stats.pending}</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <p>تعداد چک های برگشتی:</p>
//               <span className="text-sm">{stats.returned}</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <p>تعداد چک های وارده ماه جاری:</p>
//               <span className="text-sm">{stats.importedThisMonth}</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <p>تعداد چک های صادره ماه جاری:</p>
//               <span className="text-sm">{stats.issuedThisMonth}</span>
//             </div>
//           </div>
//         </div>
//       )}
//       <div className="grid grid-cols-2 gap-6 items-start mt-7">
//         <div>
//           <div className="border border-gray-300 p-4 rounded-md relative w-full h-[30rem]">
//             <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
//               چک های صادره
//             </p>
//             <div className="max-h-[28rem] overflow-y-auto rounded-md border w-full">
//               <Table className="min-w-full table-fixed text-right border-collapse">
//                 <TableHeader className="top-0 sticky">
//                   <TableRow className="bg-gray-100">
//                     <TableHead className="w-[10%] text-center">ردیف</TableHead>
//                     <TableHead className="w-[50%] text-center">
//                       نام مشتری
//                     </TableHead>
//                     <TableHead className="w-[30%] text-center">مبلغ</TableHead>
//                     <TableHead className="w-[30%] text-center">
//                       تاریخ سررسید
//                     </TableHead>
//                     <TableHead className="w-[30%] text-center">وضعیت</TableHead>
//                     <TableHead className="w-[30%] text-center">
//                       شناسه صیادی
//                     </TableHead>
//                     <TableHead className="w-[50%] text-center">
//                       سریال چک
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {(issuedCheques ?? [])?.map((item, index) => (
//                     <TableRow
//                       key={`${item?.chequeNumber}-${index}`}
//                       className="hover:bg-gray-50"
//                     >
//                       <TableCell className="text-center">{index + 1}</TableCell>
//                       <TableCell className="text-center">
//                         {item.payee?.fullName ?? item.payer?.fullName}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {item.amount?.toLocaleString("en-US")}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {item.dueDate}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {item.status}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {item.sayadiID}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {item.chequeNumber}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </div>
//           {/* {totalIssuedAmount && (
//             <p className="text-green-400 font-bold text-sm mt-3 text-left">
//               {totalIssuedAmount?.toLocaleString("en-US")}
//             </p>
//           )} */}
//           <div className="grid grid-cols-3 gap-2 mt-3">
//             {/* <div className="flex items-center gap-2">
//               <p className="text-sm">مجموع:</p>
//               <span className="text-sm">
//                 {stats.totalIssuedAmount?.toLocaleString("en-US")}
//               </span>
//             </div> */}
//             <div className="flex items-center gap-2">
//               <p className="text-sm">صادره وصول نشده:</p>
//               <span className="text-sm">
//                 {stats.totalIssuedPendingAmount?.toLocaleString("en-US")}
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <p className="text-sm">صادره وصول شده:</p>
//               <span className="text-sm">
//                 {stats.totalIssuedPaidAmount?.toLocaleString("en-US")}
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <p className="text-sm">صادره برگشتی:</p>
//               <span className="text-sm">
//                 {stats.totalIssuedReturnedAmount?.toLocaleString("en-US")}
//               </span>
//             </div>
//           </div>
//         </div>
//         <div>
//           <div className="border border-gray-300 p-4 rounded-md relative w-full h-[30rem]">
//             <p className="text-red-500 absolute right-2 -top-5 bg-white py-2 px-4">
//               چک های وارده
//             </p>
//             <div className="max-h-[28rem] overflow-y-auto rounded-md border w-full">
//               <Table className="min-w-full table-fixed text-right border-collapse">
//                 <TableHeader className="top-0 sticky">
//                   <TableRow className="bg-gray-100">
//                     <TableHead className="w-[10%] text-center">ردیف</TableHead>
//                     <TableHead className="w-[50%] text-center">
//                       نام مشتری
//                     </TableHead>
//                     <TableHead className="w-[30%] text-center">مبلغ</TableHead>
//                     <TableHead className="w-[30%] text-center">
//                       تاریخ سررسید
//                     </TableHead>
//                     <TableHead className="w-[30%] text-center">وضعیت</TableHead>
//                     <TableHead className="w-[30%] text-center">
//                       شناسه صیادی
//                     </TableHead>
//                     <TableHead className="w-[50%] text-center">
//                       سریال چک
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {(importedCheques ?? [])?.map((item, index) => (
//                     <TableRow
//                       key={`${item?.chequeNumber}-${index}`}
//                       className="hover:bg-gray-50"
//                     >
//                       <TableCell className="text-center">{index + 1}</TableCell>
//                       <TableCell className="text-center">
//                         {/* {item.ShowroomAccountCard ?? item.CustomerName} */}
//                         {item.payee?.fullName ?? item.payer?.fullName}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {item.amount?.toLocaleString("en-US")}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {item.dueDate}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {item.status}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {item.sayadiID}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {item.chequeNumber}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </div>
//           {/* {totalImportedAmount && ( */}
//           {/* //{" "}
//           <p className="text-red-400 font-bold text-sm mt-3 text-left">
//             // {totalImportedAmount?.toLocaleString("en-US")}
//             //{" "}
//           </p> */}
//           <div className="grid grid-cols-3 gap-2 mt-3">
//             {/* <div className="flex items-center gap-2">
//               <p className="text-sm">مجموع:</p>
//               <span className="text-sm">
//                 {stats.totalImportedAmount?.toLocaleString("en-US")}
//               </span>
//             </div> */}
//             <div className="flex items-center gap-2">
//               <p className="text-sm">وارده وصول نشده:</p>
//               <span className="text-sm">
//                 {stats.totalImportedPendingAmount?.toLocaleString("en-US")}
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <p className="text-sm">وارده وصول شده:</p>
//               <span className="text-sm">
//                 {stats.totalImportedPaidAmount?.toLocaleString("en-US")}
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <p className="text-sm">وارده برگشتی:</p>
//               <span className="text-sm">
//                 {stats.totalImportedReturnedAmount?.toLocaleString("en-US")}
//               </span>
//             </div>
//           </div>
//           {/* )} */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckDashboard;

"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useMemo } from "react";
import SelectForFilterCheques from "./selectForFilterCheques";
import { Minus, Pencil, Plus } from "lucide-react";
import { IChequeNew } from "@/types/new-backend-types";
// import { RootState } from "@/redux/store";
// import { useSelector } from "react-redux";
import useGetAllCheques from "@/hooks/useGetAllCheques";
import useGetAllPeople from "@/hooks/useGetAllPeople";
import RangeDatePicker from "@/components/global/rangeDatePicker";
import { CHEQUE_ACTIONS, CHEQUE_LAST_STATUS } from "@/utils/systemConstants";
import { DateObject } from "react-multi-date-picker";
import ChequeFormModal from "./modals/chequeFormModal";

// const parsePersianDate = (date: string) => {
//   if (!date) return 0;
//   const parts = date.split("/");
//   const eng = parts.map((p) =>
//     p.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
//   );
//   return Number(eng.join(""));
// };

const CheckDashboard = () => {
  const [showFilter, setShowFilter] = React.useState(false);

  const [chequeId, setChequeId] = React.useState("");
  const [isOpenEditModal, setIsOpenEditModal] = React.useState(false);

  const [selectedSayadiId, setSelectedSayadiId] = React.useState("همه");
  const [selectedChequeNumber, setSelectedChequeNumber] = React.useState("همه");
  const [selectedChequeSerial, setSelectedChequeSerial] = React.useState("همه");
  const [selectedBank, setSelectedBank] = React.useState("همه");
  const [selectedBranch, setSelectedBranch] = React.useState("همه");

  // const [selectedCustomerType, setSelectedCustomerType] = React.useState("همه");
  // const [selectedCustomerName, setSelectedCustomerName] = React.useState("همه");
  // const [selectedNationalID, setSelectedNationalID] = React.useState("همه");

  const [selectedChequeType, setSelectedChequeType] = React.useState("همه");
  const [selectedChequePayee, setSelectedChequePayee] = React.useState("");
  const [selectedChequePayer, setSelectedChequePayer] = React.useState("");
  const [selectedCustomer, setSelectedCustomer] = React.useState("");
  // tarikh sodor
  const [issueDates, setIssueDates] = React.useState<DateObject[]>([]);
  // tarikh saresid
  const [dueDates, setDueDates] = React.useState<DateObject[]>([]);
  const [minPrice, setMinPrice] = React.useState<number | null>(null);
  const [maxPrice, setMaxPrice] = React.useState<number | null>(null);
  const [actionDate, setActionDate] = React.useState<DateObject[]>([]);
  const [actionType, setActionType] = React.useState<string>("");
  const [chequeLastStatus, setChequeLastStatus] = React.useState<string>("");
  const [chequeDescription, setChequeDescription] = React.useState<string>("");
  // setSelectedChequeType
  // setSelectedChequePayee
  // setSelectedChequePayer
  //   setSelectedChequePayer
  // setSelectedCustomer
  //   setIssueDates
  // setDueDates
  // setMinPrice
  // setMaxPrice
  // setActionDates
  // setActionType
  // setChequeLastStatus
  // setChequeDescription

  // const [selectedChequeStatus, setSelectedChequeStatus] = React.useState("همه");
  // const [selectedOperationType, setSelectedOperationType] =
  // React.useState("همه");
  // const [fromDate, setFromDate] = React.useState(""); // YYYY/MM/DD
  // const [toDate, setToDate] = React.useState(""); // YYYY/MM/DD
  // const [maxAmount, setMaxAmount] = React.useState<number | undefined>();
  // const [cheques, setCheques] = React.useState<IChequeNew[]>([]);

  // const { chassisNo } = useSelector((state: RootState) => state.cars);

  const { data: allCheques } = useGetAllCheques();
  const { data: allPeople } = useGetAllPeople();

  const peopleList = allPeople?.map((el) => `${el.firstName} ${el.lastName}`);

  // const getChequesByVin = useGetChequesByVin();

  // const getChequesByVinHandler = async () => {
  //   if (!chassisNo) return;
  //   try {
  //     const cheques = await getChequesByVin.mutateAsync(chassisNo);
  //     setCheques(cheques);
  //   } catch (error) {
  //     console.log("🚀 ~ getChequesByVinHandler ~ error:", error);
  //   }
  // };

  const cheques = allCheques;

  const isIssuedCheque = (cheque: IChequeNew) => {
    return cheque.type === "صادره" || cheque.type === "issued";
  };

  const isImportedCheque = (cheque: IChequeNew) => {
    return cheque.type === "وارده" || cheque.type === "incoming";
  };

  const issuedCheques = cheques?.filter((cheque) => isIssuedCheque(cheque));
  const importedCheques = cheques?.filter((cheque) => isImportedCheque(cheque));

  const sayadiIDOptions = Array.from(
    new Set(cheques?.map((cheque) => cheque.sayadiID)),
  );
  const chequeNumberOptions = Array.from(
    new Set(cheques?.map((cheque) => cheque.chequeNumber?.toString())),
  );
  const chequeSerialOptions = Array.from(
    new Set(cheques?.map((cheque) => cheque.chequeSerial?.toString())),
  );
  const bankNameOptions = Array.from(
    new Set(cheques?.map((cheque) => cheque.bankName)),
  );
  const branchNameOptions = Array.from(
    new Set(cheques?.map((cheque) => cheque.branchName)),
  );

  const getOptions = (key: string) => {
    const values = cheques?.map((d: any) => d[key] ?? "") ?? [];
    const uniqueValues = Array.from(new Set(values.filter(Boolean)));
    return ["همه", ...uniqueValues];
  };

  const getRangeNumbers = (range: DateObject[]) => {
    if (range.length !== 2) return null;
    return {
      from: Number(range[0].format("YYYYMMDD")),
      to: Number(range[1].format("YYYYMMDD")),
    };
  };
  const persianDateToNumber = (date: string) => {
    if (!date) return null;
    return Number(
      date
        .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString())
        .replaceAll("/", ""),
    );
  };

  // const chequeSerialOptions = getOptions("ChequeSerial").filter(Boolean);
  // const sayadiIdOptions = getOptions("SayadiID").filter(Boolean);
  // const customerTypeOptions = getOptions("ChequeType").filter(Boolean);
  // const customerNameOptions = getOptions("CustomerName")
  //   .concat(getOptions("ShowroomAccountCard"))
  //   .filter(Boolean);
  // const nationalIDOptions = getOptions("CustomerNationalID")
  //   .concat(getOptions("AccountHolderNationalID"))
  //   .filter(Boolean);
  // const bankOptions = getOptions("Bank").filter(Boolean);
  // const branchOptions = getOptions("Branch").filter(Boolean);
  // const chequeStatusOptions = getOptions("ChequeStatus").filter(Boolean);
  // const operationTypeOptions = getOptions("LastAction").filter(Boolean);

  const filteredData = useMemo(() => {
    const issueRange = getRangeNumbers(issueDates);
    const dueRange = getRangeNumbers(dueDates);
    const actionRange = getRangeNumbers(actionDate);

    return cheques?.filter((item) => {
      if (
        selectedChequeNumber !== "همه" &&
        item.chequeNumber?.toString() !== selectedChequeNumber
      )
        return false;

      if (
        selectedChequeSerial !== "همه" &&
        item.chequeSerial?.toString() !== selectedChequeSerial
      )
        return false;

      if (selectedSayadiId !== "همه" && item.sayadiID !== selectedSayadiId)
        return false;

      if (selectedChequeType !== "همه" && item.type !== selectedChequeType)
        return false;

      if (selectedChequePayee && item.payee?.fullName !== selectedChequePayee)
        return false;

      if (selectedChequePayer && item.payer?.fullName !== selectedChequePayer)
        return false;

      if (selectedCustomer && item.customer?.fullName !== selectedCustomer)
        return false;

      if (issueRange) {
        const issue = persianDateToNumber(item.issueDate);
        if (!issue || issue < issueRange.from || issue > issueRange.to)
          return false;
      }

      if (dueRange) {
        const due = persianDateToNumber(item.dueDate);
        if (!due || due < dueRange.from || due > dueRange.to) return false;
      }

      if (minPrice !== null && item.amount < minPrice) return false;
      if (maxPrice !== null && item.amount > maxPrice) return false;

      if (actionType) {
        if (!item.actions.some((a) => a.actionType === actionType))
          return false;
      }

      if (actionRange) {
        const hasActionInRange = item.actions.some((a) => {
          const d = persianDateToNumber(a.actionDate);
          return d && d >= actionRange.from && d <= actionRange.to;
        });
        if (!hasActionInRange) return false;
      }

      if (chequeLastStatus && item.status !== chequeLastStatus) return false;

      if (chequeDescription && !item.description?.includes(chequeDescription))
        return false;

      if (selectedBank !== "همه" && item.bankName !== selectedBank)
        return false;

      if (selectedBranch !== "همه" && item.branchName !== selectedBranch)
        return false;

      return true;
    });
  }, [
    cheques,
    selectedChequeNumber,
    selectedChequeSerial,
    selectedSayadiId,
    selectedChequeType,
    selectedChequePayee,
    selectedChequePayer,
    selectedCustomer,
    issueDates,
    dueDates,
    minPrice,
    maxPrice,
    actionDate,
    actionType,
    chequeLastStatus,
    chequeDescription,
    selectedBank,
    selectedBranch,
  ]);

  // const filteredData = useMemo(() => {
  //   return cheques?.filter((item) => {
  //     if (
  //       selectedChequeNumber !== "همه" &&
  //       item.chequeNumber?.toString() !== selectedChequeNumber
  //     )
  //       return false;
  //     if (
  //       selectedChequeSerial !== "همه" &&
  //       item.chequeSerial?.toString() !== selectedChequeSerial
  //     )
  //       return false;
  //     if (selectedSayadiId !== "همه" && item.sayadiID !== selectedSayadiId)
  //       return false;

  //     if (
  //       selectedChequeType !== "همه" &&
  //       item.type?.toString() !== selectedChequeType
  //     )
  //       return false;
  //     if (
  //       selectedChequePayee !== "" &&
  //       item.payee.fullName?.toString() !== selectedChequePayee
  //     )
  //       return false;
  //     if (
  //       selectedChequePayer !== "" &&
  //       item.payer.fullName?.toString() !== selectedChequePayer
  //     )
  //       return false;

  //     if (
  //       selectedCustomer !== "" &&
  //       item.customer.fullName?.toString() !== selectedCustomer
  //     )
  //       return false;

  //     // if (!!issueDates.length && item.issueDate?.toString() !== issueDates.toLocaleString())
  //     //   return false;
  //     // if (
  //     //   !!dueDates.leng th &&
  //     //   item.dueDate?.toString() !== dueDates.toLocaleString()
  //     // )
  //     //   return false;
  //     // if (minPrice && item.amount <= minPrice) return false;
  //     // if (maxPrice && item.amount >= maxPrice) return false;

  //     // const actionDateCheque = item.updatedAt
  //     //   ? item.updatedAt?.toString() !== actionDates.toLocaleString()
  //     //   : item.createdAt?.toString() !== actionDates.toLocaleString();
  //     // if (!!actionDates.length && actionDateCheque) return false;

  //     // const actions = item.actions.map((el) => [...
  //     //   {
  //     //     actionType: el.actionType,
  //     //     actionDate: el.actionDate,
  //     //     actorUserId: el.actorUserId,
  //     //     description: el.description,
  //     //   },
  //     // ]);
  //     if (
  //       actionType !== "" &&
  //       item.actions.map((el) => el.actionType).toString() !== actionType
  //     )
  //       return false;
  //     if (
  //       !!actionDate.length &&
  //       item.actions.map((el) => el.actionDate).toString() !== actionDate
  //     )
  //       return false;

  //     if (
  //       chequeLastStatus !== "" &&
  //       item.status?.toString() !== chequeLastStatus
  //     )
  //       return false;
  //     if (
  //       chequeDescription !== "" &&
  //       item.description?.toString() !== chequeDescription
  //     )
  //       return false;

  //     if (selectedCustomerType !== "همه" && item.type !== selectedCustomerType)
  //       return false;
  //     if (
  //       selectedCustomerName !== "همه" &&
  //       // (item.CustomerName ?? item.ShowroomAccountCard) !== selectedCustomerName
  //       (item.payer?.fullName ?? item.payee?.fullName) !== selectedCustomerName
  //     )
  //       return false;
  //     if (
  //       selectedNationalID !== "همه" &&
  //       // (item.CustomerNationalID ?? item.AccountHolderNationalID) !==
  //       //   selectedNationalID
  //       (item.payer?.nationalId ?? item.payee?.nationalId) !==
  //         selectedNationalID
  //     )
  //       return false;
  //     if (selectedBank !== "همه" && (item.bankName ?? "") !== selectedBank)
  //       return false;
  //     if (
  //       selectedBranch !== "همه" &&
  //       (item.branchName ?? "") !== selectedBranch
  //     )
  //       return false;
  //     if (
  //       selectedChequeStatus !== "همه" &&
  //       (item.status ?? "") !== selectedChequeStatus
  //     )
  //       return false;

  //     return true;
  //   });
  // }, [
  //   cheques,
  //   selectedChequeSerial,
  //   selectedChequeNumber,
  //   selectedSayadiId,

  //   selectedChequeType,
  //   selectedChequePayee,
  //   selectedChequePayer,
  //   selectedCustomer,

  //   selectedBank,
  //   selectedBranch,
  // ]);

  const issued = useMemo(
    () => filteredData?.filter((item) => isIssuedCheque(item)),
    [filteredData],
  );
  const imported = useMemo(
    () => filteredData?.filter((item) => isImportedCheque(item)),
    [filteredData],
  );

  // const totalIssuedAmount = issued?.reduce((sum, t) => sum + t.amount, 0);
  // const totalImportedAmount = imported?.reduce((sum, t) => sum + t.amount, 0);

  const handleResetFilters = () => {
    setSelectedChequeSerial("همه");
    setSelectedChequeNumber("همه");
    setSelectedSayadiId("همه");
    setSelectedBank("همه");
    setSelectedBranch("همه");

    setSelectedChequeType("همه");
    setSelectedChequePayee("");
    setSelectedChequePayer("");
    setSelectedCustomer("");
    setIssueDates([]);
    setDueDates([]);
    setMinPrice(null);
    setMaxPrice(null);
    setActionDate([]);
    setActionType("");
    setChequeLastStatus("");
    setChequeDescription("");

    // setSelectedCustomerType("همه");
    // setSelectedCustomerName("همه");
    // setSelectedNationalID("همه");
    // setSelectedChequeStatus("همه");
    // setSelectedOperationType("همه");
    // setFromDate("");
    // setToDate("");
    // setMaxAmount(undefined);
  };

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const pending =
      filteredData?.filter((i) => {
        const status = i.status || "";
        return (
          status !== "وصول شده" && status !== "وصول شد" && status !== "پاس شده"
        );
      })?.length || 0;
    const returned =
      filteredData?.filter((i) => i.status === "برگشتی")?.length || 0;
    const importedThisMonth =
      imported?.filter((i) => {
        const [year, month] = i.dueDate.split("/").map(Number);
        return year === currentYear && month === currentMonth;
      })?.length || 0;
    const issuedThisMonth =
      issued?.filter((i) => {
        const [year, month] = i.dueDate.split("/").map(Number);
        return year === currentYear && month === currentMonth;
      })?.length || 0;
    const totalIssuedAmount = filteredData?.reduce(
      (sum, t) => sum + (isIssuedCheque(t) ? t.amount : 0),
      0,
    );
    const totalIssuedPendingAmount = filteredData
      ?.filter((i) => {
        const status = i.status || "";
        return (
          isIssuedCheque(i) && (status === "وصول نشده" || status === "خرج شده")
        );
      })
      ?.reduce((sum, t) => sum + t.amount, 0);
    const totalIssuedPaidAmount = filteredData
      ?.filter((i) => isIssuedCheque(i) && i.status === "وصول شده")
      ?.reduce((sum, t) => sum + t.amount, 0);

    const totalImportedAmount = filteredData?.reduce(
      (sum, t) => sum + (isImportedCheque(t) ? t.amount : 0),
      0,
    );
    const totalImportedPendingAmount = filteredData
      ?.filter((i) => isImportedCheque(i) && i.status === "وصول نشده")
      ?.reduce((sum, t) => sum + t.amount, 0);
    const totalImportedPaidAmount = filteredData
      ?.filter((i) => isImportedCheque(i) && i.status === "وصول شده")
      ?.reduce((sum, t) => sum + t.amount, 0);

    const totalIssuedReturnedAmount = filteredData
      ?.filter((i) => isIssuedCheque(i) && i.status === "برگشتی")
      ?.reduce((sum, t) => sum + t.amount, 0);
    const totalImportedReturnedAmount = filteredData
      ?.filter((i) => isImportedCheque(i) && i.status === "برگشتی")
      ?.reduce((sum, t) => sum + t.amount, 0);

    return {
      pending,
      returned,
      importedThisMonth,
      issuedThisMonth,
      totalIssuedAmount,
      totalIssuedPendingAmount,
      totalIssuedPaidAmount,
      totalImportedAmount,
      totalImportedPendingAmount,
      totalImportedPaidAmount,
      totalIssuedReturnedAmount,
      totalImportedReturnedAmount,
    };
  }, [filteredData, imported, issued]);

  // React.useEffect(() => {
  //   getChequesByVinHandler();
  // }, [chassisNo]);

  return (
    <div>
      <button
        onClick={() => setShowFilter(!showFilter)}
        className="flex justify-end w-full"
      >
        {showFilter ? (
          <Minus className="cursor-pointer" />
        ) : (
          <Plus className="cursor-pointer" />
        )}
      </button>
      {showFilter && (
        // <div className="grid [grid-template-columns:1fr_1fr_1fr_0.5fr_0.5fr] gap-6 items-start justify-start mt-4">
        <div className="flex gap-9 items-start justify-start mt-4">
          {/* <div className="space-y-6 min-w-[140px] w-[340px] overflow-auto scrollbar-hide"> */}
          <div className="w-[300px] overflow-auto scrollbar-hide border border-gray-300 p-4 rounded-md relative h-[7rem]">
            {/* <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
                باکس 1
              </p> */}

            <div className="flex gap-4 overflow-auto min-w-[140px]">
              <SelectForFilterCheques
                data={["همه", ...sayadiIDOptions.filter(Boolean)]}
                title="شناسه صیادی"
                setSelectedSubject={setSelectedSayadiId}
                selectedValue={selectedSayadiId}
              />
              <SelectForFilterCheques
                data={["همه", ...chequeNumberOptions.filter(Boolean)]}
                title="سری چک"
                setSelectedSubject={setSelectedChequeNumber}
                selectedValue={selectedChequeNumber}
              />
              <SelectForFilterCheques
                data={["همه", ...chequeSerialOptions.filter(Boolean)]}
                title="سریال چک"
                setSelectedSubject={setSelectedChequeSerial}
                selectedValue={selectedChequeSerial}
              />
              <SelectForFilterCheques
                data={["همه", ...bankNameOptions.filter(Boolean)]}
                title="بانک"
                setSelectedSubject={setSelectedBank}
                selectedValue={selectedBank}
              />

              <SelectForFilterCheques
                data={["همه", ...branchNameOptions.filter(Boolean)]}
                title="شعبه"
                setSelectedSubject={setSelectedBranch}
                selectedValue={selectedBranch}
              />
            </div>
          </div>

          <div className="w-[300px] overflow-auto scrollbar-hide border border-gray-300 p-4 rounded-md h-[7rem]">
            {/* <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
                باکس 2
              </p> */}
            <div className="flex gap-4 items-center overflow-auto min-w-[140px]">
              {/* <div className="space-y-1">
                  <h3 className="text-sm font-bold mb-2 text-blue-900">
                    حداکثر مبلغ:
                  </h3>
                  <input type="text" className="border rounded w-[130px]" />
                </div> */}
              <SelectForFilterCheques
                data={["وارده", "صادره", "همه"]}
                title="نوع چک"
                setSelectedSubject={setSelectedChequeType}
                selectedValue={selectedChequeType}
              />

              {selectedChequeType === "وارده" ? (
                <div className="space-y-1">
                  <h3 className="text-sm font-bold mb-2 text-blue-900">
                    گیرنده چک:
                  </h3>
                  <input
                    type="text"
                    value="نمایشگاه خودرو"
                    className="border rounded w-[130px]"
                    onChange={() => setSelectedChequePayee("نمایشگاه خودرو")}
                  />
                </div>
              ) : (
                <SelectForFilterCheques
                  data={peopleList ?? []}
                  title="گیرنده چک"
                  setSelectedSubject={setSelectedChequePayee}
                  selectedValue={selectedChequePayee}
                />
              )}

              {selectedChequeType === "صادره" ? (
                <div className="space-y-1">
                  <h3 className="text-sm font-bold mb-2 text-blue-900">
                    صادرکننده چک:
                  </h3>
                  <input
                    type="text"
                    value="نمایشگاه خودرو"
                    className="border rounded w-[130px]"
                    onChange={() => setSelectedChequePayer("نمایشگاه خودرو")}
                  />
                </div>
              ) : (
                <SelectForFilterCheques
                  data={peopleList ?? []}
                  title="صادرکننده چک"
                  setSelectedSubject={setSelectedChequePayer}
                  selectedValue={selectedChequePayer}
                />
              )}

              {selectedChequeType === "مشتری" ? (
                <div className="space-y-1">
                  <h3 className="text-sm font-bold mb-2 text-blue-900">
                    مشتری:
                  </h3>
                  <input
                    type="text"
                    value="نمایشگاه خودرو"
                    className="border rounded w-[130px]"
                    onChange={() => setSelectedCustomer("نمایشگاه خودرو")}
                  />
                </div>
              ) : (
                <SelectForFilterCheques
                  data={peopleList ?? []}
                  title="مشتری"
                  setSelectedSubject={setSelectedCustomer}
                  selectedValue={selectedCustomer}
                />
              )}

              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-purple-700">
                  تاریخ سررسید چک:
                </h3>
                <RangeDatePicker dates={dueDates} setDates={setDueDates} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-blue-900">
                  حداقل مبلغ چک:
                </h3>
                <input
                  type="text"
                  value={minPrice?.toString()}
                  className="border rounded w-[130px]"
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-blue-900">
                  حداکثر مبلغ چک:
                </h3>
                <input
                  type="text"
                  value={maxPrice?.toString()}
                  className="border rounded w-[130px]"
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-purple-700">
                  تاریخ صدور چک:
                </h3>
                <RangeDatePicker dates={issueDates} setDates={setIssueDates} />
              </div>
            </div>
          </div>
          <div className="w-[300px] overflow-auto scrollbar-hide border border-gray-300 p-4 rounded-md h-[7rem]">
            {/* <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4 z-20">
                باکس 3
              </p> */}
            <div className="flex gap-4 overflow-auto min-w-[140px]">
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-purple-700">
                  تاریخ اقدام:
                </h3>

                <RangeDatePicker dates={actionDate} setDates={setActionDate} />
              </div>

              <SelectForFilterCheques
                data={["همه", ...CHEQUE_ACTIONS.map((el) => el.label)]}
                title="نوع اقدام"
                setSelectedSubject={setActionType}
                selectedValue={actionType}
              />

              <SelectForFilterCheques
                data={["همه", ...CHEQUE_LAST_STATUS.map((el) => el.label)]}
                title="آخرین وضعیت چک"
                setSelectedSubject={setChequeLastStatus}
                selectedValue={chequeLastStatus}
              />

              <div className="space-y-2 w-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium"
                >
                  توضیحات
                </label>
                <input
                  id="description"
                  placeholder="توضیحات"
                  value={chequeDescription}
                  className="w-[200px] px-3 py-1 border rounded-md"
                  onChange={(e) => setChequeDescription(e.target.value)}
                />
              </div>
              {/* <div className="space-y-1">
                  <h3 className="text-sm font-bold mb-2 text-purple-700">
                    تا تاریخ:
                  </h3>
                  <PersianDatePicker
                    value={toDate}
                    onChange={(date) => setToDate(date)}
                    placeholder="تا تاریخ"
                  />
                </div> */}
            </div>
          </div>

          {/* </div> */}

          <div className="space-y-3 flex flex-col w-48">
            <button
              onClick={handleResetFilters}
              className="border rounded-lg shadow-lg px-4 py-2 w-36 whitespace-nowrap cursor-pointer text-sm truncate"
            >
              حدف تمام فیلترها
            </button>
            <button
              disabled
              title="ارسال پیامک برای چک های این هفته"
              className="border rounded-lg shadow-lg px-4 py-2 w-52 whitespace-nowrap cursor-not-allowed text-sm truncate"
            >
              ارسال پیامک برای چک های این هفته
            </button>
            <button
              disabled
              title="ارسال پیامک برای چک های این ماه"
              className="border rounded-lg shadow-lg px-4 py-2 w-52 whitespace-nowrap cursor-not-allowed text-sm truncate"
            >
              ارسال پیامک برای چک های این ماه
            </button>
            <button
              disabled
              title="ارسال مشخصات چک های برگشتی برای مدیریت"
              className="border rounded-lg shadow-lg px-4 py-2 w-52 whitespace-nowrap cursor-not-allowed text-sm truncate"
            >
              ارسال مشخصات چک های برگشتی برای مدیریت
            </button>
          </div>
          <div className="space-y-3 border p-4 w-72 rounded">
            <button
              onClick={() => setChequeLastStatus("وصول نشده")}
              className="border rounded-lg shadow-lg px-4 py-2 whitespace-nowrap cursor-pointer text-sm"
            >
              تعداد چک های وصول نشده
            </button>
            <button
              onClick={() => setChequeLastStatus("برگشتی")}
              className="border rounded-lg shadow-lg px-4 py-2 whitespace-nowrap cursor-pointer text-sm"
            >
              تعداد چک های برگشتی
            </button>
            <button
              onClick={() => {
                const today = new DateObject();
                const oneMonthAgo = new DateObject({
                  date: today.toDate(),
                }).subtract(1, "month");

                setDueDates([oneMonthAgo, today]);
                setSelectedChequeType("وارده");
              }}
              className="border rounded-lg shadow-lg px-4 py-2 whitespace-nowrap cursor-pointer text-sm"
            >
              تعداد چک های وارده ماه جاری
            </button>
            <button
              onClick={() => {
                const today = new DateObject();
                const oneMonthAgo = new DateObject({
                  date: today.toDate(),
                }).subtract(1, "month");

                setDueDates([oneMonthAgo, today]);
                setSelectedChequeType("صادره");
              }}
              className="border rounded-lg shadow-lg px-4 py-2 whitespace-nowrap cursor-pointer text-sm"
            >
              تعداد چک های صادره ماه جاری
            </button>
            {/* <div className="flex items-center justify-between">
              <p>تعداد چک های وصول نشده:</p>
              <span className="text-sm">{stats.pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <p>تعداد چک های برگشتی:</p>
              <span className="text-sm">{stats.returned}</span>
            </div>
            <div className="flex items-center justify-between">
              <p>تعداد چک های وارده ماه جاری:</p>
              <span className="text-sm">{stats.importedThisMonth}</span>
            </div>
            <div className="flex items-center justify-between">
              <p>تعداد چک های صادره ماه جاری:</p>
              <span className="text-sm">{stats.issuedThisMonth}</span>
            </div> */}
          </div>
        </div>
      )}

      {/* /////////////////////////////// */}
      <div className="grid grid-cols-2 gap-6 items-start mt-7">
        <div>
          <div className="border border-gray-300 p-4 rounded-md relative w-full h-[30rem]">
            <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
              چک های صادره
            </p>
            <div className="max-h-[28rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-[10%] text-center">ردیف</TableHead>
                    <TableHead className="w-[50%] text-center">
                      نام مشتری
                    </TableHead>
                    <TableHead className="w-[30%] text-center">مبلغ</TableHead>
                    <TableHead className="w-[30%] text-center">
                      تاریخ سررسید
                    </TableHead>
                    <TableHead className="w-[30%] text-center">وضعیت</TableHead>
                    <TableHead className="w-[30%] text-center">
                      شناسه صیادی
                    </TableHead>
                    <TableHead className="w-[50%] text-center">
                      سریال چک
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {(issuedCheques ?? [])?.map((item, index) => (
                    <TableRow
                      key={`${item?.chequeNumber}-${index}`}
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center">
                        {item.payee?.fullName ?? item.payer?.fullName}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.amount?.toLocaleString("en-US")}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.dueDate}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.status}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.sayadiID}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.chequeNumber}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          {/* {totalIssuedAmount && (
            <p className="text-green-400 font-bold text-sm mt-3 text-left">
              {totalIssuedAmount?.toLocaleString("en-US")}
            </p>
          )} */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {/* <div className="flex items-center gap-2">
              <p className="text-sm">مجموع:</p>
              <span className="text-sm">
                {stats.totalIssuedAmount?.toLocaleString("en-US")}
              </span>
            </div> */}
            <div className="flex items-center gap-2">
              <p className="text-sm">صادره وصول نشده:</p>
              <span className="text-sm">
                {stats.totalIssuedPendingAmount?.toLocaleString("en-US")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm">صادره وصول شده:</p>
              <span className="text-sm">
                {stats.totalIssuedPaidAmount?.toLocaleString("en-US")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm">صادره برگشتی:</p>
              <span className="text-sm">
                {stats.totalIssuedReturnedAmount?.toLocaleString("en-US")}
              </span>
            </div>
          </div>
        </div>
        <div>
          <div className="border border-gray-300 p-4 rounded-md relative w-full h-[30rem]">
            <p className="text-red-500 absolute right-2 -top-5 bg-white py-2 px-4">
              چک های وارده
            </p>
            <div className="max-h-[28rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-[10%] text-center">ردیف</TableHead>
                    <TableHead className="w-[50%] text-center">
                      نام مشتری
                    </TableHead>
                    <TableHead className="w-[30%] text-center">مبلغ</TableHead>
                    <TableHead className="w-[30%] text-center">
                      تاریخ سررسید
                    </TableHead>
                    <TableHead className="w-[30%] text-center">وضعیت</TableHead>
                    <TableHead className="w-[30%] text-center">
                      شناسه صیادی
                    </TableHead>
                    <TableHead className="w-[50%] text-center">
                      سریال چک
                    </TableHead>
                    <TableHead className="w-[50%] text-center">
                      عملیات
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {(importedCheques ?? [])?.map((item, index) => (
                    <TableRow
                      key={`${item?.chequeNumber}-${index}`}
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center">
                        {/* {item.ShowroomAccountCard ?? item.CustomerName} */}
                        {item.payee?.fullName ?? item.payer?.fullName}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.amount?.toLocaleString("en-US")}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.dueDate}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.status}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.sayadiID}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.chequeNumber}
                      </TableCell>
                      <TableCell className="text-center flex gap-3 items-center justify-center">
                        <Pencil
                          className="w-4 h-4 cursor-pointer hover:text-indigo-500"
                          onClick={() => {
                            setIsOpenEditModal(true);
                            setChequeId(item._id);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          {/* {totalImportedAmount && ( */}
          {/* //{" "}
          <p className="text-red-400 font-bold text-sm mt-3 text-left">
            // {totalImportedAmount?.toLocaleString("en-US")}
            //{" "}
          </p> */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {/* <div className="flex items-center gap-2">
              <p className="text-sm">مجموع:</p>
              <span className="text-sm">
                {stats.totalImportedAmount?.toLocaleString("en-US")}
              </span>
            </div> */}
            <div className="flex items-center gap-2">
              <p className="text-sm">وارده وصول نشده:</p>
              <span className="text-sm">
                {stats.totalImportedPendingAmount?.toLocaleString("en-US")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm">وارده وصول شده:</p>
              <span className="text-sm">
                {stats.totalImportedPaidAmount?.toLocaleString("en-US")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm">وارده برگشتی:</p>
              <span className="text-sm">
                {stats.totalImportedReturnedAmount?.toLocaleString("en-US")}
              </span>
            </div>
          </div>
          {/* )} */}
        </div>
      </div>
      {isOpenEditModal && (
        <ChequeFormModal
          chequeId={chequeId ?? ""}
          setIsOpenEditModal={setIsOpenEditModal}
        />
      )}
    </div>
  );
};

export default CheckDashboard;
