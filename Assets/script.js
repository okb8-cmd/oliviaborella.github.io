let currentIdx = 0, score = 0, xp = 0, streak = 0, questions = [];

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
    document.getElementById('progress').style.width = (currentIdx / questions.length) * 100 + "%";

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
    const streakEl = document.getElementById('streak');
    
    if (choice === correct) {
        score++;
        streak++;
        // Multiplier Logic: base 10 + bonus based on streak
        const pointsEarned = Math.floor(10 * (1 + (streak * 0.1)));
        xp += pointsEarned;
        
        btnElement.classList.add('correct');
        document.getElementById('feedback').innerText = `✨ +${pointsEarned} XP!`;
        
        // Add "Heat" animation to streak
        streakEl.classList.add('streak-bounce');
        setTimeout(() => streakEl.classList.remove('streak-bounce'), 500);
    } else {
        streak = 0;
        btnElement.classList.add('wrong');
        document.getElementById('feedback').innerText = "The answer was " + correct;
    }
    
    document.getElementById('xp').innerText = xp;
    streakEl.innerText = streak;
    document.getElementById('next').style.display = 'block';
}

function nextQuestion() {
    currentIdx++;
    if (currentIdx < questions.length) renderQuestion();
    else showCelebration();
}

function showCelebration() {
    document.getElementById('progress').style.width = "100%";
    const percent = Math.round((score / questions.length) * 100);
    
    document.getElementById('question').innerText = "🌊 It's a Shore Thing!";
    document.getElementById('options').innerHTML = `
        <div class="celebration-box">
            <h1 style="font-size: 3.5rem; margin: 10px 0; color: #0077b6;">${percent}%</h1>
            <p>You caught <strong>${score}</strong> out of <strong>${questions.length}</strong> correct answers.</p>
            <p>Total XP Earned: <strong>${xp}</strong></p>
            
            <div class="beach-floaters">
                <span class="shell">🐚</span><span class="shell">🌊</span>
                <span class="shell">🐚</span><span class="shell">☀️</span>
                <span class="shell">🌊</span><span class="shell">🐚</span>
            </div>
        </div>
    `;
    document.getElementById('next').style.display = 'none';
}

loadGame();
