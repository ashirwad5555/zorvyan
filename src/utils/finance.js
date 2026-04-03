export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function monthLabel(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleString("en-US", { month: "short", year: "2-digit" });
}

export function safeMonthLabel(monthKey) {
  if (!monthKey || monthKey === "-") {
    return "-";
  }

  return monthLabel(`${monthKey}-01`);
}

export function getMonthKey(isoDate) {
  return isoDate.slice(0, 7);
}

export function downloadFile(name, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}
