import { apiClient } from "../client";

export const getCMSContent = async (key) => {
  try {
    const response = await apiClient.get(`/api/cms/${key}`);
    return response.data?.data;
  } catch (error) {
    console.error(`Error fetching CMS content for ${key}:`, error);
    return null;
  }
};

export const getAllCMSKeys = async () => {
  try {
    const response = await apiClient.get("/api/cms/all/keys");
    return response.data?.data;
  } catch (error) {
    console.error("Error fetching CMS keys:", error);
    return [];
  }
};
