import { useMemo, useState } from "react";
import { askFinanceAssistant } from "../services/grokClient";

export function ChatbotWidget({ siteContext }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi, I am your finance assistant. Ask me anything about this dashboard.",
    },
  ]);

  const canSend = input.trim().length > 0 && !sending;

  const headerHint = useMemo(() => {
    const txCount = siteContext?.transactionCount ?? 0;
    return `${txCount} transactions loaded`;
  }, [siteContext]);

  async function handleSend(event) {
    event.preventDefault();
    const question = input.trim();
    if (!question || sending) {
      return;
    }

    const userMessage = { role: "user", content: question };
    const historyForModel = [...messages, userMessage];

    setMessages(historyForModel);
    setInput("");
    setSending(true);

    const reply = await askFinanceAssistant({
      question,
      chatHistory: historyForModel,
      siteContext,
    });

    setMessages((current) => [
      ...current,
      { role: "assistant", content: reply },
    ]);
    setSending(false);
  }

  return (
    <>
      <button
        className="chat-fab"
        aria-label="Open chatbot"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="chat-fab-icon" aria-hidden="true">
          AI
        </span>
        <span className="chat-fab-copy">
          <strong>{open ? "Close" : "Ask Assistant"}</strong>
          <small>Need help?</small>
        </span>
        <span className="chat-fab-dot" aria-hidden="true"></span>
      </button>

      {open && (
        <section className="chat-panel" aria-label="Chat assistant">
          <header className="chat-head">
            <div>
              <h3>Website Assistant</h3>
              <p>{headerHint}</p>
            </div>
          </header>

          <div className="chat-messages">
            {messages.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={`chat-bubble ${item.role}`}
              >
                {item.content}
              </div>
            ))}
            {sending && (
              <div className="chat-bubble assistant">Thinking...</div>
            )}
          </div>

          <form className="chat-input-row" onSubmit={handleSend}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about dashboard features"
            />
            <button type="submit" disabled={!canSend}>
              Send
            </button>
          </form>
        </section>
      )}
    </>
  );
}
