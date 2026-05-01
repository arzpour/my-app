import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";

type downloadPersonReportType = (_: {
  firstName: string;
  lastName: string;
  nationalId: string;
  startDate: string;
  endDate: string;
}) => Promise<Blob>;
export const downloadPersonReport: downloadPersonReportType = async ({
  endDate,
  firstName,
  lastName,
  nationalId,
  startDate,
}) => {
  const response = await axiosInstance.get(urls.report.generatePersonReport, {
    params: {
      firstName,
      lastName,
      nationalId,
      startDate,
      endDate,
    },
    responseType: "blob",
  });
  return response.data;
};
