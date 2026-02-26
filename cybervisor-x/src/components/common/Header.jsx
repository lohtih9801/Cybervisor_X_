export default function Header() {
  return (
    <>
      <style>{`
  .header {
    background: white;
    border-bottom: 1px solid #e5e7eb;
    padding: 20px 32px;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .logo {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: linear-gradient(135deg, #2563eb, #3b82f6);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
  }

  .title {
    font-size: 20px;
    font-weight: 600;
    color: #111827;
  }

  .tagline {
    font-size: 13px;
    color: #6b7280;
  }
`}</style>


      <header className="header">
        <div className="header-content">
          <div className="logo">⚡</div>
          <div>
            <div className="title">CYBERVISOR-X</div>
            <div className="tagline">AI-Powered Threat Intelligence</div>
          </div>
        </div>
      </header>
    </>
  );
}
