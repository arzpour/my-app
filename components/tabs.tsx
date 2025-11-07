import CheckDashboard from "@/components/checkDashboard";
import CustomersDashboard from "@/components/customersDashboard";
import FinanciersDashboard from "@/components/financiersDashboard";
import OperatorsDashboard from "@/components/operatorsDashboard";
import TransactionDashboard from "@/components/transactionDashboard";
import VehicleDashboard from "@/components/vehicleDashboard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

const TabsComponent = () => {
  return (
    <Tabs
      defaultValue="vehicleDashboard"
      orientation="vertical"
      className="h-full w-full flex justify-start items-start"
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
  );
};

export default TabsComponent;
