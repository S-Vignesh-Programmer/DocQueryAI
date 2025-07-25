// hooks/useNavigationGuard.js
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isValidAuthenticated } from "../utils/auth";

// Custom hook to guard navigation and prevent URL manipulation
export const useNavigationGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const isAuth = isValidAuthenticated();

    // Define protected routes
    const protectedRoutes = [
      "/dashboard",
      "/documents",
      "/profile",
      "/settings",
    ];
    const publicRoutes = ["/", "/login", "/signup", "/forgot-password"];

    // Check if current route is protected
    const isProtectedRoute = protectedRoutes.some((route) =>
      currentPath.startsWith(route)
    );

    // Check if current route is public
    const isPublicRoute = publicRoutes.includes(currentPath);

    if (isProtectedRoute && !isAuth) {
      // User trying to access protected route without authentication
      console.log("Unauthorized access attempt to:", currentPath);
      navigate("/login", { replace: true });
      return;
    }

    if (
      isAuth &&
      (currentPath === "/" ||
        currentPath === "/login" ||
        currentPath === "/signup")
    ) {
      // Authenticated user trying to access public routes
      console.log("Authenticated user redirected from:", currentPath);
      navigate("/dashboard", { replace: true });
      return;
    }
  }, [location.pathname, navigate]);

  // Return current auth status
  return {
    isAuthenticated: isValidAuthenticated(),
    currentPath: location.pathname,
  };
};

// Component wrapper that uses the navigation guard
export const NavigationGuard = ({ children }) => {
  useNavigationGuard();
  return children;
};
