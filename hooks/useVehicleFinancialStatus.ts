import { RootState } from "@/redux/store";
import { IChequeNew, IDeal, ITransactionNew } from "@/types/new-backend-types";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import useGetDealsByVin from "./useGetDealsByVin";
import { useGetTransactionsByDealId } from "@/apis/mutations/transaction";
import { peopleStatus, setPeopleStatus } from "@/redux/slices/transactionSlice";
import { useGetChequesByDealId } from "@/apis/mutations/cheques";

export function useVehicleFinancialStatus() {
  const dispatch = useDispatch();
  const { selectedDealId, chassisNo } = useSelector(
    (state: RootState) => state.cars,
  );
  const [deal, setDeal] = React.useState<IDeal>();
  const [transactions, setTransactions] = React.useState<ITransactionNew[]>([]);
  const [cheques, setCheques] = React.useState<IChequeNew[]>([]);

  // --- FETCHERS ---
  const getDealByVin = useGetDealsByVin(chassisNo);
  const dealsData = getDealByVin.data;
  const getTransactionsByDealId = useGetTransactionsByDealId();
  const getChequesByDealId = useGetChequesByDealId();

  // --- DEAL SYNC ---
  React.useEffect(() => {
    if (dealsData?.length === 1) {
      setDeal(dealsData[0]);
    } else if (dealsData?.length && dealsData?.length > 1) {
      const selectedDeal = dealsData?.find(
        (d) => d._id.toString() === selectedDealId,
      );
      setDeal(selectedDeal ?? undefined);
    }
  }, [dealsData, selectedDealId, chassisNo]);

  const getChequesByDealIdHandler = async () => {
    if (!deal?._id) return;
    try {
      const cheques = await getChequesByDealId.mutateAsync(
        deal?._id.toString() ?? selectedDealId ?? "",
      );
      setCheques(cheques);
    } catch (error) {
      console.log("🚀 ~ getChequesByDealIdHandler ~ error:", error);
    }
  };
  const getTransactionsByDealIdHandler = async () => {
    if (!deal?._id) return;
    try {
      const transactions = await getTransactionsByDealId.mutateAsync(
        deal?._id.toString() ?? selectedDealId ?? "",
      );

      setTransactions(transactions);
    } catch (error) {
      console.log("🚀 ~ getTransactionsByDealIdHandler ~ error:", error);
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

  const validChequeRecieved = cheques?.filter((c) => {
    const isRecieved =
      c.type === "received" &&
      (c.reason === "فروش خودرو" || c.reason === "فروش خودروـ صراف") &&
      (c.status === "وصول شده" ||
        c.status === "پاس شده" ||
        c.status === "خرج شده");
    return isRecieved;
  });

  const validChequePaid = cheques?.filter((c) => {
    const isPaid =
      c.type === "issued" &&
      (c.status === "وصول شده" ||
        c.status === "پاس شده" ||
        c.status === "خرج شده");
    return isPaid;
  });
  const validChequePaidTransactionIds = (validChequePaid ?? []).map((c) =>
    c.relatedTransactionId?.toString(),
  );

  const validChequeRecievedTransactionIds = (validChequeRecieved ?? []).map(
    (c) => c.relatedTransactionId?.toString(),
  );

  const paidTransactionCheques = transactions.filter((t) =>
    validChequePaidTransactionIds?.includes(t._id?.toString()),
  );

  const recievedTransactionCheques = transactions.filter((t) =>
    validChequeRecievedTransactionIds?.includes(t._id?.toString()),
  );

  const investmentTransactionConditions = (t: ITransactionNew) => {
    return (
      (t.type === "پرداخت" && t.reason === "اصل سرمایه") ||
      (t.type === "پرداخت" && t.reason === "سود سرمایه") ||
      (t.type === "دریافت" && t.reason === "سرمایه گذاری")
    );
  };

  const paidTransactions =
    transactions?.filter(
      (t) =>
        (t.type === "پرداخت" || t.type === "سایر هزینه‌ها") &&
        !investmentTransactionConditions(t) &&
        t.paymentMethod !== "چک",
    ) ?? [];
  const receivedTransactions =
    transactions?.filter(
      (t) =>
        (t.type === "دریافت" || t.type === "سایر هزینه‌ها") &&
        !investmentTransactionConditions(t) &&
        t.paymentMethod !== "چک",
    ) ?? [];

  const finalPaidTransactions = React.useMemo(() => {
    return [...paidTransactions, ...paidTransactionCheques];
  }, [paidTransactions, paidTransactionCheques]);

  const finalReceivedTransactions = React.useMemo(() => {
    return [...receivedTransactions, ...recievedTransactionCheques];
  }, [receivedTransactions, recievedTransactionCheques]);

  const totalPaidToSeller =
    finalPaidTransactions
      ?.filter(
        (t) =>
          t.reason === "خرید خودرو" ||
          t.reason === "خرید خودروـ صراف" ||
          t.reason?.includes("خريد"),
      )
      ?.reduce((sum, t) => sum + (t?.amount || 0), 0) || 0;

  const totalReceived =
    finalReceivedTransactions?.reduce((sum, t) => sum + (t?.amount || 0), 0) ||
    0;

  const remainingForBuyer =
    deal?.salePrice && totalReceived
      ? deal?.salePrice - totalReceived
      : deal?.salePrice || 0;

  const remainingToSeller =
    deal?.purchasePrice && totalPaidToSeller
      ? deal.purchasePrice - totalPaidToSeller
      : deal?.purchasePrice || 0;

  let firstPartyStatus: peopleStatus = "-";
  let secondPartyStatus: peopleStatus = "-";

  if (remainingToSeller === 0) {
    firstPartyStatus = "تسویه شده";
  } else if (remainingToSeller > 0) {
    firstPartyStatus = "بدهکار";
  } else if (remainingToSeller < 0) {
    firstPartyStatus = "بستانکار";
  }

  if (remainingForBuyer === 0) {
    secondPartyStatus = "تسویه شده";
  } else if (remainingForBuyer < 0) {
    secondPartyStatus = "بدهکار";
  } else if (remainingForBuyer > 0) {
    secondPartyStatus = "بستانکار";
  }
  const peopleStatus = {
    firstParty: firstPartyStatus,
    secondParty: secondPartyStatus,
  };

  React.useEffect(() => {
    getTransactionsByDealIdHandler();
    getChequesByDealIdHandler();
  }, [deal?._id, selectedDealId]);

  return {
    deal,
    transactions,
    cheques,
    finalPaidTransactions,
    finalReceivedTransactions,
    totalPaidToSeller,
    totalReceived,
    remainingForBuyer,
    remainingToSeller,
    peopleStatus,
    setTransactions,
    setDeal,
    setCheques,
    getTransactionsByDealIdHandler,
    getChequesByDealIdHandler,
  };
}
