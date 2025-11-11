"use client"
import ChequeForm from "./chequeForm";
// import OptionForm from "./optionForm";
import TransactionForm from "./transactionForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const tabs = [
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

const FormTabs = () => {
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
            className="bg-gray-100 cursor-pointer text-base"
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

export default FormTabs;
