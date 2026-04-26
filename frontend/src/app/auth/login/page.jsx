"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn } from "@/lib/api/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { mutate: signIn, isPending, isError, error } = useSignIn();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(form, {
      onSuccess: (data) => {
        if (data?.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        router.push("/");
      },
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f8f4f1] px-2 pb-16pt-10">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-16 flex flex-col items-center"
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
              type="email"
              autoComplete="email"
              required
              placeholder="camille@botanique.com"
              value={form.email}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border border-[#f2eae6] bg-[#f8f4f1] text-[15px] text-[#7e525c] font-sans focus:border-[#7e525c] focus:bg-white outline-none placeholder:text-[#cdb8b0]"
            />
          </div>
          <div className="flex flex-col gap-1 relative">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase ml-2 mb-1 text-[#4E4543]"
              >
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-[#7E525C] font-semibold hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border border-[#f2eae6] bg-[#f8f4f1] text-[15px] text-[#7e525c] font-sans focus:border-[#7e525c] focus:bg-white outline-none placeholder:text-[#cdb8b0]"
            />
          </div>
          {isError && (
            <p className="text-[13px] text-[#c0392b] bg-[#fdf0ef] border border-[#f5c6c3] rounded px-3 py-2 font-sans">
              {error?.message || "Invalid email or password. Please try again."}
            </p>
          )}
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
