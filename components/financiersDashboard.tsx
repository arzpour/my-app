"use client";
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
import useGetAllPeople from "@/hooks/useGetAllPeople";
import React from "react";
import useGetAllTransactions from "@/hooks/useGetAllTransaction";
import useGetVehicles from "@/hooks/useGetVehicle";
import SearchInputSelector from "./global/searchInputSelector";
import { formatPrice } from "@/utils/systemConstants";
import { setChassisNo } from "@/redux/slices/carSlice";
import { useDispatch, useSelector } from "react-redux";
import { Pencil, Trash } from "lucide-react";
import DeleteModal from "./modals/deleteModal";
import TransactionForm from "./forms/transactionForm";
import { ITransactionNew } from "@/types/new-backend-types";
import { useDeleteTransaction } from "@/apis/mutations/transaction";
import { useDeleteWalletTransaction } from "@/apis/mutations/people";
import { useDeleteCheque } from "@/apis/mutations/cheques";
import useGetAllCheques from "@/hooks/useGetAllCheques";
import { useQueryClient } from "@tanstack/react-query";
import { RootState } from "@/redux/store";
import useGetProfit from "@/hooks/useGetProfit";

const FinanciersDashboard = () => {
  const [selectedFinancier, setSelectedFinancier] = React.useState<
    string | undefined
  >("");
  const [selectedFinanceVehicle, setSelectedFinancieVehicle] = React.useState<
    string | undefined
  >("");
  const [isOpenEditModal, setIsOpenEditModal] = React.useState<boolean>(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] =
    React.useState<boolean>(false);
  const [transactionId, setTransactionId] = React.useState<string | undefined>(
    undefined,
  );
  const [isChequeTransaction, setIsChequeTransaction] =
    React.useState<boolean>(false);
  const [dealId, setDealId] = React.useState<string | undefined>(undefined);
  const [transactionToDelete, setTransactionToDelete] = React.useState<
    string | undefined
  >(undefined);
  const [dealToDelete, setDealToDelete] = React.useState<string | undefined>(
    undefined,
  );
  const [personId, setPersonId] = React.useState<string | undefined>(undefined);

  const { netProfit } = useSelector((state: RootState) => state.transaction);
  // const getDealByVin = useGetDealsByVin(chassisNo);
  // const dealsData = getDealByVin.data;

  // const getTransactionsByDealId = useGetTransactionsByDealId();
  // const { data: transactions } = useGetAllTransactions();
  // const { data: cheques } = useGetAllCheques();
  // const getChequesByDealId = useGetChequesByDealId();
  const deleteTransaction = useDeleteTransaction();
  const deleteWalletTransaction = useDeleteWalletTransaction();
  const deleteCheque = useDeleteCheque();

  const { data: allPeople } = useGetAllPeople();
  const { data: allCheques } = useGetAllCheques();
  const { data: allTransactions } = useGetAllTransactions();
  const { data: allVehicles } = useGetVehicles();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();



  const financierPeople =
    allPeople?.filter((p) => p.roles?.includes("financier")) || [];

  const financierOptions = React.useMemo(() => {
    const fromPeople = (financierPeople ?? []).map((p) => ({
      id: p._id,
      label: `${p.firstName} ${p.lastName}`,
    }));
    return fromPeople;
  }, [financierPeople]);

  const selectedPersonData = (financierPeople ?? []).filter(
    (p) => p._id === selectedFinancier,
  )[0];

  // const totalPartnersProfitPercent = (financierPeople ?? []).reduce(
  //   (sum, p) =>
  //     sum + (parseInt(p.brokerDetails?.currentRates?.purchaseCommissionPercent ?? 0) ?? 0),
  //   0,
  // ) ?? 0

  const vehiclesFormat = React.useMemo(() => {
    return (
      allVehicles?.map((v) => ({
        id: v.vin || v._id || "unknown",
        label: `${v.plateNumber || "بدون پلاک"}-${v.model}-${v.vin}`,
      })) || []
    );
  }, [allVehicles]);

  const decreaseFinanceData = allTransactions?.filter(
    (t) =>
      t.type === "پرداخت" &&
      (t.reason === "اصل سرمایه" || t.reason === "سود سرمایه"),
  );
  const increaseFinanceData = allTransactions?.filter(
    (t) => t.type === "دریافت" && t.reason === "سرمایه گذاری",
  );

  // [...(decreaseFinanceData ?? []), ...(increaseFinanceData ?? [])]?.map(f=> {
  //   if(selectedPersonData){
  //     return [...(decreaseFinanceData ?? []), ...(increaseFinanceData ?? [])].filter(fp=> fp.partnerPersonId === selectedPersonData._id)
  //   }
  //   return [...(decreaseFinanceData ?? []), ...(increaseFinanceData ?? [])]
  // })

  // const filteredDecreaseFinance = (decreaseFinanceData ?? []).filter((d) => {
  //   if (selectedFinancier) {
  //     return d.partnerPersonId === selectedFinancier;
  //   }
  //   if (selectedFinanceVehicle) {
  //     return d.vin === selectedFinanceVehicle;
  //   }
  //   return d;
  // });

  const filteredDecreaseFinance = (decreaseFinanceData ?? []).filter((d) => {
    return (
      (!selectedFinancier || d.partnerPersonId === selectedFinancier) &&
      (!selectedFinanceVehicle || d.vin === selectedFinanceVehicle)
    );
  });

  const filteredIncreaseFinance = (increaseFinanceData ?? []).filter((d) => {
    return (
      (!selectedFinancier || d.partnerPersonId === selectedFinancier) &&
      (!selectedFinanceVehicle || d.vin === selectedFinanceVehicle)
    );
  });

  let totalPartnersProfitPercent;

  if (selectedPersonData) {
    totalPartnersProfitPercent = [
      ...(filteredDecreaseFinance ?? []),
      ...(filteredIncreaseFinance ?? []),
    ].filter((fp) => {
      return fp.partnerPersonId === selectedPersonData?._id;
    });
  } else {
    totalPartnersProfitPercent = [
      ...(filteredDecreaseFinance ?? []),
      ...(filteredIncreaseFinance ?? []),
    ];
  }

  const filteredTotalPartnersProfitPercent =
    totalPartnersProfitPercent?.reduce((sum, p) => {
      const percent = !!p.partnershipProfitSharePercentage
        ? parseInt(p.partnershipProfitSharePercentage)
        : 0;
      return sum + percent;
    }, 0) ?? 0;

  // const filteredIncreaseFinance = (increaseFinanceData ?? []).filter((d) => {
  //   if (selectedFinancier) {
  //     return d.partnerPersonId === selectedFinancier;
  //   }
  //   if (selectedFinanceVehicle) {
  //     return d.vin === selectedFinanceVehicle;
  //   }
  //   return true;
  // });

  const mergeTransactions = [
    ...filteredDecreaseFinance,
    ...filteredIncreaseFinance,
  ];

  const totalRecieveAmount = mergeTransactions
    ?.filter((t) => t.type === "پرداخت" && t.reason === "سود سرمایه")
    .reduce((sum, t) => sum + t.amount, 0);

  // filteredDecreaseFinance?.reduce(
  //   (sum, t) => sum + t.amount,
  //   0,
  // );

  const totalPaymentAmount = mergeTransactions
    ?.filter((t) => t.type === "دریافت" && t.reason === "سرمایه گذاری")
    .reduce((sum, t) => sum + t.amount, 0);
  //  filteredIncreaseFinance?.reduce(
  //   (sum, t) => sum + t.amount,
  //   0,
  // );

  const totalRecieveFinance = mergeTransactions
    ?.filter((t) => t.type === "پرداخت" && t.reason === "اصل سرمایه")
    .reduce((sum, t) => sum + t.amount, 0);
  // (totalPaymentAmount ?? 0) - (totalRecieveAmount ?? 0);

  const totalRecieve = (totalRecieveFinance ?? 0) + (totalRecieveAmount ?? 0);

  // const totalPartnerProfitPercent = selectedPersonData
  //   ? selectedPersonData?.brokerDetails?.currentRates?.purchaseCommissionPercent
  //   : (totalPartnersProfitPercent ?? 0);
  const totalPartnerProfitPercent = filteredTotalPartnersProfitPercent ?? 0;

  // const isLastCalculate = process.env.NEXT_PUBLIC_PROFIT_CALCULATE;

  // const totalPartnerProfit = () => {
  //   return filteredIncreaseFinance.map((f) =>
  //     f.profitState === "بر اصل سپرده"
  //       ? netProfit * (f.partnershipProfitSharePercentage / 100)
  //       : f.profitState === "بر اساس سود معامله"
  //         ? (((totalPaymentAmount ?? 0) * Number(totalPartnerProfitPercent)) /
  //           100)
  //         : 0,
  //   ).reduce((sum,t)=> sum + t, 0)
  // };

  // const totalPartnerProfit = filteredIncreaseFinance
  //   .map((f) => {
  //     return f.profitState ===  "بر اساس سود معامله"
  //       ? netProfit * (f.partnershipProfitSharePercentage / 100)
  //       : f.profitState === "بر اصل سپرده"
  //         ? ((totalPaymentAmount ?? 0) * Number(totalPartnerProfitPercent)) /
  //           100
  //         : 0;
  //   },
  //   )
  //   .reduce((sum, t) => sum + t, 0);

  const totalPartnerProfit = filteredIncreaseFinance
  .map((f) => {
    const sharePercentage = Number(f.partnershipProfitSharePercentage || 0);

    if (f.profitState === "بر اساس سود معامله") {
      return netProfit * (sharePercentage / 100);
    } else if (f.profitState === "بر اصل سپرده") {
      const profitPercent = Number(totalPartnerProfitPercent || 0);
      return ((totalPaymentAmount ?? 0) * profitPercent) / 100;
    } else {
      return 0;
    }
  })
  .reduce((sum, t) => sum + t, 0);

  // const totalPartnerProfit = calculateTotalPartnerProfit();
  // console.log("🚀 ~ FinanciersDashboard ~ totalPartnerProfit:", totalPartnerProfit)

  // const totalPartnerProfit =
  //   ((totalPaymentAmount ?? 0) * Number(totalPartnerProfitPercent)) / 100;
  const total = (totalPaymentAmount || 0) + totalPartnerProfit;

  const remainigProfit = (totalPartnerProfit || 0) - (totalRecieveAmount ?? 0);
  const remainingOriginalFinance =
    (totalPaymentAmount ?? 0) - (totalRecieveFinance ?? 0);

  const totalProfitAndFinance = remainigProfit + remainingOriginalFinance;

  const handleDeleteClick = (transactionId: string) => {
    setTransactionToDelete(transactionId);
    setIsOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (transactionToDelete) {
      try {
        await deleteTransaction.mutateAsync(transactionToDelete);
        setIsOpenDeleteModal(false);
        setTransactionToDelete(undefined);
        // Refresh transactions after delete
        // await getTransactionsByDealIdHandler();
        queryClient.invalidateQueries({
          queryKey: ["get-all-transaction"],
        });

        await deleteWalletTransaction.mutateAsync({
          id: personId ?? "",
          data: {
            dealID: dealToDelete ?? "",
            transactionID: transactionToDelete ?? "",
          },
        });

        const chequeId =
          allCheques?.filter(
            (c) => c.relatedTransactionId === transactionToDelete,
          )[0]._id ?? "";

        if (isChequeTransaction) {
          await deleteCheque.mutateAsync(chequeId);
          // toast.success("تراکنش با موفقیت ثبت شد");
          // getChequesByDealIdHandler();
        }
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const handleEditSuccess = () => {
    setIsOpenEditModal(false);
    setTransactionId(undefined);
    // getTransactionsByDealIdHandler();
  };

  React.useEffect(() => {
    if (selectedFinanceVehicle) {
      dispatch(setChassisNo(selectedFinanceVehicle));
    }
  }, [selectedFinanceVehicle]);

  return (
    <div>
      <div className="space-y-2">
        <div className="grid grid-cols-5 gap-2">
          <div className="flex gap-3">
            <div className="space-y-1">
              <SearchInputSelector
                data={financierOptions}
                title="نام سرمایه گذار"
                setSelectedSubject={setSelectedFinancier}
                selectedValue={selectedFinancier ?? ""}
              />
            </div>
            <div className="space-y-1">
              <SearchInputSelector
                data={vehiclesFormat}
                title="انتخاب خودرو"
                setSelectedSubject={setSelectedFinancieVehicle}
                selectedValue={selectedFinanceVehicle ?? ""}
              />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm text-blue-900 font-medium">
              مجموع سرمایه پرداختی:
            </h3>
            <p className="text-sm text-blue-500 font-medium">
              {formatPrice(totalPaymentAmount?.toLocaleString()) ?? "-"}
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm text-blue-900 font-medium">
              مجموع سود دریافتی:
            </h3>
            <p className="text-sm font-medium">
              {formatPrice(totalRecieveAmount?.toLocaleString()) ?? "-"}
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm text-blue-900 font-medium">
              مجموع سرمایه برداشتی:
            </h3>
            <p className="text-sm font-medium">
              {formatPrice(totalRecieveFinance?.toLocaleString()) ?? "-"}
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm text-blue-900 font-medium">
              مجموع کل دریافتی:
            </h3>
            <p className="text-sm text-red-700 font-medium">
              {formatPrice(totalRecieve?.toLocaleString()) ?? "-"}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          <div className="space-y-1">
            <h3 className="text-sm text-blue-900 font-medium">
              درصد/مبلغ سود مشارکت:
            </h3>
            <p className="text-sm font-medium">
              {totalPartnerProfitPercent ?? "-"}
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm text-blue-900 font-medium">
              مجموع سود مشارکت:
            </h3>
            <p className="text-sm text-blue-500">
              {formatPrice(totalPartnerProfit?.toLocaleString()) ?? ""}
            </p>
            <div className="border-b px-6"></div>
            <div className="flex items-center gap-6">
              <span className="text-green-600">مجموع=</span>
              <span className="text-green-800 font-medium">
                {formatPrice(total?.toLocaleString()) ?? "-"}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm text-blue-900 font-medium">مانده از سود:</h3>
            <p className="text-sm text-blue-500 font-medium">
              {formatPrice(remainigProfit?.toLocaleString()) ?? "-"}
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm text-blue-900 font-medium">
              مانده از اصل سرمایه:
            </h3>
            <p className="text-sm font-medium">
              {formatPrice(remainingOriginalFinance?.toLocaleString()) ?? "-"}
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm text-blue-900 font-medium">
              {" "}
              مانده از مجموع سرمایه + سود:
            </h3>
            <p className="text-sm text-red-700 font-medium">
              {formatPrice(totalProfitAndFinance?.toLocaleString()) ?? "-"}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 items-start mt-5">
        <div className="border border-gray-300 p-4 rounded-md relative w-full h-[30rem]">
          <p className="text-red-500 absolute right-2 -top-6 bg-white py-2 px-4 font-medium">
            برداشت سرمایه
          </p>
          <div className="max-h-[28rem] h-[28rem] overflow-y-auto rounded-md border w-full">
            <Table className="min-w-full table-fixed text-right border-collapse">
              <TableHeader className="top-0 sticky">
                <TableRow className="bg-gray-100">
                  <TableHead className="w-10 text-center">ردیف</TableHead>
                  <TableHead className="w-12 text-center">شاسی</TableHead>
                  <TableHead className="w-24 text-center">تاریخ</TableHead>
                  <TableHead className="w-12 text-center">مبلغ</TableHead>
                  <TableHead className="w-10 text-center">دلیل</TableHead>
                  <TableHead className="w-24 text-center">توضیحات</TableHead>
                  <TableHead className="w-24 text-center">عملیات</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {(filteredDecreaseFinance ?? []).map((item, index) => (
                  <TableRow
                    key={`${item._id}-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="text-center">
                      {item.vin ?? "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.transactionDate}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatPrice(item.amount?.toLocaleString())}
                    </TableCell>
                    <TableCell className="text-center">{item.reason}</TableCell>
                    <TableCell
                      title={item.description ?? "-"}
                      className="text-center truncate cursor-pointer"
                    >
                      {item.description ?? "-"}
                    </TableCell>
                    <TableCell className="text-center flex gap-3 items-center justify-center">
                      <Pencil
                        className="w-4 h-4 cursor-pointer hover:text-indigo-500"
                        onClick={() => {
                          // setIsOpenEditModal(true);
                          // setChequeId(item._id);
                          setIsOpenEditModal(true);
                          setTransactionId(item._id?.toString());
                          setDealId((item as ITransactionNew)?.dealId);
                        }}
                      />
                      <Trash
                        className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() => {
                          handleDeleteClick(item._id?.toString() || "");
                          setDealToDelete(item?.dealId?.toString() || "");
                          setPersonId(
                            item.personId ||
                              item.partnerPersonId ||
                              item.providerPersonId ||
                              "",
                          );
                          setIsChequeTransaction(
                            item.paymentMethod === "چک" ? true : false,
                          );
                          // handleDeleteClick(item._id?.toString() || "");
                          // setTransactionIdToDeleteWalletTransaction(
                          //   item.relatedTransactionId ?? "",
                          // );
                          // setDealIdToDeleteWalletTransaction(
                          //   item.relatedDealId ?? "",
                          // );
                          // setPersonId(
                          //   item.payer?.personId ??
                          //     item.payee?.personId ??
                          //     item.customer?.personId ??
                          //     item.brokerPersonId.personId ??
                          //     item.providerPersonId.personId ??
                          //     "",
                          // );
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="border border-gray-300 p-4 rounded-md relative w-full h-[30rem]">
          <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4 font-medium">
            افزایش سرمایه
          </p>
          <div className="max-h-[28rem] h-[28rem] overflow-y-auto rounded-md border w-full">
            <Table className="min-w-full table-fixed text-right border-collapse">
              <TableHeader className="top-0 sticky">
                <TableRow className="bg-gray-100">
                  <TableHead className="w-10 text-center">ردیف</TableHead>
                  <TableHead className="w-24 text-center">شاسی</TableHead>
                  <TableHead className="w-24 text-center">تاریخ</TableHead>
                  <TableHead className="w-24 text-center">مبلغ</TableHead>
                  <TableHead className="w-24 text-center">درصد</TableHead>
                  <TableHead className="w-24 text-center">
                    توضیحات
                  </TableHead>{" "}
                  <TableHead className="w-24 text-center">عملیات</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {(filteredIncreaseFinance ?? []).map((item, index) => (
                  <TableRow
                    key={`${item._id}-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="text-center">
                      {item.vin ?? "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.transactionDate}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatPrice(item.amount?.toLocaleString())}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.partnershipProfitSharePercentage}
                    </TableCell>
                    <TableCell
                      title={item.description ?? "-"}
                      className="text-center truncate cursor-pointer"
                    >
                      {item.description ?? "-"}
                    </TableCell>{" "}
                    <TableCell className="text-center flex gap-3 items-center justify-center">
                      <Pencil
                        className="w-4 h-4 cursor-pointer hover:text-indigo-500"
                        onClick={() => {
                          // setIsOpenEditModal(true);
                          // setChequeId(item._id);
                          setIsOpenEditModal(true);
                          setTransactionId(item._id?.toString());
                          setDealId((item as ITransactionNew)?.dealId);
                        }}
                      />
                      <Trash
                        className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() => {
                          // handleDeleteClick(item._id?.toString() || "");
                          // setTransactionIdToDeleteWalletTransaction(
                          //   item.relatedTransactionId ?? "",
                          // );
                          // setDealIdToDeleteWalletTransaction(
                          //   item.relatedDealId ?? "",
                          // );
                          // setPersonId(
                          //   item.payer?.personId ??
                          //     item.payee?.personId ??
                          //     item.customer?.personId ??
                          //     item.brokerPersonId.personId ??
                          //     item.providerPersonId.personId ??
                          //     "",
                          // );
                          handleDeleteClick(item._id?.toString() || "");
                          setDealToDelete(item?.dealId?.toString() || "");
                          setPersonId(
                            item.personId ||
                              item.partnerPersonId ||
                              item.providerPersonId ||
                              "",
                          );
                          setIsChequeTransaction(
                            item.paymentMethod === "چک" ? true : false,
                          );
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
              // getTransactionsHandler={getTransactionsByDealIdHandler}
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
    </div>
  );
};

export default FinanciersDashboard;
