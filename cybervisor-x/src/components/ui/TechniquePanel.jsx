export default function TechniquePanel({ technique, onClose }) {
  if (!technique) return null;

  const getRiskColor = (risk) => {
    switch (risk) {
      case "Critical":
        return "#dc2626";
      case "High":
        return "#ea580c";
      case "Medium":
        return "#d97706";
      case "Low":
        return "#16a34a";
      default:
        return "#64748b";
    }
  };

  return (
    <div className="tech-overlay">
      <div className="tech-panel-enterprise">

        {/* CLOSE BUTTON */}
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        {/* HEADER */}
        <div className="tech-header-section">
          <div>
            <h2>{technique.name}</h2>
            <p className="tech-id">{technique.id}</p>
          </div>

          <span
            className="risk-badge"
            style={{ background: getRiskColor(technique.risk) }}
          >
            {technique.risk}
          </span>
        </div>

        {/* ATTACK IMAGE */}
        {technique.image && (
          <div className="attack-image-container">
            <img
              src={technique.image}
              alt={technique.name}
              className="attack-image"
            />
          </div>
        )}

        {/* ================= OVERVIEW ================= */}
        <div className="tech-section">
          <h3>Technique Overview</h3>

          <table className="enterprise-table">
            <tbody>
              <tr>
                <td><strong>Description</strong></td>
                <td>{technique.description}</td>
              </tr>
              <tr>
                <td><strong>Real-World Scenario</strong></td>
                <td>{technique.scenario}</td>
              </tr>
              <tr>
                <td><strong>Impact</strong></td>
                <td>{technique.impact || "Potential system compromise, data breach, or operational disruption."}</td>
              </tr>
              <tr>
                <td><strong>Observed Activity</strong></td>
                <td>{technique.activityCount || 0} incidents recorded</td>
              </tr>
              {technique.cvss && (
                <tr>
                  <td><strong>CVSS Score</strong></td>
                  <td>{technique.cvss}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= DETECTION ================= */}
        <div className="tech-section">
          <h3>Detection Strategy</h3>

          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Detection Type</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Monitoring</td>
                <td>{technique.detection}</td>
              </tr>
              <tr>
                <td>Recommended Tools</td>
                <td>
                  SIEM, EDR/XDR, IDS/IPS, Network Traffic Analysis,
                  Behavioral Analytics Engines
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ================= MITIGATION ================= */}
        <div className="tech-section">
          <h3>Mitigation Strategy</h3>

          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Mitigation ID</th>
                <th>Control Strategy</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>M-001</td>
                <td>Access Control</td>
                <td>{technique.mitigation}</td>
              </tr>
              <tr>
                <td>M-002</td>
                <td>Zero Trust Architecture</td>
                <td>
                  Enforce least privilege access, identity verification,
                  network segmentation, and continuous authentication.
                </td>
              </tr>
              <tr>
                <td>M-003</td>
                <td>Patch & Vulnerability Management</td>
                <td>
                  Regular vulnerability scans, automated patch deployment,
                  and continuous security assessment.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ================= MITRE REFERENCE ================= */}
        {technique.id && (
          <div className="tech-section">
            {/* <h3>MITRE ATT&CK Reference</h3>
            <a
              href={`https://attack.mitre.org/techniques/${technique.id}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="mitre-link"
            >
              View Official MITRE Documentation →
            </a> */}
          </div>
        )}

      </div>
    </div>
  );
}