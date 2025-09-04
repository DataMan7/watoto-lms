import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import {
  Timer,
  CheckCircle,
  Cancel,
  Download,
} from '@mui/icons-material';

const AssessmentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [showResults, setShowResults] = useState(false);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);

  // Mock assessment data
  const assessmentData = {
    title: 'Digital Arts Fundamentals Assessment',
    duration: '30 minutes',
    questions: [
      {
        id: 1,
        question: 'What is the primary purpose of the RGB color model in digital art?',
        options: [
          'To create monochromatic designs',
          'To represent colors using red, green, and blue light combinations',
          'To limit the color palette to 256 colors',
          'To convert images to black and white'
        ],
        correctAnswer: 1,
        explanation: 'RGB (Red, Green, Blue) is an additive color model used in digital displays where different combinations of these three primary colors create various colors.'
      },
      {
        id: 2,
        question: 'Which tool is commonly used for selecting irregular shapes in digital art software?',
        options: [
          'Rectangle Tool',
          'Lasso Tool',
          'Line Tool',
          'Text Tool'
        ],
        correctAnswer: 1,
        explanation: 'The Lasso Tool allows for free-form selection of irregular shapes, making it perfect for selecting complex or organic shapes.'
      },
      {
        id: 3,
        question: 'What does DPI stand for in digital imaging?',
        options: [
          'Digital Picture Index',
          'Dots Per Inch',
          'Design Pixel Interface',
          'Digital Processing Image'
        ],
        correctAnswer: 1,
        explanation: 'DPI stands for Dots Per Inch, which measures the resolution of digital images and printed materials.'
      },
      {
        id: 4,
        question: 'Which file format is best for saving images with transparency?',
        options: [
          'JPEG',
          'PNG',
          'BMP',
          'TIFF'
        ],
        correctAnswer: 1,
        explanation: 'PNG format supports transparency through alpha channels, making it ideal for images that need to blend with different backgrounds.'
      },
      {
        id: 5,
        question: 'What is the purpose of layers in digital art software?',
        options: [
          'To increase file size',
          'To organize and separate different elements of an artwork',
          'To reduce image quality',
          'To limit editing capabilities'
        ],
        correctAnswer: 1,
        explanation: 'Layers allow artists to work on different elements separately, making it easier to edit, move, and modify individual parts of an artwork.'
      }
    ]
  };

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !assessmentCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmitAssessment();
    }
  }, [timeLeft, assessmentCompleted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: parseInt(answer)
    });
  };

  const handleNext = () => {
    if (currentQuestion < assessmentData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitAssessment = () => {
    setAssessmentCompleted(true);
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    assessmentData.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / assessmentData.questions.length) * 100);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const handleDownloadCertificate = () => {
    // In a real app, this would generate a PDF certificate
    alert('Assessment Certificate downloaded! (PDF generation would be implemented here)');
  };

  const progress = ((currentQuestion + 1) / assessmentData.questions.length) * 100;

  if (assessmentCompleted) {
    const score = calculateScore();
    const passed = score >= 70;

    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" gutterBottom>
              Assessment Completed!
            </Typography>

            <Box sx={{ my: 4 }}>
              <Typography variant="h2" color={getScoreColor(score).main} sx={{ fontWeight: 'bold' }}>
                {score}%
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                {passed ? '🎉 Congratulations! You Passed!' : '📚 Keep Learning!'}
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Chip
                label={passed ? 'PASSED' : 'FAILED'}
                color={passed ? 'success' : 'error'}
                size="large"
                sx={{ fontSize: '1.2rem', py: 1, px: 3 }}
              />
            </Box>

            <Typography variant="body1" sx={{ mb: 2 }}>
              You answered {Object.keys(answers).length} out of {assessmentData.questions.length} questions
            </Typography>

            {passed && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Certificate Available
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={handleDownloadCertificate}
                  size="large"
                >
                  Download Certificate
                </Button>
              </Box>
            )}

            <Box sx={{ mt: 4 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/courses')}
                sx={{ mr: 2 }}
              >
                Back to Courses
              </Button>
              <Button
                variant="contained"
                onClick={() => window.location.reload()}
              >
                Retake Assessment
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  const currentQ = assessmentData.questions[currentQuestion];

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* Assessment Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">
              {assessmentData.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Timer />
              <Typography variant="h6" color={timeLeft < 300 ? 'error' : 'primary'}>
                {formatTime(timeLeft)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Question {currentQuestion + 1} of {assessmentData.questions.length}
            </Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ mt: 1 }} />
          </Box>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {currentQ.question}
          </Typography>

          <RadioGroup
            value={answers[currentQ.id] || ''}
            onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
            sx={{ mt: 2 }}
          >
            {currentQ.options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={index}
                control={<Radio />}
                label={option}
                sx={{
                  mb: 1,
                  alignItems: 'flex-start',
                  '& .MuiFormControlLabel-label': {
                    lineHeight: 1.4,
                    mt: 0.5
                  }
                }}
              />
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {currentQuestion === assessmentData.questions.length - 1 ? (
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmitAssessment}
              disabled={!answers[currentQ.id]}
            >
              Submit Assessment
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!answers[currentQ.id]}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>

      {/* Question Navigation */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
        {assessmentData.questions.map((_, index) => (
          <Button
            key={index}
            variant={currentQuestion === index ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setCurrentQuestion(index)}
            sx={{
              minWidth: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: answers[assessmentData.questions[index].id] !== undefined ?
                (currentQuestion === index ? 'primary.main' : 'success.main') :
                (currentQuestion === index ? 'primary.main' : 'grey.300')
            }}
          >
            {index + 1}
          </Button>
        ))}
      </Box>
    </Container>
  );
};

export default AssessmentPage;