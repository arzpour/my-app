"use client";
import { useLogin } from "@/apis/mutations/auth";
import { setRole } from "@/redux/slices/carSlice";
import { loginSchema, loginSchemaType } from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const Login = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginSchemaType>({
    mode: "all",
    resolver: zodResolver(loginSchema),
  });

  const login = useLogin();
  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<loginSchemaType> = async (data) => {
    if (!data) return;
    try {
      const res = await login.mutateAsync(data);
      router.push("/panel");
      dispatch(setRole(res.data.user.role));
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
    <div className="flex h-dvh w-full">
      <div className="w-full flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="md:w-96 w-80 flex flex-col items-center justify-center"
        >
          <h2 className="text-4xl text-gray-900 font-medium">ورود به پنل</h2>
          <p className="text-sm text-gray-500/90 my-3">
            {/* Welcome back! Please sign in to continue */}
            خوش آمدید! برای ادامه وارد شوید
          </p>

          <div className="flex pr-5 items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-user-icon lucide-user"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              type="text"
              placeholder="نام کاربری"
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              required
              {...register("username")}
              name="username"
              autoComplete="username"
            />
          </div>
          {errors.username && (
            <p className="text-red-500 text-right w-full mt-3 text-xs font-medium">
              {errors.username.message}
            </p>
          )}

          <div className="flex pr-5 items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <svg
              width="13"
              height="17"
              viewBox="0 0 13 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                fill="#6B7280"
              />
            </svg>
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
          )}

          <div className="w-full flex items-center justify-between mt-8 text-gray-500/80">
            <div className="flex items-center gap-2">
              <input className="h-5" type="checkbox" id="checkbox" />
              <label className="text-sm" htmlFor="checkbox">
                مرا به خاطر بسپار
              </label>
            </div>
            <a className="text-sm underline" href="#">
              {/* Forgot password? */}
              فراموشی رمز
            </a>
          </div>

          <button
            type="submit"
            className="mt-8 w-full h-11 cursor-pointer flex justify-center items-center font-semibold rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
          >
            ورود
            {login.isPending && (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            )}
          </button>
          {/* <p className="text-gray-500/90 text-sm mt-4">
            Don’t have an account?{" "}
            <a className="text-indigo-400 hover:underline" href="#">
              Sign up
            </a>
          </p> */}
        </form>
      </div>

      <div className="w-full hidden md:inline-block">
        {/* <img
          className="h-full"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
          alt="leftSideImage"
        /> */}

        <img
          src="/Airbrush-OBJECT-REMOVER-1763980310364.jpg"
          alt="googleLogo"
          className="h-full w-full object-cover"
        />

        {/* 
        <img
          src="/photo-1496917756835-20cb06e75b4e.jpg"
          alt="googleLogo"
          className="h-full"
        /> */}
      </div>
    </div>
  );
};

export default Login;
