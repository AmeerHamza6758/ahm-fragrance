import { apiClient } from "../client";

export const getCMSContent = async (key) => {
  try {
    const response = await apiClient.get(`/api/cms/${key}`);
    return response.data?.data;
  } catch (error) {
    // Missing CMS content (404) is an expected state for some pages during builds.
    // Keep behavior (return null), but avoid noisy stack traces in production builds.
    const status = error?.response?.status;
    if (process.env.NODE_ENV === "development" && status !== 404) {
      console.error(`Error fetching CMS content for ${key}:`, error);
    }
    return null;
  }
};

export const getAllCMSKeys = async () => {
  try {
    const response = await apiClient.get("/api/cms/all/keys");
    return response.data?.data;
  } catch (error) {
    const status = error?.response?.status;
    if (process.env.NODE_ENV === "development" && status !== 404) {
      console.error("Error fetching CMS keys:", error);
    }
    return [];
  }
};
