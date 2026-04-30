let currentIdx = 0;
let xp = 0;
let streak = 0;
let questions = [];

// This function now assumes questions.json is in the SAME folder (Assets)
async function loadGame() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) throw new Error('Network response was not ok');
        questions = await response.json();
        renderQuestion();
    } catch (error) {
        console.error("Failed to load questions:", error);
        document.getElementById('question').innerText = "Error loading questions. Check file path!";
    }
}

function renderQuestion() {
    const q = questions[currentIdx];
    document.getElementById('question').innerText = q.question_text;
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    document.getElementById('feedback').innerText = '';
    document.getElementById('next').style.display = 'none';

    Object.entries(q.options).forEach(([key, value]) => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.innerText = `${key}: ${value}`;
        btn.onclick = () => checkAnswer(key, q.correct_answer);
        optionsDiv.appendChild(btn);
    });
}

function checkAnswer(choice, correct) {
    const feedback = document.getElementById('feedback');
    if (choice === correct) {
        xp += 10; streak += 1;
        feedback.innerText = "✅ Correct! +10 XP";
        feedback.style.color = "green";
    } else {
        streak = 0;
        feedback.innerText = "❌ Incorrect. The answer was " + correct;
        feedback.style.color = "red";
    }
    document.getElementById('xp').innerText = xp;
    document.getElementById('streak').innerText = streak;
    document.getElementById('next').style.display = 'inline-block';
}

function nextQuestion() {
    currentIdx = (currentIdx + 1) % questions.length;
    renderQuestion();
}

loadGame();
