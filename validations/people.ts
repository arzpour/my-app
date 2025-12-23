import { z } from "zod";

// Validation schema for People form
export const peopleSchema = z.object({
  fullName: z.string().min(1, "نام و نام خانوادگی الزامی است"),
  nationalId: z
    .string()
    .min(10, "کد ملی باید 10 رقم باشد")
    .max(10, "کد ملی باید 10 رقم باشد")
    .regex(/^\d+$/, "کد ملی باید فقط عدد باشد"),
  phoneNumber: z
    .string()
    .min(11, "شماره موبایل باید 11 رقم باشد")
    .max(11, "شماره موبایل باید 11 رقم باشد")
    .regex(/^09\d+$/, "شماره موبایل باید با 09 شروع شود"),
  address: z.string().optional(),
  roles: z.array(z.enum(["customer", "broker", "employee"])).min(1, "حداقل یک نقش باید انتخاب شود"),
  
  // Broker details (optional, required if broker role is selected)
  purchaseCommissionPercent: z.string().optional(),
  saleCommissionPercent: z.string().optional(),
  
  // Employee details (optional, required if employee role is selected)
  startDate: z.string().optional(),
  contractType: z.enum(["full_time", "part_time", "contractual"]).optional(),
  baseSalary: z.string().optional(),
}).refine(
  (data) => {
    // If broker role is selected, commission percentages should be provided
    if (data.roles.includes("broker")) {
      return data.purchaseCommissionPercent && data.saleCommissionPercent;
    }
    return true;
  },
  {
    message: "درصد کمیسیون خرید و فروش برای کارگزار الزامی است",
    path: ["purchaseCommissionPercent"],
  }
).refine(
  (data) => {
    // If employee role is selected, employment details should be provided
    if (data.roles.includes("employee")) {
      return data.startDate && data.contractType && data.baseSalary;
    }
    return true;
  },
  {
    message: "اطلاعات استخدامی برای کارمند الزامی است",
    path: ["startDate"],
  }
);

export type peopleSchemaType = z.infer<typeof peopleSchema>;

