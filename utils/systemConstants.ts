/**
 * System Constants - لیست‌های ثابت سیستم
 * These constants are used across forms for dropdowns and selections
 */

// لیست بانک‌ها
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

// وضعیت‌های وام
export const LOAN_STATUSES = ["در حال پرداخت", "تسویه شده"];

// وضعیت‌های قسط
export const INSTALLMENT_STATUSES = ["پرداخت شده", "معوق"];

// وضعیت‌های چک
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

// نوع تراکنش
export const TRANSACTION_TYPES = ["پرداخت", "دریافت"];

// روش پرداخت
export const PAYMENT_METHODS = [
  "نقد",
  "کارت به کارت",
  "چک",
  "شبا",
  "مشتری به مشتری",
];

// علت تراکنش (Reason)
export const TRANSACTION_REASONS = [
  "خرید خودرو",
  "فروش خودرو",
  "پرداخت هزینه",
  "پرداخت حقوق",
  "درصد کارگزار",
  "شارژ تنخواه",
  "نقد کردن چک",
  "دریافت وام",
  "بازپرداخت وام",
  "هزینه وسیله",
  "سایر هزینه‌ها",
];

// نقش‌های شخص
export const PERSON_ROLES = ["customer", "broker", "employee", "provider"];

// نقش‌های شخص (نمایشی)
export const PERSON_ROLES_DISPLAY = {
  customer: "مشتری",
  broker: "کارگزار",
  employee: "کارمند",
  provider: "تامین کننده",
};

// نوع قرارداد کارمند
export const CONTRACT_TYPES = [
  { value: "full_time", label: "تمام وقت" },
  { value: "part_time", label: "پاره وقت" },
  { value: "contractual", label: "قراردادی" },
];

// دسته‌بندی هزینه‌های مستقیم (Direct Costs)
export const DIRECT_COST_CATEGORIES = [
  { value: "Preparation", label: "آماده‌سازی" },
  { value: "Repairs", label: "تعمیرات فنی" },
  { value: "Bodywork", label: "بدنه" },
  { value: "Parts & Accessories", label: "قطعات و آپشن" },
  { value: "Documentation", label: "امور اداری" },
  { value: "Inspection", label: "کارشناسی" },
];

// دسته‌بندی هزینه‌های سربار (Overhead Costs)
export const OVERHEAD_COST_CATEGORIES = [
  { value: "Rent", label: "اجاره" },
  { value: "Utilities", label: "قبوض" },
  { value: "Salaries", label: "حقوق و دستمزد" },
  { value: "Marketing", label: "تبلیغات" },
  { value: "Reception", label: "پذیرایی" },
  { value: "Other", label: "سایر" },
];

// نوع هزینه
export const EXPENSE_TYPES = [
  { value: "option", label: "نصب آپشن" },
  { value: "other", label: "سایر هزینه‌ها" },
];

// نوع چک
export const CHEQUE_TYPES = [
  { value: "received", label: "دریافتی" },
  { value: "issued", label: "پرداختی" },
];

// عملیات روی چک
export const CHEQUE_ACTIONS = [
  { value: "paid", label: "پاس شدن" },
  { value: "returned", label: "برگشت خوردن" },
  { value: "spent", label: "خرج کردن" },
  { value: "returned_to_owner", label: "عودت دادن" },
];

// ماه‌های شمسی
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

// سال‌های شمسی (از 1400 تا 1410)
export const PERSIAN_YEARS = Array.from({ length: 11 }, (_, i) => 1400 + i);
