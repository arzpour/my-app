"use client";
import { getFilterByUserData } from "@/apis/client/cars";
import { useGetChequeByChassisNo } from "@/apis/mutations/cheques";
import { useGetTransactionByChassisNo } from "@/apis/mutations/transaction";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetUniqUsersData from "@/hooks/useGetUserData";
import { setChassisNo } from "@/redux/slices/carSlice";
import { RootState } from "@/redux/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const CustomersDashboard = () => {
  const [carDataByNationalCode, setCarDataByNationalCode] =
    React.useState<ICarDataByNationalIdOrName | null>(null);
  const [chequeByChassis, setChequeByChassis] = React.useState<
    IChequeRes[] | null
  >(null);
  const [transactionByChassis, setTransactionByChassis] = React.useState<
    ITransactionRes[] | null
  >(null);
  const [selectedNationalIdOrName, setSelectedNationalIdOrName] =
    React.useState<string | null>(null);
  const [searchValue, setSearchValue] = React.useState<string>("");

  const { chassisNo } = useSelector((state: RootState) => state.cars);
  const getChequeByChassisNo = useGetChequeByChassisNo();
  const getTransactionByChassisNo = useGetTransactionByChassisNo();
  const { data: allUniqUsers } = useGetUniqUsersData();
  const dispatch = useDispatch();

  const handleCarDataByNationalId = async (
    nationalId: string,
    userName: string
  ) => {
    setSelectedNationalIdOrName(nationalId ?? userName);
    try {
      const res = await getFilterByUserData({ nationalId, userName });
      setCarDataByNationalCode(res);
    } catch (error) {
      console.log("🚀 ~ handleSelectChassis ~ error:", error);
      setCarDataByNationalCode(null);
    }
  };

  const handleTransationDataByChassisNo = async (chassisNo: string) => {
    try {
      const res = await getTransactionByChassisNo.mutateAsync(chassisNo);
      setTransactionByChassis(res);
    } catch (error) {
      console.log("🚀 ~ handleSelectChassis ~ error:", error);
    }
  };

  const handleChequeDataByChassisNo = async (chassisNo: string) => {
    try {
      const res = await getChequeByChassisNo.mutateAsync(chassisNo);
      setChequeByChassis(res);
    } catch (error) {
      console.log("🚀 ~ handleSelectChassis ~ error:", error);
    }
  };

  const filteredUsers = React.useMemo(() => {
    if (!searchValue) return allUniqUsers;

    const lowerSearch = searchValue.toLowerCase().trim();

    return allUniqUsers?.filter(
      (user) =>
        user.name?.toLowerCase().includes(lowerSearch) ||
        user.nationalId?.includes(lowerSearch)
    );
  }, [searchValue, allUniqUsers]);

  const totalBuyAmount = carDataByNationalCode?.purchases?.reduce(
    (sum, t) => sum + t.PurchaseAmount,
    0
  );
  const totalSellAmount = carDataByNationalCode?.sales?.reduce(
    (sum, t) => sum + t.SaleAmount,
    0
  );
  const diffBuySell = (totalSellAmount || 0) - (totalBuyAmount || 0);

  const totalReceived =
    transactionByChassis
      ?.filter(
        (t) =>
          t?.TransactionType === "دریافت" &&
          (t?.TransactionReason === "فروش" || t?.TransactionReason === "خرید")
      )
      .reduce((sum, t) => sum + (t?.TransactionAmount || 0), 0) || 0;
  const totalPayment =
    transactionByChassis
      ?.filter(
        (t) =>
          t?.TransactionType === "پرداخت" &&
          (t?.TransactionReason === "خرید" || t?.TransactionReason === "فروش")
      )
      .reduce((sum, t) => sum + (t?.TransactionAmount || 0), 0) || 0;

  const diffPaymentReceived = (totalPayment || 0) - (totalReceived || 0);

  const uniqeUsersRole = (userRole: string[]) => {
    if (userRole.includes("buyer") && userRole.includes("seller")) {
      return "خریدار / فروشنده";
    } else if (userRole.includes("buyer")) {
      return "خریدار";
    } else if (userRole.includes("seller")) {
      return "فروشنده";
    } else {
      return "—";
    }
  };

  // React.useEffect(() => {
  //   handleChequeDataByChassisNo(chassisNo);
  // }, [chassisNo]);

  return (
    <>
      <div className="grid grid-cols-3 gap-9 justify-between items-center mt-3">
        <div className="flex justify-between items-center">
          <p className="text-sm">
            مورد جستجو میتواند بخشی از نام و یا کد ملی مشتری باشد.
          </p>
          <input
            type="text"
            placeholder="اینجا تایپ کنید..."
            className="w-32 border border-gray-600 p-0 h-7 rounded-md pr-2 placeholder:text-sm"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm">تفاضل مبالغ خرید و فروش مشتری(فروش - خرید):</p>
          <p className="text-yellow-900">
            {diffBuySell?.toLocaleString("en-US")}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm">
            تفاضل مبالغ دریافتی و پرداختی(پرداخت - دریافت):
          </p>
          <p className="text-yellow-900">
            {diffPaymentReceived?.toLocaleString("en-US")}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-5 items-start mt-8">
        <div className="h-[33.7rem] max-h-[33.7rem] border border-gray-300 p-4 rounded-md relative w-full">
          <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
            لیست مشتریان
          </p>
          <div className="max-h-[30rem] overflow-y-auto rounded-md border w-full">
            <Table className="min-w-full table-fixed text-right border-collapse">
              <TableHeader className="top-0 sticky">
                <TableRow className="bg-gray-100">
                  <TableHead className="w-[15%] text-center">ردیف</TableHead>
                  <TableHead className="w-[65%] text-center">
                    نام کامل
                  </TableHead>
                  <TableHead className="w-[30%] text-center">کدملی</TableHead>
                  <TableHead className="w-[30%] text-center">نقش</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* {allUniqUsers?.map((item, index) => {
                  return (
                    <TableRow
                      key={`${item?.name}-${index}`}
                      onClick={() => {
                        handleCarDataByNationalId(item.nationalId, item.name);
                        setTransactionByChassis(null);
                      }}
                      className={`cursor-pointer ${
                        selectedNationalIdOrName ===
                        (item.name || item.nationalId)
                          ? "bg-gray-200"
                          : "bg-white"
                      }`}
                    // > */}
                {filteredUsers?.map((item, index) => {
                  return (
                    <TableRow
                      key={`${item?.name}-${index}`}
                      onClick={() => {
                        handleCarDataByNationalId(item.nationalId, item.name);
                        setTransactionByChassis(null);
                      }}
                      className={`cursor-pointer ${
                        selectedNationalIdOrName ===
                        (item.name || item.nationalId)
                          ? "bg-gray-200"
                          : "bg-white"
                      }`}
                    >
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center break-words">
                        {item.name ?? "__"}
                      </TableCell>
                      <TableCell className="text-center break-words">
                        {item.nationalId ?? "__"}
                      </TableCell>
                      <TableCell className="text-center break-words">
                        {uniqeUsersRole(item.roles) ?? "__"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
              فروشنده خودرو
            </p>
            <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-[15%] text-center">ردیف</TableHead>
                    <TableHead className="w-[35%] text-center">شاسی</TableHead>
                    <TableHead className="w-[55%] text-center">مدل</TableHead>
                    <TableHead className="w-[35%] text-center">تاریخ</TableHead>
                    <TableHead className="w-[30%] text-center">قیمت</TableHead>
                  </TableRow>
                </TableHeader>

                {carDataByNationalCode?.sales?.length &&
                carDataByNationalCode?.sales?.length > 0 ? (
                  <TableBody>
                    {carDataByNationalCode?.sales?.map((item, index) => (
                      <TableRow
                        key={`${item?._id}-${index}`}
                        onClick={() => {
                          handleChequeDataByChassisNo(item.ChassisNo);
                          handleTransationDataByChassisNo(item.ChassisNo);
                          dispatch(setChassisNo(item.ChassisNo));
                        }}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <TableCell className="text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.ChassisNo}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.CarModel}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.SaleDate}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.SaleAmount?.toLocaleString("en-US")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                ) : null}
              </Table>
            </div>
            {totalSellAmount && Number(totalSellAmount) > 0 ? (
              <p className="text-green-400 mt-3 flex justify-end">
                {totalSellAmount?.toLocaleString("en-US")}
              </p>
            ) : null}
          </div>
          <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
              خریدار خودرو
            </p>
            <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-[15%] text-center">ردیف</TableHead>
                    <TableHead className="w-[35%] text-center">شاسی</TableHead>
                    <TableHead className="w-[55%] text-center">مدل</TableHead>
                    <TableHead className="w-[35%] text-center">تاریخ</TableHead>
                    <TableHead className="w-[30%] text-center">قیمت</TableHead>
                  </TableRow>
                </TableHeader>

                {carDataByNationalCode?.purchases?.length &&
                carDataByNationalCode?.purchases?.length > 0 ? (
                  <TableBody>
                    {carDataByNationalCode?.purchases?.map((item, index) => (
                      <TableRow
                        key={`${item?._id}-${index}`}
                        onClick={() => {
                          handleChequeDataByChassisNo(item.ChassisNo);
                          handleTransationDataByChassisNo(item.ChassisNo);
                          dispatch(setChassisNo(item.ChassisNo));
                        }}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <TableCell className="text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.ChassisNo}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.CarModel}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.PurchaseDate}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.PurchaseAmount?.toLocaleString("en-US")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                ) : null}
              </Table>
            </div>
            {totalBuyAmount && Number(totalBuyAmount) > 0 ? (
              <p className="text-yellow-600 mt-3 flex justify-end">
                {totalBuyAmount?.toLocaleString("en-US")}
              </p>
            ) : null}
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
              دریافت و پرداخت
            </p>
            <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-12 text-center">ردیف</TableHead>
                    <TableHead className="w-12 text-center">تاریخ</TableHead>
                    <TableHead className="w-12 text-center">مبلغ</TableHead>
                    <TableHead className="w-12 text-center">تراکنش</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {transactionByChassis && transactionByChassis.length > 0
                    ? transactionByChassis.map((item, index) => (
                        <TableRow
                          key={`${item?._id}-${index}`}
                          className="hover:bg-gray-50 cursor-pointer"
                        >
                          <TableCell className="text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.TransactionDate}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.TransactionAmount?.toLocaleString("en-US") ??
                              ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.TransactionType} - {item.TransactionReason}
                          </TableCell>
                        </TableRow>
                      ))
                    : null}
                </TableBody>
              </Table>
            </div>
            {transactionByChassis && (
              <div className="flex justify-between items-center gap-2">
                <div className="flex gap-3 items-baseline">
                  <p className="text-sm">پرداخت</p>
                  <p className="text-red-500 mt-3 flex justify-end">
                    {totalPayment?.toLocaleString("en-US")}
                  </p>
                </div>
                <div className="flex gap-3 items-baseline">
                  <p className="text-sm">دریافت</p>
                  <p className="text-blue-500 mt-3 flex justify-end">
                    {totalReceived?.toLocaleString("en-US")}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
              لیست چک ها
            </p>
            <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-12 text-center">ردیف</TableHead>
                    <TableHead className="w-12 text-center">سریال چک</TableHead>
                    <TableHead className="w-12 text-center">
                      شناسه صیادی
                    </TableHead>
                    <TableHead className="w-12 text-center">مبلغ</TableHead>
                    <TableHead className="w-12 text-center">
                      تاریخ سررسید
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {chequeByChassis?.map((item, index) => (
                    <TableRow
                      key={`${item?._id}-${index}`}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center">
                        {item.ChequeSerial}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.SayadiID}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.ChequeAmount?.toLocaleString("en-US")}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.ChequeDueDate}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomersDashboard;
