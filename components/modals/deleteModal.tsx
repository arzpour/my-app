import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface IDeleteModal {
  isOpenDeleteModal: boolean;
  setIsOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  deletePending: boolean;
  handleConfirmDelete: () => Promise<void>;
  setIdToDelete: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const DeleteModal: React.FC<IDeleteModal> = ({
  isOpenDeleteModal,
  setIsOpenDeleteModal,
  title,
  deletePending,
  handleConfirmDelete,
  setIdToDelete,
}) => {
  return (
    <Dialog open={isOpenDeleteModal} onOpenChange={setIsOpenDeleteModal}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="!text-base text-gray-800">
            تأیید حذف
          </DialogTitle>
          <DialogClose
            onClose={() => {
              setIsOpenDeleteModal(false);
              setIdToDelete(undefined);
            }}
          />
        </DialogHeader>
        <div className="space-y-4 pb-4 pt-2">
          <p className="text-gray-700">آیا از حذف این {title} اطمینان دارید؟</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setIsOpenDeleteModal(false);
                setIdToDelete(undefined);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              انصراف
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={deletePending}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {deletePending ? "در حال حذف..." : "حذف"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
