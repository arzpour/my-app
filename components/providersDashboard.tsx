"use client";
import {
  useGetChequesByDealId,
  useGetChequesByPersonId,
} from "@/apis/mutations/cheques";
import { useGetAllDeals } from "@/apis/mutations/deals";
import { useGetTransactionsByDealId } from "@/apis/mutations/transaction";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetAllPeople from "@/hooks/useGetAllPeople";
import { IChequeNew, IDeal, ITransactionNew } from "@/types/new-backend-types";
import React from "react";
import { formatPrice } from "@/utils/systemConstants";
import useGetAllTransactions from "@/hooks/useGetAllTransaction";
import { setChassisNo } from "@/redux/slices/carSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { RefreshCcwIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface IVehicleList {
  dealId: string;
  vin: string;
  model: string;
  plate: string;
  amount: number;
}

const ProvidersDashboard = () => {
  const [selectedNationalId, setSelectedNationalId] = React.useState<
    string | null
  >(null);
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [allDeals, setAllDeals] = React.useState<IDeal[]>([]);
  const [allDealsTransactions, setAllDealsTransactions] = React.useState<
    ITransactionNew[]
  >([]);
  const [cheques, setCheques] = React.useState<IChequeNew[]>([]);
  const [allPersonCheques, setAllPersonCheques] = React.useState<IChequeNew[]>(
    [],
  );
  const [selectedDealId, setSelectedDealId] = React.useState<string | null>(
    null,
  );
  const [selectedPersonId, setSelectedPersonId] = React.useState<string | null>(
    null,
  );
  const [vehicleVin, setVehicleVin] = React.useState<string | null>(null);

  const getTransactionsByDealId = useGetTransactionsByDealId();
  const { data: getTransactions } = useGetAllTransactions();
  const getChequesByDealId = useGetChequesByDealId();
  const getChequesByPersonId = useGetChequesByPersonId();
  const { data: allPeople } = useGetAllPeople();
  const getAllDeals = useGetAllDeals();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { optionUpdated, transactionCreated } = useSelector(
    (state: RootState) => state.transaction,
  );

  const transactions = getTransactions?.filter(
    (t) => t.providerPersonId === selectedPersonId,
  );

  const peopleList = React.useMemo(() => {
    if (!allPeople) return [];
    return allPeople.filter((person) => person.roles?.includes("provider"));
  }, [allPeople]);

  const allOptionsWithVehicleInfo = allDeals.flatMap((deal) =>
    deal.directCosts.options
      .filter((o) => o.provider.personId === selectedPersonId)
      .map((option) => ({
        ...option,
        vehicleVin: deal.vehicleSnapshot.vin,
        dealId: deal._id,
      })),
  );

  const filteredOptions = allOptionsWithVehicleInfo.filter(
    (item) => !vehicleVin || item.vehicleVin === vehicleVin,
  );

  const filteredCheques = cheques.filter((cheque) => {
    if (!vehicleVin) return true;

    return String(cheque.vin) === String(vehicleVin);
  });

  const costumerRefreshHandler = () => {
    queryClient.invalidateQueries({
      queryKey: ["get-all-people"],
    });
  };

  // const customerRolesMap = React.useMemo(() => {
  //   const rolesMap = new Map<string, Set<string>>();

  //   peopleList?.forEach((person) => {
  //     const nationalId = person?.nationalId?.toString();
  //     if (!nationalId) return;

  //     const roles = new Set<string>();

  //     allDeals?.forEach((deal) => {
  //       if (deal?.buyer?.nationalId?.toString() === nationalId) {
  //         roles.add("خریدار");
  //       }
  //       if (deal?.seller?.nationalId?.toString() === nationalId) {
  //         roles.add("فروشنده");
  //       }
  //     });

  //     if (roles?.size > 0) {
  //       rolesMap.set(nationalId, roles);
  //     }
  //   });

  //   return rolesMap;
  // }, [allDeals, peopleList]);

  // const getPersonRole = (nationalId: string): string => {
  //   const roles = customerRolesMap.get(nationalId);
  //   if (!roles || roles?.size === 0) return "—";

  //   if (roles.has("خریدار") && roles.has("فروشنده")) {
  //     return "خریدار / فروشنده";
  //   }
  //   return Array.from(roles).join(" / ");
  // };

  const handleAllDeals = async () => {
    try {
      const res = await getAllDeals.mutateAsync();
      setAllDeals(res);
    } catch (error) {
      console.log("🚀 ~ handleSelectChassis ~ error:", error);
      setAllDeals([]);
    }
  };

  const relatedDeals = allDeals.filter((deal) => {
    return deal.directCosts.options.some(
      (option) => option.provider?.personId === selectedPersonId,
    );
  });

  const vehiclesData: IVehicleList[] = relatedDeals.map((deal) => {
    return {
      dealId: deal._id,
      vin: deal.vehicleSnapshot.vin,
      model: deal.vehicleSnapshot.model,
      plate: deal.vehicleSnapshot.plateNumber,
      amount: deal.directCosts.options
        .filter((d) => d.provider.personId === selectedPersonId)
        .reduce((sum, d) => sum + Number(d.cost), 0),
    };
  });

  const handleChequeDataByPersonlId = async (personId: string) => {
    try {
      const res = await getChequesByPersonId.mutateAsync(personId);
      setCheques(res.cheques);
    } catch (error) {
      console.log("🚀 ~ handleChequeDataByDealId ~ error:", error);
    }
  };

  const fetchAllDealsCheques = async () => {
    if (allDeals.length === 0) {
      setAllPersonCheques([]);
      return;
    }

    try {
      const chequesPromises = allDeals.map((deal) =>
        getChequesByDealId.mutateAsync(deal._id.toString()),
      );
      const chequesArrays = await Promise.all(chequesPromises);
      const allCheques = chequesArrays.flat();
      setAllPersonCheques(allCheques);
    } catch (error) {
      console.error("Error fetching all deals cheques:", error);
      setAllPersonCheques([]);
    }
  };

  React.useEffect(() => {
    fetchAllDealsCheques();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDeals]);

  const transactionsWithoutCheques = transactions?.filter((t) => {
    if (t.paymentMethod !== "چک") {
      if (selectedDealId && t.dealId !== selectedDealId) {
        return false;
      }
      return true;
    }

    const relatedCheque = allPersonCheques.find(
      (c) => c.relatedTransactionId?.toString() === t._id?.toString(),
    );

    const isChequeValid =
      relatedCheque?.status === "وصول شده" ||
      relatedCheque?.status === "خرج شده";

    if (selectedDealId && t.dealId !== selectedDealId) {
      return false;
    }
    return isChequeValid;
  });

  const filteredPeopleList = React.useMemo(() => {
    if (!searchValue) return peopleList;

    const lowerSearch = searchValue.toLowerCase().trim();

    return peopleList?.filter(
      (user) =>
        user?.fullName?.toLowerCase().includes(lowerSearch) ||
        user?.nationalId?.toString().includes(lowerSearch),
    );
  }, [searchValue, peopleList]);

  const { totalReceived, totalPayment } = React.useMemo(() => {
    if (!selectedNationalId) {
      return { totalReceived: 0, totalPayment: 0 };
    }

    let received = 0;
    let payment = 0;

    // (transactions ?? [])?.forEach((t) => {
    (transactionsWithoutCheques ?? [])?.forEach((t) => {
      if (t?.type === "دریافت" || t?.type === "received") {
        payment += t?.amount || 0;
      } else if (t?.type === "پرداخت" || t?.type === "issued") {
        received += t?.amount || 0;
      }
    });
    return { totalReceived: received, totalPayment: payment };
  }, [selectedNationalId, transactionsWithoutCheques]);

  const diffPaymentReceived = (totalPayment || 0) - (totalReceived || 0);

  React.useEffect(() => {
    const fetchAllDealsTransactions = async () => {
      if (allDeals.length === 0) {
        setAllDealsTransactions([]);
        return;
      }

      try {
        const transactionsPromises = allDeals?.map((deal) =>
          getTransactionsByDealId.mutateAsync(deal?._id.toString()),
        );
        const transactionsArrays = await Promise.all(transactionsPromises);
        const allTransactions = transactionsArrays.flat();
        setAllDealsTransactions(allTransactions);
      } catch (error) {
        console.error("Error fetching all deals transactions:", error);
        setAllDealsTransactions([]);
      }
    };

    fetchAllDealsTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDeals]);

  const customerStatusMap = React.useMemo(() => {
    const statusMap = new Map<string, { status: string; amount: number }>();

    peopleList?.forEach((person) => {
      const nationalId = person?.nationalId?.toString();
      if (!nationalId) return;

      const personDeals = allDeals.filter(
        (deal) =>
          deal?.buyer?.nationalId?.toString() === nationalId ||
          deal?.seller?.nationalId?.toString() === nationalId,
      );

      if (personDeals?.length === 0) {
        statusMap.set(nationalId, { status: "—", amount: 0 });
        return;
      }

      let totalPaidToSeller = 0;
      let totalPurchasePrice = 0;

      personDeals.forEach((deal) => {
        if (deal?.seller?.nationalId?.toString() === nationalId) {
          totalPurchasePrice += deal?.purchasePrice || 0;

          const dealTransactions = allDealsTransactions?.filter(
            (t) => t?.dealId === deal?._id.toString(),
          );

          const paymentsToSeller = dealTransactions
            .filter(
              (t) =>
                t?.type === "پرداخت" &&
                (t?.reason === "خرید خودرو" ||
                  t?.reason?.includes("خريد") ||
                  t?.reason?.includes("خرید")),
            )
            .reduce((sum, t) => sum + (t?.amount || 0), 0);

          totalPaidToSeller += paymentsToSeller;
        }
      });

      let totalReceivedFromBuyer = 0;
      let totalSalePrice = 0;

      personDeals.forEach((deal) => {
        if (deal?.buyer?.nationalId?.toString() === nationalId) {
          totalSalePrice += deal?.salePrice || 0;

          const dealTransactions = allDealsTransactions?.filter(
            (t) => t?.dealId === deal?._id.toString(),
          );

          const receiptsFromBuyer = dealTransactions
            .filter((t) => t?.type === "دریافت" && t?.reason === "فروش")
            .reduce((sum, t) => sum + (t?.amount || 0), 0);

          totalReceivedFromBuyer += receiptsFromBuyer;
        }
      });

      const sellerDebt = totalPurchasePrice - totalPaidToSeller;
      const buyerDebt = totalSalePrice - totalReceivedFromBuyer;

      const walletBalance = buyerDebt - sellerDebt;

      const diff = Math.abs(walletBalance);
      if (diff < 0.01) {
        statusMap.set(nationalId, { status: "تسویه شده", amount: 0 });
      } else {
        statusMap.set(nationalId, {
          status: walletBalance > 0 ? "بدهکار" : "بستانکار",
          amount: Math.abs(walletBalance),
        });
      }
    });

    return statusMap;
  }, [peopleList, allDeals, allDealsTransactions]);

  const lastFetchedIdsRef = React.useRef<string>("");
  const lastSelectedNationalIdRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (selectedNationalId !== lastSelectedNationalIdRef.current) {
      lastFetchedIdsRef.current = "";
      lastSelectedNationalIdRef.current = selectedNationalId;
    }
  }, [selectedNationalId]);

  React.useEffect(() => {
    handleAllDeals();
  }, []);

  React.useEffect(() => {
    if (optionUpdated || transactionCreated) {
      handleAllDeals();
      handleChequeDataByPersonlId(selectedPersonId ?? "");
      fetchAllDealsCheques();
    }
  }, [optionUpdated, transactionCreated]);

  return (
    <>
      <div className="grid grid-cols-3 gap-9 justify-between items-center mt-3">
        <div className="flex justify-between items-center">
          <p className="text-sm">
            مورد جستجو میتواند بخشی از نام و یا کد ملی تامین کننده باشد.
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
          <p className="text-sm">
            {/* تفاضل مبالغ خرید و فروش تامین کننده(فروش - خرید): */}
          </p>
          {/* <p dir="ltr" className="text-yellow-900">
            {formatPrice(diffBuySell?.toLocaleString("en-US"))}
          </p> */}
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm">
            تفاضل مبالغ دریافتی و پرداختی(پرداخت - دریافت):
          </p>
          <p dir="ltr" className="text-yellow-900">
            {formatPrice(diffPaymentReceived?.toLocaleString("en-US"))}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-5 items-start mt-8">
        <div className="h-[33.7rem] max-h-[33.7rem] border border-gray-300 p-4 rounded-md relative w-full">
          <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
            لیست تامین کنندگان
          </p>
          <div
            className="text-blue-500 absolute left-2 -top-5 bg-white py-2 px-4 cursor-pointer"
            onClick={costumerRefreshHandler}
          >
            <RefreshCcwIcon className="w-5 h-4" />
          </div>
          <div className="h-[31rem] max-h-[31rem] overflow-y-auto rounded-md border w-full">
            <Table className="min-w-full table-fixed text-right border-collapse">
              <TableHeader className="top-0 sticky">
                <TableRow className="bg-gray-100">
                  <TableHead className="w-[15%] text-center">ردیف</TableHead>
                  <TableHead className="w-[70%] text-center">
                    نام کامل
                  </TableHead>
                  <TableHead className="w-[80%] text-center">کدملی</TableHead>
                  <TableHead className="w-[70%] text-center">وضعیت</TableHead>
                  <TableHead className="w-[70%] text-center">
                    تراز مالی
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {(filteredPeopleList ?? peopleList ?? [])?.map(
                  (person, index) => {
                    return (
                      <TableRow
                        key={`${person?._id}-${index}`}
                        onClick={() => {
                          setSelectedPersonId(person._id);
                          setSelectedNationalId(person.nationalId.toString());

                          handleChequeDataByPersonlId(person._id);

                          setSelectedDealId(null);
                          setVehicleVin(null);
                        }}
                        className={`cursor-pointer ${
                          selectedNationalId?.toString() ===
                          person.nationalId.toString()
                            ? "bg-gray-200"
                            : "bg-white"
                        }`}
                      >
                        <TableCell className="text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-center">
                          {person.firstName} {person.lastName}
                        </TableCell>
                        <TableCell className="text-center">
                          {person.nationalId}
                        </TableCell>
                        <TableCell className="text-center">
                          {(() => {
                            const status = customerStatusMap.get(
                              person.nationalId?.toString() || "",
                            );
                            const providerStatus =
                              Number(person.wallet.balance.toString()) > 0
                                ? "بستانکار"
                                : "بدهکار";

                            if (!status) return "—";
                            return (
                              <span
                                className={
                                  person.wallet.balance.toLocaleString(
                                    "en-US",
                                  ) === "0"
                                    ? "text-blue-600"
                                    : (providerStatus || status.status) ===
                                        "بدهکار"
                                      ? "text-red-600"
                                      : (providerStatus || status.status) ===
                                          "بستانکار"
                                        ? "text-green-600"
                                        : "text-blue-600"
                                }
                              >
                                {person.wallet.balance.toLocaleString(
                                  "en-US",
                                ) === "0"
                                  ? "تسویه"
                                  : providerStatus}
                              </span>
                            );
                          })()}
                        </TableCell>
                        <TableCell className="text-center">
                          {formatPrice(
                            person.wallet.balance.toLocaleString("en-US"),
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  },
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
              لیست خودرو
            </p>
            <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-[15%] text-center">ردیف</TableHead>
                    <TableHead className="w-[35%] text-center">شاسی</TableHead>
                    <TableHead className="w-[55%] text-center">مدل</TableHead>
                    <TableHead className="w-[35%] text-center">تاریخ</TableHead>
                    <TableHead className="w-[30%] text-center">مبلغ</TableHead>
                  </TableRow>
                </TableHeader>

                {vehiclesData && vehiclesData.length > 0 ? (
                  <TableBody>
                    {vehiclesData.map((item: IVehicleList, index: number) => (
                      <TableRow
                        key={`${item?.dealId}-${index}`}
                        onClick={() => {
                          setVehicleVin(item.vin);
                          setSelectedDealId(item.dealId.toString());
                          dispatch(setChassisNo(item.vin));
                        }}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          vehicleVin === item.vin.toString()
                            ? "bg-blue-100"
                            : ""
                        }`}
                      >
                        <TableCell className="text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.vin}
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.model}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.plate}
                        </TableCell>
                        <TableCell className="text-center">
                          {formatPrice(item.amount?.toLocaleString("en-US"))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                ) : null}
              </Table>
            </div>
            {/* {totalBuyAmount && Number(totalBuyAmount) > 0 ? (
              <p dir="ltr" className="text-yellow-600 mt-3 flex justify-end">
                {formatPrice(totalBuyAmount?.toLocaleString("en-US"))}
              </p>
            ) : null} */}
          </div>
          <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
              لیست خدمات
            </p>
            <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-[10%] text-center">ردیف</TableHead>
                    <TableHead className="w-[70%] text-center">
                      عنوان آپشن
                    </TableHead>
                    <TableHead className="w-[30%] text-center">تاریخ</TableHead>
                    <TableHead className="w-[30%] text-center">مبلغ</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {(filteredOptions ?? [])?.map((item, index) => (
                    <TableRow
                      key={`${item?.id}-${index}`}
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center">
                        {item.description ?? ""}
                      </TableCell>
                      <TableCell className="text-center">{item.date}</TableCell>
                      <TableCell className="text-center">
                        {formatPrice(item.cost?.toLocaleString())}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
                    <TableHead className="w-[20%] text-center">ردیف</TableHead>
                    <TableHead className="w-[30%] text-center">تاریخ</TableHead>
                    <TableHead className="w-[40%] text-center">مبلغ</TableHead>
                    <TableHead className="w-[60%] text-center">
                      تراکنش
                    </TableHead>
                    <TableHead className="w-[40%] text-center">
                      روش پرداخت
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {transactionsWithoutCheques &&
                  transactionsWithoutCheques.length > 0
                    ? transactionsWithoutCheques.map((item, index) => {
                        let customerReason;
                        let customerType;

                        if (item.reason === "خرید خودرو") {
                          customerReason = "فروش خودرو";
                        } else if (item.reason === "فروش") {
                          customerReason = "خرید خودرو";
                        } else {
                          customerReason = item.reason;
                        }

                        if (item.type === "دریافت") {
                          customerType = "پرداخت";
                        } else if (item.type === "پرداخت") {
                          customerType = "دریافت";
                        } else {
                          customerType = item.type;
                        }

                        return (
                          <TableRow
                            key={`${item?._id}-${index}`}
                            className="hover:bg-gray-50 cursor-pointer"
                          >
                            <TableCell className="text-center">
                              {index + 1}
                            </TableCell>
                            <TableCell className="text-center">
                              {item.transactionDate}
                            </TableCell>
                            <TableCell className="text-center">
                              {formatPrice(
                                item?.amount?.toLocaleString("en-US"),
                              ) ?? ""}
                            </TableCell>
                            <TableCell className="text-center">
                              {customerType} - {customerReason}
                            </TableCell>
                            <TableCell className="text-center">
                              {item.paymentMethod}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    : null}
                </TableBody>
              </Table>
            </div>
            {transactions && transactions.length > 0 && (
              <div className="flex justify-between items-center gap-2">
                <div className="flex gap-3 items-baseline">
                  <p className="text-sm">پرداخت</p>
                  <p dir="ltr" className="text-red-500 mt-3 flex justify-end">
                    {formatPrice(totalPayment?.toLocaleString("en-US"))}
                  </p>
                </div>
                <div className="flex gap-3 items-baseline">
                  <p className="text-sm">دریافت</p>
                  <p dir="ltr" className="text-blue-500 mt-3 flex justify-end">
                    {formatPrice(totalReceived?.toLocaleString("en-US"))}
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
                    <TableHead className="w-[30%] text-center">ردیف</TableHead>
                    <TableHead className="w-[70%] text-center">
                      سریال چک
                    </TableHead>
                    <TableHead className="w-[70%] text-center">
                      شناسه صیادی
                    </TableHead>
                    <TableHead className="w-[90%] text-center">مبلغ</TableHead>
                    <TableHead className="w-[60%] text-center">
                      تاریخ سررسید
                    </TableHead>
                    <TableHead className="w-[50%] text-center">
                      روش پرداخت
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredCheques?.map((item, index) => (
                    <TableRow
                      key={`${item?._id}-${index}`}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center">
                        {item?.chequeNumber ?? ""}
                      </TableCell>
                      <TableCell className="text-center">
                        {item?.sayadiID ?? ""}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatPrice(item?.amount?.toLocaleString("en-US")) ??
                          ""}
                      </TableCell>
                      <TableCell className="text-center">
                        {item?.dueDate ?? "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {item?.type === "issued" || item?.type === "صادره"
                          ? "صادره"
                          : item?.type === "received" || item?.type === "وارده"
                            ? "وارده"
                            : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default ProvidersDashboard;
