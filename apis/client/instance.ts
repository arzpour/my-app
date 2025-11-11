import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  headers: { "Cache-Control": "no-cache" },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 404) {
      console.warn("Resource not found:", error.config?.url);
      return Promise.reject(error);
    }
    console.error("API Error:", error.message);
    return Promise.reject(error);
  }
);
