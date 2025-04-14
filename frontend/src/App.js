import React, { useState, useEffect } from 'react';
import './App.css';

const KEYS = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('');

function App() {
  const [guess, setGuess] = useState('');
  const [history, setHistory] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [usedKeys, setUsedKeys] = useState({});
  const [gameOver, setGameOver] = useState(false);

  const handleGuess = async () => {
    if (guess.length !== 5 || gameOver) return;

    const res = await fetch('https://wordle-backend-fvakdpguh9dccydr.uaenorth-01.azurewebsites.net/api/guess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guess })
    });

    const data = await res.json();
    setHistory([...history, guess]);
    setFeedbackList([...feedbackList, data.feedback]);

    const newKeys = { ...usedKeys };
    guess.split('').forEach((char, i) => {
      newKeys[char] = data.feedback[i];
    });
    setUsedKeys(newKeys);

    if (data.feedback.every(f => f === 'correct')) {
      setGameOver(true);
      alert('🎉 You guessed it!');
    } else if (history.length + 1 >= 6) {
      setGameOver(true);
      alert('❌ Out of attempts.');
    }

    setGuess('');
  };

  const startNewGame = async () => {
    await fetch('https://wordle-backend-fvakdpguh9dccydr.uaenorth-01.azurewebsites.net/api/word');
    setHistory([]);
    setFeedbackList([]);
    setUsedKeys({});
    setGameOver(false);
    setGuess('');
  };

  useEffect(() => {
    startNewGame();
  }, []);

  return (
    <div className="App">
      <h1>Wordle</h1>
      {history.map((word, idx) => (
        <div key={idx} className="row">
          {word.split('').map((char, i) => (
            <div key={i} className={`cell ${feedbackList[idx][i]}`}>{char}</div>
          ))}
        </div>
      ))}
      {!gameOver && (
        <div className="input-row">
          <input
            type="text"
            maxLength="5"
            value={guess}
            onChange={e => setGuess(e.target.value.toUpperCase())}
          />
          <button onClick={handleGuess}>Submit</button>
        </div>
      )}
      <div className="keyboard">
        {KEYS.map(k => (
          <div key={k} className={`key ${usedKeys[k] || ''}`}>{k}</div>
        ))}
      </div>
      <button onClick={startNewGame}>Restart</button>
    </div>
  );
}

export default App;
