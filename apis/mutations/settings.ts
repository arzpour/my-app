import { useMutation } from "@tanstack/react-query";
import { addCategoryWithOptionToSettings } from "../client/settings";

export const useAddCategoryWithOptionToSettings = () => {
  return useMutation({
    mutationKey: ["add-category-with-options"],
    mutationFn: addCategoryWithOptionToSettings,
  });
};
