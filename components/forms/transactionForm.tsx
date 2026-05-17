"use client";

import React from "react";
// @ts-ignore - react-hook-form useForm: types sometimes not resolved (e.g. Next build); runtime is fine. Use @ts-ignore so Ubuntu build does not report "Unused directive".
import {
  Controller,
  useForm,
  type SubmitHandler,
  ControllerRenderProps,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  transactionChequeSchema,
  transactionChequeSchemaType,
} from "@/validations/transactionCheque";
import { toast } from "sonner";
import { getTransactionById } from "@/apis/client/transaction";
import {
  useCreateTransaction,
  useUpdateTransaction,
} from "@/apis/mutations/transaction";
import { createCheque, updateCheque } from "@/apis/client/cheques";
import useGetAllPeople from "@/hooks/useGetAllPeople";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PersonSelect from "../ui/person-select";
import PersianDatePicker from "../global/persianDatePicker";
import {
  TRANSACTION_TYPES,
  TRANSACTION_REASONS_FOR_RECEIPT,
  PAYMENT_METHODS,
  BANK_NAMES,
  CHEQUE_STATUSES,
  TRANSACTION_REASONS_FOR_PAYMENT,
} from "@/utils/systemConstants";
import type {
  IPeople,
  IDeal,
  ITransactionNew,
} from "@/types/new-backend-types";
import useUpdateWalletHandler from "@/hooks/useUpdateWalletHandler";
import useUpdateWalletTransferHandler from "@/hooks/useUpdateWalletTransferHandler";
import useGetChequesByDealId from "@/hooks/useGetChequesByDealId";
import {
  setTransactionCreated,
  setVehicleUpdated,
} from "@/redux/slices/transactionSlice";
import { useDispatch } from "react-redux";
import useGetAllDeals from "@/hooks/useGetAllDeals";
import useGetAllBusinessAccount from "@/hooks/useGetAllBusinessAccount";
import useGetAllTransactions from "@/hooks/useGetAllTransaction";
import { useDeleteWalletTransaction } from "@/apis/mutations/people";

interface TransactionFormProps {
  onSuccess?: () => void;
  embedded?: boolean;
  mode?: "add" | "edit";
  transactionId?: string;
  dealId?: string;
  getTransactionsHandler?: () => Promise<void>;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  onSuccess,
  embedded = false,
  mode = "add",
  transactionId,
  dealId,
  getTransactionsHandler,
}) => {
  const { data: allPeople } = useGetAllPeople();
  // const { data: allAccounts } = useQuery({
  //   queryKey: ["get-all-business-accounts"],
  //   queryFn: getAllBusinessAccounts,
  // });
  const { data: allAccounts } = useGetAllBusinessAccount();
  // const { data: allDeals } = useQuery({
  //   queryKey: ["get-all-deals"],
  //   queryFn: getAllDeals,
  // });
  const { data: allDeals } = useGetAllDeals();
  // const { data: transactionDataById } = useQuery({
  //   queryKey: ["get-transaction-by-id", transactionId],
  //   queryFn: () => getTransactionById(transactionId ?? ""),
  //   enabled: mode === "edit" && !!transactionId,
  // });

  const { data: allTransactions } = useGetAllTransactions();

  const transactionDataById = allTransactions?.filter(
    (t) => t._id === transactionId,
  )[0];

  const { data: getChequeByDealId } = useGetChequesByDealId(dealId ?? "");
  // const { data: getTransactionByDealId } = useGetTransactionByDealId(
  //   dealId ?? "",
  // );

  const createTransaction = useCreateTransaction();
  const [selectedPerson, setSelectedPerson] = React.useState<IPeople | null>(
    null,
  );
  const [selectedDeal, setSelectedDeal] = React.useState<IDeal | null>(null);
  const [selectedSecondDeal, setSelectedSecondDeal] =
    React.useState<IDeal | null>(null);

  const financierPeople = allPeople?.filter((p) =>
    p.roles.includes("financier"),
  );

  const moneyChangerPeople = allPeople?.filter((p) =>
    p.roles.includes("moneyChanger"),
  );

  const selectedTransactionChequeInfo = getChequeByDealId?.filter(
    (el) => el.relatedTransactionId === transactionId,
  )[0];

  const partnerShip = allPeople?.find(
    (el) => el._id === transactionDataById?.partnerPersonId,
  );

  const providerPerson = allPeople?.find(
    (el) => el._id === transactionDataById?.providerPersonId,
  );

  const brokerPerson = allPeople?.find(
    (el) => el._id === transactionDataById?.brokerPersonId,
  );

  const isBuyByOtherPerson =
    transactionDataById?.reason === "خرید خودروـ صراف" &&
    transactionDataById.type === "پرداخت" &&
    transactionDataById.paymentMethod === "مشتری به مشتری" &&
    mode === "edit" &&
    transactionDataById.role === "otherPerson";

  // const isSellByOtherPerson =
  //   transactionDataById?.reason === "فروش خودروـ صراف" &&
  //   transactionDataById.type === "دریافت" &&
  //   transactionDataById.paymentMethod === "مشتری به مشتری" &&
  //   mode === "edit" &&
  //   transactionDataById.role === "otherPerson";

  const isSellBySaraf =
    transactionDataById?.reason === "فروش خودروـ صراف" &&
    transactionDataById.type === "دریافت" &&
    transactionDataById.paymentMethod === "مشتری به مشتری" &&
    mode === "edit" &&
    transactionDataById.role === "saraf";

  // const isBuyBySaraf =
  //   transactionDataById?.reason === "خرید خودروـ صراف" &&
  //   transactionDataById.type === "پرداخت" &&
  //   transactionDataById.paymentMethod === "مشتری به مشتری" &&
  //   mode === "edit" &&
  //   transactionDataById.role === "saraf";

  const dealIdByConditions = isSellBySaraf
    ? transactionDataById?.secondDealId
    : isBuyByOtherPerson
      ? ""
      : transactionDataById?.dealId;
  const secondDealIdByConditions = isSellBySaraf
    ? ""
    : isBuyByOtherPerson
      ? transactionDataById?.dealId
      : transactionDataById?.secondDealId;
  const secondPersonIdByConditions = isSellBySaraf
    ? transactionDataById?.personId
    : isBuyByOtherPerson
      ? transactionDataById?.personId
      : transactionDataById?.secondPersonId;
  const personIdByConditions = isSellBySaraf
    ? transactionDataById?.secondPersonId
    : isBuyByOtherPerson
      ? transactionDataById?.secondPersonId
      : transactionDataById?.personId;

  const defaultValuesOfForm =
    mode === "add"
      ? {
          type: "پرداخت" as const,
          reason: "",
          transactionDate: "",
          amount: "",
          personId: "",
          bussinessAccountId: "",
          paymentMethod: "نقد" as const,
          dealId: "",
          secondPersonId: "",
          secondDealId: "",
          description: "",
          chequeDescription: "",
          chequeNumber: "",
          chequeBankName: "",
          chequeBranchName: "",
          chequeIssueDate: "",
          chequeDueDate: "",
          chequeType: "دریافتی" as const,
          chequeStatus: "",
          chequePayerPersonId: "",
          chequePayeePersonId: "",
          chequeRelatedDealId: "",
          brokerPersonId: "",
          providerPersonId: "",
          partnerPersonId: "",
          profitState: "",
        }
      : {
          type:
            (transactionDataById?.type as "پرداخت" | "دریافت") ??
            ("پرداخت" as const),
          reason: transactionDataById?.reason ?? "",
          transactionDate: transactionDataById?.transactionDate || "",
          amount: transactionDataById?.amount?.toString() ?? "",
          bussinessAccountId: transactionDataById?.bussinessAccountId ?? "",
          paymentMethod:
            (transactionDataById?.paymentMethod as
              | "نقد"
              | "کارت به کارت"
              | "چک"
              | "شبا"
              | "مشتری به مشتری") ?? ("نقد" as const),

          dealId: dealIdByConditions,
          secondDealId: secondDealIdByConditions,
          secondPersonId: secondPersonIdByConditions,
          personId: personIdByConditions,

          description: transactionDataById?.description ?? "",
          chequeDescription: selectedTransactionChequeInfo?.description ?? "",
          chequeNumber: selectedTransactionChequeInfo?.chequeNumber ?? "",
          chequeSer: selectedTransactionChequeInfo?.chequeNumber ?? "",
          chequeBankName: selectedTransactionChequeInfo?.bankName ?? "",
          chequeBranchName: selectedTransactionChequeInfo?.branchName ?? "",
          chequeIssueDate: selectedTransactionChequeInfo?.issueDate ?? "",
          chequeDueDate: selectedTransactionChequeInfo?.dueDate ?? "",
          chequeType:
            selectedTransactionChequeInfo?.type === "received"
              ? ("دریافتی" as const)
              : ("پرداختی" as const),
          chequeStatus: selectedTransactionChequeInfo?.status ?? "",
          chequePayerPersonId:
            selectedTransactionChequeInfo?.payer?.personId ?? "",
          chequePayeePersonId:
            selectedTransactionChequeInfo?.payee?.personId ?? "",
          chequeRelatedDealId:
            selectedTransactionChequeInfo?.relatedDealId ?? "",
          chequeCustomerPersonId:
            selectedTransactionChequeInfo?.customer?.personId ?? "",
          chequeSerial: selectedTransactionChequeInfo?.chequeSerial ?? "",
          sayadiID: selectedTransactionChequeInfo?.sayadiID ?? "",
          brokerPersonId:
            (brokerPerson?._id ??
              transactionDataById?.brokerPersonId ??
              selectedTransactionChequeInfo?.brokerPersonId?.personId ??
              `${brokerPerson?.firstName} ${brokerPerson?.lastName}`) ||
            "",
          providerPersonId:
            (transactionDataById?.providerPersonId ??
              `${providerPerson?.firstName} ${providerPerson?.lastName}`) ||
            "",
          partnerPersonId:
            `${partnerShip?.firstName} ${partnerShip?.lastName}` || "",
          partnershipProfitSharePercentage:
            transactionDataById?.partnershipProfitSharePercentage ||
            partnerShip?.brokerDetails?.currentRates
              ?.purchaseCommissionPercent ||
            partnerShip?.brokerDetails?.currentRates?.saleCommissionPercent ||
            "",
          profitState: transactionDataById?.profitState ?? "",
        };

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<transactionChequeSchemaType>({
    mode: "onChange",
    resolver: zodResolver(transactionChequeSchema),
    defaultValues: defaultValuesOfForm,
  });

  const paymentMethod = watch("paymentMethod");
  const transactionType = watch("type");
  const transactionReason = watch("reason");
  const chequeType = watch("chequeType");
  const transactionDealId = watch("dealId");
  const transactionSecondDealId = watch("secondDealId");
  const personId = watch("personId");
  const providerId = watch("providerPersonId");
  const brokerPersonId = watch("brokerPersonId");
  const partnerPersonId = watch("partnerPersonId");

  const selectedDealIdInfo =
    allDeals?.filter((d) => d._id === transactionDealId) ?? [];

  const getSellerInfoById = selectedDealIdInfo?.[0]?.seller?.personId ?? [];
  const getBuyerInfoById = selectedDealIdInfo?.[0]?.buyer?.personId ?? [];

  const peopleForDeal =
    allPeople?.filter(
      (p) => p._id === getSellerInfoById || p._id === getBuyerInfoById,
    ) ?? [];

  const selectedSecondDealIdInfo =
    allDeals?.filter((d) => d._id === transactionSecondDealId) ?? [];

  const getSecondSellerInfoById =
    selectedSecondDealIdInfo?.[0]?.seller?.personId;
  const getSecondBuyerInfoById = selectedSecondDealIdInfo?.[0]?.buyer?.personId;

  const peopleForSecondDeal =
    allPeople?.filter(
      (p) =>
        p._id === getSecondSellerInfoById || p._id === getSecondBuyerInfoById,
    ) ?? [];

  const showChequeFields = paymentMethod === "چک";
  const showPayer = showChequeFields && chequeType === "دریافتی";
  const showPayee = showChequeFields && chequeType === "پرداختی";

  React.useEffect(() => {
    if (!showChequeFields) return;

    if (personId) {
      setValue("chequePayeePersonId", personId);
      setValue("chequeCustomerPersonId", personId);
      setValue("chequePayerPersonId", personId);
    } else if (providerId) {
      setValue("chequePayeePersonId", providerId);
    } else if (brokerPersonId) {
      setValue("chequePayeePersonId", brokerPersonId);
    } else if (partnerPersonId) {
      setValue("chequePayeePersonId", partnerPersonId);
      setValue("chequeCustomerPersonId", partnerPersonId);
      setValue("chequePayerPersonId", partnerPersonId);
    }
  }, [
    showChequeFields,
    personId,
    setValue,
    providerId,
    brokerPersonId,
    partnerPersonId,
  ]);

  React.useEffect(() => {
    if (!showChequeFields) return;

    if (transactionType === "پرداخت") {
      setValue("chequeType", "پرداختی");
    } else if (transactionType === "دریافت") {
      setValue("chequeType", "دریافتی");
    }
  }, [showChequeFields, transactionType, setValue]);

  // React.useEffect(() => {
  //   if (transactionReason === "خرید خودروـ صراف") {
  //     setValue("paymentMethod", "مشتری به مشتری");
  //   } else if (transactionReason === "فروش خودروـ صراف") {
  //     setValue("paymentMethod", "مشتری به مشتری");
  //   }
  // }, [transactionReason, setValue]);

  React.useEffect(() => {
    if (
      transactionReason === "خرید خودروـ صراف" ||
      transactionReason === "فروش خودروـ صراف"
    ) {
      setValue("paymentMethod", "مشتری به مشتری", { shouldValidate: true });
    }
  }, [transactionReason, setValue]);

  const employees = (peopleForDeal ?? allPeople)?.filter((p) =>
    p.roles.includes("employee"),
  );
  const providers = allPeople?.filter((p) => p.roles.includes("provider"));
  const brokers = allPeople?.filter((p) => p.roles.includes("broker"));

  const { updateWalletHandler } = useUpdateWalletHandler();
  const deleteWalletTransaction = useDeleteWalletTransaction();
  const updateTransaction = useUpdateTransaction();
  const { updateWalletTransfer } = useUpdateWalletTransferHandler();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  // Reset form when transaction data is loaded in edit mode
  React.useEffect(() => {
    if (mode === "edit" && transactionDataById) {
      reset({
        type: (transactionDataById?.type as "پرداخت" | "دریافت") ?? "پرداخت",
        reason: transactionDataById?.reason ?? "",
        transactionDate: transactionDataById?.transactionDate ?? "",
        amount: transactionDataById?.amount?.toString() ?? "",
        // personId: transactionDataById?.personId ?? "",
        bussinessAccountId: transactionDataById?.bussinessAccountId ?? "",
        paymentMethod:
          (transactionDataById?.paymentMethod as
            | "نقد"
            | "کارت به کارت"
            | "چک"
            | "شبا"
            | "مشتری به مشتری") ?? "نقد",
        // dealId: isBuyByOtherPerson
        //   ? ""
        //   : isSellBySaraf
        //     ? transactionDataById?.secondDealId
        //     : (transactionDataById?.dealId ?? ""),
        // secondDealId: isBuyByOtherPerson
        //   ? transactionDataById?.dealId
        //   : isSellBySaraf
        //     ? ""
        //     : transactionDataById?.secondDealId,

        // secondPersonId: isBuyByOtherPerson
        //   ? transactionDataById?.personId
        //   : isSellBySaraf
        //     ? transactionDataById?.personId
        //     : transactionDataById?.secondPersonId,
        // personId: isBuyByOtherPerson
        //   ? transactionDataById?.secondPersonId
        //   : isSellBySaraf
        //     ? transactionDataById?.secondPersonId
        //     : (transactionDataById?.personId ?? ""),

        dealId: dealIdByConditions,
        secondDealId: secondDealIdByConditions,
        secondPersonId: secondPersonIdByConditions,
        personId: personIdByConditions,

        // dealId: transactionDataById?.dealId ?? "",
        // secondPersonId: transactionDataById?.secondPersonId,
        // secondDealId: transactionDataById?.secondDealId,
        description: transactionDataById?.description ?? "",
        profitState: transactionDataById?.profitState ?? "",
        chequeDescription: selectedTransactionChequeInfo?.description ?? "",
        chequeNumber: selectedTransactionChequeInfo?.chequeNumber ?? "",
        chequeBankName: selectedTransactionChequeInfo?.bankName ?? "",
        chequeBranchName: selectedTransactionChequeInfo?.branchName ?? "",
        chequeIssueDate: selectedTransactionChequeInfo?.issueDate ?? "",
        chequeDueDate: selectedTransactionChequeInfo?.dueDate ?? "",
        chequeType:
          selectedTransactionChequeInfo?.type === "received"
            ? "دریافتی"
            : "پرداختی",
        chequeStatus: selectedTransactionChequeInfo?.status ?? "",
        chequePayerPersonId:
          selectedTransactionChequeInfo?.payer?.personId ?? "",
        chequePayeePersonId:
          selectedTransactionChequeInfo?.payee?.personId ?? "",
        chequeRelatedDealId: selectedTransactionChequeInfo?.relatedDealId ?? "",
        chequeCustomerPersonId:
          selectedTransactionChequeInfo?.customer?.personId ?? "",
        chequeSerial: selectedTransactionChequeInfo?.chequeSerial ?? "",
        sayadiID: selectedTransactionChequeInfo?.sayadiID ?? "",
        brokerPersonId:
          brokerPerson?._id ??
          selectedTransactionChequeInfo?.brokerPersonId?.personId ??
          "",
        providerPersonId:
          transactionDataById?.providerPersonId ??
          selectedTransactionChequeInfo?.providerPersonId?.personId ??
          "",
        partnerPersonId: partnerShip?._id ?? "",
        partnershipProfitSharePercentage:
          transactionDataById?.partnershipProfitSharePercentage ||
          partnerShip?.brokerDetails?.currentRates?.purchaseCommissionPercent ||
          partnerShip?.brokerDetails?.currentRates?.saleCommissionPercent ||
          "",
      });
    }
  }, [transactionDataById, mode, reset, selectedTransactionChequeInfo]);

  const transactionsForaPersonAndMoneyChangerHandler = async (
    data: transactionChequeSchemaType,
  ) => {
    // const transactionsForaPersonAndMoneyChanger =
    //   data.paymentMethod === "مشتری به مشتری" &&
    //   (data.reason === "خرید خودروـ صراف" ||
    //     data.reason === "فروش خودروـ صراف");

    // // if (twoPersonTransactions) return;

    // // const isPartnershipReason =
    // //   (data.type === "دریافت" && data.reason === "سرمایه گذاری") ||
    // //   (data.type === "پرداخت" &&
    // //     (data.reason === "اصل سرمایه" || data.reason === "سود سرمایه"));

    // const pairGroupId = crypto.randomUUID();

    // const buyFromMoneyChanger = data.reason === "خرید خودروـ صراف";
    // const sellFromMoneyChanger = data.reason === "فروش خودروـ صراف";

    // const transactionDataForMoneyChanger = {
    //   type: sellFromMoneyChanger ? "دریافت" : "پرداخت",
    //   reason: sellFromMoneyChanger ? "فروش خودرو" : "خرید خودرو",
    //   transactionDate: data.transactionDate,
    //   amount: parseFloat(data.amount),
    //   personId: data?.personId,
    //   secondPersonId: data.secondPersonId,
    //   secondDealId: buyFromMoneyChanger ? data.secondDealId : undefined,
    //   bussinessAccountId: data.bussinessAccountId,
    //   paymentMethod: data.paymentMethod,
    //   dealId: buyFromMoneyChanger ? undefined : data.dealId || undefined,
    //   vin: buyFromMoneyChanger
    //     ? ""
    //     : (selectedDeal?.vehicleSnapshot.vin ?? transactionDataById?.vin ?? ""),
    //   secondVin: buyFromMoneyChanger ?
    //    ( selectedSecondDeal?.vehicleSnapshot.vin ??
    //     transactionDataById?.secondVin ??
    //     "") : "",
    //   description: data.description || "",
    //   brokerPersonId: data.brokerPersonId || "",
    //   providerPersonId: data.providerPersonId || "",
    //   partnerPersonId: data.partnerPersonId || "",
    //   partnerShipProfit: `${partnerShip?.firstName} ${partnerShip?.lastName}`,
    //   partnershipProfitSharePercentage:
    //     data.partnershipProfitSharePercentage ||
    //     transactionDataById?.partnershipProfitSharePercentage ||
    //     partnerShip?.brokerDetails?.currentRates?.purchaseCommissionPercent ||
    //     partnerShip?.brokerDetails?.currentRates?.saleCommissionPercent ||
    //     "",
    //   isBetweenTwoPerson: true,
    //   pairGroupId,
    // };

    // const transactionForOtherPersonData = {
    //   type: sellFromMoneyChanger ? "دریافت" : "پرداخت",
    //   reason: sellFromMoneyChanger ? "فروش خودرو" : "خرید خودرو",
    //   transactionDate: data.transactionDate,
    //   amount: parseFloat(data.amount),
    //   personId: data.personId,
    //   secondPersonId: data.secondPersonId,
    //   secondDealId: sellFromMoneyChanger ? "" : data.secondDealId,
    //   bussinessAccountId: data.bussinessAccountId,
    //   paymentMethod: data.paymentMethod,
    //   dealId: buyFromMoneyChanger ? (data.dealId || undefined) : undefined,
    //   vin: selectedDeal?.vehicleSnapshot.vin ?? transactionDataById?.vin ?? "",
    //   secondVin: sellFromMoneyChanger
    //     ? ""
    //     : (selectedSecondDeal?.vehicleSnapshot.vin ??
    //       transactionDataById?.secondVin ??
    //       ""),
    //   description: data.description || "",
    //   brokerPersonId: data.brokerPersonId || "",
    //   providerPersonId: data.providerPersonId || "",
    //   partnerPersonId: data.partnerPersonId || "",
    //   partnerShipProfit: `${partnerShip?.firstName} ${partnerShip?.lastName}`,
    //   partnershipProfitSharePercentage:
    //     data.partnershipProfitSharePercentage ||
    //     transactionDataById?.partnershipProfitSharePercentage ||
    //     partnerShip?.brokerDetails?.currentRates?.purchaseCommissionPercent ||
    //     partnerShip?.brokerDetails?.currentRates?.saleCommissionPercent ||
    //     "",
    //   isBetweenTwoPerson: true,
    //   pairGroupId,
    // };

    // try {
    //   if (transactionsForaPersonAndMoneyChanger && mode === "add") {
    //     const transactionForMoneyChanger = await createTransaction.mutateAsync(
    //       transactionDataForMoneyChanger,
    //     );

    //     const transactionForOtherPerson = await createTransaction.mutateAsync(
    //       transactionForOtherPersonData,
    //     );

    //     queryClient.invalidateQueries({
    //       queryKey: ["get-transactions-by-deal-id"],
    //     });

    //     const price = Number(data.amount);

    //     const walletDataForMoneyChanger = {
    //       amount: sellFromMoneyChanger ? price : -price,
    //       type: sellFromMoneyChanger ? "دریافت" : "پرداخت",
    //       description: data.description,
    //       dealID: data.dealId ?? transactionForMoneyChanger.secondDealId ?? "",
    //       transactionID: transactionForMoneyChanger._id ?? "",
    //     };

    //     const walletDataForOtherPerson = {
    //       amount: sellFromMoneyChanger ? price : -price,
    //       type: sellFromMoneyChanger ? "دریافت" : "پرداخت",
    //       description: data.description,
    //       dealID: data.dealId ?? transactionForOtherPerson.dealId ?? "",
    //       transactionID: transactionForOtherPerson._id ?? "",
    //     };

    //     updateWalletHandler(
    //       (data.personId || data.partnerPersonId) ?? "",
    //       walletDataForMoneyChanger,
    //     );
    //     updateWalletHandler(
    //       data.secondPersonId ?? "",
    //       walletDataForOtherPerson,
    //     );

    //     dispatch(setTransactionCreated(transactionForMoneyChanger._id));

    //     toast.success("تراکنش با موفقیت ثبت شد");
    //   }

    const transactionsForaPersonAndMoneyChanger =
      data.paymentMethod === "مشتری به مشتری" &&
      (data.reason === "خرید خودروـ صراف" ||
        data.reason === "فروش خودروـ صراف");

    const pairGroupId = crypto.randomUUID();
    const buyFromMoneyChanger = data.reason === "خرید خودروـ صراف";
    // const sellFromMoneyChanger = data.reason === "فروش خودروـ صراف";

    const currentVin =
      selectedDeal?.vehicleSnapshot.vin ?? transactionDataById?.vin ?? "";
    const currentSecondVin =
      selectedSecondDeal?.vehicleSnapshot.vin ??
      transactionDataById?.secondVin ??
      "";

    const transactionDataForMoneyChanger = {
      type: buyFromMoneyChanger ? "دریافت" : "پرداخت",
      reason: buyFromMoneyChanger ? "فروش خودروـ صراف" : "خرید خودروـ صراف",
      transactionDate: data.transactionDate,
      amount: parseFloat(data.amount),
      personId: buyFromMoneyChanger ? data.personId : data.secondPersonId,
      secondPersonId: buyFromMoneyChanger ? data.secondPersonId : data.personId,
      bussinessAccountId: data.bussinessAccountId,
      paymentMethod: data.paymentMethod,

      // dealId:buyFromMoneyChanger ? undefined : data.dealId,
      dealId: undefined,

      vin: buyFromMoneyChanger ? "" : "",

      secondDealId: buyFromMoneyChanger ? data.secondDealId : data.dealId,

      secondVin: buyFromMoneyChanger ? currentSecondVin : currentVin,

      description: data.description || "",
      brokerPersonId: data.brokerPersonId || "",
      providerPersonId: data.providerPersonId || "",
      partnerPersonId: data.partnerPersonId || "",
      partnerShipProfit: `${partnerShip?.firstName} ${partnerShip?.lastName}`,
      partnershipProfitSharePercentage:
        data.partnershipProfitSharePercentage ||
        transactionDataById?.partnershipProfitSharePercentage ||
        partnerShip?.brokerDetails?.currentRates?.purchaseCommissionPercent ||
        partnerShip?.brokerDetails?.currentRates?.saleCommissionPercent ||
        "",
      isBetweenTwoPerson: true,
      pairGroupId,
      role: "saraf",
    };

    // const transactionDataForMoneyChangerr = {
    //   type: buyFromMoneyChanger ? "دریافت" : "پرداخت",
    //   reason: sellFromMoneyChanger ? "فروش خودروـ صراف" : "خرید خودروـ صراف",
    //   transactionDate: data.transactionDate,
    //   amount: parseFloat(data.amount),
    //   personId: buyFromMoneyChanger ? data.personId : data.secondPersonId,
    //   bussinessAccountId: data.bussinessAccountId,
    //   paymentMethod: data.paymentMethod,
    //   secondPersonId: buyFromMoneyChanger
    //     ? data.secondPersonId
    //     : data.personId,

    //   dealId:buyFromMoneyChanger ? undefined : data.dealId,
    //   vin: buyFromMoneyChanger ? "" : currentVin,
    //   secondDealId: buyFromMoneyChanger ?  data.secondDealId : undefined,
    //   secondVin: buyFromMoneyChanger ? currentSecondVin : "",
    //   description: data.description || "",
    //   brokerPersonId: data.brokerPersonId || "",
    //   providerPersonId: data.providerPersonId || "",
    //   partnerPersonId: data.partnerPersonId || "",
    //   partnerShipProfit: `${partnerShip?.firstName} ${partnerShip?.lastName}`,
    //   partnershipProfitSharePercentage:
    //     data.partnershipProfitSharePercentage ||
    //     transactionDataById?.partnershipProfitSharePercentage ||
    //     partnerShip?.brokerDetails?.currentRates?.purchaseCommissionPercent ||
    //     partnerShip?.brokerDetails?.currentRates?.saleCommissionPercent ||
    //     "",
    //   isBetweenTwoPerson: true,
    //   pairGroupId,
    //   role: "saraf",
    // };

    const transactionForOtherPersonData = {
      type: buyFromMoneyChanger ? "پرداخت" : "دریافت",
      reason: buyFromMoneyChanger ? "خرید خودروـ صراف" : "فروش خودروـ صراف",
      transactionDate: data.transactionDate,
      amount: parseFloat(data.amount),
      personId: buyFromMoneyChanger ? data.secondPersonId : data.personId,
      secondPersonId: buyFromMoneyChanger ? data.personId : data.secondPersonId,
      bussinessAccountId: data.bussinessAccountId,
      paymentMethod: data.paymentMethod,
      dealId: buyFromMoneyChanger
        ? data.secondDealId || undefined
        : data.dealId || undefined,

      vin: buyFromMoneyChanger ? currentSecondVin : currentVin,

      secondDealId: buyFromMoneyChanger ? undefined : undefined,

      // buyFromMoneyChanger ? data.secondDealId : "",

      secondVin: buyFromMoneyChanger ? "" : "",

      description: data.description || "",
      brokerPersonId: data.brokerPersonId || "",
      providerPersonId: data.providerPersonId || "",
      partnerPersonId: data.partnerPersonId || "",
      partnerShipProfit: `${partnerShip?.firstName} ${partnerShip?.lastName}`,
      partnershipProfitSharePercentage:
        data.partnershipProfitSharePercentage ||
        transactionDataById?.partnershipProfitSharePercentage ||
        partnerShip?.brokerDetails?.currentRates?.purchaseCommissionPercent ||
        partnerShip?.brokerDetails?.currentRates?.saleCommissionPercent ||
        "",
      isBetweenTwoPerson: true,
      pairGroupId,
      role: "otherPerson",
    };

    // const transactionForOtherPersonDataa = {
    //   type: buyFromMoneyChanger ? "پرداخت" : "دریافت",
    //   reason: buyFromMoneyChanger ? "خرید خودروـ صراف" : "فروش خودروـ صراف",
    //   transactionDate: data.transactionDate,
    //   amount: parseFloat(data.amount),
    //   personId: sellFromMoneyChanger ? data.personId : data.secondPersonId,
    //   secondPersonId: sellFromMoneyChanger
    //     ? data.secondPersonId
    //     : data.personId,
    //   bussinessAccountId: data.bussinessAccountId,
    //   paymentMethod: data.paymentMethod,

    //   dealId: buyFromMoneyChanger
    //     ? data.secondDealId || undefined
    //     : data.dealId || undefined,

    //   vin: buyFromMoneyChanger ? "" : currentVin,

    //   secondDealId: sellFromMoneyChanger
    //     ? data.secondDealId || undefined
    //     : data.dealId || undefined,

    //   // buyFromMoneyChanger ? data.secondDealId : "",

    //   secondVin: buyFromMoneyChanger ? currentSecondVin : "",

    //   description: data.description || "",
    //   brokerPersonId: data.brokerPersonId || "",
    //   providerPersonId: data.providerPersonId || "",
    //   partnerPersonId: data.partnerPersonId || "",
    //   partnerShipProfit: `${partnerShip?.firstName} ${partnerShip?.lastName}`,
    //   partnershipProfitSharePercentage:
    //     data.partnershipProfitSharePercentage ||
    //     transactionDataById?.partnershipProfitSharePercentage ||
    //     partnerShip?.brokerDetails?.currentRates?.purchaseCommissionPercent ||
    //     partnerShip?.brokerDetails?.currentRates?.saleCommissionPercent ||
    //     "",
    //   isBetweenTwoPerson: true,
    //   pairGroupId,
    //   role: "otherPerson",
    // };

    // const otherPersonData = sellFromMoneyChanger
    //   ? transactionForOtherPersonData
    //   : transactionForOtherPersonDataa;
    // const moneyChangerPersonData = sellFromMoneyChanger
    //   ? transactionDataForMoneyChanger
    //   : transactionDataForMoneyChangerr;

    try {
      if (transactionsForaPersonAndMoneyChanger && mode === "add") {
        const transactionForMoneyChanger = await createTransaction.mutateAsync(
          transactionDataForMoneyChanger,
        );
        const transactionForOtherPerson = await createTransaction.mutateAsync(
          transactionForOtherPersonData,
        );
        queryClient.invalidateQueries({
          queryKey: ["get-transactions-by-deal-id"],
        });

        const price = Number(data.amount);

        const walletDataForMoneyChanger = {
          amount: buyFromMoneyChanger ? price : -price,
          type: buyFromMoneyChanger ? "دریافت" : "پرداخت",
          description: data.description,
          dealID: data.dealId || transactionForMoneyChanger.secondDealId || "",
          transactionID: transactionForMoneyChanger._id || "",
          // moneyChangerId: transactionForMoneyChanger._id || ""
          moneyChangerId: buyFromMoneyChanger
            ? data.personId
            : data.secondPersonId || "",
        };

        const walletDataForOtherPerson = {
          amount: buyFromMoneyChanger ? -price : price,
          type: buyFromMoneyChanger ? "پرداخت" : "دریافت",
          description: data.description,
          // dealID: data.dealId || transactionForOtherPerson.dealId || "",
          // transactionID: transactionForOtherPerson._id ?? "",
          dealID: data.dealId || transactionForMoneyChanger.dealId || "",
          transactionID: transactionForMoneyChanger._id || "",
          // moneyChangerId: transactionForOtherPerson._id || ""
          moneyChangerId: buyFromMoneyChanger
            ? data.secondPersonId
            : data.personId || "",
        };

        // updateWalletHandler(data.personId ?? "", walletDataForMoneyChanger);
        // updateWalletHandler(
        //   data.secondPersonId ?? "",
        //   walletDataForOtherPerson,
        // );

        updateWalletHandler(
          (buyFromMoneyChanger ? data.personId : data.secondPersonId) || "",
          walletDataForMoneyChanger,
        );
        updateWalletHandler(
          (buyFromMoneyChanger ? data.secondPersonId : data.personId) || "",
          walletDataForOtherPerson,
        );

        // dispatch(setTransactionCreated(transactionForMoneyChanger._id));
        dispatch(
          setTransactionCreated(`${transactionForMoneyChanger?._id}788`),
        );

        toast.success("تراکنش با موفقیت ثبت شد");
      } else if (transactionsForaPersonAndMoneyChanger && mode === "edit") {
        const updatedFieldsForMoneyChanger: any = {};
        const updatedOtherPersonDataFields: any = {};

        const hasChanged = (currentVal: any, oldVal: any) => {
          if (currentVal === undefined || currentVal === null) {
            return oldVal !== undefined && oldVal !== null && oldVal !== "";
          }
          if (oldVal === undefined || oldVal === null) {
            return (
              currentVal !== undefined &&
              currentVal !== null &&
              currentVal !== ""
            );
          }
          return currentVal !== oldVal;
        };

        /////////////////////////////////////////////////////
        // const isBuyFromMoneyChanger = data.reason === "خرید خودروـ صراف";
        // const isSellToMoneyChanger = data.reason === "فروش خودروـ صراف";

        const currentSelectedDealVin =
          selectedDeal?.vehicleSnapshot.vin ?? transactionDataById?.vin ?? "";
        const currentSelectedSecondDealVin =
          selectedSecondDeal?.vehicleSnapshot.vin ??
          transactionDataById?.secondVin ??
          "";

        // if (isBuyFromMoneyChanger) {
        //   updatedFieldsForMoneyChanger.dealId = undefined;
        //   updatedFieldsForMoneyChanger.vin = "";
        //   updatedFieldsForMoneyChanger.secondDealId = data.secondDealId;
        //   updatedFieldsForMoneyChanger.secondVin = currentSelectedSecondDealVin;
        // } else if (isSellToMoneyChanger) {
        //   updatedFieldsForMoneyChanger.dealId = data.dealId;
        //   updatedFieldsForMoneyChanger.vin = currentSelectedDealVin;
        //   updatedFieldsForMoneyChanger.secondDealId = "";
        //   updatedFieldsForMoneyChanger.secondVin = "";
        // }
        //  else {
        //   if (data.dealId !== transactionDataById?.dealId) {
        //     updatedFieldsForMoneyChanger.dealId = data.dealId || undefined;
        //   }
        //   if (
        //     (selectedDeal?.vehicleSnapshot.vin ?? transactionDataById?.vin) !==
        //     (transactionDataById?.vin || "")
        //   ) {
        //     updatedFieldsForMoneyChanger.vin = currentSelectedDealVin;
        //   }
        //   if (data.secondDealId !== transactionDataById?.secondDealId) {
        //     updatedFieldsForMoneyChanger.secondDealId = data.secondDealId;
        //   }
        //   if (
        //     (selectedSecondDeal?.vehicleSnapshot.vin ??
        //       transactionDataById?.secondVin) !==
        //     (transactionDataById?.secondVin || "")
        //   ) {
        //     updatedFieldsForMoneyChanger.secondVin =
        //       currentSelectedSecondDealVin;
        //   }
        // }

        // if (isBuyFromMoneyChanger) {
        //   updatedOtherPersonDataFields.dealId = data.dealId; // Or data.secondDealId?

        //   updatedOtherPersonDataFields.dealId = data.dealId;
        //   updatedOtherPersonDataFields.vin = currentSelectedDealVin;
        //   updatedOtherPersonDataFields.secondDealId = "";
        //   updatedOtherPersonDataFields.secondVin = "";
        // } else if (isSellToMoneyChanger) {
        //   updatedOtherPersonDataFields.dealId = "";
        //   updatedOtherPersonDataFields.vin = "";
        //   updatedOtherPersonDataFields.secondDealId = "";
        //   updatedOtherPersonDataFields.secondVin = "";
        // } else {
        //   if (data.dealId !== transactionDataById?.dealId) {
        //     updatedOtherPersonDataFields.dealId = data.dealId || undefined;
        //   }
        //   if (
        //     (selectedDeal?.vehicleSnapshot.vin ?? transactionDataById?.vin) !==
        //     (transactionDataById?.vin || "")
        //   ) {
        //     updatedOtherPersonDataFields.vin = currentSelectedDealVin;
        //   }
        //   if (data.secondDealId !== transactionDataById?.secondDealId) {
        //     updatedOtherPersonDataFields.secondDealId = data.secondDealId;
        //   }
        //   if (
        //     (selectedSecondDeal?.vehicleSnapshot.vin ??
        //       transactionDataById?.secondVin) !==
        //     (transactionDataById?.secondVin || "")
        //   ) {
        //     updatedOtherPersonDataFields.secondVin =
        //       currentSelectedSecondDealVin;
        //   }
        // }

        if (data.type !== transactionDataById?.type) {
          updatedFieldsForMoneyChanger.type = buyFromMoneyChanger
            ? "دریافت"
            : "پرداخت";
          updatedOtherPersonDataFields.type = buyFromMoneyChanger
            ? "پرداخت"
            : "دریافت";
        }
        if (data.reason !== transactionDataById?.reason) {
          updatedFieldsForMoneyChanger.reason = buyFromMoneyChanger
            ? "فروش خودروـ صراف"
            : "خرید خودروـ صراف";
          updatedOtherPersonDataFields.reason = buyFromMoneyChanger
            ? "خرید خودروـ صراف"
            : "فروش خودروـ صراف";
        }

        if (data.personId !== transactionDataById?.personId) {
          updatedFieldsForMoneyChanger.personId = buyFromMoneyChanger
            ? data.personId
            : data.secondPersonId;
          updatedOtherPersonDataFields.personId = buyFromMoneyChanger
            ? data.secondPersonId
            : data.personId;
        }
        if (data.secondPersonId !== transactionDataById?.secondPersonId) {
          updatedFieldsForMoneyChanger.secondPersonId = buyFromMoneyChanger
            ? data.secondPersonId
            : data.personId;
          updatedOtherPersonDataFields.secondPersonId = buyFromMoneyChanger
            ? data.personId
            : data.secondPersonId;
        }

        if (data.dealId !== transactionDataById?.dealId) {
          updatedOtherPersonDataFields.dealId = buyFromMoneyChanger
            ? data.secondDealId || undefined
            : data.dealId || undefined;
          updatedOtherPersonDataFields.vin = buyFromMoneyChanger
            ? currentSecondVin
            : currentVin;

          updatedFieldsForMoneyChanger.dealId = undefined;
          updatedFieldsForMoneyChanger.vin = buyFromMoneyChanger ? "" : "";
        }
        if (data.secondDealId !== transactionDataById?.secondDealId) {
          updatedOtherPersonDataFields.secondDealId = buyFromMoneyChanger
            ? undefined
            : undefined;
          updatedOtherPersonDataFields.secondVin = buyFromMoneyChanger
            ? ""
            : "";

          updatedFieldsForMoneyChanger.secondDealId = buyFromMoneyChanger
            ? data.secondDealId
            : data.dealId;
          updatedFieldsForMoneyChanger.secondVin = buyFromMoneyChanger
            ? currentSecondVin
            : currentVin;
        }

        if (data.transactionDate !== transactionDataById?.transactionDate) {
          updatedFieldsForMoneyChanger.transactionDate = data.transactionDate;
          updatedOtherPersonDataFields.transactionDate = data.transactionDate;
        }
        if (data?.amount !== transactionDataById?.amount.toString()) {
          updatedFieldsForMoneyChanger.amount = data?.amount;
          updatedOtherPersonDataFields.amount = data?.amount;
        }
        if (data.description !== (transactionDataById?.description || "")) {
          updatedFieldsForMoneyChanger.description = data.description || "";
          updatedOtherPersonDataFields.description = data.description || "";
        }

        if (
          data.bussinessAccountId !== transactionDataById?.bussinessAccountId
        ) {
          updatedFieldsForMoneyChanger.bussinessAccountId =
            data.bussinessAccountId;
          updatedOtherPersonDataFields.bussinessAccountId =
            data.bussinessAccountId;
        }
        if (data.paymentMethod !== transactionDataById?.paymentMethod) {
          updatedFieldsForMoneyChanger.paymentMethod = data.paymentMethod;
          updatedOtherPersonDataFields.paymentMethod = data.paymentMethod;
        }

        // --- 3. Perform Updates ---

        // Update Money Changer (Party 1) Transaction
        const transaction = await updateTransaction.mutateAsync({
          id: transactionId ?? "",
          data:
            transactionDataById?.role === "saraf"
              ? updatedFieldsForMoneyChanger
              : updatedOtherPersonDataFields,
        });
        dispatch(setTransactionCreated(`${transaction._id}78`));

        // Update Other Person (Party 2) Transaction if it exists and is part of the pair
        if (
          transactionDataById?.isBetweenTwoPerson &&
          transactionDataById?.pairGroupId
        ) {
          const similarTransactions = allTransactions?.filter(
            (t) =>
              t.pairGroupId === transactionDataById.pairGroupId &&
              t._id !== transactionId,
          );
          if (similarTransactions && similarTransactions.length > 0) {
            await Promise.all(
              similarTransactions.map(async (t) => {
                if (t?._id) {
                  try {
                    const updatedSimilarTransaction =
                      await updateTransaction.mutateAsync({
                        id: t._id,
                        data:
                          t.role === "saraf"
                            ? updatedFieldsForMoneyChanger
                            : updatedOtherPersonDataFields,
                      });
                    return updatedSimilarTransaction;
                  } catch (error) {
                    console.error(
                      `Error updating transaction ${t._id}:`,
                      error,
                    );
                    throw error;
                  }
                }
                return null;
              }),
            );
          }
        }

        toast.success("تراکنش با موفقیت به‌روزرسانی شد");

        // --- 4. Update Wallets ---
        const newPrice = Number(data.amount);

        // const primaryPersonId = data.personId || "";
        // const secondaryPersonId = data.secondPersonId || "";

        // const primaryWalletAmount = (data.reason === "خرید خودروـ صراف" || data.reason === "فروش خودرو-صراف")
        //     ? -newPrice
        //     : newPrice;

        // const isSellToMoneyChangerLogic = data.reason === "فروش خودرو-صراف";

        // updateWalletHandler(primaryPersonId, {
        //   amount: isSellToMoneyChangerLogic ? newPrice : -newPrice,
        //   type: isSellToMoneyChangerLogic ? "دریافت" : "پرداخت",
        //   description: data.description,
        //   dealID: data.dealId ?? transaction.dealId ?? "",
        //   transactionID: transaction._id ?? "",
        // });

        // updateWalletHandler(secondaryPersonId, {
        //   amount: isSellToMoneyChangerLogic ? -newPrice : newPrice,
        //   type: isSellToMoneyChangerLogic ? "پرداخت" : "دریافت",
        //   description: data.description,
        //   dealID: data.dealId ?? transaction.dealId ?? "",
        //   transactionID: transaction._id ?? "",
        // });

        const walletDataForMoneyChanger = {
          amount: buyFromMoneyChanger ? newPrice : -newPrice,
          type: buyFromMoneyChanger ? "دریافت" : "پرداخت",
          description: data.description,
          dealID: dealId || data.dealId || transaction.secondDealId || "",
          transactionID:
            transactionDataById?._id || transactionId || transaction._id || "",
          // moneyChangerId: transactionId || ""
          moneyChangerId: buyFromMoneyChanger
            ? data.personId
            : data.secondPersonId || "",
        };

        const walletDataForOtherPerson = {
          amount: buyFromMoneyChanger ? -newPrice : newPrice,
          type: buyFromMoneyChanger ? "پرداخت" : "دریافت",
          description: data.description,
          // dealID: data.dealId || transactionForOtherPerson.dealId || "",
          // transactionID: transactionForOtherPerson._id ?? "",
          dealID: dealId || data.dealId || transaction.dealId || "",
          transactionID:
            transactionDataById?._id || transactionId || transaction._id || "",
          // moneyChangerId: transactionId || "",
          moneyChangerId: buyFromMoneyChanger
            ? data.secondPersonId
            : data.personId || "",
        };

        updateWalletHandler(
          (buyFromMoneyChanger ? data.personId : data.secondPersonId) || "",
          walletDataForMoneyChanger,
        );
        updateWalletHandler(
          (buyFromMoneyChanger ? data.secondPersonId : data.personId) || "",
          walletDataForOtherPerson,
        );

        // --- 5. Handle Person ID Changes (Wallet Transfer) ---
        // const oldMoneyChangerId = (buyFromMoneyChanger && transactionDataById) ? transactionDataById?.personId : transactionDataById?.secondPersonId
      }

      // else if (transactionsForaPersonAndMoneyChanger && mode === "edit") {
      //   const updatedFieldsForMoneyChanger: any = {};
      //   const updatedOtherPersonDataFields: any = {};

      //   if (data.type !== transactionDataById?.type) {
      //     updatedFields.type = data.type;
      //     updatedSecondDataFields.type = data.type;
      //   }
      //   if (data.reason !== transactionDataById?.reason) {
      //     updatedFields.reason = data.reason;
      //     updatedSecondDataFields.reason = data.reason;
      //   }
      //   if (data.transactionDate !== transactionDataById?.transactionDate) {
      //     updatedFields.transactionDate = data.transactionDate;
      //     updatedSecondDataFields.transactionDate = data.transactionDate;
      //   }
      //   if (data?.amount !== transactionDataById?.amount.toString()) {
      //     updatedFields.amount = data?.amount;
      //     updatedSecondDataFields.amount = data?.amount;
      //   }
      //   if (data.personId !== transactionDataById?.personId) {
      //     updatedFields.personId = data.personId;
      //   }
      //   if (data.personId !== transactionDataById?.secondPersonId) {
      //     updatedSecondDataFields.personId = data.secondPersonId;
      //   }
      //   if (data.secondPersonId !== transactionDataById?.secondPersonId) {
      //     updatedFields.secondPersonId = data.secondPersonId;
      //     updatedSecondDataFields.secondPersonId = data.secondPersonId;
      //   }
      //   if (data.secondDealId !== transactionDataById?.secondDealId) {
      //     updatedFields.secondDealId = data.secondDealId;
      //     updatedSecondDataFields.secondDealId = data.secondDealId;
      //   }
      //   if (
      //     data.bussinessAccountId !== transactionDataById?.bussinessAccountId
      //   ) {
      //     updatedFields.bussinessAccountId = data.bussinessAccountId;
      //     updatedSecondDataFields.bussinessAccountId = data.bussinessAccountId;
      //   }
      //   if (data.paymentMethod !== transactionDataById?.paymentMethod) {
      //     updatedFields.paymentMethod = data.paymentMethod;
      //     updatedSecondDataFields.paymentMethod = data.paymentMethod;
      //   }
      //   if (data.dealId !== (transactionDataById?.dealId || undefined)) {
      //     updatedFields.dealId = data.dealId || undefined;
      //   }
      //   if (data.dealId !== (transactionDataById?.secondDealId || undefined)) {
      //     updatedSecondDataFields.dealId = data.secondDealId || undefined;
      //   }
      //   if (
      //     (selectedDeal?.vehicleSnapshot.vin ?? transactionDataById?.vin) !==
      //     (transactionDataById?.vin || "")
      //   ) {
      //     updatedFields.vin =
      //       (selectedDeal?.vehicleSnapshot.vin ?? transactionDataById?.vin) ||
      //       "";
      //     updatedSecondDataFields.vin =
      //       (selectedDeal?.vehicleSnapshot.vin ?? transactionDataById?.vin) ||
      //       "";
      //   }
      //   if (
      //     (selectedSecondDeal?.vehicleSnapshot.vin ??
      //       transactionDataById?.secondVin) !==
      //     (transactionDataById?.secondVin || "")
      //   ) {
      //     updatedFields.secondVin =
      //       (selectedSecondDeal?.vehicleSnapshot.vin ??
      //         transactionDataById?.secondVin) ||
      //       "";
      //     updatedSecondDataFields.secondVin =
      //       (selectedSecondDeal?.vehicleSnapshot.vin ??
      //         transactionDataById?.secondVin) ||
      //       "";
      //   }
      //   if (data.description !== (transactionDataById?.description || "")) {
      //     updatedFields.description = data.description || "";
      //     updatedSecondDataFields.description = data.description || "";
      //   }

      //   const transaction = await updateTransaction.mutateAsync({
      //     id: transactionId ?? "",
      //     data: updatedFields,
      //   });
      //   dispatch(setTransactionCreated(transaction._id));

      //   if (
      //     transactionDataById?.isBetweenTwoPerson &&
      //     transactionDataById?.pairGroupId
      //   ) {
      //     const similarTransactions = allTransactions?.filter(
      //       (t) =>
      //         t.pairGroupId === transactionDataById.pairGroupId &&
      //         t._id !== transactionId,
      //     );

      //     if (similarTransactions && similarTransactions.length > 0) {
      //       await Promise.all(
      //         similarTransactions.map(async (t) => {
      //           if (t?._id) {
      //             try {
      //               const updatedSimilarTransaction =
      //                 await updateTransaction.mutateAsync({
      //                   id: t._id,
      //                   data: updatedSecondDataFields,
      //                 });
      //               return updatedSimilarTransaction;
      //             } catch (error) {
      //               console.error(
      //                 `Error updating transaction ${t._id}:`,
      //                 error,
      //               );
      //               throw error;
      //             }
      //           }
      //           return null;
      //         }),
      //       );
      //     }
      //   }

      //   toast.success("تراکنش با موفقیت به‌روزرسانی شد");

      //   const newPrice = Number(data.amount);
      //   // const newSigned = isPartnershipReason
      //   //   ? data.type === "دریافت"
      //   //     ? newPrice
      //   //     : -newPrice
      //   //   : data.type === "پرداخت"
      //   //     ? -newPrice
      //   //     : newPrice;

      //   updateWalletHandler((data.personId || data.partnerPersonId) ?? "", {
      //     amount: newPrice,
      //     type: `دریافت ${data.reason}` || data.type,
      //     description: data.description,
      //     dealID: data.dealId ?? transaction.dealId ?? "",
      //     transactionID: transaction._id ?? "",
      //   });
      //   updateWalletHandler(data.secondPersonId ?? "", {
      //     amount: -newPrice,
      //     type: `پرداخت ${data.reason}` || data.type,
      //     description: data.description,
      //     dealID: data.dealId ?? transaction.dealId ?? "",
      //     transactionID: transaction._id ?? "",
      //   });
      //   // if (data.dealId && transactionReason === "سایر هزینه‌ها") {
      //   //   if (selectedDealIdInfo?.[0]?.purchaseBroker?.personId && newSigned) {
      //   //     updateWalletHandler(
      //   //       selectedDealIdInfo?.[0]?.purchaseBroker?.personId,
      //   //       {
      //   //         amount: newSigned,
      //   //         type: `${data.type} ${data.reason}` || data.type,
      //   //         description: data.description,
      //   //         dealID: data.dealId ?? transaction.dealId ?? "",
      //   //         transactionID: transaction._id ?? "",
      //   //       },
      //   //     );
      //   //   }
      //   //   if (selectedDealIdInfo?.[0]?.saleBroker?.personId && newSigned) {
      //   //     updateWalletHandler(selectedDealIdInfo?.[0]?.saleBroker?.personId, {
      //   //       amount: newSigned,
      //   //       type: `${data.type} ${data.reason}` || data.type,
      //   //       description: data.description,
      //   //       dealID: data.dealId ?? transaction.dealId ?? "",
      //   //       transactionID: transaction._id ?? "",
      //   //     });
      //   //   }
      //   // }

      //   const oldPersonId =
      //     transactionDataById?.personId || transactionDataById?.partnerPersonId;
      //   const newPersonId = data?.personId || data?.partnerPersonId;

      //   const oldSecondPersonId = transactionDataById?.secondPersonId;
      //   const newSecondPersonId = data.secondPersonId;

      //   const walletUpdates: Array<{
      //     oldPersonId: string;
      //     newPersonId: string;
      //     amount: number;
      //     type: string;
      //     description: string;
      //     dealId?: string;
      //     transactionId: string;
      //     reason: "provider" | "broker" | "financier" | "person";
      //   }> = [];

      //   if (oldPersonId !== newPersonId && oldPersonId && newPersonId) {
      //     walletUpdates.push({
      //       oldPersonId,
      //       newPersonId,
      //       amount: newPrice,
      //       type: "دریافت",
      //       description: data.description || `تغییر طرف حساب - ${data.reason}`,
      //       dealId: data.dealId,
      //       transactionId: transactionId ?? "",
      //       reason: "person",
      //     });
      //   }

      //   if (
      //     oldSecondPersonId !== newSecondPersonId &&
      //     oldSecondPersonId &&
      //     newSecondPersonId
      //   ) {
      //     walletUpdates.push({
      //       oldPersonId: oldSecondPersonId,
      //       newPersonId: newSecondPersonId,
      //       amount: -newPrice,
      //       type: "پرداخت",
      //       description:
      //         data.description || `تغییر طرف حساب دوم - ${data.reason}`,
      //       dealId: data.dealId,
      //       transactionId: transactionId ?? "",
      //       reason: "person",
      //     });
      //   }

      //   for (const update of walletUpdates) {
      //     try {
      //       if (
      //         (oldPersonId !== newPersonId && oldPersonId && newPersonId) ||
      //         (oldSecondPersonId !== newSecondPersonId &&
      //           oldSecondPersonId &&
      //           newSecondPersonId)
      //       ) {
      //         await updateWalletTransfer(update);
      //       }
      //     } catch (walletError) {
      //       console.error("Error updating wallet:", walletError);
      //     }
      //   }
      // }
    } catch (error) {
      console.log("🚀 ~ twoPersonTransactionHandler ~ error:", error);
    }
  };

  const twoPersonTransactionsHandler = async (
    data: transactionChequeSchemaType,
  ) => {
    const twoPersonTransactions =
      data.paymentMethod === "مشتری به مشتری" &&
      (data.personId || data.partnerPersonId) &&
      data.secondPersonId;

    // if (twoPersonTransactions) return;

    // const isPartnershipReason =
    //   (data.type === "دریافت" && data.reason === "سرمایه گذاری") ||
    //   (data.type === "پرداخت" &&
    //     (data.reason === "اصل سرمایه" || data.reason === "سود سرمایه"));

    const pairGroupId = crypto.randomUUID();

    const transActionDataVin =
      selectedDeal?.vehicleSnapshot.vin ?? transactionDataById?.vin ?? "";
    const transActionDataSecondVin =
      selectedSecondDeal?.vehicleSnapshot.vin ??
      transactionDataById?.secondVin ??
      "";

    const transactionData = {
      type: "دریافت",
      reason: data.personId ? "فروش خودرو" : "سرمایه گذاری",
      transactionDate: data.transactionDate,
      amount: parseFloat(data.amount),
      bussinessAccountId: data.bussinessAccountId,
      paymentMethod: data.paymentMethod,
      personId:
        transactionDataById?.role === "first"
          ? data?.personId
          : transactionDataById?.role === "second"
            ? data?.secondPersonId
            : data?.personId,
      secondPersonId:
        transactionDataById?.role === "first"
          ? data?.secondPersonId
          : transactionDataById?.role === "second"
            ? data?.personId
            : data?.secondPersonId,
      secondDealId:
        transactionDataById?.role === "first"
          ? data?.secondDealId
          : transactionDataById?.role === "second"
            ? data?.dealId
            : data?.secondDealId,
      dealId:
        transactionDataById?.role === "first"
          ? data?.dealId
          : transactionDataById?.role === "second"
            ? data?.secondDealId
            : data?.dealId,
      vin:
        transactionDataById?.role === "first"
          ? transActionDataVin
          : transactionDataById?.role === "second"
            ? transActionDataSecondVin
            : transActionDataVin,
      secondVin:
        transactionDataById?.role === "first"
          ? transActionDataSecondVin
          : transactionDataById?.role === "second"
            ? transActionDataVin
            : transActionDataSecondVin,
      description: data.description || "",
      brokerPersonId: data.brokerPersonId || "",
      providerPersonId: data.providerPersonId || "",
      partnerPersonId: data.partnerPersonId || "",
      partnerShipProfit: `${partnerShip?.firstName} ${partnerShip?.lastName}`,
      partnershipProfitSharePercentage:
        data.partnershipProfitSharePercentage ||
        transactionDataById?.partnershipProfitSharePercentage ||
        partnerShip?.brokerDetails?.currentRates?.purchaseCommissionPercent ||
        partnerShip?.brokerDetails?.currentRates?.saleCommissionPercent ||
        "",
      role: "first",
      isBetweenTwoPerson: true,
      pairGroupId,
      profitState: data?.profitState ?? "",
    };

    const transactionSecondDealIdDataVin =
      selectedSecondDeal?.vehicleSnapshot.vin ??
      transactionDataById?.secondVin ??
      "";
    const transactionSecondDealIdDataSecondVin =
      selectedSecondDeal?.vehicleSnapshot.vin ??
      transactionDataById?.secondVin ??
      "";
    const transactionSecondDealIdData = {
      type: "پرداخت",
      reason: data.personId ? "خرید خودرو" : "سرمایه گذاری",
      transactionDate: data.transactionDate,
      amount: parseFloat(data.amount),

      personId:
        transactionDataById?.role === "first"
          ? data?.secondPersonId
          : transactionDataById?.role === "second"
            ? data?.personId
            : data?.secondPersonId,
      secondPersonId:
        transactionDataById?.role === "first"
          ? data?.personId
          : transactionDataById?.role === "second"
            ? data?.secondPersonId
            : data?.personId,
      secondDealId:
        transactionDataById?.role === "first"
          ? data?.dealId
          : transactionDataById?.role === "second"
            ? data?.secondDealId
            : data?.dealId,
      dealId:
        transactionDataById?.role === "first"
          ? data?.secondDealId
          : transactionDataById?.role === "second"
            ? data?.dealId
            : data?.secondDealId,
      vin:
        transactionDataById?.role === "first"
          ? transactionSecondDealIdDataSecondVin
          : transactionDataById?.role === "second"
            ? transactionSecondDealIdDataVin
            : transactionSecondDealIdDataSecondVin,
      secondVin:
        transactionDataById?.role === "first"
          ? transactionSecondDealIdDataVin
          : transactionDataById?.role === "second"
            ? transactionSecondDealIdDataSecondVin
            : transactionSecondDealIdDataVin,

      // personId: data.secondPersonId,
      // secondPersonId: data.personId,
      // secondDealId: data.dealId,
      bussinessAccountId: data.bussinessAccountId,
      paymentMethod: data.paymentMethod,
      // dealId: data.secondDealId || undefined,
      // vin:
      //   selectedSecondDeal?.vehicleSnapshot.vin ??
      //   transactionDataById?.secondVin ??
      //   "",
      description: data.description || "",
      brokerPersonId: data.brokerPersonId || "",
      providerPersonId: data.providerPersonId || "",
      partnerPersonId: data.partnerPersonId || "",
      partnerShipProfit: `${partnerShip?.firstName} ${partnerShip?.lastName}`,
      partnershipProfitSharePercentage:
        data.partnershipProfitSharePercentage ||
        transactionDataById?.partnershipProfitSharePercentage ||
        partnerShip?.brokerDetails?.currentRates?.purchaseCommissionPercent ||
        partnerShip?.brokerDetails?.currentRates?.saleCommissionPercent ||
        "",
      role: "second",
      isBetweenTwoPerson: true,
      pairGroupId,
      profitState: data?.profitState ?? "",
    };

    try {
      if (twoPersonTransactions && mode === "add") {
        const transaction =
          await createTransaction.mutateAsync(transactionData);

        const secondPersonTransaction = await createTransaction.mutateAsync(
          transactionSecondDealIdData,
        );

        queryClient.invalidateQueries({
          queryKey: ["get-transactions-by-deal-id"],
        });

        const price = Number(data.amount);

        // const walletAmount = isPartnershipReason
        //   ? data.type === "دریافت"
        //     ? price
        //     : -price
        //   : data.type === "پرداخت"
        //     ? -price
        //     : price;

        const walletData = {
          amount: price,
          type: "دریافت",
          description: data.description,
          dealID: data.dealId ?? transaction.dealId ?? "",
          transactionID: transaction._id ?? "",
        };

        const walletDataForSecondPerson = {
          amount: -price,
          type: "پرداخت",
          description: data.description,
          dealID: data.dealId ?? transaction.dealId ?? "",
          transactionID: transaction._id ?? "",
        };

        updateWalletHandler(
          (data.personId || data.partnerPersonId) ?? "",
          walletData,
        );
        updateWalletHandler(
          data.secondPersonId ?? "",
          walletDataForSecondPerson,
        );

        // dispatch(setTransactionCreated(transaction._id));
        dispatch(setTransactionCreated(`${transaction?._id}78`));

        toast.success("تراکنش با موفقیت ثبت شد");
      } else if (twoPersonTransactions && mode === "edit") {
        // const updatedFields: any = {};
        // const updatedSecondDataFields: any = {};

        // if (data.type !== transactionDataById?.type) {
        //   updatedFields.type = data.type;
        //   updatedSecondDataFields.type = data.type;
        // }
        // if (data.reason !== transactionDataById?.reason) {
        //   updatedFields.reason = data.reason;
        //   updatedSecondDataFields.reason = data.reason;
        // }
        // if (data.profitState !== transactionDataById?.profitState) {
        //   updatedFields.profitState = data.profitState;
        //   updatedSecondDataFields.profitState = data.profitState;
        // }
        // if (data.transactionDate !== transactionDataById?.transactionDate) {
        //   updatedFields.transactionDate = data.transactionDate;
        //   updatedSecondDataFields.transactionDate = data.transactionDate;
        // }
        // if (data?.amount !== transactionDataById?.amount.toString()) {
        //   updatedFields.amount = data?.amount;
        //   updatedSecondDataFields.amount = data?.amount;
        // }
        // if (data.personId !== transactionDataById?.personId) {
        //   updatedFields.personId = data.personId;
        // }
        // if (data.personId !== transactionDataById?.secondPersonId) {
        //   updatedSecondDataFields.personId = data.secondPersonId;
        // }
        // if (data.secondPersonId !== transactionDataById?.secondPersonId) {
        //   updatedFields.secondPersonId = data.secondPersonId;
        //   updatedSecondDataFields.secondPersonId = data.secondPersonId;
        // }
        // if (data.secondDealId !== transactionDataById?.secondDealId) {
        //   updatedFields.secondDealId = data.secondDealId;
        //   updatedSecondDataFields.secondDealId = data.secondDealId;
        // }
        // if (
        //   data.bussinessAccountId !== transactionDataById?.bussinessAccountId
        // ) {
        //   updatedFields.bussinessAccountId = data.bussinessAccountId;
        //   updatedSecondDataFields.bussinessAccountId = data.bussinessAccountId;
        // }
        // if (data.paymentMethod !== transactionDataById?.paymentMethod) {
        //   updatedFields.paymentMethod = data.paymentMethod;
        //   updatedSecondDataFields.paymentMethod = data.paymentMethod;
        // }
        // if (data.dealId !== (transactionDataById?.dealId || undefined)) {
        //   updatedFields.dealId = data.dealId || undefined;
        // }
        // if (data.dealId !== (transactionDataById?.secondDealId || undefined)) {
        //   updatedSecondDataFields.dealId = data.secondDealId || undefined;
        // }
        // if (
        //   (selectedDeal?.vehicleSnapshot.vin ?? transactionDataById?.vin) !==
        //   (transactionDataById?.vin || "")
        // ) {
        //   updatedFields.vin =
        //     (selectedDeal?.vehicleSnapshot.vin ?? transactionDataById?.vin) ||
        //     "";
        //   updatedSecondDataFields.vin =
        //     (selectedDeal?.vehicleSnapshot.vin ?? transactionDataById?.vin) ||
        //     "";
        // }
        // if (
        //   (selectedSecondDeal?.vehicleSnapshot.vin ??
        //     transactionDataById?.secondVin) !==
        //   (transactionDataById?.secondVin || "")
        // ) {
        //   updatedFields.secondVin =
        //     (selectedSecondDeal?.vehicleSnapshot.vin ??
        //       transactionDataById?.secondVin) ||
        //     "";
        //   updatedSecondDataFields.secondVin =
        //     (selectedSecondDeal?.vehicleSnapshot.vin ??
        //       transactionDataById?.secondVin) ||
        //     "";
        // }
        // if (
        //   transactionData.description !==
        //   (transactionDataById?.description || "")
        // ) {
        //   updatedFields.description = transactionData.description || "";
        //   updatedSecondDataFields.description =
        //     transactionData.description || "";
        // }
        // if (
        //   transactionData.brokerPersonId !==
        //   (transactionDataById?.brokerPersonId || "")
        // ) {
        //   updatedFields.brokerPersonId = transactionData.brokerPersonId || "";
        //   updatedSecondDataFields.brokerPersonId =
        //     transactionData.brokerPersonId || "";
        // }
        // if (
        //   transactionData.providerPersonId !==
        //   (transactionDataById?.providerPersonId || "")
        // ) {
        //   updatedFields.providerPersonId =
        //     transactionData.providerPersonId || "";
        //   updatedSecondDataFields.providerPersonId =
        //     transactionData.providerPersonId || "";
        // }
        // if (
        //   transactionData.partnerPersonId !==
        //   (transactionDataById?.partnerPersonId || "")
        // ) {
        //   updatedFields.partnerPersonId = transactionData.partnerPersonId || "";
        //   updatedSecondDataFields.partnerPersonId =
        //     transactionData.partnerPersonId || "";
        // }
        // if (
        //   transactionData.partnerShipProfit !==
        //     transactionDataById?.partnerShipProfit ||
        //   `${partnerShip?.firstName} ${partnerShip?.lastName}` !==
        //     transactionDataById?.partnerShipProfit
        // ) {
        //   updatedFields.partnerShipProfit =
        //     `${partnerShip?.firstName} ${partnerShip?.lastName}` ||
        //     transactionData.partnerShipProfit ||
        //     "";
        //   updatedSecondDataFields.partnerShipProfit =
        //     `${partnerShip?.firstName} ${partnerShip?.lastName}` ||
        //     transactionData.partnerShipProfit ||
        //     "";
        // }
        // if (
        //   transactionData.partnershipProfitSharePercentage !==
        //     transactionDataById?.partnershipProfitSharePercentage ||
        //   data.partnershipProfitSharePercentage !==
        //     transactionDataById?.partnershipProfitSharePercentage
        // ) {
        //   updatedFields.partnershipProfitSharePercentage =
        //     data.partnershipProfitSharePercentage ||
        //     transactionData.partnershipProfitSharePercentage ||
        //     "";
        //   updatedSecondDataFields.partnershipProfitSharePercentage =
        //     data.partnershipProfitSharePercentage ||
        //     transactionData.partnershipProfitSharePercentage ||
        //     "";
        // }

        const transaction = await updateTransaction.mutateAsync({
          id: transactionId ?? "",
          data:
            transactionDataById?.role === "first"
              ? transactionData
              : transactionSecondDealIdData,
        });
        // dispatch(setTransactionCreated(transaction._id));
        dispatch(setTransactionCreated(`${transaction._id}768`));

        if (
          transactionDataById?.isBetweenTwoPerson &&
          transactionDataById?.pairGroupId
        ) {
          const similarTransactions = allTransactions?.filter(
            (t) =>
              t.pairGroupId === transactionDataById.pairGroupId &&
              t._id !== transactionId,
          );

          if (similarTransactions && similarTransactions.length > 0) {
            await Promise.all(
              similarTransactions.map(async (t) => {
                if (t?._id) {
                  try {
                    const updatedSimilarTransaction =
                      await updateTransaction.mutateAsync({
                        id: t._id,
                        data:
                          t?.role === "first"
                            ? transactionData
                            : transactionSecondDealIdData,
                      });
                    return updatedSimilarTransaction;
                  } catch (error) {
                    console.error(
                      `Error updating transaction ${t._id}:`,
                      error,
                    );
                    throw error;
                  }
                }
                return null;
              }),
            );
          }
        }

        toast.success("تراکنش با موفقیت به‌روزرسانی شد");

        const newPrice = Number(data.amount);
        // const newSigned = isPartnershipReason
        //   ? data.type === "دریافت"
        //     ? newPrice
        //     : -newPrice
        //   : data.type === "پرداخت"
        //     ? -newPrice
        //     : newPrice;

        updateWalletHandler((data.personId || data.partnerPersonId) ?? "", {
          amount: newPrice,
          type: `دریافت ${data.reason}` || data.type,
          description: data.description,
          dealID: data.dealId ?? transaction.dealId ?? "",
          transactionID: transaction._id ?? "",
        });
        updateWalletHandler(data.secondPersonId ?? "", {
          amount: -newPrice,
          type: `پرداخت ${data.reason}` || data.type,
          description: data.description,
          dealID: data.dealId ?? transaction.dealId ?? "",
          transactionID: transaction._id ?? "",
        });
        // if (data.dealId && transactionReason === "سایر هزینه‌ها") {
        //   if (selectedDealIdInfo?.[0]?.purchaseBroker?.personId && newSigned) {
        //     updateWalletHandler(
        //       selectedDealIdInfo?.[0]?.purchaseBroker?.personId,
        //       {
        //         amount: newSigned,
        //         type: `${data.type} ${data.reason}` || data.type,
        //         description: data.description,
        //         dealID: data.dealId ?? transaction.dealId ?? "",
        //         transactionID: transaction._id ?? "",
        //       },
        //     );
        //   }
        //   if (selectedDealIdInfo?.[0]?.saleBroker?.personId && newSigned) {
        //     updateWalletHandler(selectedDealIdInfo?.[0]?.saleBroker?.personId, {
        //       amount: newSigned,
        //       type: `${data.type} ${data.reason}` || data.type,
        //       description: data.description,
        //       dealID: data.dealId ?? transaction.dealId ?? "",
        //       transactionID: transaction._id ?? "",
        //     });
        //   }
        // }

        const oldPersonId =
          transactionDataById?.personId || transactionDataById?.partnerPersonId;
        const newPersonId = data?.personId || data?.partnerPersonId;

        const oldSecondPersonId = transactionDataById?.secondPersonId;
        const newSecondPersonId = data.secondPersonId;

        const walletUpdates: Array<{
          oldPersonId: string;
          newPersonId: string;
          amount: number;
          type: string;
          description: string;
          dealId?: string;
          transactionId: string;
          reason: "provider" | "broker" | "financier" | "person";
        }> = [];

        if (oldPersonId !== newPersonId && oldPersonId && newPersonId) {
          walletUpdates.push({
            oldPersonId,
            newPersonId,
            amount: newPrice,
            type: "دریافت",
            description: data.description || `تغییر طرف حساب - ${data.reason}`,
            dealId: data.dealId,
            transactionId: transactionId ?? "",
            reason: "person",
          });
        }

        if (
          oldSecondPersonId !== newSecondPersonId &&
          oldSecondPersonId &&
          newSecondPersonId
        ) {
          walletUpdates.push({
            oldPersonId: oldSecondPersonId,
            newPersonId: newSecondPersonId,
            amount: -newPrice,
            type: "پرداخت",
            description:
              data.description || `تغییر طرف حساب دوم - ${data.reason}`,
            dealId: data.dealId,
            transactionId: transactionId ?? "",
            reason: "person",
          });
        }

        for (const update of walletUpdates) {
          try {
            if (
              (oldPersonId !== newPersonId && oldPersonId && newPersonId) ||
              (oldSecondPersonId !== newSecondPersonId &&
                oldSecondPersonId &&
                newSecondPersonId)
            ) {
              await updateWalletTransfer(update);
            }
          } catch (walletError) {
            console.error("Error updating wallet:", walletError);
          }
        }
      }

      dispatch(setTransactionCreated(`${transactionId || ""}768`));
    } catch (error) {
      console.log("🚀 ~ twoPersonTransactionHandler ~ error:", error);
    }
  };

  const chequeHandler = async (
    data: transactionChequeSchemaType,
    transaction: ITransactionNew,
  ) => {
    // if (data.paymentMethod === "چک" && showChequeFields) return;
    if (data.paymentMethod !== "چک") return;
    try {
      // If payment method is cheque, create cheque record
      const payer =
        showPayer && data.chequePayerPersonId
          ? allPeople?.find(
              (p) => p._id?.toString() === data.chequePayerPersonId,
            )
          : null;

      const payee =
        showPayee && data.chequePayeePersonId
          ? allPeople?.find(
              (p) => p._id?.toString() === data.chequePayeePersonId,
            )
          : null;

      const customer =
        showPayer && data.chequeCustomerPersonId
          ? allPeople?.find(
              (p) => p._id?.toString() === data.chequeCustomerPersonId,
            )
          : null;

      const chequeData = {
        chequeNumber: data.chequeNumber?.trim() || "",
        chequeSerial: data.chequeSerial?.trim() || "",
        bankName: data.chequeBankName || "",
        branchName: data.chequeBranchName || "",
        vin:
          selectedDeal?.vehicleSnapshot?.vin || transactionDataById?.vin || "",
        issueDate: data.chequeIssueDate || "",
        dueDate: data.chequeDueDate || "",
        amount: parseFloat(data.amount),
        type: data.chequeType === "دریافتی" ? "received" : "issued",
        status: data.chequeStatus || "در جریان",
        sayadiID: data.sayadiID ?? "",
        description: data.chequeDescription,
        reason: data.reason || selectedTransactionChequeInfo?.reason || "",
        profitState: data?.profitState || "",
        customer: customer
          ? {
              personId: customer._id?.toString() || "",
              fullName: `${customer} ${customer.lastName}`,
              nationalId: customer.nationalId?.toString() || "",
            }
          : {
              personId: "",
              fullName: "",
              nationalId: "",
            },
        payer: payer
          ? {
              personId: payer._id?.toString() || "",
              fullName: `${payer.firstName} ${payer.lastName}`,
              nationalId: payer.nationalId?.toString() || "",
            }
          : {
              personId: "",
              fullName: "",
              nationalId: "",
            },
        payee: payee
          ? {
              personId: payee._id?.toString() || "",
              fullName: `${payee.firstName} ${payee.lastName}`,
              nationalId: payee.nationalId?.toString() || "",
            }
          : {
              personId: "",
              fullName: "",
              nationalId: "",
            },
        relatedDealId: transaction.dealId || data.chequeRelatedDealId || "",
        relatedTransactionId: transaction._id || "",
        actions: [
          {
            actionType: "ثبت",
            actionDate: new Date().toISOString(),
            actorUserId: "",
            description: "ثبت اولیه چک",
          },
        ],
      };

      if (mode === "add") {
        const res = await createCheque(chequeData);
        queryClient.invalidateQueries({
          queryKey: ["get-transactions-by-deal-id"],
        });
        queryClient.invalidateQueries({
          queryKey: ["get-transaction-by-deal-id"],
        });
        queryClient.invalidateQueries({
          queryKey: ["get-all-transaction"],
        });

        queryClient.invalidateQueries({
          queryKey: ["get-all-cheques"],
        });
        queryClient.invalidateQueries({
          queryKey: ["get-cheques-by-deal-id"],
        });
        // queryClient.invalidateQueries({
        //   queryKey: ["get-all-people"],
        // });
        // queryClient.invalidateQueries({
        //   queryKey: ["get-cheques-by-deal-id"],
        // });
        // queryClient.invalidateQueries({
        //   queryKey: ["get-transaction-by-id"],
        // });

        const price = parseFloat(data.amount);

        if (
          data?.chequeStatus === "وصول شده" ||
          data?.chequeStatus === "خرج شده"
        ) {
          await updateWalletHandler(
            data.chequePayeePersonId ||
              data.chequePayerPersonId ||
              data.personId ||
              data.brokerPersonId ||
              data.chequeCustomerPersonId ||
              data.partnerPersonId ||
              data.providerPersonId ||
              "",
            {
              amount: -price,
              type:
                `${data.type} ${data.chequeStatus}-چک-${res.reason} ${res.type}` ||
                data.type,
              description: data.description,
              dealID: res?.relatedDealId ?? "",
              transactionID: res?.relatedTransactionId ?? "",
              chequeId: res?._id,
            },
          );
        }
      } else if (mode === "edit") {
        const res = await updateCheque(
          selectedTransactionChequeInfo?._id,
          chequeData,
        );
        queryClient.invalidateQueries({
          queryKey: ["get-transactions-by-deal-id"],
        });
        queryClient.invalidateQueries({
          queryKey: ["get-all-cheques"],
        });
        queryClient.invalidateQueries({
          queryKey: ["get-cheques-by-deal-id"],
        });

        const price = parseFloat(data.amount);

        if (
          (selectedTransactionChequeInfo?.status === "وصول شده" ||
            selectedTransactionChequeInfo?.status === "خرج شده") &&
          (data.chequeStatus === "در جریان" ||
            data.chequeStatus === "برگشتی" ||
            data.chequeStatus === "عودت داده شده")
        ) {
          await deleteWalletTransaction.mutateAsync({
            id:
              data.chequePayeePersonId ||
              data.chequePayerPersonId ||
              data.personId ||
              data.brokerPersonId ||
              data.chequeCustomerPersonId ||
              data.partnerPersonId ||
              data.providerPersonId ||
              "",
            data: {
              dealID: selectedTransactionChequeInfo?.relatedDealId ?? "",
              transactionID:
                selectedTransactionChequeInfo?.relatedTransactionId ?? "",
              chequeId: selectedTransactionChequeInfo?._id,
            },
          });
        }

        if (
          (selectedTransactionChequeInfo?.status === "در جریان" ||
            selectedTransactionChequeInfo?.status === "برگشتی" ||
            selectedTransactionChequeInfo?.status === "عودت داده شده") &&
          (data?.chequeStatus === "وصول شده" ||
            data?.chequeStatus === "خرج شده")
        ) {
          await updateWalletHandler(
            data.chequePayeePersonId ||
              data.chequePayerPersonId ||
              data.personId ||
              data.brokerPersonId ||
              data.chequeCustomerPersonId ||
              data.partnerPersonId ||
              data.providerPersonId ||
              "",
            {
              amount: -price,
              type:
                `${data.type} ${data.chequeStatus}-چک-${res.reason} ${res.type}` ||
                data.type,
              description: data.description,
              dealID: selectedTransactionChequeInfo?.relatedDealId ?? "",
              transactionID:
                selectedTransactionChequeInfo?.relatedTransactionId ?? "",
              chequeId: selectedTransactionChequeInfo?._id,
            },
          );
        }

        // if(data.chequeStatus === "وصول شده" || data.chequeStatus === "خرج شده"){

        //
        // }
        // queryClient.invalidateQueries({
        //   queryKey: ["get-all-people"],
        // });

        // dispatch(setTransactionCreated(selectedTransactionChequeInfo?._id));
        dispatch(
          setTransactionCreated(`${selectedTransactionChequeInfo?._id}78`),
        );

        // queryClient.invalidateQueries({
        //   queryKey: ["get-cheques-by-deal-id"],
        // });
        // queryClient.invalidateQueries({
        //   queryKey: ["get-transaction-by-id"],
        // });
      }
    } catch (error) {
      console.log("🚀 ~ twoPersonTransactionHandler ~ error:", error);
    }
  };

  const transferHandler = async (data: transactionChequeSchemaType) => {
    if (mode === "edit") {
      // const amount = parseFloat(data.amount);
      const isPartnershipReason =
        (data.type === "دریافت" && data.reason === "سرمایه گذاری") ||
        (data.type === "پرداخت" &&
          (data.reason === "اصل سرمایه" || data.reason === "سود سرمایه"));

      const newPrice = Number(data.amount);
      const newSigned = isPartnershipReason
        ? data.type === "دریافت"
          ? newPrice
          : -newPrice
        : data.type === "پرداخت"
          ? -newPrice
          : newPrice;
      // const signedAmount = data.type === "پرداخت" ? -amount : amount;
      const transactionType = `${data.type} ${data.reason}`;

      const originalTransactionId = transactionId ?? "";

      //        const amount = parseFloat(data.amount);
      // const transactionType = `${data.type} ${data.reason}`;
      // const originalTransactionId = transactionId ?? "";

      // const calculateSignedAmount = (
      //   amount: number,
      //   type: "دریافت" | "پرداخت",
      //   reason: string
      // ): number => {
      //   const isPartnershipReason =
      //     (type === "دریافت" && reason === "سرمایه گذاری") ||
      //     (type === "پرداخت" && (reason === "اصل سرمایه" || reason === "سود سرمایه"));

      //   if (isPartnershipReason) {
      //     // سرمایه‌گذاری: دریافت = مثبت، پرداخت = منفی
      //     return type === "دریافت" ? amount : -amount;
      //   } else {
      //     // تراکنش عادی: دریافت = مثبت، پرداخت = منفی
      //     return type === "پرداخت" ? -amount : amount;
      //   }
      // };

      // const signedAmount = calculateSignedAmount(amount, data.type, data.reason);

      const oldPersonId = transactionDataById?.personId;
      const newPersonId = data?.personId;

      const oldProviderId = transactionDataById?.providerPersonId;
      const newProviderId = data.providerPersonId;

      const oldBrokerId = transactionDataById?.brokerPersonId;
      const newBrokerId = data.brokerPersonId;

      const oldPartnerId = transactionDataById?.partnerPersonId;
      const newPartnerId = data.partnerPersonId;

      const walletUpdates: Array<{
        oldPersonId: string;
        newPersonId: string;
        amount: number;
        type: string;
        description: string;
        dealId?: string;
        transactionId: string;
        reason: "provider" | "broker" | "financier" | "person";
      }> = [];

      if (oldPersonId !== newPersonId && oldPersonId && newPersonId) {
        walletUpdates.push({
          oldPersonId,
          newPersonId,
          amount: newSigned,
          type: transactionType,
          description: data.description || `تغییر طرف حساب - ${data.reason}`,
          dealId: data.dealId,
          transactionId: originalTransactionId ?? "",
          reason: "person",
        });
      }

      if (oldProviderId !== newProviderId && oldProviderId && newProviderId) {
        walletUpdates.push({
          oldPersonId: oldProviderId,
          newPersonId: newProviderId,
          amount: newSigned,
          type: transactionType,
          description: data.description || `تغییر تامین کننده - ${data.reason}`,
          dealId: data.dealId,
          transactionId: originalTransactionId ?? "",
          reason: "provider",
        });
      }

      if (oldBrokerId !== newBrokerId && oldBrokerId && newBrokerId) {
        walletUpdates.push({
          oldPersonId: oldBrokerId,
          newPersonId: newBrokerId,
          amount: newSigned,
          type: transactionType,
          description: data.description || `تغییر کارگزار - ${data.reason}`,
          dealId: data.dealId,
          transactionId: originalTransactionId ?? "",
          reason: "broker",
        });
      }

      if (oldPartnerId !== newPartnerId && oldPartnerId && newPartnerId) {
        walletUpdates.push({
          oldPersonId: oldPartnerId,
          newPersonId: newPartnerId,
          amount: newSigned,
          type: transactionType,
          description: data.description || `تغییر سرمایه گذار - ${data.reason}`,
          dealId: data.dealId,
          transactionId: originalTransactionId ?? "",
          reason: "financier",
        });
      }

      for (const update of walletUpdates) {
        try {
          if (
            (oldPersonId !== newPersonId && oldPersonId && newPersonId) ||
            (oldProviderId !== newProviderId &&
              oldProviderId &&
              newProviderId) ||
            (oldBrokerId !== newBrokerId && oldBrokerId && newBrokerId) ||
            (oldPartnerId !== newPartnerId && oldPartnerId && newPartnerId)
          ) {
            await updateWalletTransfer(update);
          }
        } catch (walletError) {
          console.error("Error updating wallet:", walletError);
        }
      }
    }
  };

  const walletUpdateHandler = async (
    data: transactionChequeSchemaType,
    transaction: ITransactionNew,
  ) => {
    if (data.paymentMethod === "چک") return;

    const isPartnershipReason =
      (data.type === "دریافت" && data.reason === "سرمایه گذاری") ||
      (data.type === "پرداخت" &&
        (data.reason === "اصل سرمایه" || data.reason === "سود سرمایه"));

    const effectivePersonId =
      isPartnershipReason && data.partnerPersonId
        ? data.partnerPersonId
        : data?.personId && data?.personId !== ""
          ? data?.personId
          : (data.providerPersonId ?? "");

    if (
      data.chequeStatus === "در جریان" ||
      data.chequeStatus === "برگشتی" ||
      data.chequeStatus === "عودت داده شده"
    ) {
      return;
    }

    if (mode === "edit") {
      const newPrice = Number(data.amount);
      const newSigned = isPartnershipReason
        ? data.type === "دریافت"
          ? newPrice
          : -newPrice
        : data.type === "پرداخت"
          ? -newPrice
          : newPrice;

      if (transactionDataById) {
        const oldPrice = Number(transactionDataById.amount ?? 0);
        const oldIsPartnershipReason =
          (transactionDataById.type === "دریافت" &&
            transactionDataById.reason === "سرمایه گذاری") ||
          (transactionDataById.type === "پرداخت" &&
            (transactionDataById.reason === "اصل سرمایه" ||
              transactionDataById.reason === "سود سرمایه"));

        // const oldSigned = oldIsPartnershipReason
        //   ? transactionDataById.type === "دریافت"
        //     ? -oldPrice
        //     : oldPrice
        //   : transactionDataById.type === "پرداخت"
        //     ? -oldPrice
        //     : oldPrice;

        const oldSigned = oldIsPartnershipReason
          ? transactionDataById.type === "دریافت"
            ? oldPrice
            : -oldPrice
          : transactionDataById.type === "پرداخت"
            ? -oldPrice
            : oldPrice;

        const oldWalletPersonId = oldIsPartnershipReason
          ? (transactionDataById as any)?.partnerPersonId ||
            transactionDataById?.personId
          : transactionDataById?.personId;

        const newWalletPersonId = effectivePersonId;

        if (
          newWalletPersonId &&
          oldWalletPersonId &&
          newWalletPersonId !== oldWalletPersonId
        ) {
          try {
            updateWalletHandler(oldWalletPersonId, {
              amount: -oldSigned,
              type: `${data.type} ${data.reason}` || data.type,
              description: data.description || transactionDataById.description,
              dealID: data.dealId ?? transaction.dealId ?? "",
              transactionID: transaction._id ?? "",
            });
          } catch (error) {
            console.log("🚀 ~ walletUpdateHandler ~ error:", error);
          }

          try {
            updateWalletHandler(newWalletPersonId, {
              amount: newSigned,
              type: `${data.type} ${data.reason}` || data.type,
              description: data.description,
              dealID: data.dealId ?? transaction.dealId ?? "",
              transactionID: transaction._id ?? "",
            });
          } catch (error) {
            console.log("🚀 ~ walletUpdateHandler ~ error:", error);
          }
        } else if (newWalletPersonId) {
          // const delta = newSigned - oldSigned;
          try {
            if (newSigned !== 0) {
              updateWalletHandler(newWalletPersonId, {
                amount: newSigned,
                type: `${data.type} ${data.reason}` || data.type,
                description: data.description,
                dealID: data.dealId ?? transaction.dealId ?? "",
                transactionID: transaction._id ?? "",
              });
            }
          } catch (error) {
            console.log("🚀 ~ walletUpdateHandler ~ error:", error);
          }
        }
      }
      if (data.dealId && transactionReason === "سایر هزینه‌ها") {
        if (selectedDealIdInfo?.[0]?.purchaseBroker?.personId && newSigned) {
          try {
            updateWalletHandler(
              selectedDealIdInfo?.[0]?.purchaseBroker?.personId,
              {
                amount: newSigned,
                type: `${data.type} ${data.reason}` || data.type,
                description: data.description,
                dealID: data.dealId ?? transaction.dealId ?? "",
                transactionID: transaction._id ?? "",
              },
            );
          } catch (error) {
            console.log("🚀 ~ walletUpdateHandler ~ error:", error);
          }
        }
        try {
          if (selectedDealIdInfo?.[0]?.saleBroker?.personId && newSigned) {
            updateWalletHandler(selectedDealIdInfo?.[0]?.saleBroker?.personId, {
              amount: newSigned,
              type: `${data.type} ${data.reason}` || data.type,
              description: data.description,
              dealID: data.dealId ?? transaction.dealId ?? "",
              transactionID: transaction._id ?? "",
            });
          }
        } catch (error) {
          console.log("🚀 ~ walletUpdateHandler ~ error:", error);
        }
      }
    } else {
      reset({
        amount: "",
        transactionDate: "",
      });
      const price = Number(data.amount);

      // const isPartnershipReason =
      //   (data.type === "دریافت" && data.reason === "سرمایه گذاری") ||
      //   (data.type === "پرداخت" &&
      //     (data.reason === "اصل سرمایه" || data.reason === "سود سرمایه"));

      const walletAmount = isPartnershipReason
        ? data.type === "دریافت"
          ? price
          : -price
        : data.type === "پرداخت"
          ? -price
          : price;
      const walletData = {
        amount: walletAmount,
        type: `${data.type} ${data.reason}`,
        // type:
        //   data.type === "دریافت"
        //     ? "دریافت سرمایه"
        //     : data.type === "پرداخت"
        //       ? "پرداخت سرمایه"
        //       : data.type,
        description: data.description,
        dealID: data.dealId ?? transaction.dealId ?? "",
        // optionId: Date.now().toString(),
        transactionID: transaction._id ?? "",
      };

      if (effectivePersonId) {
        updateWalletHandler(effectivePersonId, walletData);
      }

      if (data.dealId && transactionReason === "سایر هزینه‌ها") {
        if (selectedDeal?.purchaseBroker?.personId) {
          updateWalletHandler(
            selectedDeal?.purchaseBroker?.personId,
            walletData,
          );
        }
        if (selectedDeal?.saleBroker?.personId) {
          updateWalletHandler(selectedDeal?.saleBroker?.personId, walletData);
        }
      }
    }
  };

  const onSubmit: SubmitHandler<transactionChequeSchemaType> = async (
    data: transactionChequeSchemaType,
  ) => {
    const twoPersonTransactions =
      data.paymentMethod === "مشتری به مشتری" &&
      (data.personId || data.partnerPersonId) &&
      data.secondPersonId;

    const transactionsForaPersonAndMoneyChanger =
      data.paymentMethod === "مشتری به مشتری" &&
      (data.reason === "خرید خودروـ صراف" ||
        data.reason === "فروش خودروـ صراف");

    try {
      // const isPartnershipReason =
      //   (data.type === "دریافت" && data.reason === "سرمایه گذاری") ||
      //   (data.type === "پرداخت" &&
      //     (data.reason === "اصل سرمایه" || data.reason === "سود سرمایه"));

      // const effectivePersonId =
      //   isPartnershipReason && data.partnerPersonId
      //     ? data.partnerPersonId
      //     : data.personId && data.personId !== ""
      //       ? data.personId
      //       : (data.providerPersonId ?? "");

      const partnerShip = allPeople?.find(
        (el) => el._id === data.partnerPersonId,
      );

      const transactionData = {
        type: data.type,
        reason: data.reason,
        transactionDate: data.transactionDate,
        amount: parseFloat(data.amount),
        personId: data?.personId,
        secondPersonId: data.secondPersonId,
        secondDealId: data.secondDealId || undefined,
        bussinessAccountId: data.bussinessAccountId,
        paymentMethod: data.paymentMethod,
        dealId: data.dealId || undefined,
        vin:
          selectedDeal?.vehicleSnapshot.vin ?? transactionDataById?.vin ?? "",
        description: data.description || "",
        profitState: data?.profitState || "",
        brokerPersonId: data.brokerPersonId || "",
        providerPersonId: data.providerPersonId || "",
        partnerPersonId: data.partnerPersonId || "",
        partnerShipProfit: `${partnerShip?.firstName} ${partnerShip?.lastName}`,
        partnershipProfitSharePercentage:
          data?.partnershipProfitSharePercentage ||
          partnerShip?.brokerDetails?.currentRates?.purchaseCommissionPercent ||
          partnerShip?.brokerDetails?.currentRates?.saleCommissionPercent ||
          "",
      };
      if (data.brokerPersonId) {
        transactionData.brokerPersonId = data.brokerPersonId;
      }
      if (data.providerPersonId) {
        transactionData.providerPersonId = data.providerPersonId;
      }

      if (transactionsForaPersonAndMoneyChanger) {
        await transactionsForaPersonAndMoneyChangerHandler(data);
        // queryClient.invalidateQueries({ queryKey: ["get-all-people"] });
        queryClient.invalidateQueries({
          queryKey: ["get-transactions-by-deal-id"],
        });
        queryClient.invalidateQueries({ queryKey: ["get-all-cheques"] });
        onSuccess?.();
        return;
      }

      let transaction;
      if (!!twoPersonTransactions) {
        await twoPersonTransactionsHandler(data);
        // queryClient.invalidateQueries({ queryKey: ["get-all-people"] });
        queryClient.invalidateQueries({
          queryKey: ["get-transactions-by-deal-id"],
        });
        queryClient.invalidateQueries({ queryKey: ["get-all-cheques"] });
        onSuccess?.();
        return;
      }

      if (mode === "edit" && transactionId) {
        // Update existing transaction
        transaction = await updateTransaction.mutateAsync({
          id: transactionId,
          data: transactionData,
        });
        // dispatch(setTransactionCreated(transaction._id));
        dispatch(setTransactionCreated(`${transaction?._id}748`));

        alert("mode ===transactionId");
        toast.success("تراکنش با موفقیت به‌روزرسانی شد");
      } else {
        // Create new transaction
        transaction = await createTransaction.mutateAsync(transactionData);
        queryClient.invalidateQueries({
          queryKey: ["get-transactions-by-deal-id"],
        });
        toast.success("تراکنش با موفقیت ثبت شد");
        alert("else");

        // dispatch(setTransactionCreated(transaction._id));
        dispatch(setTransactionCreated(`${transaction?._id}728`));
      }
      alert("out");

      await chequeHandler(data, transaction);
      await walletUpdateHandler(data, transaction);

      await transferHandler(data);
      // queryClient.invalidateQueries({
      //   queryKey: ["get-all-people"],
      // });

      queryClient.invalidateQueries({
        queryKey: ["get-transactions-by-deal-id"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-all-cheques"],
      });
      // queryClient.invalidateQueries({
      //   queryKey: ["get-cheques-by-deal-id"],
      // });
      queryClient.invalidateQueries({
        queryKey: ["get-cheques-by-deal-id"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-cheques-by-person-id"],
      });

      queryClient.invalidateQueries({ queryKey: ["get-all-people"] });
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating transaction:", error);
      toast.error(error?.response?.data?.message || "خطا در ثبت تراکنش");
      // dispatch(setTransactionCreated(false));
    } finally {
      // get-transactions-by-deal-id
      queryClient.invalidateQueries({
        queryKey: ["get-transactions-by-deal-id"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-all-cheques"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-cheques-by-deal-id"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-all-transaction"],
      });
      // queryClient.invalidateQueries({
      //   queryKey: ["get-all-people"],
      // });
      getTransactionsHandler?.();
      // dispatch(setTransactionCreated(false));
      dispatch(
        setVehicleUpdated(
          selectedDeal?._id ?? selectedTransactionChequeInfo?._id ?? "",
        ),
      );
    }
  };

  const TRANSACTION_REASONS =
    transactionType === "دریافت"
      ? TRANSACTION_REASONS_FOR_RECEIPT
      : TRANSACTION_REASONS_FOR_PAYMENT;

  const partnerFieldIsExist =
    (transactionType === "دریافت" && transactionReason === "سرمایه گذاری") ||
    (transactionType === "پرداخت" &&
      (transactionReason === "اصل سرمایه" ||
        transactionReason === "سود سرمایه"));

  const paymentMethods =
    transactionType === "دریافت" || transactionReason === "خرید خودروـ صراف"
      ? [...PAYMENT_METHODS, "مشتری به مشتری"]
      : PAYMENT_METHODS;

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-base text-gray-800 font-semibold border-b pb-2">
          اطلاعات تراکنش
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={`space-y-2 ${paymentMethod === "مشتری به مشتری" && mode === "edit" ? "opacity-80 cursor-not-allowed" : ""}`}
          >
            <label htmlFor="type" className="block text-sm font-medium">
              {" "}
              نوع تراکنش <span className="text-red-600">*</span>
            </label>
            <select
              id="type"
              {...register("type")}
              className="w-full px-3 py-2 border rounded-md"
              disabled={paymentMethod === "مشتری به مشتری" && mode === "edit"}
            >
              <option value="">انتخاب کنید</option>
              {TRANSACTION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-red-500 text-xs">{errors.type.message}</p>
            )}
          </div>

          <div
            className={`space-y-2 ${paymentMethod === "مشتری به مشتری" && mode === "edit" ? "opacity-80 cursor-not-allowed" : ""}`}
          >
            <label htmlFor="reason" className="block text-sm font-medium">
              {" "}
              دلیل تراکنش <span className="text-red-600">*</span>
            </label>
            <select
              id="reason"
              {...register("reason")}
              className="w-full px-3 py-2 border rounded-md"
              disabled={paymentMethod === "مشتری به مشتری" && mode === "edit"}
            >
              <option value="">انتخاب کنید</option>
              {TRANSACTION_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
            {errors.reason && (
              <p className="text-red-500 text-xs">{errors.reason.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {" "}
              تاریخ تراکنش <span className="text-red-600">*</span>
            </label>
            <Controller
              name="transactionDate"
              control={control}
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  transactionChequeSchemaType,
                  "transactionDate"
                >;
              }) => (
                <PersianDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="تاریخ تراکنش"
                />
              )}
            />
            {errors.transactionDate && (
              <p className="text-red-500 text-xs">
                {errors.transactionDate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium">
              {" "}
              مبلغ (ریال) <span className="text-red-600">*</span>
            </label>
            {/* <input
              id="amount"
              {...register("amount")}
              type="number"
              placeholder="مبلغ تراکنش"
              className="w-full px-3 py-2 border rounded-md"
            /> */}

            <Controller
              name="amount"
              control={control}
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  transactionChequeSchemaType,
                  "amount"
                >;
              }) => {
                const formattedValue = field.value
                  ? Number(field.value).toLocaleString("en-US")
                  : "";

                return (
                  <input
                    {...field}
                    type="text"
                    inputMode="numeric"
                    id="amount"
                    placeholder="مبلغ تراکنش"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formattedValue}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/,/g, "");
                      if (!isNaN(Number(rawValue))) {
                        field.onChange(rawValue);
                      }
                    }}
                  />
                );
              }}
            />
            {errors.amount && (
              <p className="text-red-500 text-xs">{errors.amount.message}</p>
            )}
          </div>

          <div
            className={`space-y-2 ${paymentMethod === "مشتری به مشتری" && mode === "edit" ? "opacity-80 cursor-not-allowed" : ""} ${transactionReason === "خرید خودروـ صراف" || transactionReason === "فروش خودروـ صراف" ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <label
              htmlFor="paymentMethod"
              className="block text-sm font-medium"
            >
              {" "}
              روش پرداخت <span className="text-red-600">*</span>
            </label>
            <select
              id="paymentMethod"
              {...register("paymentMethod")}
              className="w-full px-3 py-2 border rounded-md"
              disabled={
                (paymentMethod === "مشتری به مشتری" && mode === "edit") ||
                transactionReason === "خرید خودروـ صراف" ||
                transactionReason === "فروش خودروـ صراف"
              }
              value={paymentMethod}
            >
              {paymentMethods.map((method) => {
                return (
                  <option key={method} value={method}>
                    {method}
                  </option>
                );
              })}
            </select>
            {errors.paymentMethod && (
              <p className="text-red-500 text-xs">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          <div
            className={`space-y-2 ${paymentMethod === "مشتری به مشتری" ? "opacity-50" : ""}`}
          >
            <label
              htmlFor="bussinessAccountId"
              className="block text-sm font-medium"
            >
              {" "}
              حساب بانکی
              {paymentMethod === "مشتری به مشتری" ? null : (
                <span className="text-red-600">*</span>
              )}
            </label>
            <select
              id="bussinessAccountId"
              {...register("bussinessAccountId")}
              className={`w-full px-3 py-2 border rounded-md ${paymentMethod === "مشتری به مشتری" ? "opacity-50" : ""}`}
              disabled={paymentMethod === "مشتری به مشتری"}
            >
              <option value="">انتخاب حساب</option>
              {allAccounts
                ?.filter((acc) => acc.isActive)
                .map((acc) => (
                  <option key={acc._id?.toString()} value={acc._id?.toString()}>
                    {acc.accountName} - {acc.bankName}
                  </option>
                ))}
            </select>
            {errors.bussinessAccountId && (
              <p className="text-red-500 text-xs">
                {errors.bussinessAccountId.message}
              </p>
            )}
          </div>

          <div
            // className={`space-y-2 ${transactionReason === "خرید خودروـ صراف" ? "opacity-50 cursor-not-allowed" : ""}`}
            className={`space-y-2 ${
              transactionReason === "خرید خودروـ صراف" ||
              transactionReason === "فروش خودروـ صراف"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <label className="block text-sm font-medium">
              مرتبط با معامله
              <span>
                {" "}
                {(transactionType === "پرداخت" &&
                  [
                    "خرید خودرو",
                    "درصد کارگزار",
                    "آپشن",
                    "جابجایی(وسیله نقلیه)",
                  ].includes(transactionReason)) ||
                (((transactionType === "دریافت" &&
                  ["فروش خودرو"].includes(transactionReason)) ||
                  paymentMethod === "مشتری به مشتری") &&
                  transactionReason !== "خرید خودروـ صراف") ? (
                  <span className="text-red-600">*</span>
                ) : (
                  ""
                )}
              </span>
            </label>
            <select
              {...register("dealId")}
              onChange={(e) => {
                const deal = allDeals?.find(
                  (d) => d._id?.toString() === e.target.value,
                );
                setSelectedDeal(deal || null);
                setValue("dealId", e.target.value);
                if (showChequeFields) {
                  setValue("chequeRelatedDealId", e.target.value);
                }
              }}
              className="w-full px-3 py-2 border rounded-md"
              // disabled={transactionReason === "خرید خودروـ صراف"}
              disabled={
                transactionReason === "خرید خودروـ صراف" ||
                transactionReason === "فروش خودروـ صراف"
              }
            >
              <option value="">
                انتخاب معامله
                {/* <span>
                  {(transactionType === "پرداخت" &&
                    [
                      "خرید خودرو",
                      "درصد کارگزار",
                      "آپشن",
                      "جابجایی(وسیله نقلیه)",
                    ].includes(transactionReason)) ||
                  (transactionType === "دریافت" &&
                    ["فروش خودرو"].includes(transactionReason)) ? (
                    <span className="text-red-600">*</span>
                  ) : (
                    ""
                  )}
                </span> */}
              </option>

              {allDeals?.map((deal) => (
                <option key={deal._id?.toString()} value={deal._id?.toString()}>
                  {deal.vehicleSnapshot.plateNumber || "بدون پلاک"} -{" "}
                  {deal.vehicleSnapshot.model} ({deal.vehicleSnapshot.vin})
                </option>
              ))}
            </select>
            {errors.dealId && (
              <p className="text-red-500 text-xs">{errors.dealId.message}</p>
            )}
          </div>

          {partnerFieldIsExist ? (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  {" "}
                  نام سرمایه گذار <span className="text-red-600">*</span>
                </label>
                {/* <PersonSelect
                value={partnership.partnerPersonId}
                onValueChange={(personId) =>
                  updatePartnership(index, "partnerPersonId", personId)
                }
                people={allPeople || []}
                placeholder="انتخاب شریک"
              /> */}

                <Controller
                  name="partnerPersonId"
                  control={control}
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      transactionChequeSchemaType,
                      "partnerPersonId"
                    >;
                  }) => (
                    <PersonSelect
                      value={field.value}
                      onValueChange={(personId, person) => {
                        field.onChange(personId);
                      }}
                      people={financierPeople || []}
                      placeholder="انتخاب سرمایه گذار"
                    />
                  )}
                />
                {(() => {
                  const err = errors.partnerPersonId ?? errors.personId;
                  const msg = err?.message;
                  return msg ? (
                    <p className="text-red-500 text-xs">{msg}</p>
                  ) : null;
                })()}
              </div>
              {/* <div className="space-y-2">
                <label className="block text-sm font-medium">
                  مبلغ سرمایه (ریال)
                </label>
                <input
                  type="number"
                  {...register("partnershipInvestmentAmount")}
                  // value={partnership.investmentAmount.toLocaleString()}
                  // onChange={(e) =>
                  //   updatePartnership(index, "investmentAmount", e.target.value)
                  // }

                  placeholder="مبلغ سرمایه"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div> */}
            </>
          ) : transactionReason === "آپشن" ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                {" "}
                تامین کننده <span className="text-red-600">*</span>
              </label>
              <Controller
                name="providerPersonId"
                control={control}
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    transactionChequeSchemaType,
                    "providerPersonId"
                  >;
                }) => (
                  <PersonSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    people={providers || []}
                    placeholder="انتخاب تامین کننده"
                  />
                )}
              />
              {errors.providerPersonId && (
                <p className="text-red-500 text-xs">
                  {errors.providerPersonId.message}
                </p>
              )}
            </div>
          ) : transactionReason === "درصد کارگزار" ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                {" "}
                کارگزاران <span className="text-red-600">*</span>
              </label>
              <Controller
                name="brokerPersonId"
                control={control}
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    transactionChequeSchemaType,
                    "brokerPersonId"
                  >;
                }) => (
                  <PersonSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    people={brokers || []}
                    placeholder="انتخاب کارگزار"
                  />
                )}
              />
              {errors.brokerPersonId && (
                <p className="text-red-500 text-xs">
                  {errors.brokerPersonId.message}
                </p>
              )}
            </div>
          ) : (
            <div
              className={`space-y-2 ${transactionReason === "خرید خودروـ صراف" || transactionReason === "فروش خودروـ صراف" ? "opacity-50 cursor-" : ""}`}
            >
              <label className="block text-sm font-medium">
                {transactionReason === "سایر هزینه‌ها" ? (
                  "طرف حساب"
                ) : (
                  <>
                    {" "}
                    طرف حساب <span className="text-red-600">*</span>
                  </>
                )}
              </label>
              <Controller
                name="personId"
                control={control}
                disabled={
                  transactionReason === "خرید خودروـ صراف" ||
                  transactionReason === "فروش خودروـ صراف"
                }
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    transactionChequeSchemaType,
                    "personId"
                  >;
                }) => (
                  <PersonSelect
                    value={field.value}
                    onValueChange={(personId, person: IPeople) => {
                      field.onChange(personId);
                      setSelectedPerson(person || null);
                    }}
                    people={
                      transactionReason === "حقوق"
                        ? employees
                        : transactionReason === "خرید خودروـ صراف"
                          ? moneyChangerPeople
                          : (peopleForDeal ?? allPeople) || []
                    }
                    placeholder="انتخاب طرف حساب"
                  />
                )}
              />
              {errors.personId && (
                <p className="text-red-500 text-xs">
                  {errors.personId.message}
                </p>
              )}
            </div>
          )}

          {paymentMethod === "مشتری به مشتری" && (
            <>
              <div
                // className={`space-y-2 ${transactionReason === "فروش خودروـ صراف" ? "opacity-50 cursor-not-allowed" : ""}`}
                className={`space-y-2 ${
                  transactionReason === "خرید خودروـ صراف" ||
                  transactionReason === "فروش خودروـ صراف"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <label className="block text-sm font-medium">
                  مرتبط با معامله دوم
                  <span>
                    {" "}
                    {((transactionType === "پرداخت" &&
                      [
                        "خرید خودرو",
                        "درصد کارگزار",
                        "آپشن",
                        "جابجایی(وسیله نقلیه)",
                      ].includes(transactionReason)) ||
                      (transactionType === "دریافت" &&
                        ["فروش خودرو"].includes(transactionReason)) ||
                      paymentMethod === "مشتری به مشتری") &&
                    transactionReason !== "فروش خودروـ صراف" ? (
                      <span className="text-red-600">*</span>
                    ) : (
                      ""
                    )}
                  </span>
                </label>
                <select
                  {...register("secondDealId")}
                  onChange={(e) => {
                    const deal = allDeals?.find(
                      (d) => d._id?.toString() === e.target.value,
                    );
                    setSelectedSecondDeal(deal || null);
                    setValue("secondDealId", e.target.value);
                  }}
                  className="w-full px-3 py-2 border rounded-md"
                  // disabled={transactionReason === "فروش خودروـ صراف"}
                  disabled={
                    transactionReason === "خرید خودروـ صراف" ||
                    transactionReason === "فروش خودروـ صراف"
                  }
                >
                  <option value="">انتخاب معامله دوم</option>

                  {allDeals?.map((deal) => (
                    <option
                      key={deal._id?.toString()}
                      value={deal._id?.toString()}
                    >
                      {deal.vehicleSnapshot.plateNumber || "بدون پلاک"} -{" "}
                      {deal.vehicleSnapshot.model} ({deal.vehicleSnapshot.vin})
                    </option>
                  ))}
                </select>
                {errors.secondDealId && (
                  <p className="text-red-500 text-xs">
                    {errors.secondDealId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  {" "}
                  طرف حساب دوم <span className="text-red-600">*</span>
                </label>
                <Controller
                  name="secondPersonId"
                  control={control}
                  shouldUnregister={false}
                  defaultValue=""
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      transactionChequeSchemaType,
                      "secondPersonId"
                    >;
                  }) => (
                    <PersonSelect
                      value={field.value}
                      onValueChange={(secondPersonId, person) => {
                        field.onChange(secondPersonId);
                        setSelectedPerson(person || null);
                      }}
                      people={
                        transactionReason === "فروش خودروـ صراف"
                          ? moneyChangerPeople
                          : (peopleForSecondDeal ?? allPeople) || []
                      }
                      placeholder="انتخاب طرف حساب دوم"
                      disabled={
                        transactionReason === "خرید خودروـ صراف" ||
                        transactionReason === "فروش خودروـ صراف"
                      }
                    />
                  )}
                />
                {errors.secondPersonId && (
                  <p className="text-red-500 text-xs">
                    {errors.secondPersonId.message}
                  </p>
                )}
              </div>
            </>
          )}

          {transactionType === "دریافت" && partnerFieldIsExist && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  حالت سود <span className="text-red-600">*</span>{" "}
                </label>
                <select
                  {...register("profitState")}
                  onChange={(e) => {
                    setValue("profitState", e.target.value);
                  }}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">انتخاب حالت سود</option>
                  {["بر اصل سپرده", "بر اساس سود معامله"]?.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {errors.profitState && (
                  <p className="text-red-500 text-xs">
                    {errors.profitState.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  درصد سود <span className="text-red-600">*</span>{" "}
                </label>
                <input
                  type="number"
                  // value={partnership.profitSharePercentage}
                  // onChange={(e) =>
                  //   updatePartnership(
                  //     index,
                  //     "profitSharePercentage",
                  //     e.target.value,
                  //   )
                  // }
                  {...register("partnershipProfitSharePercentage")}
                  placeholder="درصد"
                  className="w-full px-3 py-2 border rounded-md"
                />
                {errors.partnershipProfitSharePercentage && (
                  <p className="text-red-500 text-xs">
                    {errors.partnershipProfitSharePercentage.message}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium">
              شرح
            </label>
            <textarea
              id="description"
              {...register("description")}
              placeholder="توضیحات تراکنش"
              rows={3}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.description && (
              <p className="text-red-500 text-xs">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Cheque Fields */}
      {showChequeFields && (
        <div className="space-y-4 bg-purple-100 p-6 rounded-xl">
          <h3 className="text-base text-gray-800 font-semibold border-b pb-2">
            اطلاعات چک
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="chequeStatus"
                className="block text-sm font-medium"
              >
                وضعیت چک <span className="text-red-600">*</span>{" "}
              </label>
              <select
                id="chequeStatus"
                {...register("chequeStatus")}
                className="w-full px-3 py-2 border border-gray-600 rounded-md"
              >
                <option value="">انتخاب وضعیت</option>
                {CHEQUE_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.chequeStatus && (
                <p className="text-red-500 text-xs">
                  {errors.chequeStatus.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="sayadiID" className="block text-sm font-medium">
                {" "}
                شناسه صیادی <span className="text-red-600">*</span>
              </label>
              <input
                id="sayadiID"
                {...register("sayadiID")}
                type="text"
                inputMode="numeric"
                placeholder="شناسه صیادی"
                className="w-full px-3 py-2 border border-gray-600 rounded-md"
              />
              {errors.sayadiID && (
                <p className="text-red-500 text-xs">
                  {errors.sayadiID.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="chequeSerial"
                className="block text-sm font-medium"
              >
                {" "}
                سریال چک <span className="text-red-600">*</span>
              </label>
              <input
                id="chequeSerial"
                {...register("chequeSerial")}
                type="text"
                inputMode="numeric"
                placeholder="سریال چک"
                className="w-full px-3 py-2 border border-gray-600 rounded-md"
              />
              {errors.chequeSerial && (
                <p className="text-red-500 text-xs">
                  {errors.chequeSerial.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="chequeNumber"
                className="block text-sm font-medium"
              >
                {" "}
                سری چک <span className="text-red-600">*</span>
              </label>
              <input
                id="chequeNumber"
                {...register("chequeNumber")}
                type="text"
                inputMode="numeric"
                placeholder="شماره چک"
                className="w-full px-3 py-2 border border-gray-600 rounded-md"
              />
              {errors.chequeNumber && (
                <p className="text-red-500 text-xs">
                  {errors.chequeNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="chequeBankName"
                className="block text-sm font-medium"
              >
                {" "}
                نام بانک <span className="text-red-600">*</span>
              </label>
              <select
                id="chequeBankName"
                {...register("chequeBankName")}
                className="w-full px-3 py-2 border border-gray-600 rounded-md"
              >
                <option value="">انتخاب بانک</option>
                {BANK_NAMES.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
              {errors.chequeBankName && (
                <p className="text-red-500 text-xs">
                  {errors.chequeBankName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="chequeBranchName"
                className="block text-sm font-medium"
              >
                نام شعبه
              </label>
              <input
                id="chequeBranchName"
                {...register("chequeBranchName")}
                placeholder="نام شعبه"
                className="w-full px-3 py-2 border border-gray-600 rounded-md"
              />
              {errors.chequeBranchName && (
                <p className="text-red-500 text-xs">
                  {errors.chequeBranchName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                {" "}
                تاریخ صدور <span className="text-red-600">*</span>
              </label>
              <Controller
                name="chequeIssueDate"
                control={control}
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    transactionChequeSchemaType,
                    "chequeIssueDate"
                  >;
                }) => (
                  <PersianDatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="تاریخ صدور"
                    className="border-gray-600"
                  />
                )}
              />
              {errors.chequeIssueDate && (
                <p className="text-red-500 text-xs">
                  {errors.chequeIssueDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                {" "}
                تاریخ سررسید <span className="text-red-600">*</span>
              </label>
              <Controller
                name="chequeDueDate"
                control={control}
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    transactionChequeSchemaType,
                    "chequeDueDate"
                  >;
                }) => (
                  <PersianDatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="تاریخ سررسید"
                    className="border-gray-600"
                  />
                )}
              />
              {errors.chequeDueDate && (
                <p className="text-red-500 text-xs">
                  {errors.chequeDueDate.message}
                </p>
              )}
            </div>

            {showPayer && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  {" "}
                  مشتری <span className="text-red-600">*</span>
                </label>
                <Controller
                  name="chequeCustomerPersonId"
                  control={control}
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      transactionChequeSchemaType,
                      "chequeCustomerPersonId"
                    >;
                  }) => (
                    <PersonSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      people={allPeople || []}
                      placeholder="انتخاب مشتری"
                      className="border-gray-600"
                    />
                  )}
                />
                {errors.chequeCustomerPersonId && (
                  <p className="text-red-500 text-xs">
                    {errors.chequeCustomerPersonId.message}
                  </p>
                )}
              </div>
            )}

            {showPayer && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  {" "}
                  صادرکننده <span className="text-red-600">*</span>
                </label>
                <Controller
                  name="chequePayerPersonId"
                  control={control}
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      transactionChequeSchemaType,
                      "chequePayerPersonId"
                    >;
                  }) => (
                    <PersonSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      people={allPeople || []}
                      placeholder="انتخاب صادرکننده"
                      className="border-gray-600"
                    />
                  )}
                />
                {errors.chequePayerPersonId && (
                  <p className="text-red-500 text-xs">
                    {errors.chequePayerPersonId.message}
                  </p>
                )}
              </div>
            )}

            {showPayee && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  {" "}
                  گیرنده <span className="text-red-600">*</span>
                </label>
                <Controller
                  name="chequePayeePersonId"
                  control={control}
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      transactionChequeSchemaType,
                      "chequePayeePersonId"
                    >;
                  }) => (
                    <PersonSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      people={allPeople || []}
                      placeholder="انتخاب گیرنده"
                      className="border-gray-600"
                    />
                  )}
                />
                {errors.chequePayeePersonId && (
                  <p className="text-red-500 text-xs">
                    {errors.chequePayeePersonId.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="chequeDescription"
                className="block text-sm font-medium"
              >
                توضیحات
              </label>
              <input
                id="chequeDescription"
                {...register("chequeDescription")}
                placeholder="توضیحات"
                className="w-full px-3 py-2 border border-gray-600 rounded-md"
              />
              {errors.chequeDescription && (
                <p className="text-red-500 text-xs">
                  {errors.chequeDescription.message}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t">
        <button
          type="submit"
          disabled={
            (mode === "edit" && updateTransaction.isPending) ||
            createTransaction.isPending
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {mode === "edit"
            ? updateTransaction.isPending
              ? "در حال به‌روزرسانی..."
              : "به‌روزرسانی تراکنش"
            : createTransaction.isPending
              ? "در حال ثبت..."
              : "ثبت تراکنش"}
        </button>
      </div>
    </form>
  );

  if (embedded) {
    return (
      <div dir="rtl">
        {/* <div className="mb-4">
          <h2 className="text-xl font-bold">ثبت تراکنش</h2>
        </div> */}
        {formContent}
      </div>
    );
  }

  return <div dir="rtl">{formContent}</div>;
};

export default TransactionForm;
