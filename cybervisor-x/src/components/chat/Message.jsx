export default function Message({
  user,
  text,
  structured,
  renderStructured
}) {

  return (
    <div className={`message ${user ? "user" : "agent"}`}>

      {/* If structured data exists and renderStructured is valid */}
      {structured && typeof renderStructured === "function" ? (
        renderStructured(structured)
      ) : (
        text
      )}

    </div>
  );
}