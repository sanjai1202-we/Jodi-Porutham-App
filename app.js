/* ================================
   Jodi Porutham - Application Logic
   ================================ */

// User data storage
let userData = {
    name: '',
    gender: '',
    age: '',
    personality: '',
    communication: '',
    lifestyle: '',
    anger: '',
    patience: '',
    expression: '',
    reassurance: '',
    support: '',
    focus: '',
    routine: '',
    social: '',
    value: ''
};

// Name Gender Database for Validation
const nameGenderProfiles = {
    male: [
        'deva', 'surya', 'krishna', 'shiva', 'rama', 'arjun', 'raj', 'vijay', 'ajay', 'rahul',
        'amit', 'sanjay', 'sanjai', 'karthik', 'kamal', 'vimal', 'ram', 'lakshman', 'bharath',
        'prakash', 'akash', 'vishnu', 'rishi', 'vikram', 'bala', 'manoj', 'madhav', 'guru',
        'mani', 'ravi', 'hari', 'gopi', 'sakthi', 'jothi', 'thambi', 'giri', 'murari', 'aadi',
        'madhu', 'vasu', 'raghu', 'vignesh', 'venkat', 'sundar', 'naveen', 'prabhu', 'anand',
        'balaji', 'murali', 'ganesh', 'murugan', 'kumar', 'suresh', 'ramesh', 'rajesh', 'dinesh',
        'pandian', 'rathinam', 'velu', 'muthu', 'selvam', 'mani', 'arumugam', 'thirumalai'
    ],
    female: [
        'devi', 'priya', 'kavita', 'kavitha', 'anitha', 'sunita', 'lakshmi', 'divya', 'sneha',
        'meena', 'rani', 'swetha', 'pooja', 'ramya', 'vithya', 'shanthi', 'uma', 'kala', 'maya',
        'anjali', 'preethi', 'deepa', 'selvi', 'malathi', 'pavithra', 'sandhya', 'reka', 'rekha',
        'nandhini', 'shruthi', 'kiruthika', 'gayathri', 'abirami', 'archana', 'bhavani', 'yamuna',
        'kalaivani', 'rajathi', 'malar', 'malarvizhi', 'ponni', 'soundarya', 'keerthana',
        'ishwari', 'parvathi', 'saraswathi', 'bhuvana', 'valli', 'deivanai', 'sharmila', 'kokila'
    ]
};

// Names that can be both genders - skip validation for these
const unisexNames = [
    'arya', 'kiran', 'krishna', 'teja', 'aadi', 'shakti', 'sakthi', 'jothi', 'kavya', 'maya',
    'nikita', 'vihaan', 'viaan', 'samar', 'nehal', 'rishi', 'tejas', 'guru', 'madhu'
];

// Gender Prediction Patterns
const genderSuffixes = {
    female: ['i', 'a', 'ee', 'tha', 'ka', 'ni', 'ya', 'na', 'ma', 'ra', 'shi'],
    male: ['an', 'ar', 'esh', 'ish', 'sh', 'uv', 'av', 'th', 'ool', 'al', 'am', 'aj', 'un']
};

// Initialize floating hearts on page load
// Disabled for Premium Cinema Theme - visual clutter removed
/*
document.addEventListener('DOMContentLoaded', () => {
    createFloatingHearts();
});

// Create floating hearts animation
function createFloatingHearts() {
    const heartsContainer = document.getElementById('floatingHearts');
    const hearts = ['💖', '💕', '💗', '💓', '💝', '🌸', '💞', '♥️'];

    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 15 + 's';
        heart.style.animationDuration = (15 + Math.random() * 10) + 's';
        heart.style.fontSize = (15 + Math.random() * 20) + 'px';
        heartsContainer.appendChild(heart);
    }
}
*/

// Navigation Functions
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startJourney() {
    showScreen('basicInfoScreen');
}

function goBack(screenId) {
    showScreen(screenId);
}

// Validation & Navigation Functions
function goToPersonality() {
    const name = document.getElementById('userName').value.trim();
    const gender = document.querySelector('input[name="gender"]:checked');
    const age = document.getElementById('userAge').value;

    if (!name) {
        showAlert('Please enter your beautiful name! 💫');
        return;
    }
    if (!gender) {
        showAlert('Please select your gender! 🌸');
        return;
    }

    // Name-Gender Validation
    const predicted = predictGenderFromName(name);
    if (predicted && gender.value !== 'other' && predicted !== gender.value) {
        const title = gender.value === 'female' ? 'devi' : 'deva';
        const correction = gender.value === 'female' ? 'female' : 'male';
        showAlert(`Wait a second! Early analysis suggests <strong>${name}</strong> is usually a <strong>${predicted}</strong> name. <br><br>Please select the correct gender or check the name spelling! 🧐`);
        return;
    }

    if (!age || age < 15) {
        showAlert('Children not allowed! 🚫<br><br><strong>"Poi padichi urupadura valiya paruu!"</strong> 📚🥱<br><br>Only adults (15+) can find their match.');
        return;
    }

    userData.name = name;
    userData.gender = gender.value;
    userData.age = age;

    showScreen('personalityScreen');
}

function predictGenderFromName(name) {
    if (!name) return null;
    const lowerName = name.trim().toLowerCase();

    // 0. Skip unisex names
    if (unisexNames.includes(lowerName)) return null;

    // 1. Direct Lookup (Highest Priority)
    if (nameGenderProfiles.male.includes(lowerName)) return 'male';
    if (nameGenderProfiles.female.includes(lowerName)) return 'female';

    // 2. Specific Rule: Common South Indian Male names with 'i'
    // Overriding 'i' rule for specific short patterns
    if (lowerName.length <= 4) {
        const shortMaleSuffixes = ['ani', 'ari', 'adi', 'avi', 'uri', 'thi', 'lli', 'rai'];
        if (shortMaleSuffixes.some(s => lowerName.endsWith(s))) {
            return 'male';
        }
    }

    // 3. Rule: Ends with common Masculine suffixes
    const maleSuffixes = ['an', 'ar', 'esh', 'ish', 'nth', 'ash', 'ram', 'am', 'el', 'aj', 'un', 'raj', 'vel', 'iam'];
    if (maleSuffixes.some(s => lowerName.endsWith(s))) return 'male';

    // 4. Rule: Ends with common Feminine suffixes
    const femSuffixes = ['devi', 'ka', 'tha', 'shree', 'sri', 'shruthi', 'nandhini', 'vathi', 'shini', 'mathi', 'malar', 'sheela'];
    if (femSuffixes.some(s => lowerName.endsWith(s))) return 'female';

    // 5. General rule: 'i' suffix usually female (if not caught by male rules above)
    if (lowerName.endsWith('i') && !lowerName.endsWith('ai')) return 'female';

    // 6. Suffix Analysis (Soft matching from patterns)
    for (const suffix of genderSuffixes.female) {
        if (lowerName.endsWith(suffix)) return 'female';
    }

    for (const suffix of genderSuffixes.male) {
        if (lowerName.endsWith(suffix)) return 'male';
    }

    return null; // Unknown
}

function goToEmotional() {
    const personality = document.querySelector('input[name="personality"]:checked');
    const communication = document.querySelector('input[name="communication"]:checked');
    const lifestyle = document.querySelector('input[name="lifestyle"]:checked');
    const anger = document.querySelector('input[name="anger"]:checked');
    const patience = document.querySelector('input[name="patience"]:checked');

    if (!personality || !communication || !lifestyle || !anger || !patience) {
        showAlert('Please answer all questions to help us understand you better! 💝');
        return;
    }

    userData.personality = personality.value;
    userData.communication = communication.value;
    userData.lifestyle = lifestyle.value;
    userData.anger = anger.value;
    userData.patience = patience.value;

    showScreen('emotionalScreen');
}

function goToLifestyle() {
    const expression = document.querySelector('input[name="expression"]:checked');
    const reassurance = document.querySelector('input[name="reassurance"]:checked');
    const support = document.querySelector('input[name="support"]:checked');

    if (!expression || !reassurance || !support) {
        showAlert('Please share your emotional nature with us! ❤️');
        return;
    }

    userData.expression = expression.value;
    userData.reassurance = reassurance.value;
    userData.support = support.value;

    showScreen('lifestyleScreen');
}

function generateResults() {
    const focus = document.querySelector('input[name="focus"]:checked');
    const routine = document.querySelector('input[name="routine"]:checked');
    const social = document.querySelector('input[name="social"]:checked');
    const value = document.querySelector('input[name="value"]:checked');

    if (!focus || !routine || !social || !value) {
        showAlert('Please complete all lifestyle questions! 🌍');
        return;
    }

    userData.focus = focus.value;
    userData.routine = routine.value;
    userData.social = social.value;
    userData.value = value.value;

    // Generate and display results
    analyzeCompatibility();
    showScreen('resultsScreen');
}

// Alert Function
function showAlert(message) {
    // Create custom alert
    const alertDiv = document.createElement('div');
    alertDiv.className = 'custom-alert';
    alertDiv.innerHTML = `
        <div class="alert-content">
            <span class="alert-icon">💖</span>
            <p>${message}</p>
            <button onclick="this.parentElement.parentElement.remove()">Okay</button>
        </div>
    `;

    // Add styles dynamically
    alertDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;

    const content = alertDiv.querySelector('.alert-content');
    content.style.cssText = `
        background: white;
        padding: 30px 40px;
        border-radius: 20px;
        text-align: center;
        max-width: 350px;
        box-shadow: 0 20px 60px rgba(199, 21, 133, 0.3);
    `;

    const icon = alertDiv.querySelector('.alert-icon');
    icon.style.cssText = `
        font-size: 40px;
        display: block;
        margin-bottom: 15px;
    `;

    const p = alertDiv.querySelector('p');
    p.style.cssText = `
        color: #4A4A4A;
        margin-bottom: 20px;
        line-height: 1.6;
    `;

    const btn = alertDiv.querySelector('button');
    btn.style.cssText = `
        background: linear-gradient(135deg, #FFB6C1, #FF85A2);
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 25px;
        font-size: 1rem;
        cursor: pointer;
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
    `;

    document.body.appendChild(alertDiv);
}

// Compatibility Analysis Engine
function analyzeCompatibility() {
    const result = generateCompatibilityProfile();
    displayResults(result);
}

function generateCompatibilityProfile() {
    const profile = {
        insight: '',
        partnerTraits: [],
        matchReason: '',
        avoidTraits: [],
        finalMessage: ''
    };

    // Analyze personality type
    const personalityDescriptions = {
        calm: 'a calm and peaceful soul who values tranquility and harmony',
        emotional: 'an emotionally expressive person who feels deeply and loves passionately',
        confident: 'a confident and bold individual who knows what you want',
        sensitive: 'a sensitive and caring heart who notices the little things'
    };

    // Generate insight based on personality
    profile.insight = `Based on your personality and habits, you are ${personalityDescriptions[userData.personality]}. `;

    // Add communication style insight
    if (userData.communication === 'talkative') {
        profile.insight += `You express yourself openly and enjoy meaningful conversations. `;
    } else {
        profile.insight += `You prefer thoughtful silence and deep connection over constant chatter. `;
    }

    // Add emotional insight
    if (userData.expression === 'open') {
        profile.insight += `Your heart is an open book, and you value partners who appreciate emotional honesty.`;
    } else {
        profile.insight += `You keep your deepest feelings protected, sharing them only with those who earn your trust.`;
    }

    // Generate partner traits based on user profile
    profile.partnerTraits = generatePartnerTraits();

    // Generate match reason
    profile.matchReason = generateMatchReason();

    // Generate traits to avoid
    profile.avoidTraits = generateAvoidTraits();

    // Generate final message
    profile.finalMessage = generateFinalMessage();

    return profile;
}

function generatePartnerTraits() {
    const traits = [];

    // Based on personality
    const personalityMatch = {
        calm: [
            'Someone emotionally warm and expressive to balance your peaceful nature',
            'A partner who brings gentle excitement without chaos',
            'Someone who appreciates quiet moments together'
        ],
        emotional: [
            'A stable, grounded partner who provides security',
            'Someone patient who understands your emotional depth',
            'A partner who listens without judgment'
        ],
        confident: [
            'Someone equally confident who matches your energy',
            'A partner who supports your ambitions and dreams',
            'Someone secure who celebrates your success'
        ],
        sensitive: [
            'A gentle, understanding soul who protects your heart',
            'Someone who communicates with kindness and care',
            'A partner who notices and appreciates your thoughtfulness'
        ]
    };

    traits.push(...personalityMatch[userData.personality]);

    // Based on communication style
    if (userData.communication === 'talkative') {
        traits.push('A good listener who values your thoughts and opinions');
    } else {
        traits.push('Someone who understands comfortable silences and non-verbal connection');
    }

    // Based on emotional need
    if (userData.reassurance === 'often') {
        traits.push('An affectionate partner who expresses love frequently');
    } else if (userData.reassurance === 'sometimes') {
        traits.push('Someone who shows love through both words and actions');
    } else {
        traits.push('An independent partner who gives you space to grow');
    }

    return traits;
}

function generateMatchReason() {
    let reason = '';

    // Personality-based reasoning
    const reasons = {
        calm: 'Your calm nature creates a peaceful foundation for any relationship. You need someone who adds warmth without disrupting your inner peace. ',
        emotional: 'Your emotional depth is a gift that requires a partner who can appreciate the intensity of your feelings. ',
        confident: 'Your confidence is magnetic, and you thrive with a partner who can stand beside you as an equal. ',
        sensitive: 'Your sensitivity makes you incredibly attuned to your partner\'s needs, and you deserve someone equally considerate. '
    };

    reason += reasons[userData.personality];

    // Support-based reasoning
    if (userData.support === 'very') {
        reason += 'Emotional connection is your love language - you feel most loved when your partner truly understands and supports you.';
    } else if (userData.support === 'moderate') {
        reason += 'You value a balanced relationship where both partners support each other while maintaining individuality.';
    } else {
        reason += 'You appreciate independence in love, where trust speaks louder than constant reassurance.';
    }

    return reason;
}

function generateAvoidTraits() {
    const avoid = [];

    // Based on personality
    const personalityAvoid = {
        calm: [
            'Highly aggressive or dominating personalities',
            'People who thrive on drama and conflict',
            'Partners who dismiss your need for peace'
        ],
        emotional: [
            'Cold, emotionally unavailable personalities',
            'People who mock or minimize feelings',
            'Partners who avoid emotional conversations'
        ],
        confident: [
            'Controlling partners who feel threatened by your success',
            'People who constantly compete rather than collaborate',
            'Partners with low self-esteem who drain your energy'
        ],
        sensitive: [
            'Harsh, critical personalities',
            'People who are dismissive of feelings',
            'Partners who use your sensitivity against you'
        ]
    };

    avoid.push(...personalityAvoid[userData.personality]);

    // Based on patience level
    if (userData.patience === 'patient') {
        avoid.push('Those who take advantage of your patience without growth');
    } else {
        avoid.push('Partners who are passive-aggressive or avoid direct communication');
    }

    return avoid;
}

function generateFinalMessage() {
    const messages = {
        trust: 'Love grows best where trust blooms freely. The right person will make loyalty feel natural, not forced. Your heart deserves someone who chooses you every single day. 💖',
        passion: 'May you find a love that sets your soul on fire while keeping your heart safe. Passion with purpose is the most beautiful kind of love. 🔥💕',
        understanding: 'The deepest connections are built on understanding. Your perfect match will hear what you don\'t say and love what you don\'t show. 💝',
        adventure: 'Love is the greatest adventure of all. May you find someone who explores life with you, creating beautiful memories at every turn. 🌟'
    };

    return messages[userData.value] + `\n\nRemember, ${userData.name}, you are worthy of the love you seek. Trust the journey, and let your heart guide you home. 🌸`;
}

function displayResults(result) {
    // Set name
    document.getElementById('resultName').textContent = userData.name;

    // Set personality insight
    document.getElementById('personalityInsight').innerHTML = `<p>${result.insight}</p>`;

    // Set partner traits
    const partnerList = document.getElementById('partnerTraits');
    partnerList.innerHTML = result.partnerTraits.map(trait => `<li>${trait}</li>`).join('');

    // Set match reason
    document.getElementById('matchReason').textContent = result.matchReason;

    // Set avoid traits
    const avoidList = document.getElementById('avoidTraits');
    avoidList.innerHTML = result.avoidTraits.map(trait => `<li>${trait}</li>`).join('');

    // Set final message
    document.getElementById('finalMessage').textContent = result.finalMessage;

    // Add Funny Tamil Remark
    injectFunnyRemark('personalityFunnyRemark');
}

// Restart Quiz
function restartQuiz() {
    // Reset user data
    userData = {
        name: '',
        gender: '',
        age: '',
        personality: '',
        communication: '',
        lifestyle: '',
        anger: '',
        patience: '',
        expression: '',
        reassurance: '',
        support: '',
        focus: '',
        routine: '',
        social: '',
        value: ''
    };

    // Reset all form inputs
    document.querySelectorAll('input[type="text"], input[type="number"]').forEach(input => {
        input.value = '';
    });

    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });

    // Go to welcome screen
    showScreen('welcomeScreen');
}
// ==================== COUPLE CALCULATOR LOGIC ====================

function startCoupleCalculator() {
    showScreen('coupleScreen');
}

function calculateLove() {
    const maleName = document.getElementById('maleName').value.trim();
    const femaleName = document.getElementById('femaleName').value.trim();

    if (!maleName || !femaleName) {
        showAlert('Please enter both names for the cosmic calculation! ❤️');
        return;
    }

    // Name-Gender Validation for Couple Calculator
    const malePredicted = predictGenderFromName(maleName);
    const femalePredicted = predictGenderFromName(femaleName);

    if (malePredicted === 'female') {
        showAlert(`Are you sure <strong>${maleName}</strong> is His name? It sounds like a female name! 🌸`);
        return;
    }

    if (femalePredicted === 'male') {
        showAlert(`Are you sure <strong>${femaleName}</strong> is Her name? It sounds like a male name! 🦁`);
        return;
    }

    // Special Check for Deva/Devi specifically as requested
    if (maleName.toLowerCase() === 'devi' || femaleName.toLowerCase() === 'deva') {
        showAlert(`Oops! Usually <strong>Devi</strong> is a female name and <strong>Deva</strong> is a male name. Please check your inputs! 🧐`);
        return;
    }

    // 1. Calculate Numerology Numbers
    const maleNum = calculateNameNumber(maleName);
    const femaleNum = calculateNameNumber(femaleName);
    const combinedNum = reduceToSingleDigit(maleNum + femaleNum);

    // 2. Determine Love Percentage
    // Basic algorithm: base percentage + name length factor + numerology harmony
    let basePercent = 60 + (combinedNum * 3);
    if (basePercent > 99) basePercent = 99;

    // Add some "random" but deterministic variation based on name lengths
    const lenFactor = (maleName.length + femaleName.length) % 10;
    let finalPercent = basePercent + lenFactor;
    if (finalPercent > 100) finalPercent = 100;
    if (finalPercent < 40) finalPercent = 45; // Minimum love!

    // 3. Update Results UI
    document.getElementById('resultMaleName').textContent = maleName;
    document.getElementById('resultFemaleName').textContent = femaleName;
    document.getElementById('maleNumber').textContent = maleNum;
    document.getElementById('femaleNumber').textContent = femaleNum;
    document.getElementById('coupleNumber').textContent = combinedNum;

    // 4. Generate Analysis & Advice
    const advice = generateNumerologyAdvice(combinedNum, maleName, femaleName, finalPercent);

    document.getElementById('compatibilityText').textContent = advice.analysis;
    document.getElementById('strengthsText').textContent = advice.strengths;
    document.getElementById('challengesText').textContent = advice.challenges;
    document.getElementById('loveStoryText').textContent = advice.loveStory;

    const tipsList = document.getElementById('adviceTips');
    tipsList.innerHTML = advice.tips.map(tip => `<li>${tip}</li>`).join('');

    // Add Funny Tamil Remark
    injectFunnyRemark('coupleFunnyRemark', finalPercent);

    // 5. Show Screen & Animate
    showScreen('coupleResultsScreen');

    // Trigger animations after a short delay
    setTimeout(() => {
        updateLoveMeter(finalPercent);
        updateConnectionBars(finalPercent);
    }, 300);

    // 6. Save to Firebase (if user is logged in)
    if (typeof saveTestResult === 'function') {
        saveTestResult({
            type: 'couple',
            partnerName: `${maleName} & ${femaleName}`,
            score: finalPercent,
            dialogue: document.querySelector('#coupleFunnyRemark .funny-comment')?.textContent || '',
            numerology: {
                male: maleNum,
                female: femaleNum,
                combined: combinedNum
            }
        }).catch(err => console.log('Save skipped:', err));
    }
}

// Helper: Map name to numerology number (Pythagorean system)
function calculateNameNumber(name) {
    const nameLower = name.toLowerCase().replace(/[^a-z]/g, '');
    let sum = 0;

    for (let i = 0; i < nameLower.length; i++) {
        // Simple A=1, B=2 ... reduction
        const charCode = nameLower.charCodeAt(i) - 96;
        sum += (charCode % 9 === 0) ? 9 : (charCode % 9);
    }

    return reduceToSingleDigit(sum);
}

function reduceToSingleDigit(num) {
    while (num > 9) {
        num = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    return num;
}

// Love Meter Animation
function updateLoveMeter(percent) {
    const circle = document.getElementById('loveCircle');
    const percentText = document.getElementById('lovePercent');

    // dasharray is 534 (2 * PI * 85)
    const offset = 534 - (534 * percent / 100);
    circle.style.strokeDashoffset = offset;

    // Counter animation
    let current = 0;
    const interval = setInterval(() => {
        if (current >= percent) {
            clearInterval(interval);
        } else {
            current++;
            percentText.textContent = current;
        }
    }, 20);
}

// Connection Bars Animation
function updateConnectionBars(totalLove) {
    const types = ['emotional', 'mental', 'spiritual', 'physical'];

    types.forEach((type, index) => {
        // Generate values slightly different from total but related
        const variation = (Math.sin(totalLove + index) * 10).toFixed(0);
        let barPercent = parseInt(totalLove) + parseInt(variation);
        if (barPercent > 100) barPercent = 100;
        if (barPercent < 30) barPercent = 35;

        const bar = document.getElementById(`${type}Bar`);
        const text = document.getElementById(`${type}Percent`);

        bar.style.width = barPercent + '%';
        text.textContent = barPercent + '%';
    });
}

function generateNumerologyAdvice(num, male, female, percent) {
    const data = {
        1: {
            analysis: "Your relationship vibrates with the energy of new beginnings and leadership. You are a 'Power Couple' who can conquer the world together.",
            strengths: "Ambition, mutual respect, and a shared vision for the future.",
            challenges: "Potential ego clashes. Remember that a relationship is a partnership, not a competition.",
            tips: ["Support each other's independence", "Celebrate each other's wins", "Practice active listening"],
            loveStory: `The universe sees ${male} and ${female} as a force of nature. Your love is bold and bright!`
        },
        2: {
            analysis: "Your connection is deeply emotional and intuitive. You bring peace and balance to each other's lives.",
            strengths: "Sensitivity, kindness, and deep emotional understanding.",
            challenges: "Over-sensitivity to moods. Don't be afraid to speak your truth gently.",
            tips: ["Create a peaceful home environment", "Express gratitude daily", "Share your feelings openly"],
            loveStory: `In the dance of life, ${male} and ${female} move in perfect harmony. You are each other's sanctuary.`
        },
        3: {
            analysis: "Social, creative, and joyful! Your relationship is filled with laughter and self-expression.",
            strengths: "Communication, creativity, and a great sense of humor.",
            challenges: "Staying focused on long-term goals. Don't let the fun distract from growth.",
            tips: ["Try new hobbies together", "Keep the romance alive with surprises", "Communicate during small issues"],
            loveStory: `Life is a celebration for ${male} and ${female}. Your love lights up every room you enter!`
        },
        4: {
            analysis: "Built on a rock-solid foundation of trust and stability. You are the ultimate team.",
            strengths: "Loyalty, reliability, and practical support.",
            challenges: "Getting stuck in a routine. Remember to add some spice to your daily life.",
            tips: ["Go on spontaneous dates", "Focus on emotional expression", "Appreciate the security you share"],
            loveStory: `${male} and ${female} share a love as timeless as the stars. Your bond is built to last forever.`
        },
        5: {
            analysis: "Adventurous, dynamic, and full of change! You keep each other on your toes.",
            strengths: "Freedom, excitement, and adaptability.",
            challenges: "Restlessness. Finding stability together while maintaining your freedom.",
            tips: ["Travel together often", "Give each other space to grow", "Focus on consistency in love"],
            loveStory: `A wild adventure awaits ${male} and ${female}. Your love is a journey without a map, filled with wonder!`
        },
        6: {
            analysis: "The energy of nurturing and home. You share a deeply caring and protective love.",
            strengths: "Compassion, responsibility, and beautiful family values.",
            challenges: "Taking on too much responsibility. Balance giving and receiving love.",
            tips: ["Nurture your self-love too", "Create beautiful memories at home", "Support each other's family ties"],
            loveStory: `${male} and ${female} were born to care for each other. Your love is a warm embrace that never ends.`
        },
        7: {
            analysis: "A soul-deep spiritual connection. You understand each other's unspoken thoughts.",
            strengths: "Intellectual depth, wisdom, and spiritual alignment.",
            challenges: "Becoming too isolated. Remember to connect with the outside world too.",
            tips: ["Meditate or reflect together", "Share your dreams and visions", "Trust your intuition about each other"],
            loveStory: `The bond between ${male} and ${female} transcends the physical. You are two souls finally reunited.`
        },
        8: {
            analysis: "A relationship of abundance and power. Together, you can achieve great material and spiritual success.",
            strengths: "Strength, efficiency, and a drive for excellence.",
            challenges: "Work-life balance. Don't let career goals overshadow your romance.",
            tips: ["Manifest your goals together", "Keep your home a work-free zone", "Show affection through small gestures"],
            loveStory: `${male} and ${female} are a majestic pair. Your love is an empire built on respect and ambition.`
        },
        9: {
            analysis: "Universal love and humanitarian spirit. You inspire everyone around you with your bond.",
            strengths: "Selflessness, broad vision, and unconditional love.",
            challenges: "Letting go of the past. Focus on the beautiful present you share.",
            tips: ["Engage in charity together", "Focus on forgiveness", "Evolve together through every stage"],
            loveStory: `${male} and ${female} share a love that heals. You are a beacon of hope and kindness for the world.`
        }
    };

    return data[num] || data[1];
}

// ==================== FUNNY TAMIL REMARKS ====================

const funnyTamilComments = [
    { comment: "உனக்கு கதை லைஃப் கெட்டி டா! 🤝", subtitle: "Your story life is strong! You're gonna settle nicely." },
    { comment: "ராஜா ராணி ஆர்யா & நயன்தாரா மாதிரி மாஸ் ஜோடி நீங்க! 👑", subtitle: "A mass couple like Arya & Nayanthara from Raja Rani!" },
    { comment: "பார்த்தா பவர் ஸ்டார், பேசினா பவர் கட்! கவனமா இருங்க! ⚡", subtitle: "Looks like a power star, but speaks like a power cut! Be careful!" },
    { comment: "உனக்கு வர்றது தேவதை இல்ல, உன்ன திருத்த வந்த சித்ரகுப்தன்! 😈", subtitle: "The one coming for you isn't an angel, it's a social corrector!" },
    { comment: "உன் லவ் ஸ்டோரி குஷி விஜய் மாதிரி இருக்கும், ஆனா கிளைமாக்ஸ் கில்லி மாதிரி! 🏃‍♂️", subtitle: "Your love story will be like Kushi Vijay, but the climax like Ghilli!" },
    { comment: "நீ என் WiFi போல இருக்கிறாய், நான் நீங்காம இருக்க முடியாது. 📶", subtitle: "You are like my WiFi, I can't be without you." },
    { comment: "உனக்கு பெயர் Google இல்லைனா? என்ன தேடினாலும் நீ தான் கிடைக்கிறாய்! 🔍", subtitle: "Is your name Google? Because I find you in everything I search!" },
    { comment: "உன் சிரிப்பில் என் வாழ்க்கை மலர்கிறது, என் பர்ஸ் காலியாகிறது! 💸", subtitle: "Your smile makes my life bloom and my wallet empty!" },
    { comment: "நீ என் இதயத்தை கொள்ளை கொண்டாய், போலீஸுக்கு கால் பண்ணலாமா? 👮‍♂️", subtitle: "You stole my heart, should I call the police!" },
    { comment: "என் உலகமே நீ தான் என்றால், நான் ஏன் வேலைக்கு போகணும்? 😴", subtitle: "If you are my world, why should I even go to work!" },
    { comment: "உன் அழகு என் கண்ணு கூசுது, சன் கிளாஸ் போடலாமா? 😎", subtitle: "Your beauty dazzles me, should I wear sunglasses!" },
    { comment: "நீ என் வாழ்க்கையில வந்த பிறகுதான் செலவு அதிகமாயிடுச்சு! 📈", subtitle: "My expenses skyrocketed only after you entered my life!" },
    { comment: "நீ இல்லாமல் என் வாழ்க்கை உப்பு இல்லா குழம்பு போல சப்புன்னு இருக்கு! 🍲", subtitle: "Life without you is bland like curry without salt!" },
    { comment: "என் இதயத்துல நீ மட்டும் தான் இருக்க, வாடகை ஏதும் கேட்க மாட்டேன்! 🏠", subtitle: "Only you are in my heart, and I won't ask for rent!" },
    { comment: "நீ என் கனவுல கூட வர்ற, என்ன தூங்க விட மாட்டியா? 🛌", subtitle: "You even come in my dreams, won't you let me sleep?" },
    { comment: "உன் காதல் சைக்கிள் ஓட்டுற மாதிரி, பேலன்ஸ் தப்பினால் அவ்வளவுதான்! 🚲", subtitle: "Your love is like cycling, if you lose balance, it's over!" },
    { comment: "என் லவ் ஸ்டோரி ஒரு படம் மாதிரி, நான் வெறும் டிக்கெட் கலெக்டர் தான்! 🎟️", subtitle: "My love story is a movie, and I'm just the ticket collector!" },
    { comment: "என் மனசுல இடம் கொடுத்தா, நீ மொத்த வீடையும் ஆக்கிரமிச்சுட்ட! 🏰", subtitle: "I gave you an inch, and you took the whole mile (and the house)!" },
    { comment: "நீ இல்லாட்டி என் போன் கூட சார்ஜ் ஆகாது! 🔌", subtitle: "Without you, even my phone won't charge!" },
    { comment: "உன்ன பார்த்தா என் இதயத் துடிப்பு எகிறிடுது, ஈ.சி.ஜி எடுக்கணுமோ? 💓", subtitle: "My heart rate shoots up when I see you, do I need an ECG?" },
    { comment: "நீ என் காபி, உன்னைக் குடிச்சாதான் நான் ஃப்ரெஷ் ஆவேன்! ☕", subtitle: "You are my coffee, I only feel fresh with you!" },
    { comment: "உன் அழகு ஒரு மேஜிக் மாதிரி, பார்க்க பார்க்க வியக்கிறேன்! ✨", subtitle: "Your beauty is like magic, I'm always amazed!" },
    { comment: "என் வாழ்க்கை ஒரு கேள்விக்குறி, நீ தான் அதுக்கு பதில்! ❓", subtitle: "My life is a question mark, and you are the answer!" },
    { comment: "உன்ன பார்த்தா வாயே பேச மாட்டேங்குது, அவ்வளவு ரசிக்கிறேன்! 🤐", subtitle: "I'm so lost in admiring you that I've lost my words!" },
    { comment: "ஏன் இவ்வளவு அழகா இருக்க? எனக்கு தூக்கமே வரல! 🦉", subtitle: "Why are you so beautiful? I've lost my sleep!" },
    { comment: "உன் நினைப்பு என் மனசுல ஒரு குத்தூசி மாதிரி குத்திக்கிட்டே இருக்கு! 📍", subtitle: "Your thoughts are like a needle, constantly poking my mind!" },
    { comment: "உன்ன பார்த்தா என் மூளை வேலை செய்றதை நிறுத்திடுது! 🧠", subtitle: "My brain stops working whenever I look at you!" },
    { comment: "உன் காதல் ஒரு போதை மாதிரி, என்ன அடிமையாக்கிடுச்சு! 🥴", subtitle: "Your love is like an addiction, I'm hooked!" },
    { comment: "உன் ஒரு பார்வை போதும், என் நாள் சூப்பரா போகும்! 🌅", subtitle: "One look from you is enough to make my day!" },
    { comment: "நீ என் வாழ்க்கைல வந்ததே ஒரு பெரிய ட்விஸ்ட் தான்! 🔄", subtitle: "Your entry into my life was the ultimate plot twist!" },
    { comment: "உன் சிரிப்பு ஒரு மருந்து, ஆனா சைடு எஃபெக்ட்ஸ் அதிகம்! 💊", subtitle: "Your smile is a medicine with too many side effects!" },
    { comment: "உன்ன காதலிக்கிறது என் டெஸ்டினி, மாத்தவே முடியாது! 🏹", subtitle: "Loving you is my destiny, it's unchangeable!" },
    { comment: "உன் குரல் கேட்க என் போன் பில் எகிறிடுது! 💸", subtitle: "My phone bill explodes just from hearing your voice!" },
    { comment: "என் காதல் ஒரு ஓட்டை பாத்திரம் மாதிரி, எவ்வளவு அன்புனாலும் பத்தாது! 🏺", subtitle: "My love is like a leaky pot, it can never be filled enough!" },
    { comment: "நீ என் பாஸ்வேர்ட் மாதிரி, மறக்கவே முடியாது! 🔐", subtitle: "You are like my password, unforgettable!" },
    { comment: "என் வாழ்க்கை ஒரு சமையல், நீ தான் அதுக்கு மசாலா! 🌶️", subtitle: "My life is a dish, and you are the spice!" },
    { comment: "உன்ன பார்த்தா ஜிம்முக்கு போறதையே மறந்துடுறேன்! 💪", subtitle: "I even forget my gym sessions when I'm looking at you!" },
    { comment: "என் காதல் ஒரு பேய் மாதிரி, என்ன விடவே மாட்டேங்குது! 👻", subtitle: "My love is like a ghost, it won't stop haunting me!" },
    { comment: "நீ என் செல்பி ஸ்டிக் மாதிரி, எப்பவும் கூடவே இருக்கணும்! 🤳", subtitle: "You are my selfie stick, always by my side!" },
    { comment: "உன் கண்கள் என்னை மயக்குது, என்ன பண்ண போறியோ? 👁️", subtitle: "Your eyes are hypnotizing me, what's your plan?" },
    { comment: "நீ இல்லாம எனக்கு காதல் இல்ல! ❤️", subtitle: "There's no love for me without you!" },
    { comment: "நீ தான் என் தேவதை, ஆனா சிறகு மட்டும் தான் இல்ல! 🧚‍♀️", subtitle: "You are my angel, just missing the wings!" },
    { comment: "உன் ஒரு மெசேஜ் போதும், என் டேட்டா காலி ஆகிடும்! 📱", subtitle: "One message from you is enough to finish my data!" },
    { comment: "உன்ன பார்த்தா என் ஸ்டேட்டஸ் தானா மாறிடுது! 💘", subtitle: "My status changes automatically when I see you!" },
    { comment: "நீ என் அலாரம் மாதிரி, என்ன தூங்க விட மாட்டேங்குற! ⏰", subtitle: "You're like my alarm, you won't let me sleep!" },
    { comment: "உன் காதல் வைபை சிக்னல் மாதிரி, வீக்கா இருந்தாலும் விட முடியாது! 📶", subtitle: "Your love is like a weak WiFi signal, I still can't let go!" },
    { comment: "நான் உன்னை தொந்தரவு பண்ணல, உன் கவனத்தை ஈர்க்கிறேன்! 😉", subtitle: "I'm not bothering you, I'm just capturing your attention!" },
    { comment: "செல்லக்குட்டி, நீ தான் என் உலகம்! 🌎", subtitle: "Darling, you are my whole world!" },
    { comment: "அழகே, உன்ன பார்த்தா எல்லாமே மறந்துடுது! 😍", subtitle: "Beauty, I forget everything when I see you!" },
    { comment: "உன்னோட நம்பர் என்ன? என் ஹார்ட்ல சேவ் பண்ணிக்கலாமா? 📞", subtitle: "What's your number? Can I save it in my heart?" },
    { comment: "நீ ஒரு சாக்லேட் மாதிரி, பார்க்கவும் இனிப்பு, பேசவும் இனிப்பு! 🍫", subtitle: "You're like a chocolate, sweet to look at and sweet to talk to!" },
    { comment: "என் உலகத்துல நீ தான் ஒரே கலர்! 🎨", subtitle: "You are the only color in my world!" },
    { comment: "உன் கோபம் கூட அழகா இருக்கு, ஆனா ரொம்ப நேரம் இருக்காத! 💢", subtitle: "Even your anger is cute, but don't stay mad for long!" },
    { comment: "நான் எப்பவும் உன்னுடையவன் தான்! ♾️", subtitle: "I am yours forever!" },
    { comment: "என் உயிரே, நீ இல்லாம நான் இல்ல! 🧬", subtitle: "My soul, I'm nothing without you!" },
    { comment: "என் அன்பே, உனக்காக எதையும் செய்வேன்! 💖", subtitle: "My dear, I'd do anything for you!" },
    { comment: "உன் கண்ணுல நான் விழுந்துட்டேன், தூக்கி விட ஆள் இல்ல! 🕳️", subtitle: "I fell into your eyes and there's no one to pull me out!" },
    { comment: "நீ என் மனசுல திருடிட்ட, ஆனா போலீஸ் கிட்ட சொல்ல மாட்டேன்! 🕵️‍♀️", subtitle: "You stole my heart, but I won't report it to the police!" },
    { comment: "என் வாழ்க்கை ஒரு டயலாக், நீ தான் அதுக்கு பஞ்ச்! 👊", subtitle: "My life is a dialogue and you are the punchline!" },
    { comment: "நீ என் டிபி மாதிரி, அடிக்கடி பார்த்துகிட்டே இருப்பேன்! 🖼️", subtitle: "You're like my profile picture, I keep looking at you!" },
    { comment: "உன் நினைப்பு ஒரு பாட்டு மாதிரி, மனசுல ஓடிக்கிட்டே இருக்கு! 🎶", subtitle: "Your memory is like a song, playing on loop in my mind!" },
    { comment: "உன்ன நினைச்சா என் பல்ஸ் ஏறிடுது! 💓", subtitle: "My pulse races just thinking about you!" },
    { comment: "காதல் சுவையான உணவு, ஆனா சமைக்கிறது தான் கஷ்டம்! 🍳", subtitle: "Love is tasty food, but cooking it is the hard part!" },
    { comment: "ரிலேஷன்ஷிப் வாட்ஸ்அப் குரூப் மாதிரி, யாரும் படிக்க மாட்டாங்க! 💬", subtitle: "Relationships are like WhatsApp groups, no one really reads!" },
    { comment: "காதல் ஒரு விளையாட்டு, ஆனா ரூல்ஸ் மட்டும் மாறிக்கிட்டே இருக்கும்! 🎮", subtitle: "Love is a game where the rules keep changing!" },
    { comment: "என் காதலி டெரரிஸ்ட் மாதிரி, பயமுறுத்தியே வாழ வைக்கிறா! 🔫", subtitle: "My girl is like a terrorist, keeping me alive with fear!" },
    { comment: "காதல் ஒரு பெரிய லெட்டர், ஆனா ஸ்பெல்லிங் மிஸ்டேக் அதிகம்! ✉️", subtitle: "Love is a long letter with too many spelling mistakes!" },
    { comment: "திருமணம் ஒரு லாங் டெர்ம் சிறைத்தண்டனை! ⛓️", subtitle: "Marriage is a long-term prison sentence (playfully)!" },
    { comment: "லவ் பண்ணா மண்டை காலியாகிடும், ஜாக்கிரதை! 🤯", subtitle: "Careful, falling in love might empty your brain!" },
    { comment: "லவ் பண்றது ஈசி, மெயின்டெய்ன் பண்றது தான் கஷ்டம்! 🛠️", subtitle: "Loving is easy, maintenance is the tough part!" },
    { comment: "காதல் ஒரு சினிமா டிக்கெட் மாதிரி, ஒரு முறை தான் எடுக்க முடியும்! 🎬", subtitle: "Love is like a movie ticket, you only get it once!" },
    { comment: "என்ன கொடுமை சரவணன் இது! லவ்வுல இப்படி ஆகிடுச்சே! 🤦‍♂️", subtitle: "What a tragedy, Saravanan! Look what love did!" },
    { comment: "வாயை மூடுடா குரங்கு! ஆனா உன்ன எனக்கு பிடிச்சிருக்கு! 🐒", subtitle: "Shut up, monkey! But I still like you!" },
    { comment: "மச்சான், நீ ரொம்ப சூப்பர்! ஆனா லவ்வுல வீக்கு! 🍺", subtitle: "Buddy, you're super! But weak in the love department!" },
    { comment: "நீ இல்லனா நான் ஒரு ஜீரோ தான்! 0️⃣", subtitle: "Without you, I'm just a zero!" },
    { comment: "என் லைஃப் ஒரு சர்க்கஸ், நீ தான் அங்க கோமாளி! 🤡", subtitle: "My life is a circus and you are the clown!" },
    { comment: "உன் கூட இருந்தா டைம் பறக்குது, தனியா இருந்தா ஊர் சுத்துது! ⏳", subtitle: "Time flies with you, but drags when I'm alone!" },
    { comment: "நீ என் வாட்ஸ்அப் டிபி மாதிரி, அடிக்கடி மாறிக்கிட்டே இருக்க! 🤳", subtitle: "You change like my WhatsApp DP, constantly shifting!" },
    { comment: "நான் உன்னை விட்டுட்டு போக மாட்டேன், பயப்படாத! 🤝", subtitle: "I won't leave you, don't be afraid!" },
    { comment: "என் கனவுல கூட நீ தான் மிட்டாய்! 🍭", subtitle: "Even in my dreams, you're the only candy!" },
    { comment: "உன் கண்கள் பேசுறது எனக்கு புரியுது! 🤐", subtitle: "I understand what your eyes are saying!" },
    { comment: "அன்பு பண்ணா மட்டும் தான் நீ என்னை தேடுவ! 💝", subtitle: "You search for me only because of your love!" },
    { comment: "உன் சிரிப்பு தான் என் கவிதை! 📖", subtitle: "Your smile is my poetry!" },
    { comment: "நீயே என் எல்லாமும், வேற எதுவும் வேணாம்! ✨", subtitle: "You are my everything, I need nothing else!" },
    { comment: "நீயே என்னை முழுமையாக்கினாய்! 🧩", subtitle: "You complete me!" },
    { comment: "என் வாழ்க்கையையே நீ தான் ஒளிர்விக்கிறாய்! 💡", subtitle: "You are the one lighting up my whole life!" },
    { comment: "நீ இல்லாத வாழ்க்கையை நினைக்கவே முடியல! 🙅‍♂️", subtitle: "I can't even imagine a life without you!" },
    { comment: "நீ என் உயிர், உனக்காக வாழ்வேன்! ❤️", subtitle: "You are my life, I live for you!" },
    { comment: "கல்யாணம் பண்ணா தான் காதலோட அருமை புரியும்! 👰", subtitle: "You only realize the value of love after marriage!" },
    { comment: "லவ் ஒரு போதை, அதுல விழுந்தா மீள முடியாது! 😵", subtitle: "Love is an intoxication, once in, you're stuck!" },
    { comment: "உன் பேச்சு தேன் மாதிரி இனிக்குது! 🍯", subtitle: "Your talk is sweet as honey!" },
    { comment: "நீ என் பர்ஸ்ல இருக்கிற போட்டோ மாதிரி! 📸", subtitle: "You're like the photo in my wallet!" },
    { comment: "என் ஒவ்வொரு மூச்சும் உன்னத்தான் சொல்லுது! 💨", subtitle: "Every breath I take says your name!" },
    { comment: "உன்னோட ஒரு முத்தம் போதும், வானத்துல பறப்பேன்! 💋", subtitle: "One kiss from you and I'll fly to the sky!" },
    { comment: "நீ என் லைஃப்ல கிடைச்ச பொக்கிஷம்! 💎", subtitle: "You are a treasure I found in my life!" },
    { comment: "உன் அன்பு ஒரு கடல், நான் அதுல ஒரு துளி! 🌊", subtitle: "Your love is an ocean and I'm just a drop!" },
    { comment: "நீ இல்லாம என் உலகம் இருட்டா இருக்கு! 🌑", subtitle: "Without you, my world is dark!" },
    { comment: "உன் நினைப்புல தான் என் ஒவ்வொரு நாளும் தொடங்குது! 🌅", subtitle: "My every day starts with your thought!" },
    { comment: "காதல் ஒரு வரம், அது உனக்கு கிடைச்சிருக்கு! 🎁", subtitle: "Love is a blessing, and you've got it!" },
    { comment: "நீ தான் என் ராஜா/ராணி! 👑", subtitle: "You are my King/Queen!" }
];

const movieCoupleComments = [
    // 90-100% Range - Legendary Love
    { threshold: 97, remark: "நீங்க தான் அடுத்த டைட்டானிக் ஜாக் & ரோஸ்! (ஆனா கப்பல் முழுகாதுப்பா! 🚢)", performance: "Legendary Love! 🏆" },
    { threshold: 95, remark: "குஷி விஜய் & ஜோதிகா மாதிரி! உங்க லவ் வெட்டி டு வின் தான்! 🎯", performance: "Pure Magic! ✨" },
    { threshold: 93, remark: "ரோமியோ ஜூலியட் ஜெயம் ரவி & ஹன்சிகா மாதிரி! கனக்கத் தெரியுது! 💖", performance: "Cinema Perfect! 🎬" },
    { threshold: 91, remark: "ராஜா ராணி ஆர்யா & நயன்தாரா மாதிரி மாஸ் ஜோடி நீங்க! 👑", performance: "Royal Pair! 👑" },

    // 80-90% Range - Excellent Match
    { threshold: 88, remark: "செச்சின் விஜய் & ஜெனிலியா மாதிரி! சீக்கிரம் கல்யாணம் செய்யுங்க! 💐", performance: "Blockbuster Love! 🎉" },
    { threshold: 86, remark: "திருச்சிற்றம்பலம் தனுஷ் & நித்யா மேனன் மாதிரி! பெஸ்ட் ஃப்ரெண்ட்ஸ் டு லவர்ஸ்! 💑", performance: "Friendship Goals! 🤝" },
    { threshold: 84, remark: "காதல் கண்ட விஜய் & சிம்ரன் மாதிரி இருக்கு! பர்ஃபெக்ட் மேட்ச்! 😍", performance: "Evergreen Love! 🌿" },
    { threshold: 82, remark: "96 விஜய் சேதுபதி & த்ரிஷா மாதிரி! நோஸ்டால்ஜியா இருக்கு! 📷", performance: "Timeless Bond! ⏳" },
    { threshold: 80, remark: "சில்லுனு ஒரு காதல் சூர்யா & ஜோதிகா மாதிரி! ட்ரஸ்ட் ஃபுல் லவ்! ✨", performance: "Trust & Love! 💍" },

    // 70-80% Range - Strong Connection
    { threshold: 78, remark: "கில்லி விஜய் & த்ரிஷா மாதிரி! மேட்ச் செம்மையா இருக்கு! ⚡", performance: "Action Love! 💥" },
    { threshold: 76, remark: "ஆலைபாயுதே மாதவன் & ஷாலினி மாதிரி! ரொமான்டிக் வைப்! 🚆", performance: "Romance King! 💘" },
    { threshold: 74, remark: "மின்னலே மாதவன் & ரீமா சென் மாதிரி! ரெயின் லவ்ர்ஸ்! 🌧️", performance: "Rainy Romance! ☔" },
    { threshold: 72, remark: "வாரணம் ஆயிரம் சூர்யா & சமீரா மாதிரி! இன்ஸ்பிரேஷனல் லவ்! 🎸", performance: "Inspiring Pair! 🌟" },
    { threshold: 70, remark: "தெரி விஜய் & சமந்தா மாதிரி! ஃபேமிலி & லவ் கூட! 👨‍👩‍👧", performance: "Family First! 🏡" },

    // 60-70% Range - Good Match
    { threshold: 68, remark: "VTV கார்த்திக் & ஜெஸ்ஸி மாதிரி! போயட்டிக் ஆனா இண்டென்ஸ்! 🌙", performance: "Poetic Love! 📖" },
    { threshold: 66, remark: "3 தனுஷ் & ஷ்ருதி மாதிரி! எமோஷனல் கனெக்ஷன் இருக்கு! 💙", performance: "Deep Feels! 🎵" },
    { threshold: 64, remark: "OK கண்மணி துல்கர் & நித்யா மாதிரி! மார்டன் லவ்! 🏙️", performance: "Modern Vibes! 🎮" },
    { threshold: 62, remark: "ராஜினி முருகன் சிவகார்த்திகேயன் & கீர்த்தி மாதிரி! ஃபன்னி & க்யூட்! 📻", performance: "Fun Love! 😄" },
    { threshold: 60, remark: "நானும் ரௌடிதான் விஜய் சேதுபதி & நயன்தாரா மாதிரி! குயிர்க்கி & கூல்! 🕶️", performance: "Quirky Pair! 🤪" },

    // 50-60% Range - Balanced Match
    { threshold: 58, remark: "பையா கார்த்தி & தமன்னா மாதிரி! ரோடு ட்ரிப் லவ்! 🚗", performance: "Travel Buddies! 🗺️" },
    { threshold: 56, remark: "விஸ்வாசம் அஜித் & நயன்தாரா மாதிரி! பவர் கப்பிள்! 🚜", performance: "Power Couple! 💪" },
    { threshold: 54, remark: "சாமி விக்ரம் & த்ரிஷா மாதிரி! டைனமிக் & போல்ட்! 🔥", performance: "Dynamic Duo! ⚡" },
    { threshold: 52, remark: "ஈங்கேயும் காதல் ஜெயம் ரவி & ஹன்சிகா மாதிரி! கிளாமரஸ்! 🗼", performance: "Glamour Love! ✨" },
    { threshold: 50, remark: "சூர்யா & ஜோதிகா மாதிரி... கொஞ்சம் அட்ஜஸ்ட் பண்ணா செம்ம தான்! ✨", performance: "Balanced Bond! ⚖️" },

    // 40-50% Range - Work Needed
    { threshold: 48, remark: "ரவ்டி பேபி தனுஷ் & சாய் பல்லவி மாதிரி! கொஞ்சம் wildஆ தான்! 🕺", performance: "Wild Energy! 💃" },
    { threshold: 46, remark: "வல்லவன் சிம்பு & நயன்தாரா மாதிரி! Fiery ஆனா unpredictable! 🔥", performance: "Fiery Match! 🌶️" },
    { threshold: 44, remark: "காதல் கொண்டேன் தனுஷ் & சோனியா மாதிரி! கொஞ்சம் obsessiveஆ இருக்கு! 🌧️", performance: "Intense Feels! 😰" },
    { threshold: 42, remark: "பருத்திவீரன் கார்த்தி & பிரியமணி மாதிரி! ரூஃப் பட் ரியல்! 🗡️", performance: "Raw Love! 🌾" },
    { threshold: 40, remark: "ராவணன் விக்ரம் & ஐஸ்வர்யா மாதிரி! கம்ப்ளக்ஸ் ஆனா அழகு! 🏹", performance: "Complex Bond! 🌲" },

    // 30-40% Range - Challenging
    { threshold: 38, remark: "நீங்க லவ்ல கொஞ்சம் கன்ஃப்யூஷனா இருக்கீங்க! கொஞ்சம் நெருக்கம் தேவை! 🤔", performance: "Need Clarity! 🧭" },
    { threshold: 36, remark: "ஏதோ ஒரு வைப் தான் இருக்கு, ஆனா காம்பேட்டிபிலிட்டி கேள்விக்குறி! ❓", performance: "Question Mark! 🤨" },
    { threshold: 34, remark: "நீங்க ரெண்டு பேரும் வேற வேற வேர்ல்டு மாதிரி இருக்கு! 🌍🌎", performance: "Different Worlds! 🪐" },
    { threshold: 32, remark: "காதல் இருக்கா இல்லையான்னு நீங்களே முடிவு பண்ணுங்க! 💭", performance: "Think Again! 🤷" },
    { threshold: 30, remark: "இதயக்கோவில் கிளைமாக்ஸ் மாதிரி ஆயிடாதீங்க! கவனமா இருங்க! ⛪", performance: "Caution Mode! ⚠️" },

    // 20-30% Range - Critical
    { threshold: 28, remark: "உங்க மேட்ச் கொஞ்சம் சீரியஸ் ஆலோசனை தேவை! காதல் குருஜி கிட்ட கேளுங்க! 🧙", performance: "Guru Needed! 📿" },
    { threshold: 26, remark: "நீங்க ரெண்டு பேரும் நார்த் போல் & சௌத் போல் மாதிரி! 🧭", performance: "Opposite Poles! 🔴🔵" },
    { threshold: 24, remark: "இது காதலா? இல்ல torture-ஆ? யோசிச்சு பாருங்க! 😵", performance: "Re-Think! 💭" },
    { threshold: 22, remark: "கடவுளே காப்பாத்தணும் இந்த மேட்ச! பிரார்த்தனை பண்ணுங்க! 🙏", performance: "Need Prayers! 🕉️" },
    { threshold: 20, remark: "காதல் பண்ணாதீங்க, fight பண்ணுவீங்களே! Boxing ring-ல நில்லுங்க! 🥊", performance: "Fight Club! 💢" },

    // 10-20% Range - Emergency
    { threshold: 18, remark: "நீங்க ரெண்டு பேரும் சேர்ந்தா வெடிகுண்டு தான்! 💣", performance: "Danger Zone! ⚠️" },
    { threshold: 16, remark: "இந்த மேட்ச் ஆபத்து! மெயிண்டெயின் சேஃப் டிஸ்டன்ஸ்! 🚨", performance: "Red Alert! 🚨" },
    { threshold: 14, remark: "நீங்க லவ் பண்றதுக்கு முன்னாடி ஆர்மி ட்ரெயினிங் எடுங்க! 🪖", performance: "War Zone! ⚔️" },
    { threshold: 12, remark: "காதல் இல்ல, இது யுத்தம்! ஓடிடுங்க! 🏃‍♂️💨", performance: "Run Away! 🏃" },
    { threshold: 10, remark: "நீங்க match ஆக முடியாது! முடிவு செய் தான் நல்லது! 👋", performance: "Impossible! 🚫" },

    // 0-10% Range - Total Mismatch
    { threshold: 8, remark: "இது லவ் ஸ்டோரி இல்ல, horror movie! 👻", performance: "Horror Show! 😱" },
    { threshold: 6, remark: "நீங்க ரெண்டு பேரும் எண்மி மாதிரி இருக்கீங்க! ❌", performance: "Enemies! 💔" },
    { threshold: 4, remark: "இந்த மேட்ச் நரகமே! கடவுளையே கூப்பிடுங்க! 🔥", performance: "Hell Mode! 🔥" },
    { threshold: 2, remark: "நீங்க எதிரே எதிர் கூட இருக்க கூடாது! 😤", performance: "Keep Distance! 🚷" },
    { threshold: 0, remark: "இந்த மேட்ச் இம்பாசிபிள்! மாயம் செஞ்சாலும் நடக்காது! 🎭", performance: "Mission Impossible! 🚀" }
];

// Tamil Movie Couple Dataset
const tamilMoviePairs = [
    { couple: "Surya & Jyothika (Sillunu Oru Kaadhal)", traits: ["family", "routine", "understanding"], threshold: 80, desc: "A timeless love built on trust and deep family values. Your bond is pure gold! ✨", icon: "👨‍👩‍👧‍👦" },
    { couple: "Karthik & Jessy (VTV)", traits: ["emotional", "private", "passion"], threshold: 60, desc: "Deep, intense, and poetic. Your connection is like a soulful melody that stays forever. 🎵", icon: "🌧️" },
    { couple: "Santhosh & Hasini (Santhosh Subramaniam)", traits: ["talkative", "social", "adventure"], threshold: 75, desc: "Lively, cheerful, and full of chatter! You bring out the child-like joy in each other. 🎈", icon: "🎒" },
    { couple: "Arya & Nayanthara (Raja Rani)", traits: ["confident", "balanced", "trust"], threshold: 50, desc: "Mass and Class! You might have differences, but your mutual respect makes you a power couple. 👑", icon: "💍" },
    { couple: "Vijay & Trisha (Ghilli)", traits: ["bold", "adventure", "energy"], threshold: 70, desc: "Full of energy and protective vibes. You'd go to any extent for your partner! 🛡️", icon: "⚽" },
    { couple: "Madhavan & Shalini (Alaipayuthey)", traits: ["romantic", "spontaneous", "passion"], threshold: 85, desc: "The definition of urban romance. Your love is fresh, exciting, and deeply emotional. 🎸", icon: "🚆" },
    { couple: "Dhanush & Shruti Haasan (3)", traits: ["intense", "emotional", "deep"], threshold: 65, desc: "A soul-stirring connection. You feel things deeply and your love is beyond words. ❤️", icon: "🌙" },
    { couple: "Sivakarthikeyan & Keerthy Suresh (Rajini Murugan)", traits: ["fun", "local", "social"], threshold: 70, desc: "The local favorites! Your relationship is full of fun, banter, and neighborhood charm. 🏘️", icon: "📻" },
    { couple: "Ajith & Nayanthara (Viswasam)", traits: ["protection", "family", "respect"], threshold: 90, desc: "The ultimate power couple with deep-rooted values and unwavering support. 🛡️", icon: "🚜" },
    { couple: "Kamal Haasan & Sridevi (Moondram Pirai)", traits: ["sacrifice", "care", "innocence"], threshold: 55, desc: "A love so pure and selfless. You care for each other more than yourselves. 🕯️", icon: "⛰️" },
    { couple: "Rajinikanth & Sripriya (Johnny)", traits: ["style", "mystery", "cool"], threshold: 75, desc: "Classy and stylish! You have a mysterious charm that keeps the relationship exciting. 🕶️", icon: "🎷" },
    { couple: "Vijay Sethupathi & Trisha (96)", traits: ["nostalgia", "pure", "silent"], threshold: 80, desc: "The beauty of unspoken love. Your connection is timeless and transcends physical presence. 📷", icon: "🧣" },
    { couple: "Dulquer & Nithya Menen (OK Kanmani)", traits: ["modern", "urban", "living"], threshold: 75, desc: "Young, modern, and free-spirited! You define the new-age relationship goals. 🏙️", icon: "🎮" },
    { couple: "Prashanth & Simran (Jodi)", traits: ["matching", "grace", "dance"], threshold: 85, desc: "A perfectly matched pair in every sense. Your chemistry is rhythmically beautiful! 💃", icon: "👟" },
    { couple: "Karthik & Revathi (Mouna Raagam)", traits: ["stubborn", "sweet", "healing"], threshold: 60, desc: "A beautiful journey of healing and finding love where you least expect it. 🎹", icon: "🌧️" },
    { couple: "Simbu & Trisha (VTV)", traits: ["creative", "dreamy", "intense"], threshold: 50, desc: "A love that feels like a work of art. Emotional, deep, and slightly complicated. 🎥", icon: "🎬" },
    { couple: "Vikram & Trisha (Saamy)", traits: ["action", "bold", "dynamic"], threshold: 70, desc: "A dynamic duo that takes charge! You're bold and don't take nonsense from anyone. 🔥", icon: "🚓" },
    { couple: "Karthi & Priyamani (Paruthiveeran)", traits: ["raw", "local", "wild"], threshold: 40, desc: "Intense, raw, and unrefined. Your love is wild and knows no bounds or barriers. 🌾", icon: "🗡️" },
    { couple: "Vijay & Kajal (Thuppakki)", traits: ["smart", "sharp", "funny"], threshold: 75, desc: "A sharp and witty pair. You intelligence matches your charm perfectly. 🔫", icon: "🧥" },
    { couple: "Suriya & Asin (Ghajini)", traits: ["memorable", "bubbly", "tragic"], threshold: 85, desc: "A love that leaves a permanent mark. Bubbly energy meets deep commitment. 📓", icon: "🏠" },
    { couple: "Dhanush & Sai Pallavi (Maari 2)", traits: ["rowdy", "cute", "energy"], threshold: 60, desc: "Rowdy baby! You have a infectious energy that makes everyone smile. 🕺", icon: "💥" },
    { couple: "Manikandan & Sri Gouri Priya (Good Night)", traits: ["relatable", "cozy", "real"], threshold: 90, desc: "The most relatable couple next door. Real, cozy, and perfectly imperfect. 🛌", icon: "💤" },
    { couple: "Kavin & Amrita (Lift)", traits: ["teamwork", "intense", "survival"], threshold: 70, desc: "You are the ultimate survival team. You stick together through the toughest times. 🏢", icon: "🛗" },
    { couple: "Sivaji & Padmini (Thillana Mohanambal)", traits: ["artistic", "gracious", "classic"], threshold: 95, desc: "The gold standard of classical romance. Gracious, artistic, and legendary. 🎼", icon: "🎻" },
    { couple: "MGR & Saroja Devi (Enga Veettu Pillai)", traits: ["ideal", "helpful", "bright"], threshold: 85, desc: "An ideal pair that spreads positivity. You are the light in each other's lives. ☀️", icon: "🏰" },
    { couple: "Gemini Ganesan & Savitri (Missiamma)", traits: ["charming", "playful", "innocent"], threshold: 80, desc: "A charming and playful bond that feels like a vintage dream. 🍭", icon: "👒" },
    { couple: "Jayanth & Anjali (Kadhal Desam)", traits: ["youthful", "vibrant", "triangular"], threshold: 65, desc: "Full of youthful energy and vibrancy. You define friendship within love. 🎸", icon: "🚲" },
    { couple: "Vijay & Shalini (Kadhalukku Mariyathe)", traits: ["respect", "family", "pure"], threshold: 95, desc: "A love that prioritizes respect and family. You are the epitome of good values. 📜", icon: "🙏" },
    { couple: "Suriya & Sameera Reddy (Vaaranam Aayiram)", traits: ["inspired", "gentle", "brief"], threshold: 70, desc: "A gentle and inspiring connection that leaves a lasting positive impact. 🎸", icon: "🚲" },
    { couple: "Karthi & Tamannaah (Paiyaa)", traits: ["travel", "cool", "breeze"], threshold: 75, desc: "A breezy travel romance! You love exploring new things together on the road. 🚗", icon: "🛣️" },
    { couple: "Jai & Swathi (Subramaniapuram)", traits: ["vintage", "local", "loyal"], threshold: 50, desc: "A loyal and grounded love set in a nostalgic era. Deeply rooted in culture. 📻", icon: "🚲" },
    { couple: "Siddharth & Genelia (Boys)", traits: ["fun", "youth", "modern"], threshold: 60, desc: "The ultimate youth icons. You represent freedom, fun, and modern romance. 🎸", icon: "🍔" },
    { couple: "Madhavan & Reema Sen (Minnale)", traits: ["obsessive", "charming", "rain"], threshold: 80, desc: "Charming, a bit crazy, and very romantic. You love the monsoon vibes! ⛈️", icon: "☔" },
    { couple: "Jayam Ravi & Hansika (Engeyum Kadhal)", traits: ["glamorous", "travel", "rich"], threshold: 70, desc: "A glamorous and stylish pair that loves the finer things in life. 🗼", icon: "🍷" },
    { couple: "Vijay Sethupathi & Nayanthara (Naanum Rowdy Dhaan)", traits: ["funny", "vibe", "protect"], threshold: 85, desc: "A quirky and protective bond. You complement each other's weirdness! 🐣", icon: "🕶️" },
    { couple: "Harish Kalyan & Raiza (PPK)", traits: ["stylish", "modern", "cool"], threshold: 75, desc: "The modern cool kids. Your relationship is very high on style and trends. 👗", icon: "👢" },
    { couple: "Ashok Selvan & Ritika (Oh My Kadavule)", traits: ["friendship", "magical", "second-chance"], threshold: 90, desc: "A love rooted in deep friendship. It feels like a second chance at happiness! 🦋", icon: "⛪" },
    { couple: "Prabhu & Khushbu (Chinna Thambi)", traits: ["innocent", "protective", "devout"], threshold: 80, desc: "An innocent and very protective bond. You treat each other with utmost care. 🌸", icon: "🏠" },
    { couple: "Mohan & Revathi (Mouna Ragam)", traits: ["patient", "healing", "mature"], threshold: 70, desc: "A mature relationship that shows the beauty of patience and time. 🎹", icon: "🕯️" },
    { couple: "Karthik & Radha (Alaigal Oivathillai)", traits: ["forbidden", "intense", "sea"], threshold: 50, desc: "An intense love that fights against all odds. Your passion is like the sea. 🌊", icon: "⛪" },
    { couple: "Sivakarthikeyan & Priyanka Mohan (Doctor)", traits: ["deadpan", "funny", "sharp"], threshold: 85, desc: "Cool, calm, and hilariously sharp. You are the smartest team in the room! 🩺", icon: "🕶️" },
    { couple: "Dhanush & Nithya Menen (Thiruchitrambalam)", traits: ["best-friends", "neighbor", "comfortable"], threshold: 95, desc: "The best kind of love—hidden in a lifelong friendship. Comfort at its max! 🛵", icon: "🏠" },
    { couple: "Karthi & Aditi Shankar (Viruman)", traits: ["village", "loud", "happy"], threshold: 75, desc: "Loud, happy, and full of village charm. Your relationship is a celebration! 🎊", icon: "🚜" },
    { couple: "Vijay & Samantha (Theri)", traits: ["family", "protective", "sweet"], threshold: 85, desc: "A beautiful mini-family vibe. You protect and cherish every small moment. 🧁", icon: "👨‍👩‍👧" },
    { couple: "Ajith & Nayanthara (Billa)", traits: ["mass", "style", "ruthless"], threshold: 60, desc: "High on style and attitude. No one messes with this power duo! 🕶️", icon: "🔫" },
    { couple: "Vikram & Aishwarya Rai (Raavanan)", traits: ["complex", "intense", "nature"], threshold: 45, desc: "A complex and intense connection that defies logic. Raw and powerful. 🌲", icon: "🏹" },
    { couple: "Suriya & Jyothika (Kaakha Kaakha)", traits: ["discipline", "intense", "loyal"], threshold: 90, desc: "Solid and disciplined. Your love is built on a foundation of granite. 👮‍♂️", icon: "🛡️" },
    { couple: "Kamal Haasan & Gautami (Nammavar)", traits: ["inspiring", "calm", "academic"], threshold: 80, desc: "An inspiring and intellectual connection. You bring out the best in each other. 📚", icon: "🎓" },
    { couple: "Rajinikanth & Shobana (Thalapathi)", traits: ["unspoken", "separation", "deep"], threshold: 55, desc: "A love so deep it hurts. You have a connection that words can't capture. 🧣", icon: "🏮" },
    { couple: "Vijay & Simran (Thulladha Manamum Thullum)", traits: ["sacrifice", "silent", "pure"], threshold: 85, desc: "A love of extreme sacrifice and silence. Pure and heart-wrenching. 🎶", icon: "📻" },
    { couple: "Dhanush & Sonia Agarwal (Kadhal Konden)", traits: ["obsession", "pain", "different"], threshold: 30, desc: "A very intense and slightly obsessive love. You feel emotions in extremes. ⛈️", icon: "🏚️" },
    { couple: "Vishal & Lakshmi Menon (Pandiya Naadu)", traits: ["local", "grounded", "protective"], threshold: 75, desc: "A grounded and very local love story. You stand up for each other always. 🏙️", icon: "🗡️" },
    { couple: "Jiiva & Andrea (Engeyum Kadhal)", traits: ["glam", "paris", "style"], threshold: 70, desc: "Stylish and glamorous! You love the high-life and romantic getaways. 🗼", icon: "🍾" },
    { couple: "Siddharth & Trisha (Nuvvostanante Nenoddantana)", traits: ["funny", "village", "determined"], threshold: 80, desc: "A fun and determined love. You'd cross any hurdles to be together. 🌾", icon: "🐄" },
    { couple: "Arjun & Meena (Rhythm)", traits: ["mature", "musical", "calm"], threshold: 95, desc: "A mature and soul-soothing connection. Like a calm melody on a rainy day. 🌧️", icon: "🎼" },
    { couple: "Karthi & Catherine Tresa (Madras)", traits: ["raw", "politics", "local"], threshold: 65, desc: "Real and raw. Your love survives the pressures of the external world. 🧱", icon: "🥅" },
    { couple: "Vijay & Pooja Hegde (Beast)", traits: ["glam", "action", "swag"], threshold: 70, desc: "Full of swag and style. You make a very photogenic and modern pair. 🕶️", icon: "🚁" },
    { couple: "Arya & Amy Jackson (Madrasapattinam)", traits: ["period", "classic", "unlikely"], threshold: 85, desc: "An unlikely but beautiful period romance. Your love is legendary for its time. ⛲", icon: "📜" },
    { couple: "Dhanush & Richa Gangopadhyay (Mayakkam Enna)", traits: ["creative", "artist", "pain"], threshold: 50, desc: "A creative and slightly painful journey of love. You fuel each other's passion. 📷", icon: "🎨" },
    { couple: "Vijay Sethupathi & Aishwarya Rajesh (Ka Pae Ranasingam)", traits: ["struggle", "loyal", "earthy"], threshold: 90, desc: "Earthy, loyal, and incredibly strong. You fight the world for each other. 🌍", icon: "🌾" },
    { couple: "Karthi & Priyamani (Paruthiveeran)", traits: ["rustic", "violent", "loyal"], threshold: 35, desc: "A rustic and unapologetic love. It's raw, powerful, and deeply cultural. 🚜", icon: "🗡️" },
    { couple: "Sivakarthikeyan & Priyanka (Don)", traits: ["college", "fun", "breezy"], threshold: 80, desc: "A fun college romance! Full of jokes, smiles, and breezy moments. 🎓", icon: "🎒" },
    { couple: "Vijay & Asin (Pokkiri)", traits: ["swag", "comedy", "chemistry"], threshold: 85, desc: "The perfect mix of swag and comedy. Your chemistry is electric and fun! 🍭", icon: "🔫" },
    { couple: "Ajith & Shalini (Amarkalam)", traits: ["real-life", "intense", "reform"], threshold: 95, desc: "A legendary real-life pair. Your love has the power to change and reform! ❤️", icon: "🌹" },
    { couple: "Suriya & Rakul Preet (NGK)", traits: ["politics", "sharp", "serious"], threshold: 60, desc: "A serious and intelligent connection. You handle complex situations together. 🏛️", icon: "🗳️" },
    { couple: "Dhanush & Malavika (Maaran)", traits: ["journalism", "sharp", "loyal"], threshold: 70, desc: "Sharp, inquisitive, and loyal. You are a team that seeks the truth. 🖊️", icon: "📰" },
    { couple: "Vijay Sethupathi & Remya (Pizza)", traits: ["mystery", "thrilling", "hidden"], threshold: 75, desc: "A thrilling and mysterious connection. You share secrets that only you know. 🍕", icon: "👻" },
    { couple: "Simbu & Nayanthara (Vallavan)", traits: ["fiery", "stylish", "unpredictable"], threshold: 50, desc: "Fiery and unpredictable! Your relationship is high on intensity and style. 🔥", icon: "🕶️" },
    { couple: "Karthi & Tamannah (Siruthai)", traits: ["loud", "funny", "vibrant"], threshold: 80, desc: "Loud, funny, and very vibrant. You are the life of every party you attend. 🎭", icon: "🎪" },
    { couple: "Sivakarthikeyan & Hansika (Maane Thaene Paeye)", traits: ["cute", "urban", "sweet"], threshold: 75, desc: "Sweet and sugary romance. You define the 'cute couple' tags perfectly. 🍭", icon: "🧸" },
    { couple: "Jayam Ravi & Trisha (Unakkum Enakkum)", traits: ["sacrifice", "village", "sweet"], threshold: 90, desc: "A sweet village romance rooted in sacrifice and deep affection. 🌾", icon: "🐄" },
    { couple: "Vijay & Kamalinee (Vettaiyaadu Vilaiyaadu)", traits: ["grace", "brief", "poetic"], threshold: 70, desc: "Poetic and graceful. Even small moments together feel like a painting. 🎨", icon: "🌸" },
    { couple: "Dhanush & Amala Paul (VIP)", traits: ["relatable", "middle-class", "cute"], threshold: 85, desc: "The ultimate relatable pair! You define the beauty of simple living. 🛵", icon: "👷‍♂️" },
    { couple: "Ajith & Trisha (Yennai Arindhaal)", traits: ["mature", "grace", "dignified"], threshold: 95, desc: "Dignified and very mature. Your love is built on deep respect and grace. 👮‍♂️", icon: "🕴️" },
    { couple: "Suriya & Tamannaah (Ayan)", traits: ["dynamic", "world-travel", "sharp"], threshold: 80, desc: "Dynamic and adventure-loving. You're a pair that could take on the world! 🌍", icon: "💎" },
    { couple: "Karthi & Rashmika (Sulthan)", traits: ["protective", "energy", "bubbly"], threshold: 75, desc: "A bubbly and highly energetic pair. You bring out the best in everyone! 🚜", icon: "💥" },
    { couple: "Dhanush & Sai Pallavi (Maari 2)", traits: ["rowdy", "cute", "dancer"], threshold: 65, desc: "A fun and rowdy connection! You are 'Rowdy Baby' goals personified! 🕺", icon: "💃" },
    { couple: "Vijay & Genelia (Sachein)", traits: ["charming", "stubborn", "sweet"], threshold: 85, desc: "Charmingly stubborn! Your constant banter is what makes the love grow. 🍭", icon: "🎒" },
    { couple: "Vikram & Amy Jackson (I)", traits: ["extreme", "aesthetic", "tough"], threshold: 70, desc: "High on aesthetics and endurance. You stick together through extremes. 🎭", icon: "💪" },
    { couple: "Sivakarthikeyan & Sri Divya (Varuthapadatha Valibar Sangam)", traits: ["local", "funny", "youth"], threshold: 80, desc: "The ultimate youth duo! Your relationship is full of fun and local swag. 🐓", icon: "🕶️" },
    { couple: "Jayam Ravi & Genelia (Santhosh Subramaniam)", traits: ["childlike", "pure", "family"], threshold: 90, desc: "Childlike innocence and pure joy. You bring light into the whole family. 🎈", icon: "🏡" },
    { couple: "Suriya & Anushka (Singam)", traits: ["discipline", "loyal", "mass"], threshold: 85, desc: "Mass and disciplined! You are the ultimate lion and lioness of the clan. 🦁", icon: "🛡️" },
    { couple: "Vijay & Trisha (Thirupaachi)", traits: ["protective", "angry", "sweet"], threshold: 75, desc: "A protective and very sweet bond. You protect your love like a shield. 🗡️", icon: "🏘️" },
    { couple: "Dhanush & Megha Akash (ENPT)", traits: ["stylish", "musical", "silent"], threshold: 60, desc: "Musical, stylish, and silent. Your love is like a GVM movie song. 🎸", icon: "🌧️" },
    { couple: "Ajith & Nayanthara (Arrambam)", traits: ["sharp", "modern", "slick"], threshold: 75, desc: "Slick and modern! You handle digital-age romance with pure class. 💻", icon: "🕶️" },
    { couple: "Karthi & Rakul Preet (Theeran)", traits: ["loyal", "police", "strong"], threshold: 85, desc: "Incredibly loyal and strong. You are the pillar of support for each other. 👮‍♂️", icon: "🏜️" },
    { couple: "Sivakarthikeyan & Priyanka (Don)", traits: ["funny", "youthful", "breezy"], threshold: 90, desc: "A breezy and very funny connection. You laugh through life together. 🎓", icon: "🚲" },
    { couple: "Vijay Sethupathi & Aishwarya Rajesh (Dharmadurai)", traits: ["earthy", "medicine", "home"], threshold: 95, desc: "Earthy and very comforting. Your bond feels like coming back home. 🧤", icon: "🥣" },
    { couple: "Suriya & Sameera Reddy (Vaaranam Aayiram)", traits: ["inspiration", "gentle", "music"], threshold: 80, desc: "An inspiring and very gentle connection. You fuel each other's dreams. 🎸", icon: "🚲" },
    { couple: "Dhanush & Shruti (3)", traits: ["poetic", "painful", "timeless"], threshold: 45, desc: "A timeless but painful poetic connection. Your love is like a sad melody. 🌙", icon: "🎹" },
    { couple: "Vijay & Samantha (Mersal)", traits: ["glam", "charming", "magical"], threshold: 85, desc: "Magical and charming! You have a spark that keeps everything glowing. 🎩", icon: "✨" },
    { couple: "Ajith & Thamannaah (Veeram)", traits: ["family", "unity", "protective"], threshold: 90, desc: "A symbol of family unity and protection. You are the elders' pride! 🏯", icon: "👨‍👩‍👦‍👦" },
    { couple: "Karthi & Catherine (Madras)", traits: ["real", "local", "loyal"], threshold: 75, desc: "Real, grounded, and incredibly loyal. You define local romance. ⚽", icon: "🥅" },
    { couple: "Sivakarthikeyan & Keerthy (Remo)", traits: ["creative", "funny", "swag"], threshold: 80, desc: "Highly creative and full of swag! Your love is like a comedy-drama. 🎭", icon: "💃" },
    { couple: "Vijay & Kajal (Jilla)", traits: ["energetic", "funny", "stylish"], threshold: 75, desc: "Full of energy and style! You handle every situation with a smile. 🔥", icon: "🕶️" },
    { couple: "Dhanush & Nithya Menen (Thiruchitrambalam)", traits: ["healing", "friendship", "comfort"], threshold: 98, desc: "The ultimate gold medal! A bond that heals, comforts, and stays forever. 🛵", icon: "🧤" },
    { couple: "Madhavan & Shalini (Alaipayuthey)", traits: ["urban", "romance", "train"], threshold: 92, desc: "The benchmark for urban romance. Fresh, iconic, and deeply loving. 🚆", icon: "🎸" },
    { couple: "Surya & Jyothika (Sillunu Oru Kaadhal)", traits: ["pure", "family", "trust"], threshold: 94, desc: "Pure, family-oriented, and extremely trusting. A legendary match! 👨‍👩‍👧", icon: "💍" }
];

function injectFunnyRemark(elementId, lovePercent = null) {
    const container = document.getElementById(elementId);
    if (!container) return; // For safety

    let item;

    if (lovePercent !== null) {
        // Find all dialogues that match this score
        const matchingDialogues = movieCoupleComments.filter(c => lovePercent >= c.threshold);

        // If we found matches, pick the first one (highest threshold that matches)
        // Then randomly select from similar threshold dialogues for variety
        if (matchingDialogues.length > 0) {
            const topThreshold = matchingDialogues[0].threshold;
            const sameThresholdGroup = matchingDialogues.filter(c => c.threshold === topThreshold);
            item = sameThresholdGroup[Math.floor(Math.random() * sameThresholdGroup.length)];
        } else {
            item = movieCoupleComments[movieCoupleComments.length - 1]; // Fallback to lowest
        }

        container.innerHTML = `
            <div class="performance-badge">${item.performance}</div>
            <p class="funny-comment">"${item.remark}"</p>
            <span class="funny-subtitle">Love Score Performance</span>
        `;
        displayMovieMatch(elementId === 'coupleFunnyRemark' ? 'coupleMovieMatchResult' : 'movieMatchResult', lovePercent);
    } else {
        const randomIdx = Math.floor(Math.random() * funnyTamilComments.length);
        item = funnyTamilComments[randomIdx];
        container.innerHTML = `
            <p class="funny-comment">"${item.comment}"</p>
            <span class="funny-subtitle">${item.subtitle}</span>
        `;
        displayMovieMatch('movieMatchResult');
    }

    container.classList.add('active');
}

function displayMovieMatch(containerId, percent = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let match;
    if (percent !== null) {
        // Match based on score
        const available = tamilMoviePairs.filter(p => percent >= p.threshold - 10);
        match = available[Math.floor(Math.random() * available.length)] || tamilMoviePairs[0];
    } else {
        // Match based on traits (Soft matching)
        const userTraits = [userData.personality, userData.focus, userData.value];
        const scores = tamilMoviePairs.map(pair => {
            let score = 0;
            pair.traits.forEach(t => { if (userTraits.includes(t)) score++; });
            return { pair, score };
        });
        scores.sort((a, b) => b.score - a.score);
        match = scores[0].pair;
    }

    container.innerHTML = `
        <div class="movie-match-card">
            <div class="movie-icon">${match.icon}</div>
            <div class="movie-info">
                <h4>Cinema Match: ${match.couple}</h4>
                <p>${match.desc}</p>
            </div>
        </div>
    `;
    container.classList.add('active');
}

async function shareResult() {
    const name = userData.name || document.getElementById('maleName').value;
    const partner = document.getElementById('femaleName')?.value || "Partner";
    const score = document.getElementById('lovePercent')?.textContent;

    const text = score
        ? `💖 Wow! ${name} and ${partner} have a Love Compatibility of ${score}%! Check your match too on Jodi Porutham!`
        : `💖 Just found my ideal partner type on Jodi Porutham! It says I'm a perfect match for someone like Surya & Jyothika! ✨`;

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'My Love Compatibility Result',
                text: text,
                url: window.location.href
            });
        } catch (err) {
            copyToClipboard(text);
        }
    } else {
        copyToClipboard(text);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showAlert("Result copied to clipboard! Share it with your loved ones! 📱✨");
    });
}
