import { getAllBusinessAccounts } from "@/apis/client/businessAccounts";
import { useQuery } from "@tanstack/react-query";

const useGetAllBusinessAccount = () => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["get-all-business-account"],
    queryFn: getAllBusinessAccounts,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { data, isLoading, isError, isSuccess, error };
};

export default useGetAllBusinessAccount;
