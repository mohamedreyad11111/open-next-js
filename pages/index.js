import { useEffect, useState } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  async function fetchMessages() {
    const res = await fetch('/api/messages');
    const data = await res.json();
    setMessages(data);
  }

  async function sendMessage(e) {
    e.preventDefault();
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: input })
    });
    setInput('');
    fetchMessages();
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div>
      <h1>Chat</h1>
      <ul>
        {messages.map((m) => (
          <li key={m.id}>{m.content}</li>
        ))}
      </ul>
      <form onSubmit={sendMessage}>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
