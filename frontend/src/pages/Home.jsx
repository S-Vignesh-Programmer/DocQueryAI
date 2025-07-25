import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
          <nav className="flex justify-between items-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              DocQuery<span className="text-blue-600">AI</span>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto text-center w-full">
            <div
              className={`transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  DocQueryAI
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-3 sm:mb-4 max-w-3xl mx-auto font-medium px-2">
                Transform your documents into intelligent conversations
              </p>

              <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto px-2">
                Upload PDFs & ask AI-powered questions to unlock insights from
                your documents instantly
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 sm:mb-16">
                <Link
                  to="/login"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-w-48 inline-block text-center no-underline"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto px-2">
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 shadow-lg">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mb-3 sm:mb-4 mx-auto flex items-center justify-center shadow-md">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    Smart Upload
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Drag & drop PDFs for instant processing and analysis
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 shadow-lg">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg mb-3 sm:mb-4 mx-auto flex items-center justify-center shadow-md">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    AI-Powered
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Advanced AI understands context and provides accurate
                    answers
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 shadow-lg md:col-span-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg mb-3 sm:mb-4 mx-auto flex items-center justify-center shadow-md">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    Lightning Fast
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Get instant responses to your document queries
                  </p>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200 px-2">
                <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                  Trusted by thousands of professionals
                </p>
                <div className="flex justify-center items-center space-x-4 sm:space-x-8 opacity-60">
                  <div className="bg-blue-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded font-semibold text-xs sm:text-sm">
                    SECURE
                  </div>
                  <div className="bg-green-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded font-semibold text-xs sm:text-sm">
                    TRUSTABLE
                  </div>
                  <div className="bg-indigo-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded font-semibold text-xs sm:text-sm">
                    RELIABLE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-gray-600 text-xs sm:text-sm">
            <div className="mb-3 sm:mb-0 text-center sm:text-left">
              © 2025 DocQueryAI. All rights reserved.
            </div>
            <div className="flex space-x-4 sm:space-x-6">
              <a href="#" className="hover:text-blue-600 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Support
              </a>
            </div>
          </div>
        </footer>
      </div>

      <style jsx="true">{`
        .bg-grid-pattern {
          background-image: linear-gradient(
              rgba(148, 163, 184, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(148, 163, 184, 0.1) 1px,
              transparent 1px
            );
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}
