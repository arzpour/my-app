import { getTransactionFormOptionsData } from "@/apis/client/others";
import { useQuery } from "@tanstack/react-query";

const useGetTransactionFormOptions = () => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["get-transaction-form-options"],
    queryFn: getTransactionFormOptionsData,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { data, isLoading, isError, isSuccess, error };
};

export default useGetTransactionFormOptions;
