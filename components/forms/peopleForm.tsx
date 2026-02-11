"use client";

import React from "react";
import {
  useForm,
  Controller,
  SubmitHandler,
  useFieldArray,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { peopleSchema, peopleSchemaType } from "@/validations/people";
import { toast } from "sonner";
import { useCreatePerson, useUpdatePerson } from "@/apis/mutations/people";
import useGetAllPeople from "@/hooks/useGetAllPeople";
import PersianDatePicker from "../global/persianDatePicker";
import {
  PERSON_ROLES,
  PERSON_ROLES_DISPLAY,
  CONTRACT_TYPES,
} from "@/utils/systemConstants";
import type { IPeople } from "@/types/new-backend-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface PeopleFormProps {
  personData?: IPeople | null;
  mode?: "add" | "edit";
  onSuccess?: () => void;
  embedded?: boolean; // If true, render without Dialog wrapper
  setMode?: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  handleBack?: () => void;
}

const PeopleForm: React.FC<PeopleFormProps> = ({
  personData,
  mode = "add",
  onSuccess,
  embedded = false,
  setMode,
  handleBack,
}) => {
  const [open, setOpen] = React.useState(embedded);
  const createPerson = useCreatePerson();
  const updatePerson = useUpdatePerson();
  const { role: currentUserRole } = useSelector(
    (state: RootState) => state.cars,
  );

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<peopleSchemaType>({
    resolver: zodResolver(peopleSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      fatherName: "",
      nationalId: "",
      idCardNumber: "",
      postalCode: "",
      phoneNumbers: [""],
      address: "",
      roles: [],
      purchaseCommissionPercent: "",
      saleCommissionPercent: "",
      startDate: "",
      contractType: undefined,
      baseSalary: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-expect-error - TypeScript inference issue with refined Zod schemas
    name: "phoneNumbers",
  });

  const selectedRoles = watch("roles");

  const normalizePhone = (p: string) => (p.startsWith("0") ? p : `0${p}`);

  // Populate form when editing
  React.useEffect(() => {
    if (mode === "edit" && personData) {
      const fullNameParts = personData?.fullName?.split(" ") || [];
      const firstName = personData?.firstName || fullNameParts[0] || "";
      const lastName =
        personData?.lastName || fullNameParts.slice(1).join(" ") || "";

      const phoneNumbers = personData?.phoneNumbers
        ? Array.isArray(personData.phoneNumbers)
          ? personData.phoneNumbers.map((p) => normalizePhone(p.toString()))
          : [normalizePhone(String(personData.phoneNumbers))]
        : personData?.phoneNumber
          ? [normalizePhone(personData.phoneNumber.toString())]
          : [""];

      reset({
        firstName: firstName,
        lastName: lastName,
        fatherName: personData?.fatherName || "",
        nationalId: personData?.nationalId?.toString() || "",
        idCardNumber: personData?.idCardNumber?.toString() || "",
        postalCode: personData?.postalCode?.toString() || "",
        phoneNumbers: phoneNumbers.length > 0 ? phoneNumbers : [""],
        address: personData?.address || "",
        roles: (personData?.roles || []) as (
          | "customer"
          | "broker"
          | "employee"
        )[],
        purchaseCommissionPercent:
          personData?.brokerDetails?.currentRates?.purchaseCommissionPercent ||
          "",
        saleCommissionPercent:
          personData?.brokerDetails?.currentRates?.saleCommissionPercent || "",
        startDate: personData?.employmentDetails?.startDate || "",
        contractType:
          (personData?.employmentDetails?.contractType as
            | "full_time"
            | "part_time"
            | "contractual"
            | undefined) || undefined,
        baseSalary: personData?.employmentDetails?.baseSalary?.toString() || "",
      });
    }
  }, [personData, mode, reset]);

  const onSubmit: SubmitHandler<peopleSchemaType> = async (data) => {
    try {
      const fullName = `${data.firstName} ${data.lastName}`.trim();

      const payload: any = {
        fullName: fullName,
        firstName: data.firstName,
        lastName: data.lastName,
        fatherName: data.fatherName || "",
        nationalId: Number(data.nationalId),
        idCardNumber: data.idCardNumber ? Number(data.idCardNumber) : undefined,
        postalCode: data.postalCode ? Number(data.postalCode) : undefined,
        phoneNumbers: data.phoneNumbers.map((p) => Number(p)),
        phoneNumber:
          data.phoneNumbers.length > 0
            ? Number(data.phoneNumbers[0])
            : undefined,
        address: data.address || "",
        roles: data.roles,
      };

      if (data.roles.includes("broker")) {
        const currentDate = new Date()
          .toLocaleDateString("fa-IR")
          .replace(/\//g, "/");

        payload.brokerDetails = {
          currentRates: {
            purchaseCommissionPercent: data.purchaseCommissionPercent || "0",
            saleCommissionPercent: data.saleCommissionPercent || "0",
            lastUpdated: currentDate,
          },
          rateHistory: personData?.brokerDetails?.rateHistory || [],
        };

        if (
          mode === "edit" &&
          personData?.brokerDetails?.currentRates &&
          (personData.brokerDetails.currentRates.purchaseCommissionPercent !==
            data.purchaseCommissionPercent ||
            personData.brokerDetails.currentRates.saleCommissionPercent !==
              data.saleCommissionPercent)
        ) {
          payload.brokerDetails.rateHistory = [
            ...(personData.brokerDetails.rateHistory || []),
            {
              effectiveDate: personData.brokerDetails.currentRates.lastUpdated,
              purchaseCommissionPercent:
                personData.brokerDetails.currentRates.purchaseCommissionPercent,
              saleCommissionPercent:
                personData.brokerDetails.currentRates.saleCommissionPercent,
            },
          ];
        }
      }

      if (data.roles.includes("employee")) {
        payload.employmentDetails = {
          startDate: data.startDate || "",
          contractType: data.contractType || "full_time",
          baseSalary: Number(data.baseSalary) || 0,
        };
      }

      if (mode === "add") {
        payload.wallet = {
          balance: 0,
          transactions: [],
        };
      }

      if (mode === "edit" && personData?._id) {
        await updatePerson.mutateAsync({
          id: personData._id.toString(),
          data: payload,
        });
        handleBack?.();
      } else {
        await createPerson.mutateAsync(payload);
        setOpen(false);
        onSuccess?.();
      }
      reset();
    } catch (error: any) {
      console.error("Error saving person:", error);
      toast.error(error?.response?.data?.message || "خطا در ثبت اطلاعات");
    }
  };

  const handleRoleChange = (
    role: "customer" | "broker" | "employee" | "provider",
    checked: boolean,
  ) => {
    const currentRoles = watch("roles");
    if (checked) {
      setValue("roles", [...currentRoles, role]);
    } else {
      setValue(
        "roles",
        currentRoles.filter((r) => r !== role),
      );
      if (role === "broker") {
        setValue("purchaseCommissionPercent", "");
        setValue("saleCommissionPercent", "");
      }
      if (role === "employee") {
        setValue("startDate", "");
        setValue("contractType", undefined);
        setValue("baseSalary", "");
      }
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-base text-gray-700 font-semibold border-b pb-2">
          اطلاعات هویتی
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium">
              نام *
            </label>
            <input
              id="firstName"
              {...register("firstName")}
              placeholder="نام"
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-medium">
              نام خانوادگی *
            </label>
            <input
              id="lastName"
              {...register("lastName")}
              placeholder="نام خانوادگی"
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs">{errors.lastName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="fatherName" className="block text-sm font-medium">
              نام پدر
            </label>
            <input
              id="fatherName"
              {...register("fatherName")}
              placeholder="نام پدر"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="nationalId" className="block text-sm font-medium">
              کد ملی *
            </label>
            <input
              id="nationalId"
              {...register("nationalId")}
              placeholder="کد ملی 10 رقمی"
              maxLength={10}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.nationalId && (
              <p className="text-red-500 text-xs">
                {errors.nationalId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="idCardNumber" className="block text-sm font-medium">
              شماره شناسنامه
            </label>
            <input
              id="idCardNumber"
              {...register("idCardNumber")}
              placeholder="شماره شناسنامه"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="postalCode" className="block text-sm font-medium">
              کدپستی
            </label>
            <input
              id="postalCode"
              {...register("postalCode")}
              placeholder="کدپستی 10 رقمی"
              maxLength={10}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.postalCode && (
              <p className="text-red-500 text-xs">
                {errors.postalCode.message}
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium">
              شماره موبایل (ها) *
            </label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <input
                  {...register(`phoneNumbers.${index}` as any)}
                  placeholder="09123456789"
                  maxLength={11}
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <span className="text-lg">×</span>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => append("" as any)}
              className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md border border-blue-200"
            >
              <span className="text-lg">+</span>
              افزودن شماره موبایل
            </button>
            {errors.phoneNumbers && (
              <p className="text-red-500 text-xs">
                {errors.phoneNumbers.message}
              </p>
            )}
            {errors.phoneNumbers?.root && (
              <p className="text-red-500 text-xs">
                {errors.phoneNumbers.root.message}
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium">
              آدرس
            </label>
            <textarea
              id="address"
              {...register("address")}
              placeholder="آدرس"
              rows={2}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        {/* Roles Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">نقش‌ها *</label>
          <div className="flex gap-4 flex-wrap">
            {PERSON_ROLES.map((role) => {
              const roleKey = role as keyof typeof PERSON_ROLES_DISPLAY;
              const isSecretary = currentUserRole === "secretary";
              const isCustomerRole = role === "customer";
              const isDisabled =
                isSecretary && !isCustomerRole && mode === "add";

              return (
                <div key={role} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`role-${role}`}
                    checked={selectedRoles.includes(
                      role as "customer" | "broker" | "employee" | "provider",
                    )}
                    onChange={(e) =>
                      handleRoleChange(roleKey, e.target.checked)
                    }
                    disabled={isDisabled}
                    className={`w-4 h-4 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDisabled ? "hidden" : ""
                    }`}
                  />
                  <label
                    htmlFor={`role-${role}`}
                    className={`cursor-pointer text-sm ${
                      isDisabled ? "hidden" : ""
                    }`}
                  >
                    {PERSON_ROLES_DISPLAY[roleKey]}
                  </label>
                </div>
              );
            })}
          </div>
          {errors.roles && (
            <p className="text-red-500 text-xs">{errors.roles.message}</p>
          )}
          {/* {currentUserRole === "secretary" && mode === "add" && (
            <p className="text-xs text-gray-500">
              شما فقط می‌توانید مشتری جدید اضافه کنید
            </p>
          )} */}
        </div>
      </div>

      {/* Broker Details Section */}
      {selectedRoles.includes("broker") && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-base text-gray-700 font-semibold border-b pb-2">
            اطلاعات کارگزار
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="purchaseCommissionPercent"
                className="block text-sm font-medium"
              >
                درصد کمیسیون خرید *
              </label>
              <input
                id="purchaseCommissionPercent"
                {...register("purchaseCommissionPercent")}
                placeholder="مثلاً 0.015"
                type="number"
                step="0.001"
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.purchaseCommissionPercent && (
                <p className="text-red-500 text-xs">
                  {errors.purchaseCommissionPercent.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="saleCommissionPercent"
                className="block text-sm font-medium"
              >
                درصد کمیسیون فروش *
              </label>
              <input
                id="saleCommissionPercent"
                {...register("saleCommissionPercent")}
                placeholder="مثلاً 0.01"
                type="number"
                step="0.001"
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.saleCommissionPercent && (
                <p className="text-red-500 text-xs">
                  {errors.saleCommissionPercent.message}
                </p>
              )}
            </div>
          </div>

          {/* Rate History Display (Read-only) */}
          {mode === "edit" &&
            personData?.brokerDetails?.rateHistory &&
            personData.brokerDetails.rateHistory.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium">
                  تاریخچه نرخ‌ها
                </label>
                <div className="mt-2 border rounded-md p-2 max-h-32 overflow-y-auto">
                  {personData.brokerDetails.rateHistory.map((rate, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-muted-foreground py-1"
                    >
                      {rate.effectiveDate}: خرید{" "}
                      {rate.purchaseCommissionPercent}% / فروش{" "}
                      {rate.saleCommissionPercent}%
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}

      {/* Employee Details Section */}
      {selectedRoles.includes("employee") && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-base text-gray-700 font-semibold border-b pb-2">
            اطلاعات استخدامی
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startDate" className="block text-sm font-medium">
                تاریخ شروع همکاری *
              </label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <PersianDatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="تاریخ شروع همکاری"
                  />
                )}
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="contractType"
                className="block text-sm font-medium"
              >
                نوع قرارداد *
              </label>
              <Controller
                name="contractType"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">انتخاب کنید</option>
                    {CONTRACT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.contractType && (
                <p className="text-red-500 text-xs">
                  {errors.contractType.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="baseSalary" className="block text-sm font-medium">
                حقوق پایه (ریال) *
              </label>
              {/* <input
                id="baseSalary"
                {...register("baseSalary")}
                placeholder="مثلاً 65000000"
                type="number"
                className="w-full px-3 py-2 border rounded-md"
              /> */}

              <Controller
                name="baseSalary"
                control={control}
                render={({ field }) => {
                  const formattedValue = field.value
                    ? Number(field.value).toLocaleString("en-US")
                    : "";

                  return (
                    <input
                      {...field}
                      type="text"
                      inputMode="numeric"
                      id="baseSalary"
                      placeholder="مثلاً 65000000"
                      className="w-full px-3 py-2 border rounded-md"
                      value={formattedValue}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/,/g, "");
                        if (!isNaN(Number(rawValue))) {
                          field.onChange(rawValue);
                        }
                      }}
                    />
                  );
                }}
              />
              {errors.baseSalary && (
                <p className="text-red-500 text-xs">
                  {errors.baseSalary.message}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <button
          type="button"
          onClick={() => {
            if (!embedded) setOpen(false);
            setMode?.("add");
            reset();
            // if (embedded && onSuccess) onSuccess();
            handleBack?.();
          }}
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          انصراف
        </button>
        <button
          type="submit"
          disabled={createPerson.isPending || updatePerson.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {createPerson.isPending || updatePerson.isPending
            ? "در حال ثبت..."
            : mode === "edit"
              ? "ذخیره تغییرات"
              : "ثبت"}
        </button>
      </div>
    </form>
  );

  if (embedded) {
    return (
      <div dir="rtl">
        {/* <div className="mb-4">
          <h2 className="text-base font-bold text-gray-800">
            {mode === "edit" ? "ویرایش شخص" : "ثبت شخص جدید"}
          </h2>
        </div> */}
        {formContent}
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {mode === "edit" ? "ویرایش" : "افزودن شخص جدید"}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <div dir="rtl">
            <DialogClose onClose={() => setOpen(false)} />
            <DialogHeader>
              <DialogTitle className="text-gray-800!">
                {mode === "edit" ? "ویرایش شخص" : "ثبت شخص جدید"}
              </DialogTitle>
            </DialogHeader>
            {formContent}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PeopleForm;
