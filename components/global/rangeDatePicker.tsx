import React, { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

interface IRangeDatePicker {
  dates: DateObject[];
  setDates: React.Dispatch<React.SetStateAction<DateObject[]>>;
}

const RangeDatePicker: React.FC<IRangeDatePicker> = ({ dates, setDates }) => {
  // const [dates, setDates] = useState<DateObject[]>([]);
  const [error, setError] = useState("");

  const handleChange = (value: DateObject | DateObject[] | null) => {
    if (!value || !Array.isArray(value)) {
      setDates([]);
      setError("لطفاً بازه تاریخ را انتخاب کنید");
      return;
    }

    setDates(value);

    if (value.length === 1) {
      setError("لطفاً تاریخ شروع و پایان را انتخاب کنید");
    } else if (value.length === 2) {
      setError("");
    }
  };

  return (
    <div className="flex flex-col gap-2 w-fit">
      <DatePicker
        value={dates}
        onChange={handleChange}
        range
        calendar={persian}
        locale={persian_fa}
        calendarPosition="bottom-right"
        inputClass="border rounded-lg px-3 py-2 text-sm text-center"
        placeholder="از تاریخ — تا تاریخ"
      />

      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
};

export default RangeDatePicker;
