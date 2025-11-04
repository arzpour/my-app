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
  setSelectedSubject?: any;
  data: any;
  title: string;
}

const SelectForFilterCheques: React.FC<ISelectForFilterCheques> = ({
  data,
  setSelectedSubject,
  title,
}) => {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-bold mb-2 text-blue-900">{title}:</h3>
      <Select defaultValue="همه" onValueChange={setSelectedSubject}>
        <SelectTrigger className="w-[130px] text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {data?.map((item, index) => (
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
