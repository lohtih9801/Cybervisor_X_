import { useState } from "react";
import {
  getUsers,
  saveUsers,
  getAuditLogs,
  saveAuditLogs
} from "../utils/Storage";

export default function Login({ onLogin }) {

  const [isRegister, setIsRegister] = useState(false);
  const [isForgot, setIsForgot] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("male");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [otpInput, setOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);

  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const users = getUsers();

  /* ================= PASSWORD STRENGTH ================= */

  const getPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score === 4) return { strength: "Strong", color: "#22c55e" };
    if (score >= 2) return { strength: "Medium", color: "#facc15" };
    return { strength: "Weak", color: "#ef4444" };
  };

  const strengthData = getPasswordStrength(password);

  async function hashPassword(value) {
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  }

  const logAudit = (action) => {
    const logs = getAuditLogs();
    logs.push({
      user: username.trim().toLowerCase(),
      action,
      time: new Date().toISOString()
    });
    saveAuditLogs(logs);
  };

  /* ================= OTP ================= */

  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    setGeneratedOtp(otp);
    alert("Simulation OTP: " + otp);
  };

  /* ================= REGISTER ================= */

  const handleRegister = async () => {

    const cleanUsername = username.trim().toLowerCase();

    if (!cleanUsername || !email || !password || !otpInput) {
      setError("All fields required");
      return;
    }

    if (strengthData.strength !== "Strong") {
      setError("Password must be Strong");
      return;
    }

    if (!generatedOtp || parseInt(otpInput) !== generatedOtp) {
      setError("Invalid OTP");
      return;
    }

    if (users.find(u => u.username.toLowerCase() === cleanUsername)) {
      setError("User already exists");
      return;
    }

    const hashed = await hashPassword(password);

    saveUsers([
      ...users,
      {
        username: cleanUsername,
        email,
        gender,
        password: hashed,
        status: "pending"
      }
    ]);

    logAudit("User Registered (Pending Approval)");

    alert("Registration successful. Waiting for admin approval.");
    setIsRegister(false);
    setPassword("");
    setOtpInput("");
    setGeneratedOtp(null);
  };

  /* ================= LOGIN ================= */

  const handleLogin = async () => {

    setError("");

    const cleanUsername = username.trim().toLowerCase();
    const hashed = await hashPassword(password);

    const user = users.find(
      u =>
        u.username.toLowerCase() === cleanUsername &&
        u.password === hashed
    );

    if (!user) {
      setError("Invalid credentials");
      logAudit("Failed Login");
      return;
    }

    if (user.status === "pending") {
      setError("Account under admin review.");
      return;
    }

    if (user.status === "rejected") {
      setError("Access denied. Contact admin.");
      return;
    }

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("user", JSON.stringify(user));
    storage.setItem("lastActivity", Date.now());

    logAudit("User Logged In");
    onLogin(user);
  };

  /* ================= FORGOT PASSWORD ================= */

  const handleResetPassword = async () => {

    const cleanUsername = username.trim().toLowerCase();

    const user = users.find(
      u => u.username.toLowerCase() === cleanUsername
    );

    if (!user) {
      setError("User not found");
      return;
    }

    if (!generatedOtp) {
      setError("Generate OTP first");
      return;
    }

    if (parseInt(otpInput) !== generatedOtp) {
      setError("Incorrect OTP");
      return;
    }

    if (!newPassword) {
      setError("Enter new password");
      return;
    }

    const hashed = await hashPassword(newPassword);

    const updatedUsers = users.map(u =>
      u.username.toLowerCase() === cleanUsername
        ? { ...u, password: hashed }
        : u
    );

    saveUsers(updatedUsers);

    alert("Password reset successful");
    setIsForgot(false);
    setNewPassword("");
    setOtpInput("");
    setGeneratedOtp(null);
  };

  /* ================= UI ================= */

  return (
    <div style={container}>
      <div style={leftPanel}>
        <h1 style={logo}>CYBERVISOR-X</h1>
        <h3 style={tagline}>AI Threat Intelligence Platform</h3>
        <p style={description}>
          Advanced cybersecurity analytics, vulnerability detection,
          and real-time risk intelligence for enterprise environments.
        </p>

        <div style={featureBox}>
          ✓ Real-time Threat Analysis<br/>
          ✓ Risk Score Monitoring<br/>
          ✓ Audit & Log Tracking<br/>
          ✓ Enterprise Security Dashboard
        </div>
      </div>

      <div style={rightPanel}>
        <div style={card}>
          <h2>
            {isRegister
              ? "Create Account"
              : isForgot
              ? "Reset Password"
              : "Secure Login"}
          </h2>

          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={input}
          />

          {isRegister && (
            <>
              <input
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={input}
              />

              <select
                value={gender}
                onChange={e => setGender(e.target.value)}
                style={input}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </>
          )}

          {!isForgot && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={input}
            />
          )}

          {isForgot && (
            <>
              <button onClick={generateOtp} style={otpButton}>
                Generate OTP
              </button>

              <button
                onClick={generateOtp}
                style={{ ...otpButton, background: "#3b82f6" }}
              >
                Resend OTP
              </button>

              <input
                placeholder="Enter OTP"
                value={otpInput}
                onChange={e => setOtpInput(e.target.value)}
                style={input}
              />

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                style={input}
              />
            </>
          )}

          {error && <p style={{ color: "#ef4444" }}>{error}</p>}

          {!isForgot && (
            <button
              onClick={isRegister ? handleRegister : handleLogin}
              style={button}
            >
              {isRegister ? "Register" : "Login"}
            </button>
          )}

          {isForgot && (
            <button onClick={handleResetPassword} style={button}>
              Reset Password
            </button>
          )}

          {!isRegister && !isForgot && (
            <p onClick={() => setIsForgot(true)} style={switchLink}>
              Forgot Password?
            </p>
          )}

          {isForgot && (
            <p onClick={() => setIsForgot(false)} style={switchLink}>
              Back to Login
            </p>
          )}

          {!isForgot && (
            <p
              onClick={() => setIsRegister(!isRegister)}
              style={switchLink}
            >
              {isRegister
                ? "Already have account? Login"
                : "Create new account"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
/* ================= STYLES (UNCHANGED UI) ================= */

const container = {
  height: "100vh",
  display: "flex",
  background: "linear-gradient(135deg,#0f172a,#1e293b)"
};

const leftPanel = {
  flex: 1,
  color: "white",
  padding: "80px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center"
};

const logo = {
  fontSize: "42px",
  fontWeight: "bold",
  color: "#3b82f6"
};

const tagline = {
  marginTop: "10px",
  fontWeight: "500",
  opacity: 0.8
};

const description = {
  marginTop: "20px",
  lineHeight: "1.6",
  maxWidth: "400px"
};

const featureBox = {
  marginTop: "30px",
  background: "rgba(255,255,255,0.05)",
  padding: "20px",
  borderRadius: "12px",
  lineHeight: "1.8"
};

const rightPanel = {
  flex: 1,
  background: "#f8fafc",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const card = {
  background: "white",
  padding: "40px",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  width: "350px"
};

const input = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb"
};

const button = {
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "#2563eb",
  color: "white",
  fontWeight: "600",
  cursor: "pointer"
};

const otpButton = {
  padding: "8px",
  borderRadius: "6px",
  border: "none",
  background: "#22c55e",
  color: "white",
  cursor: "pointer"
};

const switchLink = {
  cursor: "pointer",
  color: "#2563eb",
  fontSize: "14px",
  textAlign: "center"
};

const rememberStyle = {
  fontSize: "13px"
};