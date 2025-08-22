# 🍅 Pomodoro Tracker

A beautiful, minimalist Pomodoro timer application with Apple-style design, task management, and productivity statistics.

![Pomodoro Tracker](https://img.shields.io/badge/Status-Production_Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-5.0.8-purple)
![Firebase](https://img.shields.io/badge/Firebase-10.x-orange)

## ✨ Features

### ⏰ **Pomodoro Timer**
- 25-minute focused work sessions
- 5-minute short breaks
- 15-minute long breaks after every 4 sessions
- Visual progress indicators
- Sound notifications

### 📝 **Task Management**
- Create and organize tasks
- Track Pomodoros per task
- Mark tasks as complete
- Active task selection
- Persistent task storage

### 📊 **Statistics & Analytics**
- Daily productivity tracking
- Monthly calendar view
- GitHub-style activity heatmap
- Completed tasks and Pomodoros count
- Focus hours calculation

### 🔐 **Authentication & Sync**
- Google Sign-In integration
- Cross-device synchronization
- Cloud storage with Firestore
- Offline functionality with localStorage fallback

### 🎨 **Design**
- Apple-inspired minimalist interface
- SF Pro Display typography
- Glass morphism effects
- Smooth animations and transitions
- Responsive design for all devices

## 🚀 Quick Start

### Development Mode (No Setup Required)
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open `http://localhost:5173`
5. Click "Continue with Google" to use development mode

### Production Mode (Firebase Required)
1. Follow the [Firebase Setup Guide](./FIREBASE_SETUP.md)
2. Update `src/firebase.js` with your Firebase config
3. Set `DEV_MODE = false` in `src/firebase.js`
4. Deploy your application

## 🛠️ Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd pomodorro

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: CSS3 with custom properties
- **Authentication**: Firebase Auth (Google)
- **Database**: Firestore
- **Build Tool**: Vite
- **Deployment**: Static hosting compatible

## 📁 Project Structure

```
src/
├── components/
│   ├── App.jsx              # Main application component
│   ├── TaskList.jsx         # Task management component
│   ├── Statistics.jsx       # Statistics and analytics
│   ├── Login.jsx           # Authentication component
│   ├── UserProfile.jsx     # User profile display
│   └── AuthProvider.jsx    # Authentication context
├── firebase.js             # Firebase configuration
├── index.css              # Global styles
└── main.jsx               # Application entry point

public/
├── index.html             # HTML template
└── vite.svg              # Vite logo

docs/
└── FIREBASE_SETUP.md      # Firebase setup instructions
```

## 🎮 Usage

### Getting Started
1. **Authentication**: Sign in with your Google account
2. **Create Tasks**: Click the "+" button to add tasks you want to work on
3. **Select Active Task**: Click on any task to make it your current focus
4. **Start Timer**: Click "Start" to begin a 25-minute Pomodoro session
5. **Track Progress**: View your statistics by clicking "📊 View Statistics"

### Tips for Maximum Productivity
- 🎯 **Single Task Focus**: Work on one task per Pomodoro
- 📱 **Minimize Distractions**: Put your phone in another room
- ☕ **Take Real Breaks**: Step away from your computer during breaks
- 📊 **Review Stats**: Use the monthly view to identify productivity patterns

## 🔥 Firebase Setup

The application supports both development and production modes:

- **Development Mode**: Works immediately with localStorage
- **Production Mode**: Requires Firebase setup for cloud sync

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions.

## 🎨 Design Philosophy

This application follows Apple's Human Interface Guidelines:

- **Clarity**: Clear typography and intuitive interface
- **Deference**: Content takes precedence over UI elements
- **Depth**: Layered interface with appropriate shadows and blur effects
- **Consistency**: Uniform behavior and visual elements throughout

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the Pomodoro Technique® by Francesco Cirillo
- Design inspired by Apple's Human Interface Guidelines
- Icons from system emoji sets
- Built with modern web technologies

## 📧 Contact

If you have any questions, feel free to reach out or create an issue in this repository.

---

**Happy focusing! 🍅**