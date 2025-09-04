import React, { useState, useEffect } from 'react';
import './SelfHostingEducation.css';

const SelfHostingEducation = ({
  category = 'all',
  difficulty = 'beginner',
  onProjectComplete,
  onProgressUpdate
}) => {
  const [currentProject, setCurrentProject] = useState(null);
  const [projectProgress, setProjectProgress] = useState({});
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [activeTab, setActiveTab] = useState('overview');

  // Self-hosting projects inspired by awesome-selfhosted
  const selfHostingProjects = {
    media: {
      title: 'Media Server Setup',
      description: 'Build your own Netflix-like streaming service',
      difficulty: 'intermediate',
      tools: ['Jellyfin', 'Plex', 'Emby'],
      steps: [
        {
          title: 'Install Docker',
          description: 'Set up Docker environment for containerized deployment',
          commands: [
            'curl -fsSL https://get.docker.com -o get-docker.sh',
            'sudo sh get-docker.sh',
            'sudo usermod -aG docker $USER'
          ],
          verification: 'docker --version'
        },
        {
          title: 'Deploy Media Server',
          description: 'Deploy Jellyfin using Docker Compose',
          commands: [
            'mkdir jellyfin && cd jellyfin',
            'nano docker-compose.yml',
            '# Add Jellyfin configuration'
          ],
          config: `version: '3.8'
services:
  jellyfin:
    image: jellyfin/jellyfin:latest
    container_name: jellyfin
    volumes:
      - ./config:/config
      - ./cache:/cache
      - /media:/media
    ports:
      - "8096:8096"
    restart: unless-stopped`
        },
        {
          title: 'Configure Media Library',
          description: 'Add your media files and organize library',
          tasks: [
            'Create media directories',
            'Copy media files',
            'Configure library settings',
            'Set up user accounts'
          ]
        },
        {
          title: 'Set up Reverse Proxy',
          description: 'Configure Nginx for secure access',
          commands: [
            'sudo apt install nginx',
            'sudo nano /etc/nginx/sites-available/jellyfin',
            '# Add reverse proxy configuration'
          ]
        }
      ],
      learning: [
        'Containerization with Docker',
        'Network configuration',
        'Storage management',
        'Security hardening',
        'Backup strategies'
      ]
    },
    productivity: {
      title: 'Personal Productivity Suite',
      description: 'Create your own Google Workspace alternative',
      difficulty: 'advanced',
      tools: ['Nextcloud', 'OnlyOffice', 'Mailcow'],
      steps: [
        {
          title: 'Set up Nextcloud',
          description: 'Deploy file storage and collaboration platform',
          commands: [
            'docker run -d --name nextcloud -p 8080:80 nextcloud:latest'
          ]
        },
        {
          title: 'Configure OnlyOffice',
          description: 'Add document editing capabilities',
          commands: [
            'docker run -d --name onlyoffice -p 8081:80 onlyoffice/documentserver:latest'
          ]
        },
        {
          title: 'Set up Email Server',
          description: 'Deploy Mailcow for email services',
          commands: [
            'git clone https://github.com/mailcow/mailcow-dockerized',
            'cd mailcow-dockerized',
            './generate_config.sh'
          ]
        }
      ],
      learning: [
        'File synchronization',
        'Document collaboration',
        'Email server administration',
        'Integration patterns',
        'User management'
      ]
    },
    development: {
      title: 'Development Environment',
      description: 'Build a complete development infrastructure',
      difficulty: 'advanced',
      tools: ['GitLab', 'Jenkins', 'SonarQube'],
      steps: [
        {
          title: 'Deploy GitLab',
          description: 'Set up Git repository management',
          commands: [
            'docker run -d --name gitlab -p 8082:80 gitlab/gitlab-ce:latest'
          ]
        },
        {
          title: 'Configure CI/CD',
          description: 'Set up Jenkins for automated testing',
          commands: [
            'docker run -d --name jenkins -p 8083:8080 jenkins/jenkins:lts'
          ]
        },
        {
          title: 'Add Code Quality',
          description: 'Deploy SonarQube for code analysis',
          commands: [
            'docker run -d --name sonarqube -p 9000:9000 sonarqube:latest'
          ]
        }
      ],
      learning: [
        'Version control systems',
        'Continuous integration',
        'Code quality analysis',
        'DevOps practices',
        'Infrastructure as Code'
      ]
    },
    communication: {
      title: 'Communication Platform',
      description: 'Create your own Slack/Teams alternative',
      difficulty: 'intermediate',
      tools: ['Mattermost', 'Rocket.Chat', 'Zulip'],
      steps: [
        {
          title: 'Deploy Mattermost',
          description: 'Set up team communication platform',
          commands: [
            'docker run -d --name mattermost -p 8065:8065 mattermost/mattermost-team-edition:latest'
          ]
        },
        {
          title: 'Configure Database',
          description: 'Set up PostgreSQL for Mattermost',
          commands: [
            'docker run -d --name postgres -e POSTGRES_PASSWORD=password postgres:13'
          ]
        },
        {
          title: 'Set up SSL',
          description: 'Configure HTTPS with Let\'s Encrypt',
          commands: [
            'docker run -d --name nginx-proxy -p 80:80 -p 443:443 jwilder/nginx-proxy',
            'docker run -d --name letsencrypt jrcs/letsencrypt-nginx-proxy-companion'
          ]
        }
      ],
      learning: [
        'Real-time communication',
        'Database integration',
        'SSL/TLS configuration',
        'Container networking',
        'Web security'
      ]
    },
    analytics: {
      title: 'Data Analytics Platform',
      description: 'Build your own data processing and visualization platform',
      difficulty: 'expert',
      tools: ['Grafana', 'Prometheus', 'Elasticsearch'],
      steps: [
        {
          title: 'Set up Monitoring',
          description: 'Deploy Prometheus for metrics collection',
          commands: [
            'docker run -d --name prometheus -p 9090:9090 prom/prometheus:latest'
          ]
        },
        {
          title: 'Configure Visualization',
          description: 'Set up Grafana for dashboards',
          commands: [
            'docker run -d --name grafana -p 3000:3000 grafana/grafana:latest'
          ]
        },
        {
          title: 'Add Data Storage',
          description: 'Deploy Elasticsearch for data indexing',
          commands: [
            'docker run -d --name elasticsearch -p 9200:9200 elasticsearch:7.10.0'
          ]
        }
      ],
      learning: [
        'Time series data',
        'Data visualization',
        'Search and analytics',
        'Monitoring systems',
        'Infrastructure metrics'
      ]
    }
  };

  useEffect(() => {
    if (category !== 'all') {
      const projects = Object.values(selfHostingProjects).filter(p =>
        category === 'all' || p.difficulty === difficulty
      );
      if (projects.length > 0) {
        setCurrentProject(projects[0]);
      }
    }
  }, [category, difficulty]);

  const selectProject = (project) => {
    setCurrentProject(project);
    setProjectProgress({});
    setCompletedSteps(new Set());
    setActiveTab('overview');
  };

  const markStepComplete = (stepIndex) => {
    setCompletedSteps(prev => new Set([...prev, stepIndex]));
    setProjectProgress(prev => ({
      ...prev,
      [stepIndex]: 100
    }));

    onProgressUpdate?.({
      project: currentProject.title,
      step: stepIndex,
      completed: true,
      totalSteps: currentProject.steps.length
    });
  };

  const completeProject = () => {
    onProjectComplete?.({
      project: currentProject,
      completedSteps: completedSteps.size,
      totalSteps: currentProject.steps.length,
      completionRate: (completedSteps.size / currentProject.steps.length) * 100
    });
  };

  const renderProjectCard = (project, index) => (
    <div
      key={index}
      className={`project-card ${currentProject?.title === project.title ? 'active' : ''}`}
      onClick={() => selectProject(project)}
    >
      <div className="project-header">
        <h3>{project.title}</h3>
        <span className={`difficulty-badge ${project.difficulty}`}>
          {project.difficulty}
        </span>
      </div>
      <p className="project-description">{project.description}</p>
      <div className="project-tools">
        <h4>Tools:</h4>
        <div className="tools-list">
          {project.tools.map((tool, toolIndex) => (
            <span key={toolIndex} className="tool-tag">{tool}</span>
          ))}
        </div>
      </div>
      <div className="project-learning">
        <h4>You'll Learn:</h4>
        <ul>
          {project.learning.slice(0, 3).map((item, itemIndex) => (
            <li key={itemIndex}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderStep = (step, index) => {
    const isCompleted = completedSteps.has(index);

    return (
      <div key={index} className={`project-step ${isCompleted ? 'completed' : ''}`}>
        <div className="step-header">
          <div className="step-status">
            <div className={`status-indicator ${isCompleted ? 'completed' : 'pending'}`}>
              {isCompleted ? '✓' : index + 1}
            </div>
          </div>
          <div className="step-content">
            <h4>{step.title}</h4>
            <p>{step.description}</p>
          </div>
        </div>

        {step.commands && (
          <div className="step-commands">
            <h5>Commands:</h5>
            <div className="command-list">
              {step.commands.map((command, cmdIndex) => (
                <div key={cmdIndex} className="command-item">
                  <code>{command}</code>
                  <button
                    className="copy-btn"
                    onClick={() => navigator.clipboard.writeText(command)}
                    title="Copy to clipboard"
                  >
                    📋
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {step.config && (
          <div className="step-config">
            <h5>Configuration:</h5>
            <pre className="config-code">{step.config}</pre>
          </div>
        )}

        {step.tasks && (
          <div className="step-tasks">
            <h5>Tasks:</h5>
            <ul>
              {step.tasks.map((task, taskIndex) => (
                <li key={taskIndex}>{task}</li>
              ))}
            </ul>
          </div>
        )}

        {!isCompleted && (
          <div className="step-actions">
            <button
              onClick={() => markStepComplete(index)}
              className="complete-btn"
            >
              Mark as Complete
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="self-hosting-education">
      <div className="hosting-header">
        <h2>Self-Hosting Education Platform</h2>
        <p>Learn to deploy and manage your own digital infrastructure</p>
      </div>

      <div className="hosting-content">
        <div className="projects-sidebar">
          <h3>Available Projects</h3>
          <div className="projects-grid">
            {Object.values(selfHostingProjects).map((project, index) =>
              renderProjectCard(project, index)
            )}
          </div>
        </div>

        {currentProject && (
          <div className="project-details">
            <div className="project-header">
              <div className="project-info">
                <h2>{currentProject.title}</h2>
                <p>{currentProject.description}</p>
                <div className="project-meta">
                  <span className="difficulty">{currentProject.difficulty}</span>
                  <span className="progress">
                    {completedSteps.size}/{currentProject.steps.length} steps completed
                  </span>
                </div>
              </div>

              <div className="project-actions">
                <button
                  onClick={completeProject}
                  disabled={completedSteps.size !== currentProject.steps.length}
                  className="complete-project-btn"
                >
                  Complete Project
                </button>
              </div>
            </div>

            <div className="project-tabs">
              <button
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`tab-btn ${activeTab === 'steps' ? 'active' : ''}`}
                onClick={() => setActiveTab('steps')}
              >
                Implementation Steps
              </button>
              <button
                className={`tab-btn ${activeTab === 'learning' ? 'active' : ''}`}
                onClick={() => setActiveTab('learning')}
              >
                Learning Outcomes
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  <div className="project-overview">
                    <h3>Project Overview</h3>
                    <p>{currentProject.description}</p>

                    <div className="tools-section">
                      <h4>Tools You'll Use</h4>
                      <div className="tools-grid">
                        {currentProject.tools.map((tool, index) => (
                          <div key={index} className="tool-item">
                            <span className="tool-name">{tool}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="difficulty-section">
                      <h4>Difficulty Level</h4>
                      <div className="difficulty-info">
                        <span className={`difficulty-level ${currentProject.difficulty}`}>
                          {currentProject.difficulty.charAt(0).toUpperCase() + currentProject.difficulty.slice(1)}
                        </span>
                        <p>
                          {currentProject.difficulty === 'beginner' && 'Perfect for those new to self-hosting'}
                          {currentProject.difficulty === 'intermediate' && 'Requires basic Linux and Docker knowledge'}
                          {currentProject.difficulty === 'advanced' && 'Advanced configuration and troubleshooting required'}
                          {currentProject.difficulty === 'expert' && 'Complex multi-service orchestration'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'steps' && (
                <div className="steps-tab">
                  <h3>Implementation Steps</h3>
                  <div className="steps-container">
                    {currentProject.steps.map((step, index) => renderStep(step, index))}
                  </div>
                </div>
              )}

              {activeTab === 'learning' && (
                <div className="learning-tab">
                  <h3>What You'll Learn</h3>
                  <div className="learning-outcomes">
                    {currentProject.learning.map((outcome, index) => (
                      <div key={index} className="learning-item">
                        <div className="learning-icon">🎯</div>
                        <span className="learning-text">{outcome}</span>
                      </div>
                    ))}
                  </div>

                  <div className="additional-resources">
                    <h4>Additional Resources</h4>
                    <ul>
                      <li>Docker documentation and best practices</li>
                      <li>Linux server administration guides</li>
                      <li>Network configuration tutorials</li>
                      <li>Security hardening checklists</li>
                      <li>Backup and recovery strategies</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelfHostingEducation;