import Cookies from "js-cookie";

// Access Token
export const getAccessToken = () => {
  return Cookies.get(process.env.NEXT_PUBLIC_ACCSESS_TOKEN_NAME as string);
};

export const setAccessToken = (token: string) => {
  Cookies.set(process.env.NEXT_PUBLIC_ACCSESS_TOKEN_NAME as string, token);
};

export const deleteAccessToken = () => {
  Cookies.remove(process.env.NEXT_PUBLIC_ACCSESS_TOKEN_NAME as string);
};

// customer slug
export const getCustomerSlug = () => {
  return Cookies.get(process.env.NEXT_PUBLIC_CUSTOMER_SLUG as string);
};

export const setCustomerSlug = (token: string) => {
  Cookies.set(process.env.NEXT_PUBLIC_CUSTOMER_SLUG as string, token);
};

export const deleteCustomerSlug = () => {
  Cookies.remove(process.env.NEXT_PUBLIC_CUSTOMER_SLUG as string);
};
