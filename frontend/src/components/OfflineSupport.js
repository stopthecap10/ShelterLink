import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Chip, Alert, Grid, Paper, Button } from '@mui/material';
import { WifiOff, Wifi, Download, CloudOff, CloudDone } from '@mui/icons-material';

const OfflineSupport = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState({
    shelters: [],
    emergencyContacts: [],
    lastSync: null
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load offline data from localStorage
    const savedData = localStorage.getItem('offlineData');
    if (savedData) {
      setOfflineData(JSON.parse(savedData));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const downloadOfflineData = () => {
    // Simulate downloading critical data for offline use
    const mockOfflineData = {
      shelters: [
        { name: 'Union Rescue Mission', phone: '(213) 347-6300', address: '545 S San Pedro St, Los Angeles, CA 90013' },
        { name: 'LA Mission', phone: '(213) 629-1227', address: '303 E 5th St, Los Angeles, CA 90013' },
        { name: 'Midnight Mission', phone: '(213) 624-9258', address: '601 S San Pedro St, Los Angeles, CA 90014' }
      ],
      emergencyContacts: [
        { name: 'Emergency Services', number: '911' },
        { name: 'Crisis Lifeline', number: '988' },
        { name: 'Community Services', number: '211' }
      ],
      lastSync: new Date().toISOString()
    };

    setOfflineData(mockOfflineData);
    localStorage.setItem('offlineData', JSON.stringify(mockOfflineData));
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Offline Support
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {isOnline ? <Wifi sx={{ mr: 1, color: 'success.main' }} /> : <WifiOff sx={{ mr: 1, color: 'error.main' }} />}
              <Typography variant="h6">
                Connection Status
              </Typography>
            </Box>
            
            <Chip
              label={isOnline ? 'Online' : 'Offline'}
              color={isOnline ? 'success' : 'error'}
              sx={{ mb: 2 }}
            />

            {!isOnline && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                You're currently offline. Some features may be limited, but you can still access:
                <ul>
                  <li>Emergency contacts</li>
                  <li>Basic shelter information</li>
                  <li>Offline maps (if downloaded)</li>
                </ul>
              </Alert>
            )}

            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={downloadOfflineData}
              fullWidth
              sx={{ mb: 2 }}
            >
              Download Offline Data
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <CloudOff sx={{ mr: 1, color: 'primary.main' }} />
              Offline Resources
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Critical information available offline:
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Emergency Shelters ({offlineData.shelters.length})
              </Typography>
              {offlineData.shelters.map((shelter, index) => (
                <Card key={index} sx={{ mt: 1, p: 1, bgcolor: 'background.default' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {shelter.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {shelter.phone} • {shelter.address}
                  </Typography>
                </Card>
              ))}
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Emergency Contacts ({offlineData.emergencyContacts.length})
              </Typography>
              {offlineData.emergencyContacts.map((contact, index) => (
                <Card key={index} sx={{ mt: 1, p: 1, bgcolor: 'background.default' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {contact.name}: {contact.number}
                  </Typography>
                </Card>
              ))}
            </Box>

            {offlineData.lastSync && (
              <Typography variant="caption" color="text.secondary">
                Last synced: {new Date(offlineData.lastSync).toLocaleString()}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OfflineSupport;
