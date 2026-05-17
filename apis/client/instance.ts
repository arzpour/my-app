import { deleteAccessToken, getAccessToken, getCustomerSlug } from "@/utils/session";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  headers: { "Cache-Control": "no-cache" },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const customerSlug = getCustomerSlug();
  if (customerSlug) {
    config.headers["X-Customer-Slug"] = customerSlug;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 404) {
      console.warn("Resource not found:", error.config?.url);
      return Promise.reject(error);
    }
    if (error.response?.status === 401) {
      console.warn("Unauthorize:", error.config?.url);
      deleteAccessToken()
      return Promise.reject(error);
    }
    console.error("API Error:", error.message);
    return Promise.reject(error);
  },
);
