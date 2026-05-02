import { errorMessages, warningMessages } from "@/shared/constants/enums.ts/messages.enum";
import { errorToaster } from "@/shared/utils/alert-service";

export const handleApiError = (error: any) => {
  console.error("API Error:", error);

  if (error.response) {
    const { data, status, config } = error.response;
    const message = data?.message || errorMessages.somethingWentWrong;

    switch (status) {
      case 400:
        errorToaster(message || "Bad Request");
        break;

      case 401:
        if (!config.url.includes("/login")) {
          errorToaster(message || warningMessages.sessionExpired);
        }
        localStorage.clear();
        break;

      case 403:
        errorToaster(message || "Access Denied");
        break;

      case 404:
        errorToaster(message || "Not Found");
        break;

      case 500:
        errorToaster(message || "Internal Server Error");
        break;

      default:
        errorToaster(message);
        break;
    }

    return message;
  }

  // Network error (no response)
  if (error.message === "Network Error") {
    errorToaster("Network Error: Check your internet connection");
    return "Network Error";
  }

  // Unexpected error
  const fallback = errorMessages.somethingWentWrong;
  errorToaster(fallback);
  return fallback;
};
