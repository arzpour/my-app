// "use client";

// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { ArrowRightIcon, ArrowLeftIcon } from "lucide-react";
// import PeopleList from "../lists/peopleList";
// import BusinessAccountList from "../lists/businessAccountList";

// type FormType = "peoples" | "business_accounts" | null;

// interface FormSelectorModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// const ListSelectorModal: React.FC<FormSelectorModalProps> = ({
//   open,
//   onOpenChange,
// }) => {
//   const [selectedForm, setSelectedForm] = React.useState<FormType>(null);

//   const forms = [
//     { id: "peoples", title: "لیست افراد", icon: "/7.png" },
//     {
//       id: "business_accounts",
//       title: "لیست حساب بانکی",
//       icon: "/4.png",
//     },
//   ];

//   const handleFormSelect = (formId: string) => {
//     setSelectedForm(formId as FormType);
//   };

//   const handleBack = () => {
//     setSelectedForm(null);
//   };

//   const handleClose = () => {
//     setSelectedForm(null);
//     onOpenChange(false);
//   };

//   const renderForm = () => {
//     switch (selectedForm) {
//       case "peoples":
//         return (
//           <div className="p-4">
//             <PeopleList  />
//           </div>
//         );
//       case "business_accounts":
//         return (
//           <div className="p-4">
//             <BusinessAccountList />
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={handleClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//         <div dir="rtl">
//           {!selectedForm ? (
//             <>
//               <DialogHeader>
//                 <DialogTitle className="!text-base !font-semibold text-gray-800">
//                   لیست مورد نظر خود را انتخاب کنید
//                 </DialogTitle>
//               </DialogHeader>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
//                 {forms.map((form) => (
//                   <button
//                     key={form.id}
//                     onClick={() => handleFormSelect(form.id)}
//                     className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-all text-right"
//                   >
//                     {/* <span className="text-xl">{form.icon}</span> */}
//                     {/* <Image
//                       alt={`${form.icon}-icon`}
//                       src={form.icon ?? ""}
//                       width={500}
//                       height={500}
//                     /> */}
//                     <img
//                       alt={`${form.icon}-icon`}
//                       src={form.icon ?? ""}
//                       className="w-12 h-9"
//                     />
//                     <span className="flex-1 text-base font-medium">
//                       {form.title}
//                     </span>
//                     <ArrowLeftIcon className="size-4 text-gray-400" />
//                   </button>
//                 ))}
//               </div>
//             </>
//           ) : (
//             <>
//               <DialogHeader>
//                 <div className="flex items-center gap-4">
//                   <button
//                     onClick={handleBack}
//                     className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
//                   >
//                     <ArrowRightIcon className="size-4" />
//                     {/* <span>بازگشت</span> */}
//                   </button>
//                   <DialogTitle className="flex-1 !text-lg !font-bold !text-gray-800">
//                     {forms.find((f) => f.id === selectedForm)?.title}
//                   </DialogTitle>
//                 </div>
//               </DialogHeader>
//               <div className="mt-4">{renderForm()}</div>
//             </>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ListSelectorModal;
