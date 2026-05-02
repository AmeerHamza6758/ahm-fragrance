import { useMutation } from "@tanstack/react-query";
import { authApi } from "../endpoints";
import { successToaster, errorToaster } from "../../utils/alert-service";

export function useLogin() {
  return useMutation({
    mutationFn: (payload) => authApi.login(payload),
    onSuccess: (res) => {
      const { token, user } = res.data;
      if (user.role !== 'admin') {
        errorToaster("Access Denied: You do not have administrative privileges.");
        return;
      }
      localStorage.setItem("ahm_admin_token", token);
      localStorage.setItem("ahm_admin_user", JSON.stringify(user));
      successToaster("Authentication successful. Welcome back.");
      window.location.href = "/dashboard";
    },
    onError: (error) => {
      errorToaster(error?.response?.data?.message || "Authentication failed. Please check your credentials.");
    },
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (payload) => authApi.updateProfile(payload),
    onSuccess: (res) => {
      const { data } = res.data;
      localStorage.setItem("ahm_admin_user", JSON.stringify(data));
      successToaster("Profile updated successfully.");
    },
    onError: (error) => {
      errorToaster(error?.response?.data?.message || "Failed to update profile.");
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (payload) => authApi.updatePassword(payload),
    onSuccess: () => {
      successToaster("Password updated successfully.");
    },
    onError: (error) => {
      errorToaster(error?.response?.data?.message || "Failed to update password.");
    },
  });
}

