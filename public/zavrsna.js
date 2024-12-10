let teamTimeLeft = 60;
let hunterTimeLeft = 60;
let teamScore = 1; // Ekipa počinje s 1 bodom prednosti
let hunterScore = 0;
let currentQuestionIndex = 0;
let teamQuestions = [];
let hunterQuestions = [];
let currentTurn = "team"; // "team" ili "hunter"
let teamInterval, hunterInterval;
const totalSteps = 20; // Duljina progress bara u koracima

// Učitaj pitanja sa servera
fetch('https://moja-potjera.onrender.com/questions')
  .then(response => response.json())
  .then(data => {
    // Podijeli pitanja na dvije različite skupine
    const splitIndex = Math.ceil(data.length / 2);
    teamQuestions = shuffleArray(data.slice(0, splitIndex));
    hunterQuestions = shuffleArray(data.slice(splitIndex));

    updateProgressBar(); // Postavi početni napredak za ekipu
    setTimeout(displayQuestion, 1000); // Prvo pitanje s odgodom
    startTeamTimer();
  })
  .catch(error => console.error('Error loading questions:', error));

// Prikaz pitanja s odgodom od 1 sekunde
function displayQuestion() {
  const questions = currentTurn === "team" ? teamQuestions : hunterQuestions;

  if (currentQuestionIndex >= questions.length) {
    if (currentTurn === "team") {
      endTeamPhase();
    } else {
      endGame();
    }
    return;
  }

  const question = questions[currentQuestionIndex];
  document.getElementById('question').textContent = question.question;
  document.getElementById('user-answer').value = '';
  document.getElementById('feedback').textContent = '';
}

// Obrada odgovora ekipe
function submitTeamAnswer() {
  if (currentTurn !== "team") return; // Spriječi da tim odgovara kad nije na redu

  const userAnswer = document.getElementById('user-answer').value.trim();
  const correctAnswer = teamQuestions[currentQuestionIndex].answer;

  if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
    teamScore++;
    document.getElementById('feedback').textContent = 'Ekipa: Točan odgovor!';
  } else {
    document.getElementById('feedback').textContent = `Ekipa: Netočan odgovor! Točan odgovor: ${correctAnswer}`;
  }

  document.getElementById('team-score').textContent = teamScore;
  updateProgressBar();
  currentQuestionIndex++;
  setTimeout(displayQuestion, 1000); // Prikaz sljedećeg pitanja s odgodom
}

// Obrada odgovora lovca
function hunterAnswer() {
  const question = hunterQuestions[currentQuestionIndex];
  const correctAnswer = question.answer;

  hunterScore++;
  document.getElementById('feedback').textContent = `Lovac: Točan odgovor! Odgovor lovca: ${correctAnswer}`;
  document.getElementById('hunter-score').textContent = hunterScore;
  updateProgressBar();
  currentQuestionIndex++;

  if (hunterScore >= teamScore) {
    setTimeout(() => {
      document.getElementById('feedback').textContent = ''; // Ukloni prikaz odgovora
      endGame();
    }, 2000); // Završetak igre nakon 2 sekunde
  } else {
    setTimeout(displayQuestion, 1000); // Prikaz sljedećeg pitanja s odgodom
  }
}

// Funkcija za prelazak na sljedeće pitanje bez odgovora
function nextQuestion() {
  if (currentTurn !== "team") return; // "Dalje" može koristiti samo ekipa

  const correctAnswer = teamQuestions[currentQuestionIndex].answer;
  document.getElementById('feedback').textContent = `Ekipa: Netočan odgovor! Točan odgovor: ${correctAnswer}`;
  currentQuestionIndex++;
  setTimeout(displayQuestion, 1000); // Prikaz sljedećeg pitanja s odgodom
}

// Traka napretka
function updateProgressBar() {
  const teamProgress = (teamScore / totalSteps) * 100;
  const hunterProgress = (hunterScore / totalSteps) * 100;

  document.getElementById('team-progress').style.width = `${teamProgress}%`;
  document.getElementById('hunter-progress').style.width = `${hunterProgress}%`;
}

// Završetak faze ekipe
function endTeamPhase() {
  clearInterval(teamInterval);

  // Sakrij pitanja i timer
  document.getElementById('question-box').style.display = "none";

  const transitionMessage = document.getElementById('transition-message');
  transitionMessage.style.display = "block";
  transitionMessage.textContent = `Vrijeme je isteklo! Ekipa je ostvarila ${
    teamScore - hunterScore
  } koraka prednosti. Sada je na redu lovac.`;

  setTimeout(() => {
    transitionMessage.style.display = "none";
    document.getElementById('question-box').style.display = "block"; // Ponovno prikaži okvir za pitanja
    currentTurn = "hunter"; // Postavi trenutnu fazu na lovca
    currentQuestionIndex = 0; // Resetiraj indeks pitanja za lovca
    document.getElementById('current-turn').textContent = "Lovac"; // Postavi indikator na lovca
    startHunterPhase();
  }, 5000); // Prikaži poruku 5 sekundi, zatim pokreni fazu lovca
}

// Pokretanje timera za ekipu
function startTeamTimer() {
  document.getElementById('time-left').textContent = teamTimeLeft;

  teamInterval = setInterval(() => {
    teamTimeLeft--;
    document.getElementById('time-left').textContent = teamTimeLeft;

    if (teamTimeLeft <= 0) {
      clearInterval(teamInterval);
      endTeamPhase();
    }
  }, 1000);
}

// Pokretanje faze lovca
function startHunterPhase() {
  hunterTimeLeft = 120; // Reset timer for the hunter
  document.getElementById('time-left').textContent = hunterTimeLeft;

  hunterInterval = setInterval(() => {
    hunterTimeLeft--;
    document.getElementById('time-left').textContent = hunterTimeLeft;

    if (hunterTimeLeft <= 0) {
      clearInterval(hunterInterval);
      endGame();
    }

    if (hunterTimeLeft % randomInterval(3, 12) === 0) {
      hunterAnswer();
    }
  }, 1000);

  displayQuestion(); // Prikaz pitanja za lovca
}

// Generiranje slučajnog vremena
function randomInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Završetak igre
function endGame() {
  clearInterval(teamInterval);
  clearInterval(hunterInterval);

  document.getElementById('question-box').style.display = 'none';
  document.getElementById('info').style.display = 'none';
  document.getElementById('feedback').textContent = ''; // Ukloni prikaz odgovora
  document.getElementById('end-game').style.display = 'block';

  const result = teamScore > hunterScore ? 'Ekipa je pobijedila!' : 'Lovac je pobijedio!';
  document.getElementById('result').textContent = result;
}

// Promiješaj pitanja
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Ponovno pokreni igru
function restartGame() {
  window.location.reload();
}

// Dodavanje Enter tipke za odgovor
document.getElementById('user-answer').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    if (currentTurn === "team") {
      submitTeamAnswer();
    }
  }
});
