import React from "react";
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
}

const SelectForFilterCheques: React.FC<ISelectForFilterCheques> = ({
  data,
  setSelectedSubject,
  title,
  selectedValue = "همه",
  className,
  disabled = false,
}) => {
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
        value={selectedValue}
        onValueChange={(value) => setSelectedSubject?.(value)}
        disabled={disabled}
      >
        <SelectTrigger
          className={`w-[130px] text-sm ${className} ${
            disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
              : ""
          }`}
        >
          <SelectValue placeholder="انتخاب کنید">{selectedValue}</SelectValue>{" "}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {data?.filter(Boolean)?.map((item, index) => (
              <SelectItem key={`${item}-${index}`} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectForFilterCheques;
