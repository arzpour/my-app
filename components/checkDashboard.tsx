"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetAllCheques from "@/hooks/useGetAllCheques";
import React, { useMemo } from "react";
import SelectForFilterCheques from "./selectForFilterCheques";
import PersianDatePicker from "./global/persianDatePicker";

const CheckDashboard = () => {
  const { data = [] } = useGetAllCheques();

  const [selectedChequeSerial, setSelectedChequeSerial] = React.useState("همه");
  const [selectedSayadiId, setSelectedSayadiId] = React.useState("همه");
  const [selectedCustomerType, setSelectedCustomerType] = React.useState("همه");
  const [selectedCustomerName, setSelectedCustomerName] = React.useState("همه");
  const [selectedNationalID, setSelectedNationalID] = React.useState("همه");
  const [selectedBank, setSelectedBank] = React.useState("همه");
  const [selectedBranch, setSelectedBranch] = React.useState("همه");
  const [selectedChequeStatus, setSelectedChequeStatus] = React.useState("همه");
  const [selectedOperationType, setSelectedOperationType] =
    React.useState("همه");
  const [fromDate, setFromDate] = React.useState(""); // YYYY/MM/DD
  const [toDate, setToDate] = React.useState(""); // YYYY/MM/DD
  const [maxAmount, setMaxAmount] = React.useState<number | undefined>();
  const [appliedFilters, setAppliedFilters] = React.useState(false);

  const getOptions = (key: string) => {
    const values = data?.map((d: any) => d[key] ?? "") ?? [];
    const uniqueValues = Array.from(new Set(values.filter(Boolean)));
    return ["همه", ...uniqueValues];
  };

  const chequeSerialOptions = getOptions("ChequeSerial").filter(Boolean);
  const sayadiIdOptions = getOptions("SayadiID").filter(Boolean);
  const customerTypeOptions = getOptions("ChequeType").filter(Boolean);
  const customerNameOptions = getOptions("CustomerName")
    .concat(getOptions("ShowroomAccountCard"))
    .filter(Boolean);
  const nationalIDOptions = getOptions("CustomerNationalID")
    .concat(getOptions("AccountHolderNationalID"))
    .filter(Boolean);
  const bankOptions = getOptions("Bank").filter(Boolean);
  const branchOptions = getOptions("Branch").filter(Boolean);
  const chequeStatusOptions = getOptions("ChequeStatus").filter(Boolean);
  const operationTypeOptions = getOptions("LastAction").filter(Boolean);

  const filteredData = useMemo(() => {
    if (!appliedFilters) return data;
    return data?.filter((item) => {
      if (
        selectedChequeSerial !== "همه" &&
        item.ChequeSerial?.toString() !== selectedChequeSerial
      )
        return false;
      if (selectedSayadiId !== "همه" && item.SayadiID !== selectedSayadiId)
        return false;
      if (
        selectedCustomerType !== "همه" &&
        item.ChequeType !== selectedCustomerType
      )
        return false;
      if (
        selectedCustomerName !== "همه" &&
        (item.CustomerName ?? item.ShowroomAccountCard) !== selectedCustomerName
      )
        return false;
      if (
        selectedNationalID !== "همه" &&
        (item.CustomerNationalID ?? item.AccountHolderNationalID) !==
          selectedNationalID
      )
        return false;
      if (selectedBank !== "همه" && (item.Bank ?? "") !== selectedBank)
        return false;
      if (selectedBranch !== "همه" && (item.Branch ?? "") !== selectedBranch)
        return false;
      if (
        selectedChequeStatus !== "همه" &&
        (item.ChequeStatus ?? "") !== selectedChequeStatus
      )
        return false;
      if (
        selectedOperationType !== "همه" &&
        (item.LastAction ?? "") !== selectedOperationType
      )
        return false;
      if (maxAmount !== undefined && item.ChequeAmount > maxAmount)
        return false;
      if (fromDate && item.ChequeDueDate < fromDate) return false;
      if (toDate && item.ChequeDueDate > toDate) return false;
      return true;
    });
  }, [
    data,
    appliedFilters,
    selectedChequeSerial,
    selectedSayadiId,
    selectedCustomerType,
    selectedCustomerName,
    selectedNationalID,
    selectedBank,
    selectedBranch,
    selectedChequeStatus,
    selectedOperationType,
    maxAmount,
    fromDate,
    toDate,
  ]);

  const issued = useMemo(
    () => filteredData?.filter((item) => item.ChequeType === "صادره"),
    [filteredData]
  );
  const imported = useMemo(
    () => filteredData?.filter((item) => item.ChequeType === "وارده"),
    [filteredData]
  );

  const totalIssuedAmount = issued?.reduce((sum, t) => sum + t.ChequeAmount, 0);
  const totalImportedAmount = imported?.reduce(
    (sum, t) => sum + t.ChequeAmount,
    0
  );

  const handleResetFilters = () => {
    setSelectedChequeSerial("همه");
    setSelectedSayadiId("همه");
    setSelectedCustomerType("همه");
    setSelectedCustomerName("همه");
    setSelectedNationalID("همه");
    setSelectedBank("همه");
    setSelectedBranch("همه");
    setSelectedChequeStatus("همه");
    setSelectedOperationType("همه");
    setFromDate("");
    setToDate("");
    setMaxAmount(undefined);
    setAppliedFilters(false);
  };

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const pending =
      filteredData?.filter((i) => i.ChequeStatus !== "وصول شد")?.length || 0;
    const returned =
      filteredData?.filter((i) => i.ChequeStatus === "برگشتی")?.length || 0;
    const importedThisMonth =
      imported?.filter((i) => {
        const [year, month] = i.ChequeDueDate.split("/").map(Number);
        return year === currentYear && month === currentMonth;
      })?.length || 0;
    const issuedThisMonth =
      issued?.filter((i) => {
        const [year, month] = i.ChequeDueDate.split("/").map(Number);
        return year === currentYear && month === currentMonth;
      })?.length || 0;
    return { pending, returned, importedThisMonth, issuedThisMonth };
  }, [filteredData, imported, issued]);

  return (
    <div>
      <div className="grid [grid-template-columns:1fr_1fr_1fr_0.5fr_0.5fr] gap-6 items-start justify-start mt-4">
        <div className="space-y-6">
          <div className="border border-gray-300 p-4 rounded-md relative h-[7rem]">
            <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
              اطلاعات چک
            </p>

            <div className="flex gap-4 overflow-auto min-w-[140px] scrollbar-hide">
              <SelectForFilterCheques
                data={chequeSerialOptions.filter(Boolean)}
                title="سریال چک"
                setSelectedSubject={setSelectedChequeSerial}
                selectedValue={selectedChequeSerial}
              />
              <SelectForFilterCheques
                data={sayadiIdOptions.filter(Boolean)}
                title="شناسه صیادی"
                setSelectedSubject={setSelectedSayadiId}
                selectedValue={selectedSayadiId}
              />
            </div>
          </div>
          <div className="border border-gray-300 p-4 rounded-md relative h-[7rem]">
            <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
              نوع تاریخ / مبلغ
            </p>
            <div className="flex gap-4 items-center overflow-auto min-w-[140px] scrollbar-hide">
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-blue-900">
                  حداکثر مبلغ:
                </h3>
                <input type="text" className="border rounded w-[130px]" />
              </div>
              <SelectForFilterCheques
                data={["غیرفعال", "فعال"]}
                title="نوع عملیات تاریخ"
                selectedValue="غیرفعال"
              />
            </div>
          </div>
        </div>
        <div className="space-y-6 min-w-[140px] w-[340px]">
          <div className="border border-gray-300 p-4 rounded-md relative h-[7rem]">
            <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
              اطلاعات مشتری/صاحب چک
            </p>

            <div className="flex gap-4 overflow-auto min-w-[140px]">
              <SelectForFilterCheques
                data={customerTypeOptions.filter(Boolean)}
                title="نوع کاربر"
                setSelectedSubject={setSelectedCustomerType}
                selectedValue={selectedCustomerType}
              />
              <SelectForFilterCheques
                data={customerNameOptions.filter(Boolean)}
                title="نام و نام خانوادگی"
                setSelectedSubject={setSelectedCustomerName}
                selectedValue={selectedCustomerName}
              />
              <SelectForFilterCheques
                data={nationalIDOptions.filter(Boolean)}
                title="کدملی"
                setSelectedSubject={setSelectedNationalID}
                selectedValue={selectedNationalID}
              />
            </div>
          </div>{" "}
          <div className="border border-gray-300 p-4 rounded-md relative h-[7rem]">
            <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
              بازه زمانی
            </p>
            <div className="flex gap-4 overflow-auto min-w-[140px]">
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-purple-700">
                  از تاریخ:
                </h3>
                <PersianDatePicker />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-purple-700">
                  تا تاریخ:
                </h3>
                <PersianDatePicker />
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="border border-gray-300 p-4 rounded-md relative h-[7rem]">
            <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
              اطلاعات بانک
            </p>
            <div className="flex overflow-auto min-w-[140px] gap-4">
              <SelectForFilterCheques
                data={bankOptions.filter(Boolean)}
                title="بانک"
                setSelectedSubject={setSelectedBank}
                selectedValue={selectedBank}
              />
              <SelectForFilterCheques
                data={branchOptions.filter(Boolean)}
                title="شعبه"
                setSelectedSubject={setSelectedBranch}
                selectedValue={selectedBranch}
              />
            </div>
          </div>
          <div className="border border-gray-300 p-4 rounded-md relative h-[7rem]">
            <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
              وضعیت و عملیات انجام شده
            </p>
            <div className="flex overflow-auto min-w-[140px] gap-4">
              <SelectForFilterCheques
                data={chequeStatusOptions.filter(Boolean)}
                title="وضعیت چک"
                setSelectedSubject={setSelectedChequeStatus}
                selectedValue={selectedChequeStatus}
              />
              <SelectForFilterCheques
                data={operationTypeOptions.filter(Boolean)}
                title="نوع عملیات"
                setSelectedSubject={setSelectedOperationType}
                selectedValue={selectedOperationType}
              />
            </div>
          </div>
        </div>
        <div className="space-y-3 flex flex-col w-32">
          <button
            onClick={() => setAppliedFilters(true)}
            className="border rounded-lg px-4 py-2 w-36 shadow-md cursor-pointer"
          >
            جستجو
          </button>
          <button
            onClick={handleResetFilters}
            className="border rounded-lg shadow-lg px-4 py-2 w-36 whitespace-nowrap cursor-pointer"
          >
            حدف تمام فیلترها
          </button>
        </div>
        <div className="space-y-3 border p-4 w-72 rounded">
          <div className="flex items-center justify-between">
            <p>تعداد چک های وصول نشده:</p>
            <span className="text-sm">{stats.pending}</span>
          </div>
          <div className="flex items-center justify-between">
            <p>تعداد چک های برگشتی:</p>
            <span className="text-sm">{stats.returned}</span>
          </div>
          <div className="flex items-center justify-between">
            <p>تعداد چک های وارده ماه جاری:</p>
            <span className="text-sm">{stats.importedThisMonth}</span>
          </div>
          <div className="flex items-center justify-between">
            <p>تعداد چک های صادره ماه جاری:</p>
            <span className="text-sm">{stats.issuedThisMonth}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 items-start mt-7">
        <div>
          <div className="border border-gray-300 p-4 rounded-md relative w-full h-[30rem]">
            <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
              چک های صادره
            </p>
            <div className="max-h-[28rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-[30%] text-center">
                      شناسه صیادی
                    </TableHead>
                    <TableHead className="w-[50%] text-center">
                      نام مشتری
                    </TableHead>
                    <TableHead className="w-[50%] text-center">
                      سریال چک
                    </TableHead>
                    <TableHead className="w-[30%] text-center">
                      تاریخ سررسید
                    </TableHead>
                    <TableHead className="w-[30%] text-center">مبلغ</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {issued?.map((item, index) => (
                    <TableRow
                      key={`${item?.ChequeSerial}-${index}`}
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="text-center">
                        {item.SayadiID}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.ShowroomAccountCard ?? item.CustomerName}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.ChequeSerial}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.ChequeDueDate}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.ChequeAmount?.toLocaleString("en-US")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          {totalIssuedAmount && (
            <p className="text-green-400 font-bold text-sm mt-3 text-left">
              {totalIssuedAmount?.toLocaleString("en-US")}
            </p>
          )}
        </div>
        <div>
          <div className="border border-gray-300 p-4 rounded-md relative w-full h-[30rem]">
            <p className="text-red-500 absolute right-2 -top-5 bg-white py-2 px-4">
              چک های دریافتی
            </p>
            <div className="max-h-[28rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-[30%] text-center">
                      شناسه صیادی
                    </TableHead>
                    <TableHead className="w-[50%] text-center">
                      نام مشتری
                    </TableHead>
                    <TableHead className="w-[50%] text-center">
                      سریال چک
                    </TableHead>
                    <TableHead className="w-[30%] text-center">
                      تاریخ سررسید
                    </TableHead>
                    <TableHead className="w-[30%] text-center">مبلغ</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {imported?.map((item, index) => (
                    <TableRow
                      key={`${item?.ChequeSerial}-${index}`}
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="text-center">
                        {item.SayadiID}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.ShowroomAccountCard ?? item.CustomerName}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.ChequeSerial}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.ChequeDueDate}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.ChequeAmount?.toLocaleString("en-US")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          {totalImportedAmount && (
            <p className="text-red-400 font-bold text-sm mt-3 text-left">
              {totalImportedAmount?.toLocaleString("en-US")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckDashboard;
