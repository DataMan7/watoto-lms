import React, { useState, useEffect } from 'react';
import './OpenSourceEducation.css';

const OpenSourceEducation = ({
  category = 'all',
  focus = 'alternatives',
  onResourceSelect,
  onLearningPathComplete
}) => {
  const [currentCategory, setCurrentCategory] = useState(category);
  const [selectedResource, setSelectedResource] = useState(null);
  const [learningProgress, setLearningProgress] = useState({});
  const [completedResources, setCompletedResources] = useState(new Set());

  // Open source education resources inspired by openalternative
  const openSourceResources = {
    productivity: {
      title: 'Productivity & Collaboration',
      description: 'Open source alternatives to proprietary productivity tools',
      resources: [
        {
          name: 'LibreOffice',
          proprietary: 'Microsoft Office',
          description: 'Complete office suite with word processing, spreadsheets, and presentations',
          features: ['Writer', 'Calc', 'Impress', 'Draw', 'Base'],
          learning: [
            'Document creation and formatting',
            'Data analysis with spreadsheets',
            'Presentation design',
            'Database management'
          ],
          difficulty: 'beginner',
          install: 'sudo apt install libreoffice'
        },
        {
          name: 'Nextcloud',
          proprietary: 'Google Drive / Dropbox',
          description: 'Self-hosted file storage and collaboration platform',
          features: ['File sync', 'Calendar', 'Contacts', 'Video calls', 'Office integration'],
          learning: [
            'File synchronization',
            'Team collaboration',
            'Self-hosting fundamentals',
            'Data privacy and security'
          ],
          difficulty: 'intermediate',
          install: 'docker run -d nextcloud:latest'
        },
        {
          name: 'Jitsi Meet',
          proprietary: 'Zoom / Microsoft Teams',
          description: 'Secure video conferencing platform',
          features: ['HD video calls', 'Screen sharing', 'Chat', 'Recording', 'Mobile apps'],
          learning: [
            'Video communication',
            'WebRTC technology',
            'Server deployment',
            'Security best practices'
          ],
          difficulty: 'intermediate',
          install: 'docker run -d jitsi/web:latest'
        }
      ]
    },
    development: {
      title: 'Development Tools',
      description: 'Open source development environments and tools',
      resources: [
        {
          name: 'VS Code',
          proprietary: 'Visual Studio',
          description: 'Feature-rich code editor with extensions',
          features: ['IntelliSense', 'Debugging', 'Git integration', 'Extensions marketplace'],
          learning: [
            'Code editing techniques',
            'Version control with Git',
            'Extension development',
            'Productivity workflows'
          ],
          difficulty: 'beginner',
          install: 'Download from Microsoft website'
        },
        {
          name: 'Git',
          proprietary: 'Proprietary VCS',
          description: 'Distributed version control system',
          features: ['Branching', 'Merging', 'History tracking', 'Collaboration'],
          learning: [
            'Version control concepts',
            'Branching strategies',
            'Code review processes',
            'Team collaboration'
          ],
          difficulty: 'beginner',
          install: 'sudo apt install git'
        },
        {
          name: 'Docker',
          proprietary: 'Virtual Machines',
          description: 'Containerization platform for applications',
          features: ['Containerization', 'Orchestration', 'Image management', 'Networking'],
          learning: [
            'Container concepts',
            'Dockerfile creation',
            'Container orchestration',
            'Microservices architecture'
          ],
          difficulty: 'intermediate',
          install: 'curl -fsSL https://get.docker.com | sh'
        }
      ]
    },
    communication: {
      title: 'Communication & Social',
      description: 'Open source communication and social platforms',
      resources: [
        {
          name: 'Mastodon',
          proprietary: 'Twitter',
          description: 'Decentralized social networking platform',
          features: ['Microblogging', 'Federation', 'Privacy controls', 'Custom themes'],
          learning: [
            'Decentralized systems',
            'Fediverse concepts',
            'Privacy and data ownership',
            'Community management'
          ],
          difficulty: 'intermediate',
          install: 'docker run -d tootsuite/mastodon'
        },
        {
          name: 'Matrix',
          proprietary: 'Slack / Discord',
          description: 'Decentralized communication platform',
          features: ['Chat rooms', 'Voice calls', 'File sharing', 'End-to-end encryption'],
          learning: [
            'Decentralized communication',
            'End-to-end encryption',
            'Protocol design',
            'Self-hosting chat systems'
          ],
          difficulty: 'advanced',
          install: 'docker run -d matrixdotorg/synapse'
        },
        {
          name: 'PeerTube',
          proprietary: 'YouTube',
          description: 'Decentralized video sharing platform',
          features: ['Video upload', 'Streaming', 'Federation', 'Privacy-focused'],
          learning: [
            'Video streaming technology',
            'Federated systems',
            'Content moderation',
            'Digital rights management'
          ],
          difficulty: 'advanced',
          install: 'docker run -d chocobozzz/peertube'
        }
      ]
    },
    education: {
      title: 'Educational Platforms',
      description: 'Open source learning management systems',
      resources: [
        {
          name: 'Moodle',
          proprietary: 'Blackboard / Canvas',
          description: 'Learning management system for online education',
          features: ['Course management', 'Assignments', 'Quizzes', 'Progress tracking'],
          learning: [
            'LMS administration',
            'Course design',
            'Assessment creation',
            'Student progress tracking'
          ],
          difficulty: 'intermediate',
          install: 'Download from moodle.org'
        },
        {
          name: 'Open edX',
          proprietary: 'Coursera / edX',
          description: 'Platform for creating and hosting online courses',
          features: ['Course authoring', 'Video lectures', 'Assessments', 'Certificates'],
          learning: [
            'Online course design',
            'Educational technology',
            'Assessment strategies',
            'Learning analytics'
          ],
          difficulty: 'advanced',
          install: 'git clone https://github.com/openedx/edx-platform'
        },
        {
          name: 'Khan Academy Software',
          proprietary: 'Proprietary LMS',
          description: 'Educational content and assessment platform',
          features: ['Video lessons', 'Practice exercises', 'Progress tracking', 'Teacher tools'],
          learning: [
            'Educational content creation',
            'Adaptive learning',
            'Assessment design',
            'Student engagement'
          ],
          difficulty: 'advanced',
          install: 'git clone https://github.com/Khan/khan-api'
        }
      ]
    },
    creativity: {
      title: 'Creative Tools',
      description: 'Open source creative and media tools',
      resources: [
        {
          name: 'GIMP',
          proprietary: 'Photoshop',
          description: 'Professional image editing software',
          features: ['Layer editing', 'Filters', 'Brushes', 'File formats'],
          learning: [
            'Digital image editing',
            'Graphic design principles',
            'Color theory',
            'File format optimization'
          ],
          difficulty: 'intermediate',
          install: 'sudo apt install gimp'
        },
        {
          name: 'Blender',
          proprietary: 'Maya / 3ds Max',
          description: '3D creation suite for modeling, animation, and rendering',
          features: ['3D modeling', 'Animation', 'Rendering', 'Video editing'],
          learning: [
            '3D modeling techniques',
            'Animation principles',
            'Rendering workflows',
            'Visual effects'
          ],
          difficulty: 'advanced',
          install: 'sudo apt install blender'
        },
        {
          name: 'Audacity',
          proprietary: 'Audition',
          description: 'Multi-track audio editor and recorder',
          features: ['Audio recording', 'Editing', 'Effects', 'Export formats'],
          learning: [
            'Audio production',
            'Sound design',
            'Music editing',
            'Podcast creation'
          ],
          difficulty: 'beginner',
          install: 'sudo apt install audacity'
        }
      ]
    },
    infrastructure: {
      title: 'Infrastructure & DevOps',
      description: 'Open source infrastructure and deployment tools',
      resources: [
        {
          name: 'Kubernetes',
          proprietary: 'Proprietary orchestration',
          description: 'Container orchestration platform',
          features: ['Auto-scaling', 'Load balancing', 'Service discovery', 'Rolling updates'],
          learning: [
            'Container orchestration',
            'Microservices deployment',
            'Infrastructure as Code',
            'Cloud-native applications'
          ],
          difficulty: 'expert',
          install: 'curl -LO https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl'
        },
        {
          name: 'Ansible',
          proprietary: 'Proprietary automation',
          description: 'IT automation and configuration management',
          features: ['Infrastructure automation', 'Configuration management', 'Application deployment'],
          learning: [
            'Infrastructure automation',
            'Configuration management',
            'DevOps practices',
            'System administration'
          ],
          difficulty: 'intermediate',
          install: 'sudo apt install ansible'
        },
        {
          name: 'Prometheus',
          proprietary: 'Proprietary monitoring',
          description: 'Systems and service monitoring platform',
          features: ['Metrics collection', 'Alerting', 'Visualization', 'Time series database'],
          learning: [
            'System monitoring',
            'Metrics and alerting',
            'Time series data',
            'Observability practices'
          ],
          difficulty: 'advanced',
          install: 'docker run -d prom/prometheus'
        }
      ]
    }
  };

  useEffect(() => {
    setCurrentCategory(category);
  }, [category]);

  const selectResource = (resource) => {
    setSelectedResource(resource);
    onResourceSelect?.(resource);
  };

  const markResourceComplete = (resourceName) => {
    setCompletedResources(prev => new Set([...prev, resourceName]));
    setLearningProgress(prev => ({
      ...prev,
      [resourceName]: 100
    }));
  };

  const completeLearningPath = () => {
    const categoryResources = openSourceResources[currentCategory]?.resources || [];
    const completedCount = categoryResources.filter(r => completedResources.has(r.name)).length;

    onLearningPathComplete?.({
      category: currentCategory,
      completedResources: completedCount,
      totalResources: categoryResources.length,
      completionRate: (completedCount / categoryResources.length) * 100
    });
  };

  const renderResourceCard = (resource, index) => {
    const isCompleted = completedResources.has(resource.name);

    return (
      <div
        key={index}
        className={`resource-card ${selectedResource?.name === resource.name ? 'selected' : ''} ${isCompleted ? 'completed' : ''}`}
        onClick={() => selectResource(resource)}
      >
        <div className="resource-header">
          <div className="resource-title">
            <h3>{resource.name}</h3>
            <span className="proprietary-alternative">
              Alternative to {resource.proprietary}
            </span>
          </div>
          <div className="resource-meta">
            <span className={`difficulty-badge ${resource.difficulty}`}>
              {resource.difficulty}
            </span>
            {isCompleted && <span className="completed-badge">✓ Completed</span>}
          </div>
        </div>

        <p className="resource-description">{resource.description}</p>

        <div className="resource-features">
          <h4>Key Features:</h4>
          <div className="features-list">
            {resource.features.map((feature, fIndex) => (
              <span key={fIndex} className="feature-tag">{feature}</span>
            ))}
          </div>
        </div>

        <div className="resource-install">
          <h4>Installation:</h4>
          <code className="install-command">{resource.install}</code>
        </div>
      </div>
    );
  };

  const renderResourceDetail = () => {
    if (!selectedResource) return null;

    return (
      <div className="resource-detail">
        <div className="detail-header">
          <div className="detail-title">
            <h2>{selectedResource.name}</h2>
            <p>Open source alternative to {selectedResource.proprietary}</p>
          </div>
          <div className="detail-actions">
            <button
              onClick={() => markResourceComplete(selectedResource.name)}
              disabled={completedResources.has(selectedResource.name)}
              className="complete-btn"
            >
              {completedResources.has(selectedResource.name) ? 'Completed ✓' : 'Mark as Complete'}
            </button>
          </div>
        </div>

        <div className="detail-content">
          <div className="detail-section">
            <h3>Description</h3>
            <p>{selectedResource.description}</p>
          </div>

          <div className="detail-section">
            <h3>What You'll Learn</h3>
            <ul className="learning-list">
              {selectedResource.learning.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="detail-section">
            <h3>Installation Guide</h3>
            <div className="install-guide">
              <p>Run the following command to install {selectedResource.name}:</p>
              <div className="command-block">
                <code>{selectedResource.install}</code>
                <button
                  className="copy-btn"
                  onClick={() => navigator.clipboard.writeText(selectedResource.install)}
                  title="Copy command"
                >
                  📋
                </button>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Difficulty Level</h3>
            <div className="difficulty-info">
              <span className={`difficulty-level ${selectedResource.difficulty}`}>
                {selectedResource.difficulty.charAt(0).toUpperCase() + selectedResource.difficulty.slice(1)}
              </span>
              <p>
                {selectedResource.difficulty === 'beginner' && 'Perfect for those new to open source software'}
                {selectedResource.difficulty === 'intermediate' && 'Requires basic technical knowledge'}
                {selectedResource.difficulty === 'advanced' && 'Advanced technical skills recommended'}
                {selectedResource.difficulty === 'expert' && 'Expert-level technical knowledge required'}
              </p>
            </div>
          </div>

          <div className="detail-section">
            <h3>Next Steps</h3>
            <div className="next-steps">
              <div className="step-item">
                <h4>1. Installation</h4>
                <p>Follow the installation command above to set up the software.</p>
              </div>
              <div className="step-item">
                <h4>2. Configuration</h4>
                <p>Review the official documentation for configuration options.</p>
              </div>
              <div className="step-item">
                <h4>3. Usage</h4>
                <p>Explore the features and integrate into your workflow.</p>
              </div>
              <div className="step-item">
                <h4>4. Community</h4>
                <p>Join the community forums and contribute back to the project.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="open-source-education">
      <div className="education-header">
        <h2>Open Source Education Platform</h2>
        <p>Learn about open source software and discover powerful alternatives to proprietary tools</p>
      </div>

      <div className="education-content">
        <div className="categories-sidebar">
          <h3>Categories</h3>
          <div className="category-list">
            {Object.entries(openSourceResources).map(([key, categoryData]) => (
              <button
                key={key}
                className={`category-btn ${currentCategory === key ? 'active' : ''}`}
                onClick={() => setCurrentCategory(key)}
              >
                <h4>{categoryData.title}</h4>
                <p>{categoryData.description}</p>
                <span className="resource-count">
                  {categoryData.resources.length} resources
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="resources-main">
          {currentCategory !== 'all' && openSourceResources[currentCategory] && (
            <div className="category-header">
              <h2>{openSourceResources[currentCategory].title}</h2>
              <p>{openSourceResources[currentCategory].description}</p>
              <div className="category-stats">
                <span>{openSourceResources[currentCategory].resources.length} resources available</span>
                <button onClick={completeLearningPath} className="path-complete-btn">
                  Complete Learning Path
                </button>
              </div>
            </div>
          )}

          <div className="resources-grid">
            {currentCategory !== 'all' && openSourceResources[currentCategory]?.resources.map((resource, index) =>
              renderResourceCard(resource, index)
            )}
          </div>
        </div>

        {selectedResource && (
          <div className="resource-sidebar">
            {renderResourceDetail()}
          </div>
        )}
      </div>
    </div>
  );
};

export default OpenSourceEducation;