import React, { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

export default function DocQueryAI() {
  const [pdfText, setPdfText] = useState("");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [token, setToken] = useState(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [userPlan, setUserPlan] = useState("free");

  // Read JWT from localStorage on component mount
  useEffect(() => {
    try {
      const userToken = localStorage.getItem("token");
      setToken(userToken);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      setToken(null);
    }
  }, []);

  const getPlanLimits = (plan) => {
    switch (plan) {
      case "free":
        return { limit: 10, name: "Free" };
      case "premium":
        return { limit: 50, name: "Premium" };
      case "premiumPlus":
        return { limit: Infinity, name: "Premium Plus" };
      default:
        return { limit: 10, name: "Free" };
    }
  };

  const checkDailyLimit = async () => {
    if (!token) return false;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const userData = await res.json();
        setUserPlan(userData.plan);

        const planInfo = getPlanLimits(userData.plan);
        const today = new Date();
        const lastReset = new Date(userData.lastResetDate);
        const isNewDay = today.toDateString() !== lastReset.toDateString();

        const currentUsage = isNewDay ? 0 : userData.dailyCount;

        if (planInfo.limit !== Infinity && currentUsage >= planInfo.limit) {
          return true; // Limit reached
        }
      }
    } catch (error) {
      console.error("Error checking daily limit:", error);
    }

    return false;
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = async () => {
      const typedarray = new Uint8Array(reader.result);

      try {
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        let textContent = "";

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const content = await page.getTextContent();
          const pageText = content.items.map((item) => item.str).join(" ");
          textContent += pageText + "\n";
        }

        setPdfText(textContent);
        setResponse("");
        setUsage(null);
        setChatHistory([]);
      } catch (error) {
        console.error("Error processing PDF:", error);
        setChatHistory([
          {
            type: "error",
            content: "Failed to process PDF file. Please try again.",
          },
        ]);
        setUploadedFileName("");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleAsk = async () => {
    if (!pdfText || !question.trim()) return;

    if (!token) {
      const errorMsg = "You must be logged in to ask questions.";
      setResponse(errorMsg);
      setChatHistory((prev) => [...prev, { type: "error", content: errorMsg }]);
      return;
    }

    // Check daily limit before making the request
    const limitReached = await checkDailyLimit();
    if (limitReached) {
      setShowLimitModal(true);
      return;
    }

    const currentQuestion = question;
    setLoading(true);
    setQuestion("");

    // Add user question to chat history
    setChatHistory((prev) => [
      ...prev,
      { type: "user", content: currentQuestion },
    ]);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pdfText, question: currentQuestion }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Check if it's a limit-related error
        if (data.message && data.message.includes("limit")) {
          setShowLimitModal(true);
          setChatHistory((prev) => prev.slice(0, -1)); // Remove the user question from history
          return;
        }

        const errorMsg = data.message || "Error from server.";
        setResponse(errorMsg);
        setChatHistory((prev) => [
          ...prev,
          { type: "error", content: errorMsg },
        ]);
        return;
      }

      setResponse(data.answer);
      setUsage(data.usage);

      // Add AI response to chat history
      setChatHistory((prev) => [...prev, { type: "ai", content: data.answer }]);
    } catch (err) {
      console.error(err);
      const errorMsg = `Error: ${err.message}`;
      setResponse(errorMsg);
      setChatHistory((prev) => [...prev, { type: "error", content: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    setResponse("");
    setUsage(null);
  };

  const LimitModal = () => {
    const planInfo = getPlanLimits(userPlan);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-pulse">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Daily Limit Reached
            </h3>

            <p className="text-gray-600 mb-4">
              You've reached your daily limit of {planInfo.limit} queries for
              the {planInfo.name} plan.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Current Plan:</strong> {planInfo.name}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Daily Limit:</strong> {planInfo.limit} queries
              </p>
            </div>

            {userPlan === "free" && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">
                  Upgrade to get more queries per day:
                </p>
                <div className="text-left space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Premium Plan:</span>
                    <span className="font-medium">50 queries/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Premium Plus:</span>
                    <span className="font-medium">Unlimited queries</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowLimitModal(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>

              {userPlan === "free" && (
                <button
                  onClick={() => {
                    setShowLimitModal(false);
                    window.location.href = "/pricing";
                  }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Upgrade Now
                </button>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-3">
              Your limit will reset at midnight
            </p>
          </div>
        </div>
      </div>
    );
  };

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

      {/* Daily Limit Modal */}
      {showLimitModal && <LimitModal />}

      <div className="relative z-10 min-h-screen flex flex-col p-3 sm:p-4 md:p-6 lg:p-8 pt-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              DocQuery
            </span>
            <span className="text-gray-900">AI</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your PDF and start asking intelligent questions
          </p>
        </div>

        <div className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left Column - Upload & Controls */}
          <div className="space-y-4 sm:space-y-6">
            {/* PDF Upload Section */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Upload Document
              </h2>

              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 bg-gray-50"
                >
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-sm text-gray-600 text-center">
                    {uploadedFileName
                      ? uploadedFileName
                      : "Click to upload PDF or drag and drop"}
                  </p>
                </label>
              </div>

              {pdfText && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✓ PDF processed successfully!
                  </p>
                </div>
              )}
            </div>

            {/* Question Input Section */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Ask Your Question
              </h2>

              <div className="space-y-3">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="What would you like to know about this document?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-20 sm:h-24 text-sm sm:text-base"
                  disabled={!pdfText || loading}
                />

                <div className="flex gap-2">
                  <button
                    onClick={handleAsk}
                    disabled={!pdfText || !question.trim() || loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      "Ask Question"
                    )}
                  </button>

                  {chatHistory.length > 0 && (
                    <button
                      onClick={clearChat}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Chat History */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Conversation History
                </h2>
              </div>

              <div className="h-96 sm:h-[500px] overflow-y-auto p-4 sm:p-6">
                {chatHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <svg
                      className="w-12 h-12 mb-4 opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <p className="text-center">
                      Upload a PDF and start asking questions to see the
                      conversation here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatHistory.map((item, index) => (
                      <div
                        key={index}
                        className={`p-3 sm:p-4 rounded-xl ${
                          item.type === "user"
                            ? "bg-blue-50 border-l-4 border-blue-500 ml-4"
                            : item.type === "ai"
                            ? "bg-purple-50 border-l-4 border-purple-500 mr-4"
                            : "bg-red-50 border-l-4 border-red-500"
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {item.type === "user" ? (
                            <svg
                              className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
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
                          ) : item.type === "ai" ? (
                            <svg
                              className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          )}
                          <div className="flex-1">
                            <div className="text-xs font-medium text-gray-500 mb-1">
                              {item.type === "user"
                                ? "You"
                                : item.type === "ai"
                                ? "AI Assistant"
                                : "Error"}
                            </div>
                            <div className="text-sm sm:text-base text-gray-800 whitespace-pre-wrap">
                              {item.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
