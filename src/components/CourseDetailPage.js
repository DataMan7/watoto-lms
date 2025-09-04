import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
} from '@mui/material';
import {
  PlayArrow,
  CheckCircle,
  Lock,
  Assignment,
  Download,
  Star,
  AccessTime,
  People,
  School,
} from '@mui/icons-material';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [enrolled, setEnrolled] = useState(false);
  const [currentModule, setCurrentModule] = useState(0);
  const [completedModules, setCompletedModules] = useState([]);
  const [showCertificate, setShowCertificate] = useState(false);

  // Mock course data - in real app this would come from API
  const courseData = {
    1: {
      id: 1,
      title: 'Digital Arts Fundamentals',
      instructor: 'Sarah Johnson',
      description: 'Introduction to digital art tools and basic design concepts',
      duration: '8 weeks',
      students: 32,
      rating: 4.8,
      price: 'Free',
      grade: 7,
      category: 'Arts',
      modules: [
        {
          id: 1,
          title: 'Introduction to Digital Art',
          duration: '45 min',
          type: 'video',
          completed: false,
          content: 'Learn the basics of digital art creation and tools'
        },
        {
          id: 2,
          title: 'Color Theory Basics',
          duration: '30 min',
          type: 'interactive',
          completed: false,
          content: 'Understanding color combinations and theory'
        },
        {
          id: 3,
          title: 'Digital Drawing Techniques',
          duration: '60 min',
          type: 'video',
          completed: false,
          content: 'Master digital drawing with various tools'
        },
        {
          id: 4,
          title: 'Final Project: Digital Artwork',
          duration: '90 min',
          type: 'project',
          completed: false,
          content: 'Create your first digital artwork masterpiece'
        }
      ],
      assessment: {
        title: 'Digital Arts Fundamentals Assessment',
        questions: 15,
        duration: '30 min',
        passingScore: 70,
        attempts: 0,
        maxAttempts: 3
      }
    },
    3: {
      id: 3,
      title: 'Python Programming & Music Creation',
      instructor: 'Dr. Emily Chen',
      description: 'Learn Python programming visually with blocks while creating music and art',
      duration: '12 weeks',
      students: 35,
      rating: 4.9,
      price: 'Free',
      grade: 7,
      category: 'Programming',
      modules: [
        {
          id: 1,
          title: 'Python Blocks Introduction',
          duration: '30 min',
          type: 'interactive',
          completed: false,
          content: 'Get started with visual Python programming'
        },
        {
          id: 2,
          title: 'Creating Your First Music Note',
          duration: '45 min',
          type: 'video',
          completed: false,
          content: 'Generate your first musical note with code'
        },
        {
          id: 3,
          title: 'Loops and Music Patterns',
          duration: '60 min',
          type: 'interactive',
          completed: false,
          content: 'Create repeating musical patterns'
        },
        {
          id: 4,
          title: 'Interactive Music Player',
          duration: '75 min',
          type: 'project',
          completed: false,
          content: 'Build an interactive music player'
        }
      ],
      assessment: {
        title: 'Python & Music Programming Assessment',
        questions: 20,
        duration: '45 min',
        passingScore: 75,
        attempts: 0,
        maxAttempts: 3
      }
    }
  };

  const course = courseData[courseId];

  if (!course) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4">Course Not Found</Typography>
        <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
      </Container>
    );
  }

  const handleEnroll = () => {
    setEnrolled(true);
  };

  const handleStartModule = (moduleId) => {
    setCurrentModule(moduleId);
    // In a real app, this would navigate to the module content
    alert(`Starting Module ${moduleId}: ${course.modules.find(m => m.id === moduleId)?.title}`);
  };

  const handleCompleteModule = (moduleId) => {
    setCompletedModules([...completedModules, moduleId]);
  };

  const handleTakeAssessment = () => {
    navigate(`/assessment/${courseId}`);
  };

  const handleDownloadCertificate = () => {
    // In a real app, this would generate and download a PDF certificate
    alert('Certificate downloaded! (PDF generation would be implemented here)');
  };

  const progress = (completedModules.length / course.modules.length) * 100;
  const allModulesCompleted = completedModules.length === course.modules.length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Course Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {course.title}
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Instructor: {course.instructor}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Chip label={`Grade ${course.grade}`} color="primary" />
          <Chip label={course.category} color="secondary" />
          <Chip label={`${course.rating} ★`} />
          <Chip label={`${course.students} students`} />
          <Chip label={course.duration} icon={<AccessTime />} />
        </Box>
        <Typography variant="body1" paragraph>
          {course.description}
        </Typography>
      </Box>

      {/* Enrollment/Progress Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Course Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress variant="determinate" value={progress} />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="textSecondary">
                    {Math.round(progress)}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="textSecondary">
                {completedModules.length} of {course.modules.length} modules completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              {!enrolled ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Ready to Start Learning?
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Enroll now to access all course materials and assessments.
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleEnroll}
                  >
                    Enroll Now - {course.price}
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    You're Enrolled! 🎉
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Access all course materials and track your progress.
                  </Typography>
                  {allModulesCompleted && (
                    <Button
                      variant="contained"
                      fullWidth
                      color="success"
                      onClick={() => setShowCertificate(true)}
                      sx={{ mb: 1 }}
                    >
                      Get Certificate
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleTakeAssessment}
                  >
                    Take Assessment
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Course Modules */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Course Modules
          </Typography>
          <List>
            {course.modules.map((module, index) => {
              const isCompleted = completedModules.includes(module.id);
              const isLocked = !enrolled || (!isCompleted && index > 0 && !completedModules.includes(course.modules[index - 1].id));

              return (
                <ListItem
                  key={module.id}
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    mb: 1,
                    opacity: isLocked ? 0.6 : 1,
                  }}
                >
                  <ListItemIcon>
                    {isCompleted ? (
                      <CheckCircle color="success" />
                    ) : isLocked ? (
                      <Lock color="disabled" />
                    ) : (
                      <PlayArrow color="primary" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1">
                          Module {module.id}: {module.title}
                        </Typography>
                        <Chip
                          label={module.type}
                          size="small"
                          color={module.type === 'video' ? 'primary' : module.type === 'interactive' ? 'secondary' : 'success'}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {module.content}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Duration: {module.duration}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {isCompleted && (
                      <Chip label="Completed" color="success" size="small" />
                    )}
                    {!isLocked && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleStartModule(module.id)}
                      >
                        {isCompleted ? 'Review' : 'Start'}
                      </Button>
                    )}
                    {!isCompleted && !isLocked && (
                      <Button
                        variant="contained"
                        size="small"
                        color="success"
                        onClick={() => handleCompleteModule(module.id)}
                      >
                        Complete
                      </Button>
                    )}
                  </Box>
                </ListItem>
              );
            })}
          </List>
        </CardContent>
      </Card>

      {/* Assessment Section */}
      {enrolled && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Course Assessment
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  Questions: {course.assessment.questions}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Duration: {course.assessment.duration}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Passing Score: {course.assessment.passingScore}%
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  Attempts: {course.assessment.attempts}/{course.assessment.maxAttempts}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleTakeAssessment}
                  disabled={!allModulesCompleted}
                  sx={{ mt: 1 }}
                >
                  {course.assessment.attempts > 0 ? 'Retake Assessment' : 'Take Assessment'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Certificate Dialog */}
      <Dialog open={showCertificate} onClose={() => setShowCertificate(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          🎉 Congratulations! Course Completed
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
              <School sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h5" gutterBottom>
              Certificate of Completion
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              {course.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Awarded to: Student Name
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Completed on: {new Date().toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Instructor: {course.instructor}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCertificate(false)}>Close</Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleDownloadCertificate}
          >
            Download PDF Certificate
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CourseDetailPage;