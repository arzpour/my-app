import { useUpdateWallet } from "@/apis/mutations/people";

const useUpdateWalletHandler = () => {
  const updateWallet = useUpdateWallet();
  const updateWalletHandler = async (id: string, data: IUpdateWalletReq) => {
    try {
      await updateWallet.mutateAsync({ id, data });
    } catch (error) {
      console.log("🚀 ~ addToWalletHandler ~ error:", error);
    }
  };

  return { updateWalletHandler };
};

export default useUpdateWalletHandler;
