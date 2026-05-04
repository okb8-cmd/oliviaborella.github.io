let currentIdx = 0;
let score = 0; 
let xp = 0;
let streak = 0;
let questions = [];

async function loadGame() {
    try {
        const response = await fetch('questions.json');
        const data = await response.json();
        questions = data.sort(() => Math.random() - 0.5); 
        renderQuestion();
    } catch (e) {
        document.getElementById('question').innerText = "Oops! The quiz couldn't load.";
    }
}

function renderQuestion() {
    const q = questions[currentIdx];
    document.getElementById('question').innerText = q.question_text;
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    document.getElementById('feedback').innerText = '';
    document.getElementById('next').style.display = 'none';
    
    const progress = ((currentIdx) / questions.length) * 100;
    document.getElementById('progress').style.width = progress + "%";

    Object.entries(q.options).forEach(([key, value]) => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.innerText = value;
        btn.onclick = (e) => checkAnswer(key, q.correct_answer, e.target);
        optionsDiv.appendChild(btn);
    });
}

function checkAnswer(choice, correct, btnElement) {
    document.querySelectorAll('.btn').forEach(b => b.disabled = true);
    if (choice === correct) {
        score++; 
        xp += 10; 
        streak += 1;
        btnElement.classList.add('correct');
        document.getElementById('feedback').innerText = "✨ Correct!";
    } else {
        streak = 0;
        btnElement.classList.add('wrong');
        document.getElementById('feedback').innerText = "The answer was " + correct;
    }
    document.getElementById('xp').innerText = xp;
    document.getElementById('streak').innerText = streak;
    document.getElementById('next').style.display = 'block';
}

function nextQuestion() {
    currentIdx++;
    if (currentIdx < questions.length) {
        renderQuestion();
    } else {
        showCelebration();
    }
}

function showCelebration() {
    document.getElementById('progress').style.width = "100%";
    const percent = Math.round((score / questions.length) * 100);
    
    // --- UPDATED BEACH THEME TEXT ---
    document.getElementById('question').innerText = "🌊 It's a Shore Thing!";
    document.getElementById('options').innerHTML = `
        <div class="celebration-box">
            <h1 style="font-size: 3rem; margin: 10px 0; color: #0077b6;">${percent}%</h1>
            <p>You caught <strong>${score}</strong> out of <strong>${questions.length}</strong> correct answers.</p>
            <p>Total XP Earned: <strong>${xp}</strong></p>
        </div>
        <div class="beach-celebration">
            <div class="sea-shell">🐚</div><div class="sea-shell">🌊</div>
            <div class="sea-shell">🐚</div><div class="sea-shell">☀️</div>
            <div class="sea-shell">🌊</div><div class="sea-shell">🐚</div>
        </div>
    `;
    document.getElementById('next').style.display = 'none';
}

loadGame();
