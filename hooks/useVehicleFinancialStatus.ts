import { RootState } from "@/redux/store";
import { IDeal } from "@/types/new-backend-types";
import React from "react";
import { useSelector } from "react-redux";
import useGetDealsByVin from "./useGetDealsByVin";
import useGetTransactionByDealId from "./useGetTransactionByDealId";
import useGetChequesByDealId from "./useGetChequesByDealId";
import { peopleStatus } from "@/redux/slices/transactionSlice";
import { useQueryClient } from "@tanstack/react-query";

export function useVehicleFinancialStatus() {
  const queryClient = useQueryClient();
  const { selectedDealId, chassisNo } = useSelector(
    (state: RootState) => state.cars,
  );
  const [deal, setDeal] = React.useState<IDeal>();

  const getDealByVin = useGetDealsByVin(chassisNo);
  const dealsData = getDealByVin.data;

  React.useEffect(() => {
    if (dealsData?.length === 1) {
      setDeal(dealsData[0]);
    } else if (dealsData?.length && dealsData.length > 1) {
      const selectedDeal = dealsData.find(
        (d) => d._id.toString() === selectedDealId,
      );
      setDeal(selectedDeal ?? undefined);
    }
  }, [dealsData, selectedDealId]);

  const dealId = deal?._id?.toString();
  const { data: transactions = [] } = useGetTransactionByDealId(dealId);
  const { data: cheques = [] } = useGetChequesByDealId(dealId);

  const getTransactionsByDealIdHandler = async () => {
    if (!dealId) return;
    await queryClient.invalidateQueries({
      queryKey: ["get-transaction-by-deal-id", dealId],
    });
  };

  const getChequesByDealIdHandler = async () => {
    if (!dealId) return;
    await queryClient.invalidateQueries({
      queryKey: ["get-cheques-by-deal-id", dealId],
    });
  };

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

  const investmentTransactionConditions = (t: (typeof transactions)[number]) => {
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
  };

  const peopleStatusResult = {
    firstParty: firstPartyStatus,
    secondParty: secondPartyStatus,
  };

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
    peopleStatus: peopleStatusResult,
    setDeal,
    getTransactionsByDealIdHandler,
    getChequesByDealIdHandler,
  };
}
