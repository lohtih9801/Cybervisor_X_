import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function Logs() {

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  const logs =
    JSON.parse(localStorage.getItem("auditLogs")) || [];

  if (!user) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Audit Trail Logs</h2>
        <p>User session expired. Please login again.</p>
      </div>
    );
  }

  const visibleLogs =
    user.role === "admin"
      ? logs
      : logs.filter((log) => log.user === user.username);

  /* ================= ENTERPRISE EXPORT ================= */

  const exportLogs = () => {

    const doc = new jsPDF();

    /* ---------- HEADER ---------- */
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 25, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("CYBERVISOR-X AUDIT LOG REPORT", 14, 16);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 35);
    doc.text(`Exported By: ${user.username}`, 14, 42);

    /* ---------- TABLE ---------- */
    autoTable(doc, {
      startY: 50,
      head: [["User", "Action", "Timestamp"]],
      body: visibleLogs.map(log => [
        log.user,
        log.action,
        new Date(log.time).toLocaleString()
      ]),
      theme: "striped",
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: 255,
        fontStyle: "bold"
      },
      styles: {
        fontSize: 9,
        cellPadding: 4
      }
    });

    /* ---------- FOOTER + PAGE NUMBERS ---------- */
    const pageCount = doc.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.text(
        `Page ${i} of ${pageCount} | Cybervisor-X Confidential`,
        14,
        290
      );
    }

    doc.save("Cybervisor_Audit_Logs_Report.pdf");
  };

  /* ================= UI ================= */

  return (
    <div style={{ padding: "30px" }}>
      <h2>Audit Trail Logs</h2>

      <button onClick={exportLogs} style={exportButton}>
        Download Enterprise Log Report
      </button>

      {visibleLogs.length === 0 && (
        <p>No logs found.</p>
      )}

      {visibleLogs.map((log, index) => (
        <div key={index} style={logCard}>
          <strong>{log.user}</strong>
          <p>{log.action}</p>
          <small>{new Date(log.time).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}

/* ================= STYLES ================= */

const logCard = {
  background: "var(--card)",
  padding: "15px",
  marginBottom: "10px",
  borderRadius: "12px",
  border: "1px solid var(--border)",
  boxShadow: "0 6px 16px rgba(0,0,0,0.05)"
};

const exportButton = {
  marginBottom: "20px",
  padding: "10px 16px",
  background: "#2563eb",
  color: "white",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600"
};