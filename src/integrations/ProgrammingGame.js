import React, { useState, useEffect, useRef } from 'react';
import './ProgrammingGame.css';

const ProgrammingGame = ({
  user,
  grade = 7,
  onProgressUpdate,
  onAchievementUnlock,
  onLevelComplete
}) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState('menu'); // menu, playing, paused, completed
  const [selectedDifficulty, setSelectedDifficulty] = useState('beginner');
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [output, setOutput] = useState('');
  const [hints, setHints] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [streak, setStreak] = useState(0);

  const canvasRef = useRef(null);
  const timerRef = useRef(null);

  // Programming challenges inspired by compute-it.toxicode.fr
  const challenges = {
    beginner: {
      1: {
        title: 'Hello World',
        description: 'Write a program that displays "Hello, World!"',
        objective: 'Use the print() function to display text',
        starterCode: 'print("',
        solution: 'print("Hello, World!")',
        hints: [
          'Use the print() function',
          'Put your text inside quotation marks',
          'Don\'t forget the closing parenthesis'
        ],
        testCases: [
          { input: '', expected: 'Hello, World!' }
        ],
        points: 10,
        timeLimit: 120
      },
      2: {
        title: 'Simple Calculator',
        description: 'Create a program that adds two numbers',
        objective: 'Use variables and arithmetic operations',
        starterCode: 'num1 = 5\nnum2 = 3\nresult = ',
        solution: 'num1 = 5\nnum2 = 3\nresult = num1 + num2\nprint(result)',
        hints: [
          'Store numbers in variables',
          'Use the + operator for addition',
          'Print the result'
        ],
        testCases: [
          { input: '', expected: '8' }
        ],
        points: 15,
        timeLimit: 180
      },
      3: {
        title: 'Name Input',
        description: 'Ask for user\'s name and greet them',
        objective: 'Use input() function and string concatenation',
        starterCode: 'name = input("What is your name? ")\nprint("Hello, " + ',
        solution: 'name = input("What is your name? ")\nprint("Hello, " + name)',
        hints: [
          'Use input() to get user input',
          'Store the input in a variable',
          'Use + to combine strings'
        ],
        testCases: [
          { input: 'Alice', expected: 'Hello, Alice' }
        ],
        points: 20,
        timeLimit: 240
      }
    },
    intermediate: {
      1: {
        title: 'Even or Odd',
        description: 'Check if a number is even or odd',
        objective: 'Use conditional statements (if/else)',
        starterCode: 'number = int(input("Enter a number: "))\nif ',
        solution: 'number = int(input("Enter a number: "))\nif number % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")',
        hints: [
          'Use % operator to check remainder',
          'If remainder is 0, number is even',
          'Use if/else structure'
        ],
        testCases: [
          { input: '4', expected: 'Even' },
          { input: '7', expected: 'Odd' }
        ],
        points: 25,
        timeLimit: 300
      },
      2: {
        title: 'Simple Loop',
        description: 'Print numbers from 1 to 5 using a loop',
        objective: 'Use for loop to repeat actions',
        starterCode: 'for i in range(1, ',
        solution: 'for i in range(1, 6):\n    print(i)',
        hints: [
          'Use range() function for sequences',
          'range(1, 6) gives numbers 1, 2, 3, 4, 5',
          'Indent the print statement'
        ],
        testCases: [
          { input: '', expected: '1\n2\n3\n4\n5' }
        ],
        points: 30,
        timeLimit: 360
      },
      3: {
        title: 'List Operations',
        description: 'Find the largest number in a list',
        objective: 'Work with lists and find maximum value',
        starterCode: 'numbers = [3, 7, 2, 9, 5]\nmax_num = numbers[0]\nfor num in numbers:\n    if ',
        solution: 'numbers = [3, 7, 2, 9, 5]\nmax_num = numbers[0]\nfor num in numbers:\n    if num > max_num:\n        max_num = num\nprint(max_num)',
        hints: [
          'Initialize max_num with first element',
          'Compare each number with current max',
          'Update max when finding larger number'
        ],
        testCases: [
          { input: '', expected: '9' }
        ],
        points: 35,
        timeLimit: 420
      }
    },
    advanced: {
      1: {
        title: 'FizzBuzz',
        description: 'Print Fizz, Buzz, or FizzBuzz for multiples',
        objective: 'Use complex conditional logic',
        starterCode: 'for i in range(1, 16):\n    if i % 3 == 0 and i % 5 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(',
        solution: 'for i in range(1, 16):\n    if i % 3 == 0 and i % 5 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)',
        hints: [
          'Check both conditions first (FizzBuzz)',
          'Use elif for other conditions',
          'Print the number if no conditions match'
        ],
        testCases: [
          { input: '', expected: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz' }
        ],
        points: 50,
        timeLimit: 600
      },
      2: {
        title: 'Prime Numbers',
        description: 'Check if a number is prime',
        objective: 'Use loops and conditional logic for prime checking',
        starterCode: 'def is_prime(n):\n    if n <= 1:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\n\nnum = int(input("Enter a number: "))\nif ',
        solution: 'def is_prime(n):\n    if n <= 1:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\n\nnum = int(input("Enter a number: "))\nif is_prime(num):\n    print("Prime")\nelse:\n    print("Not Prime")',
        hints: [
          'Create a function to check primality',
          'Check divisibility up to square root of n',
          'Return False if any divisor found'
        ],
        testCases: [
          { input: '7', expected: 'Prime' },
          { input: '9', expected: 'Not Prime' }
        ],
        points: 60,
        timeLimit: 720
      }
    }
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, timeLeft]);

  const startGame = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setCurrentLevel(1);
    setScore(0);
    setLives(3);
    setStreak(0);
    setGameState('playing');
    loadChallenge(1, difficulty);
  };

  const loadChallenge = (level, difficulty) => {
    const challenge = challenges[difficulty]?.[level];
    if (challenge) {
      setCurrentChallenge(challenge);
      setUserCode(challenge.starterCode);
      setOutput('');
      setHints([]);
      setTimeLeft(challenge.timeLimit);
    }
  };

  const runCode = () => {
    try {
      // Local code execution simulation - NO external services or AI used
      const result = simulateCodeExecution(userCode);
      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const simulateCodeExecution = (code) => {
    // Local code execution simulation - NO external AI services used
    // This is a simple pattern-matching simulation for educational purposes
    try {
      const cleanCode = code.toLowerCase().replace(/\s+/g, '');

      if (cleanCode.includes('print("hello,world!")')) {
        return 'Hello, World!';
      }
      if (cleanCode.includes('print(result)') && cleanCode.includes('num1+num2')) {
        return '8';
      }
      if (cleanCode.includes('print("hello,"+name)') && cleanCode.includes('input(')) {
        return 'Hello, Alice';
      }
      if (cleanCode.includes('ifnumber%2==0') && cleanCode.includes('print("even")')) {
        return 'Even';
      }
      if (cleanCode.includes('foriinrange(1,6)') && cleanCode.includes('print(i)')) {
        return '1\n2\n3\n4\n5';
      }
      if (cleanCode.includes('print(max_num)') && cleanCode.includes('ifnum>max_num')) {
        return '9';
      }
      if (cleanCode.includes('fizzbuzz') && cleanCode.includes('fizz') && cleanCode.includes('buzz')) {
        return '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz';
      }
      if (cleanCode.includes('is_prime(num)') && cleanCode.includes('print("prime")')) {
        return 'Prime';
      }

      // For any other code, just acknowledge execution
      return 'Code executed successfully (local simulation)';
    } catch (error) {
      return `Execution error: ${error.message}`;
    }
  };

  const checkSolution = () => {
    if (!currentChallenge) return;

    const isCorrect = userCode.trim() === currentChallenge.solution.trim();

    if (isCorrect) {
      const pointsEarned = currentChallenge.points + (streak * 5);
      setScore(prev => prev + pointsEarned);
      setStreak(prev => prev + 1);

      // Check for achievements
      if (streak >= 3) {
        unlockAchievement('streak_master');
      }
      if (score + pointsEarned >= 100) {
        unlockAchievement('score_master');
      }

      onProgressUpdate?.({
        level: currentLevel,
        score: score + pointsEarned,
        streak: streak + 1,
        difficulty: selectedDifficulty
      });

      // Move to next level
      const nextLevel = currentLevel + 1;
      if (challenges[selectedDifficulty][nextLevel]) {
        setCurrentLevel(nextLevel);
        loadChallenge(nextLevel, selectedDifficulty);
      } else {
        // Completed all levels in this difficulty
        setGameState('completed');
        onLevelComplete?.({
          difficulty: selectedDifficulty,
          finalScore: score + pointsEarned,
          levelsCompleted: currentLevel
        });
      }
    } else {
      setLives(prev => prev - 1);
      setStreak(0);

      if (lives <= 1) {
        setGameState('game_over');
      }
    }
  };

  const unlockAchievement = (achievementId) => {
    if (!achievements.includes(achievementId)) {
      setAchievements(prev => [...prev, achievementId]);
      onAchievementUnlock?.(achievementId);
    }
  };

  const useHint = () => {
    if (hints.length < currentChallenge.hints.length) {
      setHints(prev => [...prev, currentChallenge.hints[hints.length]]);
    }
  };

  const handleTimeUp = () => {
    setLives(prev => prev - 1);
    if (lives <= 1) {
      setGameState('game_over');
    } else {
      // Restart current level
      loadChallenge(currentLevel, selectedDifficulty);
    }
  };

  const resetGame = () => {
    setGameState('menu');
    setCurrentLevel(1);
    setScore(0);
    setLives(3);
    setStreak(0);
    setCurrentChallenge(null);
    setUserCode('');
    setOutput('');
    setHints([]);
    setTimeLeft(300);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMenu = () => (
    <div className="game-menu">
      <div className="menu-header">
        <h1>🎮 Code Quest</h1>
        <p>Master programming through interactive challenges!</p>
      </div>

      <div className="difficulty-selection">
        <h2>Choose Your Difficulty</h2>
        <div className="difficulty-buttons">
          <button
            className="difficulty-btn beginner"
            onClick={() => startGame('beginner')}
          >
            <h3>🐣 Beginner</h3>
            <p>Perfect for first-time programmers</p>
            <span className="level-count">3 Levels</span>
          </button>

          <button
            className="difficulty-btn intermediate"
            onClick={() => startGame('intermediate')}
          >
            <h3>🚀 Intermediate</h3>
            <p>For those with basic programming knowledge</p>
            <span className="level-count">3 Levels</span>
          </button>

          <button
            className="difficulty-btn advanced"
            onClick={() => startGame('advanced')}
          >
            <h3>🏆 Advanced</h3>
            <p>Challenge yourself with complex problems</p>
            <span className="level-count">2 Levels</span>
          </button>
        </div>
      </div>

      <div className="game-instructions">
        <h3>How to Play</h3>
        <ul>
          <li>Complete coding challenges to earn points</li>
          <li>Use hints when you're stuck (costs points)</li>
          <li>Maintain streaks for bonus points</li>
          <li>Beat the clock to maximize your score</li>
          <li>Unlock achievements for special rewards</li>
        </ul>
      </div>
    </div>
  );

  const renderGame = () => (
    <div className="game-play">
      <div className="game-header">
        <div className="game-stats">
          <div className="stat-item">
            <span className="stat-label">Level:</span>
            <span className="stat-value">{currentLevel}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Score:</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Lives:</span>
            <span className="stat-value">{'❤️'.repeat(lives)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Streak:</span>
            <span className="stat-value">{streak}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Time:</span>
            <span className="stat-value time">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="game-controls">
          <button onClick={() => setGameState('paused')} className="pause-btn">
            ⏸️ Pause
          </button>
        </div>
      </div>

      <div className="challenge-section">
        <div className="challenge-header">
          <h2>{currentChallenge.title}</h2>
          <p>{currentChallenge.description}</p>
          <div className="objective">
            <strong>Objective:</strong> {currentChallenge.objective}
          </div>
        </div>

        <div className="code-editor">
          <div className="editor-header">
            <span>Python Editor</span>
            <button onClick={runCode} className="run-btn">▶️ Run Code</button>
          </div>
          <textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            className="code-input"
            placeholder="Write your Python code here..."
            spellCheck={false}
          />
        </div>

        <div className="output-section">
          <h3>Output</h3>
          <pre className="output-display">{output}</pre>
        </div>

        <div className="hints-section">
          <div className="hints-header">
            <h3>Hints ({hints.length}/{currentChallenge.hints.length})</h3>
            <button
              onClick={useHint}
              disabled={hints.length >= currentChallenge.hints.length}
              className="hint-btn"
            >
              💡 Get Hint
            </button>
          </div>
          <div className="hints-list">
            {hints.map((hint, index) => (
              <div key={index} className="hint-item">
                <span className="hint-number">{index + 1}.</span>
                <span className="hint-text">{hint}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="challenge-actions">
          <button onClick={checkSolution} className="submit-btn">
            ✅ Submit Solution
          </button>
          <button onClick={() => loadChallenge(currentLevel, selectedDifficulty)} className="reset-btn">
            🔄 Reset Challenge
          </button>
        </div>
      </div>
    </div>
  );

  const renderPaused = () => (
    <div className="game-paused">
      <div className="pause-overlay">
        <h2>Game Paused</h2>
        <div className="pause-options">
          <button onClick={() => setGameState('playing')} className="resume-btn">
            ▶️ Resume
          </button>
          <button onClick={resetGame} className="menu-btn">
            🏠 Main Menu
          </button>
        </div>
      </div>
    </div>
  );

  const renderCompleted = () => (
    <div className="game-completed">
      <div className="completion-overlay">
        <h2>🎉 Congratulations!</h2>
        <p>You've completed all levels in {selectedDifficulty} difficulty!</p>
        <div className="final-stats">
          <div className="stat-item">
            <span className="stat-label">Final Score:</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Levels Completed:</span>
            <span className="stat-value">{currentLevel}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Best Streak:</span>
            <span className="stat-value">{streak}</span>
          </div>
        </div>
        <div className="completion-actions">
          <button onClick={() => startGame(selectedDifficulty)} className="play-again-btn">
            🔄 Play Again
          </button>
          <button onClick={resetGame} className="menu-btn">
            🏠 Main Menu
          </button>
        </div>
      </div>
    </div>
  );

  const renderGameOver = () => (
    <div className="game-over">
      <div className="game-over-overlay">
        <h2>💔 Game Over</h2>
        <p>You've run out of lives!</p>
        <div className="final-stats">
          <div className="stat-item">
            <span className="stat-label">Final Score:</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Levels Reached:</span>
            <span className="stat-value">{currentLevel}</span>
          </div>
        </div>
        <div className="game-over-actions">
          <button onClick={() => startGame(selectedDifficulty)} className="try-again-btn">
            🔄 Try Again
          </button>
          <button onClick={resetGame} className="menu-btn">
            🏠 Main Menu
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="programming-game">
      {gameState === 'menu' && renderMenu()}
      {gameState === 'playing' && renderGame()}
      {gameState === 'paused' && renderPaused()}
      {gameState === 'completed' && renderCompleted()}
      {gameState === 'game_over' && renderGameOver()}
    </div>
  );
};

export default ProgrammingGame;