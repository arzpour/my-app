"use client";
import CheckDashboard from "@/components/checkDashboard";
import CustomersDashboard from "@/components/customersDashboard";
import FinanciersDashboard from "@/components/financiersDashboard";
import OperatorsDashboard from "@/components/operatorsDashboard";
import TransactionDashboard from "@/components/transactionDashboard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import VehicleDashboard from "@/components/vehicleDashboard";

export default function Home() {
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
      id: "financiersDashboard",
      title: "داشبورد سرمایه گزاران",
      content: <FinanciersDashboard />,
    },
    {
      id: "operatorsDashboard",
      title: "داشبورد کارگزاران",
      content: <OperatorsDashboard />,
    },
    {
      id: "checkDashboard",
      title: "داشبورد چک",
      content: <CheckDashboard />,
    },
    {
      id: "transactionDashboard",
      title: "گزارش تراکنش ها",
      content: <TransactionDashboard />,
    },
  ];

  return (
    <div className="flex h-screen w-full">
      <div className="flex-1">
        <Tabs
          defaultValue="profile"
          orientation="vertical"
          className="flex flex-col md:flex-row h-full"
          dir="rtl"
        >
          <TabsList
            className="
      flex md:flex-col w-full md:w-46 md:border-l bg-white h-full!
      md:ml-auto  border-b md:border-b-0 p-0!
      rounded-md justify-start! shadow-lg pt-8!
    "
          >
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="
          text-center md:text-right justify-between flex items-center w-full py-4
         rounded-lg text-sm flex-0
          data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 h-32!
        "
              >
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="flex-1 bg-white rounded-2xl mt-8 px-8"
            >
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
