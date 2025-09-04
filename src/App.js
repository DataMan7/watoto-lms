import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
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
  MusicNote,
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import page components
import DashboardPage from './components/DashboardPage';
import CoursesPage from './components/CoursesPage';
import StudentsPage from './components/StudentsPage';
import AssessmentsPage from './components/AssessmentsPage';
import SettingsPage from './components/SettingsPage';
import CourseDetailPage from './components/CourseDetailPage';
import AssessmentPage from './components/AssessmentPage';
import LoginPage from './components/LoginPage';

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

// Authentication check
const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  if (!user) return false;
  const userData = JSON.parse(user);
  return userData.loggedIn;
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  return isAuthenticated() ? children : null;
};

function AppContent() {
  const navigate = useNavigate();
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

  const handleMenuClick = (path) => {
    navigate(path);
    setMobileOpen(false); // Close mobile drawer after navigation
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

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
          <ListItem
            button
            key={item.text}
            onClick={() => handleMenuClick(item.path)}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#e3f2fd',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#1976d2' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{ color: '#1976d2' }}
            />
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
                  border: '2px solid #1976d2',
                  cursor: 'pointer'
                }}
                onClick={() => navigate('/')}
                onError={(e) => {
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
                  display: { xs: 'none', sm: 'block' },
                  cursor: 'pointer'
                }}
                onClick={() => navigate('/')}
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

            <Avatar
              sx={{ ml: 2, bgcolor: '#1976d2', cursor: 'pointer' }}
              onClick={handleLogout}
              title="Logout"
            >
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
              keepMounted: true,
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
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/courses" element={
              <ProtectedRoute>
                <CoursesPage />
              </ProtectedRoute>
            } />
            <Route path="/course/:courseId" element={
              <ProtectedRoute>
                <CourseDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/students" element={
              <ProtectedRoute>
                <StudentsPage />
              </ProtectedRoute>
            } />
            <Route path="/assessments" element={
              <ProtectedRoute>
                <AssessmentsPage />
              </ProtectedRoute>
            } />
            <Route path="/assessment/:courseId" element={
              <ProtectedRoute>
                <AssessmentPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <AppContent />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
