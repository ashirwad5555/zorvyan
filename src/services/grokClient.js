function buildSystemPrompt(siteContext) {
  return [
    "You are Zorvyn Finance Assistant, an in-app guide for a finance dashboard website.",
    "Help new visitors understand the app quickly and clearly.",
    "Only use the provided website context and conversation.",
    "If asked about unavailable capabilities, be transparent and suggest what is available.",
    "Keep responses concise and practical.",
    "Website context:",
    JSON.stringify(siteContext, null, 2),
  ].join("\n");
}

function createFallbackReply(question, siteContext) {
  const q = question.toLowerCase();

  if (q.includes("tab") || q.includes("section") || q.includes("where")) {
    return "Use the header tabs: Dashboard, Transaction, Insights, and Business. Dashboard shows summary/charts, Transaction has filters and CRUD (admin), Insights shows spending patterns, and Business shows recommendations.";
  }

  if (
    q.includes("transaction") ||
    q.includes("filter") ||
    q.includes("search")
  ) {
    return "Open Transaction tab. You can search, filter by type/category, sort by date/amount, and export CSV/JSON. If results are empty, use Reset Filters.";
  }

  if (q.includes("insight") || q.includes("trend")) {
    return "Open Insights tab for month-over-month spending, current month total, and unusual transaction highlights.";
  }

  if (q.includes("business") || q.includes("recommend")) {
    return "Open Business tab for net position, savings rate, top expense category share, budget status, and action recommendations.";
  }

  if (q.includes("theme") || q.includes("dark") || q.includes("light")) {
    return "Use the Light/Dark toggle in the header to switch theme.";
  }

  const count = siteContext?.transactionCount ?? 0;
  return `I can help you navigate this dashboard. Current dataset has ${count} transactions. Ask me about tabs, filters, exports, insights, or business recommendations.`;
}

export async function askFinanceAssistant({
  question,
  chatHistory,
  siteContext,
}) {
  const apiKey = import.meta.env.VITE_GROK_API_KEY;
  const endpoint =
    import.meta.env.VITE_GROK_API_URL || "https://api.x.ai/v1/chat/completions";
  const model = import.meta.env.VITE_GROK_MODEL || "grok-2-latest";

  if (!apiKey) {
    return createFallbackReply(question, siteContext);
  }

  const messages = [
    {
      role: "system",
      content: buildSystemPrompt(siteContext),
    },
    ...chatHistory.slice(-8).map((item) => ({
      role: item.role,
      content: item.content,
    })),
    { role: "user", content: question },
  ];

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      return createFallbackReply(question, siteContext);
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    return reply || createFallbackReply(question, siteContext);
  } catch {
    return createFallbackReply(question, siteContext);
  }
}
