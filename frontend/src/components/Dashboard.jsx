import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [dailyUsage, setDailyUsage] = useState({
    queriesUsed: 0,
    queriesLimit: 0,
    resetTime: null,
  });

  const getPlanLimits = (plan) => {
    switch (plan) {
      case "free":
        return { limit: 10, name: "Free", color: "gray" };
      case "premium":
        return { limit: 50, name: "Premium", color: "blue" };
      case "premiumPlus":
        return { limit: Infinity, name: "Premium Plus", color: "purple" };
      default:
        return { limit: 10, name: "Free", color: "gray" };
    }
  };

  const calculateResetTime = (lastResetDate) => {
    const reset = new Date(lastResetDate);
    reset.setDate(reset.getDate() + 1);
    reset.setHours(0, 0, 0, 0);
    return reset;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          return;
        }

        // Fetch user data - using your existing user endpoint
        const userRes = await api.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = userRes.data;
        setUser(userData);

        // Calculate daily usage based on user schema
        const today = new Date();
        const lastReset = new Date(userData.lastResetDate);
        const isNewDay = today.toDateString() !== lastReset.toDateString();

        const planInfo = getPlanLimits(userData.plan);
        const resetTime = calculateResetTime(userData.lastResetDate);

        setDailyUsage({
          queriesUsed: isNewDay ? 0 : userData.dailyCount,
          queriesLimit: planInfo.limit,
          resetTime: resetTime,
        });

        setError("");
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch user information"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const planInfo = user
    ? getPlanLimits(user.plan)
    : { limit: 0, name: "Unknown", color: "gray" };
  const usagePercentage =
    planInfo.limit === Infinity
      ? 0
      : (dailyUsage.queriesUsed / planInfo.limit) * 100;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base">
              Loading your dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full text-center border border-gray-200">
            <div className="text-red-500 text-4xl sm:text-5xl mb-4"></div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-red-600 text-sm sm:text-base mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 min-h-screen p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Dashboard Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your account and track your usage
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          {/* User Profile & Usage Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Section */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mr-4">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      User Profile
                    </h3>
                    <p className="text-gray-600">Your account information</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-500 block mb-1">
                      Email Address
                    </span>
                    <span className="text-base font-medium text-gray-900 break-all">
                      {user.email}
                    </span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-500 block mb-1">
                      Current Plan
                    </span>
                    <span
                      className={`text-base font-bold capitalize inline-flex items-center ${
                        planInfo.color === "purple"
                          ? "text-purple-600"
                          : planInfo.color === "blue"
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      {planInfo.name}
                      {user.plan === "premiumPlus" && (
                        <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                          ∞
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {user.plan === "free" && (
                  <Link
                    to="/pricing"
                    className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium text-sm sm:text-base transition-all duration-200 w-full sm:w-auto shadow-lg hover:shadow-xl"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    Upgrade to Premium
                  </Link>
                )}
              </div>
            </div>

            {/* Daily Usage Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Daily Queries
                </h3>

                <div className="mb-4">
                  <div className="text-3xl font-bold text-gray-900">
                    {dailyUsage.queriesUsed}
                    <span className="text-lg text-gray-500">
                      /{planInfo.limit === Infinity ? "∞" : planInfo.limit}
                    </span>
                  </div>
                </div>

                {planInfo.limit !== Infinity && (
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          usagePercentage >= 90
                            ? "bg-red-500"
                            : usagePercentage >= 70
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round(usagePercentage)}% used today
                    </p>
                  </div>
                )}

                {dailyUsage.resetTime && (
                  <p className="text-xs text-gray-500">
                    Resets at {dailyUsage.resetTime.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to="/doc-query"
                className="group p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                    <svg
                      className="w-6 h-6 text-blue-600"
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
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                      PDF Chat
                    </h4>
                    <p className="text-sm text-gray-600">
                      Ask questions about documents
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/pricing"
                className="group p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                      View Pricing
                    </h4>
                    <p className="text-sm text-gray-600">
                      Explore premium features
                    </p>
                  </div>
                </div>
              </Link>

              <div className="group p-4 border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25zm0 0V12m0 0l3.75-3.75M12 12l-3.75-3.75"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                      Usage Stats
                    </h4>
                    <p className="text-sm text-gray-600">
                      Track your daily usage
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Features (if user has premium or premiumPlus) */}
          {(user.plan === "premium" || user.plan === "premiumPlus") && (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                Premium Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="text-2xl sm:text-3xl mb-3">📊</div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    Advanced Analytics
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600">
                    Detailed insights into your document queries and usage
                    patterns
                  </p>
                </div>
                <div className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="text-2xl sm:text-3xl mb-3">🗂️</div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    Document Library
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600">
                    Save and organize your uploaded documents for quick access
                  </p>
                </div>
                <div className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="text-2xl sm:text-3xl mb-3">
                    {user.plan === "premiumPlus" ? "∞" : "⚡"}
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    {user.plan === "premiumPlus"
                      ? "Unlimited Queries"
                      : "Extended Queries"}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600">
                    {user.plan === "premiumPlus"
                      ? "Unlimited questions with premium plus access"
                      : "Up to 50 queries per day with premium access"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Account Statistics */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Account Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 border border-gray-200 rounded-xl hover:bg-blue-50 transition-colors">
                <div
                  className={`text-2xl font-bold mb-1 ${
                    planInfo.color === "purple"
                      ? "text-purple-600"
                      : planInfo.color === "blue"
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  {dailyUsage.queriesUsed}
                </div>
                <div className="text-sm text-gray-600">Queries Today</div>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-xl hover:bg-green-50 transition-colors">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {planInfo.limit === Infinity
                    ? "∞"
                    : planInfo.limit - dailyUsage.queriesUsed}
                </div>
                <div className="text-sm text-gray-600">Queries Remaining</div>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-xl hover:bg-yellow-50 transition-colors">
                <div className="text-2xl font-bold text-yellow-600 mb-1">0</div>
                <div className="text-sm text-gray-600">Documents Stored</div>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-xl hover:bg-indigo-50 transition-colors">
                <div
                  className={`text-2xl font-bold mb-1 ${
                    planInfo.color === "purple"
                      ? "text-purple-600"
                      : planInfo.color === "blue"
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  {planInfo.name}
                </div>
                <div className="text-sm text-gray-600">Current Plan</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
