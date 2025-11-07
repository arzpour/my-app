// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import SecretaryForm from "./forms/secretaryForm";
// import VehicleList from "./vehicleList";

// const tabs = [
//   {
//     id: "vehicleList",
//     title: "لیست خودروها",
//     content: <VehicleList />,
//   },
//   {
//     id: "secretaryForm",
//     title: "فرم",
//     content: <SecretaryForm />,
//   },
// ];

// const TabsForSecretary = () => {
//   return (
//     <Tabs
//       defaultValue="vehicleList"
//       orientation="vertical"
//       className="h-full w-full flex justify-start items-start"
//       dir="rtl"
//     >
//       <TabsList>
//         {tabs.map((tab) => (
//           <TabsTrigger
//             key={tab.id}
//             value={tab.id}
//             className="bg-gray-100 cursor-pointer"
//           >
//             {tab.title}
//           </TabsTrigger>
//         ))}
//       </TabsList>

//       {tabs.map((tab) => (
//         <TabsContent
//           key={tab.id}
//           value={tab.id}
//           className="w-full bg-white rounded-2xl"
//         >
//           {tab.content}
//         </TabsContent>
//       ))}
//     </Tabs>
//   );
// };

// export default TabsForSecretary;
