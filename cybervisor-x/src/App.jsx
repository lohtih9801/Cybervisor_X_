import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./components/pages/Dashboard";
import Analysis from "./components/pages/Analysis";
import Reports from "./components/pages/Reports";
import Logs from "./components/pages/Logs";
import Settings from "./components/pages/Settings";
import Login from "./components/pages/Login";
import Matrix from "./components/pages/Matrix";
import { initializeStorage } from "./components/utils/Storage";

import "./styles/globals.css";
import "./styles/layout.css";
import "./styles/chat.css";
import "./styles/matrix.css";

function App() {

  useEffect(() => {
    initializeStorage();
  }, []);

  /* ================= THEME ================= */

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  /* ================= USER STATE ================= */

  const [user, setUser] = useState(() => {
    try {
      const localUser = localStorage.getItem("user");
      const sessionUser = sessionStorage.getItem("user");

      return localUser
        ? JSON.parse(localUser)
        : sessionUser
        ? JSON.parse(sessionUser)
        : null;
    } catch {
      return null;
    }
  });

  /* ================= SESSION TIMEOUT ================= */

  useEffect(() => {
    if (!user) return;

    const timeout = 5 * 60 * 1000; // 5 minutes

    const getActiveStorage = () =>
      localStorage.getItem("user")
        ? localStorage
        : sessionStorage;

    const updateActivity = () => {
      const storage = getActiveStorage();
      storage.setItem("lastActivity", Date.now());
    };

    const checkSession = () => {
      const storage = getActiveStorage();
      const last = storage.getItem("lastActivity");

      if (!last) return;

      if (Date.now() - last > timeout) {
        alert("Session expired");

        localStorage.removeItem("user");
        sessionStorage.removeItem("user");

        setUser(null);
      }
    };

    window.addEventListener("click", updateActivity);
    window.addEventListener("keypress", updateActivity);

    const interval = setInterval(checkSession, 60000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("keypress", updateActivity);
    };
  }, [user]);

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    setUser(null);
  };

  /* ================= LOGIN PROTECTION ================= */

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  /* ================= ROUTES ================= */

  return (
    <BrowserRouter>
      <DashboardLayout
        toggleTheme={toggleTheme}
        user={user}
        onLogout={handleLogout}
      >
        <Routes>

          {/* Home */}
          <Route path="/" element={<Matrix />} />

          {/* General */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analysis" element={<Analysis />} />

          {/* 🔥 Pass user properly */}
          <Route path="/reports" element={<Reports user={user} />} />
          <Route path="/logs" element={<Logs user={user} />} />

          {/* Admin Only */}
          <Route
            path="/settings"
            element={
              user.role === "admin"
                ? <Settings user={user} />
                : <Navigate to="/" />
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;