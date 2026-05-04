import apiClient from "../client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  userName: string;
  email: string;
  password: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    province?: string;
    postalCode?: string;
  };
}

export interface AuthUser {
  _id: string;
  userName: string;
  email: string;
  createdAt?: string;
}

export interface AuthResult {
  token: string;
  user: AuthUser;
  message?: string;
}

export interface VerifyEmailOtpPayload {
  email: string;
  otpCode: string;
}

export interface ResendEmailOtpPayload {
  email: string;
}

export interface SendPasswordResetOtpPayload {
  email: string;
}

export interface VerifyPasswordResetOtpPayload {
  email: string;
  otpCode: string;
}

export interface VerifyPasswordResetOtpResult {
  tempToken: string;
  message?: string;
}

export interface ResetPasswordPayload {
  tempToken: string;
  newPassword: string;
}

export interface UpdateProfilePayload {
  userName?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: {
    street?: string;
    city?: string;
    province?: string;
    postalCode?: string;
  };
}

export interface UserResponse {
  success: boolean;
  data: AuthUser & {
    phone?: string;
    gender?: string;
    dateOfBirth?: string;
    address?: {
      street?: string;
      city?: string;
      province?: string;
      postalCode?: string;
    };
  };
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/signIn
 */
export const signIn = async (payload: SignInPayload): Promise<AuthResult> => {
  const { data } = await apiClient.post<AuthResult>("/api/auth/signIn", payload);
  return data;
};

/**
 * POST /api/auth/signUp
 */
export const signUp = async (payload: SignUpPayload): Promise<AuthResult> => {
  const { data } = await apiClient.post<AuthResult>("/api/auth/signUp", payload);
  return data;
};

/**
 * POST /api/auth/otp — Verify email OTP after signup
 */
export const verifyEmailOtp = async (payload: VerifyEmailOtpPayload) => {
  const { data } = await apiClient.post("/api/auth/otp", {
    email: payload.email,
    type: "email_verification",
    otpCode: payload.otpCode,
  });
  return data;
};

/**
 * POST /api/auth/otp — Resend email verification OTP
 */
export const resendEmailOtp = async (payload: ResendEmailOtpPayload) => {
  const { data } = await apiClient.post("/api/auth/otp", {
    email: payload.email,
    type: "email_verification",
  });
  return data;
};

/**
 * POST /api/auth/otp — Send password reset OTP
 */
export const sendPasswordResetOtp = async (payload: SendPasswordResetOtpPayload) => {
  const { data } = await apiClient.post("/api/auth/otp", {
    email: payload.email,
    type: "password_reset",
  });
  return data;
};

/**
 * POST /api/auth/otp — Verify password reset OTP, returns tempToken
 */
export const verifyPasswordResetOtp = async (
  payload: VerifyPasswordResetOtpPayload
): Promise<VerifyPasswordResetOtpResult> => {
  const { data } = await apiClient.post<VerifyPasswordResetOtpResult>("/api/auth/otp", {
    email: payload.email,
    type: "password_reset",
    otpCode: payload.otpCode,
  });
  return data;
};

/**
 * POST /api/auth/reset-password — Reset password using tempToken
 */
export const resetPassword = async (payload: ResetPasswordPayload) => {
  const { data } = await apiClient.post("/api/auth/reset-password", payload);
  return data;
};

/**
 * GET /api/auth/getUserById — Get profile by ID
 */
export const getProfile = async (id: string): Promise<UserResponse> => {
  const { data } = await apiClient.get<UserResponse>(`/api/auth/getUserById?id=${id}`);
  return data;
};

/**
 * PUT /api/auth/update-profile — Update current user profile
 */
export const updateProfile = async (payload: UpdateProfilePayload) => {
  const { data } = await apiClient.put("/api/auth/update-profile", payload);
  return data;
};
