import { toast } from "sonner";

export const handleApiError = (error, customMessage = null) => {
  console.error("API Error:", error);

  let errorMessage = customMessage || "Something went wrong";

  if (error.response) {
    // Server responded with error status
    switch (error.response.status) {
      case 400:
        errorMessage =
          error.response.data?.message ||
          "Bad request. Please check your input.";
        break;
      case 401:
        errorMessage = "Please log in to continue";
        break;
      case 403:
        errorMessage =
          error.response.data?.message ||
          "You don't have permission to perform this action";
        break;
      case 404:
        errorMessage = "Resource not found";
        break;
      case 409:
        errorMessage =
          error.response.data?.message || "Conflict with existing data";
        break;
      case 422:
        errorMessage =
          error.response.data?.message ||
          "Validation error. Please check your input.";
        break;
      case 429:
        errorMessage = "Too many requests. Please try again later.";
        break;
      case 500:
        errorMessage = "Server error. Please try again later.";
        break;
      case 502:
        errorMessage = "Bad gateway. Please try again later.";
        break;
      case 503:
        errorMessage = "Service unavailable. Please try again later.";
        break;
      default:
        errorMessage =
          error.response.data?.message ||
          `Server error (${error.response.status})`;
    }
  } else if (error.request) {
    // Network error
    errorMessage = "Network error. Please check your internet connection.";
  } else if (error.code === "ECONNABORTED") {
    errorMessage = "Request timed out. Please try again.";
  } else if (error.message) {
    errorMessage = error.message;
  }

  return errorMessage;
};

export const showApiError = (error, customMessage = null) => {
  const errorMessage = handleApiError(error, customMessage);
  toast.error("Error", {
    description: errorMessage,
  });
  return errorMessage;
};

export const showApiSuccess = (message, description = null) => {
  toast.success(message, {
    description,
  });
};

export const showApiWarning = (message, description = null) => {
  toast.warning(message, {
    description,
  });
};

export const showApiInfo = (message, description = null) => {
  toast.info(message, {
    description,
  });
};
