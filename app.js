const fs = require('fs');
const express = require('express');
const path = require('path'); // Modul za upravljanje putanjama
const app = express();

// Postavi mapu za statičke datoteke
app.use(express.static(path.join(__dirname, 'public')));

// Funkcija za učitavanje pitanja iz .txt datoteke
const loadQuestions = () => {
  const rawData = fs.readFileSync('questions.txt', 'utf-8');
  const lines = rawData.split('\n').filter(line => line.trim() !== ''); // Ukloni prazne linije
  
  // Parsiraj svako pitanje u objekt
  const questions = lines.map(line => {
    const parts = line.split('?');
    return {
      id: parts[0].split('.')[0].trim(), // ID prije prve točke
      question: parts[0].split('.').slice(1).join('.').trim(), // Pitanje nakon točke
      answer: parts[1]?.trim() || '' // Odgovor nakon '?'
    };
  });
  return questions;
};

// Endpoint za dohvaćanje pitanja
app.get('/questions', (req, res) => {
  const questions = loadQuestions();
  res.json(questions);
});




// Endpoint za pitanja igrača
app.get('/player-questions', (req, res) => {
  const playerQuestions = loadQuestions('questions.txt');
  res.json(playerQuestions);
});

// Endpoint za pitanja lovca
app.get('/hunter-questions', (req, res) => {
  const hunterQuestions = loadQuestions('questions.txt');
  res.json(hunterQuestions);
});




// Pokreni server na portu 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
