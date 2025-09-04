import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  School,
  Person,
  SupervisorAccount,
  FamilyRestroom,
  Lock,
  Email,
} from '@mui/icons-material';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock user database - in real app this would be in backend
  const mockUsers = {
    'student@watoto.edu': { password: 'student123', role: 'student', name: 'Alice Johnson' },
    'teacher@watoto.edu': { password: 'teacher123', role: 'teacher', name: 'Sarah Johnson' },
    'parent@watoto.edu': { password: 'parent123', role: 'parent', name: 'John Smith' },
    'admin@watoto.edu': { password: 'admin123', role: 'admin', name: 'Admin User' }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = mockUsers[formData.email];

      if (!user) {
        setError('User not found. Please check your email.');
        setLoading(false);
        return;
      }

      if (user.password !== formData.password) {
        setError('Invalid password. Please try again.');
        setLoading(false);
        return;
      }

      if (user.role !== formData.role) {
        setError(`This email is registered as a ${user.role}, not ${formData.role}.`);
        setLoading(false);
        return;
      }

      // Store user session (in real app, use JWT tokens)
      localStorage.setItem('user', JSON.stringify({
        email: formData.email,
        name: user.name,
        role: user.role,
        loggedIn: true
      }));

      // Redirect based on role
      switch (user.role) {
        case 'student':
          navigate('/');
          break;
        case 'teacher':
          navigate('/');
          break;
        case 'parent':
          navigate('/');
          break;
        case 'admin':
          navigate('/');
          break;
        default:
          navigate('/');
      }

    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'student@watoto.edu', password: 'student123', role: 'student', icon: <School />, title: 'Student Account' },
    { email: 'teacher@watoto.edu', password: 'teacher123', role: 'teacher', icon: <Person />, title: 'Teacher Account' },
    { email: 'parent@watoto.edu', password: 'parent123', role: 'parent', icon: <FamilyRestroom />, title: 'Parent Account' },
    { email: 'admin@watoto.edu', password: 'admin123', role: 'admin', icon: <SupervisorAccount />, title: 'Admin Account' }
  ];

  const quickLogin = (account) => {
    setFormData({
      email: account.email,
      password: account.password,
      role: account.role
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Login Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar sx={{ width: 60, height: 60, bgcolor: '#1976d2', mx: 'auto', mb: 2 }}>
                <Lock />
              </Avatar>
              <Typography variant="h4" component="h1" gutterBottom>
                Welcome to Watoto LMS
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Sign in to access your learning dashboard
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1, color: 'action.active' }} />
                }}
              />

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Login As</InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  label="Login As"
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="teacher">Teacher</MenuItem>
                  <MenuItem value="parent">Parent</MenuItem>
                  <MenuItem value="admin">Administrator</MenuItem>
                </Select>
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mb: 2 }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Demo Accounts */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Demo Accounts
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Click on any account below to auto-fill the login form
            </Typography>

            <Grid container spacing={2}>
              {demoAccounts.map((account, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3
                      }
                    }}
                    onClick={() => quickLogin(account)}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <Avatar sx={{ bgcolor: '#1976d2', mx: 'auto', mb: 1 }}>
                        {account.icon}
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {account.title}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {account.email}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Note:</strong> These are demo accounts for testing. In production,
                users will register and login with their own credentials.
              </Typography>
            </Alert>
          </Paper>
        </Grid>
      </Grid>

      {/* Features Section */}
      <Paper elevation={2} sx={{ mt: 4, p: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h3" gutterBottom>
          LMS Features by Role
        </Typography>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <School sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
              <Typography variant="h6">Students</Typography>
              <Typography variant="body2" color="textSecondary">
                • Access courses and materials<br/>
                • Take assessments and quizzes<br/>
                • Track learning progress<br/>
                • Download certificates
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Person sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
              <Typography variant="h6">Teachers</Typography>
              <Typography variant="body2" color="textSecondary">
                • Create and manage courses<br/>
                • Grade student assessments<br/>
                • Monitor student progress<br/>
                • Access teaching resources
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <FamilyRestroom sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
              <Typography variant="h6">Parents</Typography>
              <Typography variant="body2" color="textSecondary">
                • Monitor child progress<br/>
                • View completed courses<br/>
                • Access student reports<br/>
                • Communicate with teachers
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <SupervisorAccount sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
              <Typography variant="h6">Admins</Typography>
              <Typography variant="body2" color="textSecondary">
                • Manage users and roles<br/>
                • Configure system settings<br/>
                • Generate reports<br/>
                • Oversee all courses
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default LoginPage;