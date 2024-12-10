//uredit pitanja
//stavit da je tocan odgovor koji je u slovo ili 2 slican sa pravim
//stavit da je tocan ili malim ili velikim slovom

//plocu rijesiti i podatke staviti


let playerName = "";
let timeLeft = 60;
let score = 0;
let currentQuestionIndex = 0;
let timerInterval;
let questions = [];
let answerChecked = false; // Praćenje je li odgovor provjeren

// Učitaj pitanja sa servera i promiješaj ih
fetch('https://moja-potjera.onrender.com/questions')
  .then(response => response.json())
  .then(data => {
    questions = shuffleArray(data); // Promiješaj pitanja
  })
  .catch(error => console.error('Error loading questions:', error));

// Funkcija za početak igre
function startGame() {
  const usernameInput = document.getElementById('username');
  playerName = usernameInput.value.trim();

  if (playerName === "") {
    alert("Molimo unesite ime!");
    return;
  }

  // Prikaži ekran igre i sakrij login
  document.getElementById('login').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  document.getElementById('player-name').textContent = playerName;

  startTimer();
  displayQuestion();
}

// Funkcija za prikaz pitanja
function displayQuestion() {
  if (currentQuestionIndex >= questions.length) {
    endGame();
    return;
  }

  answerChecked = false; // Resetiraj stanje odgovora
  const question = questions[currentQuestionIndex];
  document.getElementById('question').textContent = question.question;
  document.getElementById('user-answer').value = ""; // Resetiraj unos
  document.getElementById('feedback').textContent = ""; // Resetiraj povratnu informaciju
}

// Funkcija za obradu odgovora
function submitAnswer() {
  if (answerChecked) return; // Onemogući višestruko provjeravanje odgovora

  const userAnswer = document.getElementById('user-answer').value.trim();
  const correctAnswer = questions[currentQuestionIndex].answer;

  if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
    score += 500;
    document.getElementById('feedback').textContent = "Točan odgovor!";
  } else {
    document.getElementById('feedback').textContent = `Netočan odgovor! Točan odgovor je: ${correctAnswer}`;
  }

  document.getElementById('score').textContent = score;
  answerChecked = true; // Označi da je odgovor provjeren
  currentQuestionIndex++;
  setTimeout(displayQuestion, 500); // Pričekaj 500 ms prije prikaza novog pitanja
}

// Funkcija za prelazak na sljedeće pitanje bez odgovaranja
function nextQuestion() {
  if (answerChecked) return; // Spriječi višestruke akcije dok se pitanje ne promijeni

  const correctAnswer = questions[currentQuestionIndex].answer;
  document.getElementById('feedback').textContent = `Točan odgovor je: ${correctAnswer}`;

  answerChecked = true; // Označi da je odgovor provjeren
  currentQuestionIndex++;

  // Pričekaj 500 ms prije prikaza novog pitanja
  setTimeout(displayQuestion, 500);
}

// Funkcija za pokretanje odbrojavanja
function startTimer() {
  document.getElementById('time-left').textContent = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('time-left').textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

// Funkcija za završetak igre
function endGame() {
  clearInterval(timerInterval);

  // Sakrij ekran igre i prikaži završni ekran
  document.getElementById('game').style.display = 'none';
  document.getElementById('end-game').style.display = 'block';
  document.getElementById('final-score').textContent = score;
}

// Funkcija za prelazak na novu fazu igre
function goToNextPhase() {
  window.location.href = "zavrsna.html"; // Redirekcija na stranicu zavrsne (zasada)
}


// Funkcija za promiješati pitanja
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Dodavanje preslušavanja događaja za Enter
document.getElementById('user-answer').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    submitAnswer();
  }
});
