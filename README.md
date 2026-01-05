# 💖 Jodi Porutham - Tamil Love Compatibility App

A premium compatibility matching application with **Firebase backend**, **user authentication**, and **50+ unique Tamil cinema dialogues**!

## ✨ Features

### 🎯 Core Features
- **Solo Journey**: Discover your ideal partner type based on personality
- **Couple Calculator**: Check love compatibility with numerology
- **100+ Tamil Movie Couples**: Iconic pairings from classic to modern Tamil cinema
- **50+ Tamil Dialogues**: Unique movie quotes for every score range

### 🔐 Authentication & Database
- **User Accounts**: Email/Password and Google Sign-In
- **Auto-Save Results**: All tests saved to Firebase Firestore
- **Test History**: View all your past compatibility tests
- **Admin Dashboard**: Analytics and data export

###  🎨 Premium Dark Theme
- Cinematic gold and midnight blue color scheme
- Smooth animations and transitions  
- Fully responsive design

---

## 🚀 Quick Start

### 1. Firebase Setup (Required)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project: "Jodi-Porutham"
3. Add a Web App (</> icon)
4. Copy the Firebase configuration

#### Enable Authentication:
- Go to **Authentication** → **Sign-in method**
- Enable **Email/Password**
- Enable **Google** (optional)

#### Create Firestore Database:
- Go to **Firestore Database** → **Create Database**
- Start in **Test mode** (we'll add security rules later)

### 2. Configure Your App

Open `firebase-config.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 3. Set Admin Email

Open `admin.html` and change line 179:

```javascript
const ADMIN_EMAIL = "your-email@example.com";
```

### 4. Deploy Firestore Security Rules

In Firebase Console → **Firestore Database** → **Rules**, paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Users can create and read their own tests
    match /tests/{testId} {
      allow create: if request.auth != null;
      allow read: if request.auth.uid == resource.data.userId;
    }
    
    // Analytics - write allowed, read restricted
    match /analytics/{document=**} {
      allow write: if true;
      allow read: if request.auth != null;
    }
  }
}
```

---

## 📁 Project Structure

```
Jodi-Porutham-App/
├── index.html           # Main application
├── auth.html            # Login/Signup page
├── admin.html           # Admin dashboard
├── app.js               # Application logic
├── firebase-config.js   # Firebase configuration
├── styles.css           # Premium Cinema Dark Theme
└── README.md            # This file
```

---

## 🎮 Usage

### For Users:
1. Visit `index.html`
2. Click "Login / Sign Up" (optional - can use without login)
3. Choose **Solo Journey** or **Couple Calculator**
4. Answer the questions
5. Get your compatibility results with Tamil cinema references!

### For Admins:
1. Visit `admin.html`
2. Login with your admin email
3. View analytics, charts, and export data

---

## 🌐 Deployment

### Option 1: GitHub Pages (Free)
1. Go to your repository → **Settings** → **Pages**
2. Select branch: `main`
3. Your site will be live at: `https://YOUR_USERNAME.github.io/Jodi-Porutham-App/`

### Option 2: Netlify (Recommended)
1. Go to [Netlify](https://www.netlify.com/)
2. Connect your GitHub repository
3. Deploy with one click!
4. Your site gets a custom domain: `your-app.netlify.app`

**Environment Variables (if needed):**
- Firebase config is in `firebase-config.js` (client-side, safe to commit)

---

## 📊 Database Schema

### Collections

#### `users/`
```javascript
{
  email: string,
  displayName: string,
  createdAt: timestamp,
  totalTests: number,
  lastVisit: timestamp,
  preferences: {
    theme: string,
    notifications: boolean
  }
}
```

#### `tests/`
```javascript
{
  userId: string,
  timestamp: timestamp,
  type: "solo" | "couple",
  score: number (0-100),
  dialogue: string,
  movieMatch: string,
  partnerName: string (couple only)
}
```

#### `analytics/stats/`
```javascript
{
  totalTests: number,
  totalScore: number,
  avgScore: number
}
```

---

## 🔧 Troubleshooting

### Firebase Not Initializing
- ✅ Check that you replaced ALL placeholder values in `firebase-config.js`
- ✅ Verify Firebase SDKs are loading (check browser console)
- ✅ Ensure your Firebase project is active

### Authentication Errors
- ✅ Enable Email/Password in Firebase Console
- ✅ For Google Sign-In, add authorized domains
- ✅ Check Firestore security rules

### Admin Dashboard Not Loading
- ✅ Make sure you set the correct admin email in `admin.html`
- ✅ Verify you're logged in with that email
- ✅ Check browser console for errors

---

## 🎯 Roadmap (Future Enhancements)

- [ ] Result image generation for sharing
- [ ] Daily horoscope feature  
- [ ] Achievement badges
- [ ] Streak counter
- [ ] Push notifications
- [ ] Mobile app (React Native)

---

## 💡 Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Backend**: Firebase (Firestore + Authentication)
- **Charts**: Chart.js
- **Hosting**: GitHub Pages / Netlify
- **Theme**: Premium Cinema Dark (Custom CSS)

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🙏 Credits

- **Tamil Cinema Dialogues**: Curated from iconic Tamil movies
- **Movie Couples**: 100+ legendary pairings from Tamil cinema history
- **Theme Inspiration**: Modern dark UI with cinematic aesthetics

---

## 📧 Contact

For questions or support, please open an issue on GitHub!

---

Made with 💖 for Tamil cinema lovers