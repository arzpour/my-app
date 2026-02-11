import { getChequesById } from "@/apis/client/cheques";
import { useQuery } from "@tanstack/react-query";

const useGetChequeById = (id: string) => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["get-cheque-by-id", id],
    queryFn: () => getChequesById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { data, isLoading, isError, isSuccess, error };
};

export default useGetChequeById;
