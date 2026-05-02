"use client";

import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyEmailOtp, useResendEmailOtp } from "@/lib/api/hooks/useAuth";

function VerifyInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const { mutate: verifyOtp, isPending } = useVerifyEmailOtp();
  const { mutate: resendOtp, isPending: isResending } = useResendEmailOtp();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [error, setError] = useState("");
  const [resendMsg, setResendMsg] = useState("");

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    const newCode = [...code];
    pasted.split("").forEach((char, i) => {
      newCode[i] = char;
    });
    setCode(newCode);
    const lastFilled = Math.min(pasted.length, 5);
    inputRefs.current[lastFilled]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = code.join("");
    if (otpCode.length !== 6) return;
    setError("");
    verifyOtp(
      { email, otpCode },
      {
        onSuccess: () => router.push("/auth/login"),
        onError: (err) => {
          setError(
            err?.response?.data?.message ??
              err?.response?.data?.error ??
              "Invalid or expired code. Please try again.",
          );
        },
      },
    );
  };

  const handleResend = () => {
    setError("");
    setResendMsg("");
    resendOtp(
      { email },
      {
        onSuccess: () =>
          setResendMsg("A new code has been sent to your email."),
        onError: (err) => {
          setError(
            err?.response?.data?.message ??
              err?.response?.data?.error ??
              "Failed to resend code. Please try again.",
          );
        },
      },
    );
  };

  const isFull = code.every((digit) => digit !== "");

  return (
    <main className="flex items-center justify-center px-2 pb-16 pt-10">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl px-8 py-8 flex flex-col items-center"
        style={{ boxShadow: "0 12px 64px 0 rgba(80,30,40,0.12)" }}
      >
        {/* Email Icon */}
        <div className="mb-3 p-3 rounded-full bg-[#f0d8e0]">
          <svg
            className="w-7 h-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7e525c"
            strokeWidth="2"
          >
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1
          className="font-serif text-[2rem] text-[#3a2a2e] font-semibold mb-2 text-center"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Verification
        </h1>

        <p className="text-[14px] text-[#8a7a7a] text-center mb-1 leading-relaxed font-sans">
          Please enter the 6-digit code sent to your email.
        </p>
        {email && (
          <p className="text-[13px] text-[#7e525c] font-semibold text-center mb-6 font-sans">
            {email}
          </p>
        )}

        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex gap-2 mb-4 justify-center" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 rounded-full border-2 border-[#e8ddd8] bg-[#faf8f7] text-center text-[20px] font-semibold text-[#7e525c] focus:border-[#7e525c] focus:bg-white outline-none transition font-sans"
              />
            ))}
          </div>

          {error && (
            <p className="text-[13px] text-[#c0392b] bg-[#fdf0ef] border border-[#f5c6c3] rounded px-3 py-2 font-sans text-center mb-3">
              {error}
            </p>
          )}
          {resendMsg && (
            <p className="text-[13px] text-[#4caf50] bg-[#f1f8f1] border border-[#c3e6c3] rounded px-3 py-2 font-sans text-center mb-3">
              {resendMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={!isFull || isPending}
            className="w-full py-4 bg-[#7e525c] text-white rounded-full text-[16px] font-semibold tracking-wider font-sans shadow hover:bg-[#6b4350] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Verifying..." : "Verify & Proceed"}
          </button>
        </form>

        <div className="text-center mt-7">
          <p className="text-[13px] text-[#8a7a7a] font-sans">
            Didn&apos;t receive the code?
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-[13px] text-[#7e525c] font-semibold hover:underline focus:outline-none bg-transparent px-0 py-0 mt-1 disabled:opacity-60"
          >
            {isResending ? "Sending..." : "Resend Code"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyInner />
    </Suspense>
  );
}
