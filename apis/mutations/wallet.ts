import { useMutation } from "@tanstack/react-query";
import { updateWalletTransfer } from "../client/wallet";

export const useUpdateWalletTransfer = () => {
  return useMutation({
    mutationKey: ["update-wallet-transfer"],
    mutationFn: updateWalletTransfer,
  });
};