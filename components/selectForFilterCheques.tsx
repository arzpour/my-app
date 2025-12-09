"use client";

import React from "react";
import { SearchIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ISelectForFilterCheques {
  setSelectedSubject?: (value: string) => void;
  data: string[];
  title: string;
  selectedValue: string;
  className?: string;
  disabled?: boolean;
  searchPlaceholder?: string;
}

const SelectForFilterCheques: React.FC<ISelectForFilterCheques> = ({
  data,
  setSelectedSubject,
  title,
  selectedValue = "همه",
  className,
  disabled = false,
  searchPlaceholder = "جستجو...",
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data?.filter(Boolean) || [];
    return (
      data
        ?.filter(Boolean)
        ?.filter((item) =>
          item.toLowerCase().includes(searchTerm.toLowerCase())
        ) || []
    );
  }, [data, searchTerm]);

  React.useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchTerm("");
    }
  }, [isOpen]);

  const handleValueChange = (value: string) => {
    setSelectedSubject?.(value);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="space-y-1">
      <h3
        className={`text-sm font-bold mb-2 ${
          disabled ? "text-gray-400" : "text-blue-900"
        }`}
      >
        {title}:
      </h3>
      <Select
        dir="rtl"
        value={selectedValue}
        onValueChange={handleValueChange}
        disabled={disabled}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <SelectTrigger
          className={`w-[130px] text-sm ${className} ${
            disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
              : ""
          }`}
        >
          <SelectValue placeholder="انتخاب کنید">{selectedValue}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {/* Search Input */}
          <div className="p-2 border-b sticky top-0 bg-white z-10 w-[150px]">
            <div className="relative">
              <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pr-9 pl-3 py-1.5 text-sm border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                dir="rtl"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (filteredData.length === 1) {
                      handleValueChange(filteredData[0]);
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Options List */}
          <SelectGroup>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <SelectItem key={`${item}-${index}`} value={item}>
                  {item}
                </SelectItem>
              ))
            ) : (
              <div className="py-6 text-center text-sm text-gray-500">
                نتیجه‌ای یافت نشد
              </div>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectForFilterCheques;
