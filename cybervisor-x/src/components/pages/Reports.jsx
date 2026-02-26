import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reports() {

  const location = useLocation();

  const [reports, setReports] = useState(
    JSON.parse(localStorage.getItem("reports")) || []
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  /* ================= AUTO FILTER FROM DASHBOARD ================= */

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const priority = params.get("priority");

    if (priority) {
      setFilter(priority.toUpperCase());
    }
  }, [location.search]);

  /* ---------------- CLEAR ---------------- */

  const clearReports = () => {
    localStorage.removeItem("reports");
    setReports([]);
  };

  /* ---------------- FILTER LOGIC ---------------- */

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {

      const inputText = report.input?.toLowerCase() || "";

      const matchesSearch =
        inputText.includes(search.toLowerCase());

      const priority =
        report.result?.overall_priority?.toUpperCase() || "";

      const matchesFilter =
        filter === "ALL" || priority === filter;

      return matchesSearch && matchesFilter;

    });
  }, [reports, search, filter]);

  /* ================= ENTERPRISE EXPORT (FILTERED ONLY) ================= */

  const exportAllReports = () => {

    const doc = new jsPDF();

    /* ---------- HEADER ---------- */
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 25, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("CYBERVISOR-X SECURITY REPORTS", 14, 16);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 35);
    doc.text(`Total Records: ${filteredReports.length}`, 14, 42);

    /* ---------- TABLE ---------- */

    autoTable(doc, {
      startY: 50,
      head: [["Input", "Priority", "Risk Score", "Vulnerabilities", "Timestamp"]],
      body: filteredReports.map(report => [

        report.input || "N/A",

        report.result?.overall_priority || "N/A",

        report.result?.overall_risk_score || "N/A",

        report.result?.total_vulnerabilities || "N/A",

        report.timestamp
          ? new Date(report.timestamp).toLocaleString()
          : "N/A"

      ]),
      theme: "striped",
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: 255,
        fontStyle: "bold"
      },
      styles: {
        fontSize: 8,
        cellPadding: 3
      }
    });

    /* ---------- FOOTER ---------- */

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

    doc.save("Cybervisor_Reports_Enterprise.pdf");
  };

  /* ================= UI ================= */

  return (
    <div style={{ padding: "30px" }}>
      <h2>Previous Reports</h2>

      <div style={filterBar}>

        <input
          placeholder="Search by input..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={inputStyle}
        >
          <option value="ALL">All</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        <button onClick={exportAllReports} style={btnStyle}>
          Download Enterprise PDF
        </button>

        <button onClick={clearReports} style={dangerStyle}>
          Clear All
        </button>
      </div>

      {filteredReports.length === 0 && (
        <p>No reports found.</p>
      )}

      {filteredReports
        .slice()
        .reverse()
        .map((report) => (
          <div key={report.id} style={cardStyle}>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <p style={timestampStyle}>
                  {report.timestamp
                    ? new Date(report.timestamp).toLocaleString()
                    : ""}
                </p>

                <p>
                  <strong>Input:</strong> {report.input}
                </p>
              </div>

              {report.result?.overall_priority && (
                <span
                  style={{
                    ...priorityBadge,
                    ...getPriorityStyle(
                      report.result.overall_priority
                    )
                  }}
                >
                  {report.result.overall_priority}
                </span>
              )}
            </div>

          </div>
        ))}
    </div>
  );
}

/* ================= STYLES ================= */

const filterBar = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
  flexWrap: "wrap"
};

const inputStyle = {
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb"
};

const btnStyle = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600"
};

const dangerStyle = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer"
};

const cardStyle = {
  background: "var(--card)",
  padding: "20px",
  borderRadius: "16px",
  marginBottom: "20px",
  border: "1px solid var(--border)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
  transition: "0.3s ease"
};

const timestampStyle = {
  fontSize: "12px",
  color: "#64748b"
};

const priorityBadge = {
  display: "inline-block",
  padding: "6px 12px",
  borderRadius: "6px",
  fontSize: "12px",
  fontWeight: "600",
  color: "white",
  height: "fit-content"
};

const getPriorityStyle = (priority) => {
  switch (priority.toLowerCase()) {
    case "critical":
      return { background: "#dc2626" };
    case "high":
      return { background: "#ea580c" };
    case "medium":
      return { background: "#d97706" };
    case "low":
      return { background: "#16a34a" };
    default:
      return { background: "#2563eb" };
  }
};