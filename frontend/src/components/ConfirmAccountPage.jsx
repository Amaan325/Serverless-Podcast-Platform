import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function ConfirmAccountPage() {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-fill username if coming from register page
  React.useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const usernameParam = queryParams.get("username");
    if (usernameParam) {
        console.log("Pre-filling username from query params:", usernameParam);
      setUsername(usernameParam);
    }
  }, [location]);

  const handleConfirm = async () => {
    setError("");
    setIsLoading(true);
    try {
      await axios.post("http://localhost:4000/auth/confirm", {
        username,
        code,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.details || 
              err.response?.data?.error || 
              "Confirmation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    try {
      await axios.post("http://localhost:4000/auth/resend", { username });
      alert("Confirmation code resent successfully!");
    } catch (err) {
      setError(err.response?.data?.details || "Failed to resend code. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Account Confirmed!</h1>
          <p>Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Confirm Account</h1>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="username"
          required
        />

        <input
          type="text"
          placeholder="Verification Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className={`w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-200 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Confirming..." : "Confirm"}
        </button>
        <p className="mt-4 text-center text-sm">
          Need a new code?{" "}
          <button 
            className="text-blue-600 hover:underline"
            onClick={handleResendCode}
          >
            Resend code
          </button>
        </p>
      </div>
    </div>
  );
}