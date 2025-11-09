"use client";
import useGetAllCars from "@/hooks/useGetAllCars";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

const VehicleList = () => {
  const getAllCars = useGetAllCars();
  return (
    getAllCars.data && (
      <div className="border border-gray-300 p-4 rounded-md w-full mt-7">
        <div className="max-h-[33rem] overflow-y-auto rounded-md border w-full">
          <Table className="min-w-full table-fixed text-right border-collapse">
            <TableHeader className="top-0 sticky">
              <TableRow className="hover:bg-transparent bg-gray-100">
                <TableHead className="text-center">ردیف</TableHead>
                <TableHead className="text-center">شاسی</TableHead>
                <TableHead className="text-center">مدل ماشین</TableHead>
                <TableHead className="text-center">کدملی خریدار</TableHead>
                <TableHead className="text-center">کدملی فروشنده</TableHead>
                <TableHead className="text-center">مبلغ فروش</TableHead>
                <TableHead className="text-center">مبلغ خرید</TableHead>
                <TableHead className="text-center">پلاک</TableHead>
                <TableHead className="text-center">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getAllCars?.data?.map((item, index) => (
                <TableRow
                  key={`${item?._id}-${index}`}
                  className="has-data-[state=checked]:bg-muted/50"
                >
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">
                    {item?.ChassisNo ? item?.ChassisNo : "_"}
                  </TableCell>
                  <TableCell className="text-center">
                    {item?.CarModel ? item?.CarModel : "_"}
                  </TableCell>
                  <TableCell className="text-center">
                    {item?.BuyerNationalID ? item?.BuyerNationalID : "_"}
                  </TableCell>
                  <TableCell className="text-center">
                    {item?.SellerNationalID ? item?.SellerNationalID : "_"}
                  </TableCell>
                  <TableCell className="text-center">
                    {item?.SaleAmount
                      ? item?.SaleAmount.toLocaleString("en-US")
                      : "_"}
                  </TableCell>
                  <TableCell className="text-center">
                    {item?.PurchaseAmount
                      ? item?.PurchaseAmount.toLocaleString("en-US")
                      : "_"}
                  </TableCell>
                  <TableCell className="text-center">
                    {item?.LicensePlate ? item?.LicensePlate : "_"}
                  </TableCell>
                  <TableCell className="text-center flex gap-3 items-center justify-center">
                    <Pencil className="w-4 h-4 cursor-pointer" />
                    {/* <Trash2 className="w-4 h-4 cursor-pointer" /> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  );
};

export default VehicleList;
