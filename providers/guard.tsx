"use client";
import NotFound from "@/app/not-found";
import { urlConfig } from "@/config";
import { getAccessToken, getCustomerSlug } from "@/utils/session";
import { useParams, useRouter } from "next/navigation";
import React from "react";

// const Guard: React.FC<IChildren> = ({ children }) => {
//   const token = getAccessToken();
//   const router = useRouter();
//   const params = useParams<{ customerSlug: string }>();
//   console.log("🚀 ~ Guard ~ params:", params);
//   const customerNameFromUrl = params.customerSlug ?? "local";
//   const customerSlug = getCustomerSlug();

//   if (!params || !params.customerSlug) return null;

//   if (!token && customerSlug) {
//     const redirectPath = `/${customerSlug}`;
//     router.push(redirectPath);
//   }

//   console.log(
//     "🚀 ~ Guard ~ !Object.keys(urlConfig).includes(customerNameFromUrl):",
//     !Object.keys(urlConfig).includes(customerNameFromUrl),
//   );
//   console.log("🚀 ~ Guard ~ customerNameFromUrl:", customerNameFromUrl);
//   console.log("🚀 ~ Guard ~ Object.keys(urlConfig):", Object.keys(urlConfig));
//   if (!Object.keys(urlConfig).includes(customerNameFromUrl)) {
//     return NotFound();
//   }

//   return <>{children}</>;
// };

const Guard: React.FC<IChildren> = ({ children }) => {
  const token = getAccessToken();
  const router = useRouter();
  const params = useParams<{ customerSlug: string }>();

  if (!params || !params.customerSlug) return null;

  const customerNameFromUrl = params.customerSlug;
  const customerSlug = getCustomerSlug();

  if (!token && customerSlug) {
    router.push(`/${customerSlug}`);
    return null;
  }

  if (!Object.keys(urlConfig).includes(customerNameFromUrl)) {
    return NotFound();
  }

  return <>{children}</>;
};

export default Guard;
