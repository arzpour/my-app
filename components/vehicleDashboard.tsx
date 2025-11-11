"use client";
import {
  useGetChequeByChassisNo,
  useGetUnpaidCheques,
} from "@/apis/mutations/cheques";
import { useGetDetailByChassisNo } from "@/apis/mutations/detailsByChassisNo";
import { useGetInvestmentByChassis } from "@/apis/mutations/investment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { setTotalVehicleCost } from "@/redux/slices/carSlice";
import { RootState } from "@/redux/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const VehicleDashboard = () => {
  const { chassisNo } = useSelector((state: RootState) => state.cars);
  const [vehicleDetails, setVehicleDetails] =
    React.useState<IDetailsByChassis | null>(null);
  console.log("🚀 ~ VehicleDashboard ~ vehicleDetails:", vehicleDetails);
  const [investment, setInvestment] = React.useState<IInvestmentRes | null>(
    null
  );
  // const [unpaidCheques, setUnpaidCheques] =
  //   React.useState<IUnpaidCheque | null>(null);
  const [cheques, seCheques] = React.useState<IChequeRes[] | null>(null);

  const dispatch = useDispatch();

  const getDetailByChassisNo = useGetDetailByChassisNo();
  const getInvestmentByChassis = useGetInvestmentByChassis();
  // const getUnpaidCheques = useGetUnpaidCheques();
  const getChequesByChassisNo = useGetChequeByChassisNo();

  const handleCarDetailDataByChassisNoData = async (chassisNo: string) => {
    if (!chassisNo) return;
    try {
      const details = await getDetailByChassisNo.mutateAsync("00091");

      setVehicleDetails(details);
    } catch (error) {
      console.log("🚀 ~ handleSelectChassis ~ error:", error);
      setVehicleDetails(null);
    }
  };
  const handleInvestmentDataByChassisNoData = async (chassisNo: string) => {
    if (!chassisNo) return;

    try {
      const investment = await getInvestmentByChassis.mutateAsync(chassisNo);

      setInvestment(investment);
    } catch (error) {
      console.log("🚀 ~ handleSelectChassis ~ error:", error);
      setInvestment(null);
    }
  };

  // const handleUnpaidDataByChassisNoData = async (chassisNo: string) => {
  //   if (!chassisNo) return;

  //   try {
  //     const unpaidCheques = await getUnpaidCheques.mutateAsync(chassisNo);

  //     setUnpaidCheques(unpaidCheques);
  //   } catch (error) {
  //     console.log("🚀 ~ handleSelectChassis ~ error:", error);
  //     setUnpaidCheques(null);
  //   }
  // };

  const handleUnpaidDataByChassisNoData = async (chassisNo: string) => {
    if (!chassisNo) return;

    try {
      const cheques = await getChequesByChassisNo.mutateAsync("00091");

      seCheques(cheques);
    } catch (error) {
      console.log("🚀 ~ handleSelectChassis ~ error:", error);
      seCheques(null);
    }
  };

  const totalIssuedCheques =
    cheques
      ?.filter((c) => c.ChequeType === "صادره" && c.ChequeStatus !== "وصول شد")
      .reduce((sum, c) => sum + (c.ChequeAmount || 0), 0) || 0;

  const totalImportedCheques =
    cheques
      ?.filter((c) => c.ChequeType === "وارده" && c.ChequeStatus !== "وصول شد")
      .reduce((sum, c) => sum + (c.ChequeAmount || 0), 0) || 0;

  // const remainingToSeller =
  //   vehicleDetails?.car?.PurchaseAmount && totalPaid
  //     ? vehicleDetails?.car?.PurchaseAmount - totalPaid
  //     : "";

  // totalPaidToSeller

  const totalPaidToSellerAndOperator =
    vehicleDetails?.transactions
      ?.filter(
        (t) =>
          t.TransactionReason === "فروش" ||
          t.TransactionReason === "درصد کارگزار"
      )
      .reduce((sum, t) => sum + (t?.TransactionAmount || 0), 0) || 0;

  const totalPaidToSeller =
    vehicleDetails?.transactions
      ?.filter((t) => t.TransactionReason === "فروش")
      ?.reduce((sum, t) => sum + (t?.TransactionAmount || 0), 0) || 0;
  console.log("🚀 ~ VehicleDashboard ~ totalPaidToSeller:", totalPaidToSeller);

  const totalPaidToSellerWithoutFilter =
    vehicleDetails?.transactions?.reduce(
      (sum, t) => sum + (t?.TransactionAmount || 0),
      0
    ) || 0;

  const remainingToSeller =
    totalPaidToSeller && vehicleDetails?.car.SaleAmount
      ? totalPaidToSeller - vehicleDetails?.car.SaleAmount
      : "";

  const receiveTransactions = vehicleDetails?.transactions?.filter(
    (t) => t.TransactionType === "دریافت"
  );

  const totalReceived =
    receiveTransactions?.reduce(
      (sum, t) => sum + (t?.TransactionAmount || 0),
      0
    ) || 0;

  const remainingForBuyer =
    vehicleDetails?.car?.PurchaseAmount && totalReceived
      ? totalReceived - vehicleDetails?.car.PurchaseAmount
      : "";

  // PurchaseAmount

  // const remainingForBuyer =
  //   vehicleDetails?.car?.SaleAmount && totalReceived
  //     ? vehicleDetails?.car?.SaleAmount - totalReceived
  //     : "";

  const receivedTransactions = vehicleDetails?.transactions?.filter(
    (t) => t.TransactionType === "دریافت"
  );
  const paidTransactions = vehicleDetails?.transactions?.filter(
    (t) => t.TransactionType === "پرداخت"
  );

  const totalBroker =
    investment?.data?.reduce((sum, t) => sum + (t?.Broker || 0), 0) || 0;

  React.useEffect(() => {
    handleUnpaidDataByChassisNoData(chassisNo);
    handleCarDetailDataByChassisNoData(chassisNo);
    handleInvestmentDataByChassisNoData(chassisNo);
  }, [chassisNo]);

  return (
    <>
      <div className="my-5 mb-7">
        <div className="w-full flex justify-center gap-4">
          <div className="h-[28rem] max-h-[28rem] border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-red-500 absolute right-2 -top-5 bg-white py-2 px-4">
              پرداخت های شما
            </p>
            <div className="h-[23rem] max-h-[23rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-12 text-center">ردیف</TableHead>
                    <TableHead className="w-12 text-center">تاریخ</TableHead>
                    <TableHead className="w-12 text-center">مبلغ</TableHead>
                    <TableHead className="w-12 text-center">کدملی</TableHead>
                    <TableHead className="w-12 text-center">
                      دلیل تراکنش
                    </TableHead>
                    <TableHead className="w-12 text-center">
                      روش پرداخت
                    </TableHead>
                    <TableHead className="w-12 text-center">کارگزار</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paidTransactions &&
                    paidTransactions?.length > 0 &&
                    paidTransactions?.map((item, index) => {
                      const totalVehicleCost = paidTransactions
                        ?.filter(
                          (item) =>
                            item?.TransactionReason?.replace(
                              /\s/g,
                              ""
                            ).includes("هزینهوسیله") ||
                            item?.TransactionReason?.replace(
                              /\s/g,
                              ""
                            ).includes("هزينهوسیله")
                        )
                        ?.reduce(
                          (sum, item) => sum + (item.TransactionAmount || 0),
                          0
                        );

                      dispatch(setTotalVehicleCost(totalVehicleCost));

                      return (
                        <TableRow
                          key={`${item?._id}-${index}`}
                          className="hover:bg-gray-50"
                        >
                          <TableCell className="text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.TransactionDate ?? ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.TransactionAmount?.toLocaleString("en-US") ??
                              ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.CustomerNationalID ?? ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.TransactionReason ?? ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.TransactionMethod ?? ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.ShowroomCard ?? ""}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
            <div className="grid grid-cols-4 gap-3 items-start mt-3">
              <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide">
                <p className="text-xs">مانده مبلغ قابل پرداخت به فروشنده</p>
                <p className="font-bold text-sm">
                  {typeof remainingToSeller === "number"
                    ? remainingToSeller.toLocaleString("en-US")
                    : remainingToSeller ?? ""}
                </p>
              </div>
              <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide">
                <p className="text-xs">مجموع پرداختی به فروشنده و کارگزاران</p>
                <p className="text-red-500 text-sm">
                  {totalPaidToSellerAndOperator
                    ? totalPaidToSellerAndOperator.toLocaleString("en-US")
                    : ""}
                </p>
              </div>
              <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide">
                <p className="text-xs">مجموع پرداختی به فروشنده</p>
                <p className="text-red-500 text-sm">
                  {totalPaidToSeller
                    ? totalPaidToSeller.toLocaleString("en-US")
                    : ""}
                </p>
              </div>
              <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide">
                <p className="text-xs">مجموع کل پرداختی</p>
                <p className="text-red-500 text-sm">
                  {totalPaidToSellerWithoutFilter
                    ? totalPaidToSellerWithoutFilter.toLocaleString("en-US")
                    : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="h-[28rem] max-h-[28rem] border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-green-500 absolute right-2 -top-5 bg-white py-2 px-4">
              دریافت های شما
            </p>
            <div className="h-[23rem] max-h-[23rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="hover:bg-transparent bg-gray-100">
                    <TableHead className="w-12 text-center">ردیف</TableHead>
                    <TableHead className="w-12 text-center">تاریخ</TableHead>
                    <TableHead className="w-12 text-center">مبلغ</TableHead>
                    <TableHead className="w-12 text-center">کدملی</TableHead>
                    <TableHead className="w-12 text-center">
                      دلیل تراکنش
                    </TableHead>
                    <TableHead className="w-12 text-center">
                      روش پرداخت
                    </TableHead>
                    <TableHead className="w-12 text-center">کارگزار</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receivedTransactions &&
                    receivedTransactions.length > 0 &&
                    receivedTransactions?.map((item, index) => (
                      <TableRow
                        key={`${item?._id}-${index}`}
                        className="hover:bg-gray-50"
                      >
                        <TableCell className="text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.TransactionDate ?? ""}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.TransactionAmount?.toLocaleString("en-US") ??
                            ""}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.CustomerNationalID ?? ""}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.TransactionReason ?? ""}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.TransactionMethod ?? ""}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.ShowroomCard ?? ""}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            <div className="grid grid-cols-2 gap-3 item?-center mt-3">
              <div className="space-y-2">
                <p className="text-xs">مانده مبلغ قابل دریافت از خریدار</p>
                <p className="font-bold text-sm">
                  {typeof remainingForBuyer === "number"
                    ? remainingForBuyer.toLocaleString("en-US")
                    : remainingForBuyer ?? ""}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs">مجموع دریافتی از خریدار</p>
                <p className="text-green-500 text-sm">
                  {totalReceived ? totalReceived.toLocaleString("en-US") : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-7">
        <div className="w-full flex justify-center gap-4">
          <div className="h-[18rem] max-h-[18rem] border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-300 absolute right-2 -top-5 bg-white py-2 px-4">
              افزایش/کاهش سرمایه
            </p>
            <div className="h-[14rem] max-h-[14rem] overflow-y-auto rounded-md border w-full">
              <Table
                className="min-w-full table-fixed text-right border-collapse"
                dir="rtl"
              >
                <TableHeader className="top-0 sticky">
                  <TableRow className="hover:bg-transparent bg-gray-100">
                    <TableHead className="text-center">ردیف</TableHead>
                    <TableHead className="text-center">تاریخ</TableHead>
                    <TableHead className="text-center">مبلغ</TableHead>
                    <TableHead className="text-center">شریک</TableHead>
                    <TableHead className="text-center">درصد سود</TableHead>
                    <TableHead className="text-center">دلیل تراکنش</TableHead>
                    <TableHead className="text-center">روش</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {investment?.data && investment.data.length > 0
                    ? investment.data.map((item, index) => (
                        <TableRow
                          key={`${item?._id}-${index}`}
                          className="hover:bg-gray-50"
                        >
                          <TableCell className="text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.TransactionDate ?? ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.TransactionAmount?.toLocaleString("en-US") ??
                              ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.Partner ?? ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.Broker ?? ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.TransactionReason ?? ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.TransactionMethod ?? ""}
                          </TableCell>
                        </TableRow>
                      ))
                    : null}
                </TableBody>
              </Table>
            </div>
            <div className="flex gap-3 item?-center justify-between mt-3">
              <p className="text-sm">
                در جدول بالا منظور از درصد، درصد مشارکت سرمایه گذار در تامین
                سرمایه است.
              </p>
              <p className="font-semibold text-sm">
                {totalBroker ? totalBroker.toLocaleString("en-US") : ""}
              </p>
            </div>
          </div>

          <div className="h-[18rem] max-h-[18rem] border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-300 absolute right-2 -top-5 bg-white py-2 px-4">
              چک های صادره و وارده
            </p>
            <div className="h-[14rem] max-h-[14rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="hover:bg-transparent bg-gray-100">
                    <TableHead className="text-center">ردیف</TableHead>
                    <TableHead className="text-center">نام مشتری</TableHead>
                    <TableHead className="text-center">مبلغ</TableHead>
                    <TableHead className="text-center">سررسید</TableHead>
                    <TableHead className="text-center">وضعیت چک</TableHead>
                    <TableHead className="text-center">شناسه صیادی</TableHead>
                    <TableHead className="text-center">سریال چک</TableHead>
                    <TableHead className="text-center">بانک ...</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cheques && cheques.length > 0
                    ? cheques?.map((item, index) => (
                        <TableRow
                          key={`${item?._id}-${index}`}
                          className="has-data-[state=checked]:bg-muted/50"
                        >
                          <TableCell className="text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.CustomerName}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.ChequeAmount?.toLocaleString("en-US") ?? ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.ChequeDueDate}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.ChequeStatus}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.SayadiID}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.ChequeSerial}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.Bank}
                          </TableCell>
                        </TableRow>
                      ))
                    : null}
                </TableBody>
              </Table>
            </div>
            <div className="flex gap-3 item??-center justify-end mt-3">
              <p className="flex gap-2 items-center">
                <span className="text-xs">مجموع چک های صادره وصول نشده</span>
                <span>
                  {totalIssuedCheques
                    ? totalIssuedCheques?.toLocaleString("en-US")
                    : "—"}
                </span>
              </p>
              <p className="flex gap-2 items-center">
                <span className="text-xs">مجموع چک های وارده وصول نشده</span>
                <span>
                  {totalImportedCheques
                    ? totalImportedCheques?.toLocaleString("en-US")
                    : "—"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleDashboard;
