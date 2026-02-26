import { useUpdateWallet } from "@/apis/mutations/people";
import { useQueryClient } from "@tanstack/react-query";

const useUpdateWalletHandler = () => {
  const updateWallet = useUpdateWallet();
  const queryClient = useQueryClient();
  const updateWalletHandler = async (id: string, data: IUpdateWalletReq) => {
    try {
      await updateWallet.mutateAsync({ id, data });
      queryClient.invalidateQueries({
        queryKey: ["get-all-people"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-all-transaction"],
      });
    } catch (error) {
      console.log("🚀 ~ addToWalletHandler ~ error:", error);
    }
  };

  return { updateWalletHandler };
};

export default useUpdateWalletHandler;
