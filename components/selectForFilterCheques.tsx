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
}

const SelectForFilterCheques: React.FC<ISelectForFilterCheques> = ({
  data,
  setSelectedSubject,
  title,
  selectedValue = "همه",
  className,
}) => {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-bold mb-2 text-blue-900">{title}:</h3>
      <Select
        value={selectedValue}
        onValueChange={(value) => setSelectedSubject?.(value)}
      >
        <SelectTrigger className={`w-[130px] text-sm ${className}`}>
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
