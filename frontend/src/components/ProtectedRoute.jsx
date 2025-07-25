// components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { isValidAuthenticated } from "../utils/auth";

export const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuth = isValidAuthenticated();

  if (!isAuth) {
    // Redirect to login with the current location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Higher-order component for additional protection
export const withAuthGuard = (Component) => {
  return (props) => (
    <ProtectedRoute>
      <Component {...props} />
    </ProtectedRoute>
  );
};
