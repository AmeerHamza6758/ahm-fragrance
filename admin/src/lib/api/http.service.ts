import axiosInstance from "./axios.config";
import { handleApiError } from "./error-handler";

const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async (method: string, url: string, data?: any, params?: any) => {
  try {
    const headers = getAuthHeaders();
    const response = await axiosInstance({ method, url, data, params, headers });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getRequest = (url: string, params?: any) => request("GET", url, undefined, params);
export const postRequest = (url: string, data: any, params?: any) => request("POST", url, data, params);
export const putRequest = (url: string, data: any, params?: any) => request("PUT", url, data, params);
export const patchRequest = (url: string, data: any, params?: any) => request("PATCH", url, data, params);
export const deleteRequest = (url: string, params?: any) => request("DELETE", url, undefined, params);

export const getFilePathWithBackendUrl = (path: string): string => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL || ""}${path}`;
};
