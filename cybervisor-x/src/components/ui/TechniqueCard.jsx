export default function TechniqueCard({ technique, onClick }) {
  const riskColors = {
    Critical: "#dc2626",
    High: "#ea580c",
    Medium: "#d97706",
    Low: "#16a34a"
  };

  return (
    <div
      className="tech-card"
      onClick={() => onClick(technique)}
    >
      <div className="tech-header">
        <span
          className="risk-dot"
          style={{
            background: riskColors[technique.risk] || "#64748b"
          }}
        />
        <span className="tech-id">{technique.id}</span>
      </div>

      <h4 className="tech-name">{technique.name}</h4>

      <div className="activity-badge">
        {technique.activityCount || 0}
      </div>
    </div>
  );
}