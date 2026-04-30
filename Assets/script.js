// --- Reveal Animation ---
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        if (elementTop < windowHeight - 50) { reveals[i].classList.add("active"); }
    }
}
window.addEventListener("scroll", reveal);
window.onload = reveal;

// --- Quiz Gamification Logic ---
let globalQuestions = [];
let currentIdx = 0;
let xp = 0;
let streak = 0;

async function startApp() {
    try {
        const res = await fetch('questions.json');
        globalQuestions = await res.json();
        document.getElementById('quiz-box').style.display = 'block';
        renderQuestion();
    } catch (err) {
        console.error("Error fetching questions:", err);
    }
}

function renderQuestion() {
    const q = globalQuestions[currentIdx];
    document.getElementById('q-text').innerText = (currentIdx + 1) + ". " + q.question_text;
    document.getElementById('feedback').innerText = "";
    document.getElementById('explain-box').innerText = "";
    document.getElementById('nxt-btn').style.display = "none";
    
    const box = document.getElementById('ans-box');
    box.innerHTML = "";
    
    for (const [key, value] of Object.entries(q.options)) {
        const b = document.createElement('button');
        b.className = 'option-btn';
        b.innerText = `${key}: ${value}`;
        b.onclick = () => validate(key, q.correct_answer, q.explanation);
        box.appendChild(b);
    }
}

function validate(choice, correct, reason) {
    const feed = document.getElementById('feedback');
    const btns = document.querySelectorAll(".option-btn");
    btns.forEach(btn => btn.disabled = true); // Disable buttons after choice

    if (choice === correct) {
        xp += 10; streak += 1;
        feed.innerHTML = "<span style='color:green'>✅ Correct!</span>";
    } else {
        streak = 0;
        feed.innerHTML = "<span style='color:red'>❌ Incorrect</span>";
    }
    document.getElementById('explain-box').innerText = reason;
    document.getElementById('xp-val').innerText = xp;
    document.getElementById('streak-val').innerText = streak;
    
    currentIdx = (currentIdx + 1) % globalQuestions.length;
    document.getElementById('nxt-btn').style.display = "block";
}
