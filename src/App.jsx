import "./App.css";
import { useEffect, useState } from "react";
import { DashboardProvider } from "./context/DashboardContext";
import { DashboardHeader } from "./components/DashboardHeader";
import { SummaryCards } from "./components/SummaryCards";
import { ChartsSection } from "./components/ChartsSection";
import { TransactionsSection } from "./components/TransactionsSection";
import { InsightsSection } from "./components/InsightsSection";
import { BusinessSection } from "./components/BusinessSection";
import { ChatbotWidget } from "./components/ChatbotWidget";
import { useDashboard } from "./hooks/useDashboard";
import { useDashboardMetrics } from "./hooks/useDashboardMetrics";

function AppShell() {
  const { state, dispatch } = useDashboard();
  const { role, theme, transactions, filters } = state;
  const [activeTab, setActiveTab] = useState("dashboard");

  const {
    categories,
    sortedTransactions,
    summary,
    balance,
    monthlyTrendData,
    categoryExpenseData,
    insights,
  } = useDashboardMetrics(transactions, filters);

  function handleRoleChange(nextRole) {
    dispatch({ type: "SET_ROLE", payload: nextRole });
  }

  function handleThemeChange(nextTheme) {
    dispatch({ type: "SET_THEME", payload: nextTheme });
  }

  function handleFilterChange(key, value) {
    dispatch({ type: "UPDATE_FILTER", payload: { key, value } });
  }

  function handleAddTransaction(payload) {
    dispatch({ type: "ADD_TRANSACTION", payload });
  }

  function handleDeleteTransaction(id) {
    dispatch({ type: "DELETE_TRANSACTION", payload: id });
  }

  function handleResetFilters() {
    dispatch({ type: "UPDATE_FILTER", payload: { key: "search", value: "" } });
    dispatch({ type: "UPDATE_FILTER", payload: { key: "type", value: "all" } });
    dispatch({
      type: "UPDATE_FILTER",
      payload: { key: "category", value: "all" },
    });
    dispatch({
      type: "UPDATE_FILTER",
      payload: { key: "sort", value: "date-desc" },
    });
  }

  useEffect(() => {
    const validTypes = ["all", "income", "expense"];
    const validSort = ["date-desc", "date-asc", "amount-desc", "amount-asc"];

    if (!validTypes.includes(filters.type)) {
      dispatch({
        type: "UPDATE_FILTER",
        payload: { key: "type", value: "all" },
      });
    }

    if (!validSort.includes(filters.sort)) {
      dispatch({
        type: "UPDATE_FILTER",
        payload: { key: "sort", value: "date-desc" },
      });
    }

    if (filters.category !== "all" && !categories.includes(filters.category)) {
      dispatch({
        type: "UPDATE_FILTER",
        payload: { key: "category", value: "all" },
      });
    }
  }, [dispatch, filters.type, filters.sort, filters.category, categories]);

  return (
    <div className="dashboard-shell">
      <DashboardHeader
        role={role}
        theme={theme}
        activeTab={activeTab}
        onRoleChange={handleRoleChange}
        onThemeChange={handleThemeChange}
        onTabChange={setActiveTab}
      />

      {activeTab === "dashboard" && (
        <>
          <SummaryCards
            balance={balance}
            summary={summary}
            transactionCount={transactions.length}
          />

          <ChartsSection
            theme={theme}
            monthlyTrendData={monthlyTrendData}
            categoryExpenseData={categoryExpenseData}
          />
        </>
      )}

      {activeTab === "transaction" && (
        <TransactionsSection
          role={role}
          transactions={transactions}
          filters={filters}
          categories={categories}
          sortedTransactions={sortedTransactions}
          onFilterChange={handleFilterChange}
          onAddTransaction={handleAddTransaction}
          onDeleteTransaction={handleDeleteTransaction}
          onResetFilters={handleResetFilters}
        />
      )}

      {activeTab === "insights" && <InsightsSection insights={insights} />}

      {activeTab === "business" && (
        <BusinessSection
          transactions={transactions}
          summary={summary}
          categoryExpenseData={categoryExpenseData}
        />
      )}

      <ChatbotWidget
        siteContext={{
          appName: "Zorvyn Finance Dashboard",
          activeTab,
          role,
          theme,
          transactionCount: transactions.length,
          categories,
          features: [
            "Dashboard overview cards",
            "Monthly trend chart",
            "Category expense chart",
            "Transaction search, filters, sorting",
            "Admin add/delete transactions",
            "Insights and unusual transaction detection",
            "Business recommendation panel",
            "CSV and JSON export",
          ],
        }}
      />
    </div>
  );
}

function App() {
  return (
    <DashboardProvider>
      <AppShell />
    </DashboardProvider>
  );
}

export default App;
