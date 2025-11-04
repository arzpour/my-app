import { getAllCheques } from "@/apis/client/cheques";
import { useQuery } from "@tanstack/react-query";

const useGetAllCheques = () => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["get-all-cheques"],
    queryFn: getAllCheques,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { data, isLoading, isError, isSuccess, error };
};

export default useGetAllCheques;
