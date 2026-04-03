import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "../utils/finance";

export function ChartsSection({
  theme,
  monthlyTrendData,
  categoryExpenseData,
}) {
  const isDark = theme === "dark";
  const gridStroke = isDark ? "#2f3844" : "#d6ddd8";
  const axisStroke = isDark ? "#aebbc9" : "#455f58";
  const tooltipBorder = isDark ? "1px solid #39465a" : "1px solid #d6ddd8";
  const tooltipBg = isDark ? "#1b2230" : "#ffffff";

  return (
    <section className="section reveal stagger-2" aria-label="Visual summaries">
      <div className="panel chart-panel">
        <div className="panel-head">
          <h3>Monthly Income vs Expense</h3>
          <span className="chip">Time-based</span>
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyTrendData}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#17b890" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#17b890" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient
                  id="expenseGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#e4572e" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#e4572e" stopOpacity={0.08} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke={gridStroke} />
              <XAxis dataKey="month" stroke={axisStroke} />
              <YAxis stroke={axisStroke} />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  borderRadius: "12px",
                  border: tooltipBorder,
                  background: tooltipBg,
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#17b890"
                fill="url(#incomeGradient)"
                strokeWidth={2.6}
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#e4572e"
                fill="url(#expenseGradient)"
                strokeWidth={2.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel chart-panel">
        <div className="panel-head">
          <h3>Expense by Category</h3>
          <span className="chip">Categorical</span>
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryExpenseData} layout="vertical">
              <CartesianGrid strokeDasharray="4 4" stroke={gridStroke} />
              <XAxis type="number" stroke={axisStroke} />
              <YAxis
                dataKey="name"
                type="category"
                width={90}
                stroke={axisStroke}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  borderRadius: "12px",
                  border: tooltipBorder,
                  background: tooltipBg,
                }}
              />
              <Bar dataKey="value" fill="#2e4a62" radius={[6, 6, 6, 6]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
