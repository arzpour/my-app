import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";
import type { IUsers } from "@/types/new-backend-types";

// Get all users
type getAllUsersType = () => Promise<IUsers[]>;
export const getAllUsers: getAllUsersType = async () => {
  const response = await axiosInstance.get(urls.users.list);
  return response.data;
};
