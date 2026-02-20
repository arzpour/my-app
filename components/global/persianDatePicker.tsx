"use client";
import React from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

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
  className
}) => {
  const [internalDate, setInternalDate] = React.useState<DateObject | null>(
    null
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
        "0"
      );
      const day = String((dateObj as DateObject).day).padStart(2, "0");
      const dateString = `${year}/${month}/${day}`;
      onChange?.(dateString);
    }
  };

  return (
    <div className="flex items-center w-full">
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
    </div>
  );
};

export default PersianDatePicker;
