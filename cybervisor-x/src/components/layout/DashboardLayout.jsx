import Slidebar from "../layout/Slidebar";
import TopBar from "../layout/TopBar";

export default function DashboardLayout({
  children,
  toggleTheme,
  user,
  onLogout
}) {
  return (
    <div className="app-layout">
      <Slidebar user={user} />

      <div className="main-content">
        <TopBar
          toggleTheme={toggleTheme}
          user={user}
          onLogout={onLogout}
        />

        {children}
      </div>
    </div>
  );
}