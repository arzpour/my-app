import { getAllTransactions } from "@/apis/client/transaction";
import { useQuery } from "@tanstack/react-query";

const useGetAllTransactions = () => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["get-all-transaction"],
    queryFn: getAllTransactions,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { data, isLoading, isError, isSuccess, error };
};

export default useGetAllTransactions;
