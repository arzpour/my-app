import { getAllCategoryWithOptionSettings } from "@/apis/client/settings";
import { useQuery } from "@tanstack/react-query";

const useGetAllCategoryWithOptionSettings = () => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["get-all-settings"],
    queryFn: getAllCategoryWithOptionSettings,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { data, isLoading, isError, isSuccess, error };
};

export default useGetAllCategoryWithOptionSettings;
