import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";

type loginType = (data: {
  username: string;
  password: string;
}) => Promise<ILogin>;
export const login: loginType = async (data) => {
  const response = await axiosInstance.post(urls.login, data);
  return response.data;
};
