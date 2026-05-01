import { getAllVehicles } from "@/apis/client/vehicles";
import { useQuery } from "@tanstack/react-query";

const useGetVehicles = () => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["get-vehicles"],
    queryFn: getAllVehicles,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { data, isLoading, isError, isSuccess, error };
};

export default useGetVehicles;
