"use client";
import FormTabs from "@/components/forms/formTabs";
import Header from "@/components/header";
import PanelMenu from "@/containers/panelMenu";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const FormPage = () => {
  const { role } = useSelector((state: RootState) => state.cars);
  return (
    <div dir="rtl" className="w-full p-4">
      <Header />
      {role === "secretary" && <PanelMenu />}
      {role === "accountant" && <FormTabs />}
    </div>
  );
};

export default FormPage;
