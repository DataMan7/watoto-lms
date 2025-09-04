import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  Edit,
  Delete,
} from '@mui/icons-material';

const CoursesPage = () => {
  const navigate = useNavigate();

  const courses = [
    {
      id: 1,
      title: 'Digital Arts Fundamentals',
      instructor: 'Sarah Johnson',
      students: 32,
      progress: 75,
      status: 'In Progress',
      category: 'Arts',
      grade: 7,
      description: 'Introduction to digital art tools and basic design concepts'
    },
    {
      id: 2,
      title: 'Music Basics & Rhythm',
      instructor: 'Marcus Williams',
      students: 28,
      progress: 60,
      status: 'In Progress',
      category: 'Music',
      grade: 7,
      description: 'Learn basic music theory, rhythm, and simple compositions'
    },
    {
      id: 3,
      title: 'Python Programming & Music Creation',
      instructor: 'Dr. Emily Chen',
      students: 35,
      progress: 90,
      status: 'Almost Complete',
      category: 'Programming',
      grade: 7,
      description: 'Learn Python programming visually with blocks while creating music and art'
    },
    {
      id: 4,
      title: 'Advanced Digital Design',
      instructor: 'Anna Martinez',
      students: 29,
      progress: 65,
      status: 'In Progress',
      category: 'Arts',
      grade: 8,
      description: 'Advanced graphic design techniques and digital tools'
    },
    {
      id: 5,
      title: 'Music Composition & Production',
      instructor: 'Lisa Thompson',
      students: 24,
      progress: 80,
      status: 'Almost Complete',
      category: 'Music',
      grade: 8,
      description: 'Create and produce your own music using digital tools'
    },
    {
      id: 6,
      title: 'Python Programming & Digital Music',
      instructor: 'Prof. Michael Rodriguez',
      students: 31,
      progress: 45,
      status: 'In Progress',
      category: 'Programming',
      grade: 8,
      description: 'Write Python code to create digital music, synthesizers, and audio effects'
    },
  ];

  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(courses.map(course => course.category))];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Courses
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage and monitor all your courses from this central dashboard
        </Typography>
      </Box>

      {/* Search and Filter Bar */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />

        <TextField
          select
          label="Category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          SelectProps={{
            native: true,
          }}
          sx={{ minWidth: 150 }}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </TextField>

        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ ml: 'auto' }}
        >
          Create Course
        </Button>
      </Box>

      {/* Course Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Courses
              </Typography>
              <Typography variant="h5">
                {courses.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Courses
              </Typography>
              <Typography variant="h5">
                {courses.filter(course => course.status === 'In Progress').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Students
              </Typography>
              <Typography variant="h5">
                {courses.reduce((sum, course) => sum + course.students, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Progress
              </Typography>
              <Typography variant="h5">
                {Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Courses Grid */}
      <Grid container spacing={3}>
        {filteredCourses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {course.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={`Grade ${course.grade}`}
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={course.category}
                      color="secondary"
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>

                <Typography color="textSecondary" gutterBottom>
                  Instructor: {course.instructor}
                </Typography>

                <Typography variant="body2" paragraph sx={{ mb: 2 }}>
                  {course.description}
                </Typography>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {course.students} students enrolled
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    Progress: {course.progress}%
                  </Typography>
                  <Chip
                    label={course.status}
                    color={course.status === 'Almost Complete' ? 'success' : course.status === 'Just Started' ? 'warning' : 'primary'}
                    size="small"
                  />
                </Box>
              </CardContent>

              <CardActions>
                <Button size="small" color="primary" startIcon={<Edit />}>
                  Edit
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => navigate(`/course/${course.id}`)}
                >
                  View Course
                </Button>
                <Button size="small" color="error" startIcon={<Delete />}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredCourses.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="textSecondary">
            No courses found matching your search criteria
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Try adjusting your search terms or filters
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default CoursesPage;