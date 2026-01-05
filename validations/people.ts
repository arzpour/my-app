import { z } from "zod";

export const peopleSchema = z
  .object({
    firstName: z.string().min(1, "نام الزامی است"),
    lastName: z.string().min(1, "نام خانوادگی الزامی است"),
    fatherName: z.string().optional(),
    nationalId: z
      .string()
      .min(10, "کد ملی باید 10 رقم باشد")
      .max(10, "کد ملی باید 10 رقم باشد")
      .regex(/^\d+$/, "کد ملی باید فقط عدد باشد"),
    idCardNumber: z.string().optional(),
    postalCode: z
      .string()
      .optional()
      .refine((val) => !val || /^\d{10}$/.test(val), "کدپستی باید 10 رقم باشد"),
    phoneNumbers: z
      .array(
        z
          .string()
          .min(11, "شماره موبایل باید 11 رقم باشد")
          .max(11, "شماره موبایل باید 11 رقم باشد")
          .regex(/^09\d+$/, "شماره موبایل باید با 09 شروع شود")
      )
      .min(1, "حداقل یک شماره موبایل الزامی است"),
    address: z.string().optional(),
    roles: z
      .array(z.enum(["customer", "broker", "employee", "provider"]))
      .min(1, "حداقل یک نقش باید انتخاب شود"),

    purchaseCommissionPercent: z.string().optional(),
    saleCommissionPercent: z.string().optional(),

    startDate: z.string().optional(),
    contractType: z.enum(["full_time", "part_time", "contractual"]).optional(),
    baseSalary: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.roles.includes("broker")) {
        return data.purchaseCommissionPercent && data.saleCommissionPercent;
      }
      return true;
    },
    {
      message: "درصد کمیسیون خرید و فروش برای کارگزار الزامی است",
      path: ["purchaseCommissionPercent"],
    }
  )
  .refine(
    (data) => {
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
