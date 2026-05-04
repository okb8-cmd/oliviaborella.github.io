let currentIdx = 0, xp = 0, streak = 0, questions = [];

async function loadGame() {
    const response = await fetch('questions.json');
    questions = await response.json();
    renderQuestion();
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
    if (choice === correct) {
        xp += 10; streak += 1;
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
    if (currentIdx < questions.length) renderQuestion();
    else {
        document.getElementById('question').innerText = "Quiz Complete!";
        document.getElementById('options').innerHTML = `<p>Final XP: ${xp}</p>`;
        document.getElementById('next').style.display = 'none';
    }
}
loadGame();
