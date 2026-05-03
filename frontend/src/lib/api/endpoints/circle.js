import apiClient from "../client";

export const joinCircle = async (email) => {
  try {
    const response = await apiClient.post("/api/circle/join", { email });
    return response.data;
  } catch (error) {
    console.error("Error joining circle:", error);
    throw error;
  }
};
