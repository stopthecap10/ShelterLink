import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  Slider,
  Button,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  Alert,
} from '@mui/material';
import {
  Accessibility,
  Visibility,
  VisibilityOff,
  VolumeUp,
  VolumeOff,
  HighContrast,
  TextIncrease,
  TextDecrease,
  Keyboard,
  TouchApp,
  Hearing,
  Psychology,
  Support,
} from '@mui/icons-material';

const AccessibilityHub = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    voiceOver: false,
    colorBlindSupport: false,
    dyslexiaSupport: false,
  });
  const [fontSize, setFontSize] = useState(16);
  const [contrast, setContrast] = useState(1);

  useEffect(() => {
    // Apply accessibility settings to the document
    const root = document.documentElement;
    
    if (accessibilitySettings.highContrast) {
      root.style.setProperty('--contrast', '2');
      root.style.setProperty('--text-color', '#000000');
      root.style.setProperty('--bg-color', '#ffffff');
    } else {
      root.style.setProperty('--contrast', '1');
      root.style.setProperty('--text-color', '');
      root.style.setProperty('--bg-color', '');
    }

    if (accessibilitySettings.largeText) {
      root.style.setProperty('--font-size', `${fontSize + 4}px`);
    } else {
      root.style.setProperty('--font-size', `${fontSize}px`);
    }

    if (accessibilitySettings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0s');
    } else {
      root.style.setProperty('--animation-duration', '');
    }

    // Apply color blind support
    if (accessibilitySettings.colorBlindSupport) {
      root.style.setProperty('--color-blind-filter', 'url(#colorblind-filter)');
    } else {
      root.style.setProperty('--color-blind-filter', 'none');
    }
  }, [accessibilitySettings, fontSize]);

  const handleSettingChange = (setting) => {
    setAccessibilitySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const accessibilityFeatures = [
    {
      icon: <HighContrast />,
      title: 'High Contrast Mode',
      description: 'Increases contrast for better visibility',
      setting: 'highContrast',
      color: '#667eea',
    },
    {
      icon: <TextIncrease />,
      title: 'Large Text',
      description: 'Increases font size for better readability',
      setting: 'largeText',
      color: '#764ba2',
    },
    {
      icon: <VolumeUp />,
      title: 'Screen Reader',
      description: 'Enables screen reader compatibility',
      setting: 'screenReader',
      color: '#f093fb',
    },
    {
      icon: <Keyboard />,
      title: 'Keyboard Navigation',
      description: 'Full keyboard navigation support',
      setting: 'keyboardNavigation',
      color: '#4facfe',
    },
    {
      icon: <TouchApp />,
      title: 'Touch Support',
      description: 'Optimized for touch devices',
      setting: 'touchSupport',
      color: '#43e97b',
    },
    {
      icon: <Psychology />,
      title: 'Dyslexia Support',
      description: 'Font and spacing optimized for dyslexia',
      setting: 'dyslexiaSupport',
      color: '#fa709a',
    },
  ];

  const VoiceControl = () => (
    <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <VolumeUp sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Voice Control
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<VolumeUp />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              },
            }}
          >
            Start Voice Navigation
          </Button>
          
          <Typography variant="body2" color="text.secondary">
            Say "Navigate to shelters" or "Find jobs" to use voice commands
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const KeyboardShortcuts = () => (
    <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Keyboard sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Keyboard Shortcuts
          </Typography>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2">Alt + H</Typography>
              <Typography variant="body2" color="text.secondary">Home</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2">Alt + S</Typography>
              <Typography variant="body2" color="text.secondary">Shelters</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2">Alt + J</Typography>
              <Typography variant="body2" color="text.secondary">Jobs</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2">Alt + M</Typography>
              <Typography variant="body2" color="text.secondary">Messages</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Accessibility Hub
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            Inclusive design features to ensure everyone can access our platform
          </Typography>
        </Box>
      </Fade>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Zoom in timeout={1000}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Accessibility sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Accessibility Settings
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {accessibilityFeatures.map((feature, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 2,
                          border: '1px solid',
                          borderColor: 'grey.200',
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: feature.color,
                            bgcolor: `${feature.color}10`,
                          },
                        }}
                      >
                        <Box sx={{ color: feature.color, mr: 2 }}>
                          {feature.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {feature.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {feature.description}
                          </Typography>
                        </Box>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={accessibilitySettings[feature.setting] || false}
                              onChange={() => handleSettingChange(feature.setting)}
                              color="primary"
                            />
                          }
                          label=""
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Font Size
                  </Typography>
                  <Slider
                    value={fontSize}
                    onChange={(e, value) => setFontSize(value)}
                    min={12}
                    max={24}
                    step={1}
                    marks={[
                      { value: 12, label: 'Small' },
                      { value: 16, label: 'Medium' },
                      { value: 20, label: 'Large' },
                      { value: 24, label: 'Extra Large' },
                    ]}
                    sx={{ mb: 2 }}
                  />
                </Box>

                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Contrast Level
                  </Typography>
                  <Slider
                    value={contrast}
                    onChange={(e, value) => setContrast(value)}
                    min={0.5}
                    max={2}
                    step={0.1}
                    marks={[
                      { value: 0.5, label: 'Low' },
                      { value: 1, label: 'Normal' },
                      { value: 1.5, label: 'High' },
                      { value: 2, label: 'Maximum' },
                    ]}
                  />
                </Box>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Zoom in timeout={1200}>
              <VoiceControl />
            </Zoom>
            
            <Zoom in timeout={1400}>
              <KeyboardShortcuts />
            </Zoom>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          <Typography variant="body2">
            <strong>Accessibility Statement:</strong> We are committed to making our platform accessible to everyone. 
            If you encounter any accessibility barriers, please contact our support team.
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
};

export default AccessibilityHub;
