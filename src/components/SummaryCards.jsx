import { formatCurrency } from "../utils/finance";

export function SummaryCards({ balance, summary, transactionCount }) {
  return (
    <section
      className="summary-grid reveal stagger-1"
      aria-label="Dashboard overview"
    >
      <article className="metric-card">
        <p>Total Balance</p>
        <h2>{formatCurrency(balance)}</h2>
      </article>
      <article className="metric-card">
        <p>Total Income</p>
        <h2>{formatCurrency(summary.income)}</h2>
      </article>
      <article className="metric-card">
        <p>Total Expenses</p>
        <h2>{formatCurrency(summary.expense)}</h2>
      </article>
      <article className="metric-card">
        <p>Transactions</p>
        <h2>{transactionCount}</h2>
      </article>
    </section>
  );
}
