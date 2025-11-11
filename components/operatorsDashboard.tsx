// "use client"
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// // import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// const operators = [
//   "حسین خلیلی",
//   "حسین خلیلی",
//   "حسین خلیلی",
//   "حسین خلیلی",
//   "حسین خلیلی",
//   "حسین خلیلی",
// ];

// const items = [
//   {
//     id: "1",
//     price: "100002844",
//     date: "1404/04/30",
//     paymentWay: "کارت به کارت",
//     cart: "امید ولیزاده",
//     etc: "",
//   },
//   {
//     id: "1",
//     price: "100002844",
//     date: "1404/04/30",
//     paymentWay: "کارت به کارت",
//     cart: "امید ولیزاده",
//     etc: "",
//   },
//   {
//     id: "1",
//     price: "100002844",
//     date: "1404/04/30",
//     paymentWay: "کارت به کارت",
//     cart: "امید ولیزاده",
//     etc: "",
//   },
//   {
//     id: "1",
//     price: "100002844",
//     date: "1404/04/30",
//     paymentWay: "کارت به کارت",
//     cart: "امید ولیزاده",
//     etc: "",
//   },
//   {
//     id: "1",
//     price: "100002844",
//     date: "1404/04/30",
//     paymentWay: "کارت به کارت",
//     cart: "امید ولیزاده",
//     etc: "",
//   },
//   {
//     id: "1",
//     price: "100002844",
//     date: "1404/04/30",
//     paymentWay: "کارت به کارت",
//     cart: "امید ولیزاده",
//     etc: "",
//   },
//   {
//     id: "1",
//     price: "100002844",
//     date: "1404/04/30",
//     paymentWay: "کارت به کارت",
//     cart: "امید ولیزاده",
//     etc: "",
//   },
//   {
//     id: "1",
//     price: "100002844",
//     date: "1404/04/30",
//     paymentWay: "کارت به کارت",
//     cart: "امید ولیزاده",
//     etc: "",
//   },
//   {
//     id: "1",
//     price: "100002844",
//     date: "1404/04/30",
//     paymentWay: "کارت به کارت",
//     cart: "امید ولیزاده",
//     etc: "",
//   },
//   {
//     id: "1",
//     price: "100002844",
//     date: "1404/04/30",
//     paymentWay: "کارت به کارت",
//     cart: "امید ولیزاده",
//     etc: "",
//   },
//   {
//     id: "1",
//     price: "100002844",
//     date: "1404/04/30",
//     paymentWay: "کارت به کارت",
//     cart: "امید ولیزاده",
//     etc: "",
//   },
//   {
//     id: "1",
//     price: "100002844",
//     date: "1404/04/30",
//     paymentWay: "کارت به کارت",
//     cart: "امید ولیزاده",
//     etc: "",
//   },
//   {
//     id: "1",
//     price: "100002844",
//     date: "1404/04/30",
//     paymentWay: "کارت به کارت",
//     cart: "امید ولیزاده",
//     etc: "",
//   },
//   {
//     id: "1",
//     price: "100002844",
//     date: "1404/04/30",
//     paymentWay: "کارت به کارت",
//     cart: "امید ولیزاده",
//     etc: "",
//   },
//   {
//     id: "1",
//     price: "100002844",
//     date: "1404/04/30",
//     paymentWay: "کارت به کارت",
//     cart: "امید ولیزاده",
//     etc: "",
//   },
//   {
//     id: "1",
//     price: "100002844",
//     date: "1404/04/30",
//     paymentWay: "کارت به کارت",
//     cart: "امید ولیزاده",
//     etc: "",
//   },
//   {
//     id: "1",
//     price: "100002844",
//     date: "1404/04/30",
//     paymentWay: "کارت به کارت",
//     cart: "امید ولیزاده",
//     etc: "",
//   },
//   {
//     id: "1",
//     price: "100002844",
//     date: "1404/04/30",
//     paymentWay: "کارت به کارت",
//     cart: "امید ولیزاده",
//     etc: "",
//   },
//   {
//     id: "1",
//     price: "100002844",
//     date: "1404/04/30",
//     paymentWay: "کارت به کارت",
//     cart: "امید ولیزاده",
//     etc: "",
//   },
// ];
// const TabsTableComponent = () => {
//   return (
//     <div className="max-h-[28rem] h-[28rem] overflow-y-auto rounded-md border w-full">
//       <div className="overflow-x-auto">
//         <Table className="min-w-max text-right border-collapse">
//           <TableHeader className="top-0 sticky">
//             <TableRow className="bg-gray-100">
//               <TableHead className="w-12 text-center">ردیف</TableHead>
//               <TableHead className="w-32 text-center">مبلغ</TableHead>
//               <TableHead className="w-32 text-center">تاریخ</TableHead>
//               <TableHead className="w-32 text-center">روش پرداخت</TableHead>
//               <TableHead className="w-32 text-center">کارت</TableHead>
//               <TableHead className="w-32 text-center">...</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {items.map((item, index) => (
//               <TableRow
//                 key={`${item.id}-${index}`}
//                 className="hover:bg-gray-50"
//               >
//                 <TableCell className="text-center">{item.id}</TableCell>
//                 <TableCell className="text-center">{item.price}</TableCell>
//                 <TableCell className="text-center">{item.date}</TableCell>
//                 <TableCell className="text-center">{item.paymentWay}</TableCell>
//                 <TableCell className="text-center">{item.cart}</TableCell>
//                 <TableCell className="text-center">{item.etc}</TableCell>
//               </TableRow>
//             ))}
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
//     content: TabsTableComponent(),
//   },
//   {
//     id: "operatorPerformanceReport",
//     title: "جزییات گزارش عملکرد کارگزار",
//     content: TabsTableComponent(),
//   },
// ];

// const OperatorsDashboard = () => {

//     const { data: getAllCategoryWithOptionSettings } =
//       useGetAllCategoryWithOptionSettings();
//   const operatorsNameOptions = getAllCategoryWithOptionSettings?.filter(
//     (item) => item.category === "operators"
//   );
//   return (
//     <div>
//       <div className="flex justify-end">
//         <span className="p-2 bg-gray-200 rounded-t-md text-xs">1404</span>
//       </div>
//       <div className="border p-4">
//         <div className="grid [grid-template-columns:1fr_1fr_1.5fr_1fr_1fr] gap-6 items-start">
//           <div className="space-y-1">
//             <h3 className="text-var(--title) text-sm font-bold mb-2 text-blue-900">
//               انتخاب کارگزار:
//             </h3>
//             <Select>
//               <SelectTrigger className="w-[120px] text-sm">
//                 <SelectValue placeholder="66545" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   {operatorsNameOptions.map((item, index) => (
//                     <SelectItem key={`${item}-${index}`} value="حسین خلیلی">
//                       {item}
//                     </SelectItem>
//                   ))}
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           </div>
//           <div>
//             <div className="space-y-1 flex items-center gap-4">
//               <h3 className="text-sm text-blue-900 font-bold">مجموع خرید:</h3>
//               <p className="text-sm font-medium">334122334</p>
//             </div>
//             <div className="space-y-1 flex items-center gap-4">
//               <h3 className="text-sm text-blue-900 font-bold">مجموع فروش:</h3>
//               <p className="text-sm font-medium">334122334</p>
//             </div>
//           </div>
//           <div className="flex justify-between items-start">
//             <div>
//               <div className="space-y-1 flex items-center gap-4">
//                 <h3 className="text-sm text-blue-900 font-bold">
//                   مجموع سود خ:
//                 </h3>
//                 <p className="text-sm font-medium">334122334</p>
//               </div>
//               <div>
//                 <div className="space-y-1 flex items-center gap-4">
//                   <h3 className="text-sm text-blue-900 font-bold">
//                     مجموع سود ف:
//                   </h3>
//                   <p className="text-sm font-medium">334122334</p>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <p className="text-sm text-purple-500">
//                 `میانگین درصد کارمزد خرید
//               </p>
//               <p className="text-sm text-purple-500">
//                 `میانگین درصد کارمزد فروش
//               </p>
//             </div>
//           </div>
//           <div className="flex justify-between items-start">
//             <div>
//               <div className="space-y-1 flex items-center gap-4">
//                 <h3 className="text-sm text-blue-900 font-bold">
//                   مجموع کارمزد خ:
//                 </h3>
//                 <p className="text-sm font-medium">334122334</p>
//               </div>
//               <div>
//                 <div className="space-y-1 flex items-center gap-4">
//                   <h3 className="text-sm text-blue-900 font-bold">
//                     مجموع کارمزد ف:
//                   </h3>
//                   <p className="text-sm font-medium">334122334</p>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <p className="text-xs text-green-700">(2)</p>
//               <p className="text-xs text-green-700">(120)</p>
//             </div>
//           </div>
//           <div>
//             <div className="space-y-1 flex items-center gap-4">
//               <h3 className="text-sm text-blue-900 font-bold">
//                 مجموع کل کارمزد:
//               </h3>
//               <p className="text-sm font-medium text-purple-600">334122334</p>
//             </div>
//             <div>
//               <div className="space-y-1 flex items-center gap-4">
//                 <h3 className="text-sm text-blue-900 font-bold">
//                   مانده کارمزد:
//                 </h3>
//                 <p className="text-sm font-medium text-red-500">334122334</p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="grid [grid-template-columns:2fr_1fr] gap-6 items-start mt-7">
//           <div className="border border-gray-300 p-4 rounded-md relative w-full">
//             <p className="text-blue-500 absolute left-2 -top-5 bg-white py-2 px-4 font-bold">
//               گزارش انفرادی کارگزاران
//             </p>
//             <div className="grid grid-cols-2 gap-4 items-start mt-5">
//               <div>
//                 <RadioGroup
//                   defaultValue="sell"
//                   className="flex gap-6 justify-end text-blue-500 mb-4"
//                 >
//                   <div className="flex items-center gap-2">
//                     <RadioGroupItem value="buy" id="r1" />
//                     <label htmlFor="r1" className="text-blue-500">
//                       خرید
//                     </label>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <RadioGroupItem value="sell" id="r2" />
//                     <label htmlFor="r2" className="text-blue-500">
//                       فروش
//                     </label>
//                   </div>
//                 </RadioGroup>
//                 <div className="border border-gray-300 p-4 rounded-md relative w-full">
//                   <p className="absolute left-2 -top-5 bg-white py-2 px-4 font-bold">
//                     گزارش خلاصه عملکرد
//                   </p>
//                   <div className="max-h-[28rem] overflow-y-auto rounded-md w-full grid grid-cols-2 gap-6 items-start p-4">
//                     <div className="space-y-5">
//                       <div>
//                         <div className="flex gap-4 items-start">
//                           <p className="text-orange-500 text-sm">فروردین</p>
//                           <p className="text-yellow-900 font-medium text-sm">
//                             0
//                           </p>
//                         </div>
//                         <p className="font-medium text-sm">0</p>
//                       </div>
//                       <div>
//                         <div className="flex gap-4 items-start">
//                           <p className="text-orange-500 text-sm">اردیبهشت</p>
//                           <p className="text-yellow-900 font-medium text-sm">
//                             0
//                           </p>
//                         </div>
//                         <p className="font-medium text-sm">0</p>
//                       </div>
//                       <div>
//                         <div className="flex gap-4 items-start">
//                           <p className="text-orange-500 text-sm">خرداد</p>
//                           <p className="text-yellow-900 font-medium text-sm">
//                             0
//                           </p>
//                         </div>
//                         <p className="font-medium text-sm">0</p>
//                       </div>
//                       <div>
//                         <div className="flex gap-4 items-start">
//                           <p className="text-orange-500 text-sm">تیر</p>
//                           <p className="text-yellow-900 font-medium text-sm">
//                             0
//                           </p>
//                         </div>
//                         <p className="font-medium text-sm">0</p>
//                       </div>
//                       <div>
//                         <div className="flex gap-4 items-start">
//                           <p className="text-orange-500 text-sm">مرداد</p>
//                           <p className="text-yellow-900 font-medium text-sm">
//                             0
//                           </p>
//                         </div>
//                         <p className="font-medium text-sm">0</p>
//                       </div>
//                       <div>
//                         <div className="flex gap-4 items-start">
//                           <p className="text-orange-500 text-sm">شهریور</p>
//                           <p className="text-yellow-900 font-medium text-sm">
//                             0
//                           </p>
//                         </div>
//                         <p className="font-medium text-sm">0</p>
//                       </div>
//                     </div>
//                     <div className="space-y-5">
//                       <div>
//                         <div className="flex gap-4 items-start">
//                           <p className="text-blue-500 text-sm">مهر</p>
//                           <p className="text-yellow-900 font-medium text-sm">
//                             0
//                           </p>
//                         </div>
//                         <p className="font-medium text-sm">0</p>
//                       </div>
//                       <div>
//                         <div className="flex gap-4 items-start">
//                           <p className="text-blue-500 text-sm">آبان</p>
//                           <p className="text-yellow-900 font-medium text-sm">
//                             0
//                           </p>
//                         </div>
//                         <p className="font-medium text-sm">0</p>
//                       </div>
//                       <div>
//                         <div className="flex gap-4 items-start">
//                           <p className="text-blue-500 text-sm">آذر</p>
//                           <p className="text-yellow-900 font-medium text-sm">
//                             0
//                           </p>
//                         </div>
//                         <p className="font-medium text-sm">0</p>
//                       </div>
//                       <div>
//                         <div className="flex gap-4 items-start">
//                           <p className="text-blue-500 text-sm">دی</p>
//                           <p className="text-yellow-900 font-medium text-sm">
//                             0
//                           </p>
//                         </div>
//                         <p className="font-medium text-sm">0</p>
//                       </div>
//                       <div>
//                         <div className="flex gap-4 items-start">
//                           <p className="text-blue-500 text-sm">بهمن</p>
//                           <p className="text-yellow-900 font-medium text-sm">
//                             0
//                           </p>
//                         </div>
//                         <p className="font-medium text-sm">0</p>
//                       </div>
//                       <div>
//                         <div className="flex gap-4 items-start">
//                           <p className="text-blue-500 text-sm">اسفند</p>
//                           <p className="text-yellow-900 font-medium text-sm">
//                             0
//                           </p>
//                         </div>
//                         <p className="font-medium text-sm">0</p>
//                       </div>
//                     </div>
//                   </div>
//                   <hr />
//                   <h4 className="text-green-700 flex justify-end font-semibold text-base my-2">
//                     اطلاعات کل سال
//                   </h4>
//                   <div className="space-y-3">
//                     <div className="flex gap-4 items-start justify-between w-full">
//                       <p className="font-medium">مجموع خرید/فروش شما:</p>
//                       <p className="font-medium">2344222</p>
//                     </div>
//                     <div className="flex gap-4 items-start justify-between w-full">
//                       <p className="font-medium">تعداد خرید/فروش:</p>
//                       <p className="font-medium">11134343</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <Tabs
//                   defaultValue="operationTransaction"
//                   orientation="vertical"
//                   className="h-full w-full flex justify-end items-end"
//                   dir="rtl"
//                 >
//                   <TabsList>
//                     {tabs.map((tab) => (
//                       <TabsTrigger
//                         key={tab.id}
//                         value={tab.id}
//                         className="bg-gray-100 cursor-pointer"
//                       >
//                         {tab.title}
//                       </TabsTrigger>
//                     ))}
//                   </TabsList>

//                   {tabs.map((tab) => (
//                     <TabsContent
//                       key={tab.id}
//                       value={tab.id}
//                       className="w-full bg-white rounded-2xl"
//                     >
//                       {tab.content}
//                     </TabsContent>
//                   ))}
//                 </Tabs>
//                 <div className="flex justify-between items-center mt-4">
//                   <p className="text-blue-700 font-bold">
//                     مجموع مبالغ پرداخت شده به کارگزار
//                   </p>
//                   <p className="text-green-700 font-bold text-sm">4387757733</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="border border-gray-300 p-4 rounded-md relative w-full">
//             <p className="text-blue-500 absolute left-2 -top-5 bg-white py-2 px-4">
//               کارگزاران برتر
//             </p>
//             <RadioGroup
//               defaultValue="sell"
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
//             <div className="border border-gray-300 p-4 rounded-md relative w-full bg-pink-200">
//               <p className="text-blue-500 absolute left-2 -top-5 py-2 rounded-md bg-pink-200 px-4">
//                 لیست ماهانه
//               </p>

//               <div className="w-full">
//                 <p className="text-green-600 font-semibold">
//                   نمایش لیست سالانه
//                 </p>
//                 <div className="grid grid-cols-4 space-y-5 mt-2">
//                   <div>
//                     <div className="text-sm text-green-600">فروردین</div>
//                     <div className="text-sm text-green-600">اردیبهشت</div>
//                     <div className="text-sm text-green-600">خرداد</div>
//                   </div>
//                   <div>
//                     <div className="text-sm text-green-600">تیر</div>
//                     <div className="text-sm text-green-600">مرداد</div>
//                     <div className="text-sm text-green-600">شهریور</div>
//                   </div>
//                   <div>
//                     <div className="text-sm text-green-600">مهر</div>
//                     <div className="text-sm text-green-600">آبان</div>
//                     <div className="text-sm text-green-600">آذر</div>
//                   </div>
//                   <div>
//                     <div className="text-sm text-green-600">دی</div>
//                     <div className="text-sm text-green-600">بهمن</div>
//                     <div className="text-sm text-green-600">اسفند</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OperatorsDashboard;

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
import useGetAllCars from "@/hooks/useGetAllCars";
import useGetAllTransactions from "@/hooks/useGetAllTransaction";
import { useGetOperatorPercent } from "@/apis/mutations/detailsByChassisNo";

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
  const { data: allCars } = useGetAllCars();
  const { data: allTransactions } = useGetAllTransactions();
  const getOperatorPercent = useGetOperatorPercent();

  // Get operators from settings
  const operatorsNameOptions =
    getAllCategoryWithOptionSettings?.filter(
      (item) => item.category === "operators"
    ) || [];

  const operatorOptions =
    operatorsNameOptions?.[0]?.options?.filter(Boolean) || [];

  // Get operator percentages
  React.useEffect(() => {
    if (operatorOptions.length > 0) {
      getOperatorPercent.mutateAsync().catch(console.error);
    }
  }, [operatorOptions.length]);

  const operatorPercentData = getOperatorPercent.data;

  // Filter cars by selected operator
  const filteredCars = React.useMemo(() => {
    if (!selectedOperator || !allCars) return [];
    return allCars.filter(
      (car) =>
        normalize(car.PurchaseBroker) === normalize(selectedOperator) ||
        normalize(car.SaleBroker) === normalize(selectedOperator)
    );
  }, [selectedOperator, allCars]);

  // Get operator percent for selected operator
  const selectedOperatorPercent = React.useMemo(() => {
    if (!selectedOperator || !operatorPercentData?.data) return null;
    return operatorPercentData.data.find(
      (item) => normalize(item.name) === normalize(selectedOperator)
    );
  }, [selectedOperator, operatorPercentData]);

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (!filteredCars.length) {
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

    // Calculate totals
    const totalPurchase = filteredCars.reduce(
      (sum, car) => sum + (car.PurchaseAmount || 0),
      0
    );
    const totalSale = filteredCars.reduce(
      (sum, car) => sum + (car.SaleAmount || 0),
      0
    );

    // Calculate profits and commissions
    let totalProfitPurchase = 0;
    let totalProfitSale = 0;
    let totalCommissionPurchase = 0;
    let totalCommissionSale = 0;
    let purchaseCount = 0;
    let saleCount = 0;

    filteredCars.forEach((car) => {
      const isPurchaseBroker =
        normalize(car.PurchaseBroker) === normalize(selectedOperator);
      const isSaleBroker =
        normalize(car.SaleBroker) === normalize(selectedOperator);

      if (car.PurchaseAmount && car.SaleAmount) {
        // Profit = Sale - Purchase (what you sell for minus what you bought for)
        const profit = car.SaleAmount - car.PurchaseAmount;

        if (isPurchaseBroker && selectedOperatorPercent && profit > 0) {
          // Commission is calculated from profit
          const commission =
            profit * (selectedOperatorPercent.buyPercent / 100);
          totalProfitPurchase += profit;
          totalCommissionPurchase += commission;
          purchaseCount++;
        }

        if (isSaleBroker && selectedOperatorPercent && profit > 0) {
          // Commission is calculated from profit
          const commission =
            profit * (selectedOperatorPercent.sellPercent / 100);
          totalProfitSale += profit;
          totalCommissionSale += commission;
          saleCount++;
        }
      }
    });

    const totalCommission = totalCommissionPurchase + totalCommissionSale;
    const avgPercentPurchase =
      purchaseCount > 0 ? selectedOperatorPercent?.buyPercent || 0 : 0;
    const avgPercentSale =
      saleCount > 0 ? selectedOperatorPercent?.sellPercent || 0 : 0;

    // Get transactions where Broker field exists (payments made to operator)
    const operatorTransactions =
      allTransactions?.filter((t) => t.Broker && t.Broker > 0) || [];
    const totalPaidToOperator = operatorTransactions.reduce(
      (sum, t) => sum + (t.Broker || 0),
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
    filteredCars,
    selectedOperator,
    selectedOperatorPercent,
    allTransactions,
  ]);

  // Calculate monthly breakdown
  const monthlyData = React.useMemo(() => {
    const months: Record<number, { count: number; totalAmount: number }> = {};

    // Initialize all months
    for (let i = 1; i <= 12; i++) {
      months[i] = { count: 0, totalAmount: 0 };
    }

    filteredCars.forEach((car) => {
      const isPurchaseBroker =
        normalize(car.PurchaseBroker) === normalize(selectedOperator);
      const isSaleBroker =
        normalize(car.SaleBroker) === normalize(selectedOperator);

      let dateStr = "";
      let amount = 0;

      if (reportType === "buy" && isPurchaseBroker) {
        dateStr = car.PurchaseDate || "";
        amount = car.PurchaseAmount || 0;
      } else if (reportType === "sell" && isSaleBroker) {
        dateStr = car.SaleDate || "";
        amount = car.SaleAmount || 0;
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
  }, [filteredCars, selectedOperator, reportType]);

  // Get transactions for operator (payments made)
  const operatorTransactions = React.useMemo(() => {
    if (!selectedOperator || !allTransactions) return [];
    // Filter transactions where Broker field exists
    return (
      allTransactions
        ?.filter((t) => t.Broker && t.Broker > 0)
        .map((t, index) => ({
          id: (index + 1).toString(),
          price: t.Broker?.toLocaleString("en-US") || "0",
          date: t.TransactionDate || "",
          paymentWay: t.TransactionMethod || "",
          cart: t.ShowroomCard || "",
          etc: t.Notes || "",
        })) || []
    );
  }, [selectedOperator, allTransactions]);

  const TabsTableComponent = () => {
    return (
      <div className="max-h-[28rem] h-[28rem] overflow-y-auto rounded-md border w-full">
        <div className="overflow-x-auto">
          <Table className="min-w-max text-right border-collapse">
            <TableHeader className="top-0 sticky">
              <TableRow className="bg-gray-100">
                <TableHead className="w-12 text-center">ردیف</TableHead>
                <TableHead className="w-32 text-center">مبلغ</TableHead>
                <TableHead className="w-32 text-center">تاریخ</TableHead>
                <TableHead className="w-32 text-center">روش پرداخت</TableHead>
                <TableHead className="w-32 text-center">کارت</TableHead>
                <TableHead className="w-32 text-center">...</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {operatorTransactions.length > 0 ? (
                operatorTransactions.map((item, index) => (
                  <TableRow
                    key={`${item.id}-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <TableCell className="text-center">{item.id}</TableCell>
                    <TableCell className="text-center">{item.price}</TableCell>
                    <TableCell className="text-center">{item.date}</TableCell>
                    <TableCell className="text-center">
                      {item.paymentWay}
                    </TableCell>
                    <TableCell className="text-center">{item.cart}</TableCell>
                    <TableCell className="text-center">{item.etc}</TableCell>
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
      content: <TabsTableComponent />,
    },
    {
      id: "operatorPerformanceReport",
      title: "جزییات گزارش عملکرد کارگزار",
      content: <TabsTableComponent />,
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
        <div className="grid [grid-template-columns:1fr_1fr_1.5fr_1fr_1fr] gap-6 items-start">
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
                  مجموع سود خ:
                </h3>
                <p className="text-sm font-medium">
                  {stats.totalProfitPurchase.toLocaleString("en-US")}
                </p>
              </div>
              <div>
                <div className="space-y-1 flex items-center gap-4">
                  <h3 className="text-sm text-blue-900 font-bold">
                    مجموع سود ف:
                  </h3>
                  <p className="text-sm font-medium">
                    {stats.totalProfitSale.toLocaleString("en-US")}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-purple-500">
                میانگین درصد کارمزد خرید: {stats.avgPercentPurchase}%
              </p>
              <p className="text-sm text-purple-500">
                میانگین درصد کارمزد فروش: {stats.avgPercentSale}%
              </p>
            </div>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <div className="space-y-1 flex items-center gap-4">
                <h3 className="text-sm text-blue-900 font-bold">
                  مجموع کارمزد خ:
                </h3>
                <p className="text-sm font-medium">
                  {stats.totalCommissionPurchase.toLocaleString("en-US")}
                </p>
              </div>
              <div>
                <div className="space-y-1 flex items-center gap-4">
                  <h3 className="text-sm text-blue-900 font-bold">
                    مجموع کارمزد ف:
                  </h3>
                  <p className="text-sm font-medium">
                    {stats.totalCommissionSale.toLocaleString("en-US")}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-green-700">
                ({stats.avgPercentPurchase})
              </p>
              <p className="text-xs text-green-700">({stats.avgPercentSale})</p>
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
        <div className="grid [grid-template-columns:2fr_1fr] gap-6 items-start mt-7">
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
