"use client";
import { getCustomerSlug } from "@/utils/session";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const customerSlug = getCustomerSlug();
  const router = useRouter();

  const goBack = () => {
    if (customerSlug) {
      const redirectPath = `/${customerSlug}`;
      router.push(redirectPath);
    } else {
      window.history.back();
    }
  };

  return (
    <div className="text-center w-full h-dvh items-center flex flex-col justify-center">
      <h2 className="text-center text-6xl text-blue-500 dark:text-gray-100">
        <span className="sr-only">Error</span>404
      </h2>
      <p className="mt-6 text-lg font-medium text-pretty text-gray-700 sm:text-xl/8">
        ! صفحه‌ای که دنبال آن بودید پیدا نشد{" "}
      </p>
      <div className="mt-1 flex items-center justify-center gap-x-6">
        <button
          onClick={goBack}
          className="rounded-md text-blue-500 px-3.5 py-2.5 text-sm font-medium cursor-pointer"
        >
          صفحه‌ی اصلی
        </button>
      </div>
    </div>
  );
};

export default NotFound;
