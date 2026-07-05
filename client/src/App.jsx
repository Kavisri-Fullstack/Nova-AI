import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Settings from "./pages/Settings";
import { useState,useEffect } from "react";
import MainLayout from "./layouts/MainLayout";

function App() {

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Routes>

      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* Signup */}
      <Route path="/signup" element={<Signup />} />

      {/* Forgot Password */}
      <Route
        path="/forgot"
        element={<ForgotPassword />}
      />

      {/* NOVA AI Home */}
      <Route
        path="/home"
        element={
          localStorage.getItem("token")
            ? <MainLayout />
            : <Navigate to="/" replace />
        }
      />

      {/* Settings */}
      <Route
        path="/settings"
        element={
          <Settings
            theme={theme}
            setTheme={setTheme}
          />
        }
      />

      {/* Invalid URL */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;