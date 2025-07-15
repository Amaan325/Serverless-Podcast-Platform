import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ setAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.IdToken);
      localStorage.setItem("username", username);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("userId", res.data.sub); // ✅ Store sub

      setAuth(true);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err.response?.data);

      let errorMessage = err.response?.data?.details || "Login failed";

      if (err.response?.data?.code === "UserNotConfirmedException") {
        errorMessage = "Please confirm your account first.";
        navigate(`/confirm?username=${encodeURIComponent(username)}`);
      } else if (err.response?.data?.code === "NotAuthorizedException") {
        errorMessage = "Incorrect username or password.";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

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
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="current-password"
          required
        />

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <div className="mt-4 text-center space-y-2">
          <p className="text-sm">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Register here
            </a>
          </p>
          <p className="text-sm">
            <a
              href="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
