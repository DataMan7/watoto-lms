import React, { useState, useEffect } from 'react';
import './LearningAnalytics.css';

const LearningAnalytics = ({
  userId,
  subject,
  timeRange = 'week',
  onExportData
}) => {
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalDiagrams: 0,
      totalEdits: 0,
      collaborationTime: 0,
      averageSessionLength: 0
    },
    subjectBreakdown: {},
    learningPatterns: [],
    collaborationMetrics: {},
    progressIndicators: []
  });

  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, [userId, subject, timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual API integration
      const mockData = generateMockAnalytics();
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockAnalytics = () => {
    return {
      overview: {
        totalDiagrams: 24,
        totalEdits: 156,
        collaborationTime: 12.5, // hours
        averageSessionLength: 45 // minutes
      },
      subjectBreakdown: {
        math: { diagrams: 8, timeSpent: 6.5, accuracy: 85 },
        science: { diagrams: 6, timeSpent: 4.2, accuracy: 78 },
        english: { diagrams: 5, timeSpent: 3.8, accuracy: 92 },
        history: { diagrams: 3, timeSpent: 2.1, accuracy: 88 },
        art: { diagrams: 2, timeSpent: 1.9, accuracy: 95 }
      },
      learningPatterns: [
        { day: 'Mon', diagrams: 4, time: 2.1 },
        { day: 'Tue', diagrams: 6, time: 3.2 },
        { day: 'Wed', diagrams: 3, time: 1.8 },
        { day: 'Thu', diagrams: 5, time: 2.9 },
        { day: 'Fri', diagrams: 4, time: 2.3 },
        { day: 'Sat', diagrams: 1, time: 0.8 },
        { day: 'Sun', diagrams: 1, time: 0.4 }
      ],
      collaborationMetrics: {
        totalSessions: 8,
        averageParticipants: 3.2,
        mostActiveCollaborator: 'Alice Johnson',
        collaborationEfficiency: 87
      },
      progressIndicators: [
        {
          skill: 'Visual Communication',
          current: 85,
          target: 90,
          trend: 'improving'
        },
        {
          skill: 'Subject Application',
          current: 78,
          target: 85,
          trend: 'improving'
        },
        {
          skill: 'Collaborative Learning',
          current: 92,
          target: 95,
          trend: 'stable'
        },
        {
          skill: 'Creative Problem Solving',
          current: 71,
          target: 80,
          trend: 'improving'
        }
      ]
    };
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return '#4caf50';
    if (percentage >= 70) return '#ff9800';
    return '#f44336';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'stable': return '➡️';
      case 'declining': return '📉';
      default: return '➡️';
    }
  };

  const exportAnalytics = async () => {
    const exportData = {
      userId,
      subject,
      timeRange,
      data: analyticsData,
      exportedAt: new Date().toISOString()
    };

    try {
      await onExportData(exportData);
      alert('Analytics data exported successfully!');
    } catch (error) {
      alert('Error exporting data: ' + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="analytics-loading">
        <div className="analytics-spinner"></div>
        <p>Loading learning analytics...</p>
      </div>
    );
  }

  return (
    <div className="learning-analytics">
      <div className="analytics-header">
        <div className="header-info">
          <h1>Learning Analytics Dashboard</h1>
          <p>Track your visual learning progress and collaboration patterns</p>
        </div>
        <div className="header-actions">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button onClick={exportAnalytics} className="export-btn">
            📊 Export Data
          </button>
        </div>
      </div>

      <div className="analytics-navigation">
        {['overview', 'subjects', 'patterns', 'collaboration', 'progress'].map(metric => (
          <button
            key={metric}
            className={`nav-btn ${selectedMetric === metric ? 'active' : ''}`}
            onClick={() => setSelectedMetric(metric)}
          >
            {metric.charAt(0).toUpperCase() + metric.slice(1)}
          </button>
        ))}
      </div>

      <div className="analytics-content">
        {selectedMetric === 'overview' && (
          <div className="overview-section">
            <h2>Learning Overview</h2>
            <div className="overview-grid">
              <div className="metric-card">
                <div className="metric-icon">🎨</div>
                <div className="metric-content">
                  <h3>{analyticsData.overview.totalDiagrams}</h3>
                  <p>Total Diagrams Created</p>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">✏️</div>
                <div className="metric-content">
                  <h3>{analyticsData.overview.totalEdits}</h3>
                  <p>Total Edits Made</p>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">⏱️</div>
                <div className="metric-content">
                  <h3>{analyticsData.overview.collaborationTime}h</h3>
                  <p>Collaboration Time</p>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">📊</div>
                <div className="metric-content">
                  <h3>{analyticsData.overview.averageSessionLength}m</h3>
                  <p>Avg Session Length</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedMetric === 'subjects' && (
          <div className="subjects-section">
            <h2>Subject Performance</h2>
            <div className="subjects-grid">
              {Object.entries(analyticsData.subjectBreakdown).map(([subj, data]) => (
                <div key={subj} className="subject-card">
                  <div className="subject-header">
                    <h3>{subj.charAt(0).toUpperCase() + subj.slice(1)}</h3>
                    <span className="accuracy-badge" style={{ backgroundColor: getProgressColor(data.accuracy) }}>
                      {data.accuracy}% accuracy
                    </span>
                  </div>
                  <div className="subject-stats">
                    <div className="stat">
                      <span className="stat-label">Diagrams:</span>
                      <span className="stat-value">{data.diagrams}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Time Spent:</span>
                      <span className="stat-value">{data.timeSpent}h</span>
                    </div>
                  </div>
                  <div className="subject-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${data.accuracy}%`, backgroundColor: getProgressColor(data.accuracy) }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedMetric === 'patterns' && (
          <div className="patterns-section">
            <h2>Learning Patterns</h2>
            <div className="patterns-chart">
              <div className="chart-header">
                <h3>Activity Over Time</h3>
              </div>
              <div className="chart-grid">
                {analyticsData.learningPatterns.map((pattern, index) => (
                  <div key={index} className="chart-bar">
                    <div className="bar-container">
                      <div
                        className="bar-fill diagrams"
                        style={{ height: `${(pattern.diagrams / 6) * 100}%` }}
                        title={`${pattern.diagrams} diagrams`}
                      ></div>
                      <div
                        className="bar-fill time"
                        style={{ height: `${(pattern.time / 3.2) * 100}%` }}
                        title={`${pattern.time}h spent`}
                      ></div>
                    </div>
                    <span className="bar-label">{pattern.day}</span>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color diagrams"></div>
                  <span>Diagrams Created</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color time"></div>
                  <span>Time Spent (hours)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedMetric === 'collaboration' && (
          <div className="collaboration-section">
            <h2>Collaboration Metrics</h2>
            <div className="collaboration-grid">
              <div className="collab-card">
                <div className="collab-icon">👥</div>
                <div className="collab-content">
                  <h3>{analyticsData.collaborationMetrics.totalSessions}</h3>
                  <p>Total Sessions</p>
                </div>
              </div>

              <div className="collab-card">
                <div className="collab-icon">📈</div>
                <div className="collab-content">
                  <h3>{analyticsData.collaborationMetrics.averageParticipants}</h3>
                  <p>Avg Participants</p>
                </div>
              </div>

              <div className="collab-card">
                <div className="collab-icon">🏆</div>
                <div className="collab-content">
                  <h3>{analyticsData.collaborationMetrics.collaborationEfficiency}%</h3>
                  <p>Efficiency Rate</p>
                </div>
              </div>
            </div>

            <div className="top-collaborator">
              <h3>Most Active Collaborator</h3>
              <div className="collaborator-info">
                <div className="collaborator-avatar">
                  {analyticsData.collaborationMetrics.mostActiveCollaborator.charAt(0)}
                </div>
                <div className="collaborator-details">
                  <h4>{analyticsData.collaborationMetrics.mostActiveCollaborator}</h4>
                  <p>Top contributor this period</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedMetric === 'progress' && (
          <div className="progress-section">
            <h2>Skill Development Progress</h2>
            <div className="progress-indicators">
              {analyticsData.progressIndicators.map((indicator, index) => (
                <div key={index} className="progress-item">
                  <div className="progress-header">
                    <h3>{indicator.skill}</h3>
                    <span className="trend-icon">{getTrendIcon(indicator.trend)}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${indicator.current}%`,
                        backgroundColor: getProgressColor(indicator.current)
                      }}
                    ></div>
                    <div
                      className="progress-target"
                      style={{ left: `${indicator.target}%` }}
                      title={`Target: ${indicator.target}%`}
                    ></div>
                  </div>
                  <div className="progress-values">
                    <span className="current-value">{indicator.current}%</span>
                    <span className="target-value">Target: {indicator.target}%</span>
                  </div>
                  <div className="progress-status">
                    <span className={`status-badge ${indicator.trend}`}>
                      {indicator.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningAnalytics;