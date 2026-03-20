import React, { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(true);

  const handleClick = (value) => {
    try {
      if (value === "=") {
        if (!input) return;
        let calcInput = input.replace(/×/g, '*').replace(/÷/g, '/').replace(/x²/g, '**2').replace(/²√x/g, 'Math.sqrt');
        // eslint-disable-next-line no-eval
        const result = eval(calcInput).toString();
        setHistory(prev => [{ id: Date.now(), val: input, res: result }, ...prev]);
        setInput(result);
      } else if (value === "C" || value === "CE") {
        setInput("");
      } else if (value === "⌫" || value === "backspace-icon") { // Match your backspace icon
        setInput(input.slice(0, -1));
      } else {
        setInput(input + value);
      }
    } catch { setInput("Error"); }
  };

  const deleteHistoryItem = (id) => setHistory(history.filter(item => item.id !== id));
  const clearAllHistory = () => setHistory([]);

  const buttons = [
    "%", "CE", "C", "⌫",
    "1/x", "x²", "²√x", "÷",
    "7", "8", "9", "×",
    "4", "5", "6", "-",
    "1", "2", "3", "+",
    "+/-", "0", ".", "="
  ];

  return (
    <div className="app-container">
      <header className="main-header">
        <div className="left-nav">
          <h1>Standard Calculator 🧮</h1>
        </div>
        <button className="toggle-history" onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? "Close History" : "View History"}
        </button>
      </header>

      <div className="calculator-grid">
        <main className="calc-body">
          <div className="display-screen">
            <div className="output-text">{input || "0"}</div>
          </div>

          <div className="pad-layout">
            {buttons.map((btn) => (
              <button 
                key={btn} 
                onClick={() => handleClick(btn)}
                className={`btn ${btn === "=" ? "btn-pink" : ""} ${!isNaN(btn) || btn === "." ? "btn-num" : "btn-dark"}`}
              >
                {btn === "⌫" ? "⌫" : btn} 
              </button>
            ))}
          </div>
        </main>

        {showHistory && (
          <aside className="history-panel">
            <div className="history-top">
              <h3>Recent Calculations</h3>
              {history.length > 0 && <span className="clear-link" onClick={clearAllHistory}>Clear All</span>}
            </div>
            
            <div className="scroll-box">
              {history.length === 0 ? <p className="empty">No history yet</p> : 
                history.map(item => (
                  <div key={item.id} className="history-card">
                    <button className="card-del" onClick={() => deleteHistoryItem(item.id)}>✕</button>
                    <p className="h-val">{item.val} =</p>
                    <p className="h-res">{item.res}</p>
                  </div>
                ))
              }
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

export default App;