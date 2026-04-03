import { formatCurrency, safeMonthLabel } from "../utils/finance";

export function InsightsSection({ insights }) {
  return (
    <section className="section reveal stagger-4" aria-label="Insights section">
      <div className="panel insights-panel">
        <div className="panel-head">
          <h3>Insights</h3>
          <span className="chip neutral">From transaction history</span>
        </div>

        <div className="insights-grid">
          <article className="insight-box">
            <h4>Current month spending</h4>
            <p>
              {safeMonthLabel(insights.currentMonth)} expenses:{" "}
              <strong>{formatCurrency(insights.currentMonthExpense)}</strong>
            </p>
          </article>

          <article className="insight-box">
            <h4>Monthly comparison</h4>
            <p>
              {insights.delta >= 0 ? "Increase" : "Drop"} of{" "}
              <strong>{formatCurrency(Math.abs(insights.delta))}</strong> (
              {Math.abs(insights.percentChange)}%) compared to{" "}
              {safeMonthLabel(insights.previousMonth)}.
            </p>
          </article>

          <article className="insight-box full-width">
            <h4>Unusual transaction observations</h4>
            {insights.unusual.length ? (
              <ul className="unusual-list">
                {insights.unusual.map((item) => (
                  <li key={item.id}>
                    <span>{item.merchant}</span>
                    <span>{item.date}</span>
                    <strong>{formatCurrency(item.amount)}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No unusual expenses detected in current data.</p>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}
