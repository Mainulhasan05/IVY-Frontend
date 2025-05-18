// export async function sendChatMessage({ userMessage, threadId }) {
//   const res = await fetch("/api/chat", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ userMessage, threadId }),
//   });
//   return res.json();
// }

export async function sendChatMessage({ userMessage, threadId }) {
  const res = await fetch(
    "http://localhost:5000/api/v1/chat-bot/ask-to-agent",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage, sessionId: threadId }),
    }
  );
  const data = await res.json();

  return data.data;
}
