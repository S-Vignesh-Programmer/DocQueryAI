import { useState } from "react";

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [method, setMethod] = useState("card");
  const [plan, setPlan] = useState("premium");
  const [step, setStep] = useState("plans"); // "plans", "payment", "processing", "success", "cancel"
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolderName: "",
    upiId: "",
    email: "",
    phone: "",
  });

  const handleUpgrade = async () => {
    if (!method) {
      setError("Please select a payment method");
      return;
    }
    if (!plan) {
      setError("Please select a plan");
      return;
    }

    setStep("payment");
    setError("");
  };

  const validatePaymentForm = () => {
    if (method === "card") {
      if (
        !paymentData.cardNumber ||
        !paymentData.expiryDate ||
        !paymentData.cvv ||
        !paymentData.cardHolderName
      ) {
        setError("Please fill in all card details");
        return false;
      }
      if (paymentData.cardNumber.replace(/\s/g, "").length !== 16) {
        setError("Please enter a valid 16-digit card number");
        return false;
      }
    } else if (method === "upi") {
      if (!paymentData.upiId) {
        setError("Please enter your UPI ID");
        return false;
      }
    }
    if (!paymentData.email || !paymentData.phone) {
      setError("Please enter your email and phone number");
      return false;
    }
    return true;
  };

  const handlePaymentSubmit = async () => {
    if (!validatePaymentForm()) return;

    setLoading(true);
    setError("");
    setStep("processing");

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.2; // 80% success rate

      if (isSuccess) {
        setStep("success");
      } else {
        setStep("cancel");
      }
    } catch (err) {
      console.error(err);
      setError("Payment processing failed. Please try again.");
      setStep("payment");
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "cardNumber") {
      value = formatCardNumber(value);
    }
    setPaymentData((prev) => ({ ...prev, [field]: value }));
  };

  const plans = [
    {
      id: "premium",
      name: "Premium",
      price: "₹999",
      period: "per month",
      queries: "50 questions/day",
      description: "Perfect for regular users",
      features: [
        "50 AI-powered queries daily",
        "PDF document processing",
        "Fast response times",
        "Email support",
        "Basic analytics",
      ],
      popular: false,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      id: "premiumPlus",
      name: "Premium Plus",
      price: "₹1999",
      period: "per month",
      queries: "Unlimited questions",
      description: "Best for power users & businesses",
      features: [
        "Unlimited AI-powered queries",
        "Priority processing",
        "Advanced document analysis",
        "24/7 priority support",
        "Advanced analytics & insights",
        "API access",
        "Custom integrations",
      ],
      popular: true,
      gradient: "from-purple-500 to-indigo-600",
    },
  ];

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
    },
    {
      id: "upi",
      name: "UPI",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  // Success Component
  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl text-center transform transition-all duration-300">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-600 mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-700 mb-4 text-sm sm:text-base">
            You are now a {plans.find((p) => p.id === plan)?.name} user. Enjoy
            your premium experience!
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mb-6">
            Payment Method:{" "}
            <span className="font-semibold">
              {paymentMethods.find((m) => m.id === method)?.name}
            </span>
          </p>
          <button
            onClick={() => {
              setStep("plans");
              setPaymentData({
                cardNumber: "",
                expiryDate: "",
                cvv: "",
                cardHolderName: "",
                upiId: "",
                email: "",
                phone: "",
              });
            }}
            className="w-full bg-green-600 text-white py-3 sm:py-3.5 rounded-2xl font-semibold text-sm sm:text-base hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Back to Plans
          </button>
        </div>
      </div>
    );
  }

  // Cancel Component
  if (step === "cancel") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-4">
            Payment Cancelled
          </h1>
          <p className="text-gray-700 mb-6 text-sm sm:text-base">
            Your payment was cancelled. You can try again anytime.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setStep("payment")}
              className="w-full bg-blue-600 text-white py-3 sm:py-3.5 rounded-2xl font-semibold text-sm sm:text-base hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                setStep("plans");
                setPaymentData({
                  cardNumber: "",
                  expiryDate: "",
                  cvv: "",
                  cardHolderName: "",
                  upiId: "",
                  email: "",
                  phone: "",
                });
              }}
              className="w-full bg-gray-200 text-gray-700 py-3 sm:py-3.5 rounded-2xl font-semibold text-sm sm:text-base hover:bg-gray-300 transition-all duration-200"
            >
              Back to Plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Processing Component
  if (step === "processing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            Processing Payment...
          </h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Please wait while we process your payment securely.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Payment Form Component
  if (step === "payment") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-6 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setStep("plans")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors text-sm sm:text-base"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Plans
          </button>

          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
              Complete Your Payment
            </h2>

            {/* Order Summary */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">
                Order Summary
              </h3>
              <div className="space-y-2 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-semibold">
                    {plans.find((p) => p.id === plan)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-semibold">
                    {paymentMethods.find((m) => m.id === method)?.name}
                  </span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between items-center">
                  <span className="text-base sm:text-lg font-bold">Total:</span>
                  <span className="text-xl sm:text-2xl font-bold text-purple-600">
                    {plans.find((p) => p.id === plan)?.price}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-6 sm:mb-8">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={paymentData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors text-sm sm:text-base"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={paymentData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors text-sm sm:text-base"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="mb-6 sm:mb-8">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">
                Payment Details
              </h3>

              {method === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Card Holder Name
                    </label>
                    <input
                      type="text"
                      value={paymentData.cardHolderName}
                      onChange={(e) =>
                        handleInputChange("cardHolderName", e.target.value)
                      }
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors text-sm sm:text-base"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) =>
                        handleInputChange("cardNumber", e.target.value)
                      }
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors font-mono text-sm sm:text-base"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={paymentData.expiryDate}
                        onChange={(e) =>
                          handleInputChange("expiryDate", e.target.value)
                        }
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors text-sm sm:text-base"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={paymentData.cvv}
                        onChange={(e) =>
                          handleInputChange("cvv", e.target.value)
                        }
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors text-sm sm:text-base"
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}

              {method === "upi" && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    value={paymentData.upiId}
                    onChange={(e) => handleInputChange("upiId", e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors text-sm sm:text-base"
                    placeholder="yourname@paytm"
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-2 flex-shrink-0"
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
                  <p className="text-red-700 font-medium text-sm sm:text-base">
                    {error}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handlePaymentSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-sm sm:text-lg hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>Complete Secure Payment</span>
              </span>
            </button>

            <div className="mt-4 sm:mt-6 flex items-center justify-center text-xs sm:text-sm text-gray-600">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Secured by 256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Plans View
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 min-h-screen px-4 py-6 sm:p-6 md:p-8 lg:p-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Choose Your
            </span>
            <br className="sm:hidden" />
            <span className="text-gray-900"> Plan</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Unlock the full potential of AI-powered document analysis with our
            flexible pricing options
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 transition-all duration-300">
            {plans.map((planData) => (
              <div
                key={planData.id}
                className={`relative bg-white/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl border-2 shadow-lg hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1 ${
                  plan === planData.id
                    ? "border-purple-500 ring-2 sm:ring-4 ring-purple-200 scale-105"
                    : "border-gray-200 hover:border-purple-300"
                } ${planData.popular ? "lg:scale-105" : ""}`}
              >
                {/* Popular badge */}
                {planData.popular && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg animate-pulse">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-4 sm:p-6 lg:p-8">
                  {/* Plan header */}
                  <div className="text-center mb-6">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r ${planData.gradient} mb-4`}
                    >
                      <svg
                        className="w-6 h-6 sm:w-8 sm:h-8 text-white"
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

                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {planData.name}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">
                      {planData.description}
                    </p>

                    <div className="mb-2">
                      <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900">
                        {planData.price}
                      </span>
                      <span className="text-gray-600 ml-2 text-sm sm:text-base">
                        {planData.period}
                      </span>
                    </div>

                    <p
                      className={`text-xs sm:text-sm font-medium bg-gradient-to-r ${planData.gradient} bg-clip-text text-transparent`}
                    >
                      {planData.queries}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                    {planData.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700 text-xs sm:text-sm lg:text-base">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Select plan button */}
                  <button
                    onClick={() => setPlan(planData.id)}
                    className={`w-full py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base transition-all duration-200 transform hover:scale-105 ${
                      plan === planData.id
                        ? `bg-gradient-to-r ${planData.gradient} text-white shadow-lg`
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {plan === planData.id ? "Selected ✓" : "Select Plan"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Method & Checkout Section */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 text-center flex items-center justify-center">
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
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Choose Payment Method
              </h2>

              {/* Payment Methods */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {paymentMethods.map((paymentMethod) => (
                  <label
                    key={paymentMethod.id}
                    className={`flex items-center p-3 sm:p-4 border-2 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                      method === paymentMethod.id
                        ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200"
                        : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      value={paymentMethod.id}
                      checked={method === paymentMethod.id}
                      onChange={(e) => setMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg mr-3 ${
                        method === paymentMethod.id
                          ? "bg-purple-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {paymentMethod.icon}
                    </div>
                    <span
                      className={`font-medium text-sm sm:text-base ${
                        method === paymentMethod.id
                          ? "text-purple-900"
                          : "text-gray-700"
                      }`}
                    >
                      {paymentMethod.name}
                    </span>
                  </label>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6">
                <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
                  <span className="text-gray-600">Selected Plan:</span>
                  <span className="font-semibold text-gray-900">
                    {plans.find((p) => p.id === plan)?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-semibold text-gray-900">
                    {paymentMethods.find((m) => m.id === method)?.name}
                  </span>
                </div>
                <hr className="my-3 border-gray-300" />
                <div className="flex justify-between items-center">
                  <span className="text-base sm:text-lg font-semibold text-gray-900">
                    Total:
                  </span>
                  <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    {plans.find((p) => p.id === plan)?.price}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-lg hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2"
                    />
                  </svg>
                  <span>Continue to Payment Details</span>
                </span>
              </button>

              {error && (
                <div className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-2 flex-shrink-0"
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
                    <p className="text-red-700 font-medium text-sm sm:text-base">
                      {error}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Features Section */}
            <div className="mt-6 sm:mt-8 lg:mt-12">
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-200 shadow-lg">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 text-center">
                  Why Choose Our Plans?
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="text-center group">
                    <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl mb-3 sm:mb-4 group-hover:bg-blue-200 transition-colors">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
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
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                      Lightning Fast
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Get instant responses to your document queries
                    </p>
                  </div>

                  <div className="text-center group">
                    <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl mb-3 sm:mb-4 group-hover:bg-purple-200 transition-colors">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                      Secure & Private
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Your documents are processed with bank-level security
                    </p>
                  </div>

                  <div className="text-center group sm:col-span-2 lg:col-span-1">
                    <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-xl mb-3 sm:mb-4 group-hover:bg-indigo-200 transition-colors">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.944a11.955 11.955 0 00-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                      24/7 Support
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Premium support whenever you need help
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
