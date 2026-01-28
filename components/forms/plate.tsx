import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setLeftDigits,
  setCenterAlphabet,
  setCenterDigits,
  setIr,
} from "@/redux/slices/plateSlice";
import Image from "next/image";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RootState } from "@/redux/store";

const PlateComponent: React.FC = () => {
  const letters: string[] = [
    "الف",
    "ب",
    "پ",
    "ت",
    "ث",
    "ج",
    "چ",
    "د",
    "ز",
    "ژ",
    "ک",
    "گ",
    "س",
    "ص",
    "ط",
    "ق",
    "ل",
    "م",
    "ن",
    "و",
    "ه‍",
    "ی",
  ];
  const dispatch = useDispatch();
  const { leftDigits, centerDigits, ir, centerAlphabet } = useSelector(
    (state: RootState) => state.plate,
  );

  const leftDigitsRef = useRef<HTMLInputElement>(null);
  const centerDigitsRef = useRef<HTMLInputElement>(null);
  const irRef = useRef<HTMLInputElement>(null);

  const digitsArToEn = (value: string) => {
    const persianNumbers = "۰۱۲۳۴۵۶۷۸۹";
    const arabicNumbers = "٠١٢٣٤٥٦٧٨٩";
    const englishNumbers = "0123456789";

    return value.replace(/[۰-۹٠-٩]/g, (digit) => {
      let index = persianNumbers.indexOf(digit);
      if (index === -1) {
        index = arabicNumbers.indexOf(digit);
      }
      return englishNumbers[index] ?? digit;
    });
  };

  const handleLeftDigitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = digitsArToEn(e.target.value);
    const currentInputLength = value.length;

    if (!/^\d{0,2}$/.test(value)) {
      centerDigitsRef.current?.focus();
      return;
    }

    dispatch(setLeftDigits(value ? Number(value) : null));

    if (currentInputLength === 2) {
      centerDigitsRef.current?.focus();
    }
  };

  const handleCenterDigitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = digitsArToEn(e.target.value);
    const currentInputLength = value.length;

    if (!/^\d{0,3}$/.test(value)) {
      irRef.current?.focus();
      return;
    }

    if (currentInputLength === 3) {
      irRef.current?.focus();
    } else if (currentInputLength === 0) {
      leftDigitsRef.current?.focus();
    }
    dispatch(setCenterDigits(value ? Number(value) : null));
  };

  const handleIrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = digitsArToEn(e.target.value);

    if (!/^\d{0,2}$/.test(value)) return;

    dispatch(setIr(value ? Number(value) : null));

    if (value.length === 0) {
      centerDigitsRef.current?.focus();
    }
  };

  const handleCenterAlphabetChange = (value: string) => {
    dispatch(setCenterAlphabet(value));
  };

  return (
    <>
      <div className="flex items-center justify-center w-full rounded-lg border text-sm border-grayD">
        <div className="flex items-center" style={{ direction: "ltr" }}>
          <Image
            src="/flag.svg"
            alt="IranFlag"
            className="px-1 mr-5 ml-1 w-14 h-14"
            width={200}
            height={200}
          />

          <div className="">
            <input
              type="text"
              placeholder="۱۱"
              inputMode="numeric"
              pattern="[0-9]*"
              ref={leftDigitsRef}
              className="w-10 focus:outline-none ml-1 placeholder:text-base text-base"
              value={leftDigits?.toString() ?? ""}
              onChange={handleLeftDigitsChange}
            />
          </div>

          <div className="flex justify-center space-x-4">
            <Select onValueChange={handleCenterAlphabetChange}>
              <SelectTrigger className="text-base">
                <SelectValue placeholder="الف" className="text-base" />
              </SelectTrigger>
              <SelectContent
                dir="rtl"
                className="font-[MyFont] h-72 overflow-auto"
              >
                {letters.map((letter) => (
                  <SelectItem key={letter} value={letter} className="w-12">
                    {letter}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="">
            <input
              type="text"
              inputMode="numeric"
              ref={centerDigitsRef}
              className="w-10 focus:outline-none mr-4 placeholder:text-base text-base"
              onChange={handleCenterDigitsChange}
              onKeyUp={(e) => {
                if (
                  e.key === "Backspace" &&
                  (e.target as HTMLInputElement).value.length === 0
                ) {
                  leftDigitsRef.current?.focus();
                }
              }}
              placeholder="۱۱۱"
              value={centerDigits?.toString() ?? ""}
            />
          </div>

          <div
            className="border-l border-grayD py-0 my-1 px-3 pl-7"
            style={{ backgroundColor: "#E1E4E" }}
          >
            <h4 className="text-xs">ایران</h4>
            <input
              type="text"
              inputMode="numeric"
              maxLength={2}
              ref={irRef}
              className="w-10 focus:outline-none !py-0 placeholder:text-base text-base"
              placeholder="۱۱"
              value={ir?.toString() ?? ""}
              onChange={handleIrChange}
              onKeyUp={(e) => {
                if (
                  e.key === "Backspace" &&
                  (e.target as HTMLInputElement).value.length === 0
                ) {
                  centerDigitsRef.current?.focus();
                }
              }}
            />
          </div>
        </div>
      </div>
      {!ir || !centerDigits || !leftDigits || !centerAlphabet ? (
        <div className="text-red-600 text-sm leading-5 mt-3 mr-2 flex gap-2 items-center mb-4">
          {/* <Image src={Danger} className="w-5" alt="danger" /> */}
          اطلاعات پلاک الزامی است.
        </div>
      ) : null}
    </>
  );
};

export default PlateComponent;
