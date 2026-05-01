import useGetAllTransactions from "@/hooks/useGetAllTransaction";
import { IDeal, ITransactionNew, IVehicle } from "@/types/new-backend-types";
import { FileDown } from "lucide-react";
import * as XLSX from "xlsx";

interface IExportToExcel {
  filteredVehicleList: IVehicle[] | undefined;
  allDeals: IDeal[];
}

export const calculateProfit = ({
  allDeals,
  allTransactions,
  vin,
}: {
  allDeals: IDeal[];
  allTransactions: ITransactionNew[];
  vin: string;
}) => {
  const dealsData = allDeals?.filter((d) => d.vehicleSnapshot.vin === vin);

  const selectedDeal = Array.isArray(dealsData) ? dealsData : [dealsData];
  const deal = selectedDeal?.[0];

  const dealId = deal?._id?.toString();
  const transactions = allTransactions.filter((t) => t.dealId === dealId);

  if (!deal) {
    return {
      netProfit: null,
      lastNetProfit: null,
      totalOtherCosts: 0,
      totalOptionsDeals: 0,
      grossProfit: null,
      lastGrossProfit: null,
    };
  }

  const otherCostCategories =
    deal.directCosts?.otherCost?.map((cost) => cost.category) || [];

  const otherCostsFromDirectCosts =
    deal.directCosts?.otherCost?.reduce(
      (sum, cost) => sum + (cost.cost || 0),
      0,
    ) || 0;

  const otherCostsFromTransactions =
    (transactions ?? [])
      ?.filter(
        (t) =>
          t.type === "پرداخت" &&
          otherCostCategories.some((category) => t.reason === category),
      )
      .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

  const otherOptionsTransaction =
    transactions
      ?.filter((el) => el.reason === "سایر هزینه‌ها")
      .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

  const totalOtherCosts =
    otherCostsFromDirectCosts +
    otherCostsFromTransactions +
    otherOptionsTransaction;

  const totalOptionsDeals =
    deal.directCosts?.options?.reduce(
      (sum, cost) => sum + (Number(cost.cost) || 0),
      0,
    ) || 0;

  let lastGrossProfit: number | null = null;
  if (deal.purchasePrice != null && deal.salePrice != null) {
    lastGrossProfit = deal.salePrice - deal.purchasePrice;
  }

  let halfProfit: number | null = null;
  halfProfit = (lastGrossProfit || 0) - totalOptionsDeals - totalOtherCosts;

  let grossProfit: number | null = null;
  if (deal.purchasePrice != null || deal.salePrice != null) {
    grossProfit = (deal.salePrice ?? 0) - (deal.purchasePrice ?? 0);
  }

  let buyAmountWithPercent: number | null = null;
  let sellAmountWithPercent: number | null = null;

  const buyAmountWithoutPercent = (deal.purchasePrice ?? 0) - totalOtherCosts;
  const sellAmountWithoutPercent = (deal.salePrice ?? 0) - totalOtherCosts;

  const isLastCalculate = process.env.NEXT_PUBLIC_PROFIT_CALCULATE;

  if (isLastCalculate) {
    buyAmountWithPercent =
      (buyAmountWithoutPercent *
        parseFloat(String(deal.purchaseBroker?.commissionPercent || 0))) /
      100;
    sellAmountWithPercent =
      (sellAmountWithoutPercent *
        parseFloat(String(deal.saleBroker?.commissionPercent || 0))) /
      100;
  } else {
    buyAmountWithPercent =
      ((halfProfit || 0) *
        parseFloat(String(deal.purchaseBroker?.commissionPercent || 0))) /
      100;
    sellAmountWithPercent =
      ((halfProfit || 0) *
        parseFloat(String(deal.saleBroker?.commissionPercent || 0))) /
      100;
  }

  if (deal.salePrice == null) {
    const amountWithoutPercent = (deal.purchasePrice ?? 0) - totalOtherCosts;
    buyAmountWithPercent =
      (amountWithoutPercent *
        parseFloat(String(deal.purchaseBroker?.commissionPercent || 0))) /
      100;
  }

  let netProfit: number | null = null;
  if (grossProfit !== null) {
    const totalBrokerCommissions =
      (buyAmountWithPercent || 0) + (sellAmountWithPercent || 0);
    netProfit = grossProfit - (totalOtherCosts + totalBrokerCommissions);
  }

  let lastNetProfit: number | null = null;
  if (isLastCalculate) {
    if (lastGrossProfit !== null && deal.salePrice != null) {
      lastNetProfit =
        lastGrossProfit -
        totalOtherCosts -
        sellAmountWithPercent -
        buyAmountWithPercent -
        totalOptionsDeals;
    }
  } else {
    if (lastGrossProfit !== null && deal.salePrice != null) {
      lastNetProfit = halfProfit - buyAmountWithPercent - sellAmountWithPercent;
    }
  }

  return {
    netProfit,
    lastNetProfit,
    totalOtherCosts,
    totalOptionsDeals,
    grossProfit,
    lastGrossProfit,
  };
};

interface IExportExcelVehicleReport {
  filteredVehicleList: IVehicle[] | undefined;
  allDeals: IDeal[];
}

export const ExportExcelVehicleReport: React.FC<IExportExcelVehicleReport> = ({
  allDeals,
  filteredVehicleList,
}) => {
  const { data: allTransactions } = useGetAllTransactions();

  const exportToExcel = ({ allDeals, filteredVehicleList }: IExportToExcel) => {
    const data = (filteredVehicleList ?? []).map((vehicle, index) => {
      const relatedDeal = (allDeals ?? []).find(
        (el) => el.vehicleSnapshot?.vin === vehicle.vin,
      );

      const { lastNetProfit } = calculateProfit({
        allDeals: allDeals,
        allTransactions: allTransactions as ITransactionNew[],
        vin: relatedDeal?.vehicleSnapshot.vin || "",
      });

      const options =
        relatedDeal?.directCosts?.options?.reduce(
          (sum, t) => sum + (t?.cost || 0),
          0,
        ) || 0;

      const costs =
        relatedDeal?.directCosts?.otherCost?.reduce(
          (sum, t) => sum + (t?.cost || 0),
          0,
        ) || 0;

      return {
        ردیف: index + 1,
        شاسی: vehicle.vin || "—",
        "مدل ماشین": vehicle.model || "—",
        پلاک: vehicle.plateNumber || "—",
        "طرف اول": relatedDeal?.seller?.fullName || "—",
        "طرف دوم": relatedDeal?.buyer?.fullName || "—",
        "کارگزار خرید": relatedDeal?.purchaseBroker?.fullName || "—",
        "درصد کارگزار خرید":
          relatedDeal?.purchaseBroker?.commissionPercent || "—",
        "کارگزار فروش": relatedDeal?.saleBroker?.fullName || "—",
        "درصد کارگزار فروش": relatedDeal?.saleBroker?.commissionPercent || "—",
        "مبلغ خرید": relatedDeal?.purchasePrice || "—",
        "مبلغ فروش": relatedDeal?.salePrice || "—",
        آپشن: options || 0,
        هزینه: costs || 0,
        "سود خالص":
          vehicle.status !== "sold"
            ? "—"
            : lastNetProfit != null
              ? lastNetProfit
              : "—",
        منشی: vehicle.SecretaryName || "—",
        مدارک: Array.isArray(vehicle.documents)
          ? vehicle.documents.length === 0
            ? "فاقد مدارک"
            : vehicle.documents.length >= 4
              ? "کامل"
              : "ناقص"
          : (vehicle.documents ?? "—"),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vehicles");
    XLSX.writeFile(workbook, "vehicles.xlsx");
  };

  return (
    <button
      onClick={() => exportToExcel({ allDeals, filteredVehicleList })}
      title="خروجی اکسل"
      className="cursor-pointer"
    >
      <FileDown className="w-6 h-6 text-gray-600" />
    </button>
  );
};
