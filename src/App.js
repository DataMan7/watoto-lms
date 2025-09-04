import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Dashboard,
  Book,
  People,
  Assessment,
  Settings,
  AccountCircle,
  School,
  MenuBook,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  MusicNote, // Using MusicNote as TikTok icon (since TikTok doesn't have a direct icon)
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#ffffff', // White
      contrastText: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#1976d2',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      color: '#1976d2',
      fontWeight: 600,
    },
    h5: {
      color: '#1976d2',
      fontWeight: 500,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1976d2',
          boxShadow: '0 2px 4px rgba(25, 118, 210, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e3f2fd',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(25, 118, 210, 0.1)',
          border: '1px solid #e3f2fd',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#1976d2',
          '&:hover': {
            backgroundColor: '#1565c0',
          },
        },
        outlinedPrimary: {
          color: '#1976d2',
          borderColor: '#1976d2',
          '&:hover': {
            backgroundColor: '#e3f2fd',
            borderColor: '#1565c0',
          },
        },
      },
    },
  },
});

const drawerWidth = 240;

function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'My Courses', icon: <Book />, path: '/courses' },
    { text: 'Students', icon: <People />, path: '/students' },
    { text: 'Assessments', icon: <Assessment />, path: '/assessments' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  const courses = [
    // Grade 7 Courses
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
      title: 'Python Programming & Music Creation (Block-Based)',
      instructor: 'Dr. Emily Chen',
      students: 35,
      progress: 90,
      status: 'Almost Complete',
      category: 'Programming',
      grade: 7,
      description: 'Learn Python programming visually with blocks while creating music and art (EduBlocks methodology)',
      curriculum: {
        duration: '3 months (Sept-Nov)',
        methodology: 'Block-Based Coding → Text Transition',
        tools: ['EduBlocks', 'Visual Python Editor', 'Turtle Graphics'],
        weeklyModules: [
          'Week 1-2: EduBlocks Setup & Visual Programming Basics',
          'Week 3-4: Block-Based Variables & Simple Music Notes',
          'Week 5-6: Loops & Patterns with Music Blocks',
          'Week 7-8: Functions as Music "Recipes" (Block Form)',
          'Week 9-10: Conditional Logic & Interactive Music Blocks',
          'Week 11-12: Transition to Text Code & Final Music Project'
        ],
        learningApproach: 'Start with drag-and-drop blocks, gradually introduce Python text syntax',
        finalProject: 'Create an original musical composition using both blocks and simple Python code',
        skills: ['Visual programming', 'Python basics', 'Music creation', 'Block-to-text transition']
      }
    },

    // Grade 8 Courses
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
      title: 'Python Programming & Digital Music Production (Text-Based)',
      instructor: 'Prof. Michael Rodriguez',
      students: 31,
      progress: 45,
      status: 'In Progress',
      category: 'Programming',
      grade: 8,
      description: 'Write Python code to create digital music, synthesizers, and audio effects using text-based programming',
      curriculum: {
        duration: '3 months (Sept-Nov)',
        methodology: 'Text-Based Python Programming',
        tools: ['Python IDLE', 'VS Code', 'Audio Libraries (Pygame, PyAudio)'],
        weeklyModules: [
          'Week 1-2: Python Text Syntax & Audio Library Installation',
          'Week 3-4: Writing Code for Sound Generation & Wave Forms',
          'Week 5-6: Coding Music Theory - Chord Progressions in Python',
          'Week 7-8: MIDI Programming with Python Scripts',
          'Week 9-10: Audio Effects & Signal Processing Algorithms',
          'Week 11-12: Advanced Music Composition with Python Code'
        ],
        learningApproach: 'Full text-based Python programming with audio focus',
        finalProject: 'Create a digital music synthesizer and compose an original piece using Python code',
        skills: ['Python text coding', 'Audio programming', 'Music algorithms', 'Code debugging']
      }
    },

    // Grade 9 Courses
    {
      id: 7,
      title: 'Digital Media Arts',
      instructor: 'Carlos Rivera',
      students: 27,
      progress: 70,
      status: 'In Progress',
      category: 'Arts',
      grade: 9,
      description: 'Advanced digital media creation and multimedia projects'
    },
    {
      id: 8,
      title: 'Advanced Music Theory',
      instructor: 'Robert Davis',
      students: 33,
      progress: 55,
      status: 'In Progress',
      category: 'Music',
      grade: 9,
      description: 'Complex music theory, harmony, and advanced composition'
    },
    {
      id: 9,
      title: 'Python Web Development & Music Streaming (Advanced Text Coding)',
      instructor: 'David Kim',
      students: 38,
      progress: 30,
      status: 'Just Started',
      category: 'Programming',
      grade: 9,
      description: 'Code a full music streaming platform using Python Flask/Django with advanced text-based programming',
      curriculum: {
        duration: '3 months (Sept-Nov)',
        methodology: 'Advanced Text-Based Python Development',
        tools: ['Flask/Django', 'PostgreSQL', 'VS Code', 'Git'],
        weeklyModules: [
          'Week 1-2: Writing Flask/Django Applications from Scratch',
          'Week 3-4: Coding Database Models for Music Libraries',
          'Week 5-6: Implementing User Auth with Python Code',
          'Week 7-8: Audio Streaming Algorithms in Python',
          'Week 9-10: Advanced Music Tools Integration',
          'Week 11-12: Full-Stack Music Platform Development'
        ],
        learningApproach: 'Professional Python web development with complex algorithms',
        finalProject: 'Build and deploy a complete music streaming platform with user-generated content',
        skills: ['Full-stack Python', 'Web frameworks', 'Database design', 'API development']
      }
    },
    {
      id: 10,
      title: 'Python Game Development & Interactive Music (Advanced Coding)',
      instructor: 'Dr. Sophia Patel',
      students: 26,
      progress: 40,
      status: 'In Progress',
      category: 'Programming',
      grade: 9,
      description: 'Create interactive games and music applications using advanced Python programming techniques',
      curriculum: {
        duration: '3 months (Sept-Nov)',
        methodology: 'Advanced Game Development',
        tools: ['Pygame', 'Python Arcade', 'VS Code', 'Git'],
        weeklyModules: [
          'Week 1-2: Game Development Fundamentals with Python',
          'Week 3-4: Interactive Music Systems Programming',
          'Week 5-6: Game Physics and Audio Integration',
          'Week 7-8: Advanced Graphics and Animation',
          'Week 9-10: Multiplayer Game Concepts',
          'Week 11-12: Complete Game with Music Features'
        ],
        learningApproach: 'Professional game development with integrated music systems',
        finalProject: 'Build a complete interactive game with dynamic music generation and sound effects',
        skills: ['Game development', 'Interactive audio', 'Advanced Python', 'Graphics programming']
      }
    }
  ];

  const drawer = (
    <div>
      <Toolbar>
        <School sx={{ mr: 2 }} />
        <Typography variant="h6" noWrap component="div">
          Watoto LMS
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text}>
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        {/* App Bar */}
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <Button
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuBook />
            </Button>

            {/* Logo Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
              <Avatar
                src="/logo-watoto.jpeg"
                alt="Watoto LMS Logo"
                sx={{
                  width: 40,
                  height: 40,
                  mr: 1,
                  border: '2px solid #1976d2'
                }}
                onError={(e) => {
                  // Fallback to default logo if custom logo fails to load
                  e.target.src = '/logo192.png';
                }}
              />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  fontWeight: 'bold',
                  color: '#1976d2',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Watoto LMS
              </Typography>
            </Box>

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: 1,
                color: '#1976d2',
                fontWeight: 500
              }}
            >
              Learning Management System
            </Typography>

            <Avatar sx={{ ml: 2, bgcolor: '#1976d2' }}>
              <AccountCircle />
            </Avatar>
          </Toolbar>
        </AppBar>

        {/* Navigation Drawer */}
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` }
          }}
        >
          <Toolbar />
          <Container maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome to Watoto LMS
            </Typography>
            <Typography variant="body1" paragraph>
              Manage your courses, track student progress, and deliver engaging learning experiences.
            </Typography>

            {/* Quick Stats */}
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
                      Completion Rate
                    </Typography>
                    <Typography variant="h5">
                      {Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length)}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Grade-wise Course Sections */}
            {[7, 8, 9].map((grade) => {
              const gradeCourses = courses.filter(course => course.grade === grade);
              const gradeStats = {
                totalStudents: gradeCourses.reduce((sum, course) => sum + course.students, 0),
                avgProgress: Math.round(gradeCourses.reduce((sum, course) => sum + course.progress, 0) / gradeCourses.length),
                activeCourses: gradeCourses.filter(course => course.status === 'In Progress').length
              };

              return (
                <Box key={grade} sx={{ mb: 6 }}>
                  <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
                    Grade {grade} Courses
                    <Chip
                      label={`${gradeCourses.length} courses`}
                      color="primary"
                      size="small"
                      sx={{ ml: 2 }}
                    />
                  </Typography>

                  {/* Grade Statistics */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={4}>
                      <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" color="primary">
                            {gradeStats.totalStudents}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Students Enrolled
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" color="secondary">
                            {gradeStats.avgProgress}%
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Average Progress
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" color="success.main">
                            {gradeStats.activeCourses}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Active Courses
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Grade Courses Grid */}
                  <Grid container spacing={3}>
                    {gradeCourses.map((course) => (
                      <Grid item xs={12} sm={6} md={4} key={course.id}>
                        <Card>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="h6" component="h3" gutterBottom>
                                {course.title}
                              </Typography>
                              <Chip
                                label={`Grade ${course.grade}`}
                                color="primary"
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                            <Typography color="textSecondary" gutterBottom>
                              Instructor: {course.instructor}
                            </Typography>
                            <Typography variant="body2" paragraph sx={{ mb: 2 }}>
                              {course.description}
                            </Typography>
                            {course.curriculum && (
                              <Box sx={{ mb: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                <Typography variant="body2" color="primary" fontWeight="bold">
                                  📅 {course.curriculum.duration}
                                </Typography>
                                {course.curriculum.methodology && (
                                  <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold', color: 'secondary.main' }}>
                                    🛠️ {course.curriculum.methodology}
                                  </Typography>
                                )}
                                {course.curriculum.tools && (
                                  <Typography variant="body2" sx={{ mt: 1 }}>
                                    🧰 Tools: {course.curriculum.tools.join(', ')}
                                  </Typography>
                                )}
                                {course.curriculum.learningApproach && (
                                  <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                                    📖 {course.curriculum.learningApproach}
                                  </Typography>
                                )}
                                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                                  🎯 Final Project: {course.curriculum.finalProject}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  📚 Key Skills: {course.curriculum.skills.join(', ')}
                                </Typography>
                              </Box>
                            )}
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              {course.students} students enrolled • {course.category}
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
                            <Button size="small" color="primary">
                              View Course
                            </Button>
                            <Button size="small" color="secondary">
                              Manage
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              );
            })}

            {/* Social Media Footer */}
            <Box sx={{
              mt: 8,
              pt: 4,
              borderTop: '1px solid #e3f2fd',
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 'bold' }}>
                Connect With Us
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
                Follow us on social media for updates, tips, and educational content
              </Typography>

              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 3,
                mb: 3,
                flexWrap: 'wrap'
              }}>
                <Button
                  variant="outlined"
                  startIcon={<Facebook />}
                  sx={{
                    color: '#1877f2',
                    borderColor: '#1877f2',
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                      borderColor: '#1877f2'
                    }
                  }}
                  onClick={() => window.open('https://facebook.com/watoto-lms', '_blank')}
                >
                  Facebook
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Twitter />}
                  sx={{
                    color: '#1da1f2',
                    borderColor: '#1da1f2',
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                      borderColor: '#1da1f2'
                    }
                  }}
                  onClick={() => window.open('https://twitter.com/watoto_lms', '_blank')}
                >
                  Twitter
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Instagram />}
                  sx={{
                    color: '#e4405f',
                    borderColor: '#e4405f',
                    '&:hover': {
                      backgroundColor: '#fce4ec',
                      borderColor: '#e4405f'
                    }
                  }}
                  onClick={() => window.open('https://instagram.com/watoto_lms', '_blank')}
                >
                  Instagram
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<LinkedIn />}
                  sx={{
                    color: '#0077b5',
                    borderColor: '#0077b5',
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                      borderColor: '#0077b5'
                    }
                  }}
                  onClick={() => window.open('https://linkedin.com/company/watoto-lms', '_blank')}
                >
                  LinkedIn
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<YouTube />}
                  sx={{
                    color: '#ff0000',
                    borderColor: '#ff0000',
                    '&:hover': {
                      backgroundColor: '#ffebee',
                      borderColor: '#ff0000'
                    }
                  }}
                  onClick={() => window.open('https://youtube.com/@watoto-lms', '_blank')}
                >
                  YouTube
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<MusicNote />}
                  sx={{
                    color: '#000000',
                    borderColor: '#000000',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                      borderColor: '#000000'
                    }
                  }}
                  onClick={() => window.open('https://tiktok.com/@YOUR_SCHOOL_HANDLE', '_blank')}
                >
                  TikTok
                </Button>
              </Box>

              <Typography variant="body2" sx={{ color: '#999', fontSize: '0.875rem' }}>
                © 2024 Watoto LMS. Empowering Education Through Technology.
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
