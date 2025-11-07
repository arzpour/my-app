import { urls } from "@/utils/urls";
import { axiosInstance } from "./instance";

type getAllCategoryWithOptionSettingsType = () => Promise<ISettingRes[]>;
export const getAllCategoryWithOptionSettings: getAllCategoryWithOptionSettingsType =
  async () => {
    const response = await axiosInstance.get(urls.settings.list);
    return response.data;
  };

type addCategoryWithOptionToSettingsType = (data: {
  category: string;
  options: string | string[];
}) => Promise<ISettingRes>;
export const addCategoryWithOptionToSettings: addCategoryWithOptionToSettingsType =
  async (data) => {
    const response = await axiosInstance.post(urls.settings.list, data);
    return response.data;
  };
