"use client";
import { useGetChequesByDealId } from "@/apis/mutations/cheques";
import { useGetTransactionsByDealId } from "@/apis/mutations/transaction";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetDealsByVin from "@/hooks/useGetDealsByVin";
import { setTotalVehicleCost } from "@/redux/slices/carSlice";
import { RootState } from "@/redux/store";
import { IChequeNew, IDeal, ITransactionNew } from "@/types/new-backend-types";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const VehicleDashboard = () => {
  const { chassisNo, selectedDealId } = useSelector(
    (state: RootState) => state.cars
  );
  const [deal, setDeal] = React.useState<IDeal>();
  const [transactions, setTransactions] = React.useState<ITransactionNew[]>([]);
  const [cheques, setCheques] = React.useState<IChequeNew[] | null>(null);

  const dispatch = useDispatch();

  const getDealByVin = useGetDealsByVin(chassisNo);
  const dealsData = getDealByVin.data;

  const getTransactionsByDealId = useGetTransactionsByDealId();
  const getChequesByDealId = useGetChequesByDealId();

  const getTransactionsByDealIdHandler = async () => {
    if (!deal?._id) return;
    try {
      const transactions = await getTransactionsByDealId.mutateAsync(
        deal?._id.toString() ?? selectedDealId ?? ""
      );
      setTransactions(transactions);
    } catch (error) {
      console.log("🚀 ~ getTransactionsByDealIdHandler ~ error:", error);
    }
  };

  const getChequesByDealIdHandler = async () => {
    if (!deal?._id) return;
    try {
      const cheques = await getChequesByDealId.mutateAsync(
        deal?._id.toString() ?? selectedDealId ?? ""
      );
      setCheques(cheques);
    } catch (error) {
      console.log("🚀 ~ getChequesByDealIdHandler ~ error:", error);
    }
  };

  const isChequePaid = (cheque: IChequeNew): boolean => {
    const paidStatuses = ["paid", "پاس شده", "وصول شده", "پاس شده است"];
    return paidStatuses.some((status) =>
      cheque.status?.toLowerCase().includes(status.toLowerCase())
    );
  };

  const isIssuedCheque = (cheque: IChequeNew): boolean => {
    return (
      cheque.type === "issued" ||
      cheque.type === "صادره" ||
      cheque.type?.toLowerCase().includes("issued") ||
      cheque.type?.toLowerCase().includes("صادره")
    );
  };

  const isReceivedCheque = (cheque: IChequeNew): boolean => {
    return (
      cheque.type === "received" ||
      cheque.type === "وارده" ||
      cheque.type?.toLowerCase().includes("received") ||
      cheque.type?.toLowerCase().includes("وارده")
    );
  };

  // Calculate cheque totals
  // Total issued cheques unpaid
  const totalIssuedChequesUnpaid =
    cheques
      ?.filter((c) => isIssuedCheque(c) && !isChequePaid(c))
      .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

  // Total issued cheques paid
  const totalIssuedChequesPaid =
    cheques
      ?.filter((c) => isIssuedCheque(c) && isChequePaid(c))
      .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

  // Total received cheques unpaid
  const totalReceivedChequesUnpaid =
    cheques
      ?.filter((c) => isReceivedCheque(c) && !isChequePaid(c))
      .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

  // Total received cheques paid
  const totalReceivedChequesPaid =
    cheques
      ?.filter((c) => isReceivedCheque(c) && isChequePaid(c))
      .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

  // const totalPaidToSellerAndOperator =
  //   transactions
  //     ?.filter(
  //       (t) =>
  //         (t.type === "پرداخت" && t.reason === "خريد") ||
  //         (t.type === "پرداخت" && t.reason === "درصد کارگزار")
  //     )
  //     .reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

  const totalPaidToSeller =
    transactions
      ?.filter((t) => t.type === "پرداخت" && t.reason === "خريد")
      ?.reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

  const totalPaidToSellerWithoutFilter =
    transactions
      ?.filter((t) => t.type === "پرداخت")
      .reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

  const receiveTransactions = transactions?.filter((t) => t.type === "دریافت");

  const totalReceived =
    receiveTransactions?.reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

  const remainingForBuyer =
    deal?.purchasePrice && totalReceived
      ? totalReceived - deal?.purchasePrice
      : "";

  const receivedTransactions = transactions?.filter((t) => t.type === "دریافت");

  const paidTransactions = transactions?.filter((t) => t.type === "پرداخت");

  const totalPaidToBroker =
    transactions
      ?.filter((t) => t.type === "پرداخت" && t.reason === "درصد کارگزار")
      .reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

  // const otherCostCategories =
  //   deal?.directCosts?.otherCost?.map((cost) => cost.category) || [];
  // const otherCostsFromDirectCosts =
  //   deal?.directCosts?.otherCost?.reduce(
  //     (sum, cost) => sum + (cost.cost || 0),
  //     0
  //   ) || 0;
  // const otherCostsFromTransactions =
  //   transactions
  //     ?.filter(
  //       (t) =>
  //         t.type === "پرداخت" &&
  //         otherCostCategories.some((category) => t.reason === category)
  //     )
  //     .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
  const vehicleCosts =
    transactions
      ?.filter(
        (t) =>
          t.type === "پرداخت" &&
          (t.reason?.replace(/\s/g, "").includes("هزینهوسیله") ||
            t.reason?.replace(/\s/g, "").includes("هزينهوسیله"))
      )
      .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

  const remainingToSeller =
    deal?.purchasePrice && totalPaidToSeller
      ? deal.purchasePrice - totalPaidToSeller
      : deal?.purchasePrice || 0;

  // const totalBrokerPercentage =
  //   deal?.partnerships?.reduce(
  //     (sum, p) => sum + (p.profitSharePercentage || 0),
  //     0
  //   ) || 0;

  const totalPaidForInvestment =
    transactions
      ?.filter(
        (t) =>
          t.type === "پرداخت" &&
          (t.reason === "افزایش سرمایه" || t.reason === "کاهش سرمایه")
      )
      .reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

  const totalReceivedForInvestment =
    transactions
      ?.filter(
        (t) =>
          t.type === "دریافت" &&
          (t.reason === "افزایش سرمایه" || t.reason === "کاهش سرمایه")
      )
      .reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

  React.useEffect(() => {
    getTransactionsByDealIdHandler();
    getChequesByDealIdHandler();
  }, [deal?._id, selectedDealId]);

  React.useEffect(() => {
    if (dealsData?.length === 1) {
      setDeal(dealsData[0]);
    } else if (dealsData?.length && dealsData?.length > 1) {
      const selectedDeal = dealsData?.find(
        (deal) => deal._id.toString() === selectedDealId
      );
      setDeal(selectedDeal ?? undefined);
    }
  }, [dealsData, selectedDealId]);

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
                    <TableHead className="w-12 text-center">
                      دلیل تراکنش
                    </TableHead>
                    <TableHead className="w-12 text-center">
                      روش پرداخت
                    </TableHead>
                    <TableHead className="w-12 text-center">
                      حساب مبدا
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paidTransactions &&
                    paidTransactions?.length > 0 &&
                    paidTransactions?.map((item, index) => {
                      const totalVehicleCost = paidTransactions
                        ?.filter(
                          (item) =>
                            item?.reason
                              ?.replace(/\s/g, "")
                              .includes("هزینهوسیله") ||
                            item?.reason
                              ?.replace(/\s/g, "")
                              .includes("هزينهوسیله")
                        )
                        ?.reduce((sum, item) => sum + (item.amount || 0), 0);

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
                            {item?.transactionDate ?? ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.amount?.toLocaleString("en-US") ?? ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.reason ?? ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.paymentMethod ?? ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.bussinessAccountId ?? ""}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
            <div className="grid grid-cols-5 gap-3 items-start space-y-0">
              <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
                <p className="text-xs">مجموع</p>
                <p className="text-red-500 text-xs">
                  {totalPaidToSellerWithoutFilter
                    ? totalPaidToSellerWithoutFilter.toLocaleString("en-US")
                    : 0}
                </p>
              </div>
              <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
                <p className="text-xs">مجموع به طرف اول</p>
                <p className="font-bold text-xs">
                  {totalPaidToSeller
                    ? totalPaidToSeller.toLocaleString("en-US")
                    : 0}
                </p>
              </div>
              <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
                <p className="text-xs">مجموع به کارگزار</p>
                <p className="font-bold text-xs">
                  {totalPaidToBroker
                    ? totalPaidToBroker.toLocaleString("en-US")
                    : 0}
                </p>
              </div>
              <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
                <p className="text-xs">مجموع هزینه</p>
                <p className="font-bold text-xs">
                  {vehicleCosts ? vehicleCosts.toLocaleString("en-US") : 0}
                </p>
              </div>
              <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-center gap-3">
                <p className="text-xs">مانده</p>
                <p className="font-bold text-xs">
                  {typeof remainingToSeller === "number"
                    ? remainingToSeller.toLocaleString("en-US")
                    : remainingToSeller ?? 0}
                </p>
              </div>

              {/* <div>
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
                  <p className="text-xs">مجموع</p>
                  <p className="text-red-500 text-sm">
                    {totalPaidToSellerWithoutFilter
                      ? totalPaidToSellerWithoutFilter.toLocaleString("en-US")
                      : 0}
                  </p>
                </div>
              </div> */}
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
                    <TableHead className="w-12 text-center">
                      دلیل تراکنش
                    </TableHead>
                    <TableHead className="w-12 text-center">
                      روش پرداخت
                    </TableHead>
                    <TableHead className="w-12 text-center">
                      حساب مبدا
                    </TableHead>
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
                          {item?.transactionDate ?? ""}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.amount?.toLocaleString("en-US") ?? ""}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.reason ?? ""}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.paymentMethod ?? ""}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.bussinessAccountId ?? ""}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            <div className="grid grid-cols-2 gap-3 items-center mt-3">
              <div className="flex gap-3 items-center">
                {/* <p className="text-xs">مانده مبلغ قابل دریافت از خریدار</p> */}
                <span className="text-xs">مانده</span>
                <span className="font-bold text-xs">
                  {typeof remainingForBuyer === "number"
                    ? remainingForBuyer.toLocaleString("en-US")
                    : remainingForBuyer ?? 0}
                </span>
              </div>

              <div className="flex gap-3 items-center">
                {/* <p className="text-xs">مجموع دریافتی از خریدار</p> */}
                <span className="text-xs">مجموع</span>
                <span className="text-green-500 text-xs">
                  {totalReceived ? totalReceived.toLocaleString("en-US") : 0}
                </span>
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
                    <TableHead className="text-center">دلیل تراکنش</TableHead>
                    <TableHead className="text-center">روش پرداخت</TableHead>
                    <TableHead className="text-center">حساب مبدا</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {deal?.partnerships && deal.partnerships.length > 0
                    ? deal.partnerships.map((partnership, index) => {
                        const relatedTransaction = transactions?.find(
                          (t) =>
                            t.type === "پرداخت" &&
                            t.personId?.toString() ===
                              partnership.partner.personId
                        );

                        return (
                          <TableRow
                            key={`${partnership.partner.personId}-${index}`}
                            className="hover:bg-gray-50"
                          >
                            <TableCell className="text-center">
                              {index + 1}
                            </TableCell>
                            <TableCell className="text-center">
                              {relatedTransaction?.transactionDate ||
                                deal.createdAt?.split("T")[0] ||
                                ""}
                            </TableCell>
                            <TableCell className="text-center">
                              {partnership.investmentAmount
                                ? partnership.investmentAmount.toLocaleString(
                                    "en-US"
                                  )
                                : ""}
                            </TableCell>
                            <TableCell className="text-center">
                              {partnership.partner.name || ""}
                            </TableCell>
                            <TableCell className="text-center">
                              {partnership.profitSharePercentage
                                ? `${(
                                    partnership.profitSharePercentage * 100
                                  ).toFixed(2)}%`
                                : ""}
                            </TableCell>
                            <TableCell className="text-center">
                              {partnership.investmentAmount > 0
                                ? "اصل شرکت"
                                : "سود شراکت"}
                            </TableCell>
                            <TableCell className="text-center">
                              {relatedTransaction?.paymentMethod || ""}
                            </TableCell>
                            <TableCell className="text-center">
                              {relatedTransaction?.bussinessAccountId || ""}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    : null}
                </TableBody>
              </Table>
            </div>
            <div className="flex gap-3 item?-center justify-between mt-3">
              <p className="flex gap-2 items-center">
                <span className="text-xs">مجموع دریافتی</span>
                <span className="text-xs">
                  {totalReceivedForInvestment
                    ? totalReceivedForInvestment?.toLocaleString("en-US")
                    : 0}
                </span>
              </p>
              <p className="flex gap-2 items-center">
                <span className="text-xs">مجموع پرداختی</span>
                <span className="text-xs">
                  {totalPaidForInvestment
                    ? totalPaidForInvestment?.toLocaleString("en-US")
                    : 0}
                </span>
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
                    <TableHead className="text-center w-[50%]">
                      نوع چک
                    </TableHead>
                    <TableHead className="text-center w-[50%]">
                      نام مشتری
                    </TableHead>
                    <TableHead className="text-center w-[50%]">مبلغ</TableHead>
                    <TableHead className="text-center w-[50%]">
                      سررسید
                    </TableHead>
                    <TableHead className="text-center w-[50%]">وضعیت</TableHead>
                    <TableHead className="text-center w-[50%]">
                      شناسه صیادی
                    </TableHead>
                    <TableHead className="text-center w-[50%]">
                      سریال چک
                    </TableHead>
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
                            {item?.type}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.payer?.fullName}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.amount?.toLocaleString("en-US") ?? ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.dueDate}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.status}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.sayadiID ?? ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.chequeNumber}
                          </TableCell>
                        </TableRow>
                      ))
                    : null}

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
                <span className="text-xs">
                  {totalIssuedChequesUnpaid
                    ? totalIssuedChequesUnpaid?.toLocaleString("en-US")
                    : 0}
                </span>
              </p>
              <p className="flex gap-2 items-center">
                <span className="text-xs">مجموع چک های صادره وصول شده</span>
                <span className="text-xs">
                  {totalIssuedChequesPaid
                    ? totalIssuedChequesPaid?.toLocaleString("en-US")
                    : 0}
                </span>
              </p>
              <p className="flex gap-2 items-center">
                <span className="text-xs">مجموع چک های وارده وصول نشده</span>
                <span className="text-xs">
                  {totalReceivedChequesUnpaid
                    ? totalReceivedChequesUnpaid?.toLocaleString("en-US")
                    : 0}
                </span>
              </p>
              <p className="flex gap-2 items-center">
                <span className="text-xs">مجموع چک های وارده وصول شده</span>
                <span className="text-xs">
                  {totalReceivedChequesPaid
                    ? totalReceivedChequesPaid?.toLocaleString("en-US")
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
