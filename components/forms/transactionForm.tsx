"use client";
import useGetAllCategoryWithOptionSettings from "@/hooks/useGetCategoriesSetting";
import {
  transactionSchema,
  transactionSchemaType,
} from "@/validations/tranaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import SelectForFilterCheques from "../selectForFilterCheques";

const TransactionForm = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<transactionSchemaType>({
    mode: "all",
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      transactionType: "",
      transactionReason: "",
      transactionWay: "",
      showRoomCard: "",
      showRoomCardTitle: "",
      customerNationalCode: "",
      transactionAmount: "",
      transactionDate: "",
      financier: "",
      financierPercent: "",
      operator: "",
    },
  });

  const { data: getAllCategoryWithOptionSettings } =
    useGetAllCategoryWithOptionSettings();

  const transactionTypeOptions = getAllCategoryWithOptionSettings?.filter(
    (item) => item.category === "transactionType"
  );

  const transactionReasonOptions = getAllCategoryWithOptionSettings?.filter(
    (item) => item.category === "transactionReason"
  );

  const transactionWayOptions = getAllCategoryWithOptionSettings?.filter(
    (item) => item.category === "transactionWay"
  );

  const transactionShowRoomCardOptions =
    getAllCategoryWithOptionSettings?.filter(
      (item) => item.category === "showRoomCard"
    );

  const transactionShowRoomCardTitlesOptions =
    getAllCategoryWithOptionSettings?.filter(
      (item) => item.category === "showRoomCardTitle"
    );

  const transactionShowRoomCardTitleNamesOptions =
    getAllCategoryWithOptionSettings?.filter(
      (item) => item.category === "showRoomCardTitleName"
    );

  const transactionOperatorsOptions = getAllCategoryWithOptionSettings?.filter(
    (item) => item.category === "operators"
  );

  const onSubmit: SubmitHandler<transactionSchemaType> = async (data) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    if (!data) return;

    try {
      toast("ثبت شد", {
        icon: "✅",
        className: "!bg-green-100 !text-green-800 !shadow-md !h-[60px]",
      });
    } catch (error) {
      toast("اطلاعات وارد شده صحیح نیست", {
        className: "!bg-red-100 !text-red-800 !shadow-md !h-[60px]",
      });

      console.log(error);
    }
  };

  const transactionReason = watch("transactionReason");
  const transactionType = watch("transactionType");
  const showRoomCardTitle = watch("showRoomCardTitle");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col mx-4 mt-5 justify-center"
    >
      <h4 className="text-xl text-gray-900 font-medium mb-7">فرم تراکنش</h4>

      <div className="flex flex-col gap-5 items-center">
        <div className="space-y-5 flex gap-7 w-full">
          {transactionTypeOptions && (
            <div className="space-y-1">
              <Controller
                name="transactionType"
                control={control}
                render={({ field }) => (
                  <SelectForFilterCheques
                    data={transactionTypeOptions?.[0]?.options ?? [""]}
                    title="نوع تراکنش"
                    selectedValue={field.value || "انتخاب کنید"}
                    setSelectedSubject={field.onChange}
                    className="w-40 truncate"
                  />
                )}
              />
              {errors.transactionType && (
                <p className="text-red-500 text-right w-full mt-3 text-xs font-medium">
                  {errors.transactionType.message}
                </p>
              )}
            </div>
          )}

          {transactionReasonOptions && (
            <div className="space-y-1">
              <Controller
                name="transactionReason"
                control={control}
                render={({ field }) => (
                  <SelectForFilterCheques
                    data={transactionReasonOptions?.[0]?.options ?? [""]}
                    title="دلیل تراکنش"
                    selectedValue={field.value || "انتخاب کنید"}
                    setSelectedSubject={field.onChange}
                    className="w-40 truncate"
                  />
                )}
              />
              {errors.transactionReason && (
                <p className="text-red-500 text-right w-full mt-3 text-xs font-medium">
                  {errors.transactionReason.message}
                </p>
              )}
            </div>
          )}

          {transactionWayOptions && (
            <div className="space-y-1">
              <Controller
                name="transactionWay"
                control={control}
                render={({ field }) => (
                  <SelectForFilterCheques
                    data={transactionWayOptions?.[0]?.options ?? [""]}
                    title="روش تراکنش"
                    selectedValue={field.value || "انتخاب کنید"}
                    setSelectedSubject={field.onChange}
                    className="w-40 truncate"
                  />
                )}
              />
              {errors.transactionWay && (
                <p className="text-red-500 text-right w-full mt-3 text-xs font-medium">
                  {errors.transactionWay.message}
                </p>
              )}
            </div>
          )}

          {transactionShowRoomCardTitleNamesOptions && (
            <div className="space-y-1">
              <Controller
                name="showRoomCard"
                control={control}
                render={({ field }) => (
                  <SelectForFilterCheques
                    data={
                      transactionShowRoomCardTitleNamesOptions?.[0]
                        ?.options ?? [""]
                    }
                    title="کارت نمایشگاه"
                    selectedValue={field.value || "انتخاب کنید"}
                    setSelectedSubject={field.onChange}
                    className="w-40 truncate"
                  />
                )}
              />
              {errors.showRoomCard && (
                <p className="text-red-500 text-right w-full mt-3 text-xs font-medium">
                  {errors.showRoomCard.message}
                </p>
              )}
            </div>
          )}

          {/* {(transactionType === "افزایش سرمایه" ||
            transactionType === "برداشت سرمایه") && ( */}

          <div className="space-y-1">
            <Controller
              name="financier"
              control={control}
              render={({ field }) => (
                <SelectForFilterCheques
                  data={transactionShowRoomCardOptions?.[0]?.options ?? [""]}
                  title="سرمایه گذار"
                  selectedValue={field.value || "انتخاب کنید"}
                  setSelectedSubject={field.onChange}
                  className="w-40 truncate"
                  // disabled={
                  //   !["برداشت سرمایه", "افزایش سرمایه"].includes(
                  //     transactionType
                  //   ) || showRoomCardTitle !== "مشتری به مشتری"
                  // }
                  disabled={
                    !["برداشت سرمایه", "افزایش سرمایه"].includes(
                      transactionType
                    )
                  }
                />
              )}
            />
            {(transactionType === "افزایش سرمایه" ||
              transactionType === "برداشت سرمایه" ||
              showRoomCardTitle === "مشتری به مشتری") &&
              errors.financier && (
                <p className="text-red-500 text-right w-full mt-3 text-xs font-medium">
                  {errors.financier.message}
                </p>
              )}
          </div>
          {/* )} */}
          {/* {showRoomCardTitle === "مشتری به مشتری" && ( */}
          {/* <div className="space-y-1">
            <Controller
              name="financier"
              control={control}
              render={({ field }) => (
                <SelectForFilterCheques
                  data={transactionShowRoomCardOptions?.[0]?.options ?? [""]}
                  title="سرمایه گذار"
                  selectedValue={field.value || "انتخاب کنید"}
                  setSelectedSubject={field.onChange}
                  className="w-full"
                />
              )}
              disabled={showRoomCardTitle !== "مشتری به مشتری"}
            />
            {showRoomCardTitle === "مشتری به مشتری" && errors.financier && (
              <p className="text-red-500 text-right w-full mt-3 text-xs font-medium">
                {errors.financier.message}
              </p>
            )}
          </div> */}
          {/* )} */}

          {/* {transactionReason === "درصد کارگزار" && ( */}
          <div className="space-y-1">
            <Controller
              name="operator"
              control={control}
              render={({ field }) => (
                <SelectForFilterCheques
                  data={transactionOperatorsOptions?.[0]?.options ?? [""]}
                  title="کارگزار"
                  selectedValue={field.value || "انتخاب کنید"}
                  setSelectedSubject={field.onChange}
                  className="w-40 truncate"
                  disabled={transactionReason !== "درصد کارگزار"}
                />
              )}
            />
            {transactionReason === "درصد کارگزار" && errors.operator && (
              <p className="text-red-500 text-right w-full mt-3 text-xs font-medium">
                {errors.operator.message}
              </p>
            )}
          </div>
          {/* )} */}
        </div>

        <div className="space-y-5 flex gap-7 w-full">
          <div className="space-y-1">
            <h3 className="text-sm font-bold mb-2 text-blue-900">
              کد ملی مشتری:
            </h3>
            <input
              type="text"
              placeholder="کد ملی مشتری"
              className="bg-transparent placeholder-gray-500/80 outline-none text-sm w-40 truncate border border-gray-500 p-2 rounded-md"
              {...register("customerNationalCode")}
              name="customerNationalCode"
            />
            {errors.customerNationalCode && (
              <p className="text-red-500 text-right w-full mt-3 text-xs font-medium">
                {errors.customerNationalCode.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold mb-2 text-blue-900">
              مبلغ تراکنش:
            </h3>
            <input
              type="text"
              placeholder="مبلغ تراکنش"
              className="bg-transparent placeholder-gray-500/80 outline-none text-sm w-40 truncate border border-gray-500 p-2 rounded-md"
              {...register("transactionAmount")}
              name="transactionAmount"
            />
            {errors.transactionAmount && (
              <p className="text-red-500 text-right w-full mt-3 text-xs font-medium">
                {errors.transactionAmount.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold mb-2 text-blue-900">
              تاریخ تراکنش:
            </h3>
            <input
              type="text"
              placeholder="تاریخ تراکنش"
              className="bg-transparent placeholder-gray-500/80 outline-none text-sm w-40 truncate border border-gray-500 p-2 rounded-md"
              {...register("transactionDate")}
              name="transactionDate"
            />
            {errors.transactionDate && (
              <p className="text-red-500 text-right w-full mt-3 text-xs font-medium">
                {errors.transactionDate.message}
              </p>
            )}
          </div>

          {/* {(transactionType === "افزایش سرمایه" ||
            transactionType === "برداشت سرمایه") && ( */}
          <div className="space-y-1">
            <h3
              className={`text-sm font-bold mb-2 ${
                !["برداشت سرمایه", "افزایش سرمایه"].includes(transactionType)
                  ? "text-gray-400"
                  : "text-blue-900"
              }`}
            >
              درصد سرمایه گذار:
            </h3>
            <input
              type="text"
              placeholder="درصد سرمایه گذار"
              className={`bg-transparent placeholder-gray-500/80 outline-none text-sm border p-2 rounded-md w-40 truncate ${
                !["برداشت سرمایه", "افزایش سرمایه"].includes(transactionType)
                  ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                  : "border-gray-500"
              }`}
              {...register("financierPercent")}
              name="financierPercent"
              disabled={
                !["برداشت سرمایه", "افزایش سرمایه"].includes(transactionType)
              }
            />
            {(transactionType === "افزایش سرمایه" ||
              transactionType === "برداشت سرمایه") &&
              errors.financierPercent && (
                <p className="text-red-500 text-right w-full mt-3 text-xs font-medium">
                  {errors.financierPercent.message}
                </p>
              )}
          </div>
          {/* )} */}
        </div>
      </div>

      <button
        type="submit"
        className="mt-5 w-32 h-9 cursor-pointer flex justify-center items-center text-sm font-semibold rounded-md text-white bg-indigo-500 hover:opacity-90 transition-opacity"
      >
        ثبت اطلاعات
      </button>
    </form>
  );
};

export default TransactionForm;
