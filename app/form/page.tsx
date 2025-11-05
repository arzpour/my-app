"use client";
import FormTabs from "@/components/forms/formTabs";
import SecretaryForm from "@/components/forms/secretaryForm";
import Header from "@/components/header";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const FormPage = () => {
  const { role } = useSelector((state: RootState) => state.cars);
  return (
    <div dir="rtl" className="w-full p-4">
      <Header />
      {role === "secretary" && <SecretaryForm />}
      {role === "accountant" && <FormTabs />}
    </div>
  );
};

export default FormPage;
