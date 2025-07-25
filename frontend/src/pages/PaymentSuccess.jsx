export default function PaymentSuccess() {
  const method = localStorage.getItem("paymentMethod");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold text-green-600">
        Payment Successful!
      </h1>
      <p className="mt-4">You are now a Premium user. Enjoy!</p>
      {method && (
        <p className="mt-2 text-sm text-gray-600">
          Payment Method: <strong>{method.toUpperCase()}</strong>
        </p>
      )}
    </div>
  );
}
