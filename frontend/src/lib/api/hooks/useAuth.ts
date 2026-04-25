/**
 * useAuth Hook
 * React Query mutations for signIn, signUp, OTP verification, and password reset
 */

import { useMutation } from "@tanstack/react-query";
import {
  signIn,
  signUp,
  verifyEmailOtp,
  resendEmailOtp,
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
  SignInPayload,
  SignUpPayload,
  VerifyEmailOtpPayload,
  ResendEmailOtpPayload,
  SendPasswordResetOtpPayload,
  VerifyPasswordResetOtpPayload,
  VerifyPasswordResetOtpResult,
  ResetPasswordPayload,
  AuthResult,
} from "../endpoints/auth";

export const useSignIn = () => {
  return useMutation<AuthResult, Error, SignInPayload>({
    mutationFn: signIn,
  });
};

export const useSignUp = () => {
  return useMutation<AuthResult, Error, SignUpPayload>({
    mutationFn: signUp,
  });
};

export const useVerifyEmailOtp = () => {
  return useMutation({
    mutationFn: (payload: VerifyEmailOtpPayload) => verifyEmailOtp(payload),
  });
};

export const useResendEmailOtp = () => {
  return useMutation({
    mutationFn: (payload: ResendEmailOtpPayload) => resendEmailOtp(payload),
  });
};

export const useSendPasswordResetOtp = () => {
  return useMutation({
    mutationFn: (payload: SendPasswordResetOtpPayload) => sendPasswordResetOtp(payload),
  });
};

export const useVerifyPasswordResetOtp = () => {
  return useMutation<VerifyPasswordResetOtpResult, Error, VerifyPasswordResetOtpPayload>({
    mutationFn: verifyPasswordResetOtp,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
  });
};
