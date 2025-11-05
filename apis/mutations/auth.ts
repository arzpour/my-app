import { useMutation } from "@tanstack/react-query";
import { login } from "../client/auth";

export const useLogin = () => {
  return useMutation({ mutationKey: ["login"], mutationFn: login });
};