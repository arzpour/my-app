import { getAllPeople } from "@/apis/client/people";
import { useQuery } from "@tanstack/react-query";

const useGetAllPeople = () => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["get-all-people"],
    queryFn: getAllPeople,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { data, isLoading, isError, isSuccess, error };
};

export default useGetAllPeople;
