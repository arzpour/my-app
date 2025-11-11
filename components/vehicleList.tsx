// "use client";
// import useGetAllCars from "@/hooks/useGetAllCars";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Pencil } from "lucide-react";

// const VehicleList = () => {
//   const getAllCars = useGetAllCars();
//   return (
//     getAllCars.data && (
//       <div className="border border-gray-300 p-4 rounded-md w-full mt-7">
//         <div className="max-h-[33rem] overflow-y-auto rounded-md border w-full">
//           <Table className="min-w-full table-fixed text-right border-collapse">
//             <TableHeader className="top-0 sticky">
//               <TableRow className="hover:bg-transparent bg-gray-100">
//                 <TableHead className="text-center">ردیف</TableHead>
//                 <TableHead className="text-center">شاسی</TableHead>
//                 <TableHead className="text-center">مدل ماشین</TableHead>
//                 <TableHead className="text-center">کدملی خریدار</TableHead>
//                 <TableHead className="text-center">کدملی فروشنده</TableHead>
//                 <TableHead className="text-center">مبلغ فروش</TableHead>
//                 <TableHead className="text-center">مبلغ خرید</TableHead>
//                 <TableHead className="text-center">پلاک</TableHead>
//                 <TableHead className="text-center">عملیات</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {getAllCars?.data?.map((item, index) => (
//                 <TableRow
//                   key={`${item?._id}-${index}`}
//                   className="has-data-[state=checked]:bg-muted/50"
//                 >
//                   <TableCell className="text-center">{index + 1}</TableCell>
//                   <TableCell className="text-center">
//                     {item?.ChassisNo ? item?.ChassisNo : "_"}
//                   </TableCell>
//                   <TableCell className="text-center">
//                     {item?.CarModel ? item?.CarModel : "_"}
//                   </TableCell>
//                   <TableCell className="text-center">
//                     {item?.BuyerNationalID ? item?.BuyerNationalID : "_"}
//                   </TableCell>
//                   <TableCell className="text-center">
//                     {item?.SellerNationalID ? item?.SellerNationalID : "_"}
//                   </TableCell>
//                   <TableCell className="text-center">
//                     {item?.SaleAmount
//                       ? item?.SaleAmount.toLocaleString("en-US")
//                       : "_"}
//                   </TableCell>
//                   <TableCell className="text-center">
//                     {item?.PurchaseAmount
//                       ? item?.PurchaseAmount.toLocaleString("en-US")
//                       : "_"}
//                   </TableCell>
//                   <TableCell className="text-center">
//                     {item?.LicensePlate ? item?.LicensePlate : "_"}
//                   </TableCell>
//                   <TableCell className="text-center flex gap-3 items-center justify-center">
//                     <Pencil className="w-4 h-4 cursor-pointer" />
//                     {/* <Trash2 className="w-4 h-4 cursor-pointer" /> */}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </div>
//     )
//   );
// };

// export default VehicleList;

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
import { Pencil } from "lucide-react";
import React from "react";
import VehicleFormModal from "@/components/forms/vehicleFormModal";

const VehicleList = () => {
  const getAllCars = useGetAllCars();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedVehicle, setSelectedVehicle] = React.useState<ICarRes | null>(
    null
  );
  const [modalMode, setModalMode] = React.useState<"add" | "edit">("add");

  const handleEdit = (vehicle: ICarRes) => {
    setSelectedVehicle(vehicle);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedVehicle(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex justify-between items-center gap-2 mb-4">
        <h4>اطلاعات خودرو</h4>
        <button
          onClick={handleAdd}
          className="px-6 py-2 text-white bg-indigo-400 cursor-pointer rounded-md hover:bg-indigo-500 transition-colors"
        >
          افزودن مورد جدید
        </button>
      </div>
      {getAllCars.data && (
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
                      <Pencil
                        className="w-4 h-4 cursor-pointer hover:text-indigo-500"
                        onClick={() => handleEdit(item)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      <VehicleFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        vehicleData={selectedVehicle}
        mode={modalMode}
      />
    </>
  );
};

export default VehicleList;
