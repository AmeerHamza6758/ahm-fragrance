"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSendPasswordResetOtp } from "@/lib/api/hooks/useAuth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { mutate: sendOtp, isPending } = useSendPasswordResetOtp();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setError("");
    sendOtp(
      { email },
      {
        onSuccess: () => {
          router.push(
            `/auth/reset-password?email=${encodeURIComponent(email)}`,
          );
        },
        onError: (err) => {
          setError(
            err?.response?.data?.message ??
              err?.response?.data?.error ??
              "Failed to send recovery code. Please try again.",
          );
        },
      },
    );
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#f8f0ed] via-[#f4e8e4] to-[#ede3de] px-2 py-8 pt-24">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl px-8 py-8 flex flex-col items-center"
        style={{ boxShadow: "0 12px 64px 0 rgba(80,30,40,0.12)" }}
      >
        {/* Heading */}
        <h1
          className="font-serif text-[2.1rem] text-[#7E525C] font-semibold mb-2 text-center leading-tight"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Password Recovery
        </h1>

        {/* Subtext */}
        <p className="text-[14px] text-[#8a7a7a] text-center mb-8 leading-relaxed font-sans">
          Enter the email address associated with your AHM Fragrance profile and
          we will send a unique recovery code to your inbox.
        </p>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="w-full mb-6">
          <div className="flex flex-col gap-1 mb-6">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider text-[#7e525c] font-sans"
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-xl border border-[#f2eae6] bg-[#f8f4f1] text-[15px] text-[#7e525c] font-sans focus:border-[#7e525c] focus:bg-white outline-none placeholder:text-[#cdb8b0]"
            />
          </div>

          {error && (
            <p className="text-[13px] text-[#c0392b] bg-[#fdf0ef] border border-[#f5c6c3] rounded px-3 py-2 font-sans mb-4">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending || !email}
            className="w-full py-4 bg-[#7e525c] text-white rounded-full text-[16px] font-semibold tracking-wider font-sans shadow hover:bg-[#6b4350] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? "Sending..." : "Send Recovery Code →"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-3 w-full">
          <div className="flex-1 h-px bg-[#e8ddd8]" />
          <span className="text-[13px] text-[#8a7a7a] font-sans">or</span>
          <div className="flex-1 h-px bg-[#e8ddd8]" />
        </div>

        {/* Return to Login */}
        <Link
          href="/auth/login"
          className="text-[14px] text-[#7e525c] font-semibold hover:underline flex items-center gap-1"
        >
          ← Return to Login
        </Link>

        {/* Process Note */}
        <div className="mt-8 p-4 bg-[#f8f4f1] border border-[#e8ddd8] rounded-lg w-full">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#7e525c] font-sans mb-1">
            Process Note
          </p>
          <p className="text-[12px] text-[#8a7a7a] font-sans leading-relaxed">
            The recovery code will expire after 15 minutes. Please ensure you
            check your spam folder if the message does not appear shortly.
          </p>
        </div>
      </div>
    </main>
  );
}
