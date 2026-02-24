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
import DealExpensesForm from "./dealExpensesForm";
import LoansForm from "./loansForm";
import SalariesForm from "./salariesForm";
import SalarySlipForm from "./salarySlipForm";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import PeopleList from "../lists/peopleList";
import BusinessAccountList from "../lists/businessAccountList";
import { useGetPersonById } from "@/apis/mutations/people";
import { IBusinessAccounts, IPeople } from "@/types/new-backend-types";
import { useGetBusinessAccountById } from "@/apis/mutations/businessAccounts";
import { resetPlateState } from "@/redux/slices/plateSlice";
import SaleDealForm from "./saleDealForm";

type FormType =
  | "transactions"
  | "deals"
  | "loans"
  | "peoples"
  | "expenses"
  | "business_accounts"
  | "sale_deal"
  // | "cheque_actions"
  // | "cheque"
  | "salary_slip"
  | "salaries"
  | null;

interface FormSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormItem {
  id: string;
  title: string;
  icon?: string;
  disabled?: boolean;
}

const FormSelectorModal: React.FC<FormSelectorModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [selectedForm, setSelectedForm] = React.useState<FormType>(null);
  const [mode, setMode] = React.useState<"add" | "edit">("add");
  const [personId, setPersonId] = React.useState<string>("");
  const [accountId, setAccountId] = React.useState<string>("");

  const [personData, setPersonData] = React.useState<IPeople>();
  const [accountData, setAccountData] = React.useState<IBusinessAccounts>();

  const { role } = useSelector((state: RootState) => state.cars);
  const getPersonById = useGetPersonById();
  const getBusinessAccountById = useGetBusinessAccountById();
  const dispatch = useDispatch();

  const forms: FormItem[] = [
    { id: "peoples", title: "ثبت/ویرایش شخص", icon: "/7.png" },
    {
      id: "business_accounts",
      title: "تعریف حساب بانکی کسب‌وکار",
      icon: "/4.png",
    },
  ];

  role === "accountant" &&
    forms.push(
      { id: "deals", title: "ثبت خرید خودرو", icon: "/1.png" },
      { id: "sale_deal", title: "ثبت فروش خودرو", icon: "/8.png" },
      { id: "expenses", title: "ثبت هزینه و آپشن", icon: "/5.png" },
      { id: "transactions", title: "ثبت تراکنش", icon: "/2.png" },
      // { id: "cheque", title: "ثبت چک", icon: "/9.png" },
      // { id: "cheque_actions", title: "عملیات روی چک", icon: "📋" },
      { id: "loans", title: "ثبت وام پرسنلی", icon: "/6.png", disabled: true },
      { id: "salary_slip", title: "محاسبه و صدور فیش حقوقی", icon: "/3.png", disabled: true },
      // { id: "salaries", title: "پرداخت حقوق", icon: "/3.png", disabled: true },
    );

  const handleFormSelect = (formId: string) => {
    setSelectedForm(formId as FormType);
  };

  const handleBack = () => {
    setSelectedForm(null);
    setMode("edit");
    setPersonId("");
    setPersonData(undefined);
  };

  const handleClose = () => {
    setSelectedForm(null);
    onOpenChange(false);
    setMode("add");
    dispatch(resetPlateState());
  };

  const getPersonDataById = async () => {
    try {
      const res = await getPersonById.mutateAsync(personId);
      setPersonData(res);
    } catch (error) {
      console.log("🚀 ~ FormSelectorModal ~ error:", error);
    }
  };

  const getBusinessAccountDataById = async () => {
    try {
      const res = await getBusinessAccountById.mutateAsync(accountId);
      setAccountData(res);
    } catch (error) {
      console.log("🚀 ~ FormSelectorModal ~ error:", error);
    }
  };

  React.useEffect(() => {
    getPersonDataById();
  }, [personId]);
  React.useEffect(() => {
    getBusinessAccountDataById();
  }, [accountId]);

  const renderForm = () => {
    switch (selectedForm) {
      case "peoples":
        return (
          <div className="p-4">
            <PeopleForm
              personData={mode === "add" ? null : personData}
              mode={mode}
              embedded={true}
              // onSuccess={() => {
              //   handleClose();
              // }}
              setMode={setMode}
              handleBack={handleBack}
            />
            <p className="text-gray-700 font-semibold">لیست افراد</p>
            <PeopleList setMode={setMode} setPersonId={setPersonId} />
          </div>
        );
      case "business_accounts":
        return (
          <div className="p-4">
            <BusinessAccountForm
              accountData={mode === "add" ? null : accountData}
              mode={mode}
              embedded={true}
              // onSuccess={() => {
              //   handleClose();
              // }}
              setMode={setMode}
            />
            <p className="text-gray-700 font-semibold">لیست حساب بانکی</p>
            <BusinessAccountList
              setMode={setMode}
              setAccountId={setAccountId}
            />
          </div>
        );
      case "transactions":
        return (
          <div className="p-4">
            <TransactionForm
              mode={mode}
              embedded={true}
              onSuccess={() => {
                handleClose();
              }}
            />
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
      // case "cheque":
      //   return (
      //     <div className="p-4">
      //       <ChequeFormNew
      //         embedded={true}
      //         onSuccess={() => {
      //           handleClose();
      //         }}
      //       />
      //     </div>
      //   );
      // case "cheque_actions":
      //   return (
      //     <div className="p-4">
      //       <ChequeActionsForm
      //         embedded={true}
      //         onSuccess={() => {
      //           handleClose();
      //         }}
      //       />
      //     </div>
      //   );
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
                {forms.map((form) => {
                  const isDisabled = form.disabled === true;
                  return (
                    <button
                      key={form.id}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => !isDisabled && handleFormSelect(form.id)}
                      className={`flex items-center gap-4 p-4 border rounded-lg transition-all text-right ${isDisabled
                          ? "opacity-60 cursor-not-allowed bg-gray-50 border-gray-200"
                          : "hover:bg-gray-50 hover:border-blue-500"
                        }`}
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
                  );
                })}
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
