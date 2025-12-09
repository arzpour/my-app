"use client";
import CheckDashboard from "@/components/checkDashboard";
import CustomersDashboard from "@/components/customersDashboard";
import FinanciersDashboard from "@/components/financiersDashboard";
import OperatorsDashboard from "@/components/operatorsDashboard";
import TransactionDashboard from "@/components/transactionDashboard";
import VehicleDashboard from "@/components/vehicleDashboard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TransactionForm from "./forms/transactionForm";
import ChequeForm from "./forms/chequeForm";
import React from "react";
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
  {
    id: "financiersDashboard",
    title: "داشبورد سرمایه گزاران",
    content: <FinanciersDashboard />,
  },
  {
    id: "transactionDashboard",
    title: "گزارش تراکنش ها",
    content: <TransactionDashboard />,
  },
];

const formTabs = [
  {
    id: "transactionTab",
    title: "فرم تراکنش",
    content: <TransactionForm />,
  },
  {
    id: "chequeTab",
    title: "فرم چک",
    content: <ChequeForm />,
  },
  // {
  //   id: "optionTab",
  //   title: "فرم آپشن",
  //   content: <OptionForm />,
  // },
];

const TabsComponent = () => {
  const [activeTab, setActiveTab] = React.useState<string>("vehicleDashboard");

  return (
    <div suppressHydrationWarning>
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

            {formTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="bg-gray-100 cursor-pointer"
              >
                {tab.title}
              </TabsTrigger>
            ))}
          </div>
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
        {formTabs.map((tab) => (
          <TabsContent
            key={tab.id}
            value={tab.id}
            className="w-full bg-white rounded-2xl"
          >
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TabsComponent;
