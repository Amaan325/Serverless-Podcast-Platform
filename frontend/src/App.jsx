import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ConfirmAccountPage from "./components/ConfirmAccountPage"; // 👈 new!
import UploadPage from "./components/UploadPage";
import ProfilePage from "./components/ProfilePage";
import DiscoverPage from "./components/DiscoverPage";

export default function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem("token")); // auto-persist

  return (
    <BrowserRouter>
      <Routes>
        {!auth && (
          <>
            <Route path="/login" element={<LoginPage setAuth={setAuth} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/confirm" element={<ConfirmAccountPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}

        {auth && (
          <>
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="*" element={<Navigate to="/discover" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
