// frontend/src/App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [deckInput, setDeckInput] = useState('');
  const [showDeckInput, setShowDeckInput] = useState(false);
  const [battleLog, setBattleLog] = useState([]);
  const [showBattleLog, setShowBattleLog] = useState(false);

  const askAI = async () => {
    const res = await fetch('http://localhost:5000/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setResponse(data.response);
    setBattleLog((prev) => [...prev, `🧠 Q: ${prompt}\n📜 A: ${data.response}`]);
  };

  const clearMemory = async () => {
    await fetch('http://localhost:5000/api/memory/reset', { method: 'POST' });
    alert('Memory cleared!');
  };

  const injectDeck = async () => {
    const res = await fetch('http://localhost:5000/api/decklist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deck: deckInput }),
    });
    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="container">
      <h1>MTG AI Assistant</h1>
      <textarea
        placeholder="Ask your question..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={askAI}>Ask</button>

      <button onClick={() => setShowDeckInput(!showDeckInput)} style={{ marginLeft: '10px' }}>
        {showDeckInput ? 'Hide Deck Input' : 'Inject Decklist'}
      </button>

      <button onClick={clearMemory} style={{ marginLeft: '10px', backgroundColor: '#EF4444' }}>
        Clear Memory
      </button>

      <button onClick={() => setShowBattleLog(!showBattleLog)} style={{ marginLeft: '10px', backgroundColor: '#10B981' }}>
        {showBattleLog ? 'Hide Battle Log' : 'Show Battle Log'}
      </button>

      {showDeckInput && (
        <div style={{ marginTop: '20px' }}>
          <textarea
            placeholder="Paste decklist here..."
            value={deckInput}
            onChange={(e) => setDeckInput(e.target.value)}
            style={{ height: '150px' }}
          />
          <button onClick={injectDeck}>Submit Deck</button>
        </div>
      )}

      {response && (
        <div className="response">
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}

      {showBattleLog && (
        <div className="response" style={{ marginTop: '30px', backgroundColor: '#0f172a' }}>
          <strong>Battle Log:</strong>
          {battleLog.map((entry, index) => (
            <p key={index} style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>{entry}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
