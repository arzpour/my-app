"use client";
import { useGetChequesByDealId } from "@/apis/mutations/cheques";
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

const CustomersDashboard = () => {
  const [selectedNationalId, setSelectedNationalId] = React.useState<
    string | null
  >(null);
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [allDeals, setAllDeals] = React.useState<IDeal[]>([]);
  const [allPersonTransactions, setAllPersonTransactions] = React.useState<
    ITransactionNew[]
  >([]);
  const [transactions, setTransactions] = React.useState<ITransactionNew[]>([]);
  const [cheques, setCheques] = React.useState<IChequeNew[]>([]);

  const getTransactionsByDealId = useGetTransactionsByDealId();
  const getChequesByDealId = useGetChequesByDealId();
  const { data: allPeople } = useGetAllPeople();
  const getAllDeals = useGetAllDeals();

  const peopleList = allPeople
    ?.map((person) => (person.roles.includes("customer") ? person : null))
    .filter((person) => person !== null);

  const getCustomersRole = allDeals?.map((deal) => {
    const peopleRoles = peopleList?.map((person) => {
      const roles =
        deal.buyer.nationalId.toString() === person.nationalId?.toString()
          ? { role: "خریدار", nationalId: person.nationalId?.toString() }
          : deal.seller.nationalId.toString() === person.nationalId?.toString()
          ? { role: "فروشنده", nationalId: person.nationalId?.toString() }
          : {
              role: "خریدار / فروشنده",
              nationalId: person.nationalId?.toString(),
            };
      return roles;
    });
    return peopleRoles;
  });

  const handleAllDeals = async () => {
    try {
      const res = await getAllDeals.mutateAsync();
      setAllDeals(res);
    } catch (error) {
      console.log("🚀 ~ handleSelectChassis ~ error:", error);
      setAllDeals([]);
    }
  };

  const selectedPersonDeals = React.useMemo(() => {
    if (!selectedNationalId || allDeals.length === 0) return [];
    return allDeals.filter(
      (deal) =>
        deal.buyer.nationalId === selectedNationalId ||
        deal.seller.nationalId === selectedNationalId
    );
  }, [allDeals, selectedNationalId]);

  const carSeller = React.useMemo(() => {
    return selectedPersonDeals.filter(
      (deal) => deal.seller.nationalId === selectedNationalId
    );
  }, [selectedPersonDeals, selectedNationalId]);

  const carBuyer = React.useMemo(() => {
    return selectedPersonDeals.filter(
      (deal) => deal.buyer.nationalId === selectedNationalId
    );
  }, [selectedPersonDeals, selectedNationalId]);

  const handleTransationDataByDealId = async (dealId: string) => {
    try {
      const res = await getTransactionsByDealId.mutateAsync(dealId ?? "");
      setTransactions(res);
    } catch (error) {
      console.log("🚀 ~ handleTransationDataByDealId ~ error:", error);
    }
  };

  const handleChequeDataByDealId = async (dealId: string) => {
    try {
      const res = await getChequesByDealId.mutateAsync(dealId);
      setCheques(res);
    } catch (error) {
      console.log("🚀 ~ handleChequeDataByDealId ~ error:", error);
    }
  };

  const filteredPeopleList = React.useMemo(() => {
    if (!searchValue) return peopleList;

    const lowerSearch = searchValue.toLowerCase().trim();

    return peopleList?.filter(
      (user) =>
        user.fullName?.toLowerCase().includes(lowerSearch) ||
        user.nationalId?.toString().includes(lowerSearch)
    );
  }, [searchValue, peopleList]);

  // const personsRole = React.useMemo(() => {
  //   return filteredPeopleList?.map((person) =>
  //     person.wallet.transactions.map((transaction) =>
  //       transaction.type === "commission"
  //         ? "فروشنده"
  //         : transaction.type === "deposit"
  //         ? "خریدار"
  //         : ["commission", "deposit"].includes(transaction.type)
  //         ? "خریدار / فروشنده"
  //         : "-"
  //     )
  //   );
  // }, [peopleList]);

  // const personsRole2 = filteredPeopleList?.map((person) =>
  //   person.wallet.transactions.map((transaction) =>
  //     transaction.type === "commission"
  //       ? "فروشنده"
  //       : transaction.type === "deposit"
  //       ? "خریدار"
  //       : ["commission", "deposit"].includes(transaction.type)
  //       ? "خریدار / فروشنده"
  //       : "-"
  //   )
  // );
  // console.log("🚀 ~ CustomersDashboard ~ personsRole:", personsRole);
  // console.log("🚀 ~ CustomersDashboard ~ personsRole2:", personsRole2);

  const totalBuyAmount = carBuyer.reduce(
    (sum, deal) => sum + (deal.purchasePrice || 0),
    0
  );

  const totalSellAmount = carSeller.reduce(
    (sum, deal) => sum + (deal.salePrice || 0),
    0
  );

  const diffBuySell = (totalSellAmount || 0) - (totalBuyAmount || 0);

  // const calculateCustomerStatus = (person: any) => {
  //   if (selectedNationalId === person.nationalId.toString() && customerStatus) {
  //     return customerStatus.status;
  //   }
  //   return "—";
  // };

  const selectedPersonDealIds = React.useMemo(() => {
    return selectedPersonDeals
      .map((deal) => deal._id.toString())
      .sort()
      .join(",");
  }, [selectedPersonDeals]);

  const { totalReceived, totalPayment } = React.useMemo(() => {
    if (!selectedNationalId || allPersonTransactions.length === 0) {
      return { totalReceived: 0, totalPayment: 0 };
    }

    let received = 0;
    let payment = 0;

    selectedPersonDeals.forEach((deal) => {
      const dealTransactions = allPersonTransactions.filter(
        (t) => t.dealId === deal._id.toString()
      );

      // Calculate as seller: payments TO seller
      if (deal.seller.nationalId === selectedNationalId) {
        const sellerPersonId = deal.seller.personId?.toString();
        const paymentsToSeller = dealTransactions
          .filter(
            (t) =>
              t.type === "پرداخت" && t.personId?.toString() === sellerPersonId
          )
          .reduce((sum, t) => sum + (t.amount || 0), 0);
        payment += paymentsToSeller;
      }

      // Calculate as buyer: receipts FROM buyer
      if (deal.buyer.nationalId === selectedNationalId) {
        const buyerPersonId = deal.buyer.personId?.toString();
        const receiptsFromBuyer = dealTransactions
          .filter(
            (t) =>
              t.type === "دریافت" && t.personId?.toString() === buyerPersonId
          )
          .reduce((sum, t) => sum + (t.amount || 0), 0);
        received += receiptsFromBuyer;
      }
    });

    return { totalReceived: received, totalPayment: payment };
  }, [selectedNationalId, selectedPersonDealIds, allPersonTransactions]);

  const diffPaymentReceived = (totalPayment || 0) - (totalReceived || 0);

  // const uniqeUsersRole = (userRole: string[] | undefined) => {
  //   if (!userRole || userRole.length === 0) {
  //     return "—";
  //   }

  //   const roles = userRole.map((r) => r.toLowerCase());
  //   const hasBuyer = roles.includes("buyer") || roles.includes("خریدار");
  //   const hasSeller = roles.includes("seller") || roles.includes("فروشنده");
  //   const hasBroker = roles.includes("broker") || roles.includes("کارگزار");
  //   const hasCustomer = roles.includes("customer") || roles.includes("مشتری");

  //   // Build role labels array
  //   const roleLabels: string[] = [];

  //   if (hasBuyer && hasSeller) {
  //     roleLabels.push("خریدار / فروشنده");
  //   } else {
  //     if (hasBuyer) roleLabels.push("خریدار");
  //     if (hasSeller) roleLabels.push("فروشنده");
  //   }

  //   if (hasBroker) roleLabels.push("کارگزار");
  //   if (hasCustomer && !hasBuyer && !hasSeller) roleLabels.push("مشتری");

  //   return roleLabels.length > 0 ? roleLabels.join(" / ") : "—";
  // };

  const customerStatus = React.useMemo(() => {
    if (!selectedNationalId || selectedPersonDeals.length === 0) {
      return null;
    }

    // Calculate as seller
    let totalPaidToSeller = 0;
    let totalPurchasePrice = 0;

    selectedPersonDeals.forEach((deal) => {
      if (deal.seller.nationalId === selectedNationalId) {
        totalPurchasePrice += deal.purchasePrice || 0;

        const sellerPersonId = deal.seller.personId?.toString();
        const dealTransactions = allPersonTransactions.filter(
          (t) => t.dealId === deal._id.toString()
        );

        const paymentsToSeller = dealTransactions
          .filter(
            (t) =>
              t.type === "پرداخت" && t.personId?.toString() === sellerPersonId
          )
          .reduce((sum, t) => sum + (t.amount || 0), 0);

        totalPaidToSeller += paymentsToSeller;
      }
    });

    // Calculate as buyer
    let totalReceivedFromBuyer = 0;
    let totalSalePrice = 0;

    selectedPersonDeals.forEach((deal) => {
      if (deal.buyer.nationalId === selectedNationalId) {
        totalSalePrice += deal.salePrice || 0;

        const buyerPersonId = deal.buyer.personId?.toString();
        const dealTransactions = allPersonTransactions.filter(
          (t) => t.dealId === deal._id.toString()
        );

        const receiptsFromBuyer = dealTransactions
          .filter(
            (t) =>
              t.type === "دریافت" && t.personId?.toString() === buyerPersonId
          )
          .reduce((sum, t) => sum + (t.amount || 0), 0);

        totalReceivedFromBuyer += receiptsFromBuyer;
      }
    });

    const sellerDebt = totalPurchasePrice - totalPaidToSeller;
    const buyerDebt = totalSalePrice - totalReceivedFromBuyer;

    const netDebt = sellerDebt - buyerDebt;

    const diff = Math.abs(netDebt);
    if (diff < 0.01) {
      return { status: "تسویه شده", amount: 0 };
    }

    return {
      // status: netDebt > 0 ? "بدهکار" : "بستانکار",
      status: netDebt > 0 ? "بستانکار" : "بدهکار",
      amount: Math.abs(netDebt),
    };
  }, [selectedNationalId, selectedPersonDealIds, allPersonTransactions]);

  const isFetchingRef = React.useRef(false);
  const lastFetchedIdsRef = React.useRef<string>("");
  const lastSelectedNationalIdRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (selectedNationalId !== lastSelectedNationalIdRef.current) {
      lastFetchedIdsRef.current = "";
      lastSelectedNationalIdRef.current = selectedNationalId;
    }
  }, [selectedNationalId]);

  React.useEffect(() => {
    if (selectedPersonDealIds === lastFetchedIdsRef.current) {
      return;
    }

    const fetchAllPersonTransactions = async () => {
      if (!selectedNationalId || selectedPersonDeals.length === 0) {
        setAllPersonTransactions([]);
        lastFetchedIdsRef.current = "";
        return;
      }

      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      try {
        const transactionsPromises = selectedPersonDeals.map((deal) =>
          getTransactionsByDealId.mutateAsync(deal._id.toString())
        );
        const transactionsArrays = await Promise.all(transactionsPromises);
        const allTransactions = transactionsArrays.flat();
        setAllPersonTransactions(allTransactions);
        lastFetchedIdsRef.current = selectedPersonDealIds;
      } catch (error) {
        console.log("🚀 ~ fetchAllPersonTransactions ~ error:", error);
        setAllPersonTransactions([]);
        lastFetchedIdsRef.current = "";
      } finally {
        isFetchingRef.current = false;
      }
    };

    fetchAllPersonTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNationalId, selectedPersonDealIds]);

  React.useEffect(() => {
    handleAllDeals();
  }, []);

  return (
    <>
      <div className="grid grid-cols-3 gap-9 justify-between items-center mt-3">
        <div className="flex justify-between items-center">
          <p className="text-sm">
            مورد جستجو میتواند بخشی از نام و یا کد ملی مشتری باشد.
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
          <p className="text-sm">تفاضل مبالغ خرید و فروش مشتری(فروش - خرید):</p>
          <p className="text-yellow-900">
            {diffBuySell?.toLocaleString("en-US")}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm">
            تفاضل مبالغ دریافتی و پرداختی(پرداخت - دریافت):
          </p>
          <p className="text-yellow-900">
            {diffPaymentReceived?.toLocaleString("en-US")}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-5 items-start mt-8">
        <div className="h-[33.7rem] max-h-[33.7rem] border border-gray-300 p-4 rounded-md relative w-full">
          <p className="text-blue-500 absolute right-2 -top-5 bg-white py-2 px-4">
            لیست مشتریان
          </p>
          <div className="h-[25rem] max-h-[25rem] overflow-y-auto rounded-md border w-full">
            <Table className="min-w-full table-fixed text-right border-collapse">
              <TableHeader className="top-0 sticky">
                <TableRow className="bg-gray-100">
                  <TableHead className="w-[15%] text-center">ردیف</TableHead>
                  <TableHead className="w-[65%] text-center">
                    نام کامل
                  </TableHead>
                  <TableHead className="w-[30%] text-center">کدملی</TableHead>
                  <TableHead className="w-[30%] text-center">نقش</TableHead>
                  {/* <TableHead className="w-[30%] text-center">وضعیت</TableHead> */}
                </TableRow>
              </TableHeader>

              <TableBody>
                {(filteredPeopleList ?? peopleList ?? [])?.map(
                  (person, index) => {
                    return (
                      <TableRow
                        key={`${person?._id}-${index}`}
                        onClick={() => {
                          // handleAllDeals();
                          setSelectedNationalId(person.nationalId.toString());
                          setTransactions([]);
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
                          {person.fullName}
                        </TableCell>
                        <TableCell className="text-center">
                          {person.nationalId}
                        </TableCell>
                        <TableCell className="text-center">
                          {getCustomersRole?.map((role) =>
                            role?.map((customerRole) =>
                              customerRole.nationalId ===
                              person.nationalId?.toString()
                                ? customerRole.role
                                : " "
                            )
                          )}
                        </TableCell>
                        {/* <TableCell className="text-center">
                          {calculateCustomerStatus(person)}
                        </TableCell> */}
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          </div>
          {selectedNationalId && customerStatus && (
            <div className="mt-4 p-4 border border-gray-300 rounded-md bg-gray-50">
              <h3 className="text-sm font-bold mb-2 text-blue-900">
                وضعیت نهایی مشتری
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-sm">وضعیت:</span>
                <span
                  className={`text-sm font-bold ${
                    customerStatus.status === "بدهکار"
                      ? "text-red-600"
                      : customerStatus.status === "بستانکار"
                      ? "text-green-600"
                      : "text-blue-600"
                  }`}
                >
                  {customerStatus.status}
                </span>
                <span className="text-sm">مبلغ:</span>
                <span className="text-sm font-bold">
                  {customerStatus.amount.toLocaleString("en-US")}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
              فروشنده خودرو
            </p>
            <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-[15%] text-center">ردیف</TableHead>
                    <TableHead className="w-[35%] text-center">شاسی</TableHead>
                    <TableHead className="w-[55%] text-center">مدل</TableHead>
                    <TableHead className="w-[35%] text-center">تاریخ</TableHead>
                    <TableHead className="w-[30%] text-center">قیمت</TableHead>
                  </TableRow>
                </TableHeader>

                {carSeller && carSeller.length > 0
                  ? carSeller.map((deal: IDeal, index: number) => (
                      <TableRow
                        key={`${deal?._id}-${index}`}
                        onClick={() => {
                          handleTransationDataByDealId(deal._id.toString());
                          handleChequeDataByDealId(deal._id.toString());
                        }}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <TableCell className="text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-center">
                          {deal.vehicleSnapshot?.vin}
                        </TableCell>
                        <TableCell className="text-center">
                          {deal.vehicleSnapshot?.model}
                        </TableCell>
                        <TableCell className="text-center">
                          {deal.saleDate}
                        </TableCell>
                        <TableCell className="text-center">
                          {deal.salePrice?.toLocaleString("en-US")}
                        </TableCell>
                      </TableRow>
                    ))
                  : null}
              </Table>
            </div>
            {totalSellAmount && Number(totalSellAmount) > 0 ? (
              <p className="text-green-400 mt-3 flex justify-end">
                {totalSellAmount?.toLocaleString("en-US")}
              </p>
            ) : null}
          </div>
          <div className="h-[16rem] max-h-[16rem] border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-500 absolute right-2 -top-6 bg-white py-2 px-4">
              خریدار خودرو
            </p>
            <div className="h-[12rem] max-h-[12rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader className="top-0 sticky">
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-[15%] text-center">ردیف</TableHead>
                    <TableHead className="w-[35%] text-center">شاسی</TableHead>
                    <TableHead className="w-[55%] text-center">مدل</TableHead>
                    <TableHead className="w-[35%] text-center">تاریخ</TableHead>
                    <TableHead className="w-[30%] text-center">قیمت</TableHead>
                  </TableRow>
                </TableHeader>

                {carBuyer && carBuyer.length > 0 ? (
                  <TableBody>
                    {carBuyer.map((deal: IDeal, index: number) => (
                      <TableRow
                        key={`${deal?._id}-${index}`}
                        onClick={() => {
                          handleTransationDataByDealId(deal._id.toString());
                          handleChequeDataByDealId(deal._id.toString());
                        }}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <TableCell className="text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-center">
                          {deal.vehicleSnapshot?.vin}
                        </TableCell>
                        <TableCell className="text-center">
                          {deal.vehicleSnapshot?.model}
                        </TableCell>
                        <TableCell className="text-center">
                          {deal.purchaseDate}
                        </TableCell>
                        <TableCell className="text-center">
                          {deal.purchasePrice?.toLocaleString("en-US")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                ) : null}
              </Table>
            </div>
            {totalBuyAmount && Number(totalBuyAmount) > 0 ? (
              <p className="text-yellow-600 mt-3 flex justify-end">
                {totalBuyAmount?.toLocaleString("en-US")}
              </p>
            ) : null}
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
                    <TableHead className="w-12 text-center">ردیف</TableHead>
                    <TableHead className="w-12 text-center">تاریخ</TableHead>
                    <TableHead className="w-12 text-center">مبلغ</TableHead>
                    <TableHead className="w-12 text-center">تراکنش</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {transactions && transactions.length > 0
                    ? transactions.map((item, index) => (
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
                            {item?.amount?.toLocaleString("en-US") ?? ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.type} - {item.reason}
                          </TableCell>
                        </TableRow>
                      ))
                    : null}
                </TableBody>
              </Table>
            </div>
            {transactions && transactions.length > 0 && (
              <div className="flex justify-between items-center gap-2">
                <div className="flex gap-3 items-baseline">
                  <p className="text-sm">پرداخت</p>
                  <p className="text-red-500 mt-3 flex justify-end">
                    {totalPayment?.toLocaleString("en-US")}
                  </p>
                </div>
                <div className="flex gap-3 items-baseline">
                  <p className="text-sm">دریافت</p>
                  <p className="text-blue-500 mt-3 flex justify-end">
                    {totalReceived?.toLocaleString("en-US")}
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
                    <TableHead className="w-12 text-center">ردیف</TableHead>
                    <TableHead className="w-12 text-center">سریال چک</TableHead>
                    <TableHead className="w-12 text-center">
                      شناسه صیادی
                    </TableHead>
                    <TableHead className="w-12 text-center">مبلغ</TableHead>
                    <TableHead className="w-12 text-center">
                      تاریخ سررسید
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {cheques?.map((item, index) => (
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
                        {item?.amount?.toLocaleString("en-US") ?? ""}
                      </TableCell>
                      <TableCell className="text-center">
                        {item?.dueDate ?? ""}
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

export default CustomersDashboard;
