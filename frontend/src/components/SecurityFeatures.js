import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Switch, FormControlLabel, Alert, Grid, Paper } from '@mui/material';
import { Security, PrivacyTip, Shield, Lock, Visibility, VisibilityOff } from '@mui/icons-material';

const SecurityFeatures = () => {
  const [privacySettings, setPrivacySettings] = useState({
    dataSharing: false,
    locationTracking: false,
    profileVisibility: 'private',
    twoFactorAuth: false,
    dataEncryption: true
  });

  const handleSettingChange = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Security & Privacy Features
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Security sx={{ mr: 1, color: 'primary.main' }} />
              Privacy Controls
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={privacySettings.dataSharing}
                    onChange={(e) => handleSettingChange('dataSharing', e.target.checked)}
                    color="primary"
                  />
                }
                label="Allow data sharing for research (anonymized)"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={privacySettings.locationTracking}
                    onChange={(e) => handleSettingChange('locationTracking', e.target.checked)}
                    color="primary"
                  />
                }
                label="Enable location tracking for nearby services"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={privacySettings.twoFactorAuth}
                    onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                    color="primary"
                  />
                }
                label="Two-factor authentication"
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Shield sx={{ mr: 1, color: 'primary.main' }} />
              Data Protection
            </Typography>
            
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>End-to-end encryption</strong> protects all your personal information and communications.
              </Typography>
            </Alert>

            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>GDPR compliant</strong> - You have full control over your data and can request deletion at any time.
              </Typography>
            </Alert>

            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Secure authentication</strong> - All login attempts are monitored and protected against unauthorized access.
              </Typography>
            </Alert>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={2} sx={{ p: 3, mt: 3, borderRadius: 2, bgcolor: 'info.light' }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <PrivacyTip sx={{ mr: 1, color: 'info.contrastText' }} />
          Your Privacy Rights
        </Typography>
        <Typography variant="body2" color="info.contrastText">
          • <strong>Data Portability:</strong> Export your data in a standard format<br/>
          • <strong>Right to Deletion:</strong> Request complete removal of your information<br/>
          • <strong>Access Rights:</strong> View and download all data we have about you<br/>
          • <strong>Correction Rights:</strong> Update or correct any inaccurate information<br/>
          • <strong>Consent Withdrawal:</strong> Opt out of data processing at any time
        </Typography>
      </Paper>
    </Box>
  );
};

export default SecurityFeatures;
