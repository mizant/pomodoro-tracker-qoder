import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import TaskList from './TaskList.jsx';
import Login from './Login.jsx';
import UserProfile from './UserProfile.jsx';
import Statistics from './Statistics.jsx';
import { useAuth } from './AuthProvider.jsx';
import { getUserData, saveTasks, saveSettings, saveStats, saveDailyStats, getDailyStats } from './firebase.js';

const WORK_TIME = 25 * 60; // 25 minutes
const SHORT_BREAK = 5 * 60; // 5 minutes
const LONG_BREAK = 15 * 60; // 15 minutes

function App() {
  const { user, isAuthenticated } = useAuth();
  
  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return <Login />;
  }
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState('WORK');
  const [sessionCount, setSessionCount] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [settings, setSettings] = useState({
    workTime: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4
  });
  const [notification, setNotification] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [dailyStats, setDailyStats] = useState({});
  const [showStatistics, setShowStatistics] = useState(false);

  // Load settings from Firestore when user is authenticated
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const userData = await getUserData(user.uid);
      if (userData) {
        if (userData.settings) {
          setSettings(userData.settings);
        }
        if (userData.stats) {
          setTotalSessions(userData.stats.totalSessions || 0);
          setSessionCount(userData.stats.sessionCount || 0);
        }
        if (userData.tasks) {
          setTasks(userData.tasks);
          setActiveTaskId(userData.activeTaskId || null);
        }
      } else {
        // No user data found, check for development mode localStorage
        if (user.uid === 'dev-user-123') {
          loadDevModeData();
        }
      }
      
      // Load daily statistics
      const dailyStatsData = await getDailyStats(user.uid);
      setDailyStats(dailyStatsData);
      
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to localStorage if Firestore fails
      loadFromLocalStorage();
    }
  };

  const loadDevModeData = () => {
    const tasks = localStorage.getItem(`tasks_${user.uid}`);
    const settings = localStorage.getItem(`settings_${user.uid}`);
    const stats = localStorage.getItem(`stats_${user.uid}`);
    const dailyStatsData = localStorage.getItem(`dailyStats_${user.uid}`);
    
    if (tasks) {
      const tasksData = JSON.parse(tasks);
      setTasks(tasksData.tasks || []);
      setActiveTaskId(tasksData.activeTaskId || null);
    }
    
    if (settings) {
      setSettings(JSON.parse(settings));
    }
    
    if (stats) {
      const statsData = JSON.parse(stats);
      setTotalSessions(statsData.totalSessions || 0);
      setSessionCount(statsData.sessionCount || 0);
    }
    
    if (dailyStatsData) {
      setDailyStats(JSON.parse(dailyStatsData));
    }
  };

  const loadFromLocalStorage = () => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    const savedStats = localStorage.getItem('pomodoroStats');
    const savedTasks = localStorage.getItem('pomodoroTasks');
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      setTotalSessions(stats.totalSessions || 0);
      setSessionCount(stats.sessionCount || 0);
    }
    
    if (savedTasks) {
      const tasksData = JSON.parse(savedTasks);
      setTasks(tasksData.tasks || []);
      setActiveTaskId(tasksData.activeTaskId || null);
    }
  };

  // Save settings to Firestore
  useEffect(() => {
    if (user) {
      saveSettings(user.uid, settings).catch(console.error);
    }
    // Also keep localStorage as backup
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  }, [settings, user]);

  // Save stats to Firestore
  useEffect(() => {
    if (user) {
      saveStats(user.uid, { totalSessions, sessionCount }).catch(console.error);
    }
    // Also keep localStorage as backup
    localStorage.setItem('pomodoroStats', JSON.stringify({
      totalSessions,
      sessionCount
    }));
  }, [totalSessions, sessionCount, user]);

  // Save tasks to Firestore
  useEffect(() => {
    if (user && tasks.length >= 0) { // Only sync if tasks have been initialized
      saveTasks(user.uid, tasks, activeTaskId).catch(console.error);
    }
    // Also keep localStorage as backup
    localStorage.setItem('pomodoroTasks', JSON.stringify({
      tasks,
      activeTaskId
    }));
  }, [tasks, activeTaskId, user]);

  // Timer logic
  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleSessionComplete = useCallback(() => {
    setIsActive(false);
    
    if (sessionType === 'WORK') {
      const newSessionCount = sessionCount + 1;
      setSessionCount(newSessionCount);
      setTotalSessions(total => total + 1);
      
      // Update daily statistics for completed Pomodoro
      updateDailyStats('pomodoro', 1);
      
      // Increment pomodoro count for active task
      if (activeTaskId) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === activeTaskId 
              ? { ...task, pomodoroCount: (task.pomodoroCount || 0) + 1 }
              : task
          )
        );
      }
      
      // Determine next session type
      if (newSessionCount % settings.longBreakInterval === 0) {
        setSessionType('LONG_BREAK');
        setTimeLeft(settings.longBreak * 60);
        showNotification('Work Complete!', 'Time for a long break');
      } else {
        setSessionType('SHORT_BREAK');
        setTimeLeft(settings.shortBreak * 60);
        showNotification('Work Complete!', 'Time for a short break');
      }
    } else {
      setSessionType('WORK');
      setTimeLeft(settings.workTime * 60);
      showNotification('Break Complete!', 'Time to get back to work');
    }
    
    // Play notification sound
    playNotificationSound();
  }, [sessionType, sessionCount, settings, activeTaskId, dailyStats, user]);

  const playNotificationSound = () => {
    // Create a simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  };

  const showNotification = (title, message) => {
    setNotification({ title, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSessionType('WORK');
    setTimeLeft(settings.workTime * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionTypeLabel = () => {
    switch (sessionType) {
      case 'WORK': return 'Focus Time';
      case 'SHORT_BREAK': return 'Short Break';
      case 'LONG_BREAK': return 'Long Break';
      default: return 'Focus Time';
    }
  };

  const getCurrentSessionTime = () => {
    switch (sessionType) {
      case 'WORK': return settings.workTime * 60;
      case 'SHORT_BREAK': return settings.shortBreak * 60;
      case 'LONG_BREAK': return settings.longBreak * 60;
      default: return settings.workTime * 60;
    }
  };

  const progress = ((getCurrentSessionTime() - timeLeft) / getCurrentSessionTime()) * 100;

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: parseInt(value) };
    setSettings(newSettings);
    
    // Update current timer if not active
    if (!isActive && sessionType === 'WORK' && key === 'workTime') {
      setTimeLeft(newSettings.workTime * 60);
    }
  };

  // Task management functions
  const addTask = (title) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      completed: false,
      pomodoroCount: 0,
      createdAt: new Date().toISOString()
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const updateTask = (taskId, updates) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
    
    // If task is being completed for the first time, update daily stats
    if (updates.completed && !tasks.find(t => t.id === taskId)?.completed) {
      updateDailyStats('task', 1);
    }
    
    // If task is completed, unset as active
    if (updates.completed && taskId === activeTaskId) {
      setActiveTaskId(null);
    }
  };

  const deleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    if (taskId === activeTaskId) {
      setActiveTaskId(null);
    }
  };

  const setActiveTask = (taskId) => {
    setActiveTaskId(taskId);
  };

  // Daily statistics functions
  const getTodayKey = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const updateDailyStats = (type, increment = 1) => {
    const todayKey = getTodayKey();
    const updatedStats = {
      ...dailyStats,
      [todayKey]: {
        pomodoros: dailyStats[todayKey]?.pomodoros || 0,
        completedTasks: dailyStats[todayKey]?.completedTasks || 0,
        ...(type === 'pomodoro' && { pomodoros: (dailyStats[todayKey]?.pomodoros || 0) + increment }),
        ...(type === 'task' && { completedTasks: (dailyStats[todayKey]?.completedTasks || 0) + increment })
      }
    };
    
    setDailyStats(updatedStats);
    
    // Save to storage
    if (user) {
      saveDailyStats(user.uid, updatedStats).catch(console.error);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <UserProfile user={user} />
        
        <div className="session-type">{getSessionTypeLabel()}</div>
        
        {activeTaskId && sessionType === 'WORK' && (
          <div className="active-task-display">
            Working on: {tasks.find(t => t.id === activeTaskId)?.title}
          </div>
        )}
        
        <div className={`timer-display ${timeLeft <= 10 && isActive ? 'pulse' : ''}`}>
          {formatTime(timeLeft)}
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="controls">
          <button 
            className="btn btn-primary" 
            onClick={toggleTimer}
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={resetTimer}
          >
            Reset
          </button>
        </div>
        
        <div className="stats">
          <div className="stat-item">
            <span className="stat-value">{sessionCount}</span>
            <div className="stat-label">Today</div>
          </div>
          <div className="stat-item">
            <span className="stat-value">{totalSessions}</span>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-item">
            <span className="stat-value">{Math.floor(totalSessions * settings.workTime / 60)}</span>
            <div className="stat-label">Hours</div>
          </div>
        </div>
        
        <div className="stats-button-container">
          <button 
            className="btn btn-secondary stats-btn"
            onClick={() => setShowStatistics(true)}
          >
            📊 View Statistics
          </button>
        </div>
        
        <div className="settings">
          <div className="setting-item">
            <span className="setting-label">Work (min)</span>
            <input 
              type="number" 
              className="setting-input"
              value={settings.workTime}
              onChange={(e) => updateSetting('workTime', e.target.value)}
              min="1"
              max="60"
            />
          </div>
          <div className="setting-item">
            <span className="setting-label">Short Break (min)</span>
            <input 
              type="number" 
              className="setting-input"
              value={settings.shortBreak}
              onChange={(e) => updateSetting('shortBreak', e.target.value)}
              min="1"
              max="30"
            />
          </div>
          <div className="setting-item">
            <span className="setting-label">Long Break (min)</span>
            <input 
              type="number" 
              className="setting-input"
              value={settings.longBreak}
              onChange={(e) => updateSetting('longBreak', e.target.value)}
              min="1"
              max="60"
            />
          </div>
        </div>
        
        <TaskList 
          tasks={tasks}
          onAddTask={addTask}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          activeTaskId={activeTaskId}
          onSetActiveTask={setActiveTask}
        />
      </div>
      
      {notification && (
        <div className={`notification ${notification ? 'show' : ''}`}>
          <div className="notification-title">{notification.title}</div>
          <div className="notification-message">{notification.message}</div>
        </div>
      )}
      
      {showStatistics && (
        <Statistics 
          dailyStats={dailyStats}
          onClose={() => setShowStatistics(false)}
        />
      )}
    </div>
  );
}

export default App;