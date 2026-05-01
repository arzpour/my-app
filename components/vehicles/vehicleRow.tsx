import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";
import { formatPrice } from "@/utils/systemConstants";
import { IVehicle, IDeal } from "@/types/new-backend-types";
import useCalculateVehicleProfit from "@/hooks/useCalculateVehicleProfit";

interface VehicleRowProps {
  vehicle: IVehicle;
  index: number;
  relatedDeal: IDeal | undefined;
  onEdit: (vehicle: IVehicle) => void;
  onDelete: (vehicle: IVehicle) => void;
}

const VehicleRow: React.FC<VehicleRowProps> = ({
  vehicle,
  index,
  relatedDeal,
  onEdit,
  onDelete,
}) => {
  const { lastNetProfit, isLoading: profitLoading } =
    useCalculateVehicleProfit(vehicle.vin);

  const options =
    relatedDeal?.directCosts.options?.reduce(
      (sum, t) => sum + parseInt(t?.cost.toString() || "0"),
      0
    ) || 0;
  const costs =
    relatedDeal?.directCosts.otherCost?.reduce(
      (sum, t) => sum + parseInt(t?.cost.toString() || "0"),
      0
    ) || 0;

  const getDocumentsStatus = () => {
    if (!Array.isArray(vehicle.documents)) {
      return vehicle.documents ?? "—";
    }
    if (vehicle.documents.length === 0) {
      return "فاقد مدارک";
    }
    if (vehicle.documents.length >= 4) {
      return "کامل";
    }
    return "ناقص";
  };

  const documentsStatus = getDocumentsStatus();

  return (
    <TableRow
      key={`${vehicle._id}-${index}`}
      className="has-data-[state=checked]:bg-muted/50"
    >
      <TableCell className="text-center">{index + 1}</TableCell>
      <TableCell className="text-center">{vehicle.vin || "—"}</TableCell>
      <TableCell className="text-center">{vehicle.model || "—"}</TableCell>
      <TableCell className="text-center">{vehicle?.plateNumber || "—"}</TableCell>
      <TableCell className="text-center">
        {relatedDeal?.seller?.fullName || "—"}
      </TableCell>
      <TableCell className="text-center">
        {relatedDeal?.buyer?.fullName || "—"}
      </TableCell>
      <TableCell className="text-center">
        {relatedDeal?.purchaseBroker?.fullName || "—"} /{" "}
        {relatedDeal?.purchaseBroker?.commissionPercent || "—"}
      </TableCell>
      <TableCell className="text-center">
        {relatedDeal?.saleBroker?.fullName || "—"} /{" "}
        {relatedDeal?.saleBroker?.commissionPercent || "—"}
      </TableCell>
      <TableCell
        title={formatPrice(relatedDeal?.purchasePrice)}
        className="text-center truncate"
      >
        {relatedDeal?.purchasePrice != null
          ? formatPrice(relatedDeal.purchasePrice)
          : "—"}
      </TableCell>
      <TableCell
        title={formatPrice(relatedDeal?.salePrice)}
        className="text-center truncate"
      >
        {relatedDeal?.salePrice != null
          ? formatPrice(relatedDeal.salePrice)
          : "—"}
      </TableCell>
      <TableCell
        title={formatPrice(options)}
        className="text-center truncate"
      >
        {formatPrice(options) || "—"}
      </TableCell>
      <TableCell
        title={formatPrice(costs)}
        className="text-center truncate"
      >
        {formatPrice(costs) || "—"}
      </TableCell>
      <TableCell className="text-center">
        {profitLoading ? "..." : formatPrice(lastNetProfit || 0) || "—"}
      </TableCell>
      <TableCell
        title={vehicle.SecretaryName}
        className="text-center truncate"
      >
        {vehicle.SecretaryName || "—"}
      </TableCell>
      <TableCell className="text-center">{documentsStatus}</TableCell>
      <TableCell className="text-center flex gap-3 items-center justify-center">
        <Pencil
          className="w-4 h-4 cursor-pointer hover:text-indigo-500"
          onClick={() => onEdit(vehicle)}
        />
        <Trash
          className="w-4 h-4 cursor-pointer hover:text-red-500"
          onClick={() => onDelete(vehicle)}
        />
      </TableCell>
    </TableRow>
  );
};

export default VehicleRow;