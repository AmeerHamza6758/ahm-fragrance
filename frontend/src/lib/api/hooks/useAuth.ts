/**
 * useAuth Hook
 * React Query mutations for signIn, signUp, OTP verification, and password reset
 */

import {
  signIn,
  signUp,
  verifyEmailOtp,
  resendEmailOtp,
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
  getProfile,
  updateProfile,
  SignInPayload,
  SignUpPayload,
  VerifyEmailOtpPayload,
  ResendEmailOtpPayload,
  SendPasswordResetOtpPayload,
  VerifyPasswordResetOtpPayload,
  VerifyPasswordResetOtpResult,
  ResetPasswordPayload,
  UpdateProfilePayload,
  UserResponse,
  AuthResult,
} from "../endpoints/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export const useGetProfile = (id: string) => {
  return useQuery<UserResponse, Error>({
    queryKey: ["profile", id],
    queryFn: () => getProfile(id),
    enabled: !!id,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
