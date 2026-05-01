"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetAllBusinessAccount from "@/hooks/useGetAllBusinessAccount";
import useGetAllTransactions from "@/hooks/useGetAllTransaction";
import SearchInputSelector from "./global/searchInputSelector";
import React from "react";
import useGetAllPeople from "@/hooks/useGetAllPeople";
import {
  formatPrice,
  PAYMENT_METHODS,
  toTimestamp,
  TRANSACTION_REASONS_FOR_PAYMENT,
  TRANSACTION_REASONS_FOR_RECEIPT,
  TRANSACTION_TYPES,
} from "@/utils/systemConstants";
import SelectForFilterCheques from "./selectForFilterCheques";
import RangeDatePicker from "./global/rangeDatePicker";
import { DateObject } from "react-multi-date-picker";
import useGetVehicles from "@/hooks/useGetVehicle";
import { Pencil, Trash } from "lucide-react";
import { IDeal, ITransactionNew } from "@/types/new-backend-types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import TransactionForm from "./forms/transactionForm";
import DeleteModal from "./modals/deleteModal";
import { useDeleteTransaction } from "@/apis/mutations/transaction";
import { useDeleteWalletTransaction } from "@/apis/mutations/people";
import {
  useDeleteCheque,
  useGetChequesByDealId,
} from "@/apis/mutations/cheques";
import { useQueryClient } from "@tanstack/react-query";
import useGetDealsByVin from "@/hooks/useGetDealsByVin";
import { setVehicleUpdated } from "@/redux/slices/transactionSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import useGetAllCheques from "@/hooks/useGetAllCheques";

const TransactionDashboard = () => {
  const [selectedBusinessAccountCard, setSelectedBusinessAccountCard] =
    React.useState<string | undefined>("");
  const [selectedPerson, setSelectedPerson] = React.useState<
    string | undefined
  >("");
  const [selectedVehicle, setSelectedVehicle] = React.useState<
    string | undefined
  >("");
  const [date, setDate] = React.useState<DateObject[]>([]);
  const [selectedTransactionType, setSelectedTransactionType] = React.useState<
    string | undefined
  >("");
  const [selectedTransactionReason, setSelectedTransactionReason] =
    React.useState<string | undefined>("");
  const [selectedTransactionMethod, setSelectedTransactionMethod] =
    React.useState<string | undefined>("");
  const [isOpenEditModal, setIsOpenEditModal] = React.useState<boolean>(false);
  const [transactionId, setTransactionId] = React.useState<string | undefined>(
    undefined,
  );
  const [dealId, setDealId] = React.useState<string | undefined>(undefined);
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
  const [isCustomerToCustomer, setIsCustomerToCustomer] =
    React.useState<boolean>(false);

  const [isChequeTransaction, setIsChequeTransaction] =
    React.useState<boolean>(false);
  const [deal, setDeal] = React.useState<IDeal>();

  const { chassisNo, selectedDealId } = useSelector(
    (state: RootState) => state.cars,
  );
  const dispatch = useDispatch();

  const getDealByVin = useGetDealsByVin(chassisNo);
  const dealsData = getDealByVin.data;

  const { data: allPeople } = useGetAllPeople();
  const { data: allTransactions } = useGetAllTransactions();
  // console.log("🚀 ~ TransactionDashboard ~ allTransactions:", allTransactions);
  const { data: allBusinessAccount } = useGetAllBusinessAccount();
  const { data: allVehicles } = useGetVehicles();
  const { data: cheques } = useGetAllCheques();
  const deleteTransaction = useDeleteTransaction();
  // const getChequesByDealId = useGetChequesByDealId();
  const deleteWalletTransaction = useDeleteWalletTransaction();
  const deleteCheque = useDeleteCheque();
  const queryClient = useQueryClient();

  const businessAccountFormat =
    allBusinessAccount?.map((b) => {
      return { id: b._id, label: `${b.accountName}-${b.accountNumber}` };
    }) ?? [];

  const peopleFormat =
    allPeople?.map((p) => {
      return { id: p._id, label: `${p.firstName}-${p.lastName}` };
    }) ?? [];

  const vehiclesFormat = React.useMemo(() => {
    return (
      allVehicles?.map((v) => ({
        id: v.vin || v._id || "unknown",
        label: `${v.plateNumber || "بدون پلاک"}-${v.model}-${v.vin}`,
      })) || []
    );
  }, [allVehicles]);

  // const takeFromBusinessAccountTransaction = allTransactions?.filter((t) => {
  //   const validCheques = cheques?.filter(
  //     (c) =>
  //       (c.status === "خرج شده" || c.status === "وصول شده") &&
  //       c.type === "issued",
  //   );
  //   console.log(
  //     "🚀 ~ TransactionDashboard ~ takeFromBusinessAccountTransaction:",
  //     validCheques,
  //   );
  //   return t.type === "پرداخت" && t.paymentMethod !== "چک" && validCheques;
  // });
  // console.log(
  //   "🚀 ~ TransactionDashboard ~ takeFromBusinessAccountTransaction:",
  //   takeFromBusinessAccountTransaction,
  // );
  // const payInTransactionData = allTransactions?.filter((t) => {
  //   const validCheques = cheques?.filter(
  //     (c) =>
  //       (c.status === "خرج شده" || c.status === "وصول شده") &&
  //       c.type === "received",
  //   );
  //   console.log(
  //     "🚀 ~ TransactionDashboard ~ payInTransactionData:",
  //     validCheques,
  //   );
  //   return (t.type === "دریافت" && t.paymentMethod !== "چک") || validCheques;
  // });
  // console.log(
  //   "🚀 ~ TransactionDashboard ~ payInTransactionData:",
  //   payInTransactionData,
  // );

  // const takeFromBusinessAccountValidCheques = cheques?.filter(
  //   (c) =>
  //     (c.status === "خرج شده" || c.status === "وصول شده") &&
  //     c.type === "issued",
  // );

  // const payInValidCheques = cheques?.filter(
  //   (c) =>
  //     (c.status === "خرج شده" || c.status === "وصول شده") &&
  //     c.type === "received",
  // );
  // console.log("🚀 ~ TransactionDashboard ~ cheques:", cheques);
  // console.log(
  //   "🚀 ~ TransactionDashboard ~ takeFromBusinessAccountValidCheques:",
  //   takeFromBusinessAccountValidCheques,
  // );

  // هر تراکنش چکی باید چک مربوطه‌اش بررسی بشه
  const isValidCheque = (transactionId: string) => {
    const cheque = cheques?.find(
      (c) => c.relatedTransactionId === transactionId,
    );
    return (
      cheque && (cheque.status === "خرج شده" || cheque.status === "وصول شده")
    );
  };

  const takeFromBusinessAccountTransaction = allTransactions?.filter((t) => {
    if (t.type !== "پرداخت") return false;

    if (t.paymentMethod === "چک") {
      return isValidCheque(t._id);
    }

    return true;
  });

  const payInTransactionData = allTransactions?.filter((t) => {
    if (t.type !== "دریافت") return false;

    if (t.paymentMethod === "چک") {
      return isValidCheque(t._id);
    }

    return true;
  });

  const filteredTakeFromBusinessAccountTransaction =
    takeFromBusinessAccountTransaction?.filter((t) => {
      const accountCondition = selectedBusinessAccountCard
        ? t.bussinessAccountId === selectedBusinessAccountCard
        : true;

      const personCondition = selectedPerson
        ? t.personId === selectedPerson ||
          t.brokerPersonId === selectedPerson ||
          t.partnerPersonId === selectedPerson ||
          t.providerPersonId === selectedPerson
        : true;

      const vehicleCondition = selectedVehicle
        ? t.vin === selectedVehicle
        : true;

      const start = date[0]?.format("YYYY/MM/DD");
      const end = date[1]?.format("YYYY/MM/DD");
      const txTs = toTimestamp(t.transactionDate);
      const startTs = toTimestamp(start);
      const endTs = toTimestamp(end);
      const dateCondition =
        (!startTs || (txTs ?? 0) >= startTs) &&
        (!endTs || (txTs ?? 0) <= endTs);

      const typeCondition = selectedTransactionType
        ? selectedTransactionType === "همه"
          ? true
          : t.type === selectedTransactionType
        : true;

      const reasonCondition = selectedTransactionReason
        ? selectedTransactionReason === "همه"
          ? true
          : t.reason === selectedTransactionReason
        : true;

      const methodCondition = selectedTransactionMethod
        ? selectedTransactionMethod === "همه"
          ? true
          : t.paymentMethod === selectedTransactionMethod
        : true;

      return (
        accountCondition &&
        personCondition &&
        vehicleCondition &&
        dateCondition &&
        typeCondition &&
        reasonCondition &&
        methodCondition
      );
    });

  const filteredPayInTransactionData = payInTransactionData?.filter((t) => {
    const accountCondition = selectedBusinessAccountCard
      ? t.bussinessAccountId === selectedBusinessAccountCard
      : true;

    const personCondition = selectedPerson
      ? t.personId === selectedPerson ||
        t.brokerPersonId === selectedPerson ||
        t.partnerPersonId === selectedPerson ||
        t.providerPersonId === selectedPerson
      : true;

    const vehicleCondition = selectedVehicle ? t.vin === selectedVehicle : true;

    const start = date[0]?.format("YYYY/MM/DD");
    const end = date[1]?.format("YYYY/MM/DD");

    const txTs = toTimestamp(t.transactionDate);
    const startTs = toTimestamp(start);
    const endTs = toTimestamp(end);
    const dateCondition =
      (!startTs || (txTs ?? 0) >= startTs) && (!endTs || (txTs ?? 0) <= endTs);

    const typeCondition = selectedTransactionType
      ? selectedTransactionType === "همه"
        ? true
        : t.type === selectedTransactionType
      : true;

    const reasonCondition = selectedTransactionReason
      ? selectedTransactionReason === "همه"
        ? true
        : t.reason === selectedTransactionReason
      : true;

    const methodCondition = selectedTransactionMethod
      ? selectedTransactionMethod === "همه"
        ? true
        : t.paymentMethod === selectedTransactionMethod
      : true;

    return (
      accountCondition &&
      personCondition &&
      vehicleCondition &&
      dateCondition &&
      typeCondition &&
      reasonCondition &&
      methodCondition
    );
  });

  const totalPayInTransaction = filteredPayInTransactionData?.reduce(
    (sum, t) => sum + t.amount,
    0,
  );
  const totalTakeFromBusinessAccountTransaction =
    filteredTakeFromBusinessAccountTransaction?.reduce(
      (sum, t) => sum + t.amount,
      0,
    );

  const transactionReason = [
    ...TRANSACTION_REASONS_FOR_PAYMENT,
    ...TRANSACTION_REASONS_FOR_RECEIPT,
  ];

  const handleDeleteClick = (transactionId: string) => {
    setTransactionToDelete(transactionId);
    setIsOpenDeleteModal(true);
  };

  const handleEditSuccess = () => {
    setIsOpenEditModal(false);
    setTransactionId(undefined);
    // getTransactionsByDealIdHandler();
    queryClient.invalidateQueries({
      queryKey: ["get-all-transaction"],
    });
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
        // await getTransactionsByDealIdHandler();

        queryClient.invalidateQueries({
          queryKey: ["get-all-transaction"],
        });

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
              dealID: dealToDelete ?? secondDealToDelete ?? "",
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
          // getChequesByDealIdHandler();
        }
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  React.useEffect(() => {
    if (dealsData?.length === 1) {
      setDeal(dealsData[0]);
    } else if (dealsData?.length && dealsData?.length > 1) {
      const selectedDeal = dealsData?.find(
        (deal) => deal._id.toString() === selectedDealId,
      );
      setDeal(selectedDeal ?? undefined);
    }
  }, [dealsData, selectedDealId]);

  return (
    <>
      <div className="space-y-6">
        <div className="flex gap-9 items-center mt-3">
          <div className="space-y-1">
            <SearchInputSelector
              data={businessAccountFormat}
              title="انتخاب کارت"
              setSelectedSubject={setSelectedBusinessAccountCard}
              selectedValue={selectedBusinessAccountCard ?? ""}
            />
          </div>
          <div className="space-y-1">
            <SearchInputSelector
              data={vehiclesFormat}
              title="انتخاب خودرو"
              setSelectedSubject={setSelectedVehicle}
              selectedValue={selectedVehicle ?? ""}
            />
          </div>
          <div className="space-y-1">
            <SearchInputSelector
              data={peopleFormat}
              title="انتخاب شخص"
              setSelectedSubject={setSelectedPerson}
              selectedValue={selectedPerson ?? ""}
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-var(--title) text-sm font-medium mb-2 text-blue-900">
              تاریخ:
            </h3>
            {/* <PersianDatePicker
            value={date}
            onChange={(value) => setDate(value)}
            placeholder="تاریخ"
          /> */}
            <RangeDatePicker dates={date} setDates={setDate} />
          </div>

          <div className="space-y-1">
            <SelectForFilterCheques
              data={["همه", ...TRANSACTION_TYPES.filter(Boolean)]}
              title="نوع تراکنش"
              setSelectedSubject={setSelectedTransactionType}
              selectedValue={selectedTransactionType ?? ""}
            />
          </div>
          <div className="space-y-1">
            <SelectForFilterCheques
              data={["همه", ...transactionReason.filter(Boolean)]}
              title="دلیل تراکنش"
              setSelectedSubject={setSelectedTransactionReason}
              selectedValue={selectedTransactionReason ?? ""}
            />
          </div>
          <div className="space-y-1">
            <SelectForFilterCheques
              data={["همه", ...PAYMENT_METHODS.filter(Boolean)]}
              title="روش تراکنش"
              setSelectedSubject={setSelectedTransactionMethod}
              selectedValue={selectedTransactionMethod ?? ""}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 items-start mt-7">
          <div>
            <div className="border border-gray-300 p-4 rounded-md relative w-full h-[30rem]">
              <p className="text-red-500 absolute right-2 -top-5 bg-white py-2 px-4">
                برداشت از حساب
              </p>
              <div className="max-h-[28rem] h-[28rem] overflow-y-auto rounded-md border w-full">
                <Table className="min-w-full table-fixed text-right border-collapse">
                  <TableHeader className="top-0 sticky">
                    <TableRow className="bg-gray-100">
                      <TableHead className="w-10 text-center">ردیف</TableHead>
                      <TableHead className="w-12 text-center">تاریخ</TableHead>
                      <TableHead className="w-12 text-center">شاسی</TableHead>
                      <TableHead className="w-12 text-center">مبلغ</TableHead>
                      <TableHead className="w-12 text-center">
                        نوع تراکنش
                      </TableHead>
                      <TableHead className="w-12 text-center">دلیل</TableHead>
                      <TableHead className="w-12 text-center">
                        روش تراکنش
                      </TableHead>
                      <TableHead className="w-12 text-center">
                        توضیحات
                      </TableHead>
                      <TableHead className="w-12 text-center">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {(filteredTakeFromBusinessAccountTransaction ?? []).map(
                      (item, index) => {
                        return (
                          <TableRow key={item._id} className="hover:bg-gray-50">
                            <TableCell className="text-center">
                              {index + 1}
                            </TableCell>
                            <TableCell className="text-center">
                              {item.transactionDate}
                            </TableCell>
                            <TableCell className="text-center">
                              {item.role === "saraf" ? "" : item.vin}
                            </TableCell>
                            <TableCell className="text-center">
                              {item.amount.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-center">
                              {item.type}
                            </TableCell>
                            <TableCell className="text-center">
                              {item.reason}
                            </TableCell>
                            <TableCell className="text-center">
                              {item.paymentMethod}
                            </TableCell>
                            <TableCell className="text-center">
                              {item.description}
                            </TableCell>
                            <TableCell className="text-center flex gap-3 justify-center items-center">
                              <Pencil
                                className="w-4 h-4 cursor-pointer hover:text-indigo-500"
                                onClick={() => {
                                  setIsOpenEditModal(true);
                                  setTransactionId(item._id?.toString());
                                  setDealId((item as ITransactionNew)?.dealId);
                                }}
                              />
                              <Trash
                                className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-700"
                                onClick={() => {
                                  handleDeleteClick(item._id?.toString() || "");
                                  setDealToDelete(
                                    item?.dealId?.toString() || "",
                                  );
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
                                  setSecondDealToDelete(
                                    item.secondDealId ?? "",
                                  );
                                  setSecondPersonId(item.secondPersonId ?? "");

                                  // setBrokerPersonId(item.brokerPersonId);
                                  setIsChequeTransaction(
                                    item.paymentMethod === "چک" ? true : false,
                                  );
                                  // setBrokerPersonId(item.brokerPersonId);
                                  setIsChequeTransaction(
                                    item.paymentMethod === "چک" ? true : false,
                                  );
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      },
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            <p className="text-red-400 font-medium mt-3 text-left">
              {formatPrice(
                totalTakeFromBusinessAccountTransaction?.toLocaleString(),
              )}
            </p>
          </div>
          <div>
            <div className="border border-gray-300 p-4 rounded-md relative w-full h-[30rem]">
              <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
                واریز به حساب
              </p>
              <div className="max-h-[28rem] h-[28rem] overflow-y-auto rounded-md border w-full">
                <Table className="min-w-full table-fixed text-right border-collapse">
                  <TableHeader className="top-0 sticky">
                    <TableRow className="bg-gray-100">
                      <TableHead className="w-10 text-center">ردیف</TableHead>
                      <TableHead className="w-12 text-center">تاریخ</TableHead>
                      <TableHead className="w-12 text-center">شاسی</TableHead>
                      <TableHead className="w-12 text-center">مبلغ</TableHead>
                      <TableHead className="w-12 text-center">
                        نوع تراکنش
                      </TableHead>
                      <TableHead className="w-12 text-center">دلیل</TableHead>
                      <TableHead className="w-12 text-center">
                        روش تراکنش
                      </TableHead>
                      <TableHead className="w-12 text-center">
                        توضیحات
                      </TableHead>
                      <TableHead className="w-12 text-center">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {(filteredPayInTransactionData ?? []).map((item, index) => (
                      <TableRow key={item._id} className="hover:bg-gray-50">
                        <TableCell className="text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.transactionDate}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.role === "saraf" ? "" : item.vin}{" "}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.type}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.reason}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.paymentMethod}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.description}
                        </TableCell>
                        <TableCell className="text-center flex gap-3 justify-center items-center">
                          <Pencil
                            className="w-4 h-4 cursor-pointer hover:text-indigo-500"
                            onClick={() => {
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
                              // setBrokerPersonId(item.brokerPersonId);
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
            <p className="text-green-400 font-medium mt-3 text-left">
              {formatPrice(totalPayInTransaction?.toLocaleString())}
            </p>
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

export default TransactionDashboard;
