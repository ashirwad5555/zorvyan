import { useMemo } from "react";
import { formatCurrency } from "../utils/finance";

export function BusinessSection({
  transactions,
  summary,
  categoryExpenseData,
}) {
  const businessSnapshot = useMemo(() => {
    const income = summary.income;
    const expense = summary.expense;
    const net = income - expense;
    const savingsRate = income > 0 ? Math.round((net / income) * 100) : 0;

    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const currentMonthExpenses = transactions
      .filter(
        (item) =>
          item?.type === "expense" &&
          String(item?.date || "").slice(0, 7) === currentMonthKey,
      )
      .reduce((total, item) => total + Number(item?.amount || 0), 0);

    const topCategory = categoryExpenseData[0] || { name: "-", value: 0 };
    const categoryShare =
      expense > 0
        ? Math.round((Number(topCategory.value || 0) / expense) * 100)
        : 0;

    const monthlyBudget = 3500;
    const budgetGap = monthlyBudget - currentMonthExpenses;

    const recommendations = [];
    if (savingsRate < 20) {
      recommendations.push(
        "Savings rate is below 20%. Consider reducing recurring discretionary expenses.",
      );
    }
    if (categoryShare > 35) {
      recommendations.push(
        `${topCategory.name} contributes ${categoryShare}% of all expenses. Review this category for optimization opportunities.`,
      );
    }
    if (budgetGap < 0) {
      recommendations.push(
        "Monthly spending is above the budget target. Trigger spend controls for the next cycle.",
      );
    }
    if (!recommendations.length) {
      recommendations.push(
        "Financial health is stable. Maintain current spending discipline and automate saving goals.",
      );
    }

    return {
      net,
      savingsRate,
      currentMonthExpenses,
      topCategory,
      categoryShare,
      monthlyBudget,
      budgetGap,
      recommendations,
    };
  }, [transactions, summary, categoryExpenseData]);

  return (
    <section className="section reveal stagger-2" aria-label="Business panel">
      <div className="panel business-panel">
        <div className="panel-head">
          <h3>Business Snapshot</h3>
          <span className="chip neutral">Decision support</span>
        </div>

        <div className="business-grid">
          <article className="insight-box">
            <h4>Net Position</h4>
            <p>
              <strong>{formatCurrency(businessSnapshot.net)}</strong>
            </p>
          </article>

          <article className="insight-box">
            <h4>Savings Rate</h4>
            <p>
              <strong>{businessSnapshot.savingsRate}%</strong>
            </p>
          </article>

          <article className="insight-box">
            <h4>Top Expense Category</h4>
            <p>
              <strong>{businessSnapshot.topCategory.name}</strong> (
              {businessSnapshot.categoryShare}% of spend)
            </p>
          </article>

          <article className="insight-box">
            <h4>Budget Status</h4>
            <p>
              Target {formatCurrency(businessSnapshot.monthlyBudget)} | Current{" "}
              {formatCurrency(businessSnapshot.currentMonthExpenses)}
            </p>
            <p>
              {businessSnapshot.budgetGap >= 0
                ? `Remaining ${formatCurrency(businessSnapshot.budgetGap)}`
                : `Over by ${formatCurrency(Math.abs(businessSnapshot.budgetGap))}`}
            </p>
          </article>

          <article className="insight-box full-width">
            <h4>Recommendations</h4>
            <ul className="recommendation-list">
              {businessSnapshot.recommendations.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
