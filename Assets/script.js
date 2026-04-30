let state = {
    xp: localStorage.getItem('isc_xp') ? parseInt(localStorage.getItem('isc_xp')) : 0,
    streak: 0,
    currentIndex: 0,
    questions: []
};

async function initApp() {
    const response = await fetch('questions.json');
    state.questions = await response.json();
    updateUI();
    showQuestion();
}

function checkAnswer(selected, correct) {
    const isCorrect = selected === correct;
    
    if (isCorrect) {
        state.xp += 10;
        state.streak += 1;
        document.getElementById('result-msg').innerText = "✅ Mastery Achieved!";
    } else {
        state.streak = 0;
        document.getElementById('result-msg').innerText = "❌ Learning Opportunity";
    }

    // Save XP to browser memory
    localStorage.setItem('isc_xp', state.xp);
    updateUI();
    showFeedback(isCorrect);
}

function updateUI() {
    document.getElementById('xp-count').innerText = state.xp;
    document.getElementById('streak-count').innerText = state.streak;
    
    // Update Progress Bar %
    const progress = (state.currentIndex / state.questions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}