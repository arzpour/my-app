"use client";
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
import { useQuery } from "@tanstack/react-query";
import { getAllVehicles } from "@/apis/client/vehicles";
import { IVehicle, IDeal } from "@/types/new-backend-types";
import VehicleFormModal from "@/components/forms/vehicleFormModal";
import useGetAllDeals from "@/hooks/useGetAllDeals";

const VehicleList = () => {
  const { data: vehicles, isLoading: vehiclesLoading } = useQuery({
    queryKey: ["get-all-vehicles"],
    queryFn: getAllVehicles,
  });

  const {data:allDeals} = useGetAllDeals()
  // const getAllDeals = useGetAllDeals();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  const [selectedVehicle, setSelectedVehicle] = React.useState<IVehicle | null>(
    null,
  );
  const [modalMode, setModalMode] = React.useState<"add" | "edit">("add");

//   React.useEffect(() => {
//     const fetchDeals = async () => {
//       try {
//        const res = await getAllDeals.mutateAsync();
// setAllDeals(res)
//       } catch (error) {
//         console.error("Error fetching deals:", error);
//       }
//     };
//     fetchDeals();
//   }, []);

  // const deals = getAllDeals.data || [];

  // const vinToDealMap = React.useMemo(() => {
  //   const map = new Map<string, IDeal>();
  //   deals.forEach((deal) => {
  //     const vin = deal.vehicleSnapshot?.vin;
  //     if (vin) {
  //       const existingDeal = map.get(vin);
  //       if (!existingDeal) {
  //         map.set(vin, deal);
  //       } else {
  //         const existingDate =
  //           existingDeal.saleDate || existingDeal.purchaseDate;
  //         const currentDate = deal.saleDate || deal.purchaseDate;
  //         if (currentDate > existingDate) {
  //           map.set(vin, deal);
  //         }
  //       }
  //     }
  //   });
  //   return map;
  // }, [deals]);

  const handleEdit = (vehicle: IVehicle) => {
    setSelectedVehicle(vehicle);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  // const handleAdd = () => {
  //   setSelectedVehicle(null);
  //   setModalMode("add");
  //   setIsModalOpen(true);
  // };

  const vehiclesList = vehicles || [];

  return (
    <>
      <div className="flex justify-between items-center gap-2 mb-4">
        <h4>اطلاعات خودرو</h4>
        {/* <button
          onClick={handleAdd}
          className="px-6 py-2 text-white bg-indigo-400 cursor-pointer rounded-md hover:bg-indigo-500 transition-colors"
        >
          افزودن مورد جدید
        </button> */}
      </div>
      {vehiclesLoading ? (
        <div className="border border-gray-300 p-4 rounded-md w-full mt-7 text-center text-gray-500">
          در حال بارگذاری...
        </div>
      ) : vehiclesList.length > 0 ? (
        <div className="border border-gray-300 p-4 rounded-md w-full mt-7">
          <div className="max-h-[33rem] overflow-y-auto rounded-md border w-full">
            <Table className="min-w-full table-fixed text-right border-collapse">
              <TableHeader className="top-0 sticky">
                <TableRow className="hover:bg-transparent bg-gray-100">
                  <TableHead className="text-center">ردیف</TableHead>
                  <TableHead className="text-center">شاسی</TableHead>
                  <TableHead className="text-center">مدل ماشین</TableHead>
                  <TableHead className="text-center">خریدار</TableHead>
                  <TableHead className="text-center">فروشنده</TableHead>
                  <TableHead className="text-center">کارگزار خرید</TableHead>
                  <TableHead className="text-center">کارگزار فروش</TableHead>
                  <TableHead className="text-center">مبلغ فروش</TableHead>
                  <TableHead className="text-center">مبلغ خرید</TableHead>
                  <TableHead className="text-center">پلاک</TableHead>
                  <TableHead className="text-center">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehiclesList.map((vehicle, index) => {
                  // const relatedDeal = vinToDealMap.get(vehicle.vin);
                  const relatedDeal = (allDeals ?? []).filter(
                    (el) => el.vehicleSnapshot.vin === vehicle.vin,
                  )[0];

                  return (
                    <TableRow
                      key={`${vehicle._id}-${index}`}
                      className="has-data-[state=checked]:bg-muted/50"
                    >
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center">
                        {vehicle.vin || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {vehicle.model || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {relatedDeal?.buyer?.fullName || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {relatedDeal?.seller?.fullName || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {relatedDeal?.purchaseBroker?.fullName || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {relatedDeal?.saleBroker?.fullName || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {relatedDeal?.salePrice
                          ? relatedDeal?.salePrice?.toLocaleString("en-US")
                          : "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {relatedDeal?.purchasePrice
                          ? relatedDeal?.purchasePrice?.toLocaleString("en-US")
                          : "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {vehicle?.plateNumber || "—"}
                      </TableCell>
                      <TableCell className="text-center flex gap-3 items-center justify-center">
                        <Pencil
                          className="w-4 h-4 cursor-pointer hover:text-indigo-500"
                          onClick={() => handleEdit(vehicle)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="border border-gray-300 p-4 rounded-md w-full mt-7 text-center text-gray-500">
          هیچ خودرویی یافت نشد
        </div>
      )}
      <VehicleFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        vehicleData={selectedVehicle as any}
        mode={modalMode}
      />
    </>
  );
};

export default VehicleList;
