import React, { useState, useEffect } from 'react';
import './SystemDesignEducation.css';

const SystemDesignEducation = ({
  module = 'scalability',
  difficulty = 'intermediate',
  interactive = true,
  onModuleComplete,
  onProgressUpdate
}) => {
  const [currentModule, setCurrentModule] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // System design modules inspired by system-design-primer
  const systemDesignModules = {
    scalability: {
      title: 'Scalability Patterns',
      description: 'Learn how to design systems that can handle growth',
      questions: [
        {
          question: 'What is the primary goal of horizontal scaling?',
          options: [
            'Increase processing power of individual servers',
            'Add more servers to distribute load',
            'Optimize database queries',
            'Reduce network latency'
          ],
          correct: 1,
          explanation: 'Horizontal scaling adds more servers to distribute the load across multiple machines, allowing the system to handle more concurrent users.'
        },
        {
          question: 'Which caching strategy is most effective for frequently accessed data?',
          options: [
            'Write-through cache',
            'Write-behind cache',
            'Cache-aside pattern',
            'All of the above'
          ],
          correct: 3,
          explanation: 'Different caching strategies serve different purposes. Write-through ensures data consistency, write-behind improves performance, and cache-aside provides flexibility.'
        },
        {
          question: 'What is the CAP theorem?',
          options: [
            'Cache, API, Performance',
            'Consistency, Availability, Partition tolerance',
            'Centralized, Asynchronous, Parallel',
            'Client, Application, Protocol'
          ],
          correct: 1,
          explanation: 'CAP theorem states that in a distributed system, you can only guarantee 2 out of 3: Consistency, Availability, and Partition tolerance.'
        }
      ],
      concepts: [
        {
          title: 'Load Balancing',
          content: 'Distribute incoming traffic across multiple servers',
          examples: ['Round Robin', 'Least Connections', 'IP Hash']
        },
        {
          title: 'Database Sharding',
          content: 'Split large databases into smaller, faster, more manageable pieces',
          examples: ['Horizontal partitioning', 'Vertical partitioning', 'Directory-based sharding']
        },
        {
          title: 'Caching Layers',
          content: 'Store frequently accessed data in fast-access storage',
          examples: ['Browser cache', 'CDN', 'Application cache', 'Database cache']
        }
      ]
    },
    databases: {
      title: 'Database Design',
      description: 'Master database architecture and optimization',
      questions: [
        {
          question: 'When should you use a NoSQL database?',
          options: [
            'When you need complex transactions',
            'When you have unstructured data',
            'When you need strong consistency',
            'When you have simple relationships'
          ],
          correct: 1,
          explanation: 'NoSQL databases are ideal for unstructured or semi-structured data, flexible schemas, and when you need to handle large volumes of data with varying structures.'
        },
        {
          question: 'What is database normalization?',
          options: [
            'Making database faster',
            'Reducing data redundancy',
            'Increasing storage space',
            'Complicating queries'
          ],
          correct: 1,
          explanation: 'Normalization reduces data redundancy and improves data integrity by organizing data into tables with minimal duplication.'
        }
      ],
      concepts: [
        {
          title: 'Indexing Strategies',
          content: 'Optimize query performance with proper indexing',
          examples: ['B-tree indexes', 'Hash indexes', 'Composite indexes', 'Full-text indexes']
        },
        {
          title: 'Replication Patterns',
          content: 'Ensure data availability and fault tolerance',
          examples: ['Master-Slave', 'Master-Master', 'Multi-region replication']
        }
      ]
    },
    networking: {
      title: 'Network Architecture',
      description: 'Design efficient and reliable network systems',
      questions: [
        {
          question: 'What is the purpose of a CDN?',
          options: [
            'Store user data',
            'Cache static content closer to users',
            'Process payments',
            'Manage user authentication'
          ],
          correct: 1,
          explanation: 'CDNs cache static content at edge locations worldwide, reducing latency and improving user experience.'
        }
      ],
      concepts: [
        {
          title: 'DNS Resolution',
          content: 'Translate domain names to IP addresses efficiently',
          examples: ['Recursive resolvers', 'Authoritative servers', 'Caching resolvers']
        },
        {
          title: 'Load Balancing',
          content: 'Distribute network traffic across servers',
          examples: ['Layer 4 vs Layer 7', 'Health checks', 'Session persistence']
        }
      ]
    },
    security: {
      title: 'Security Architecture',
      description: 'Implement robust security measures',
      questions: [
        {
          question: 'What is the principle of least privilege?',
          options: [
            'Give all users admin access',
            'Give users only the minimum permissions they need',
            'Share passwords between users',
            'Use weak passwords for convenience'
          ],
          correct: 1,
          explanation: 'The principle of least privilege ensures users and systems have only the minimum permissions necessary to perform their functions.'
        }
      ],
      concepts: [
        {
          title: 'Authentication & Authorization',
          content: 'Verify user identity and control access',
          examples: ['OAuth 2.0', 'JWT tokens', 'Role-based access control', 'Multi-factor authentication']
        },
        {
          title: 'Data Protection',
          content: 'Secure data at rest and in transit',
          examples: ['Encryption at rest', 'TLS/SSL', 'Data masking', 'Tokenization']
        }
      ]
    },
    performance: {
      title: 'Performance Optimization',
      description: 'Optimize system performance and user experience',
      questions: [
        {
          question: 'What is the N+1 query problem?',
          options: [
            'Using too many database connections',
            'Making unnecessary additional queries',
            'Having too many indexes',
            'Using wrong data types'
          ],
          correct: 1,
          explanation: 'The N+1 query problem occurs when an application makes N+1 database queries instead of 1 query with joins, leading to poor performance.'
        }
      ],
      concepts: [
        {
          title: 'Caching Strategies',
          content: 'Improve response times with intelligent caching',
          examples: ['Browser caching', 'CDN caching', 'Application caching', 'Database caching']
        },
        {
          title: 'Database Optimization',
          content: 'Optimize database queries and structure',
          examples: ['Query optimization', 'Indexing', 'Connection pooling', 'Read replicas']
        }
      ]
    }
  };

  useEffect(() => {
    loadModule();
  }, [module]);

  const loadModule = () => {
    const selectedModule = systemDesignModules[module];
    if (selectedModule) {
      setCurrentModule(selectedModule);
      setUserAnswers({});
      setShowResults(false);
      setScore(0);
      setCurrentQuestion(0);
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const checkAnswers = () => {
    if (!currentModule) return;

    let correctCount = 0;
    currentModule.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correct) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / currentModule.questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);

    onModuleComplete?.({
      module,
      score: finalScore,
      totalQuestions: currentModule.questions.length,
      correctAnswers: correctCount,
      answers: userAnswers
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < currentModule.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const renderQuestion = (question, index) => {
    const userAnswer = userAnswers[index];

    return (
      <div key={index} className="question-card">
        <h4>Question {index + 1}</h4>
        <p className="question-text">{question.question}</p>

        <div className="options">
          {question.options.map((option, optionIndex) => (
            <label key={optionIndex} className="option">
              <input
                type="radio"
                name={`question-${index}`}
                value={optionIndex}
                checked={userAnswer === optionIndex}
                onChange={() => handleAnswerSelect(index, optionIndex)}
                disabled={showResults}
              />
              <span className="option-text">{option}</span>
              {showResults && (
                <span className={`option-result ${
                  optionIndex === question.correct ? 'correct' :
                  userAnswer === optionIndex ? 'incorrect' : ''
                }`}>
                  {optionIndex === question.correct ? '✓' :
                   userAnswer === optionIndex ? '✗' : ''}
                </span>
              )}
            </label>
          ))}
        </div>

        {showResults && (
          <div className="question-explanation">
            <h5>Explanation:</h5>
            <p>{question.explanation}</p>
          </div>
        )}
      </div>
    );
  };

  const renderConcepts = () => {
    if (!currentModule?.concepts) return null;

    return (
      <div className="concepts-section">
        <h3>Key Concepts</h3>
        <div className="concepts-grid">
          {currentModule.concepts.map((concept, index) => (
            <div key={index} className="concept-card">
              <h4>{concept.title}</h4>
              <p>{concept.content}</p>
              <div className="concept-examples">
                <h5>Examples:</h5>
                <ul>
                  {concept.examples.map((example, exIndex) => (
                    <li key={exIndex}>{example}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="system-design-education">
      <div className="design-header">
        <h2>System Design Education</h2>
        <p>Master the principles of scalable system architecture</p>
        <div className="module-info">
          <span className="current-module">{currentModule?.title}</span>
          <span className="difficulty-badge">{difficulty}</span>
        </div>
      </div>

      <div className="module-navigation">
        <h3>Available Modules</h3>
        <div className="module-buttons">
          {Object.entries(systemDesignModules).map(([key, mod]) => (
            <button
              key={key}
              className={`module-btn ${module === key ? 'active' : ''}`}
              onClick={() => setCurrentModule(systemDesignModules[key])}
            >
              <h4>{mod.title}</h4>
              <p>{mod.description}</p>
            </button>
          ))}
        </div>
      </div>

      {currentModule && (
        <div className="module-content">
          <div className="module-description">
            <h3>{currentModule.title}</h3>
            <p>{currentModule.description}</p>
          </div>

          {renderConcepts()}

          <div className="assessment-section">
            <h3>Knowledge Assessment</h3>

            {!showResults ? (
              <div className="quiz-container">
                <div className="quiz-progress">
                  <span>Question {currentQuestion + 1} of {currentModule.questions.length}</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${((currentQuestion + 1) / currentModule.questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {renderQuestion(currentModule.questions[currentQuestion], currentQuestion)}

                <div className="quiz-navigation">
                  <button
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                    className="nav-btn"
                  >
                    Previous
                  </button>

                  {currentQuestion < currentModule.questions.length - 1 ? (
                    <button
                      onClick={nextQuestion}
                      className="nav-btn primary"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={checkAnswers}
                      disabled={Object.keys(userAnswers).length !== currentModule.questions.length}
                      className="nav-btn primary"
                    >
                      Submit Answers
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="results-container">
                <div className="score-display">
                  <div className="score-circle">
                    <span className="score-number">{score}%</span>
                    <span className="score-label">Score</span>
                  </div>
                  <div className="score-details">
                    <p>You answered {Object.values(userAnswers).filter((answer, index) =>
                      answer === currentModule.questions[index].correct
                    ).length} out of {currentModule.questions.length} questions correctly.</p>
                  </div>
                </div>

                <div className="questions-review">
                  <h4>Review Your Answers</h4>
                  {currentModule.questions.map((question, index) =>
                    renderQuestion(question, index)
                  )}
                </div>

                <div className="results-actions">
                  <button onClick={() => {
                    setShowResults(false);
                    setUserAnswers({});
                    setCurrentQuestion(0);
                  }} className="retry-btn">
                    Try Again
                  </button>
                  <button onClick={loadModule} className="new-module-btn">
                    Choose Different Module
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemDesignEducation;