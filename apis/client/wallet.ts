import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";
import { WalletTransferRequest } from "@/types/new-backend-types";

// Update wallet transfer
type updateWalletTransferType = (data: WalletTransferRequest) => Promise<any>;
export const updateWalletTransfer: updateWalletTransferType = async (data) => {
  const response = await axiosInstance.post(
    urls.wallet.updateWalletTransfer,
    data,
  );
  return response.data;
};
