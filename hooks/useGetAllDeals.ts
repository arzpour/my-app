import { getAllDeals } from "@/apis/client/deals";
import { useQuery } from "@tanstack/react-query";

const useGetAllDeals = () => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["get-all-deals"],
    queryFn: getAllDeals,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { data, isLoading, isError, isSuccess, error };
};

export default useGetAllDeals;


