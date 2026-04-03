export function DashboardHeader({
  role,
  theme,
  activeTab,
  onRoleChange,
  onThemeChange,
  onTabChange,
}) {
  return (
    <header className="page-header reveal">
      <div>
        <p className="eyebrow">Finance Dashboard UI</p>
        <h1>Personal Finance Dashboard</h1>
        <p className="subtitle">
          Track trends, review transactions, and extract spending insights.
        </p>

        <div className="tab-switch" role="tablist" aria-label="Homepage tabs">
          <button
            role="tab"
            aria-selected={activeTab === "dashboard"}
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => onTabChange("dashboard")}
          >
            Dashboard
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "transaction"}
            className={activeTab === "transaction" ? "active" : ""}
            onClick={() => onTabChange("transaction")}
          >
            Transaction
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "insights"}
            className={activeTab === "insights" ? "active" : ""}
            onClick={() => onTabChange("insights")}
          >
            Insights
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "business"}
            className={activeTab === "business" ? "active" : ""}
            onClick={() => onTabChange("business")}
          >
            Business
          </button>
        </div>
      </div>
      <div className="header-controls">
        <div className="theme-switch" role="group" aria-label="Theme selector">
          <button
            className={theme === "light" ? "active" : ""}
            onClick={() => onThemeChange("light")}
          >
            Light
          </button>
          <button
            className={theme === "dark" ? "active" : ""}
            onClick={() => onThemeChange("dark")}
          >
            Dark
          </button>
        </div>

        <div className="role-switch" role="group" aria-label="Role selector">
          <button
            className={role === "user" ? "active" : ""}
            onClick={() => onRoleChange("user")}
          >
            Viewer
          </button>
          <button
            className={role === "admin" ? "active" : ""}
            onClick={() => onRoleChange("admin")}
          >
            Admin
          </button>
        </div>
      </div>
    </header>
  );
}
