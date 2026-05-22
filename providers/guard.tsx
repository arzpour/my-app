"use client";
import NotFound from "@/app/not-found";
import { urlConfig } from "@/config";
import { getAccessToken } from "@/utils/session";
import { useParams, usePathname, useRouter } from "next/navigation";
import React from "react";

const Guard: React.FC<IChildren> = ({ children }) => {
  const token = getAccessToken();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ customerSlug: string }>();

  const customerNameFromUrl = params?.customerSlug;
  const loginPath = customerNameFromUrl ? `/${customerNameFromUrl}` : "";
  const isLoginPage =
    !!loginPath &&
    (pathname === loginPath || pathname === `${loginPath}/`);
  const isKnownCustomer =
    !!customerNameFromUrl &&
    Object.keys(urlConfig).includes(customerNameFromUrl);
  const requiresAuth = !!customerNameFromUrl && !isLoginPage;

  React.useEffect(() => {
    if (requiresAuth && !token && loginPath) {
      router.replace(loginPath);
    }
  }, [requiresAuth, token, loginPath, router]);

  if (!customerNameFromUrl) {
    return <>{children}</>;
  }

  if (!isKnownCustomer) {
    return <NotFound />;
  }

  if (requiresAuth && !token) {
    return null;
  }

  return <>{children}</>;
};

export default Guard;
