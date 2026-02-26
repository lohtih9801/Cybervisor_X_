import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function TopBar({ toggleTheme, user, onLogout }) {
  const [risk, setRisk] = useState({
    status: "SECURE",
    color: "#22c55e"
  });

  const [health, setHealth] = useState("Checking...");
  const [showNotifications, setShowNotifications] = useState(false);

  const dropdownRef = useRef(null);

  /* ---------------- INIT ---------------- */

  useEffect(() => {
    calculateRisk();
    checkBackendHealth();

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowNotifications(false);
    }
  };

  /* ---------------- RISK ---------------- */

  const calculateRisk = () => {
    const reports =
      JSON.parse(localStorage.getItem("reports")) || [];

    let critical = 0;
    let high = 0;

    reports.forEach((r) => {
      if (!r?.result) return;

      const text =
        typeof r.result === "string"
          ? r.result
          : JSON.stringify(r.result);

      if (text.toUpperCase().includes("CRITICAL")) critical++;
      if (text.toUpperCase().includes("HIGH")) high++;
    });

    if (critical > 0) {
      setRisk({ status: "CRITICAL", color: "#dc2626" });
    } else if (high > 0) {
      setRisk({ status: "WARNING", color: "#f59e0b" });
    } else {
      setRisk({ status: "SECURE", color: "#16a34a" });
    }
  };

  /* ---------------- BACKEND HEALTH ---------------- */

  const checkBackendHealth = async () => {
    try {
      await axios.get("http://localhost:8000/health");
      setHealth("Healthy");
    } catch {
      setHealth("Offline");
    }
  };

  /* ---------------- ALERTS ---------------- */

  const reports =
    JSON.parse(localStorage.getItem("reports")) || [];

  const criticalAlerts = reports.filter((r) => {
    if (!r?.result) return false;
    const text =
      typeof r.result === "string"
        ? r.result
        : JSON.stringify(r.result);

    return text.toUpperCase().includes("CRITICAL");
  });

  /* ---------------- UI ---------------- */

  return (
    <div style={topbarStyle}>
      {/* LEFT */}
      <div>
        <small style={{ opacity: 0.6 }}>System Risk</small>

        <div
          style={{
            ...riskBadge,
            background: risk.color
          }}
        >
          {risk.status}
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div style={{ position: "relative" }} ref={dropdownRef}>
        <div
          style={{ cursor: "pointer", fontSize: "20px" }}
          onClick={() => setShowNotifications(!showNotifications)}
        >
          🔔
          {criticalAlerts.length > 0 && (
            <span style={notificationBadge}>
              {criticalAlerts.length}
            </span>
          )}
        </div>

        {showNotifications && (
          <div style={notificationBox}>
            {criticalAlerts.length === 0 ? (
              <p>No critical alerts</p>
            ) : (
              criticalAlerts.map((alert, i) => (
                <p key={i}>
                  ⚠ {alert.timestamp || "Unknown time"}
                </p>
              ))
            )}
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div style={rightSection}>
        <div>
          Backend:{" "}
          <span
            style={{
              color:
                health === "Healthy"
                  ? "#16a34a"
                  : "#dc2626",
              fontWeight: "600"
            }}
          >
            {health}
          </span>
        </div>

        <div style={{ fontSize: "13px" }}>
          {user?.username} ({user?.role})
        </div>

        <button style={buttonStyle} onClick={toggleTheme}>
          Theme
        </button>

        <button
          style={{ ...buttonStyle, background: "#dc2626" }}
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const topbarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 30px",
  background: "var(--card)",
  borderBottom: "1px solid var(--border)"
};

const rightSection = {
  display: "flex",
  gap: "18px",
  alignItems: "center"
};

const riskBadge = {
  padding: "6px 14px",
  borderRadius: "20px",
  color: "white",
  fontWeight: "600",
  marginTop: "5px"
};

const notificationBadge = {
  background: "#dc2626",
  color: "white",
  borderRadius: "50%",
  padding: "4px 8px",
  fontSize: "10px",
  position: "absolute",
  top: "-8px",
  right: "-10px"
};

const notificationBox = {
  position: "absolute",
  right: 0,
  background: "var(--card)",
  padding: "15px",
  borderRadius: "10px",
  border: "1px solid var(--border)",
  width: "250px",
  marginTop: "10px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  zIndex: 100
};

const buttonStyle = {
  padding: "6px 12px",
  borderRadius: "8px",
  border: "none",
  background: "var(--primary)",
  color: "white",
  cursor: "pointer",
  fontSize: "12px"
};