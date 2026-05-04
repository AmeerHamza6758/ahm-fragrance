import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const joinFragranceCircle = async (email: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/circle/join`, { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};
