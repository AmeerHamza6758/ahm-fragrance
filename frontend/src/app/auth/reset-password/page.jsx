"use client";

import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  useVerifyPasswordResetOtp,
  useResetPassword,
} from "@/lib/api/hooks/useAuth";

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const { mutate: verifyOtp, isPending: isVerifying } =
    useVerifyPasswordResetOtp();
  const { mutate: resetPwd, isPending: isResetting } = useResetPassword();

  // Step 1: verify OTP — Step 2: set new password
  const [step, setStep] = useState(1);
  const [tempToken, setTempToken] = useState("");

  // Step 1 state
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [otpError, setOtpError] = useState("");

  // Step 2 state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // OTP input handlers
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
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const otpCode = code.join("");
    if (otpCode.length !== 6) return;
    setOtpError("");
    verifyOtp(
      { email, otpCode },
      {
        onSuccess: (res) => {
          const token = res?.tempToken ?? res?.data?.tempToken;
          if (token) {
            setTempToken(token);
            setStep(2);
          } else {
            setOtpError("Verification failed. Please try again.");
          }
        },
        onError: (err) => {
          setOtpError(
            err?.response?.data?.message ??
              err?.response?.data?.error ??
              "Invalid or expired code. Please try again.",
          );
        },
      },
    );
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setPwdError("");
    if (newPassword !== confirmPassword) {
      setPwdError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPwdError("Password must be at least 6 characters.");
      return;
    }
    resetPwd(
      { tempToken, newPassword },
      {
        onSuccess: () => router.push("/auth/login?reset=success"),
        onError: (err) => {
          setPwdError(
            err?.response?.data?.message ??
              err?.response?.data?.error ??
              "Failed to reset password. Please try again.",
          );
        },
      },
    );
  };

  const isFull = code.every((d) => d !== "");

  return (
    <main className="flex items-center justify-center bg-linear-to-br from-[#f8f0ed] via-[#f4e8e4] to-[#ede3de] px-2 pb-16 pt-10">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl px-8 py-8 flex flex-col items-center"
        style={{ boxShadow: "0 12px 64px 0 rgba(80,30,40,0.12)" }}
      >
        {step === 1 ? (
          <>
            {/* Lock Icon */}
            <div className="mb-3 p-3 rounded-full bg-[#f0d8e0]">
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7e525c"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>

            <h1
              className="font-serif text-[2rem] text-[#3a2a2e] font-semibold mb-2 text-center"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Enter Reset Code
            </h1>
            <p className="text-[14px] text-[#8a7a7a] text-center mb-1 leading-relaxed font-sans">
              Enter the 6-digit code sent to your email.
            </p>
            {email && (
              <p className="text-[13px] text-[#7e525c] font-semibold text-center mb-6 font-sans">
                {email}
              </p>
            )}

            <form onSubmit={handleVerifyOtp} className="w-full">
              <div
                className="flex gap-2 mb-4 justify-center"
                onPaste={handlePaste}
              >
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

              {otpError && (
                <p className="text-[13px] text-[#c0392b] bg-[#fdf0ef] border border-[#f5c6c3] rounded px-3 py-2 font-sans text-center mb-3">
                  {otpError}
                </p>
              )}

              <button
                type="submit"
                disabled={!isFull || isVerifying}
                className="w-full py-4 bg-[#7e525c] text-white rounded-full text-[16px] font-semibold tracking-wider font-sans shadow hover:bg-[#6b4350] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isVerifying ? "Verifying..." : "Verify Code"}
              </button>
            </form>

            <div className="text-center mt-6">
              <Link
                href="/auth/forgot-password"
                className="text-[13px] text-[#7e525c] font-semibold hover:underline"
              >
                ← Back
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Shield Icon */}
            <div className="mb-3 p-3 rounded-full bg-[#e8f5e9]">
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4caf50"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h1
              className="font-serif text-[2rem] text-[#3a2a2e] font-semibold mb-2 text-center"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              New Password
            </h1>
            <p className="text-[14px] text-[#8a7a7a] text-center mb-8 leading-relaxed font-sans">
              Create a strong new password for your account.
            </p>

            <form
              onSubmit={handleResetPassword}
              className="w-full flex flex-col gap-5"
            >
              {/* New Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#7e525c] font-sans">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#f2eae6] bg-[#f8f4f1] text-[15px] text-[#7e525c] font-sans focus:border-[#7e525c] focus:bg-white outline-none placeholder:text-[#cdb8b0] pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b09090] hover:text-[#7e525c]"
                    tabIndex={-1}
                  >
                    {showNew ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#7e525c] font-sans">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#f2eae6] bg-[#f8f4f1] text-[15px] text-[#7e525c] font-sans focus:border-[#7e525c] focus:bg-white outline-none placeholder:text-[#cdb8b0] pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b09090] hover:text-[#7e525c]"
                    tabIndex={-1}
                  >
                    {showConfirm ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {pwdError && (
                <p className="text-[13px] text-[#c0392b] bg-[#fdf0ef] border border-[#f5c6c3] rounded px-3 py-2 font-sans">
                  {pwdError}
                </p>
              )}

              <button
                type="submit"
                disabled={isResetting || !newPassword || !confirmPassword}
                className="w-full py-4 bg-[#7e525c] text-white rounded-full text-[16px] font-semibold tracking-wider font-sans shadow hover:bg-[#6b4350] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isResetting ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordInner />
    </Suspense>
  );
}
