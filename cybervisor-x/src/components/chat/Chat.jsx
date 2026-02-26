import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Message from "./Message";
import "../../styles/chat.css";

export default function Chat() {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const currentUser =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= PRIORITY CLASS ================= */

  const getPriorityClass = (priority) => {
    if (!priority) return "badge-medium";

    switch (priority.toLowerCase()) {
      case "critical": return "badge-critical";
      case "high": return "badge-high";
      case "medium": return "badge-medium";
      case "low": return "badge-low";
      default: return "badge-medium";
    }
  };

  /* ================= STRUCTURED RENDER ================= */

  const renderStructured = (data) => {

    if (!data || typeof data !== "object") {
      return <p>{String(data)}</p>;
    }

    return (
      <div className="report-card">

        {data.executive_summary && (
          <div className="report-summary">
            <span className={`severity-badge ${getPriorityClass(data.overall_priority)}`}>
              {(data.overall_priority || "Medium").toUpperCase()}
            </span>
            <p>{data.executive_summary}</p>
          </div>
        )}

        <table className="report-table">
          <tbody>
            {Object.entries(data).map(([key, value]) => {

              if (
                key === "executive_summary" ||
                key === "recommendations" ||
                key === "action_items"
              ) return null;

              return (
                <tr key={key}>
                  <td className="report-key">
                    {key.replace(/_/g, " ").toUpperCase()}
                  </td>
                  <td>
                    {typeof value === "object"
                      ? JSON.stringify(value)
                      : String(value)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {Array.isArray(data.recommendations) && (
          <div>
            <h4 className="section-title">Recommendations</h4>
            <table className="report-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Vulnerability</th>
                  <th>Priority</th>
                  <th>Timeline</th>
                  <th>Strategies</th>
                </tr>
              </thead>
              <tbody>
                {data.recommendations.map((rec, i) => (
                  <tr key={i}>
                    <td>{rec.id}</td>
                    <td>{rec.vulnerability}</td>
                    <td>
                      <span className={`priority-badge ${getPriorityClass(rec.priority)}`}>
                        {rec.priority}
                      </span>
                    </td>
                    <td>{rec.timeline}</td>
                    <td>
                      <ul className="strategy-list">
                        {rec.strategies?.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {Array.isArray(data.action_items) && (
          <div>
            <h4 className="section-title">Action Items</h4>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Timeline</th>
                  <th>Owner</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.action_items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.description}</td>
                    <td>
                      <span className={`priority-badge ${getPriorityClass(item.priority)}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td>{item.timeline}</td>
                    <td>{item.owner}</td>
                    <td>
                      <span className="status-badge">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    );
  };

  /* ================= SAVE REPORT ================= */

  const saveReport = (inputText, result) => {

    const existingReports =
      JSON.parse(localStorage.getItem("reports")) || [];

    const newReport = {
      id: Date.now(),
      user: currentUser?.username || "unknown",
      input: inputText,
      timestamp: new Date().toISOString(),
      result: result
    };

    const updatedReports = [...existingReports, newReport];

    localStorage.setItem("reports", JSON.stringify(updatedReports));

    /* 🔥 Trigger dashboard refresh */
    window.dispatchEvent(new Event("reportsUpdated"));
  };

  /* ================= SEND MESSAGE ================= */

  const sendMessage = async (e) => {
    e.preventDefault();

    const text = e.target.msg.value.trim();
    if (!text) return;

    setMessages(prev => [...prev, { user: true, text }]);
    e.target.reset();
    setLoading(true);

    try {

      const response = await axios.post(
        "http://localhost:8000/analyze",
        {
          source: "user_input",
          data_type: "threat_analysis",
          timestamp: new Date().toISOString(),
          data: [text]
        }
      );

      const result =
        response.data.risk_assessment ||
        response.data.report ||
        response.data;

      /* SAVE TO STORAGE */
      saveReport(text, result);

      setMessages(prev => [
        ...prev,
        { user: false, structured: result }
      ]);

    } catch (error) {

      setMessages(prev => [
        ...prev,
        { user: false, text: "❌ Server error. Check backend." }
      ]);
    }

    setLoading(false);
  };

  return (
    <section className="chat-box">

      <div className="chat-messages">
        {messages.map((m, i) => (
          <Message
            key={i}
            {...m}
            renderStructured={renderStructured}
          />
        ))}

        {loading && (
          <div className="message agent">
            Analyzing threat...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={sendMessage}>
        <input name="msg" placeholder="Describe a threat..." />
        <button type="submit">Analyze</button>
      </form>

    </section>
  );
}