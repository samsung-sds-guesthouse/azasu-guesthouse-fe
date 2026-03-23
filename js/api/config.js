const API_BASE_URL = "";

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

/**
 * A wrapper for the fetch API to handle common tasks like setting headers
 * and handling errors.
 * @param {string} endpoint - The API endpoint to call.
 * @param {object} [options={}] - The options for the fetch call.
 * @returns {Promise<any>} - The JSON response from the API.
 */
async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add authorization token if available
  const token = sessionStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      credentials: "include",
      ...options,
      headers,
    });

    const rawBody = await response.text();
    let data = null;

    if (rawBody) {
      try {
        data = JSON.parse(rawBody);
      } catch {
        data = rawBody;
      }
    }

    if (!response.ok) {
      throw new Error(
        extractApiMessage(data, `HTTP error! status: ${response.status}`),
      );
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
