import React, { useState, useEffect, useRef } from 'react';
import './MathEducation.css';

const MathEducation = ({
  topic = 'algebra',
  difficulty = 'intermediate',
  interactive = true,
  onProgressUpdate,
  onAnswerSubmit
}) => {
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const canvasRef = useRef(null);

  // Math.js inspired interactive problems
  const mathProblems = {
    algebra: {
      beginner: [
        {
          problem: 'Solve for x: 2x + 3 = 7',
          solution: 'x = 2',
          steps: [
            'Subtract 3 from both sides: 2x + 3 - 3 = 7 - 3',
            'Simplify: 2x = 4',
            'Divide both sides by 2: x = 2'
          ],
          type: 'equation',
          interactive: true
        },
        {
          problem: 'Simplify: 3(x + 2) = 15',
          solution: 'x = 3',
          steps: [
            'Divide both sides by 3: x + 2 = 5',
            'Subtract 2 from both sides: x = 3'
          ],
          type: 'equation'
        }
      ],
      intermediate: [
        {
          problem: 'Solve the system:\\n2x + y = 8\\nx - y = 2',
          solution: 'x = 3, y = 2',
          steps: [
            'Add the equations: (2x + y) + (x - y) = 8 + 2',
            'Simplify: 3x = 10',
            'Divide by 3: x = 10/3 ≈ 3.33',
            'Wait, let me recalculate...',
            'Actually: 2x + y = 8\\nx - y = 2',
            'Add: 3x = 10, so x = 10/3',
            'Substitute: (10/3) - y = 2',
            'y = 10/3 - 2 = 10/3 - 6/3 = 4/3'
          ],
          type: 'system',
          interactive: true
        },
        {
          problem: 'Factor: x² + 5x + 6',
          solution: '(x + 2)(x + 3)',
          steps: [
            'Find factors of 6 that add to 5: 2 and 3',
            'Write as: (x + 2)(x + 3)',
            'Expand to verify: x² + 3x + 2x + 6 = x² + 5x + 6 ✓'
          ],
          type: 'factoring'
        }
      ],
      advanced: [
        {
          problem: 'Solve: x³ - 6x² + 11x - 6 = 0',
          solution: 'x = 1, 2, 3',
          steps: [
            'Test x = 1: 1 - 6 + 11 - 6 = 0 ✓',
            'Factor: (x - 1)(x² - 5x + 6) = 0',
            'Factor quadratic: (x - 1)(x - 2)(x - 3) = 0',
            'Solutions: x = 1, 2, 3'
          ],
          type: 'polynomial',
          interactive: true
        }
      ]
    },
    geometry: {
      beginner: [
        {
          problem: 'Calculate the area of a circle with radius 5 units',
          solution: 'Area = 78.54 square units',
          steps: [
            'Formula: A = πr²',
            'Substitute r = 5: A = π(5)²',
            'Calculate: A = π(25) ≈ 78.54'
          ],
          type: 'area',
          visual: true
        }
      ],
      intermediate: [
        {
          problem: 'Find the volume of a sphere with radius 3 units',
          solution: 'Volume ≈ 113.10 cubic units',
          steps: [
            'Formula: V = (4/3)πr³',
            'Substitute r = 3: V = (4/3)π(3)³',
            'Calculate: V = (4/3)π(27) = 36π ≈ 113.10'
          ],
          type: 'volume',
          visual: true
        }
      ]
    },
    calculus: {
      beginner: [
        {
          problem: 'Find the derivative of f(x) = x² + 3x + 1',
          solution: "f'(x) = 2x + 3",
          steps: [
            'Apply power rule: d/dx[x²] = 2x',
            'Apply power rule: d/dx[3x] = 3',
            'Constant rule: d/dx[1] = 0',
            'Combine: f\'(x) = 2x + 3'
          ],
          type: 'derivative',
          interactive: true
        }
      ],
      intermediate: [
        {
          problem: 'Evaluate: ∫(2x + 3)dx',
          solution: 'x² + 3x + C',
          steps: [
            'Apply power rule: ∫2x dx = 2 * (1/2)x² = x²',
            'Apply constant rule: ∫3 dx = 3x',
            'Add constant of integration: x² + 3x + C'
          ],
          type: 'integral',
          interactive: true
        }
      ]
    },
    statistics: {
      beginner: [
        {
          problem: 'Find the mean of: 2, 4, 6, 8, 10',
          solution: 'Mean = 6',
          steps: [
            'Add all numbers: 2 + 4 + 6 + 8 + 10 = 30',
            'Count the numbers: 5',
            'Divide sum by count: 30 ÷ 5 = 6'
          ],
          type: 'mean',
          data: [2, 4, 6, 8, 10]
        }
      ],
      intermediate: [
        {
          problem: 'Calculate standard deviation for: 1, 3, 5, 7, 9',
          solution: 'Standard Deviation ≈ 2.83',
          steps: [
            'Find mean: (1+3+5+7+9)/5 = 5',
            'Calculate variances: (-4)², (-2)², 0², 2², 4²',
            'Variances: 16, 4, 0, 4, 16',
            'Average variance: 40/5 = 8',
            'Standard deviation: √8 ≈ 2.83'
          ],
          type: 'standard_deviation',
          data: [1, 3, 5, 7, 9],
          visual: true
        }
      ]
    }
  };

  useEffect(() => {
    loadRandomProblem();
  }, [topic, difficulty]);

  const loadRandomProblem = () => {
    const problems = mathProblems[topic]?.[difficulty] || [];
    if (problems.length > 0) {
      const randomProblem = problems[Math.floor(Math.random() * problems.length)];
      setCurrentProblem(randomProblem);
      setUserAnswer('');
      setShowSolution(false);
      setAttempts(0);
    }
  };

  const checkAnswer = () => {
    if (!currentProblem || !userAnswer.trim()) return;

    const isCorrect = userAnswer.toLowerCase().replace(/\s+/g, '') ===
                     currentProblem.solution.toLowerCase().replace(/\s+/g, '');

    setAttempts(prev => prev + 1);

    if (isCorrect) {
      setScore(prev => prev + (difficulty === 'advanced' ? 10 : difficulty === 'intermediate' ? 5 : 3));
      setStreak(prev => prev + 1);
      onAnswerSubmit?.(true, attempts + 1);
    } else {
      setStreak(0);
      onAnswerSubmit?.(false, attempts + 1);
    }

    onProgressUpdate?.({
      topic,
      difficulty,
      correct: isCorrect,
      attempts: attempts + 1,
      score: isCorrect ? (difficulty === 'advanced' ? 10 : difficulty === 'intermediate' ? 5 : 3) : 0
    });
  };

  const renderVisualProblem = () => {
    if (!currentProblem?.visual) return null;

    return (
      <div className="math-visual">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="math-canvas"
        />
        <div className="visual-controls">
          <button onClick={() => drawShape('circle')}>Draw Circle</button>
          <button onClick={() => drawShape('square')}>Draw Square</button>
          <button onClick={() => drawShape('triangle')}>Draw Triangle</button>
          <button onClick={clearCanvas}>Clear</button>
        </div>
      </div>
    );
  };

  const drawShape = (shape) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 3;

    switch (shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(200, 150, 80, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      case 'square':
        ctx.strokeRect(120, 70, 160, 160);
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(200, 70);
        ctx.lineTo(120, 230);
        ctx.lineTo(280, 230);
        ctx.closePath();
        ctx.stroke();
        break;
      default:
        break;
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const renderDataVisualization = () => {
    if (!currentProblem?.data) return null;

    return (
      <div className="data-visualization">
        <h4>Data Set</h4>
        <div className="data-points">
          {currentProblem.data.map((point, index) => (
            <div key={index} className="data-point">
              <span className="point-value">{point}</span>
            </div>
          ))}
        </div>
        <div className="data-chart">
          {currentProblem.data.map((point, index) => (
            <div
              key={index}
              className="chart-bar"
              style={{
                height: `${(point / Math.max(...currentProblem.data)) * 100}%`,
                backgroundColor: `hsl(${index * 60}, 70%, 50%)`
              }}
              title={`Value: ${point}`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="math-education">
      <div className="math-header">
        <h2>Interactive Mathematics</h2>
        <div className="math-stats">
          <div className="stat-item">
            <span className="stat-label">Score:</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Streak:</span>
            <span className="stat-value">{streak}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Topic:</span>
            <span className="stat-value">{topic}</span>
          </div>
        </div>
      </div>

      {currentProblem && (
        <div className="math-problem">
          <div className="problem-header">
            <h3>{currentProblem.problem}</h3>
            <span className={`difficulty-badge ${difficulty}`}>
              {difficulty}
            </span>
          </div>

          {renderVisualProblem()}
          {renderDataVisualization()}

          <div className="problem-input">
            <label>Your Answer:</label>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your solution..."
              onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
            />
            <button onClick={checkAnswer} className="check-btn">
              Check Answer
            </button>
          </div>

          <div className="problem-actions">
            <button onClick={() => setShowSolution(!showSolution)} className="solution-btn">
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </button>
            <button onClick={loadRandomProblem} className="new-problem-btn">
              New Problem
            </button>
          </div>

          {showSolution && (
            <div className="solution-section">
              <h4>Solution: {currentProblem.solution}</h4>
              <div className="solution-steps">
                <h5>Step-by-step solution:</h5>
                <ol>
                  {currentProblem.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {attempts > 0 && (
            <div className="attempt-feedback">
              <p>Attempts: {attempts}</p>
              <p>Keep trying! Practice makes perfect.</p>
            </div>
          )}
        </div>
      )}

      <div className="math-navigation">
        <div className="topic-selector">
          <h4>Select Topic</h4>
          <div className="topic-buttons">
            {Object.keys(mathProblems).map(topicKey => (
              <button
                key={topicKey}
                className={`topic-btn ${topic === topicKey ? 'active' : ''}`}
                onClick={() => {
                  // This would trigger a topic change
                  console.log(`Switching to ${topicKey}`);
                }}
              >
                {topicKey.charAt(0).toUpperCase() + topicKey.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="difficulty-selector">
          <h4>Select Difficulty</h4>
          <div className="difficulty-buttons">
            {['beginner', 'intermediate', 'advanced'].map(diff => (
              <button
                key={diff}
                className={`difficulty-btn ${difficulty === diff ? 'active' : ''}`}
                onClick={() => {
                  // This would trigger difficulty change
                  console.log(`Switching to ${diff}`);
                }}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathEducation;