"use client";
import React from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { XCircle } from "lucide-react";

interface PersianDatePickerProps {
  value?: string; // Format: YYYY/MM/DD
  onChange?: (date: string) => void;
  placeholder?: string;
  className?: string;
}

const PersianDatePicker: React.FC<PersianDatePickerProps> = ({
  value,
  onChange,
  placeholder = "انتخاب تاریخ",
  className,
}) => {
  const [internalDate, setInternalDate] = React.useState<DateObject | null>(
    null,
  );

  // Convert string value (YYYY/MM/DD) to DateObject when value prop changes
  React.useEffect(() => {
    if (value) {
      const [year, month, day] = value.split("/").map(Number);
      if (year && month && day) {
        const dateObj = new DateObject({
          calendar: persian,
          year,
          month,
          day,
        });
        setInternalDate(dateObj);
      }
    } else {
      setInternalDate(null);
    }
  }, [value]);

  const handleChange = (date: DateObject | DateObject[] | null) => {
    if (!date) {
      setInternalDate(null);
      onChange?.("");
      return;
    }

    const dateObj = Array.isArray(date) ? date[0] : date;
    setInternalDate(dateObj as DateObject);

    // Convert DateObject to YYYY/MM/DD format
    if (dateObj) {
      const year = (dateObj as DateObject).year;
      const month = String((dateObj as DateObject).month.number).padStart(
        2,
        "0",
      );
      const day = String((dateObj as DateObject).day).padStart(2, "0");
      const dateString = `${year}/${month}/${day}`;
      onChange?.(dateString);
    }
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setInternalDate(null);
    onChange?.("");
  };

  return (
    <div className="flex items-center w-full relative">
      <DatePicker
        calendar={persian}
        locale={persian_fa}
        value={internalDate}
        onChange={handleChange}
        inputClass={`border rounded w-full px-4 py-1 text-right outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
        placeholder={placeholder}
        calendarPosition="bottom-left"
        className="w-full"
      />
      {internalDate && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
          title="پاک کردن"
        >
          <XCircle size={18} />
        </button>
      )}
      {/* <span className="border rounded-full bg-gray-100 p-2.5 py-0.5 text-red-400 absolute -top-2 -right-3">x</span> */}
    </div>
  );
};

export default PersianDatePicker;
