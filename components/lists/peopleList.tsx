"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetAllPeople from "@/hooks/useGetAllPeople";
import { roleMap } from "@/utils/systemConstants";
import { Pencil, Printer, Trash } from "lucide-react";
import React from "react";
import DeleteModal from "../modals/deleteModal";
import useGetTransactionByDealId from "@/hooks/useGetTransactionByDealId";
import { useQueryClient } from "@tanstack/react-query";
import { useDeletePerson } from "@/apis/mutations/people";
import { IPeople } from "@/types/new-backend-types";
import { toast } from "sonner";
import useGetAllDeals from "@/hooks/useGetAllDeals";
import { useDownloadPersonReport } from "@/apis/mutations/report";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/jalali";
import persian_fa from "react-date-object/locales/persian_en";

interface IPeopleList {
  setMode: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  setPersonId: React.Dispatch<React.SetStateAction<string>>;
}

interface PersonReportParams {
  endDate: string;
  startDate: string;
  personName?: string;
  firstName: string;
  lastName: string;
  nationalId: string;
}

interface PersonReportPrintParams {
  firstName: string;
  lastName: string;
  personNationalId: string;
}

const PeopleList: React.FC<IPeopleList> = ({ setMode, setPersonId }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedDealId, setSelectedDealId] = React.useState<
    string | undefined
  >(undefined);
  const [selectedPerson, setSelectedPerson] = React.useState<IPeople | null>(
    null,
  );

  const { data: allPeople, isLoading } = useGetAllPeople();
  const queryClient = useQueryClient();
  const deletePerson = useDeletePerson();
  const getTransactionByDealId = useGetTransactionByDealId(selectedDealId);
  const { data: allDeals } = useGetAllDeals();
  const downloadPersonReport = useDownloadPersonReport();

  const getTodayPersianDate = (): string => {
    const today = new DateObject({ calendar: persian, locale: persian_fa });
    return today.format("YYYY/MM/DD");
  };

  const getOneMonthAgoPersianDate = (): string => {
    const today = new DateObject({ calendar: persian, locale: persian_fa });
    const oneMonthAgo = today.subtract(1, "month");
    return oneMonthAgo.format("YYYY/MM/DD");
  };

  const handlePrintClick = async ({
    firstName,
    lastName,
    personNationalId,
  }: PersonReportPrintParams) => {
    if (isNaN(Number(personNationalId))) {
      console.error("خطا: کد ملی معتبر نیست:", personNationalId);
      // alert("کد ملی نامعتبر است. لطفاً دوباره امتحان کنید.");
      return;
    }

    const startDate = getOneMonthAgoPersianDate();
    const endDate = getTodayPersianDate();

    try {
      const blob = await downloadPersonReport.mutateAsync({
        startDate: startDate,
        endDate: endDate,
        firstName: firstName,
        lastName: lastName,
        nationalId: personNationalId,
      });
      const file = new Blob([blob], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = `گزارش_${firstName}_${lastName}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("🚀 ~ handlePrintClick ~ error:", error);
    }
  };

  const handleDeleteClick = (person: IPeople) => {
    const relatedDeal = (allDeals ?? []).find(
      (el) =>
        el?.buyer?.personId === person?._id ||
        el?.partnerships.map((p) => p?.partner.personId) === person?._id ||
        el?.purchaseBroker?.personId === person?._id ||
        el?.saleBroker?.personId === person?._id ||
        el?.seller?.personId === person?._id,
    );
    setSelectedPerson(person);
    setSelectedDealId(relatedDeal?._id?.toString());
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPerson?._id) return;
    const relatedDeal = (allDeals ?? []).find(
      (el) =>
        el?.buyer?.personId === selectedPerson?._id ||
        el?.partnerships.map((p) => p?.partner.personId) ===
          selectedPerson?._id ||
        el?.purchaseBroker?.personId === selectedPerson?._id ||
        el?.saleBroker?.personId === selectedPerson?._id ||
        el?.seller?.personId === selectedPerson?._id,
    );
    const hasTransactions = (getTransactionByDealId.data?.length ?? 0) > 0;
    const hasDirectCosts =
      (relatedDeal?.directCosts?.otherCost?.length ?? 0) > 0 ||
      (relatedDeal?.directCosts?.options?.length ?? 0) > 0;
    if (hasTransactions || hasDirectCosts || relatedDeal) {
      toast.error(
        "این فرد قابل حذف نیست، برای حذف ابتدا تراکنش های مربوط به این فرد را حذف کنید",
      );
      return;
    }

    try {
      await deletePerson.mutateAsync(selectedPerson._id);
      queryClient.invalidateQueries({ queryKey: ["get-all-vehicles"] });
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }

    queryClient.invalidateQueries({
      queryKey: ["get-all-people"],
    });
  };

  return (
    <>
      {isLoading ? (
        <div className="border border-gray-300 p-4 rounded-md w-full text-center text-gray-500">
          در حال بارگذاری...
        </div>
      ) : (allPeople ?? []).length > 0 ? (
        <div className="border border-gray-300 p-4 rounded-md w-full mt-3">
          <div className="max-h-[33rem] overflow-y-auto rounded-md border w-full">
            <Table className="min-w-full table-fixed text-right border-collapse">
              <TableHeader className="top-0 sticky">
                <TableRow className="hover:bg-transparent bg-gray-100">
                  <TableHead className="text-center">ردیف</TableHead>
                  <TableHead className="text-center">نام</TableHead>
                  <TableHead className="text-center">نام خانوادگی</TableHead>
                  <TableHead className="text-center">شماره موبایل</TableHead>
                  <TableHead className="text-center">نقش</TableHead>
                  <TableHead className="text-center">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(allPeople ?? []).map((people, index) => {
                  return (
                    <TableRow
                      key={`${people._id}-${index}`}
                      className="has-data-[state=checked]:bg-muted/50"
                    >
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center">
                        {people.firstName || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {people.lastName || "—"}
                      </TableCell>
                      <TableCell className="text-center overflow-auto">
                        {people?.phoneNumber ||
                          people.phoneNumbers?.map((el) => el) ||
                          "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {people?.roles.map((el) => roleMap[el]).join(" , ") ||
                          "—"}
                      </TableCell>
                      <TableCell className="text-center flex gap-3 items-center justify-center">
                        <Pencil
                          className="w-4 h-4 cursor-pointer hover:text-indigo-500"
                          onClick={() => {
                            setMode("edit");
                            setPersonId(people._id);
                          }}
                        />
                        <Trash
                          className="w-4 h-4 cursor-pointer hover:text-red-500"
                          onClick={() => handleDeleteClick(people)}
                        />
                        <TableCell className="text-center">
                          <Printer
                            className="text-gray-700 w-4 h-4 cursor-pointer"
                            onClick={() => {
                              const nationalIdStr =
                                people.nationalId?.toString();

                              if (nationalIdStr) {
                                handlePrintClick({
                                  firstName: people.firstName || "",
                                  lastName: people.lastName || "",
                                  personNationalId: nationalIdStr,
                                });
                              } else {
                                console.error(
                                  "خطا: nationalId برای فرد مورد نظر موجود نیست.",
                                );
                                // alert("کد ملی فرد مورد نظر یافت نشد.");
                              }
                            }}
                          />
                        </TableCell>
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
          هیچ فردی یافت نشد
        </div>
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          isOpenDeleteModal={isDeleteModalOpen}
          setIsOpenDeleteModal={setIsDeleteModalOpen}
          handleConfirmDelete={handleConfirmDelete}
          setIdToDelete={setSelectedDealId}
          title="فرد"
          deletePending={deletePerson.isPending}
        />
      )}
    </>
  );
};

export default PeopleList;
