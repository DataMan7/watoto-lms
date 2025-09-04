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
  Switch,
  TextField,
  FormControlLabel,
  Divider,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Settings,
  Person,
  Security,
  Notifications,
  Palette,
  Language,
  Storage,
  Backup,
} from '@mui/icons-material';

const SettingsPage = () => {
  const [settings, setSettings] = React.useState({
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      courseUpdates: true,
      assessmentReminders: true,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
    },
    appearance: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC+3',
    },
    system: {
      autoBackup: true,
      dataRetention: 365,
      maxFileSize: 50,
    },
  });

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const settingSections = [
    {
      title: 'Profile Settings',
      icon: <Person />,
      color: '#1976d2',
      items: [
        { label: 'Display Name', value: 'Watoto LMS Admin', type: 'text' },
        { label: 'Email', value: 'admin@watoto-lms.edu', type: 'email' },
        { label: 'Institution', value: 'Watoto Learning Center', type: 'text' },
      ],
    },
    {
      title: 'Notifications',
      icon: <Notifications />,
      color: '#ff9800',
      items: [
        {
          label: 'Email Notifications',
          value: settings.notifications.emailNotifications,
          type: 'switch',
          onChange: (value) => handleSettingChange('notifications', 'emailNotifications', value),
        },
        {
          label: 'Push Notifications',
          value: settings.notifications.pushNotifications,
          type: 'switch',
          onChange: (value) => handleSettingChange('notifications', 'pushNotifications', value),
        },
        {
          label: 'Course Updates',
          value: settings.notifications.courseUpdates,
          type: 'switch',
          onChange: (value) => handleSettingChange('notifications', 'courseUpdates', value),
        },
        {
          label: 'Assessment Reminders',
          value: settings.notifications.assessmentReminders,
          type: 'switch',
          onChange: (value) => handleSettingChange('notifications', 'assessmentReminders', value),
        },
      ],
    },
    {
      title: 'Security',
      icon: <Security />,
      color: '#4caf50',
      items: [
        {
          label: 'Two-Factor Authentication',
          value: settings.security.twoFactorAuth,
          type: 'switch',
          onChange: (value) => handleSettingChange('security', 'twoFactorAuth', value),
        },
        {
          label: 'Session Timeout (minutes)',
          value: settings.security.sessionTimeout,
          type: 'number',
          onChange: (value) => handleSettingChange('security', 'sessionTimeout', parseInt(value)),
        },
        {
          label: 'Password Expiry (days)',
          value: settings.security.passwordExpiry,
          type: 'number',
          onChange: (value) => handleSettingChange('security', 'passwordExpiry', parseInt(value)),
        },
      ],
    },
    {
      title: 'Appearance',
      icon: <Palette />,
      color: '#9c27b0',
      items: [
        {
          label: 'Theme',
          value: settings.appearance.theme,
          type: 'select',
          options: ['light', 'dark', 'auto'],
          onChange: (value) => handleSettingChange('appearance', 'theme', value),
        },
        {
          label: 'Language',
          value: settings.appearance.language,
          type: 'select',
          options: ['en', 'es', 'fr', 'de'],
          onChange: (value) => handleSettingChange('appearance', 'language', value),
        },
        {
          label: 'Timezone',
          value: settings.appearance.timezone,
          type: 'text',
          onChange: (value) => handleSettingChange('appearance', 'timezone', value),
        },
      ],
    },
    {
      title: 'System',
      icon: <Storage />,
      color: '#607d8b',
      items: [
        {
          label: 'Auto Backup',
          value: settings.system.autoBackup,
          type: 'switch',
          onChange: (value) => handleSettingChange('system', 'autoBackup', value),
        },
        {
          label: 'Data Retention (days)',
          value: settings.system.dataRetention,
          type: 'number',
          onChange: (value) => handleSettingChange('system', 'dataRetention', parseInt(value)),
        },
        {
          label: 'Max File Size (MB)',
          value: settings.system.maxFileSize,
          type: 'number',
          onChange: (value) => handleSettingChange('system', 'maxFileSize', parseInt(value)),
        },
      ],
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Configure your LMS preferences, security settings, and system options
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {settingSections.map((section, sectionIndex) => (
          <Grid item xs={12} md={6} key={sectionIndex}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ mr: 2, bgcolor: section.color }}>
                    {section.icon}
                  </Avatar>
                  <Typography variant="h6" component="h2">
                    {section.title}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {section.items.map((item, itemIndex) => (
                    <Box key={itemIndex}>
                      {item.type === 'switch' && (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={item.value}
                              onChange={(e) => item.onChange(e.target.checked)}
                              color="primary"
                            />
                          }
                          label={item.label}
                        />
                      )}

                      {item.type === 'text' && (
                        <TextField
                          fullWidth
                          label={item.label}
                          value={item.value}
                          onChange={(e) => item.onChange(e.target.value)}
                          variant="outlined"
                          size="small"
                        />
                      )}

                      {item.type === 'email' && (
                        <TextField
                          fullWidth
                          label={item.label}
                          value={item.value}
                          onChange={(e) => item.onChange(e.target.value)}
                          variant="outlined"
                          size="small"
                          type="email"
                        />
                      )}

                      {item.type === 'number' && (
                        <TextField
                          fullWidth
                          label={item.label}
                          value={item.value}
                          onChange={(e) => item.onChange(e.target.value)}
                          variant="outlined"
                          size="small"
                          type="number"
                        />
                      )}

                      {item.type === 'select' && (
                        <TextField
                          fullWidth
                          label={item.label}
                          value={item.value}
                          onChange={(e) => item.onChange(e.target.value)}
                          variant="outlined"
                          size="small"
                          select
                          SelectProps={{
                            native: true,
                          }}
                        >
                          {item.options.map((option) => (
                            <option key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                          ))}
                        </TextField>
                      )}
                    </Box>
                  ))}
                </Box>
              </CardContent>

              <CardActions>
                <Button size="small" color="primary">
                  Save Changes
                </Button>
                <Button size="small" color="secondary">
                  Reset to Default
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* System Information */}
      <Box sx={{ mt: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              System Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Version
                  </Typography>
                  <Typography variant="body1">
                    Watoto LMS v1.0.0
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1">
                    {new Date().toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Storage Used
                  </Typography>
                  <Typography variant="body1">
                    2.3 GB / 10 GB
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Active Users
                  </Typography>
                  <Typography variant="body1">
                    156 students, 12 teachers
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Danger Zone */}
      <Box sx={{ mt: 4 }}>
        <Card sx={{ border: '1px solid #f44336' }}>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#f44336' }}>
              Danger Zone
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              These actions are irreversible. Please proceed with caution.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="outlined" color="error" startIcon={<Backup />}>
                Export All Data
              </Button>
              <Button variant="outlined" color="error">
                Reset All Settings
              </Button>
              <Button variant="contained" color="error">
                Delete All Data
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default SettingsPage;