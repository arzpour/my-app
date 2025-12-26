"use client";
import CheckDashboard from "@/components/checkDashboard";
import CustomersDashboard from "@/components/customersDashboard";
// import FinanciersDashboard from "@/components/financiersDashboard";
import OperatorsDashboard from "@/components/operatorsDashboard";
// import TransactionDashboard from "@/components/transactionDashboard";
import VehicleDashboard from "@/components/vehicleDashboard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FormSelectorModal from "./forms/formSelectorModal";
import React from "react";
import VehicleList from "./vehicleList";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
// import OptionForm from "./forms/optionForm";

const tabs = [
  {
    id: "vehicleDashboard",
    title: "داشبورد وسیله نقلیه",
    content: <VehicleDashboard />,
  },
  {
    id: "customersDashboard",
    title: "داشبورد مشتریان",
    content: <CustomersDashboard />,
  },
  {
    id: "checkDashboard",
    title: "داشبورد چک",
    content: <CheckDashboard />,
  },
  {
    id: "operatorsDashboard",
    title: "داشبورد کارگزاران",
    content: <OperatorsDashboard />,
  },
  // {
  //   id: "financiersDashboard",
  //   title: "داشبورد سرمایه گزاران",
  //   content: <FinanciersDashboard />,
  // },
  // {
  //   id: "transactionDashboard",
  //   title: "گزارش تراکنش ها",
  //   content: <TransactionDashboard />,
  // },
  {
    id: "vehicleList",
    title: "فهرست وسایل نقلیه",
    content: <VehicleList />,
  },
];

const TabsComponent = () => {
  const [activeTab, setActiveTab] = React.useState<string>("vehicleDashboard");
  const [formModalOpen, setFormModalOpen] = React.useState(false);

  return (
    <div suppressHydrationWarning className="relative">
      <FormSelectorModal open={formModalOpen} onOpenChange={setFormModalOpen} />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        orientation="vertical"
        className="h-full w-full flex justify-start items-start"
        dir="rtl"
      >
        <TabsList>
          <div className="flex justify-between items-center">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="bg-gray-100 cursor-pointer"
              >
                {tab.title}
              </TabsTrigger>
            ))}
          </div>
            <button
              onClick={() => setFormModalOpen(true)}
              className="text-sm bg-gray-100 cursor-pointer px-6 py-1 rounded-lg text-black transition-colors duration-200 flex items-center gap-2"
            >
              <span>ثبت اطلاعات</span>
            </button>
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
        {/* {formTabs.map((tab) => (
          <TabsContent
            key={tab.id}
            value={tab.id}
            className="w-full bg-white rounded-2xl"
          >
            {tab.content}
          </TabsContent>
        ))} */}
      </Tabs>
    </div>
  );
};

export default TabsComponent;
