import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Get token from localStorage with error handling
    try {
      const userToken = localStorage.getItem("token");
      setToken(userToken);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      setToken(null);
    }
    setIsVisible(true);
  }, [location.pathname]); // Re-check token when route changes

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Error removing token from localStorage:", error);
    }
    setToken(null);
    setIsProfileDropdownOpen(false);
    navigate("/login");
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleNavItemClick = (path) => {
    setIsProfileDropdownOpen(false);
    navigate(path);
  };

  // Hide navbar on specific routes
  const hiddenRoutes = ["/", "/home", "/login", "/signup", "/register"];
  const shouldHideNavbar = hiddenRoutes.includes(location.pathname);

  if (shouldHideNavbar) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 ">
      {/* Backdrop blur background */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-lg border-b border-gray-200/50 shadow-sm"></div>

      <div className="relative z-10">
        <div
          className={`max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <div className="flex justify-between items-center py-3 sm:py-4">
            {/* Logo - always redirect to doc-query for authenticated users */}
            <div className="flex-shrink-0">
              <button
                onClick={() => handleNavItemClick("/doc-query")}
                className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
              >
                DocQuery<span className="text-blue-600">AI</span>
              </button>
            </div>

            {/* Navigation Links - Desktop
            <div className="hidden md:flex items-center space-x-8">
              {token && (
                <>
                  <button
                    onClick={() => handleNavItemClick("/doc-query")}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      location.pathname === "/doc-query"
                        ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    Doc Query
                  </button>
                  <button
                    onClick={() => handleNavItemClick("/dashboard")}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      location.pathname === "/dashboard"
                        ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleNavItemClick("/pricing")}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      location.pathname === "/pricing"
                        ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    Pricing
                  </button>
                </>
              )}
            </div> */}

            {/* User Menu */}
            <div className="flex items-center">
              {token ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleProfileDropdown}
                    className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center hover:shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          User Account
                        </p>
                        <p className="text-xs text-gray-500">
                          Manage your profile
                        </p>
                      </div>

                      {/* Mobile navigation items in dropdown */}
                      <div className="md:hidden">
                        <button
                          onClick={() => handleNavItemClick("/doc-query")}
                          className={`flex items-center w-full px-4 py-2 text-sm transition-colors duration-200 ${
                            location.pathname === "/doc-query"
                              ? "text-blue-600 bg-blue-50"
                              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          }`}
                        >
                          <svg
                            className="w-4 h-4 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Doc Query
                        </button>

                        <button
                          onClick={() => handleNavItemClick("/dashboard")}
                          className={`flex items-center w-full px-4 py-2 text-sm transition-colors duration-200 ${
                            location.pathname === "/dashboard"
                              ? "text-blue-600 bg-blue-50"
                              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          }`}
                        >
                          <svg
                            className="w-4 h-4 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0a2 2 0 01-2 2H10a2 2 0 01-2-2v0z"
                            />
                          </svg>
                          Dashboard
                        </button>

                        <button
                          onClick={() => handleNavItemClick("/pricing")}
                          className={`flex items-center w-full px-4 py-2 text-sm transition-colors duration-200 ${
                            location.pathname === "/pricing"
                              ? "text-blue-600 bg-blue-50"
                              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          }`}
                        >
                          <svg
                            className="w-4 h-4 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 8h10M7 12h10M9 16h6c1.1 0 2-.9 2-2s-.9-2-2-2H9c-1.1 0-2-.9-2-2s.9-2 2-2h6M12 6v12"
                            />
                          </svg>
                          Pricing
                        </button>

                        <div className="border-t border-gray-100 my-2"></div>
                      </div>

                      {/* Desktop navigation items (hidden on mobile) */}
                      <div className="hidden md:block">
                        <button
                          onClick={() => handleNavItemClick("/doc-query")}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        >
                          <svg
                            className="w-4 h-4 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Doc Query
                        </button>

                        <button
                          onClick={() => handleNavItemClick("/dashboard")}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        >
                          <svg
                            className="w-4 h-4 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0a2 2 0 01-2 2H10a2 2 0 01-2-2v0z"
                            />
                          </svg>
                          Dashboard
                        </button>

                        <button
                          onClick={() => handleNavItemClick("/pricing")}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        >
                          <svg
                            className="w-4 h-4 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 8h12M6 11h12M8 6v12c0 0 2-1 4-1h4c1.1 0 2 .9 2 2s-.9 2-2 2h-4c-2 0-4-1-4-1"
                            />
                          </svg>
                          Pricing
                        </button>

                        <div className="border-t border-gray-100 mt-2 pt-2"></div>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <svg
                          className="w-4 h-4 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleNavItemClick("/login")}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
