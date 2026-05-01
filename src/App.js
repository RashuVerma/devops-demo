import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(true);

  const API_URL = 'http://localhost:5000/api/history';

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setHistory(data.map(item => ({ id: item._id, val: item.val, res: item.res })));
    } catch (err) { console.error("Error fetching history:", err); }
  };

  const saveHistory = async (val, res) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ val, res })
      });
      const newItem = await response.json();
      setHistory(prev => [{ id: newItem._id, val: newItem.val, res: newItem.res }, ...prev]);
    } catch (err) { console.error("Error saving history:", err); }
  };

  const handleClick = (value) => {
    try {
      if (value === "=") {
        if (!input) return;
        let calcInput = input
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/²/g, '**2')
          .replace(/²√x\(/g, 'Math.sqrt(')
          .replace(/π/g, 'Math.PI')
          .replace(/e/g, 'Math.E')
          .replace(/\^/g, '**')
          .replace(/sin\(/g, 'Math.sin(')
          .replace(/cos\(/g, 'Math.cos(')
          .replace(/tan\(/g, 'Math.tan(')
          .replace(/log\(/g, 'Math.log10(')
          .replace(/ln\(/g, 'Math.log(')
          .replace(/abs\(/g, 'Math.abs(');
        
        // eslint-disable-next-line no-eval
        const result = eval(calcInput).toString();
        saveHistory(input, result);
        setInput(result);
      } else if (value === "C" || value === "CE") {
        setInput("");
      } else if (value === "⌫") {
        setInput(input.slice(0, -1));
      } else if (["sin", "cos", "tan", "log", "ln", "abs"].includes(value)) {
        setInput(input + value + "(");
      } else if (value === "x²") {
        setInput(input + "²");
      } else if (value === "²√x") {
        setInput(input + "²√x(");
      } else if (value === "1/x") {
        setInput(input + "1/");
      } else if (value === "+/-") {
        if (input.startsWith("-(") && input.endsWith(")")) {
          setInput(input.slice(2, -1));
        } else {
          setInput(`-(${input})`);
        }
      } else {
        setInput(input + value);
      }
    } catch { setInput("Error"); }
  };

  const deleteHistoryItem = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setHistory(history.filter(item => item.id !== id));
    } catch (err) { console.error("Error deleting item:", err); }
  };

  const clearAllHistory = async () => {
    try {
      await fetch(API_URL, { method: 'DELETE' });
      setHistory([]);
    } catch (err) { console.error("Error clearing history:", err); }
  };

  const buttons = [
    "sin", "cos", "tan", "log", "ln",
    "(", ")", "π", "e", "^",
    "abs", "x²", "²√x", "1/x", "÷",
    "7", "8", "9", "×", "%",
    "4", "5", "6", "-", "CE",
    "1", "2", "3", "+", "C",
    "0", ".", "+/-", "⌫", "="
  ];

  return (
    <div className="app-container">
      <header className="main-header">
        <div className="left-nav">
          <h1>Scientific Calculator 🔬</h1>
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