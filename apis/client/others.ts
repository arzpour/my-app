import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";

type getTransactionFormOptionsDataType = () => Promise<ITransactionFormData>;
export const getTransactionFormOptionsData: getTransactionFormOptionsDataType =
  async () => {
    const response = await axiosInstance.get(
      urls.others.transactionFormOptions
    );
    return response.data;
  };
