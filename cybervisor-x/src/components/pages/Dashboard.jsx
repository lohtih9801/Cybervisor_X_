import { useMemo, useRef, useState, useEffect } from "react";
import { Pie, Line } from "react-chartjs-2";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
);

export default function Dashboard() {
  const navigate = useNavigate();
  const pieRef = useRef(null);
  const lineRef = useRef(null);

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  /* ================= STATE ================= */

  const [allReports, setAllReports] = useState(
    JSON.parse(localStorage.getItem("reports")) || []
  );

  const [auditLogs, setAuditLogs] = useState(
    JSON.parse(localStorage.getItem("auditLogs")) || []
  );

  /* ================= REAL-TIME UPDATE ================= */

  useEffect(() => {
    const syncReports = () => {
      const updated =
        JSON.parse(localStorage.getItem("reports")) || [];
      setAllReports(updated);
    };

    window.addEventListener("reportsUpdated", syncReports);
    window.addEventListener("storage", syncReports);

    return () => {
      window.removeEventListener("reportsUpdated", syncReports);
      window.removeEventListener("storage", syncReports);
    };
  }, []);

  const reports =
    user?.role === "admin"
      ? allReports
      : allReports.filter(r => r.user === user?.username);

  /* ================= ANALYTICS ================= */

  const analytics = useMemo(() => {
    let totalVulnerabilities = 0;
    let critical = 0;
    let high = 0;
    let medium = 0;
    let low = 0;
    const riskTrend = [];

    reports.forEach((report) => {
      if (!report?.result || typeof report.result !== "object") return;

      const result = report.result;
      const priority =
        result.overall_priority?.toLowerCase() || "";

      if (priority === "critical") critical++;
      else if (priority === "high") high++;
      else if (priority === "medium") medium++;
      else if (priority === "low") low++;

      if (result.total_vulnerabilities !== undefined) {
        totalVulnerabilities += Number(result.total_vulnerabilities);
      }

      if (
        result.overall_risk_score !== undefined &&
        result.overall_risk_score !== null
      ) {
        riskTrend.push(Number(result.overall_risk_score));
      }
    });

    const failedLogins = auditLogs.filter(log =>
      log.action?.toLowerCase().includes("failed")
    ).length;

    return {
      totalAnalyses: reports.length,
      totalVulnerabilities,
      critical,
      high,
      medium,
      low,
      riskTrend,
      failedLogins,
      totalActivities: auditLogs.length
    };
  }, [reports, auditLogs]);

  /* ================= CHART DATA ================= */

  const hasData =
    analytics.critical +
    analytics.high +
    analytics.medium +
    analytics.low > 0;

  const pieData = {
    labels: ["Critical", "High", "Medium", "Low"],
    datasets: [
      {
        data: hasData
          ? [
              analytics.critical,
              analytics.high,
              analytics.medium,
              analytics.low
            ]
          : [1],
        backgroundColor: hasData
          ? ["#dc2626", "#f97316", "#facc15", "#22c55e"]
          : ["#e5e7eb"],
        borderWidth: 0
      }
    ]
  };

  const lineData = {
    labels:
      analytics.riskTrend.length > 0
        ? analytics.riskTrend.map((_, i) => `Analysis ${i + 1}`)
        : ["No Data"],
    datasets: [
      {
        label: "Risk Score Trend",
        data:
          analytics.riskTrend.length > 0
            ? analytics.riskTrend
            : [0],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" }
    },
    animation: { duration: 1000 },
    scales: {
      y: { beginAtZero: true }
    }
  };

  /* ================= PDF EXPORT ================= */

  const downloadSummary = () => {
    const doc = new jsPDF("p", "mm", "a4");

    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 25, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("CYBERVISOR-X SECURITY ANALYTICS REPORT", 14, 16);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 35);
    doc.text(`User: ${user?.username}`, 14, 42);

    autoTable(doc, {
      startY: 50,
      head: [["Metric", "Value"]],
      body: [
        ["Total Analyses", analytics.totalAnalyses],
        ["Total Vulnerabilities", analytics.totalVulnerabilities],
        ["Critical Issues", analytics.critical],
        ["High Issues", analytics.high],
        ["Medium Issues", analytics.medium],
        ["Low Issues", analytics.low],
        ["Failed Logins", analytics.failedLogins],
        ["Total Activities", analytics.totalActivities]
      ],
      theme: "grid",
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: 255
      }
    });

    let finalY = doc.lastAutoTable.finalY + 15;

    if (pieRef.current) {
      const pieImage =
        pieRef.current.canvas.toDataURL("image/png", 1.0);

      doc.text("Vulnerability Distribution", 14, finalY);
      doc.addImage(pieImage, "PNG", 30, finalY + 5, 150, 100);
    }

    doc.addPage();

    if (lineRef.current) {
      const lineImage =
        lineRef.current.canvas.toDataURL("image/png", 1.0);

      doc.text("Risk Score Trend", 14, 20);
      doc.addImage(lineImage, "PNG", 20, 30, 170, 100);
    }

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

    doc.save("Cybervisor_Dashboard_Report.pdf");
  };

  /* ================= UI ================= */

  return (
    <div style={{ padding: "30px" }}>
      <h2>Dashboard Overview</h2>

      <button onClick={downloadSummary} style={summaryButton}>
        Download Enterprise Report
      </button>

      <div style={cardGrid}>
        <Card
          title="Total Analyses"
          value={analytics.totalAnalyses}
          onClick={() => navigate("/reports")}
        />

        <Card
          title="Total Vulnerabilities"
          value={analytics.totalVulnerabilities}
          onClick={() => navigate("/analysis")}
        />

        <Card
          title="Critical Issues"
          value={analytics.critical}
          critical
          onClick={() =>
            navigate("/reports?priority=CRITICAL")
          }
        />

        <Card
          title="Failed Logins"
          value={analytics.failedLogins}
          onClick={() => navigate("/logs")}
        />
      </div>

      <div style={chartGrid}>
        <div style={chartCard}>
          <h3>Vulnerability Distribution</h3>
          <div style={{ height: "350px" }}>
            <Pie ref={pieRef} data={pieData} options={chartOptions} />
          </div>
        </div>

        <div style={chartCard}>
          <h3>Risk Score Trend</h3>
          <div style={{ height: "350px" }}>
            <Line ref={lineRef} data={lineData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= CARD ================= */

function Card({ title, value, critical, onClick }) {
  return (
    <div
      style={{
        ...statCard,
        cursor: "pointer",
        transition: "0.3s ease"
      }}
      onClick={onClick}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-6px)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = "translateY(0px)")
      }
    >
      <p style={{ fontSize: "13px", color: "#64748b" }}>
        {title}
      </p>
      <h2 style={{ color: critical ? "#dc2626" : "#111827" }}>
        {value}
      </h2>
    </div>
  );
}

/* ================= STYLES ================= */

const summaryButton = {
  marginBottom: "25px",
  padding: "10px 16px",
  background: "#2563eb",
  color: "white",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600"
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginBottom: "40px"
};

const chartGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
  gap: "40px"
};

const statCard = {
  background: "white",
  padding: "25px",
  borderRadius: "16px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 8px 24px rgba(0,0,0,0.05)"
};

const chartCard = {
  background: "white",
  padding: "25px",
  borderRadius: "16px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 8px 24px rgba(0,0,0,0.05)"
};