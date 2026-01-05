// ==================== GAMIFICATION FEATURES ====================

// Daily Features & Streaks
const gamification = {
    streakKey: 'jodi_visit_streak',
    lastVisitKey: 'jodi_last_visit',
    unlockedDialoguesKey: 'jodi_unlocked_dialogues',
    achievementsKey: 'jodi_achievements'
};

// Initialize gamification on page load
document.addEventListener('DOMContentLoaded', () => {
    updateVisitStreak();
    showDailyTrivia();
    checkAchievements();
});

// ==================== VISIT STREAK SYSTEM ====================

function updateVisitStreak() {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem(gamification.lastVisitKey);
    let streak = parseInt(localStorage.getItem(gamification.streakKey)) || 0;

    if (!lastVisit) {
        // First visit
        streak = 1;
    } else {
        const lastDate = new Date(lastVisit);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Consecutive day
            streak++;
        } else if (diffDays > 1) {
            // Streak broken
            streak = 1;
        }
        // If same day, don't change streak
    }

    localStorage.setItem(gamification.streakKey, streak);
    localStorage.setItem(gamification.lastVisitKey, today);

    // Display streak (you can add a UI element)
    console.log(`🔥 Current Streak: ${streak} days!`);

    // Unlock special dialogues based on streak
    unlockDialoguesBasedOnStreak(streak);
}

function unlockDialoguesBasedOnStreak(streak) {
    const unlocked = JSON.parse(localStorage.getItem(gamification.unlockedDialoguesKey)) || [];

    if (streak >= 7 && !unlocked.includes('week_warrior')) {
        unlocked.push('week_warrior');
        showNotification('🎉 Achievement Unlocked: Week Warrior! Special dialogues available!');
    }

    if (streak >= 30 && !unlocked.includes('month_master')) {
        unlocked.push('month_master');
        showNotification('🏆 Achievement Unlocked: Month Master! Elite dialogues unlocked!');
    }

    localStorage.setItem(gamification.unlockedDialoguesKey, JSON.stringify(unlocked));
}

// ==================== DAILY TAMIL CINEMA TRIVIA ====================

const tamilCinemaTrivia = [
    { question: "எந்த படத்தில் 'கண்மணி அண்பொடு காதலன்' பாடல் வருகிறது?", answer: "குன்னக்குடி வைத்தியநாதன்", difficulty: "easy" },
    { question: "தமிழ் சினிமாவின் முதல் நிறத் திரைப்படம் எது?", answer: "அன்னா கலைக்கோவில்", difficulty: "medium" },
    { question: "எந்த நடிகருக்கு 'இளைய தளபதி' என்ற பட்டம்?", answer: "விஜய்", difficulty: "easy" },
    { question: "'தூங்கா' எத்தனை மணி நேரத்தில் எடுக்கப்பட்டது?", answer: "12 மணி நேரம்", difficulty: "hard" },
    { question: "எந்த படத்தில் சூர்யா & ஜோதிகா முதல் முறையாக நடித்தனர்?", answer: "காக்க காக்க", difficulty: "medium" },
    { question: "தனுஷின் 'ஏன் கண் உன் நெஞ்சம்' பாடல் எந்த படத்தில்?", answer: "3", difficulty: "easy" },
    { question: "எந்த இயக்குனர் 'மணிரத்னம்' என்று அழைக்கப்படுகிறார்?", answer: "மணிரத்னம்", difficulty: "easy" }
];

function showDailyTrivia() {
    const today = new Date().toDateString();
    const lastTriviaDate = localStorage.getItem('jodi_last_trivia_date');

    if (lastTriviaDate !== today) {
        const randomTrivia = tamilCinemaTrivia[Math.floor(Math.random() * tamilCinemaTrivia.length)];
        localStorage.setItem('jodi_last_trivia_date', today);
        localStorage.setItem('jodi_daily_trivia', JSON.stringify(randomTrivia));

        // Show trivia notification after a delay
        setTimeout(() => {
            showTriviaModal(randomTrivia);
        }, 2000);
    }
}

function showTriviaModal(trivia) {
    const modal = `
        <div id="triviaModal" style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(22, 33, 62, 0.98);
            padding: 30px;
            border-radius: 20px;
            border: 2px solid var(--accent-gold);
            z-index: 9999;
            max-width: 500px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        ">
            <h3 style="color: var(--accent-gold); margin-bottom: 15px;">📚 Tamil Cinema Trivia</h3>
            <p style="color: var(--text-bright); font-size: 1.1rem; margin-bottom: 20px;">${trivia.question}</p>
            <button onclick="revealTriviaAnswer('${trivia.answer}')" class="btn-primary" style="width: 100%;">
                Show Answer
            </button>
            <p id="triviaAnswer" style="color: var(--accent-gold); margin-top: 15px; display: none;"></p>
            <button onclick="closeTriviaModal()" class="btn-secondary" style="width: 100%; margin-top: 10px;">
                Close
            </button>
        </div>
        <div id="triviaOverlay" onclick="closeTriviaModal()" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 9998;
        "></div>
    `;

    document.body.insertAdjacentHTML('beforeend', modal);
}

function revealTriviaAnswer(answer) {
    const answerEl = document.getElementById('triviaAnswer');
    answerEl.textContent = `✅ Answer: ${answer}`;
    answerEl.style.display = 'block';
}

function closeTriviaModal() {
    document.getElementById('triviaModal')?.remove();
    document.getElementById('triviaOverlay')?.remove();
}

// ==================== ACHIEVEMENT SYSTEM ====================

const achievements = [
    { id: 'first_test', name: 'First Steps', desc: 'Complete your first compatibility test', icon: '🎯' },
    { id: 'love_expert', name: 'Love Expert', desc: 'Complete 10 tests', icon: '💎' },
    { id: 'match_master', name: 'Match Master', desc: 'Get a score above 90%', icon: '🏆' },
    { id: 'week_warrior', name: 'Week Warrior', desc: 'Visit 7 days in a row', icon: '🔥' },
    { id: 'month_master', name: 'Month Master', desc: 'Visit 30 days in a row', icon: '👑' },
    { id: 'explorer', name: 'Explorer', desc: 'Try both Solo and Couple modes', icon: '🗺️' }
];

function checkAchievements() {
    const unlockedAchievements = JSON.parse(localStorage.getItem(gamification.achievementsKey)) || [];
    const testsCount = parseInt(localStorage.getItem('jodi_total_tests')) || 0;
    const streak = parseInt(localStorage.getItem(gamification.streakKey)) || 0;

    // Check conditions
    if (testsCount >= 1 && !unlockedAchievements.includes('first_test')) {
        unlockAchievement('first_test');
    }
    if (testsCount >= 10 && !unlockedAchievements.includes('love_expert')) {
        unlockAchievement('love_expert');
    }
    if (streak >= 7 && !unlockedAchievements.includes('week_warrior')) {
        unlockAchievement('week_warrior');
    }
}

function unlockAchievement(achievementId) {
    const unlocked = JSON.parse(localStorage.getItem(gamification.achievementsKey)) || [];

    if (!unlocked.includes(achievementId)) {
        unlocked.push(achievementId);
        localStorage.setItem(gamification.achievementsKey, JSON.stringify(unlocked));

        const achievement = achievements.find(a => a.id === achievementId);
        if (achievement) {
            showAchievementNotification(achievement);
        }
    }
}

function showAchievementNotification(achievement) {
    const notification = `
        <div class="achievement-notification" style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--gradient-gold);
            color: #000;
            padding: 20px;
            border-radius: 15px;
            z-index: 10000;
            animation: slideIn 0.5s ease-out;
            box-shadow: 0 10px 30px rgba(255,207,75,0.5);
            min-width: 300px;
        ">
            <h4 style="margin: 0 0 10px 0; font-size: 1.2rem;">
                ${achievement.icon} Achievement Unlocked!
            </h4>
            <p style="margin: 0; font-weight: 600;">${achievement.name}</p>
            <p style="margin: 5px 0 0 0; font-size: 0.9rem; opacity: 0.8;">${achievement.desc}</p>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        document.querySelector('.achievement-notification')?.remove();
    }, 5000);
}

// ==================== NOTIFICATION SYSTEM ====================

function showNotification(message) {
    const notification = `
        <div class="notification" style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(22, 33, 62, 0.95);
            color: var(--accent-gold);
            padding: 15px 20px;
            border-radius: 10px;
            border: 1px solid var(--accent-gold);
            z-index: 10000;
            animation: slideUp 0.3s ease-out;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        ">
            ${message}
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', notification);

    setTimeout(() => {
        document.querySelector('.notification')?.remove();
    }, 4000);
}

// ==================== DAILY HOROSCOPE (BONUS) ====================

const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

const horoscopes = [
    "Today is perfect for finding love! The stars are aligned in your favor. 💫",
    "Someone special is thinking about you today. Be open to new connections! 💖",
    "Your charm is irresistible today. Perfect day for a date! 🌹",
    "Venus blesses your love life today. Expect romantic surprises! ✨",
    "Today brings clarity in relationships. Trust your heart! 💝"
];

function getDailyHoroscope() {
    const today = new Date();
    const horoscopeIndex = today.getDate() % horoscopes.length;
    return horoscopes[horoscopeIndex];
}

// ==================== HELPER FUNCTIONS ====================

// Track test completion for achievements
function trackTestCompletion(testType) {
    const testsCount = parseInt(localStorage.getItem('jodi_total_tests')) || 0;
    localStorage.setItem('jodi_total_tests', testsCount + 1);

    const completedModes = JSON.parse(localStorage.getItem('jodi_completed_modes')) || [];
    if (!completedModes.includes(testType)) {
        completedModes.push(testType);
        localStorage.setItem('jodi_completed_modes', JSON.stringify(completedModes));

        if (completedModes.length === 2) {
            unlockAchievement('explorer');
        }
    }

    checkAchievements();
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideUp {
        from {
            transform: translateY(100px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
