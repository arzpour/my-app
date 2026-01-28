import { getAllUsers } from "@/apis/client/users";
import { useQuery } from "@tanstack/react-query";

const useGetAllUsers = () => {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["get-all-users"],
    queryFn: getAllUsers,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { data, isLoading, isError, isSuccess, error };
};

export default useGetAllUsers;
