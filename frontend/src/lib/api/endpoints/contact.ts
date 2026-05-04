import axios from "axios";

// Usually, the base URL is configured in a central axios instance or env variable
// Let's use the local backend URL for this API endpoint
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const sendContactInquiry = async (data: { name: string, email: string, subject: string, message: string }) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/contact/create`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
