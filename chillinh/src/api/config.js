// API Configuration
console.log("Current API URL:", import.meta.env.VITE_API_URL);
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
export default API_BASE_URL;
export const API_ENDPOINTS = {
  // Add your API endpoints here
  // Example:
  // users: `${API_BASE_URL}/users`,
  // products: `${API_BASE_URL}/products`,
};

export const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
