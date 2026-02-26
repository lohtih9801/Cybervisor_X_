import { useState, useEffect } from "react";
import TechniqueCard from "../ui/TechniqueCard";
import TechniquePanel from "../ui/TechniquePanel";
import "../../styles/matrix.css";

export default function Matrix() {
  const [matrixData, setMatrixData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [groupIndex, setGroupIndex] = useState(0);
  const [direction, setDirection] = useState("right");

  const GROUP_SIZE = 3;

  useEffect(() => {
    fetch("/matrix-data.json")
      .then(res => res.json())
      .then(data => setMatrixData(data))
      .catch(err => console.error(err));
  }, []);

  // 🔎 Filter techniques
  const filteredData = matrixData.map(tactic => ({
    ...tactic,
    techniques: tactic.techniques.filter(t =>
      t.name.toLowerCase().includes(search.toLowerCase())
    )
  }));

  // 📦 Group tactics
  const groupedTactics = [];
  for (let i = 0; i < filteredData.length; i += GROUP_SIZE) {
    groupedTactics.push(filteredData.slice(i, i + GROUP_SIZE));
  }

  const currentGroup = groupedTactics[groupIndex] || [];

  const handleNext = () => {
    if (groupIndex < groupedTactics.length - 1) {
      setDirection("right");
      setGroupIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (groupIndex > 0) {
      setDirection("left");
      setGroupIndex(prev => prev - 1);
    }
  };

  return (
    <div className="matrix-container">

      {/* Header */}
      <div className="matrix-header">
        <h2>Security Attack Matrix</h2>

        <input
          placeholder="Search techniques..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🔥 Modern Pagination (Internal Styled) */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "30px",
          margin: "30px 0",
          padding: "14px 30px",
          borderRadius: "50px",
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
        }}
      >
        <button
          onClick={handlePrev}
          disabled={groupIndex === 0}
          style={{
            padding: "10px 22px",
            borderRadius: "30px",
            border: "none",
            fontWeight: "600",
            fontSize: "14px",
            cursor: groupIndex === 0 ? "not-allowed" : "pointer",
            background:
              groupIndex === 0
                ? "#d1d5db"
                : "linear-gradient(135deg, #3b82f6, #2563eb)",
            color: "white",
            transition: "all 0.3s ease"
          }}
        >
          ◀ Prev
        </button>

        <span
          style={{
            fontWeight: "600",
            fontSize: "15px",
            letterSpacing: "0.5px",
            color: "#111827"
          }}
        >
          Group {groupIndex + 1} of {groupedTactics.length}
        </span>

        <button
          onClick={handleNext}
          disabled={groupIndex === groupedTactics.length - 1}
          style={{
            padding: "10px 22px",
            borderRadius: "30px",
            border: "none",
            fontWeight: "600",
            fontSize: "14px",
            cursor:
              groupIndex === groupedTactics.length - 1
                ? "not-allowed"
                : "pointer",
            background:
              groupIndex === groupedTactics.length - 1
                ? "#d1d5db"
                : "linear-gradient(135deg, #3b82f6, #2563eb)",
            color: "white",
            transition: "all 0.3s ease"
          }}
        >
          Next ▶
        </button>
      </div>

      {/* Animated Grid */}
      <div className={`matrix-grid slide-${direction}`}>
        {currentGroup.map((tactic, index) => (
          <div key={index} className="tactic-column">
            <h3>{tactic.tactic}</h3>

            {tactic.techniques.map((tech, i) => (
              <TechniqueCard
                key={i}
                technique={tech}
                onClick={setSelected}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Side Panel */}
      <TechniquePanel
        technique={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}