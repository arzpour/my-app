// import { getDetailsByChassisNo } from "@/apis/client/detailsByChassisNo";
// import { useQuery } from "@tanstack/react-query";

// const useGetDetailByChassisNo = (chassisNo: string) => {
//   const { data, isLoading, isError, error, isSuccess } = useQuery({
//     queryKey: ["get-detail-by-chassis-no", chassisNo],
//     queryFn: () => getDetailsByChassisNo(chassisNo),
//     refetchOnWindowFocus: false,
//     retry: 1,
//   });

//   return { data, isLoading, isError, isSuccess, error };
// };

// export default useGetDetailByChassisNo;
