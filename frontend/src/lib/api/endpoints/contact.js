import apiClient from "../client";

export const submitContact = async (data) => {
  try {
    const response = await apiClient.post("/api/contact/submit", data);
    return response.data;
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error;
  }
};
