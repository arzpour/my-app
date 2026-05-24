"use client";
import { useQueryClient } from "@tanstack/react-query";
import useGetAllBusinessAccount from "@/hooks/useGetAllBusinessAccount";
import { useDeleteCheque } from "@/apis/mutations/cheques";
import { useDeleteTransaction } from "@/apis/mutations/transaction";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { setTotalVehicleCost } from "@/redux/slices/carSlice";
import { RootState } from "@/redux/store";
import { IChequeNew, IDeal, ITransactionNew } from "@/types/new-backend-types";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pencil, Trash } from "lucide-react";
import TransactionForm from "./forms/transactionForm";
import { formatPrice } from "@/utils/systemConstants";
import DeleteModal from "./modals/deleteModal";
import { useDeleteWalletTransaction } from "@/apis/mutations/people";
import {
  peopleStatus,
  setPeopleStatus,
  setVehicleUpdated,
} from "@/redux/slices/transactionSlice";
import { useVehicleFinancialStatus } from "@/hooks/useVehicleFinancialStatus";

const VehicleDashboard = () => {
  const { chassisNo, selectedDealId } = useSelector(
    (state: RootState) => state.cars,
  );
  const { transactionCreated } = useSelector(
    (state: RootState) => state.transaction,
  );
  // const [deal, setDeal] = React.useState<IDeal>();
  // const [secondDeal, setSecondDeal] = React.useState<IDeal>();

  // const [transactions, setTransactions] = React.useState<ITransactionNew[]>([]);
  // const [cheques, setCheques] = React.useState<IChequeNew[] | null>(null);
  const [isOpenEditModal, setIsOpenEditModal] = React.useState<boolean>(false);
  const [transactionId, setTransactionId] = React.useState<string | undefined>(
    undefined,
  );
  const [isChequeTransaction, setIsChequeTransaction] =
    React.useState<boolean>(false);
  const [dealId, setDealId] = React.useState<string | undefined>(undefined);
  // const [secondDealId, setSecondDealId] = React.useState<string | undefined>(undefined);
  const [isCustomerToCustomer, setIsCustomerToCustomer] =
    React.useState<boolean>(false);

  const [isOpenDeleteModal, setIsOpenDeleteModal] =
    React.useState<boolean>(false);
  const [transactionToDelete, setTransactionToDelete] = React.useState<
    string | undefined
  >(undefined);
  const [dealToDelete, setDealToDelete] = React.useState<string | undefined>(
    undefined,
  );
  const [personId, setPersonId] = React.useState<string | undefined>(undefined);

  const [secondTransactionToDelete, setSecondTransactionToDelete] =
    React.useState<string | undefined>(undefined);
  const [secondDealToDelete, setSecondDealToDelete] = React.useState<
    string | undefined
  >(undefined);
  const [secondPersonId, setSecondPersonId] = React.useState<
    string | undefined
  >(undefined);

  // const [brokerPersonId, setBrokerPersonId] = React.useState<
  //   string | undefined
  // >(undefined);
  // console.log("🚀 ~ VehicleDashboard ~ brokerPersonId:", brokerPersonId);

  const dispatch = useDispatch();

  const deleteTransaction = useDeleteTransaction();
  const deleteWalletTransaction = useDeleteWalletTransaction();
  const deleteCheque = useDeleteCheque();
  const queryClient = useQueryClient();

  const {
    cheques,
    deal,
    finalPaidTransactions,
    finalReceivedTransactions,
    remainingForBuyer,
    remainingToSeller,
    totalPaidToSeller,
    totalReceived,
    transactions,
    getChequesByDealIdHandler,
    getTransactionsByDealIdHandler,
    setDeal,
  } = useVehicleFinancialStatus();

  const { data: businessAccounts } = useGetAllBusinessAccount();

  const accountNameMap = React.useMemo(() => {
    if (!businessAccounts) return new Map<string, string>();
    const map = new Map<string, string>();
    businessAccounts.forEach((account) => {
      if (account._id) {
        const idStr = account._id.toString();
        map.set(idStr, account.accountName);
        const numericId = parseInt(idStr, 10);
        if (!isNaN(numericId)) {
          map.set(numericId.toString(), account.accountName);
        }
      }
    });
    return map;
  }, [businessAccounts]);

  // const getTransactionsByDealIdHandler = async () => {
  //   if (!deal?._id) return;
  //   try {
  //     const transactions = await getTransactionsByDealId.mutateAsync(
  //       deal?._id.toString() ?? selectedDealId ?? "",
  //     );
  //     setTransactions(transactions);
  //   } catch (error) {
  //     console.log("🚀 ~ getTransactionsByDealIdHandler ~ error:", error);
  //   }
  // };

  // const getChequesByDealIdHandler = async () => {
  //   if (!deal?._id) return;
  //   try {
  //     const cheques = await getChequesByDealId.mutateAsync(
  //       deal?._id.toString() ?? selectedDealId ?? "",
  //     );
  //     setCheques(cheques);
  //   } catch (error) {
  //     console.log("🚀 ~ getChequesByDealIdHandler ~ error:", error);
  //   }
  // };

  const isChequePaid = (cheque: IChequeNew): boolean => {
    const paidStatuses = ["paid", "پاس شده", "وصول شده", "پاس شده است"];
    return paidStatuses.some((status) =>
      cheque.status?.toLowerCase().includes(status.toLowerCase()),
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

  // const isTransactionFromUnpaidCheque = (
  //   transaction: ITransactionNew,
  // ): boolean => {
  //   if (!cheques || !deal?._id || transaction.paymentMethod !== "چک") {
  //     return false;
  //   }

  //   const dealIdStr = deal._id.toString();

  //   const relatedCheques = cheques.filter((c) => {
  //     const chequeDealIdMatch =
  //       c.relatedDealId?.toString() === dealIdStr ||
  //       (typeof c.relatedDealId === "number" &&
  //         dealIdStr.includes(c.relatedDealId));

  //     const amountMatch = Math.abs(c.amount - transaction.amount) < 0.01;

  //     return chequeDealIdMatch && amountMatch;
  //   });

  //   return relatedCheques.some((c) => !isChequePaid(c));
  // };

  // const isVehicleRelatedTransaction = (
  //   transaction: ITransactionNew,
  // ): boolean => {
  //   if (
  //     transaction.reason?.includes("حقوق") ||
  //     transaction.reason?.includes("پرداخت حقوق")
  //   ) {
  //     return false;
  //   }

  //   if (transaction.type === "پرداخت") {
  //     const reasonNormalized = transaction.reason?.replace(/\s/g, "") || "";
  //     return (
  //       transaction.reason === "خرید خودرو" ||
  //       transaction.reason?.includes("خريد") ||
  //       transaction.reason?.includes("خرید") ||
  //       transaction.reason === "درصد کارگزار" ||
  //       reasonNormalized.includes("هزینهوسیله") ||
  //       reasonNormalized.includes("هزينهوسیله")
  //     );
  //   }

  //   if (transaction.type === "دریافت") {
  //     return transaction.reason === "فروش";
  //   }

  //   if (
  //     transaction.type === "افزایش سرمایه" ||
  //     transaction.type === "برداشت سرمایه" ||
  //     transaction.reason === "افزایش سرمایه" ||
  //     transaction.reason === "کاهش سرمایه"
  //   ) {
  //     return true;
  //   }

  //   return false;
  // };

  // const filteredTransactions = React.useMemo(() => {
  //   if (!transactions || transactions.length === 0) return [];
  //   return transactions.filter(
  //     (t) =>
  //       isVehicleRelatedTransaction(t) && !isTransactionFromUnpaidCheque(t),
  //   );
  // }, [transactions, cheques, deal]);
  // const filteredTransactions = transactions;

  const allChequesForDisplay = React.useMemo(() => {
    if (!cheques || cheques.length === 0) return [];
    return cheques;
  }, [cheques]);

  const totalIssuedChequesUnpaid =
    allChequesForDisplay
      ?.filter((c) => isIssuedCheque(c) && !isChequePaid(c))
      .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

  const totalIssuedChequesPaid =
    allChequesForDisplay
      ?.filter((c) => isIssuedCheque(c) && isChequePaid(c))
      .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

  const totalReceivedChequesUnpaid =
    allChequesForDisplay
      ?.filter((c) => isReceivedCheque(c) && !isChequePaid(c))
      .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

  const totalReceivedChequesPaid =
    allChequesForDisplay
      ?.filter((c) => isReceivedCheque(c) && isChequePaid(c))
      .reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

  ///////////////////////////////////////////////////////////////////////////////

  const investmentTransactionConditions = (t: ITransactionNew) => {
    return (
      (t.type === "پرداخت" && t.reason === "اصل سرمایه") ||
      (t.type === "پرداخت" && t.reason === "سود سرمایه") ||
      (t.type === "دریافت" && t.reason === "سرمایه گذاری")
    );
  };

  const investmentTransactions =
    transactions?.filter(investmentTransactionConditions) ?? [];

  const totalPaidToSellerWithoutFilter =
    finalPaidTransactions?.reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

  const totalPaidToBroker =
    finalPaidTransactions
      ?.filter((t) => t.reason === "درصد کارگزار")
      .reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

  const vehicleCosts =
    finalPaidTransactions
      ?.filter((t) => {
        return (
          t.reason?.replace(/\s/g, "").includes("سایر هزینه‌ها") ||
          t.reason?.replace(/\s/g, "").includes("سایر هزینه‌ها") ||
          t.reason === "سایر هزینه‌ها"
        );
      })
      .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

  const totalPaidForInvestment =
    investmentTransactions
      ?.filter((t) => t.type === "پرداخت")
      .reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

  const totalReceivedForInvestment =
    investmentTransactions
      ?.filter((t) => t.type === "دریافت")
      .reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

  const handleDeleteClick = (transactionId: string) => {
    setTransactionToDelete(transactionId);
    setIsOpenDeleteModal(true);
  };

  const deleteBrokersWalletHandler = async () => {
    if (!deal) return;
    try {
      await deleteWalletTransaction.mutateAsync({
        id: deal.purchaseBroker.personId ?? "",
        data: {
          dealID: deal._id ?? "",
          transactionID: transactionToDelete ?? "",
        },
      });
      await deleteWalletTransaction.mutateAsync({
        id: deal.saleBroker.personId ?? "",
        data: {
          dealID: deal._id ?? "",
          transactionID: transactionToDelete ?? "",
        },
      });
    } catch (error) {
      console.log("🚀 ~ deleteBrokersWalletHandler ~ error:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (transactionToDelete) {
      try {
        await deleteTransaction.mutateAsync(transactionToDelete);
        setIsOpenDeleteModal(false);
        setTransactionToDelete(undefined);
        // Refresh transactions after delete
        await getTransactionsByDealIdHandler();

        deleteBrokersWalletHandler();

        await deleteWalletTransaction.mutateAsync({
          id: personId ?? "",
          data: {
            dealID: dealToDelete ?? "",
            transactionID: transactionToDelete ?? "",
          },
        });

        if (isCustomerToCustomer) {
          await deleteWalletTransaction.mutateAsync({
            id: secondPersonId ?? "",
            data: {
              dealID: secondDealToDelete ?? dealToDelete ?? "",
              transactionID: transactionToDelete ?? "",
            },
          });
        }

        dispatch(setVehicleUpdated(transactionToDelete));

        const chequeId =
          cheques?.filter(
            (c) => c.relatedTransactionId === transactionToDelete,
          )[0]?._id ?? "";
        queryClient.invalidateQueries({
          queryKey: ["get-all-people"],
        });

        if (isChequeTransaction) {
          await deleteCheque.mutateAsync(chequeId);
          // toast.success("تراکنش با موفقیت ثبت شد");
          getChequesByDealIdHandler();
        }
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const handleEditSuccess = () => {
    setIsOpenEditModal(false);
    setTransactionId(undefined);
    getTransactionsByDealIdHandler();
    getChequesByDealIdHandler();
  };

  const totalVehicleCost = React.useMemo(() => {
    return finalPaidTransactions
      ?.filter(
        (item) =>
          item?.reason?.replace(/\s/g, "").includes("هزینهوسیله") ||
          item?.reason?.replace(/\s/g, "").includes("هزينهوسیله"),
      )
      ?.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [finalPaidTransactions]);

  React.useEffect(() => {
    dispatch(setTotalVehicleCost(totalVehicleCost));
  }, [totalVehicleCost]);

  React.useEffect(() => {
    const transactionExist = transactions.find(
      (t) => t._id === transactionCreated,
    )?._id;
    if (!transactionExist) {
      getTransactionsByDealIdHandler();
      getChequesByDealIdHandler();
    }
  }, [transactionCreated]);

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
                    <TableHead className="w-[10%] text-center">ردیف</TableHead>
                    <TableHead className="w-[30%] text-center">تاریخ</TableHead>
                    <TableHead className="w-[60%] text-center">مبلغ</TableHead>
                    <TableHead className="w-[30%] text-center">
                      دلیل تراکنش
                    </TableHead>
                    <TableHead className="w-[30%] text-center">
                      روش پرداخت
                    </TableHead>
                    <TableHead className="w-[30%] text-center">
                      حساب مبدا
                    </TableHead>
                    <TableHead className="w-[30%] text-center">
                      عملیات
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {finalPaidTransactions &&
                    finalPaidTransactions?.length > 0 &&
                    finalPaidTransactions?.map((item, index) => {
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
                            {formatPrice(
                              item?.amount?.toLocaleString("en-US"),
                            ) ?? ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.reason ?? ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.paymentMethod ?? ""}
                          </TableCell>
                          <TableCell
                            title={
                              item?.bussinessAccountId
                                ? accountNameMap.get(item.bussinessAccountId) ||
                                  item.bussinessAccountId
                                : ""
                            }
                            className="text-center truncate cursor-pointer"
                          >
                            {item?.bussinessAccountId
                              ? accountNameMap.get(item.bussinessAccountId) ||
                                item.bussinessAccountId
                              : ""}
                          </TableCell>
                          <TableCell className="text-center flex gap-3 justify-center items-center">
                            <Pencil
                              className="w-4 h-4 cursor-pointer hover:text-indigo-500"
                              onClick={() => {
                                setIsOpenEditModal(true);
                                setTransactionId(item._id?.toString());
                                setDealId((item as ITransactionNew)?.dealId);
                                // setSecondDealId(item?.secondDealId ?? "");
                              }}
                            />
                            <Trash
                              className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-700"
                              onClick={() => {
                                handleDeleteClick(item._id?.toString() || "");
                                setDealToDelete(item?.dealId?.toString() || "");
                                setPersonId(
                                  item.personId ||
                                    item.brokerPersonId ||
                                    item.partnerPersonId ||
                                    item.providerPersonId ||
                                    "",
                                );
                             
                                setIsCustomerToCustomer(
                                  item.paymentMethod === "مشتری به مشتری"
                                    ? true
                                    : false,
                                );
                                // setBrokerPersonId(item.brokerPersonId);
                                setIsChequeTransaction(
                                  item.paymentMethod === "چک" ? true : false,
                                );
                                // setSecondTransactionToDelete(item.secondDealId)
                                setSecondDealToDelete(item.secondDealId ?? "");
                                setSecondPersonId(item.secondPersonId ?? "");
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between gap-3 items-start space-y-0 mt-5">
              <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-start gap-3">
                <p className="text-xs">مجموع</p>
                <p dir="ltr" className="text-red-500 text-xs">
                  {totalPaidToSellerWithoutFilter
                    ? formatPrice(
                        totalPaidToSellerWithoutFilter.toLocaleString("en-US"),
                      )
                    : 0}
                </p>
              </div>
              <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-start gap-3">
                <p className="text-xs">مجموع به طرف اول</p>
                <p dir="ltr" className="font-bold text-xs">
                  {totalPaidToSeller
                    ? formatPrice(totalPaidToSeller.toLocaleString("en-US"))
                    : 0}
                </p>
              </div>
              <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-start gap-3">
                <p className="text-xs">مجموع به کارگزار</p>
                <p dir="ltr" className="font-bold text-xs">
                  {totalPaidToBroker
                    ? formatPrice(totalPaidToBroker.toLocaleString("en-US"))
                    : 0}
                </p>
              </div>
              <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-start gap-3">
                <p className="text-xs">مجموع هزینه</p>
                <p dir="ltr" className="font-bold text-xs">
                  {vehicleCosts
                    ? formatPrice(vehicleCosts.toLocaleString("en-US"))
                    : 0}
                </p>
              </div>
              <div className="space-y-2 h-10 overflow-y-auto scrollbar-hide flex items-start gap-3">
                <p className="text-xs">مانده</p>
                <p dir="ltr" className="font-bold text-xs">
                  {typeof remainingToSeller === "number"
                    ? formatPrice(remainingToSeller.toLocaleString("en-US"))
                    : (formatPrice(remainingToSeller) ?? 0)}
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
                    <TableHead className="w-[10%] text-center">ردیف</TableHead>
                    <TableHead className="w-[30%] text-center">تاریخ</TableHead>
                    <TableHead className="w-[60%] text-center">مبلغ</TableHead>
                    <TableHead className="w-[30%] text-center">
                      دلیل تراکنش
                    </TableHead>
                    <TableHead className="w-[30%] text-center">
                      روش پرداخت
                    </TableHead>
                    <TableHead className="w-[30%] text-center">
                      حساب مقصد
                    </TableHead>
                    <TableHead className="w-[30%] text-center">
                      عملیات
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finalReceivedTransactions &&
                    finalReceivedTransactions.length > 0 &&
                    finalReceivedTransactions?.map((item, index) => {
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
                            {formatPrice(
                              item?.amount?.toLocaleString("en-US"),
                            ) ?? ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.reason ?? ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.paymentMethod ?? ""}
                          </TableCell>
                          <TableCell
                            title={
                              item?.bussinessAccountId
                                ? accountNameMap.get(item.bussinessAccountId) ||
                                  item.bussinessAccountId
                                : ""
                            }
                            className="text-center truncate cursor-pointer"
                          >
                            {item?.bussinessAccountId
                              ? accountNameMap.get(item.bussinessAccountId) ||
                                item.bussinessAccountId
                              : ""}
                          </TableCell>
                          <TableCell className="text-center flex gap-3 justify-center items-center">
                            <Pencil
                              className="w-4 h-4 cursor-pointer hover:text-indigo-500"
                              onClick={() => {
                                setIsOpenEditModal(true);
                                setTransactionId(item._id?.toString());
                                setDealId((item as ITransactionNew)?.dealId);
                                // setSecondDealId(item?.secondDealId ?? "");
                              }}
                            />
                            <Trash
                              className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-700"
                              onClick={() => {
                                handleDeleteClick(item._id?.toString() || "");
                                setDealToDelete(item?.dealId?.toString() || "");
                                setPersonId(
                                  item.personId ||
                                    item.brokerPersonId ||
                                    item.partnerPersonId ||
                                    item.providerPersonId ||
                                    "",
                                );
                              
                                setIsCustomerToCustomer(
                                  item.paymentMethod === "مشتری به مشتری"
                                    ? true
                                    : false,
                                );
                                setSecondDealToDelete(item.secondDealId ?? "");
                                setSecondPersonId(item.secondPersonId ?? "");

                                // setBrokerPersonId(item.brokerPersonId);

                                setIsChequeTransaction(
                                  item.paymentMethod === "چک" ? true : false,
                                );
                                // setRelatedTransactionIdForCheque(item.)
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between gap-3 items-center mt-4">
              <div className="flex gap-3 items-center">
                {/* <p className="text-xs">مجموع دریافتی از خریدار</p> */}
                <span className="text-xs">مجموع</span>
                <span dir="ltr" className="text-green-500 text-xs">
                  {totalReceived
                    ? formatPrice(totalReceived.toLocaleString("en-US"))
                    : 0}
                </span>
              </div>

              <div className="flex gap-3 items-center">
                {/* <p className="text-xs">مانده مبلغ قابل دریافت از خریدار</p> */}
                <span className="text-xs">مانده</span>
                <span dir="ltr" className="font-bold text-xs">
                  {typeof remainingForBuyer === "number"
                    ? formatPrice(remainingForBuyer.toLocaleString("en-US"))
                    : 0}
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
                    <TableHead className="w-[30%] text-center">ردیف</TableHead>
                    <TableHead className="w-[70%] text-center">تاریخ</TableHead>
                    <TableHead className="w-[120%] text-center">مبلغ</TableHead>
                    <TableHead className="w-[80%] text-center">شریک</TableHead>
                    <TableHead className="w-[80%] text-center">درصد</TableHead>
                    <TableHead className="w-[80%] text-center">
                      دلیل تراکنش
                    </TableHead>
                    <TableHead className="w-[80%] text-center">
                      روش پرداخت
                    </TableHead>
                    <TableHead className="w-[80%] text-center">
                      حساب مبدا
                    </TableHead>
                    <TableHead className="w-[70%] text-center">
                      عملیات
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {investmentTransactions && investmentTransactions.length > 0
                    ? investmentTransactions.map((tx, index) => {
                        const relatedPartnership = deal?.partnerships?.find(
                          (p) => {
                            return p.partner.personId === tx.personId;
                          },
                        );

                        return (
                          <TableRow
                            key={`${tx._id}-${index}`}
                            className="hover:bg-gray-50"
                          >
                            <TableCell className="text-center">
                              {index + 1}
                            </TableCell>
                            <TableCell className="text-center">
                              {tx.transactionDate ||
                                deal?.createdAt?.split("T")[0] ||
                                "" ||
                                ""}
                            </TableCell>
                            <TableCell className="text-center">
                              {tx.amount
                                ? formatPrice(tx.amount.toLocaleString("en-US"))
                                : ""}
                            </TableCell>
                            <TableCell className="text-center">
                              {tx.partnerShipProfit ||
                                relatedPartnership?.partner.name ||
                                ""}
                            </TableCell>
                            <TableCell className="text-center">
                              {/* {relatedPartnership?.profitSharePercentage != null
                              ? `${relatedPartnership.profitSharePercentage}%`
                              : "-"} */}
                              {tx.partnershipProfitSharePercentage || "-"}
                            </TableCell>
                            <TableCell className="text-center">
                              {tx.reason || "-"}
                            </TableCell>
                            <TableCell className="text-center">
                              {tx.paymentMethod || "-"}
                            </TableCell>
                            <TableCell
                              title={
                                tx?.bussinessAccountId
                                  ? accountNameMap.get(tx.bussinessAccountId) ||
                                    tx.bussinessAccountId
                                  : ""
                              }
                              className="text-center truncate cursor-pointer"
                            >
                              {tx.bussinessAccountId
                                ? accountNameMap.get(tx.bussinessAccountId) ||
                                  tx.bussinessAccountId
                                : "-"}
                            </TableCell>
                            <TableCell className="text-center flex gap-3 justify-center items-center">
                              <Pencil
                                className="w-4 h-4 cursor-pointer hover:text-indigo-500"
                                onClick={() => {
                                  setIsOpenEditModal(true);
                                  setTransactionId(tx._id?.toString());
                                  setDealId((tx as ITransactionNew)?.dealId);
                                  // setSecondDealId(tx?.secondDealId ?? "");
                                }}
                              />
                              <Trash
                                className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-700"
                                onClick={() => {
                                  handleDeleteClick(tx._id?.toString() || "");
                                  setDealToDelete(tx?.dealId?.toString() || "");
                                  setPersonId(
                                    tx.partnerPersonId ||
                                      relatedPartnership?.partner.personId ||
                                      tx.personId ||
                                      tx.brokerPersonId ||
                                      tx.partnerPersonId ||
                                      tx.providerPersonId ||
                                      "",
                                  );
                                  
                                  setIsCustomerToCustomer(
                                    tx.paymentMethod === "مشتری به مشتری"
                                      ? true
                                      : false,
                                  );

                                  setSecondDealToDelete(tx.secondDealId ?? "");
                                  setSecondPersonId(tx.secondPersonId ?? "");
                                  // setBrokerPersonId(tx.brokerPersonId);
                                  setIsChequeTransaction(
                                    tx.paymentMethod === "چک" ? true : false,
                                  );
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    : null}
                </TableBody>
              </Table>
            </div>
            <div className="flex gap-3 items-center justify-between mt-3">
              <p className="flex gap-2 items-center">
                <span className="text-xs">مجموع دریافتی</span>
                <span dir="ltr" className="text-xs">
                  {totalReceivedForInvestment
                    ? formatPrice(
                        totalReceivedForInvestment?.toLocaleString("en-US"),
                      )
                    : 0}
                </span>
              </p>
              <p className="flex gap-2 items-center">
                <span className="text-xs">مجموع پرداختی</span>
                <span dir="ltr" className="text-xs">
                  {totalPaidForInvestment
                    ? formatPrice(
                        totalPaidForInvestment?.toLocaleString("en-US"),
                      )
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
                  {allChequesForDisplay && allChequesForDisplay.length > 0
                    ? allChequesForDisplay?.map((item, index) => (
                        <TableRow
                          key={`${item?._id}-${index}`}
                          className="has-data-[state=checked]:bg-muted/50"
                        >
                          <TableCell className="text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.type === "issued"
                              ? "صادره"
                              : item?.type === "received"
                                ? "وارده"
                                : "-"}
                          </TableCell>
                          <TableCell className="text-center">
                            {!!item?.payer?.fullName
                              ? item?.payer?.fullName
                              : !!item?.payee?.fullName
                                ? item?.payee?.fullName
                                : !!item?.brokerPersonId?.fullName
                                  ? item?.brokerPersonId?.fullName
                                  : !!item?.providerPersonId?.fullName
                                    ? item?.providerPersonId?.fullName
                                    : ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {formatPrice(
                              item?.amount?.toLocaleString("en-US"),
                            ) ?? ""}
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
                            {item?.chequeSerial}
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
            <div className="grid grid-cols-4 gap-3 items-center mt-3">
              <p className="flex gap-2 items-center justify-start">
                <span className="text-xs">صادره وصول نشده</span>
                <span dir="ltr" className="text-xs">
                  {totalIssuedChequesUnpaid
                    ? formatPrice(
                        totalIssuedChequesUnpaid?.toLocaleString("en-US"),
                      )
                    : 0}
                </span>
              </p>
              <p className="flex gap-2 items-center justify-center">
                <span className="text-xs">صادره وصول شده</span>
                <span dir="ltr" className="text-xs">
                  {totalIssuedChequesPaid
                    ? formatPrice(
                        totalIssuedChequesPaid?.toLocaleString("en-US"),
                      )
                    : 0}
                </span>
              </p>
              <p className="flex gap-2 items-center justify-center">
                <span className="text-xs">وارده وصول نشده</span>
                <span dir="ltr" className="text-xs">
                  {totalReceivedChequesUnpaid
                    ? formatPrice(
                        totalReceivedChequesUnpaid?.toLocaleString("en-US"),
                      )
                    : 0}
                </span>
              </p>
              <p className="flex gap-2 items-center justify-end">
                <span className="text-xs">وارده وصول شده</span>
                <span dir="ltr" className="text-xs">
                  {totalReceivedChequesPaid
                    ? formatPrice(
                        totalReceivedChequesPaid?.toLocaleString("en-US"),
                      )
                    : 0}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      {isOpenEditModal && (
        <Dialog open={isOpenEditModal} onOpenChange={setIsOpenEditModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="mb-9">ویرایش تراکنش</DialogTitle>
              <DialogClose
                onClose={() => {
                  setIsOpenEditModal(false);
                  setTransactionId(undefined);
                }}
              />
            </DialogHeader>
            <TransactionForm
              mode="edit"
              transactionId={transactionId}
              onSuccess={handleEditSuccess}
              dealId={dealId}
              getTransactionsHandler={getTransactionsByDealIdHandler}
            />
          </DialogContent>
        </Dialog>
      )}

      {isOpenDeleteModal && (
        <DeleteModal
          deletePending={deleteTransaction.isPending}
          handleConfirmDelete={handleConfirmDelete}
          isOpenDeleteModal={isOpenDeleteModal}
          setIdToDelete={setTransactionToDelete}
          setIsOpenDeleteModal={setIsOpenDeleteModal}
          title="تراکنش"
        />
      )}
    </>
  );
};

export default VehicleDashboard;
