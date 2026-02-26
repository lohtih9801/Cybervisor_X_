require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* ================= SMTP CONFIG ================= */

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* Verify SMTP */
transporter.verify((error) => {
  if (error) {
    console.log("❌ SMTP ERROR:", error);
  } else {
    console.log("✅ SMTP SERVER READY");
  }
});

/* ================= OTP STORE ================= */

let otpStore = {};

/* ================= SEND OTP ================= */

app.post("/send-otp", async (req, res) => {
  const { email, username } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0
    };

    const htmlTemplate = `
      <div style="font-family: Arial; padding:20px;">
        <h2 style="color:#2563eb;">CYBERVISOR-X Security Verification</h2>
        <p>Hey <strong>${username || "User"}</strong>,</p>
        <p>Your One-Time Password (OTP) is:</p>
        <h1 style="color:#22c55e;">${otp}</h1>
        <p>This OTP expires in 5 minutes.</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"CYBERVISOR-X Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "CYBERVISOR-X OTP Verification",
      html: htmlTemplate
    });

    console.log("📧 OTP SENT:", email);
    res.json({ message: "OTP sent successfully" });

  } catch (error) {
    console.log("❌ OTP ERROR:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
});

/* ================= VERIFY OTP ================= */

app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore[email]) {
    return res.json({ success: false, message: "No OTP found" });
  }

  const record = otpStore[email];

  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.json({ success: false, message: "OTP expired" });
  }

  if (record.attempts >= 3) {
    delete otpStore[email];
    return res.json({ success: false, message: "Too many attempts" });
  }

  if (record.otp == otp) {
    delete otpStore[email];
    return res.json({ success: true });
  }

  record.attempts++;
  return res.json({ success: false, message: "Invalid OTP" });
});

/* ================= ADMIN APPROVAL / REJECTION ================= */

app.post("/update-user-status", async (req, res) => {
  const { email, username, status } = req.body;

  try {
    const isApproved = status === "approved";

    const htmlTemplate = `
      <div style="font-family: Arial; padding:20px;">
        <h2 style="color:#2563eb;">CYBERVISOR-X Account Status</h2>
        <p>Hey <strong>${username}</strong>,</p>
        ${
          isApproved
            ? `<p style="color:#22c55e;">
                🎉 Your account has been APPROVED by the administrator.
               </p>
               <p>You can now login and access the platform.</p>
               <a href="http://localhost:3000"
                  style="background:#2563eb;color:white;padding:10px 20px;
                         text-decoration:none;border-radius:6px;">
                  Login Now
               </a>`
            : `<p style="color:#ef4444;">
                ❌ Your account request has been REJECTED.
               </p>
               <p>Please contact the administrator for more details.</p>`
        }
        <hr/>
        <p style="font-size:12px;color:#666;">
          CYBERVISOR-X | AI Threat Intelligence Platform
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"CYBERVISOR-X Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: isApproved
        ? "Your CYBERVISOR-X Account is Approved"
        : "CYBERVISOR-X Account Rejected",
      html: htmlTemplate
    });

    console.log("📧 STATUS EMAIL SENT:", email);
    res.json({ message: "Status email sent" });

  } catch (error) {
    console.log("❌ STATUS EMAIL ERROR:", error);
    res.status(500).json({ message: "Failed to send status email" });
  }
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 CYBERVISOR-X Server running on port ${PORT}`);
});