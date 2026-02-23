"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllVehicles } from "@/apis/client/vehicles";
import { IVehicle, IDeal } from "@/types/new-backend-types";
import VehicleFormModal from "@/components/forms/vehicleFormModal";
import useGetAllDeals from "@/hooks/useGetAllDeals";
import { setChassisNo } from "@/redux/slices/carSlice";
import { useDispatch } from "react-redux";
import useGetTransactionByDealId from "@/hooks/useGetTransactionByDealId";
import { toast } from "sonner";
import DeleteModal from "@/components/modals/deleteModal";
import { useDeleteVehicle } from "@/apis/mutations/vehicle";
import { formatPrice } from "@/utils/systemConstants";

const VehicleList = () => {
  const { data: vehicles, isLoading: vehiclesLoading } = useQuery({
    queryKey: ["get-all-vehicles"],
    queryFn: getAllVehicles,
  });
  const { data: allDeals } = useGetAllDeals();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedDealId, setSelectedDealId] = React.useState<string | undefined>(undefined);
  const [selectedVehicle, setSelectedVehicle] = React.useState<IVehicle | null>(
    null,
  );
  const [modalMode, setModalMode] = React.useState<"add" | "edit">("add");

  const dispatch = useDispatch();
  const deleteVehicleMutation = useDeleteVehicle();

  const getTransactionByDealId = useGetTransactionByDealId(selectedDealId);

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

  const handleDeleteClick = (vehicle: IVehicle) => {
    const relatedDeal = (allDeals ?? []).find(
      (el) => el.vehicleSnapshot?.vin === vehicle.vin,
    );
    setSelectedVehicle(vehicle);
    setSelectedDealId(relatedDeal?._id?.toString());
    setIsDeleteModalOpen(true);
  };

  const queryClient = useQueryClient();

  const handleConfirmDelete = async () => {
    if (!selectedVehicle?._id) return;
    const relatedDeal = (allDeals ?? []).find(
      (el) => el.vehicleSnapshot?.vin === selectedVehicle.vin,
    );
    const hasTransactions =
      (getTransactionByDealId.data?.length ?? 0) > 0;
    const hasDirectCosts =
      (relatedDeal?.directCosts?.otherCost?.length ?? 0) > 0 ||
      (relatedDeal?.directCosts?.options?.length ?? 0) > 0;
    if (hasTransactions || hasDirectCosts) {
      toast.error("این خودرو قابل حذف نیست، برای حذف ابتدا تراکنش های مربوط به این خودرو را حذف کنید");
      return;
    }
    try {
      await deleteVehicleMutation.mutateAsync(selectedVehicle._id);
      setIsDeleteModalOpen(false);
      setSelectedDealId(undefined);
      setSelectedVehicle(null);
      queryClient.invalidateQueries({ queryKey: ["get-all-vehicles"] });
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  // const handleAdd = () => {
  //   setSelectedVehicle(null);
  //   setModalMode("add");
  //   setIsModalOpen(true);
  // };

  const vehiclesList = vehicles || [];

  return (
    <>
      <div className="flex justify-between items-center gap-2 my-4 mt-6">
        <h4 className="font-semibold text-gray-700">اطلاعات خودرو</h4>
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
                  <TableHead className="text-center">پلاک</TableHead>
                  <TableHead className="text-center">
                    {/* طرف اول(فروشنده) */}
                    طرف اول
                  </TableHead>
                  {/* <TableHead className="text-center">طرف دوم(خریدار)</TableHead> */}
                  <TableHead className="text-center">طرف دوم</TableHead>
                  <TableHead className="text-center">کارگزار خرید</TableHead>
                  <TableHead className="text-center">کارگزار فروش</TableHead>
                  <TableHead className="text-center">مبلغ خرید</TableHead>
                  <TableHead className="text-center">مبلغ فروش</TableHead>
                  <TableHead className="text-center">منشی</TableHead>
                  <TableHead className="text-center">مدارک</TableHead>
                  <TableHead className="text-center">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehiclesList.map((vehicle, index) => {
                  const relatedDeal = (allDeals ?? []).find(
                    (el) => el.vehicleSnapshot?.vin === vehicle.vin,
                  );

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
                        {vehicle?.plateNumber || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {relatedDeal?.seller?.fullName || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {relatedDeal?.buyer?.fullName || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {relatedDeal?.purchaseBroker?.fullName || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {relatedDeal?.saleBroker?.fullName || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {relatedDeal?.purchasePrice != null
                          ? formatPrice(relatedDeal.purchasePrice)
                          : "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {relatedDeal?.salePrice != null
                          ? formatPrice(relatedDeal.salePrice)
                          : "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {vehicle.SecretaryName || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {Array.isArray(vehicle.documents)
                          ? vehicle.documents.length === 0
                            ? "فاقد مدارک"
                            : vehicle.documents.length >= 4
                              ? "کامل"
                              : "ناقص"
                          : (vehicle.documents ?? "—")}
                      </TableCell>
                      <TableCell className="text-center flex gap-3 items-center justify-center">
                        <Pencil
                          className="w-4 h-4 cursor-pointer hover:text-indigo-500"
                          onClick={() => {
                            handleEdit(vehicle);
                            dispatch(setChassisNo(vehicle.vin));
                          }}
                        />
                        <Trash
                          className="w-4 h-4 cursor-pointer hover:text-red-500"
                          onClick={() => handleDeleteClick(vehicle)}
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
      {isDeleteModalOpen && (
        <DeleteModal
          isOpenDeleteModal={isDeleteModalOpen}
          setIsOpenDeleteModal={setIsDeleteModalOpen}
          handleConfirmDelete={handleConfirmDelete}
          setIdToDelete={setSelectedDealId}
          title="خودرو"
          deletePending={deleteVehicleMutation.isPending}
        />
      )}
    </>
  );
};

export default VehicleList;
