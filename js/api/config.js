const API_BASE_URL = "http://localhost:8080";

function extractApiMessage(data, fallbackMessage) {
  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data === "object") {
    if (typeof data.msg === "string" && data.msg.trim()) {
      return data.msg;
    }

    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }

    if (data.data && typeof data.data === "object") {
      if (typeof data.data.msg === "string" && data.data.msg.trim()) {
        return data.data.msg;
      }

      if (typeof data.data.message === "string" && data.data.message.trim()) {
        return data.data.message;
      }
    }
  }

  return fallbackMessage;
}

async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...options.headers,
  };

  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const token = sessionStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "An unknown error occurred" }));
      const errorMessage = extractApiMessage(
        errorData,
        `HTTP error! status: ${response.status}`,
      );
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      apiError.data = errorData;
      throw apiError;
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
