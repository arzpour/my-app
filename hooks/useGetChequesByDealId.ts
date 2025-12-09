import { getChequesByDeal } from "@/apis/client/cheques";
import { useQuery } from "@tanstack/react-query";

const useGetChequesByDealId = (dealId: string | undefined) => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["get-cheques-by-deal-id", dealId],
    queryFn: () => getChequesByDeal(dealId!),
    enabled: !!dealId,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { data, isLoading, isError, isSuccess, error };
};

export default useGetChequesByDealId;
