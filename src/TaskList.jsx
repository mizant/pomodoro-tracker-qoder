import React, { useState } from 'react';

function TaskList({ tasks, onAddTask, onUpdateTask, onDeleteTask, activeTaskId, onSetActiveTask }) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim());
      setNewTaskTitle('');
      setIsAdding(false);
    }
  };

  const handleTaskComplete = (taskId) => {
    onUpdateTask(taskId, { completed: true });
  };

  const getTaskStatusColor = (task) => {
    if (task.completed) return 'var(--success-color)';
    if (task.id === activeTaskId) return 'var(--primary-color)';
    return 'var(--text-secondary)';
  };

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h3>Tasks</h3>
        {!isAdding && (
          <button 
            className="btn-add-task"
            onClick={() => setIsAdding(true)}
          >
            +
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="add-task-form">
          <input
            type="text"
            placeholder="Enter task name..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="task-input"
            autoFocus
          />
          <div className="task-form-buttons">
            <button type="submit" className="btn btn-primary btn-small">
              Add
            </button>
            <button 
              type="button" 
              className="btn btn-secondary btn-small"
              onClick={() => {
                setIsAdding(false);
                setNewTaskTitle('');
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="tasks">
        {tasks.length === 0 ? (
          <div className="empty-tasks">
            <span>No tasks yet. Add one to get started!</span>
          </div>
        ) : (
          tasks.map(task => (
            <div 
              key={task.id} 
              className={`task-item ${task.id === activeTaskId ? 'active' : ''} ${task.completed ? 'completed' : ''}`}
            >
              <div className="task-content">
                <div 
                  className="task-title"
                  onClick={() => !task.completed && onSetActiveTask(task.id)}
                  style={{ cursor: task.completed ? 'default' : 'pointer' }}
                >
                  {task.title}
                </div>
                <div className="task-pomodoros">
                  <span style={{ color: getTaskStatusColor(task) }}>
                    🍅 {task.pomodoroCount || 0}
                  </span>
                </div>
              </div>
              <div className="task-actions">
                {!task.completed && (
                  <button
                    className="btn-task-complete"
                    onClick={() => handleTaskComplete(task.id)}
                    title="Mark as complete"
                  >
                    ✓
                  </button>
                )}
                <button
                  className="btn-task-delete"
                  onClick={() => onDeleteTask(task.id)}
                  title="Delete task"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {activeTaskId && (
        <div className="current-task">
          <div className="current-task-label">Current Task:</div>
          <div className="current-task-name">
            {tasks.find(t => t.id === activeTaskId)?.title || 'No task selected'}
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskList;