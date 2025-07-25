import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Dashboard from "./components/Dashboard";
import DocQueryAI from "./components/DocQueryAI";
import Pricing from "./components/Pricing";
import Navbar from "./components/Navbar";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { isValidAuthenticated } from "./utils/auth";
import { setupAuthInterceptor } from "./utils/auth";
import api from "./api";

// Component to handle authenticated user redirects from public routes
const PublicRoute = ({ children }) => {
  const isAuth = isValidAuthenticated();
  if (isAuth) {
    // If user is authenticated and trying to access login/signup, redirect to doc-query
    return <Navigate to="/doc-query" replace />;
  }
  return children;
};

// Component to handle authenticated user redirects from root
const AuthenticatedRedirect = () => {
  const isAuth = isValidAuthenticated();
  // Always redirect authenticated users to doc-query page
  if (isAuth) {
    return <Navigate to="/doc-query" replace />;
  }
  // Redirect unauthenticated users to home
  return <Navigate to="/home" replace />;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up axios interceptor for automatic logout on 401
    setupAuthInterceptor(api);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          {/* Root redirect - authenticated users go to doc-query, others to home */}
          <Route path="/" element={<AuthenticatedRedirect />} />

          {/* Home page - only for non-authenticated users */}
          <Route
            path="/home"
            element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            }
          />

          {/* Auth routes - redirect to doc-query if already logged in */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* Protected routes - require authentication */}
          <Route
            path="/doc-query"
            element={
              <ProtectedRoute>
                <DocQueryAI />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pricing"
            element={
              <ProtectedRoute>
                <Pricing />
              </ProtectedRoute>
            }
          />

          {/* Payment routes (can be accessed by authenticated users) */}
          <Route
            path="/payment-success"
            element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-cancel"
            element={
              <ProtectedRoute>
                <PaymentCancel />
              </ProtectedRoute>
            }
          />

          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
