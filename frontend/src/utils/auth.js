// utils/auth.js

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return (
    token && token.trim() !== "" && token !== "null" && token !== "undefined"
  );
};

// Remove authentication token and clear session
export const logout = () => {
  localStorage.removeItem("token");
  // Clear any other user data from localStorage
  localStorage.removeItem("user");
  localStorage.removeItem("userData");
  // Redirect to home page
  window.location.href = "/";
};

// Get current user token
export const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Validate token format (basic validation)
export const isValidToken = (token) => {
  if (!token || typeof token !== "string") return false;

  // Basic JWT token validation - should have 3 parts separated by dots
  const parts = token.split(".");
  return parts.length === 3;
};

// Enhanced authentication check with token validation
export const isValidAuthenticated = () => {
  const token = getAuthToken();

  if (!isAuthenticated()) return false;
  if (!isValidToken(token)) {
    // Invalid token format, clear it
    logout();
    return false;
  }

  return true;
};

// Set up axios interceptor for automatic logout on 401
export const setupAuthInterceptor = (api) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        logout();
      }
      return Promise.reject(error);
    }
  );
};
