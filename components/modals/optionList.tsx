"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/utils/systemConstants";
import { IOptions } from "@/types/new-backend-types";
import { Pencil, Trash } from "lucide-react";
import DeleteModal from "./deleteModal";
import TransactionForm from "../forms/transactionForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useDeleteDealOption } from "@/apis/mutations/deals";
import { useQueryClient } from "@tanstack/react-query";
import DealExpensesForm from "../forms/dealExpensesForm";
import { useDeleteWalletTransaction } from "@/apis/mutations/people";
import { setOptionUpdated } from "@/redux/slices/transactionSlice";
import { useDispatch } from "react-redux";

interface IOptionList {
  options: IOptions[];
  dealId: string;
}

const OptionList: React.FC<IOptionList> = ({ options, dealId }) => {
  const [isOpenDeleteModal, setIsOpenDeleteModal] =
    React.useState<boolean>(false);
  const [transactionToDelete, setTransactionToDelete] = React.useState<
    string | undefined
  >(undefined);
  const [providerId, setProviderId] = React.useState<string | undefined>(
    undefined,
  );

  const [optionId, setOptionId] = React.useState<string | undefined>(undefined);
  const [optionIdForTransaction, setOptionIdForTransaction] = React.useState<
    string | undefined
  >(undefined);
  const [isOpenEditModal, setIsOpenEditModal] = React.useState<boolean>(false);

  const deleteDealOption = useDeleteDealOption();
  const queryClient = useQueryClient();
  const deleteWalletTransaction = useDeleteWalletTransaction();
  const dispatch = useDispatch();

  const handleConfirmDelete = async () => {
    if (optionId) {
      try {
        // await deleteTransaction.mutateAsync(transactionToDelete);
        setIsOpenDeleteModal(false);
        setTransactionToDelete(undefined);
        // Refresh transactions after delete
        // await getTransactionsByDealIdHandler();

        await deleteDealOption.mutateAsync({
          dealId: dealId ?? "",
          optionId: optionId ?? "",
        });
        await deleteWalletTransaction.mutateAsync({
          id: providerId ?? "",
          data: {
            dealID: dealId ?? "",
            optionId: optionIdForTransaction ?? "",
          },
        });

        queryClient.invalidateQueries({
          queryKey: ["get-deals-by-vin"],
        });
        dispatch(setOptionUpdated(optionId ?? ""));
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const handleEditSuccess = () => {
    setIsOpenEditModal(false);
    setOptionId(undefined);

    // setTransactionId(undefined);
    // getTransactionsByDealIdHandler();
  };

  return (
    <>
      <div className="mt-4 mb-7">
        <div className="overflow-x-auto">
          <Table className="min-w-full table-fixed text-right border-collapse">
            <TableHeader className="top-0 sticky">
              <TableRow className="bg-gray-100">
                <TableHead className="w-[10%] text-center">ردیف</TableHead>
                <TableHead className="w-[50%] text-center">
                  عنوان آپشن
                </TableHead>
                <TableHead className="w-[30%] text-center">تاریخ</TableHead>
                <TableHead className="w-[30%] text-center">مبلغ</TableHead>
                <TableHead className="w-[50%] text-center">
                  تامین کننده
                </TableHead>
                <TableHead className="w-[30%] text-center">عملیات</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {(options ?? [])?.map((item, index) => {
                return (
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
                    <TableCell className="text-center">
                      {item.provider.name}
                    </TableCell>
                    <TableCell className="text-center flex gap-3 justify-center items-center">
                      <Pencil
                        className="w-4 h-4 cursor-pointer hover:text-indigo-500"
                        onClick={() => {
                          setIsOpenEditModal(true);
                          setOptionId(item._id);
                          setOptionIdForTransaction(item.optionId);

                          // setTransactionId(item._id?.toString());
                          // setDealId((item as ITransactionNew)?.dealId);
                        }}
                      />
                      <Trash
                        className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() => {
                          // handleDeleteClick(item._id?.toString() || "");
                          // setDealToDelete(item?.dealId?.toString() || "");
                          setOptionId(item._id);
                          setIsOpenDeleteModal(true);
                          setProviderId(item.provider.personId);
                          setOptionIdForTransaction(item.optionId);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {options.length === 0 && (
          <div className="text-center py-8 text-gray-500">آپشنی یافت نشد</div>
        )}
      </div>

      {isOpenEditModal && (
        <Dialog open={isOpenEditModal} onOpenChange={setIsOpenEditModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="mb-9">ویرایش آپشن</DialogTitle>
              <DialogClose
                onClose={() => {
                  setIsOpenEditModal(false);
                  // setTransactionId(undefined);
                }}
              />
            </DialogHeader>
            <DealExpensesForm
              mode="edit"
              onSuccess={handleEditSuccess}
              dealId={dealId}
              optionId={optionId}
              optionIdForUpdateWallet={optionIdForTransaction}
            />
          </DialogContent>
        </Dialog>
      )}

      {isOpenDeleteModal && (
        <DeleteModal
          deletePending={deleteDealOption.isPending}
          handleConfirmDelete={handleConfirmDelete}
          isOpenDeleteModal={isOpenDeleteModal}
          setIdToDelete={setOptionId}
          setIsOpenDeleteModal={setIsOpenDeleteModal}
          title="آپشن"
        />
      )}
    </>
  );
};

export default OptionList;
