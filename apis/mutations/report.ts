import { useMutation } from "@tanstack/react-query";
import { downloadPersonReport } from "../client/report";

export const useDownloadPersonReport = () => {
  return useMutation({
    mutationKey: ["download-person-report"],
    mutationFn: downloadPersonReport,
  });
};
