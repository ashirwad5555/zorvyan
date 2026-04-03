import { useState } from "react";
import { downloadFile, formatCurrency } from "../utils/finance";

const initialFormState = {
  date: "2026-04-18",
  merchant: "",
  category: "Groceries",
  type: "expense",
  amount: "",
  note: "",
};

export function TransactionsSection({
  role,
  transactions,
  filters,
  categories,
  sortedTransactions,
  onFilterChange,
  onAddTransaction,
  onDeleteTransaction,
  onResetFilters,
}) {
  const [formData, setFormData] = useState(initialFormState);
  const categoryOptions = categories.length ? categories : ["Uncategorized"];

  function handleAddTransaction(event) {
    event.preventDefault();
    const amountAsNumber = Number(formData.amount);
    if (
      !formData.merchant ||
      !formData.date ||
      Number.isNaN(amountAsNumber) ||
      amountAsNumber <= 0
    ) {
      return;
    }

    onAddTransaction({
      ...formData,
      amount: amountAsNumber,
    });

    setFormData((current) => ({
      ...current,
      merchant: "",
      amount: "",
      note: "",
    }));
  }

  function exportAsCSV() {
    const header = [
      "id",
      "date",
      "merchant",
      "category",
      "type",
      "amount",
      "note",
    ];
    const rows = transactions.map((item) =>
      [
        item.id,
        item.date,
        item.merchant,
        item.category,
        item.type,
        item.amount,
        item.note,
      ]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(","),
    );

    downloadFile(
      "transactions.csv",
      `${header.join(",")}\n${rows.join("\n")}`,
      "text/csv",
    );
  }

  function exportAsJSON() {
    downloadFile(
      "transactions.json",
      JSON.stringify(transactions, null, 2),
      "application/json",
    );
  }

  return (
    <section
      className="section reveal stagger-3"
      aria-label="Transactions section"
    >
      <div className="panel transactions-panel">
        <div className="panel-head">
          <h3>Transactions</h3>
          <div className="action-row">
            <button onClick={exportAsCSV}>Export CSV</button>
            <button onClick={exportAsJSON}>Export JSON</button>
          </div>
        </div>

        <div className="filter-grid">
          <label>
            Search
            <input
              value={filters.search}
              onChange={(event) => onFilterChange("search", event.target.value)}
              placeholder="Merchant, category, note"
            />
          </label>

          <label>
            Type
            <select
              value={filters.type}
              onChange={(event) => onFilterChange("type", event.target.value)}
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>

          <label>
            Category
            <select
              value={filters.category}
              onChange={(event) =>
                onFilterChange("category", event.target.value)
              }
            >
              <option value="all">All</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label>
            Sort
            <select
              value={filters.sort}
              onChange={(event) => onFilterChange("sort", event.target.value)}
            >
              <option value="date-desc">Newest</option>
              <option value="date-asc">Oldest</option>
              <option value="amount-desc">Highest amount</option>
              <option value="amount-asc">Lowest amount</option>
            </select>
          </label>
        </div>

        {role === "admin" ? (
          <form className="add-form" onSubmit={handleAddTransaction}>
            <h4>Add transaction (Admin)</h4>
            <div className="add-grid">
              <input
                type="date"
                value={formData.date}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    date: event.target.value,
                  }))
                }
              />
              <input
                value={formData.merchant}
                placeholder="Merchant"
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    merchant: event.target.value,
                  }))
                }
              />
              <select
                value={formData.category}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                value={formData.type}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    type: event.target.value,
                  }))
                }
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <input
                type="number"
                min="1"
                value={formData.amount}
                placeholder="Amount"
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    amount: event.target.value,
                  }))
                }
              />
              <input
                value={formData.note}
                placeholder="Note"
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    note: event.target.value,
                  }))
                }
              />
            </div>
            <button type="submit" className="primary">
              Add Transaction
            </button>
          </form>
        ) : (
          <p className="role-note">
            Viewer role has read-only access. Switch to Admin to add or delete
            transactions.
          </p>
        )}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Merchant</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Note</th>
                {role === "admin" && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.length ? (
                sortedTransactions.map((item, index) => {
                  const safeId = item?.id ?? `${item?.date || "na"}-${index}`;
                  const safeType =
                    item?.type === "income" ? "income" : "expense";

                  return (
                    <tr key={safeId}>
                      <td>{item?.date || "-"}</td>
                      <td>{item?.merchant || "Unknown"}</td>
                      <td>{item?.category || "Uncategorized"}</td>
                      <td>
                        <span className={`pill ${safeType}`}>{safeType}</span>
                      </td>
                      <td>{formatCurrency(Number(item?.amount || 0))}</td>
                      <td>{item?.note || "-"}</td>
                      {role === "admin" && (
                        <td>
                          <button
                            className="danger"
                            onClick={() => onDeleteTransaction(item.id)}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    className="empty-state"
                    colSpan={role === "admin" ? 7 : 6}
                  >
                    <p>No transactions match current filters.</p>
                    <button onClick={onResetFilters}>Reset Filters</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
