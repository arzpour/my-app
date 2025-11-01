import { useMutation } from "@tanstack/react-query";
import { getDetailsByChassisNo } from "../client/detailsByChassisNo";

export const useGetDetailByChassisNo = () => {
  return useMutation({
    mutationKey: ["get-details-by-chassis"],
    mutationFn: getDetailsByChassisNo,
  });
};
