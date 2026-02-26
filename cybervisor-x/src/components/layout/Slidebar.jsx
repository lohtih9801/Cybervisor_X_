import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Slidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { name: "Home", path: "/", icon: "🏠", category: "initial" },
    { name: "Dashboard", path: "/dashboard", icon: "📊", category: "execution" },
    { name: "Threat Analysis", path: "/analysis", icon: "🛡️", category: "persistence" },
    { name: "Reports", path: "/reports", icon: "📁", category: "defense" },
    { name: "Logs", path: "/logs", icon: "📝", category: "defense" }
  ];

  if (user?.role === "admin") {
    menuItems.push({
      name: "Settings",
      path: "/settings",
      icon: "⚙️",
      category: "execution"
    });
  }

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>

      {/* HEADER */}
      <div className="sidebar-header">
        <div className="brand">
          <h2 className="logo">
            {collapsed ? "CX" : "CYBERVISOR-X"}
          </h2>
        </div>

        {/* Hamburger */}
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          ☰
        </button>
      </div>

      {/* MENU */}
      <ul className="nav-list">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={isActive(item.path) ? "active" : ""}
            data-label={item.name}
            data-category={item.category}
          >
            <Link to={item.path}>
              <span className="icon">{item.icon}</span>
              {!collapsed && (
                <span className="label">{item.name}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
