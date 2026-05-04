let currentIdx = 0;
let score = 0;
let xp = 0;
let streak = 0;
let questions = [];

async function loadGame() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) throw new Error('Could not fetch questions');
        const data = await response.json();
        
        // Randomize questions
        questions = data.sort(() => Math.random() - 0.5); 
        renderQuestion();
    } catch (e) {
        console.error(e);
        document.getElementById('question').innerText = "Oops! The quiz couldn't load.";
    }
}

function renderQuestion() {
    const q = questions[currentIdx];
    const optionsDiv = document.getElementById('options');
    const feedbackDiv = document.getElementById('feedback');
    const nextBtn = document.getElementById('next');
    const progressEl = document.getElementById('progress');

    // Reset UI
    document.getElementById('question').innerText = q.question_text;
    optionsDiv.innerHTML = '';
    feedbackDiv.innerText = '';
    nextBtn.style.display = 'none';
    
    // Update Progress Bar
    const progressPercent = (currentIdx / questions.length) * 100;
    progressEl.style.width = progressPercent + "%";

    // Generate Buttons
    Object.entries(q.options).forEach(([key, value]) => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.innerText = value;
        btn.onclick = (e) => checkAnswer(key, q.correct_answer, e.target);
        optionsDiv.appendChild(btn);
    });
}

function checkAnswer(choice, correct, btnElement) {
    const allButtons = document.querySelectorAll('.btn');
    const streakEl = document.getElementById('streak');
    const xpEl = document.getElementById('xp');
    const feedbackDiv = document.getElementById('feedback');
    
    // Disable all buttons after choice
    allButtons.forEach(b => b.disabled = true);

    if (choice === correct) {
        score++;
        streak++;
        
        // Multiplier: Base 10 + 10% bonus per streak point
        const pointsEarned = Math.floor(10 * (1 + (streak * 0.1)));
        xp += pointsEarned;
        
        btnElement.classList.add('correct');
        feedbackDiv.style.color = "#28a745";
        feedbackDiv.innerText = `✨ +${pointsEarned} XP!`;
        
        // Streak Animation
        streakEl.classList.add('streak-bounce');
        setTimeout(() => streakEl.classList.remove('streak-bounce'), 500);
    } else {
        streak = 0;
        btnElement.classList.add('wrong');
        feedbackDiv.style.color = "#dc3545";
        feedbackDiv.innerText = "The answer was " + correct;
    }
    
    // Update Stats Display
    xpEl.innerText = xp;
    streakEl.innerText = streak;
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
    const container = document.querySelector('.card');
    const percent = Math.round((score / questions.length) * 100);
    document.getElementById('progress').style.width = "100%";
    
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
                <span class="shell">🦀</span><span class="shell">🏖️</span>
            </div>
        </div>
    `;
    
    document.getElementById('feedback').innerText = "Correct!";
    document.getElementById('next').style.display = 'none';
}

// Kick off the game
loadGame();
