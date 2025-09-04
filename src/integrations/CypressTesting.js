import React, { useState, useEffect, useRef } from 'react';
import './CypressTesting.css';

const CypressTesting = ({
  testType = 'assessment',
  subject = 'general',
  difficulty = 'intermediate',
  onTestComplete,
  onScoreUpdate
}) => {
  const [currentTest, setCurrentTest] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const testRunnerRef = useRef(null);

  // Cypress-inspired test scenarios for different subjects
  const testScenarios = {
    math: {
      beginner: [
        {
          title: 'Basic Arithmetic Test',
          description: 'Test fundamental arithmetic operations',
          steps: [
            { action: 'visit', target: '/calculator', description: 'Open calculator' },
            { action: 'type', target: '#input1', value: '5', description: 'Enter first number' },
            { action: 'type', target: '#input2', value: '3', description: 'Enter second number' },
            { action: 'click', target: '#add-btn', description: 'Click add button' },
            { action: 'assert', target: '#result', value: '8', description: 'Verify result is 8' }
          ]
        },
        {
          title: 'Geometry Shape Properties',
          description: 'Test geometric calculations',
          steps: [
            { action: 'visit', target: '/geometry', description: 'Open geometry tools' },
            { action: 'select', target: '#shape-select', value: 'circle', description: 'Select circle' },
            { action: 'type', target: '#radius-input', value: '5', description: 'Enter radius' },
            { action: 'click', target: '#calculate-btn', description: 'Calculate properties' },
            { action: 'assert', target: '#area-result', value: '78.54', description: 'Verify area calculation' }
          ]
        }
      ],
      intermediate: [
        {
          title: 'Algebra Equation Solver',
          description: 'Test algebraic equation solving',
          steps: [
            { action: 'visit', target: '/algebra', description: 'Open algebra tools' },
            { action: 'type', target: '#equation-input', value: '2x + 3 = 7', description: 'Enter equation' },
            { action: 'click', target: '#solve-btn', description: 'Solve equation' },
            { action: 'assert', target: '#solution', value: 'x = 2', description: 'Verify solution' },
            { action: 'type', target: '#verify-input', value: '2', description: 'Verify solution' },
            { action: 'assert', target: '#verification', value: 'Correct', description: 'Check verification' }
          ]
        }
      ]
    },
    science: {
      beginner: [
        {
          title: 'Periodic Table Navigation',
          description: 'Test element lookup functionality',
          steps: [
            { action: 'visit', target: '/periodic-table', description: 'Open periodic table' },
            { action: 'type', target: '#search-input', value: 'Carbon', description: 'Search for Carbon' },
            { action: 'click', target: '#search-btn', description: 'Execute search' },
            { action: 'assert', target: '#element-symbol', value: 'C', description: 'Verify element symbol' },
            { action: 'assert', target: '#atomic-number', value: '6', description: 'Verify atomic number' }
          ]
        }
      ],
      intermediate: [
        {
          title: 'Chemical Reaction Balancer',
          description: 'Test chemical equation balancing',
          steps: [
            { action: 'visit', target: '/chemistry', description: 'Open chemistry tools' },
            { action: 'type', target: '#reaction-input', value: 'H2 + O2 = H2O', description: 'Enter unbalanced equation' },
            { action: 'click', target: '#balance-btn', description: 'Balance equation' },
            { action: 'assert', target: '#balanced-equation', value: '2H₂ + O₂ = 2H₂O', description: 'Verify balanced equation' }
          ]
        }
      ]
    },
    programming: {
      beginner: [
        {
          title: 'Code Editor Test',
          description: 'Test basic code editing functionality',
          steps: [
            { action: 'visit', target: '/code-editor', description: 'Open code editor' },
            { action: 'type', target: '#code-input', value: 'console.log("Hello World");', description: 'Enter code' },
            { action: 'click', target: '#run-btn', description: 'Run code' },
            { action: 'assert', target: '#output', value: 'Hello World', description: 'Verify output' }
          ]
        }
      ],
      intermediate: [
        {
          title: 'Algorithm Visualizer',
          description: 'Test sorting algorithm visualization',
          steps: [
            { action: 'visit', target: '/algorithms', description: 'Open algorithm visualizer' },
            { action: 'select', target: '#algorithm-select', value: 'bubble-sort', description: 'Select bubble sort' },
            { action: 'type', target: '#array-input', value: '5,3,8,1,9', description: 'Enter array' },
            { action: 'click', target: '#visualize-btn', description: 'Start visualization' },
            { action: 'wait', duration: 2000, description: 'Wait for animation' },
            { action: 'assert', target: '#sorted-array', value: '1,3,5,8,9', description: 'Verify sorted result' }
          ]
        }
      ]
    }
  };

  useEffect(() => {
    if (subject && difficulty) {
      loadTestScenario();
    }
  }, [subject, difficulty]);

  const loadTestScenario = () => {
    const scenarios = testScenarios[subject]?.[difficulty] || [];
    if (scenarios.length > 0) {
      setCurrentTest(scenarios[Math.floor(Math.random() * scenarios.length)]);
      setCurrentStep(0);
      setProgress(0);
      setTestResults([]);
    }
  };

  const runTest = async () => {
    if (!currentTest) return;

    setIsRunning(true);
    setTestResults([]);

    for (let i = 0; i < currentTest.steps.length; i++) {
      const step = currentTest.steps[i];
      setCurrentStep(i);

      try {
        await executeTestStep(step);
        setTestResults(prev => [...prev, {
          step: i + 1,
          description: step.description,
          status: 'passed',
          timestamp: new Date().toISOString()
        }]);
      } catch (error) {
        setTestResults(prev => [...prev, {
          step: i + 1,
          description: step.description,
          status: 'failed',
          error: error.message,
          timestamp: new Date().toISOString()
        }]);
        break;
      }

      setProgress(((i + 1) / currentTest.steps.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate step delay
    }

    setIsRunning(false);
    calculateScore();
  };

  const executeTestStep = async (step) => {
    // Simulate Cypress test execution
    switch (step.action) {
      case 'visit':
        console.log(`Visiting: ${step.target}`);
        break;
      case 'type':
        console.log(`Typing "${step.value}" into: ${step.target}`);
        break;
      case 'click':
        console.log(`Clicking: ${step.target}`);
        break;
      case 'assert':
        console.log(`Asserting ${step.target} equals "${step.value}"`);
        // Simulate assertion
        if (Math.random() > 0.1) { // 90% success rate for demo
          throw new Error(`Assertion failed: expected "${step.value}"`);
        }
        break;
      case 'select':
        console.log(`Selecting "${step.value}" in: ${step.target}`);
        break;
      case 'wait':
        await new Promise(resolve => setTimeout(resolve, step.duration));
        break;
      default:
        console.log(`Executing ${step.action} on ${step.target}`);
    }
  };

  const calculateScore = () => {
    const passedTests = testResults.filter(result => result.status === 'passed').length;
    const totalTests = currentTest?.steps.length || 0;
    const score = Math.round((passedTests / totalTests) * 100);

    onScoreUpdate?.(score);
    onTestComplete?.({
      score,
      totalSteps: totalTests,
      passedSteps: passedTests,
      results: testResults,
      testType,
      subject,
      difficulty
    });
  };

  const renderTestStep = (step, index) => {
    const result = testResults.find(r => r.step === index + 1);
    const isCurrentStep = currentStep === index && isRunning;
    const isCompleted = result !== undefined;

    return (
      <div
        key={index}
        className={`test-step ${isCurrentStep ? 'current' : ''} ${isCompleted ? result.status : ''}`}
      >
        <div className="step-header">
          <span className="step-number">{index + 1}</span>
          <span className="step-action">{step.action.toUpperCase()}</span>
          {isCompleted && (
            <span className={`step-status ${result.status}`}>
              {result.status === 'passed' ? '✓' : '✗'}
            </span>
          )}
        </div>
        <div className="step-description">{step.description}</div>
        {step.value && (
          <div className="step-value">
            <strong>Value:</strong> {step.value}
          </div>
        )}
        {isCurrentStep && (
          <div className="step-executing">
            <div className="executing-spinner"></div>
            Executing...
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="cypress-testing">
      <div className="testing-header">
        <h2>Cypress Testing Assessment</h2>
        <div className="test-info">
          <span className="subject-badge">{subject}</span>
          <span className="difficulty-badge">{difficulty}</span>
          <span className="test-type">{testType}</span>
        </div>
      </div>

      {currentTest && (
        <div className="test-content">
          <div className="test-overview">
            <h3>{currentTest.title}</h3>
            <p>{currentTest.description}</p>

            <div className="test-controls">
              <button
                onClick={runTest}
                disabled={isRunning}
                className="run-test-btn"
              >
                {isRunning ? 'Running Test...' : 'Run Test'}
              </button>

              <button
                onClick={loadTestScenario}
                disabled={isRunning}
                className="new-test-btn"
              >
                Load New Test
              </button>
            </div>

            <div className="progress-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="progress-text">{Math.round(progress)}% Complete</span>
            </div>
          </div>

          <div className="test-steps">
            <h4>Test Steps ({currentTest.steps.length})</h4>
            <div className="steps-container">
              {currentTest.steps.map((step, index) => renderTestStep(step, index))}
            </div>
          </div>

          {testResults.length > 0 && (
            <div className="test-results">
              <h4>Test Results</h4>
              <div className="results-summary">
                <div className="result-stat">
                  <span className="stat-label">Passed:</span>
                  <span className="stat-value passed">
                    {testResults.filter(r => r.status === 'passed').length}
                  </span>
                </div>
                <div className="result-stat">
                  <span className="stat-label">Failed:</span>
                  <span className="stat-value failed">
                    {testResults.filter(r => r.status === 'failed').length}
                  </span>
                </div>
                <div className="result-stat">
                  <span className="stat-label">Success Rate:</span>
                  <span className="stat-value">
                    {Math.round((testResults.filter(r => r.status === 'passed').length / testResults.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!currentTest && (
        <div className="no-test">
          <div className="no-test-icon">🧪</div>
          <h3>No Test Loaded</h3>
          <p>Select a subject and difficulty to load a test scenario.</p>
          <button onClick={loadTestScenario} className="load-test-btn">
            Load Test Scenario
          </button>
        </div>
      )}
    </div>
  );
};

export default CypressTesting;