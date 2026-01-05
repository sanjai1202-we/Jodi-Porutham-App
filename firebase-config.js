// ==================== FIREBASE CONFIGURATION ====================
// Instructions to get your Firebase config:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project called "Jodi-Porutham"
// 3. Click "Add app" > "Web" (</>) icon
// 4. Copy the firebaseConfig object below
// 5. Enable Authentication (Email/Password & Google)
// 6. Create Firestore Database

// REPLACE THIS WITH YOUR ACTUAL FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyB3InYIcdpSkJM3hiqzZ70k_8UJfXDVdTY",
    authDomain: "jodi-porutham.firebaseapp.com",
    projectId: "jodi-porutham",
    storageBucket: "jodi-porutham.firebasestorage.app",
    messagingSenderId: "475205201246",
    appId: "1:475205201246:web:fdeefd6c71e95e3311b3cf"
};

// Initialize Firebase
let app, auth, db;

try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    console.log('✅ Firebase initialized successfully');
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
}

// ==================== AUTH STATE OBSERVER ====================
let currentUser = null;

auth.onAuthStateChanged((user) => {
    currentUser = user;
    if (user) {
        console.log('✅ User logged in:', user.email);
        updateUIForLoggedInUser(user);
        // Save user to Firestore if new
        saveUserToDatabase(user);
    } else {
        console.log('👤 User logged out');
        updateUIForLoggedOutUser();
    }
});

// ==================== DATABASE FUNCTIONS ====================

// Save user profile to Firestore
async function saveUserToDatabase(user) {
    try {
        const userRef = db.collection('users').doc(user.uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            // New user - create profile
            await userRef.set({
                email: user.email,
                displayName: user.displayName || user.email.split('@')[0],
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                totalTests: 0,
                lastVisit: firebase.firestore.FieldValue.serverTimestamp(),
                preferences: {
                    theme: 'dark',
                    notifications: true
                }
            });
            console.log('✅ New user profile created');
        } else {
            // Existing user - update last visit
            await userRef.update({
                lastVisit: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    } catch (error) {
        console.error('❌ Error saving user:', error);
    }
}

// Save test result to Firestore
async function saveTestResult(testData) {
    if (!currentUser) {
        console.log('⚠️ User not logged in - test not saved');
        return;
    }

    try {
        const testRef = db.collection('tests').doc();
        await testRef.set({
            userId: currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            ...testData
        });

        // Update user's total test count
        const userRef = db.collection('users').doc(currentUser.uid);
        await userRef.update({
            totalTests: firebase.firestore.FieldValue.increment(1)
        });

        // Update global analytics
        await updateAnalytics(testData);

        console.log('✅ Test result saved');
        return testRef.id;
    } catch (error) {
        console.error('❌ Error saving test:', error);
    }
}

// Update global analytics
async function updateAnalytics(testData) {
    try {
        const statsRef = db.collection('analytics').doc('stats');
        const statsDoc = await statsRef.get();

        if (!statsDoc.exists) {
            // Initialize analytics
            await statsRef.set({
                totalTests: 1,
                totalScore: testData.score || 0,
                avgScore: testData.score || 0,
                popularDialogues: {},
                peakUsageTimes: {}
            });
        } else {
            const currentStats = statsDoc.data();
            const newTotal = currentStats.totalTests + 1;
            const newTotalScore = currentStats.totalScore + (testData.score || 0);

            await statsRef.update({
                totalTests: newTotal,
                totalScore: newTotalScore,
                avgScore: Math.round(newTotalScore / newTotal)
            });
        }
    } catch (error) {
        console.error('❌ Error updating analytics:', error);
    }
}

// Get user's test history
async function getUserTestHistory() {
    if (!currentUser) return [];

    try {
        const testsRef = db.collection('tests')
            .where('userId', '==', currentUser.uid)
            .orderBy('timestamp', 'desc')
            .limit(20);

        const snapshot = await testsRef.get();
        const tests = [];
        snapshot.forEach(doc => {
            tests.push({ id: doc.id, ...doc.data() });
        });

        return tests;
    } catch (error) {
        console.error('❌ Error fetching history:', error);
        return [];
    }
}

// ==================== UI UPDATE FUNCTIONS ====================

function updateUIForLoggedInUser(user) {
    // Update UI to show user is logged in
    const authButton = document.getElementById('authButton');
    if (authButton) {
        authButton.innerHTML = `
            <span>👤 ${user.displayName || user.email.split('@')[0]}</span>
            <button onclick="handleLogout()" class="btn-secondary">Logout</button>
        `;
    }
}

function updateUIForLoggedOutUser() {
    // Update UI to show user is logged out
    const authButton = document.getElementById('authButton');
    if (authButton) {
        authButton.innerHTML = `
            <button onclick="window.location.href='auth.html'" class="btn-primary">Login / Sign Up</button>
        `;
    }
}

// ==================== AUTH ACTIONS ====================

async function handleLogout() {
    try {
        await auth.signOut();
        window.location.reload();
    } catch (error) {
        console.error('❌ Logout error:', error);
    }
}
