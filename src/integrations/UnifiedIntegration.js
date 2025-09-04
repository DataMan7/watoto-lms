import React, { useState, useEffect } from 'react';
import ExcalidrawCanvas from '../components/ExcalidrawCanvas';
import TeacherCourseCreator from '../components/TeacherCourseCreator';
import StudentCollaboration from '../components/StudentCollaboration';
import LearningAnalytics from '../components/LearningAnalytics';
import SubjectTemplates from '../components/SubjectTemplates';
import CypressTesting from './CypressTesting';
import MathEducation from './MathEducation';
import SystemDesignEducation from './SystemDesignEducation';
import SelfHostingEducation from './SelfHostingEducation';
import OpenSourceEducation from './OpenSourceEducation';
import ProgrammingGame from './ProgrammingGame';
import './UnifiedIntegration.css';

const UnifiedIntegration = ({ user, userRole = 'student' }) => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [userProgress, setUserProgress] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [currentSubject, setCurrentSubject] = useState('general');

  // Integration modules configuration
  const integrationModules = {
    // Core LMS Features
    dashboard: {
      title: 'Learning Dashboard',
      icon: '📊',
      component: 'Dashboard',
      description: 'Personalized learning overview and progress tracking'
    },
    excalidraw: {
      title: 'Visual Learning',
      icon: '🎨',
      component: 'ExcalidrawCanvas',
      description: 'Interactive diagrams and visual content creation'
    },
    collaboration: {
      title: 'Group Collaboration',
      icon: '👥',
      component: 'StudentCollaboration',
      description: 'Real-time collaborative learning sessions'
    },
    analytics: {
      title: 'Learning Analytics',
      icon: '📈',
      component: 'LearningAnalytics',
      description: 'Track progress and learning patterns'
    },

    // Teacher Tools
    courseCreator: {
      title: 'Course Creator',
      icon: '📝',
      component: 'TeacherCourseCreator',
      description: 'Create and manage courses with visual content',
      roles: ['teacher', 'admin']
    },
    templates: {
      title: 'Subject Templates',
      icon: '📋',
      component: 'SubjectTemplates',
      description: 'Pre-built templates for different subjects'
    },

    // Educational Integrations
    cypress: {
      title: 'Automated Testing',
      icon: '🧪',
      component: 'CypressTesting',
      description: 'Learn software testing with Cypress'
    },
    math: {
      title: 'Mathematics Lab',
      icon: '🔢',
      component: 'MathEducation',
      description: 'Interactive mathematics education'
    },
    systemDesign: {
      title: 'System Design',
      icon: '🏗️',
      component: 'SystemDesignEducation',
      description: 'Learn scalable system architecture'
    },
    selfHosting: {
      title: 'Self-Hosting Academy',
      icon: '🖥️',
      component: 'SelfHostingEducation',
      description: 'Master self-hosted infrastructure'
    },
    openSource: {
      title: 'Open Source Hub',
      icon: '🌐',
      component: 'OpenSourceEducation',
      description: 'Explore open source software alternatives'
    },
    programmingGame: {
      title: 'Code Quest',
      icon: '🎮',
      component: 'ProgrammingGame',
      description: 'Gamified programming challenges for all skill levels'
    }
  };

  useEffect(() => {
    loadUserProgress();
    initializeNotifications();
  }, [user]);

  const loadUserProgress = () => {
    // Load user progress from localStorage or API
    const savedProgress = localStorage.getItem(`watoto_progress_${user?.id}`);
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  };

  const initializeNotifications = () => {
    // Initialize with some sample notifications
    setNotifications([
      {
        id: 1,
        type: 'achievement',
        title: 'New Achievement!',
        message: 'Completed your first collaborative session',
        timestamp: new Date(),
        read: false
      },
      {
        id: 2,
        type: 'reminder',
        title: 'Weekly Goal',
        message: 'You\'re 80% towards your weekly learning goal',
        timestamp: new Date(),
        read: false
      }
    ]);
  };

  const updateProgress = (module, progress) => {
    const newProgress = {
      ...userProgress,
      [module]: {
        ...userProgress[module],
        ...progress,
        lastUpdated: new Date().toISOString()
      }
    };
    setUserProgress(newProgress);
    localStorage.setItem(`watoto_progress_${user?.id}`, JSON.stringify(newProgress));
  };

  const handleModuleComplete = (moduleData) => {
    updateProgress(activeModule, { completed: true, ...moduleData });

    // Add achievement notification
    const newNotification = {
      id: Date.now(),
      type: 'achievement',
      title: 'Module Completed!',
      message: `Congratulations on completing ${integrationModules[activeModule].title}`,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const renderModule = () => {
    const moduleConfig = integrationModules[activeModule];

    if (!moduleConfig) return <div>Module not found</div>;

    // Check role-based access
    if (moduleConfig.roles && !moduleConfig.roles.includes(userRole)) {
      return (
        <div className="access-denied">
          <h3>Access Restricted</h3>
          <p>This module is only available for {moduleConfig.roles.join(', ')} accounts.</p>
        </div>
      );
    }

    const commonProps = {
      onProgressUpdate: (progress) => updateProgress(activeModule, progress),
      onComplete: handleModuleComplete
    };

    switch (activeModule) {
      case 'dashboard':
        return <Dashboard user={user} progress={userProgress} notifications={notifications} />;
      case 'excalidraw':
        return <ExcalidrawCanvas subject={currentSubject} {...commonProps} />;
      case 'collaboration':
        return <StudentCollaboration user={user} subject={currentSubject} {...commonProps} />;
      case 'analytics':
        return <LearningAnalytics userId={user?.id} {...commonProps} />;
      case 'courseCreator':
        return <TeacherCourseCreator {...commonProps} />;
      case 'templates':
        return <SubjectTemplates subject={currentSubject} {...commonProps} />;
      case 'cypress':
        return <CypressTesting {...commonProps} />;
      case 'math':
        return <MathEducation {...commonProps} />;
      case 'systemDesign':
        return <SystemDesignEducation {...commonProps} />;
      case 'selfHosting':
        return <SelfHostingEducation {...commonProps} />;
      case 'openSource':
        return <OpenSourceEducation {...commonProps} />;
      case 'programmingGame':
        return <ProgrammingGame user={user} {...commonProps} />;
      default:
        return <div>Select a module to begin learning</div>;
    }
  };

  const renderNotifications = () => {
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
      <div className="notifications-panel">
        <div className="notifications-header">
          <h3>Notifications {unreadCount > 0 && <span className="unread-count">({unreadCount})</span>}</h3>
        </div>
        <div className="notifications-list">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              onClick={() => markNotificationRead(notification.id)}
            >
              <div className="notification-icon">
                {notification.type === 'achievement' ? '🏆' : '🔔'}
              </div>
              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <span className="notification-time">
                  {notification.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="unified-integration">
      <div className="integration-header">
        <div className="header-brand">
          <h1>🏫 Watoto LMS</h1>
          <p>Integrated Learning Management System</p>
        </div>
        <div className="header-user">
          <span className="user-role">{userRole}</span>
          <span className="user-name">{user?.name}</span>
        </div>
      </div>

      <div className="integration-content">
        <div className="modules-sidebar">
          <div className="modules-header">
            <h3>Learning Modules</h3>
            <select
              value={currentSubject}
              onChange={(e) => setCurrentSubject(e.target.value)}
              className="subject-selector"
            >
              <option value="general">General</option>
              <option value="math">Mathematics</option>
              <option value="science">Science</option>
              <option value="english">English</option>
              <option value="history">History</option>
              <option value="art">Art</option>
              <option value="music">Music</option>
              <option value="programming">Programming</option>
            </select>
          </div>

          <div className="modules-list">
            {Object.entries(integrationModules).map(([key, module]) => {
              // Hide teacher-only modules for students
              if (module.roles && !module.roles.includes(userRole)) return null;

              const progress = userProgress[key];
              const isCompleted = progress?.completed;

              return (
                <button
                  key={key}
                  className={`module-btn ${activeModule === key ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => setActiveModule(key)}
                >
                  <div className="module-icon">{module.icon}</div>
                  <div className="module-info">
                    <h4>{module.title}</h4>
                    <p>{module.description}</p>
                    {isCompleted && <span className="completion-badge">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="main-content">
          <div className="content-header">
            <h2>{integrationModules[activeModule]?.title}</h2>
            <p>{integrationModules[activeModule]?.description}</p>
          </div>

          <div className="module-content">
            {renderModule()}
          </div>
        </div>

        <div className="right-sidebar">
          {renderNotifications()}

          <div className="progress-summary">
            <h3>Learning Progress</h3>
            <div className="progress-stats">
              <div className="stat-item">
                <span className="stat-label">Modules Completed:</span>
                <span className="stat-value">
                  {Object.values(userProgress).filter(p => p.completed).length}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Modules:</span>
                <span className="stat-value">{Object.keys(integrationModules).length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Overall Progress:</span>
                <span className="stat-value">
                  {Math.round((Object.values(userProgress).filter(p => p.completed).length / Object.keys(integrationModules).length) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Dashboard component
const Dashboard = ({ user, progress, notifications }) => {
  const completedModules = Object.values(progress).filter(p => p.completed).length;
  const totalModules = 12; // Total number of modules
  const completionRate = Math.round((completedModules / totalModules) * 100);

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h2>Welcome back, {user?.name}!</h2>
        <p>Continue your learning journey with our integrated educational platform.</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card progress-card">
          <h3>📊 Your Progress</h3>
          <div className="progress-circle">
            <div className="progress-value">{completionRate}%</div>
            <div className="progress-label">Complete</div>
          </div>
          <p>{completedModules} of {totalModules} modules completed</p>
        </div>

        <div className="dashboard-card recent-activity">
          <h3>🔔 Recent Activity</h3>
          <div className="activity-list">
            {notifications.slice(0, 3).map(notification => (
              <div key={notification.id} className="activity-item">
                <div className="activity-icon">
                  {notification.type === 'achievement' ? '🏆' : '🔔'}
                </div>
                <div className="activity-content">
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card quick-actions">
          <h3>🚀 Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-btn">🎨 Start Drawing</button>
            <button className="action-btn">👥 Join Collaboration</button>
            <button className="action-btn">📝 Create Course</button>
            <button className="action-btn">🔢 Math Practice</button>
          </div>
        </div>

        <div className="dashboard-card learning-paths">
          <h3>🛤️ Learning Paths</h3>
          <div className="path-list">
            <div className="path-item">
              <h4>Visual Learning Mastery</h4>
              <p>Master Excalidraw and visual communication</p>
              <div className="path-progress">60% complete</div>
            </div>
            <div className="path-item">
              <h4>Technical Foundations</h4>
              <p>Learn system design and self-hosting</p>
              <div className="path-progress">30% complete</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedIntegration;