import { useMutation } from "@tanstack/react-query";
import { login, logout } from "../client/auth";

export const useLogin = () => {
  return useMutation({ mutationKey: ["login"], mutationFn: login });
};

export const useLogout = () => {
  return useMutation({ mutationKey: ["logout"], mutationFn: logout });
};
