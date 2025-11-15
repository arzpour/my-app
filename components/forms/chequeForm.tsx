"use client";
import useGetAllCategoryWithOptionSettings from "@/hooks/useGetCategoriesSetting";
import { chequeSchema, chequeSchemaType } from "@/validations/option";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import PersianDatePicker from "../global/persianDatePicker";
import SelectForFilterCheques from "../selectForFilterCheques";
import { useCreateCheque } from "@/apis/mutations/cheques";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const ChequeForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    control,
    reset,
  } = useForm<chequeSchemaType>({
    mode: "all",
    resolver: zodResolver(chequeSchema),
    // defaultValues: {
    //   customerName: "",
    //   customerNationalCode: "",
    //   chequeChargeOwner: "",
    //   chequeOwnerNationalCode: "",
    //   sayadiId: "",
    //   seri: "",
    //   serial: "",
    //   bankName: "",
    //   bankBranch: "",
    //   chequeAmount: "",
    //   chequeDatebook: "",
    //   chequeStatus: "",
    //   lastAction: "",
    //   lastActionDate: "",
    // },
  });

  const { data: getAllCategoryWithOptionSettings } =
    useGetAllCategoryWithOptionSettings();
  const { chassisNo } = useSelector((state: RootState) => state.cars);
  const createCheque = useCreateCheque();

  const bankNameOptions = getAllCategoryWithOptionSettings?.filter(
    (item) => item.category === "bankName"
  );

  const chequeStatusOptions = getAllCategoryWithOptionSettings?.filter(
    (item) => item.category === "chequeStatus"
  );

  const onSubmit: SubmitHandler<chequeSchemaType> = async (data) => {
    if (!data) return;

    if (!chassisNo) {
      toast("لطفا ابتدا شماره شاسی را انتخاب کنید", {
        className: "!bg-red-100 !text-red-800 !shadow-md !h-[60px]",
      });
      return;
    }

    try {
      // Map form data to backend schema
      const payload: Partial<IChequeRes> = {
        CarChassisNo: Number(chassisNo) || 0,
        CustomerName: data.customerName,
        CustomerNationalID: data.customerNationalCode,
        AccountHolderName: data.chequeChargeOwner,
        AccountHolderNationalID: data.chequeOwnerNationalCode,
        ChequeSeries: data.seri,
        ChequeSerial: Number(data.serial) || 0,
        SayadiID: data.sayadiId,
        ChequeAmount: Number(data.chequeAmount) || 0,
        ChequeDueDate: data.chequeDatebook,
        ChequeRegisterDate: new Date().toISOString().split("T")[0],
        LastActionDate: data.lastActionDate,
        LastAction: data.lastAction,
        ChequeStatus: data.chequeStatus,
        ChequeType: "",
        ChequeNotes: "",
        CirculationStage: "",
        Bank: data.bankName,
        Branch: data.bankBranch,
        PrevChequeNo: 0,
        ShowroomAccountCard: "",
      };

      await createCheque.mutateAsync(payload);

      reset();
      toast("ثبت شد", {
        icon: "✅",
        className: "!bg-green-100 !text-green-800 !shadow-md !h-[60px]",
      });
    } catch (error) {
      console.error("Error creating cheque:", error);
      toast("اطلاعات وارد شده صحیح نیست", {
        className: "!bg-red-100 !text-red-800 !shadow-md !h-[60px]",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col flex-wrap mx-4 mt-5 justify-center"
    >
      <h4 className="text-xl text-gray-900 font-medium mb-7">فرم چک</h4>

      <div className="space-y-4">
        <div className="grid grid-cols-5 gap-7 lg:gap-10 items-start space-y-5">
          <div className="flex flex-col gap-3">
            <div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-blue-900">
                  نام مشتری:
                </h3>
                <input
                  type="text"
                  placeholder="نام مشتری"
                  className="bg-transparent placeholder-gray-500/80 outline-none text-sm w-full border border-gray-500 p-2 rounded-md"
                  {...register("customerName")}
                  name="customerName"
                />
              </div>

              {errors.customerName && (
                <p className="text-red-500 text-right w-full mt-1.5 text-xs font-medium">
                  {errors.customerName.message}
                </p>
              )}
            </div>
            <div>
              <div className="space-y-1 flex gap-2 items-center">
                <h3 className="text-sm font-bold mb-2 text-blue-900">کدملی:</h3>
                <input
                  type="text"
                  placeholder="کدملی"
                  className="bg-transparent placeholder-gray-500/80 outline-none text-sm w-full border border-gray-500 p-2 rounded-md"
                  {...register("customerNationalCode")}
                  name="customerNationalCode"
                />
              </div>
              {errors.customerNationalCode && (
                <p className="text-red-500 text-right w-full mt-1.5 text-xs font-medium">
                  {errors.customerNationalCode.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-blue-900">
                  صاحب حساب چک:
                </h3>
                <input
                  type="text"
                  placeholder="صاحب حساب چک"
                  className="bg-transparent placeholder-gray-500/80 outline-none text-sm w-full border border-gray-500 p-2 rounded-md"
                  {...register("chequeChargeOwner")}
                  name="chequeChargeOwner"
                />
              </div>
              {errors.chequeChargeOwner && (
                <p className="text-red-500 text-right w-full mt-1.5 text-xs font-medium">
                  {errors.chequeChargeOwner.message}
                </p>
              )}
            </div>
            <div>
              <div className="space-y-1 flex gap-2 items-center">
                <h3 className="text-sm font-bold mb-2 text-blue-900">کدملی:</h3>
                <input
                  type="text"
                  placeholder="کدملی"
                  className="bg-transparent placeholder-gray-500/80 outline-none text-sm w-full border border-gray-500 p-2 rounded-md"
                  {...register("chequeOwnerNationalCode")}
                  name="chequeOwnerNationalCode"
                />
              </div>
              {errors.chequeOwnerNationalCode && (
                <p className="text-red-500 text-right w-full mt-1.5 text-xs font-medium">
                  {errors.chequeOwnerNationalCode.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-blue-900">
                  شناسه صیادی:
                </h3>
                <input
                  type="text"
                  placeholder="شناسه صیادی"
                  className="bg-transparent placeholder-gray-500/80 outline-none text-sm w-full border border-gray-500 p-2 rounded-md"
                  {...register("sayadiId")}
                  name="sayadiId"
                />
              </div>
              {errors.sayadiId && (
                <p className="text-red-500 text-right w-full mt-1.5 text-xs font-medium">
                  {errors.sayadiId.message}
                </p>
              )}
            </div>
            <div className="flex gap-3 items-center">
              <div>
                <div className="space-y-1 flex gap-2 items-center">
                  <h3 className="text-sm font-bold mb-2 text-blue-900">سری:</h3>
                  <input
                    type="text"
                    placeholder="سری"
                    className="bg-transparent placeholder-gray-500/80 outline-none text-sm w-full border border-gray-500 p-2 rounded-md"
                    {...register("seri")}
                    name="seri"
                  />
                </div>
                {errors.seri && (
                  <p className="text-red-500 text-right w-full mt-1.5 text-xs font-medium">
                    {errors.seri.message}
                  </p>
                )}
              </div>
              <div>
                <div className="space-y-1 flex gap-2 items-center">
                  <h3 className="text-sm font-bold mb-2 text-blue-900">
                    سریال:
                  </h3>
                  <input
                    type="text"
                    placeholder="سریال"
                    className="bg-transparent placeholder-gray-500/80 outline-none text-sm w-full border border-gray-500 p-2 rounded-md"
                    {...register("serial")}
                    name="serial"
                  />
                </div>
                {errors.serial && (
                  <p className="text-red-500 text-right w-full mt-1.5 text-xs font-medium">
                    {errors.serial.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <div className="space-y-1">
                {/* <h3 className="text-sm font-bold mb-2 text-blue-900">
                  نام بانک:
                </h3> */}
                {/* <input
                  type="text"
                  placeholder="نام بانک"
                  className="bg-transparent placeholder-gray-500/80 outline-none text-sm w-full border border-gray-500 p-2 rounded-md"
                  {...register("bankName")}
                  name="bankName"
                /> */}
                <Controller
                  name="bankName"
                  control={control}
                  render={({ field }) => (
                    <SelectForFilterCheques
                      data={bankNameOptions?.[0]?.options ?? [""]}
                      title="نام بانک"
                      selectedValue={field.value || "انتخاب کنید"}
                      setSelectedSubject={field.onChange}
                      className="w-70 truncate"
                    />
                  )}
                />
              </div>
              {errors.bankName && (
                <p className="text-red-500 text-right w-full mt-1.5 text-xs font-medium">
                  {errors.bankName.message}
                </p>
              )}
            </div>
            <div>
              <div className="space-y-1 flex gap-2 items-center">
                <h3 className="text-sm font-bold mb-2 text-blue-900">شعبه:</h3>
                <input
                  type="text"
                  placeholder="شعبه"
                  className="bg-transparent placeholder-gray-500/80 outline-none text-sm w-full border border-gray-500 p-2 rounded-md"
                  {...register("bankBranch")}
                  name="bankBranch"
                />
              </div>
              {errors.bankBranch && (
                <p className="text-red-500 text-right w-full mt-1.5 text-xs font-medium">
                  {errors.bankBranch.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-7 lg:gap-10 items-start space-y-5">
          <div className="flex flex-col gap-3">
            <div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-blue-900">
                  مبلغ چک:
                </h3>
                <input
                  type="text"
                  placeholder="مبلغ چک"
                  className="bg-transparent placeholder-gray-500/80 outline-none text-sm w-full border border-gray-500 p-2 rounded-md"
                  {...register("chequeAmount")}
                  name="chequeAmount"
                />
              </div>
              {errors.chequeAmount && (
                <p className="text-red-500 text-right w-full mt-1.5 text-xs font-medium">
                  {errors.chequeAmount.message}
                </p>
              )}
            </div>
            <div>
              <div className="space-y-1 flex gap-2 items-center">
                <h3 className="text-sm font-bold mb-2 text-blue-900">
                  تاریخ سررسید:
                </h3>
                {/* <input
                  type="text"
                  placeholder="تاریخ سررسید"
                  className="bg-transparent placeholder-gray-500/80 outline-none text-sm w-full border border-gray-500 p-2 rounded-md"
                  {...register("chequeDatebook")}
                  name="chequeDatebook"
                /> */}
                <PersianDatePicker
                  value={getValues().chequeDatebook}
                  onChange={(date) => setValue("chequeDatebook", date)}
                  placeholder="تاریخ سررسید"
                />
              </div>
              {errors.chequeDatebook && (
                <p className="text-red-500 text-right w-full mt-1.5 text-xs font-medium">
                  {errors.chequeDatebook.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="space-y-1">
              {/* <h3 className="text-sm font-bold mb-2 text-blue-900">
                وضعیت چک:
              </h3> */}
              {/* <input
                type="text"
                placeholder="وضعیت چک"
                className="bg-transparent placeholder-gray-500/80 outline-none text-sm w-full border border-gray-500 p-2 rounded-md"
                {...register("chequeStatus")}
                name="chequeStatus"
              /> */}
              <Controller
                name="chequeStatus"
                control={control}
                render={({ field }) => (
                  <SelectForFilterCheques
                    data={chequeStatusOptions?.[0]?.options ?? [""]}
                    title="وضعیت چک"
                    selectedValue={field.value || "انتخاب کنید"}
                    setSelectedSubject={field.onChange}
                    className="w-70 truncate"
                  />
                )}
              />
            </div>
            {errors.chequeStatus && (
              <p className="text-red-500 text-right w-full mt-1.5 text-xs font-medium">
                {errors.chequeStatus.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-blue-900">
                  آخرین اقدام:
                </h3>
                <input
                  type="text"
                  placeholder="آخرین اقدام"
                  className="bg-transparent placeholder-gray-500/80 outline-none text-sm w-full border border-gray-500 p-2 rounded-md"
                  {...register("lastAction")}
                  name="lastAction"
                />
              </div>
              {errors.lastAction && (
                <p className="text-red-500 text-right w-full mt-1.5 text-xs font-medium">
                  {errors.lastAction.message}
                </p>
              )}
            </div>
            <div>
              <div className="space-y-1 flex gap-2 items-center">
                <h3 className="text-sm font-bold mb-2 text-blue-900">
                  تاریخ اقدام:
                </h3>
                {/* <input
                  type="text"
                  placeholder="تاریخ اقدام"
                  className="bg-transparent placeholder-gray-500/80 outline-none text-sm w-full border border-gray-500 p-2 rounded-md"
                  {...register("lastActionDate")}
                  name="lastActionDate"
                /> */}
                <PersianDatePicker
                  value={getValues().lastActionDate}
                  onChange={(date) => setValue("lastActionDate", date)}
                  placeholder="تاریخ اقدام"
                />
              </div>
              {errors.lastActionDate && (
                <p className="text-red-500 text-right w-full mt-1.5 text-xs font-medium">
                  {errors.lastActionDate.message}
                </p>
              )}
            </div>
          </div>
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

export default ChequeForm;
