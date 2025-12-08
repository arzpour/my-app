import { getDealByVin } from "@/apis/client/deals";
import { useQuery } from "@tanstack/react-query";

const useGetDealsByVin = (vin: string) => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["get-deals-by-vin", vin],
    queryFn: () => getDealByVin(vin),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { data, isLoading, isError, isSuccess, error };
};

export default useGetDealsByVin;
