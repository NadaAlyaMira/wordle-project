const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const WORDS = ['GRAPE', 'PLANT', 'MANGO', 'APPLE', 'BRICK'];
let answer = WORDS[Math.floor(Math.random() * WORDS.length)];

function getFeedback(guess, answer) {
  const feedback = [];
  const used = {};

  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) {
      feedback.push('correct');
      used[i] = true;
    } else {
      feedback.push(null);
    }
  }

  for (let i = 0; i < 5; i++) {
    if (feedback[i]) continue;
    const index = [...answer].findIndex((c, j) => c === guess[i] && !used[j]);
    if (index !== -1) {
      feedback[i] = 'present';
      used[index] = true;
    } else {
      feedback[i] = 'absent';
    }
  }

  return feedback;
}

app.get('/api/word', (req, res) => {
  answer = WORDS[Math.floor(Math.random() * WORDS.length)];
  res.json({ message: 'New word generated.' });
});

app.post('/api/guess', (req, res) => {
  const { guess } = req.body;
  if (!guess || guess.length !== 5) {
    return res.status(400).json({ error: 'Guess must be a 5-letter word.' });
  }
  const feedback = getFeedback(guess.toUpperCase(), answer);
  res.json({ feedback });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
