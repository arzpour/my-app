"use client";
import React from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const PersianDatePicker = () => {
  const [fromDate, setFromDate] = React.useState<DateObject | null>(null);

  return (
    <div className="flex items-center">
      <DatePicker
        calendar={persian}
        locale={persian_fa}
        value={fromDate}
        onChange={(date) => setFromDate(date as DateObject)}
        inputClass="border rounded w-[130px] px-4 py-1 text-center outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="انتخاب تاریخ"
        calendarPosition="bottom-center"
      />
    </div>
  );
};

export default PersianDatePicker;
