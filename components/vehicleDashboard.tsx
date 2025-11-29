"use client";
/**
 * ============================================
 * MIGRATION NOTES FOR NEW BACKEND API
 * ============================================
 *
 * CURRENT API USAGE:
 * - useGetDetailByChassisNo: Gets vehicle details by chassis number
 * - useGetChequeByChassisNo: Gets cheques by chassis number
 * - useGetInvestmentByChassis: Gets investment data by chassis number
 *
 * NEW API ENDPOINTS TO USE:
 *
 * 1. GET DEAL BY VIN (replaces getDetailByChassisNo):
 *    - Endpoint: GET /deals/vin/:vin
 *    - Type: IDeal
 *    - Note: chassisNo maps to vehicleSnapshot.vin in the new structure
 *    - Response includes: deal info, vehicle snapshot, seller, buyer, brokers, partnerships
 *
 * 2. GET TRANSACTIONS BY DEAL ID (replaces transactions from detailsByChassisNo):
 *    - Endpoint: GET /transactions/deal/:dealId
 *    - Type: ITransactionNew[]
 *    - Note: dealId comes from the deal._id, not chassisNo
 *    - Field mappings:
 *      - TransactionType -> type
 *      - TransactionReason -> reason
 *      - TransactionAmount -> amount
 *      - TransactionDate -> transactionDate
 *      - TransactionMethod -> paymentMethod
 *      - CustomerNationalID -> personId
 *      - ShowroomCard -> bussinessAccountId
 *
 * 3. GET CHEQUES BY DEAL ID (replaces getChequeByChassisNo):
 *    - Endpoint: GET /cheques/deal/:dealId
 *    - Type: IChequeNew[]
 *    - Note: Use dealId instead of chassisNo
 *    - Field mappings:
 *      - ChequeType -> type ("issued" | "received")
 *      - ChequeStatus -> status
 *      - ChequeAmount -> amount
 *      - ChequeDueDate -> dueDate
 *      - CustomerName -> payer.fullName or payee.fullName
 *      - SayadiID -> (check actions array)
 *      - ChequeSerial -> chequeNumber
 *      - Bank -> bankName
 *
 * 4. GET UNPAID CHEQUES BY DEAL ID (replaces getUnpaidCheques):
 *    - Endpoint: GET /cheques/unpaid/deal/:dealId
 *    - Type: IUnpaidChequesResponse
 *    - Response includes: cheques array and totals.issuedUnpaid, totals.receivedUnpaid
 *
 * 5. GET INVESTMENT/PARTNERSHIP DATA (replaces getInvestmentByChassis):
 *    - Endpoint: GET /deals/id/:dealId
 *    - Type: IDeal
 *    - Use: deal.partnerships array for investment data
 *    - Field mappings:
 *      - Partner -> partnerships[].partner.name
 *      - Broker (percentage) -> partnerships[].profitSharePercentage
 *      - TransactionAmount -> partnerships[].investmentAmount
 *
 * MIGRATION STEPS:
 * 1. First, get deal by VIN: GET /deals/vin/:chassisNo
 * 2. Extract dealId from deal._id
 * 3. Use dealId to fetch:
 *    - Transactions: GET /transactions/deal/:dealId
 *    - Cheques: GET /cheques/deal/:dealId
 *    - Unpaid cheques: GET /cheques/unpaid/deal/:dealId
 * 4. Use deal.partnerships for investment data
 * 5. Update all field references to match new structure
 */
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

  /**
   * MIGRATION: Replace this function to use new API
   *
   * NEW IMPLEMENTATION:
   * 1. GET /deals/vin/:chassisNo to get deal by VIN
   * 2. GET /transactions/deal/:dealId to get transactions
   * 3. Combine into IDetailsByChassis-like structure or refactor to use IDeal directly
   *
   * Example:
   * const deal = await axiosInstance.get(`/deals/vin/${chassisNo}`);
   * const transactions = await axiosInstance.get(`/transactions/deal/${deal._id}`);
   * const combinedData = { car: deal, transactions };
   */
  const handleCarDetailDataByChassisNoData = async (chassisNo: string) => {
    if (!chassisNo) return;
    try {
      const details = await getDetailByChassisNo.mutateAsync(chassisNo);

      setVehicleDetails(details);
    } catch (error) {
      console.log("🚀 ~ handleSelectChassis ~ error:", error);
      setVehicleDetails(null);
    }
  };
  /**
   * MIGRATION: Replace this function to use new API
   *
   * NEW IMPLEMENTATION:
   * 1. GET /deals/vin/:chassisNo to get deal
   * 2. Use deal.partnerships array for investment data
   * 3. Map partnerships to IInvestmentRes format:
   *    - partnerships[].partner.name -> Partner
   *    - partnerships[].profitSharePercentage -> Broker
   *    - partnerships[].investmentAmount -> TransactionAmount
   *
   * Example:
   * const deal = await axiosInstance.get(`/deals/vin/${chassisNo}`);
   * const investmentData = deal.partnerships.map(p => ({
   *   Partner: p.partner.name,
   *   Broker: p.profitSharePercentage,
   *   TransactionAmount: p.investmentAmount,
   *   TransactionDate: deal.createdAt,
   *   TransactionReason: "اصل شرکت",
   *   TransactionMethod: ""
   * }));
   */
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

  /**
   * MIGRATION: Replace this function to use new API
   *
   * NEW IMPLEMENTATION:
   * 1. First get deal: GET /deals/vin/:chassisNo
   * 2. Then get unpaid cheques: GET /cheques/unpaid/deal/:dealId
   * 3. Use response.cheques array
   * 4. Field mappings:
   *    - c.type === "issued" -> ChequeType === "صادره"
   *    - c.type === "received" -> ChequeType === "وارده"
   *    - c.status !== "paid" -> ChequeStatus !== "وصول شد"
   *    - c.amount -> ChequeAmount
   *    - c.dueDate -> ChequeDueDate
   *    - c.payer.fullName or c.payee.fullName -> CustomerName
   *    - c.chequeNumber -> ChequeSerial
   *    - c.bankName -> Bank
   *
   * Example:
   * const deal = await axiosInstance.get(`/deals/vin/${chassisNo}`);
   * const unpaidData = await axiosInstance.get(`/cheques/unpaid/deal/${deal._id}`);
   * const mappedCheques = unpaidData.cheques.map(c => ({
   *   ChequeType: c.type === "issued" ? "صادره" : "وارده",
   *   ChequeStatus: c.status,
   *   ChequeAmount: c.amount,
   *   // ... other mappings
   * }));
   */
  const handleUnpaidDataByChassisNoData = async (chassisNo: string) => {
    if (!chassisNo) return;

    try {
      const cheques = await getChequesByChassisNo.mutateAsync(chassisNo);

      seCheques(cheques);
    } catch (error) {
      console.log("🚀 ~ handleSelectChassis ~ error:", error);
      seCheques(null);
    }
  };

  /**
   * MIGRATION: Update field references for new API structure
   *
   * NEW FIELD MAPPINGS:
   * - c.ChequeType -> c.type ("issued" | "received")
   * - c.ChequeStatus -> c.status
   * - c.ChequeAmount -> c.amount
   *
   * OR use the totals from GET /cheques/unpaid/deal/:dealId response:
   * - totals.issuedUnpaid (already calculated on backend)
   * - totals.receivedUnpaid (already calculated on backend)
   */
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

  /**
   * MIGRATION: Update field references for new API structure
   *
   * NEW FIELD MAPPINGS:
   * - t.TransactionType -> t.type
   * - t.TransactionReason -> t.reason
   * - t.TransactionAmount -> t.amount
   */
  const totalPaidToSellerAndOperator =
    vehicleDetails?.transactions
      ?.filter(
        (t) =>
          (t.TransactionType === "پرداخت" && t.TransactionReason === "خريد") ||
          (t.TransactionType === "پرداخت" &&
            t.TransactionReason === "درصد کارگزار")
      )
      .reduce((sum, t) => sum + (t?.TransactionAmount || 0), 0) || 0;

  const totalPaidToSeller =
    vehicleDetails?.transactions
      ?.filter(
        (t) => t.TransactionType === "پرداخت" && t.TransactionReason === "خريد"
      )
      ?.reduce((sum, t) => sum + (t?.TransactionAmount || 0), 0) || 0;

  const totalPaidToSellerWithoutFilter =
    vehicleDetails?.transactions
      ?.filter((t) => t.TransactionType === "پرداخت")
      .reduce((sum, t) => sum + (t?.TransactionAmount || 0), 0) || 0;

  /**
   * MIGRATION: Update field references for new API structure
   *
   * NEW FIELD MAPPINGS:
   * - vehicleDetails?.car.SaleAmount -> deal.salePrice
   * - vehicleDetails?.car.PurchaseAmount -> deal.purchasePrice
   * - t.TransactionType -> t.type
   * - t.TransactionAmount -> t.amount
   */
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

  /**
   * MIGRATION: Update for new API structure
   *
   * NEW IMPLEMENTATION:
   * Use deal.partnerships array:
   * const totalBroker = deal.partnerships?.reduce(
   *   (sum, p) => sum + (p.profitSharePercentage || 0),
   *   0
   * ) || 0;
   */
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
            <div className="h-[22rem] max-h-[22rem] overflow-y-auto rounded-md border w-full">
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
                          {/* MIGRATION: Update field references
                           * - item?.TransactionDate -> item?.transactionDate
                           * - item?.TransactionAmount -> item?.amount
                           * - item?.CustomerNationalID -> item?.personId
                           * - item?.TransactionReason -> item?.reason
                           * - item?.TransactionMethod -> item?.paymentMethod
                           * - item?.ShowroomCard -> item?.bussinessAccountId
                           */}
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
            <div className="grid grid-cols-2 gap-3 items-start space-y-0">
              <div>
                <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
                  <p className="text-xs">مانده مبلغ قابل پرداخت به فروشنده</p>
                  <p className="font-bold text-sm">
                    {typeof remainingToSeller === "number"
                      ? remainingToSeller.toLocaleString("en-US")
                      : remainingToSeller ?? 0}
                  </p>
                </div>
                <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
                  <p className="text-xs">
                    مجموع پرداختی به فروشنده و کارگزاران
                  </p>
                  <p className="text-red-500 text-sm">
                    {totalPaidToSellerAndOperator
                      ? totalPaidToSellerAndOperator.toLocaleString("en-US")
                      : 0}
                  </p>
                </div>
              </div>
              <div>
                <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
                  <p className="text-xs">مجموع پرداختی به فروشنده</p>
                  <p className="text-red-500 text-sm">
                    {totalPaidToSeller
                      ? totalPaidToSeller.toLocaleString("en-US")
                      : 0}
                  </p>
                </div>
                <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
                  <p className="text-xs">مجموع کل پرداختی</p>
                  <p className="text-red-500 text-sm">
                    {totalPaidToSellerWithoutFilter
                      ? totalPaidToSellerWithoutFilter.toLocaleString("en-US")
                      : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[28rem] max-h-[28rem] border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-green-500 absolute right-2 -top-5 bg-white py-2 px-4">
              دریافت های شما
            </p>
            <div className="h-[22rem] max-h-[22rem] overflow-y-auto rounded-md border w-full">
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
                        {/* MIGRATION: Update field references (same as paid transactions above) */}
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
                    : remainingForBuyer ?? 0}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs">مجموع دریافتی از خریدار</p>
                <p className="text-green-500 text-sm">
                  {totalReceived ? totalReceived.toLocaleString("en-US") : 0}
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
                          {/* MIGRATION: Update for partnerships array from deal
                           * - item?.TransactionDate -> deal.createdAt or partnership date
                           * - item?.TransactionAmount -> p.investmentAmount
                           * - item?.Partner -> p.partner.name
                           * - item?.Broker -> p.profitSharePercentage
                           * - item?.TransactionReason -> "اصل شرکت" or "سود شراکت"
                           * - item?.TransactionMethod -> (may need to get from related transaction)
                           */}
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
                    <TableHead className="text-center w-[30%]">ردیف</TableHead>
                    <TableHead className="text-center w-[70%]">
                      نام مشتری
                    </TableHead>
                    <TableHead className="text-center w-[50%]">مبلغ</TableHead>
                    <TableHead className="text-center w-[50%]">
                      سررسید
                    </TableHead>
                    <TableHead className="text-center w-[50%]">
                      وضعیت چک
                    </TableHead>
                    <TableHead className="text-center w-[50%]">
                      شناسه صیادی
                    </TableHead>
                    <TableHead className="text-center w-[50%]">
                      سریال چک
                    </TableHead>
                    <TableHead className="text-center w-[30%]">بانک</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* {cheques && cheques.length > 0
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
                    : null} */}

                  {[].length > 0
                    ? []?.map((item, index) => (
                        <TableRow
                          key={`${item}-${index}`}
                          className="has-data-[state=checked]:bg-muted/50"
                        >
                          <TableCell className="text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-center">{item}</TableCell>
                          <TableCell className="text-center">
                            {item ?? ""}
                          </TableCell>
                          <TableCell className="text-center">{item}</TableCell>
                          <TableCell className="text-center">{item}</TableCell>
                          <TableCell className="text-center">{item}</TableCell>
                          <TableCell className="text-center">{item}</TableCell>
                          <TableCell className="text-center">{item}</TableCell>
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
                    : 0}
                </span>
              </p>
              <p className="flex gap-2 items-center">
                <span className="text-xs">مجموع چک های وارده وصول نشده</span>
                <span>
                  {totalImportedCheques
                    ? totalImportedCheques?.toLocaleString("en-US")
                    : 0}
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
