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

interface ISelectOption {
  id: string;
  label: string;
}

interface ISearchInputSelector {
  setSelectedSubject?: (value: string | undefined) => void;
  data: ISelectOption[];
  title: string;
  selectedValue: string;
  className?: string;
  disabled?: boolean;
  searchPlaceholder?: string;
}

const SearchInputSelector: React.FC<ISearchInputSelector> = ({
  data,
  setSelectedSubject,
  title,
  selectedValue = "",
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
          item.label.toLowerCase().includes(searchTerm.toLowerCase()),
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
    if (value === "all") {
      setSelectedSubject?.(undefined);
    } else {
      setSelectedSubject?.(value);
    }
    setIsOpen(false);
    setSearchTerm("");
  };

  const selectedLabel = React.useMemo(() => {
    const found = data.find((item) => item.id === selectedValue);
    return found ? found.label : "انتخاب کنید";
  }, [selectedValue, data]);

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
          <SelectValue placeholder="انتخاب کنید">{selectedLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {/* Search Input */}
          <div className="p-2 border-b sticky top-0 bg-white z-10 w-[150 w-full">
            <div className="relative w-full">
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
                      handleValueChange(filteredData[0].id);
                    }
                  }
                }}
              />
            </div>
          </div>
          {/* Options List */}
          <SelectGroup>
            {filteredData.length > 0 ? (
              [{ id: "all", label: "همه" }, ...filteredData].map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.label}
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
export default SearchInputSelector;
