import React, { useState, useEffect } from 'react';
import { Box, Typography, Switch, FormControlLabel, Slider, Button, Paper, Grid } from '@mui/material';
import { Accessibility, HighContrast, FontSize, VolumeUp, VolumeOff } from '@mui/icons-material';

const AccessibilityFeatures = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [screenReader, setScreenReader] = useState(false);
  const [audioDescriptions, setAudioDescriptions] = useState(false);

  useEffect(() => {
    // Apply accessibility settings to the document
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
    document.documentElement.style.setProperty('--high-contrast', highContrast ? '1' : '0');
  }, [fontSize, highContrast]);

  const handleFontSizeChange = (event, newValue) => {
    setFontSize(newValue);
  };

  const handleHighContrastToggle = () => {
    setHighContrast(!highContrast);
  };

  const handleScreenReaderToggle = () => {
    setScreenReader(!screenReader);
  };

  const handleAudioDescriptionsToggle = () => {
    setAudioDescriptions(!audioDescriptions);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Accessibility sx={{ mr: 2, color: 'primary.main' }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Accessibility Features
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" gutterBottom>
              Font Size: {fontSize}px
            </Typography>
            <Slider
              value={fontSize}
              onChange={handleFontSizeChange}
              min={12}
              max={24}
              step={1}
              marks={[
                { value: 12, label: '12px' },
                { value: 16, label: '16px' },
                { value: 20, label: '20px' },
                { value: 24, label: '24px' }
              ]}
              valueLabelDisplay="auto"
            />
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={highContrast}
                onChange={handleHighContrastToggle}
                color="primary"
              />
            }
            label="High Contrast Mode"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Switch
                checked={screenReader}
                onChange={handleScreenReaderToggle}
                color="primary"
              />
            }
            label="Screen Reader Support"
          />

          <FormControlLabel
            control={
              <Switch
                checked={audioDescriptions}
                onChange={handleAudioDescriptionsToggle}
                color="primary"
              />
            }
            label="Audio Descriptions"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
        <Typography variant="body2" color="info.contrastText">
          <strong>Accessibility Features:</strong> This app includes screen reader support, keyboard navigation, 
          high contrast mode, and adjustable font sizes to ensure everyone can access shelter and job information.
        </Typography>
      </Box>
    </Paper>
  );
};

export default AccessibilityFeatures;
