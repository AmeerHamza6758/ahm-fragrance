"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn } from "@/lib/api/hooks/useAuth";
import { persistAuthSession } from "@/lib/store/userProfileStore";
import { Eye, EyeOff } from "lucide-react";
import { errorToaster } from "@/utils/alert-service";

export default function LoginPage() {
  const router = useRouter();
  const { mutate: signIn, isPending } = useSignIn();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const validate = (name, value) => {
    let error = "";
    if (name === "email") {
      if (!value) {
        error = "Email address is required";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = "Please enter a valid email address";
      }
    } else if (name === "password") {
      if (!value) {
        error = "Password is required";
      } else if (value.length < 6) {
        error = "Password must be at least 6 characters";
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const error = validate(key, form[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ email: true, password: true })
      return;
    }

    signIn(form, {
      onSuccess: (data) => {
        persistAuthSession({ token: data?.token, user: data?.user });
        router.push("/");
      },
      onError: (err) => {
        errorToaster(
          err?.response?.data?.message ||
            err?.message ||
            "Invalid email or password. Please try again.",
        );
      },
    });
  };

  return (
    <main className="flex items-start justify-center px-2 pt-6 pb-10 sm:pt-10 sm:pb-16">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center"
        style={{ boxShadow: "0 8px 48px 0 rgba(80,30,40,0.10)" }}
      >
        <h1
          className="font-noto text-3xl sm:text-[48px] text-[#7e525c] font-bold mb-2 leading-tight text-center"
        >
          Welcome Back
        </h1>
        <p className="text-sm sm:text-base text-[#4E4543] mb-8 text-center font-normal">
          Return to AHM Fragrances, your peaceful place.
          <br />
          Start smelling the scents again.
        </p>

        <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase ml-2 mb-1 text-[#4E4543]"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="text"
              autoComplete="email"
              placeholder="camille@botanique.com"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="px-4 py-3 rounded-xl border border-[#f2eae6] bg-[#f8f4f1] text-[15px] text-[#7e525c] font-sans focus:border-[#7e525c] focus:bg-white outline-none placeholder:text-[#cdb8b0]"
            />
            {touched.email && errors.email && (
              <span className="text-xs text-red-500 mt-1 ml-2">{errors.email}</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase ml-2 mb-1 text-[#4E4543]"
              >
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-[#7E525C] font-semibold hover:underline mr-2"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-4 py-3 rounded-xl border border-[#f2eae6] bg-[#f8f4f1] text-[15px] text-[#7e525c] font-sans focus:border-[#7e525c] focus:bg-white outline-none placeholder:text-[#cdb8b0] pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#cdb8b0] hover:text-[#7e525c] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {touched.password && errors.password && (
              <span className="text-xs text-red-500 mt-1 ml-2">{errors.password}</span>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-[#7e525c] text-white rounded-full text-[16px] font-semibold tracking-wider font-sans shadow hover:bg-[#6b4350] transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isPending}
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-center mt-8 text-[15px] text-[#a08a8a] font-sans">
          New to the gardens?{" "}
          <Link
            href="/auth/signup"
            className="text-[#7e525c] font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
