import React, { useState, useRef, useEffect } from 'react';

const LLM_MODELS = [
  { label: 'Ollama (local)', value: 'ollama' },
  { label: 'OpenChat (API)', value: 'openchat' },
  { label: 'Llama.cpp (local)', value: 'llama.cpp' },
  // Add more free/open LLMs as needed
];

function ChatBox({ setSiteHtml }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(LLM_MODELS[0].value);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { user: input }]);
    // Call backend LLM API (placeholder)
    const res = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input, model: selectedModel })
    });
    const data = await res.json();
    setMessages(prev => [...prev, { user: input }, { bot: data.reply }]);
    setInput('');
    if (data.siteHtml) setSiteHtml(data.siteHtml);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const buttonPadding = '6px 18px';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16, minHeight: 0 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            {msg.user && <b>You:</b>} {msg.user}
            {msg.bot && <b>Bot:</b>} {msg.bot}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={10}
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc', resize: 'vertical', minHeight: 120, fontSize: 16 }}
          placeholder="Describe your business or ask a question..."
        />
        <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid #eee', padding: '8px 0 0 0', marginTop: 4 }}>
          <select
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
            style={{ marginRight: 12, padding: buttonPadding, borderRadius: 4, border: '1px solid #ccc', fontSize: 15, width: 170, minWidth: 0 }}
          >
            {LLM_MODELS.map(model => (
              <option key={model.value} value={model.value}>{model.label}</option>
            ))}
          </select>
          <button onClick={sendMessage} style={{ marginLeft: 'auto', height: 36, padding: buttonPadding, width: 90, minWidth: 0 }}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
