export async function sendChatMessage({ userMessage, threadId }) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userMessage, threadId }),
  });
  return res.json();
} 