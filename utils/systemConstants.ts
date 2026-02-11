import { DateObject } from "react-multi-date-picker";

export const BANK_NAMES = [
  "ملی",
  "ملت",
  "صادرات",
  "پاسارگاد",
  "پارسیان",
  "سامان",
  "تجارت",
  "رفاه",
  "کشاورزی",
  "مسکن",
  "صنعت و معدن",
  "کارآفرین",
  "سینا",
  "دی",
  "آینده",
  "قوامین",
  "خاورمیانه",
  "گردشگری",
  "سایر",
];

export const LOAN_STATUSES = ["در حال پرداخت", "تسویه شده"];

export const INSTALLMENT_STATUSES = ["پرداخت شده", "معوق"];

export const CHEQUE_STATUSES = [
  "در جریان",
  "پاس شده",
  "برگشتی",
  "خرج شده",
  "عودت داده شده",
  "وصول شده",
  "وصول نشده",
  "ثبت شده",
];

export const TRANSACTION_TYPES = ["پرداخت", "دریافت"];

export const PAYMENT_METHODS = [
  "نقد",
  "کارت به کارت",
  "چک",
  "شبا",
  "مشتری به مشتری",
];

export const TRANSACTION_REASONS_FOR_PAYMENT = [
  // "وام",
  // "حقوق",
  "آپشن",
  "اجاره",
  "تنخواه",
  "تبلیغات",
  "خرید خودرو",
  "اصل سرمایه",
  "سود سرمایه",
  "درصد کارگزار",
  "سایر هزینه‌ها",
  "جابجایی(وسیله نقلیه)",
];

export const TRANSACTION_REASONS_FOR_RECEIPT = [
  "فروش خودرو",
  // "سرمایه گذاری",
  "اقساط وام",
];

export const PERSON_ROLES = ["customer", "broker", "employee", "provider"];

export const PERSON_ROLES_DISPLAY = {
  customer: "مشتری",
  broker: "کارگزار",
  employee: "کارمند",
  provider: "تامین کننده",
};

export const roleMap: Record<string, string> = {
  customer: "مشتری",
  broker: "کارگزار",
  employee: "کارمند",
  provider: "تامین کننده",
};

export const CONTRACT_TYPES = [
  { value: "full_time", label: "تمام وقت" },
  { value: "part_time", label: "پاره وقت" },
  { value: "contractual", label: "قراردادی" },
];

export const DIRECT_COST_CATEGORIES = [
  { value: "Preparation", label: "آماده‌سازی" },
  { value: "Repairs", label: "تعمیرات فنی" },
  { value: "Bodywork", label: "بدنه" },
  { value: "Parts & Accessories", label: "قطعات و آپشن" },
  { value: "Documentation", label: "امور اداری" },
  { value: "Inspection", label: "کارشناسی" },
];

export const OVERHEAD_COST_CATEGORIES = [
  { value: "Rent", label: "اجاره" },
  { value: "Utilities", label: "قبوض" },
  { value: "Salaries", label: "حقوق و دستمزد" },
  { value: "Marketing", label: "تبلیغات" },
  { value: "Reception", label: "پذیرایی" },
  { value: "Other", label: "سایر" },
];

export const EXPENSE_TYPES = [
  { value: "option", label: "نصب آپشن" },
  { value: "other", label: "سایر هزینه‌ها" },
];

export const CHEQUE_TYPES = [
  { value: "received", label: "دریافتی" },
  { value: "issued", label: "پرداختی" },
];

export const CHEQUE_ACTIONS = [
  { value: "paid", label: "پاس شدن" },
  { value: "returned", label: "برگشت خوردن" },
  { value: "spent", label: "خرج کردن" },
  { value: "returned_to_owner", label: "عودت دادن" },
];

export const CHEQUE_LAST_STATUS = [
  { value: "waitingForDateBook", label: "در انتظار سررسید" },
  { value: "dateBooked", label: "سررسید شده" },
  { value: "received", label: "وصول شده" },
  { value: "notReceived", label: "وصول نشده" },
  { value: "revert", label: "برگشتی" },
  { value: "inProgress", label: "در جریان پیگیری" },
  { value: "defeasance", label: "ابطال شده" },
  { value: "changeWithAnother", label: "تعویض با چک دیگر" },
  { value: "depositedToAccount", label: "سپرده شده به حساب" },
  { value: "makeOver", label: "واگذاری به شخص ثالث" },
  { value: "robbery/lost", label: "مفقود / سرقت شده" },
];

export const PERSIAN_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

export const PERSIAN_YEARS = Array.from({ length: 11 }, (_, i) => 1400 + i);

export const persianToEnglish = (
  value: DateObject | string | number,
): string => {
  const persianToEnglishDigit = (char: string) =>
    String("۰۱۲۳۴۵۶۷۸۹".indexOf(char));

  return value.toString().replace(/[۰-۹]/g, persianToEnglishDigit);
};
