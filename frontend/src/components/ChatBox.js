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

  const buttonStyle = {
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    height: '40px'
  };

  const selectStyle = {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    background: '#ffffff',
    color: '#475569',
    cursor: 'pointer',
    width: '180px',
    height: '40px'
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Chat Messages Area */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        marginBottom: '16px', 
        minHeight: 0,
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '16px'
      }}>
        {messages.length === 0 ? (
          <div style={{ 
            color: '#94a3b8', 
            fontSize: '14px',
            textAlign: 'center',
            marginTop: '40px'
          }}>
            Your conversation will appear here...
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: '16px' }}>
              {msg.user && (
                <div style={{ 
                  background: '#f1f5f9',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  marginBottom: '8px',
                  marginLeft: '20px'
                }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>You</div>
                  <div style={{ color: '#334155' }}>{msg.user}</div>
                </div>
              )}
              {msg.bot && (
                <div style={{ 
                  background: '#2563eb',
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  marginRight: '20px'
                }}>
                  <div style={{ fontSize: '12px', color: '#bfdbfe', marginBottom: '4px' }}>AI Assistant</div>
                  <div>{msg.bot}</div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={4}
          style={{ 
            padding: '16px', 
            borderRadius: '12px', 
            border: '1px solid #e2e8f0', 
            resize: 'vertical', 
            minHeight: '100px', 
            fontSize: '14px',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'border-color 0.2s ease'
          }}
          placeholder="Describe your contracting business..."
          onFocus={(e) => e.target.style.borderColor = '#2563eb'}
          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
        />
        
        {/* Bottom Controls */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginTop: '12px'
        }}>
          <select
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
            style={selectStyle}
          >
            {LLM_MODELS.map(model => (
              <option key={model.value} value={model.value}>{model.label}</option>
            ))}
          </select>
          
          <button 
            onClick={sendMessage} 
            style={buttonStyle}
            onMouseOver={(e) => e.target.style.background = '#1d4ed8'}
            onMouseOut={(e) => e.target.style.background = '#2563eb'}
            disabled={!input.trim()}
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
