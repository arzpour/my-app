"use client";
import useGetTransactionFormOptions from "@/hooks/useGetTransactionFormOptions";
import {
  transactionSchema,
  transactionSchemaType,
} from "@/validations/tranaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

const TransactionForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<transactionSchemaType>({
    mode: "all",
    resolver: zodResolver(transactionSchema),
  });

  const { data: getTransactionFormOptions } = useGetTransactionFormOptions();
  console.log("🚀 ~ TransactionForm ~ getTransactionFormOptions:", getTransactionFormOptions)

  const onSubmit: SubmitHandler<transactionSchemaType> = async (data) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    if (!data) return;

    try {
      toast("وارد شدید", {
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="md:w-96 w-80 flex flex-col items-center justify-center"
    >
      <h4 className="text-2xl text-gray-900 font-medium">فرم تراکنش</h4>

      {/* <div className="flex pr-5 items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
        <input
          type="text"
          placeholder="نام کاربری"
          className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
          required
          {...register("")}
          name="username"
          autoComplete="username"
        />
      </div>
      {errors.username && (
        <p className="text-red-500 text-right w-full mt-3 text-xs font-medium">
          {errors.username.message}
        </p>
      )} */}

      {/* <div className="flex pr-5 items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
        <input
          type="password"
          {...register("password")}
          name="password"
          autoComplete="password"
          placeholder="رمز عبور"
          className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
          required
        />
      </div>
      {errors.password && (
        <p className="text-red-500 text-right w-full mt-3 text-xs font-medium">
          {errors.password.message}
        </p>
      )} */}

      <button
        type="submit"
        className="mt-8 w-full h-11 flex justify-center items-center font-semibold rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
      >
        ثبت
      </button>
    </form>
  );
};

export default TransactionForm;
