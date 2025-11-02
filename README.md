# MindBalance Aid  - Mental Wellness Tracker

A comprehensive mental wellness tracking mobile application built with **Ionic React + TypeScript**, featuring mood tracking, stress monitoring, mindfulness exercises, and personalized insights.

![Ionic React](https://img.shields.io/badge/Ionic-React-3880FF?style=flat&logo=ionic&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)
![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=flat&logo=capacitor&logoColor=white)

## 📱 App Overview

MindBalance Aid helps users monitor their daily mood, stress levels, and mindfulness habits through an intuitive interface with powerful analytics. The app combines journaling, guided breathing exercises, and AI-based mood pattern insights to promote emotional well-being.

### ✨ Key Features

- **Daily Mood & Stress Tracking** with customizable logs
- **Guided Mindfulness Exercises** and meditation timer
- **Visual Analytics Dashboard** with charts and trends
- **Firebase Authentication** for secure user accounts
- **Native Camera Integration** for photo journaling
- **Local Notifications** for daily reminders
- **Custom Themes** (Pro feature)
- **Priority Support** (Pro feature)
- **Offline Capability** with Ionic Storage

## 🛠 Tech Stack

- **Frontend Framework**: Ionic React with TypeScript
- **Build Tool**: Vite
- **Backend Services**: Firebase (Authentication + Firestore)
- **Native Features**: Capacitor (Camera, Local Notifications)
- **Storage**: Ionic Storage for offline persistence
- **Charts**: Recharts for data visualization
- **State Management**: React Context + Hooks

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Ionic CLI: `npm install -g @ionic/cli`
- Firebase account for backend services

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/mindbalance-aid.git
   cd mindbalance-aid

2. npm install

3.Configure Firebase
Create a Firebase project

Enable Authentication (Email/Password) and Firestore

Copy your config to src/firebaseConfig.ts

4.Configure Cloudinary (for photo storage)

Create a Cloudinary account

Update CLOUD_NAME and UPLOAD_PRESET in src/services/CameraService.ts

Mobile Build;
ionic capacitor add android
ionic capacitor build android
ionic capacitor run android

🔐 Firebase Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to create their own user document during registration
    match /users/{userId} {
      allow create: if request.auth != null && request.auth.uid == userId;
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only access their own mood entries
    match /users/{userId}/mood_entries/{entry} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}

💰 Monetization Strategy
The app implements a one-time purchase Pro version with:

Custom Themes: Multiple color schemes

Priority Support: Dedicated customer support

Advanced Analytics: Detailed insights and trends

Unlimited History: Access to all past entries

Pro status is simulated using Ionic Storage and persists per user account.

🎯 Native Features
Camera API
Take photos to attach to mood entries

Image upload to Cloudinary

Photo editing and removal

Local Notifications
Daily reminders at 7 PM for mood logging

Custom notification channel with sound

Permission handling and testing

👥 Development Team
EMANUEL PRESTON A/L VINCENT - BIT_B2201F-2409001

NA KUAN LI - BIT_B2201F-2505002

NA KUAN REN - BIT_B2201F-2505003

IQBAL TAMIM - BIT_B2009F-2409003

📄 License
This project is developed for educational purposes as part of BAI13123 Mobile Application Development course at Raffles University.

🤝 Support
For technical support or questions about this project, please contact the development team or create an issue in this repository.


This README provides:
- ✅ **Professional presentation** with badges and clear structure
- ✅ **Complete setup instructions** for other developers
- ✅ **Technical overview** of your Ionic React stack
- ✅ **Feature documentation** matching what you built
- ✅ **Team information** as required
- ✅ **Mobile build instructions** for Android/iOS

