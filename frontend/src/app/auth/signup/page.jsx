"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp } from "@/lib/api/hooks/useAuth";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const { mutate: signUp, isPending, isError, error } = useSignUp();
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return;
    signUp(form, {
      onSuccess: () => {
        router.push(`/auth/verify?email=${encodeURIComponent(form.email)}`);
      },
    });
  };

  const passwordMismatch =
    form.password &&
    form.confirmPassword &&
    form.password !== form.confirmPassword;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5ede8] px-4 py-10">
      <div
        className="flex w-full max-w-6xl rounded-[48px] overflow-hidden"
        style={{ boxShadow: "0 8px 48px 0 rgba(80,30,40,0.13)" }}
      >
        {/* Left: Full-bleed image with overlay quote */}
        <div className="relative hidden md:block md:w-[42%] lg:w-[40%] shrink-0">
          <Image
            src="/Images/signup.png"
            alt="Perfume"
            fill
            className="object-cover"
            priority
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-[rgba(50,18,22,0.82)] via-[rgba(80,30,40,0.25)] to-transparent" />
          {/* Quote at bottom */}
          <div className="absolute bottom-0 left-0 right-0 px-7 pb-8">
            <p  
              className="text-white font-noto text-2xl sm:text-[32px] leading-snug mb-2"
            >
              &ldquo;The scent of a memory, captured in a bottle.&rdquo;
            </p>
            <span
              className="text-[#e8c9c0] text-[11px] tracking-[0.18em] uppercase font-sans"
              style={{ letterSpacing: "0.18em" }}
            >
              COLLECTION AHM
            </span>
          </div>
        </div>

        {/* Right: Form */}
        <div className="w-full md:w-[58%] lg:w-[60%] bg-white flex flex-col justify-center px-6 sm:px-8 lg:px-10 py-8 sm:py-10">
          <h1
            className=" text-3xl sm:text-[48px] text-[#6b3a44] font-normal mb-1 leading-tight"
          >
            Begin Your Journey
          </h1>
          <p className="text-[13.5px] text-[#b09090] mb-7 font-sans leading-relaxed">
            Join our inner circle for exclusive access to seasonal harvests and
            rare botanical blends.
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="flex flex-col gap-1.25">
              <label
                htmlFor="userName"
                className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#7e525c] font-sans"
              >
                Full Name
              </label>
              <input
                id="userName"
                name="userName"
                type="text"
                autoComplete="name"
                required
                placeholder="Julianne Moore"
                value={form.userName}
                onChange={handleChange}
                onBlur={handleBlur}
                className="px-4 py-2.75 rounded-xl border border-[#ede4df] bg-[#faf7f5] text-[14px] text-[#5a3540] font-sans focus:border-[#7e525c] focus:bg-white outline-none transition placeholder:text-[#cdb8b0]"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.25">
              <label
                htmlFor="email"
                className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#7e525c] font-sans"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="j.moore@botanique.com"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="px-4 py-2.75 rounded-xl border border-[#ede4df] bg-[#faf7f5] text-[14px] text-[#5a3540] font-sans focus:border-[#7e525c] focus:bg-white outline-none transition placeholder:text-[#cdb8b0]"
              />
            </div>

            {/* Password row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.25">
                <label
                  htmlFor="password"
                  className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#7e525c] font-sans"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="px-4 py-2.75 rounded-xl border border-[#ede4df] bg-[#faf7f5] text-[14px] text-[#5a3540] font-sans focus:border-[#7e525c] focus:bg-white outline-none transition placeholder:text-[#cdb8b0]"
                />
              </div>
              <div className="flex flex-col gap-1.25">
                <label
                  htmlFor="confirmPassword"
                  className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#7e525c] font-sans"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="px-4 py-2.75 rounded-xl border border-[#ede4df] bg-[#faf7f5] text-[14px] text-[#5a3540] font-sans focus:border-[#7e525c] focus:bg-white outline-none transition placeholder:text-[#cdb8b0]"
                />
              </div>
            </div>

            {passwordMismatch && touched.confirmPassword && (
              <p className="text-[12px] text-[#c0392b] bg-[#fdf0ef] border border-[#f5c6c3] rounded-lg px-3 py-2 font-sans">
                Passwords do not match.
              </p>
            )}
            {isError && (
              <p className="text-[12px] text-[#c0392b] bg-[#fdf0ef] border border-[#f5c6c3] rounded-lg px-3 py-2 font-sans">
                {error?.message || "Something went wrong. Please try again."}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending || !!passwordMismatch}
              className="w-full mt-1 py-3 rounded-full text-[15px] font-semibold tracking-wide font-sans text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(90deg, #7e525c 0%, #9b6370 100%)",
              }}
            >
              {isPending ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-6 text-[13.5px] text-[#b09090] font-sans">
            Already part of the garden?{" "}
            <Link
              href="/auth/login"
              className="text-[#7e525c] font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
