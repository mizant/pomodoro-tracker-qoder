import React, { useState, useMemo } from 'react';

function Statistics({ dailyStats, onClose }) {
  const [currentView, setCurrentView] = useState('monthly'); // 'daily' or 'monthly'
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Get current month data
  const currentMonthData = useMemo(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthData = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayStats = dailyStats[dateKey] || { pomodoros: 0, completedTasks: 0 };
      
      monthData.push({
        date: new Date(year, month, day),
        dateKey,
        ...dayStats
      });
    }
    
    return monthData;
  }, [selectedMonth, dailyStats]);

  // Get today's stats
  const todayStats = useMemo(() => {
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return dailyStats[todayKey] || { pomodoros: 0, completedTasks: 0 };
  }, [dailyStats]);

  // Calculate monthly totals
  const monthlyTotals = useMemo(() => {
    return currentMonthData.reduce((totals, day) => ({
      pomodoros: totals.pomodoros + day.pomodoros,
      completedTasks: totals.completedTasks + day.completedTasks
    }), { pomodoros: 0, completedTasks: 0 });
  }, [currentMonthData]);

  const navigateMonth = (direction) => {
    setSelectedMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getIntensityClass = (pomodoros) => {
    if (pomodoros === 0) return 'intensity-0';
    if (pomodoros <= 2) return 'intensity-1';
    if (pomodoros <= 4) return 'intensity-2';
    if (pomodoros <= 6) return 'intensity-3';
    return 'intensity-4';
  };

  const renderCalendarGrid = () => {
    const firstDay = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="calendar-container">
        <div className="calendar-header">
          <div className="month-navigation">
            <button 
              className="btn-nav" 
              onClick={() => navigateMonth(-1)}
            >
              ←
            </button>
            <h3>{formatMonthYear(selectedMonth)}</h3>
            <button 
              className="btn-nav" 
              onClick={() => navigateMonth(1)}
            >
              →
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          {/* Day headers */}
          {daysOfWeek.map(day => (
            <div key={day} className="day-header">{day}</div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array(startingDayOfWeek).fill(null).map((_, index) => (
            <div key={`empty-${index}`} className="calendar-day empty"></div>
          ))}

          {/* Days of the month */}
          {currentMonthData.map(day => (
            <div 
              key={day.dateKey} 
              className={`calendar-day ${getIntensityClass(day.pomodoros)}`}
              title={`${day.pomodoros} pomodoros, ${day.completedTasks} tasks completed`}
            >
              <div className="day-number">{day.date.getDate()}</div>
              <div className="day-stats">
                {day.pomodoros > 0 && (
                  <span className="stat-badge pomodoro-badge">{day.pomodoros}🍅</span>
                )}
                {day.completedTasks > 0 && (
                  <span className="stat-badge task-badge">{day.completedTasks}✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="statistics-overlay">
      <div className="statistics-modal">
        <div className="statistics-header">
          <h2>Statistics</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="view-toggle">
          <button 
            className={`btn-toggle ${currentView === 'daily' ? 'active' : ''}`}
            onClick={() => setCurrentView('daily')}
          >
            Today
          </button>
          <button 
            className={`btn-toggle ${currentView === 'monthly' ? 'active' : ''}`}
            onClick={() => setCurrentView('monthly')}
          >
            Monthly
          </button>
        </div>

        {currentView === 'daily' ? (
          <div className="daily-view">
            <div className="today-stats">
              <h3>Today's Progress</h3>
              <div className="stats-cards">
                <div className="stat-card">
                  <div className="stat-icon">🍅</div>
                  <div className="stat-info">
                    <div className="stat-number">{todayStats.pomodoros}</div>
                    <div className="stat-label">Pomodoros</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <div className="stat-number">{todayStats.completedTasks}</div>
                    <div className="stat-label">Tasks Completed</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⏰</div>
                  <div className="stat-info">
                    <div className="stat-number">{Math.floor(todayStats.pomodoros * 25 / 60)}</div>
                    <div className="stat-label">Hours Focused</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="monthly-view">
            <div className="monthly-summary">
              <div className="summary-cards">
                <div className="summary-card">
                  <div className="summary-number">{monthlyTotals.pomodoros}</div>
                  <div className="summary-label">Total Pomodoros</div>
                </div>
                <div className="summary-card">
                  <div className="summary-number">{monthlyTotals.completedTasks}</div>
                  <div className="summary-label">Tasks Completed</div>
                </div>
                <div className="summary-card">
                  <div className="summary-number">{Math.floor(monthlyTotals.pomodoros * 25 / 60)}</div>
                  <div className="summary-label">Hours Focused</div>
                </div>
              </div>
            </div>
            
            {renderCalendarGrid()}

            <div className="legend">
              <span className="legend-label">Pomodoro Activity:</span>
              <div className="legend-items">
                <div className="legend-item">
                  <div className="legend-box intensity-0"></div>
                  <span>0</span>
                </div>
                <div className="legend-item">
                  <div className="legend-box intensity-1"></div>
                  <span>1-2</span>
                </div>
                <div className="legend-item">
                  <div className="legend-box intensity-2"></div>
                  <span>3-4</span>
                </div>
                <div className="legend-item">
                  <div className="legend-box intensity-3"></div>
                  <span>5-6</span>
                </div>
                <div className="legend-item">
                  <div className="legend-box intensity-4"></div>
                  <span>7+</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Statistics;