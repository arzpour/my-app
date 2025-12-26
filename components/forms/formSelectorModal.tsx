"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRightIcon, ArrowLeftIcon } from "lucide-react";
import TransactionForm from "./transactionForm";
import PeopleForm from "./peopleForm";
import BusinessAccountForm from "./businessAccountForm";
import PurchaseDealForm from "./purchaseDealForm";
import SaleDealForm from "./saleDealForm";
import DealExpensesForm from "./dealExpensesForm";
import LoansForm from "./loansForm";
import ChequeActionsForm from "./chequeActionsForm";
import ChequeFormNew from "./chequeFormNew";
import SalarySlipForm from "./salarySlipForm";
import SalariesForm from "./salariesForm";

type FormType =
  | "transactions"
  | "deals"
  | "loans"
  | "peoples"
  | "expenses"
  | "business_accounts"
  | "sale_deal"
  | "cheque_actions"
  | "cheque"
  | "salary_slip"
  | "salaries"
  | null;

interface FormSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FormSelectorModal: React.FC<FormSelectorModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [selectedForm, setSelectedForm] = React.useState<FormType>(null);

  const forms = [
    { id: "peoples", title: "ثبت/ویرایش شخص", icon: "/7.png" },
    {
      id: "business_accounts",
      title: "تعریف حساب بانکی کسب‌وکار",
      icon: "/4.png",
    },
    { id: "deals", title: "ثبت خرید خودرو", icon: "/1.png" },
    { id: "sale_deal", title: "ثبت فروش خودرو", icon: "/8.png" },
    { id: "expenses", title: "ثبت هزینه و آپشن", icon: "/5.png" },
    { id: "transactions", title: "ثبت تراکنش", icon: "/2.png" },
    { id: "cheque", title: "ثبت چک", icon: "/9.png" },
    // { id: "cheque_actions", title: "عملیات روی چک", icon: "📋" },
    { id: "loans", title: "ثبت وام پرسنلی", icon: "/6.png" },
    { id: "salary_slip", title: "محاسبه و صدور فیش حقوقی", icon: "/3.png" },
    { id: "salaries", title: "پرداخت حقوق", icon: "/3.png" },
  ];

  const handleFormSelect = (formId: string) => {
    setSelectedForm(formId as FormType);
  };

  const handleBack = () => {
    setSelectedForm(null);
  };

  const handleClose = () => {
    setSelectedForm(null);
    onOpenChange(false);
  };

  const renderForm = () => {
    switch (selectedForm) {
      case "peoples":
        return (
          <div className="p-4">
            <PeopleForm
              personData={null}
              mode="add"
              embedded={true}
              onSuccess={() => {
                handleClose();
              }}
            />
          </div>
        );
      case "business_accounts":
        return (
          <div className="p-4">
            <BusinessAccountForm
              accountData={null}
              mode="add"
              embedded={true}
              onSuccess={() => {
                handleClose();
              }}
            />
          </div>
        );
      case "transactions":
        return (
          <div className="p-4">
            <TransactionForm />
          </div>
        );
      case "expenses":
        return (
          <div className="p-4">
            <DealExpensesForm
              embedded={true}
              onSuccess={() => {
                handleClose();
              }}
            />
          </div>
        );
      case "loans":
        return (
          <div className="p-4">
            <LoansForm
              embedded={true}
              onSuccess={() => {
                handleClose();
              }}
            />
          </div>
        );
      case "deals":
        return (
          <div className="p-4">
            <PurchaseDealForm
              embedded={true}
              onSuccess={() => {
                handleClose();
              }}
            />
          </div>
        );
      case "sale_deal":
        return (
          <div className="p-4">
            <SaleDealForm
              embedded={true}
              onSuccess={() => {
                handleClose();
              }}
            />
          </div>
        );
      case "cheque":
        return (
          <div className="p-4">
            <ChequeFormNew
              embedded={true}
              onSuccess={() => {
                handleClose();
              }}
            />
          </div>
        );
      case "cheque_actions":
        return (
          <div className="p-4">
            <ChequeActionsForm
              embedded={true}
              onSuccess={() => {
                handleClose();
              }}
            />
          </div>
        );
      case "salary_slip":
        return (
          <div className="p-4">
            <SalarySlipForm
              embedded={true}
              onSuccess={() => {
                handleClose();
              }}
            />
          </div>
        );
      case "salaries":
        return (
          <div className="p-4">
            <SalariesForm
              embedded={true}
              onSuccess={() => {
                handleClose();
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div dir="rtl">
          {!selectedForm ? (
            <>
              <DialogHeader>
                <DialogTitle className="!text-base !font-semibold text-gray-800">
                  فرم مورد نظر خود را انتخاب کنید
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {forms.map((form) => (
                  <button
                    key={form.id}
                    onClick={() => handleFormSelect(form.id)}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-all text-right"
                  >
                    {/* <span className="text-xl">{form.icon}</span> */}
                    {/* <Image
                      alt={`${form.icon}-icon`}
                      src={form.icon ?? ""}
                      width={500}
                      height={500}
                    /> */}
                    <img
                      alt={`${form.icon}-icon`}
                      src={form.icon ?? ""}
                      className="w-12 h-9"
                    />
                    <span className="flex-1 text-base font-medium">
                      {form.title}
                    </span>
                    <ArrowLeftIcon className="size-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <ArrowRightIcon className="size-4" />
                    {/* <span>بازگشت</span> */}
                  </button>
                  <DialogTitle className="flex-1 !text-lg !font-bold !text-gray-800">
                    {forms.find((f) => f.id === selectedForm)?.title}
                  </DialogTitle>
                </div>
              </DialogHeader>
              <div className="mt-4">{renderForm()}</div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormSelectorModal;
