import { useState, useEffect } from "react";

export default function Settings() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUser =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));

    setCurrentUser(storedUser);

    const storedUsers =
      JSON.parse(localStorage.getItem("users")) || [];

    setUsers(storedUsers);
  }, []);

  if (!currentUser) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Settings</h2>
        <p>Session expired. Please login again.</p>
      </div>
    );
  }

  if (currentUser.role !== "admin") {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Settings</h2>
        <h3 style={{ color: "#ef4444" }}>Access Denied</h3>
        <p>Admin privileges required.</p>
      </div>
    );
  }

  const updateUserStatus = async (username, status) => {
    const userToUpdate = users.find(u => u.username === username);

    const updatedUsers = users.map((u) => {
      if (u.username === username) {
        return {
          ...u,
          status,
          role: status === "approved" ? "analyst" : u.role
        };
      }
      return u;
    });

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    window.dispatchEvent(new Event("usersUpdated"));

    // 🔥 Send approval or rejection email
    if (userToUpdate?.email) {
      try {
        await fetch("http://localhost:5000/update-user-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: userToUpdate.email,
            username: userToUpdate.username,
            status
          })
        });
      } catch (err) {
        console.log("Status email failed:", err);
      }
    }
  };

  const deleteUser = (username) => {
    if (username === currentUser.username) {
      alert("You cannot delete yourself.");
      return;
    }

    const updatedUsers = users.filter(
      (u) => u.username !== username
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>User Management</h2>

      {users.length === 0 && <p>No users found.</p>}

      {users.map((u, i) => (
        <div key={i} style={card}>
          <div>
            <strong>{u.username}</strong>

            <div style={{ marginTop: "4px", fontSize: "12px" }}>
              {u.email && <div>Email: {u.email}</div>}
            </div>

            <span style={statusBadge(u.status)}>
              {(u.status || "approved").toUpperCase()}
            </span>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            {u.status === "pending" && (
              <>
                <button
                  onClick={() =>
                    updateUserStatus(u.username, "approved")
                  }
                  style={approveBtn}
                >
                  Accept
                </button>

                <button
                  onClick={() =>
                    updateUserStatus(u.username, "rejected")
                  }
                  style={rejectBtn}
                >
                  Reject
                </button>
              </>
            )}

            {u.username !== currentUser.username && (
              <button
                onClick={() => deleteUser(u.username)}
                style={deleteBtn}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================= STYLES ================= */

const card = {
  background: "var(--card)",
  padding: "18px",
  marginBottom: "15px",
  borderRadius: "14px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: "1px solid var(--border)",
  boxShadow: "0 6px 16px rgba(0,0,0,0.05)"
};

const approveBtn = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "8px",
  cursor: "pointer"
};

const rejectBtn = {
  background: "#f59e0b",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "8px",
  cursor: "pointer"
};

const deleteBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "8px",
  cursor: "pointer"
};

const statusBadge = (status) => ({
  marginTop: "8px",
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: "6px",
  fontSize: "11px",
  fontWeight: "600",
  background:
    status === "pending"
      ? "rgba(245,158,11,0.15)"
      : status === "rejected"
      ? "rgba(239,68,68,0.15)"
      : "rgba(34,197,94,0.15)",
  color:
    status === "pending"
      ? "#f59e0b"
      : status === "rejected"
      ? "#ef4444"
      : "#22c55e"
});