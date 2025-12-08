import { getTransactionsByDeal } from "@/apis/client/transaction";
import { useQuery } from "@tanstack/react-query";

const useGetTransactionByDealId = (dealId: string | undefined) => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["get-transaction-by-deal-id", dealId],
    queryFn: () => getTransactionsByDeal(dealId!),
    enabled: !!dealId,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { data, isLoading, isError, isSuccess, error };
};

export default useGetTransactionByDealId;
