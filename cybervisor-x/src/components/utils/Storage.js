const USERS_KEY = "users";
const ATTEMPTS_KEY = "loginAttempts";
const LOGS_KEY = "auditLogs";
const REPORTS_KEY = "reports";

/* ================= DEFAULT ADMIN ================= */

const DEFAULT_ADMIN = {
  username: "admin",
  email: "admin@cybervisorx.com",
  gender: "male",
  role: "admin",
  status: "approved",
  verified: true,
  password: "bc78e58d55cde1346e68f8e5fe588dedf62fa457aa646a500a53347faff6ee24" // SHA-256 for Admin@1234
};

/* ================= INITIALIZE STORAGE ================= */

export const initializeStorage = () => {

  // USERS
  let users = JSON.parse(localStorage.getItem(USERS_KEY));
  if (!users || !Array.isArray(users)) {
    users = [];
  }

  // Ensure admin exists with credentials
  const adminIndex = users.findIndex(u => u.role === "admin");
  if (adminIndex === -1) {
    users.push(DEFAULT_ADMIN);
  } else if (!users[adminIndex].password) {
    users[adminIndex] = { ...DEFAULT_ADMIN, ...users[adminIndex], password: DEFAULT_ADMIN.password, status: "approved" };
  }

  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // LOGIN ATTEMPTS
  let attempts = JSON.parse(localStorage.getItem(ATTEMPTS_KEY));
  if (!attempts || typeof attempts !== "object") {
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify({}));
  }

  // AUDIT LOGS
  let logs = JSON.parse(localStorage.getItem(LOGS_KEY));
  if (!logs || !Array.isArray(logs)) {
    localStorage.setItem(LOGS_KEY, JSON.stringify([]));
  }

  // REPORTS
  let reports = JSON.parse(localStorage.getItem(REPORTS_KEY));
  if (!reports || !Array.isArray(reports)) {
    localStorage.setItem(REPORTS_KEY, JSON.stringify([]));
  }
};

/* ================= USERS ================= */

export const getUsers = () => {
  try {
    let users = JSON.parse(localStorage.getItem(USERS_KEY));
    if (!users || !Array.isArray(users) || users.length === 0) {
      users = [DEFAULT_ADMIN];
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return users;
    }
    const adminIndex = users.findIndex(u => u.role === "admin");
    if (adminIndex === -1) {
      users.push(DEFAULT_ADMIN);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } else if (!users[adminIndex].password) {
      users[adminIndex] = { ...DEFAULT_ADMIN, ...users[adminIndex], password: DEFAULT_ADMIN.password, status: "approved" };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    return users;
  } catch {
    return [DEFAULT_ADMIN];
  }
};

export const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

/* ================= LOGIN ATTEMPTS ================= */

export const getLoginAttempts = () => {
  try {
    return JSON.parse(localStorage.getItem(ATTEMPTS_KEY)) || {};
  } catch {
    return {};
  }
};

export const saveLoginAttempts = (data) => {
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(data));
};

/* ================= AUDIT LOGS ================= */

export const getAuditLogs = () => {
  try {
    return JSON.parse(localStorage.getItem(LOGS_KEY)) || [];
  } catch {
    return [];
  }
};

export const saveAuditLogs = (logs) => {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
};

/* ================= REPORTS ================= */

export const getReports = () => {
  try {
    return JSON.parse(localStorage.getItem(REPORTS_KEY)) || [];
  } catch {
    return [];
  }
};

export const saveReports = (reports) => {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
};