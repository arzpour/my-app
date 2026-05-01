import { useUpdateWalletTransfer } from "@/apis/mutations/wallet";
import { WalletTransferRequest } from "@/types/new-backend-types";
import { useQueryClient } from "@tanstack/react-query";

const useUpdateWalletTransferHandler = () => {
  const updateWallet = useUpdateWalletTransfer();
  const queryClient = useQueryClient();
  const updateWalletTransfer = async (data: WalletTransferRequest) => {
    try {
      await updateWallet.mutateAsync(data);
      queryClient.invalidateQueries({
        queryKey: ["get-all-people"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-transactions-by-deal-id"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-cheques-by-deal-id"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-all-cheques"],
      });
      queryClient.invalidateQueries({ queryKey: ["get-transaction-by-id"] });
    } catch (error) {
      console.log("🚀 ~ addToWalletHandler ~ error:", error);
    }
  };

  return { updateWalletTransfer };
};

export default useUpdateWalletTransferHandler;
