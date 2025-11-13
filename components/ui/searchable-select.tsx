"use client";

import * as React from "react";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchableSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  searchPlaceholder?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  value,
  onValueChange,
  options,
  placeholder = "انتخاب کنید",
  className,
  searchPlaceholder = "جستجو...",
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedValue, setSelectedValue] = React.useState(value || "");
  const selectRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  // Update selected value when prop changes
  React.useEffect(() => {
    setSelectedValue(value || "");
  }, [value]);

  // Focus input when dropdown opens
  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option: string) => {
    setSelectedValue(option);
    onValueChange?.(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  const selectedLabel = selectedValue || placeholder;

  return (
    <div ref={selectRef} className={cn("relative w-full", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "border-input [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9",
          className
        )}
      >
        <span className="truncate text-right w-full">{selectedLabel}</span>
        <ChevronDownIcon
          className={cn(
            "size-4 opacity-50 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
          {/* Search Input */}
          <div className="p-2 border-b">
            <div className="relative">
              <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pr-9 pl-3 py-2 text-sm border rounded-md outline-none focus:ring-2 focus:ring-ring"
                dir="rtl"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-[200px] overflow-y-auto p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground",
                    selectedValue === option &&
                      "bg-accent text-accent-foreground"
                  )}
                  dir="rtl"
                >
                  <span className="absolute right-2 flex size-3.5 items-center justify-center">
                    {selectedValue === option && (
                      <CheckIcon className="size-4" />
                    )}
                  </span>
                  <span className="truncate">{option}</span>
                </button>
              ))
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                نتیجه‌ای یافت نشد
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
