import { useMemo } from "react";
import { getMonthKey, monthLabel } from "../utils/finance";

export function useDashboardMetrics(transactions, filters) {
  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          transactions.map((item) => String(item?.category || "Uncategorized")),
        ),
      ).sort(),
    [transactions],
  );

  const sortedTransactions = useMemo(() => {
    const searched = transactions.filter((item) => {
      const searchToken = filters.search.trim().toLowerCase();
      const merchant = String(item?.merchant || "").toLowerCase();
      const category = String(item?.category || "Uncategorized").toLowerCase();
      const note = String(item?.note || "").toLowerCase();
      const matchesSearch =
        searchToken.length === 0 ||
        merchant.includes(searchToken) ||
        category.includes(searchToken) ||
        note.includes(searchToken);
      const matchesType = filters.type === "all" || item.type === filters.type;
      const matchesCategory =
        filters.category === "all" ||
        String(item?.category || "Uncategorized") === filters.category;

      return matchesSearch && matchesType && matchesCategory;
    });

    return [...searched].sort((a, b) => {
      if (filters.sort === "date-desc") {
        return b.date.localeCompare(a.date);
      }

      if (filters.sort === "date-asc") {
        return a.date.localeCompare(b.date);
      }

      if (filters.sort === "amount-asc") {
        return a.amount - b.amount;
      }

      return b.amount - a.amount;
    });
  }, [transactions, filters]);

  const summary = useMemo(() => {
    return transactions.reduce(
      (acc, item) => {
        if (item.type === "income") {
          acc.income += item.amount;
        } else {
          acc.expense += item.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 },
    );
  }, [transactions]);

  const balance = summary.income - summary.expense;

  const monthlyTrendData = useMemo(() => {
    const grouped = {};
    transactions.forEach((item) => {
      const key = getMonthKey(item.date);
      if (!grouped[key]) {
        grouped[key] = { month: monthLabel(item.date), income: 0, expense: 0 };
      }

      grouped[key][item.type] += item.amount;
    });

    return Object.keys(grouped)
      .sort()
      .map((key) => grouped[key]);
  }, [transactions]);

  const categoryExpenseData = useMemo(() => {
    const grouped = {};
    transactions.forEach((item) => {
      if (item.type === "expense") {
        grouped[item.category] = (grouped[item.category] || 0) + item.amount;
      }
    });

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const insights = useMemo(() => {
    const monthKeys = Array.from(
      new Set(transactions.map((item) => getMonthKey(item.date))),
    )
      .sort()
      .slice(-2);

    const [previousKey, currentKey] = monthKeys;
    const previousMonthExpense = transactions
      .filter(
        (item) =>
          item.type === "expense" && getMonthKey(item.date) === previousKey,
      )
      .reduce((total, item) => total + item.amount, 0);

    const currentMonthExpense = transactions
      .filter(
        (item) =>
          item.type === "expense" && getMonthKey(item.date) === currentKey,
      )
      .reduce((total, item) => total + item.amount, 0);

    const delta = currentMonthExpense - previousMonthExpense;
    const percentChange =
      previousMonthExpense === 0
        ? 0
        : Math.round((delta / previousMonthExpense) * 100);

    const allExpenses = transactions.filter((item) => item.type === "expense");
    const avgExpense =
      allExpenses.length === 0
        ? 0
        : allExpenses.reduce((total, item) => total + item.amount, 0) /
          allExpenses.length;

    const unusual = allExpenses
      .filter((item) => item.amount >= avgExpense * 1.7)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);

    return {
      previousMonth: previousKey || "-",
      currentMonth: currentKey || "-",
      previousMonthExpense,
      currentMonthExpense,
      delta,
      percentChange,
      unusual,
    };
  }, [transactions]);

  return {
    categories,
    sortedTransactions,
    summary,
    balance,
    monthlyTrendData,
    categoryExpenseData,
    insights,
  };
}
