import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  Assessment,
  CheckCircle,
  Schedule,
  Grade,
} from '@mui/icons-material';

const AssessmentsPage = () => {
  const assessments = [
    {
      id: 1,
      title: 'Python Programming Quiz - Grade 7',
      course: 'Python Programming & Music Creation',
      type: 'Quiz',
      dueDate: '2024-01-15',
      status: 'Active',
      submissions: 28,
      totalStudents: 35,
      averageScore: 78,
      questions: 15,
    },
    {
      id: 2,
      title: 'Digital Arts Project Review',
      course: 'Digital Arts Fundamentals',
      type: 'Project',
      dueDate: '2024-01-20',
      status: 'Grading',
      submissions: 30,
      totalStudents: 32,
      averageScore: null,
      questions: 1,
    },
    {
      id: 3,
      title: 'Music Theory Midterm',
      course: 'Music Basics & Rhythm',
      type: 'Exam',
      dueDate: '2024-01-10',
      status: 'Completed',
      submissions: 26,
      totalStudents: 28,
      averageScore: 82,
      questions: 25,
    },
    {
      id: 4,
      title: 'Advanced Python Assignment',
      course: 'Python Programming & Digital Music',
      type: 'Assignment',
      dueDate: '2024-01-25',
      status: 'Draft',
      submissions: 0,
      totalStudents: 31,
      averageScore: null,
      questions: 1,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'primary';
      case 'Completed': return 'success';
      case 'Grading': return 'warning';
      case 'Draft': return 'default';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Quiz': return <Assessment />;
      case 'Exam': return <Grade />;
      case 'Project': return <CheckCircle />;
      case 'Assignment': return <Schedule />;
      default: return <Assessment />;
    }
  };

  const getSubmissionRate = (submissions, total) => {
    return Math.round((submissions / total) * 100);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Assessments
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Create, manage, and grade assessments for your courses
        </Typography>
      </Box>

      {/* Assessment Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Assessments
              </Typography>
              <Typography variant="h5">
                {assessments.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Assessments
              </Typography>
              <Typography variant="h5">
                {assessments.filter(a => a.status === 'Active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Submissions
              </Typography>
              <Typography variant="h5">
                {assessments.reduce((sum, a) => sum + a.submissions, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Score
              </Typography>
              <Typography variant="h5">
                {Math.round(
                  assessments
                    .filter(a => a.averageScore !== null)
                    .reduce((sum, a) => sum + a.averageScore, 0) /
                  assessments.filter(a => a.averageScore !== null).length
                )}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create New Assessment Button */}
      <Box sx={{ mb: 4 }}>
        <Button variant="contained" size="large" startIcon={<Assessment />}>
          Create New Assessment
        </Button>
      </Box>

      {/* Assessments Grid */}
      <Grid container spacing={3}>
        {assessments.map((assessment) => (
          <Grid item xs={12} md={6} key={assessment.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: '#1976d2' }}>
                    {getTypeIcon(assessment.type)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {assessment.title}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {assessment.course}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Chip
                        label={assessment.type}
                        color="secondary"
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={assessment.status}
                        color={getStatusColor(assessment.status)}
                        size="small"
                      />
                    </Box>
                  </Box>
                </Box>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Due: {new Date(assessment.dueDate).toLocaleDateString()}
                </Typography>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {assessment.questions} {assessment.questions === 1 ? 'question' : 'questions'}
                </Typography>

                {/* Submission Progress */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      Submissions: {assessment.submissions}/{assessment.totalStudents}
                    </Typography>
                    <Typography variant="body2">
                      {getSubmissionRate(assessment.submissions, assessment.totalStudents)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={getSubmissionRate(assessment.submissions, assessment.totalStudents)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                {/* Average Score (if available) */}
                {assessment.averageScore !== null && (
                  <Typography variant="body2" color="textSecondary">
                    Average Score: {assessment.averageScore}%
                  </Typography>
                )}
              </CardContent>

              <CardActions>
                <Button size="small" color="primary">
                  View Details
                </Button>
                <Button size="small" color="secondary">
                  Edit
                </Button>
                {assessment.status === 'Grading' && (
                  <Button size="small" color="success">
                    Grade Submissions
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {assessments.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="textSecondary">
            No assessments found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Create your first assessment to get started
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default AssessmentsPage;