import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  Slide,
} from '@mui/material';
import {
  Emergency,
  Phone,
  LocationOn,
  AccessTime,
  CrisisAlert,
  LocalHospital,
  Security,
  Support,
  Warning,
  CheckCircle,
  Timer,
  People,
} from '@mui/icons-material';

const EmergencySupportSystem = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [emergencyDialog, setEmergencyDialog] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [emergencyStatus, setEmergencyStatus] = useState('standby');
  const [responseTime, setResponseTime] = useState(0);

  const emergencyTypes = [
    {
      id: 'medical',
      title: 'Medical Emergency',
      description: 'Immediate medical attention required',
      icon: <LocalHospital />,
      color: '#e53e3e',
      hotline: '911',
      responseTime: '2-5 minutes',
      priority: 'Critical',
    },
    {
      id: 'safety',
      title: 'Safety Threat',
      description: 'Immediate danger to personal safety',
      icon: <Security />,
      color: '#dd6b20',
      hotline: '911',
      responseTime: '2-5 minutes',
      priority: 'Critical',
    },
    {
      id: 'mental_health',
      title: 'Mental Health Crisis',
      description: 'Suicidal thoughts or mental health emergency',
      icon: <CrisisAlert />,
      color: '#805ad5',
      hotline: '988',
      responseTime: 'Immediate',
      priority: 'High',
    },
    {
      id: 'domestic_violence',
      title: 'Domestic Violence',
      description: 'Immediate threat from domestic violence',
      icon: <Warning />,
      color: '#d53e8c',
      hotline: '800-799-7233',
      responseTime: 'Immediate',
      priority: 'High',
    },
    {
      id: 'homelessness',
      title: 'Homelessness Crisis',
      description: 'Immediate need for shelter and resources',
      icon: <People />,
      color: '#38a169',
      hotline: '211',
      responseTime: '24 hours',
      priority: 'Medium',
    },
  ];

  const emergencyResources = [
    {
      name: 'National Suicide Prevention Lifeline',
      phone: '988',
      available: '24/7',
      description: 'Crisis counseling and suicide prevention',
    },
    {
      name: 'National Domestic Violence Hotline',
      phone: '800-799-7233',
      available: '24/7',
      description: 'Support for domestic violence survivors',
    },
    {
      name: 'Crisis Text Line',
      phone: 'Text HOME to 741741',
      available: '24/7',
      description: 'Crisis support via text message',
    },
    {
      name: 'National Runaway Safeline',
      phone: '800-786-2929',
      available: '24/7',
      description: 'Support for runaway and homeless youth',
    },
    {
      name: 'Veterans Crisis Line',
      phone: '800-273-8255',
      available: '24/7',
      description: 'Crisis support for veterans',
    },
  ];

  useEffect(() => {
    if (emergencyStatus === 'active') {
      const timer = setInterval(() => {
        setResponseTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [emergencyStatus]);

  const handleEmergencyClick = (emergency) => {
    setSelectedEmergency(emergency);
    setEmergencyDialog(true);
    setEmergencyStatus('active');
    setResponseTime(0);
  };

  const handleEmergencyCall = () => {
    // Simulate emergency call
    setEmergencyStatus('calling');
    setTimeout(() => {
      setEmergencyStatus('connected');
    }, 3000);
  };

  const EmergencyDialog = () => (
    <Dialog
      open={emergencyDialog}
      onClose={() => setEmergencyDialog(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: selectedEmergency?.color ? `${selectedEmergency.color}10` : 'white',
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          {selectedEmergency?.icon}
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
            {selectedEmergency?.title}
          </Typography>
        </Box>
        <Chip
          label={selectedEmergency?.priority}
          color={selectedEmergency?.priority === 'Critical' ? 'error' : 'warning'}
          size="small"
        />
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {selectedEmergency?.description}
        </Typography>

        {emergencyStatus === 'active' && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Emergency response initiated. Response time: {selectedEmergency?.responseTime}
            </Typography>
          </Alert>
        )}

        {emergencyStatus === 'calling' && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Timer sx={{ mr: 1 }} />
              <Typography variant="body2">
                Connecting to emergency services... ({responseTime}s)
              </Typography>
            </Box>
          </Alert>
        )}

        {emergencyStatus === 'connected' && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircle sx={{ mr: 1 }} />
              <Typography variant="body2">
                Connected to emergency services
              </Typography>
            </Box>
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Phone />}
            onClick={handleEmergencyCall}
            disabled={emergencyStatus === 'calling' || emergencyStatus === 'connected'}
            sx={{
              background: selectedEmergency?.color || 'primary.main',
              '&:hover': {
                background: selectedEmergency?.color || 'primary.dark',
              },
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            Call {selectedEmergency?.hotline}
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<LocationOn />}
            sx={{ py: 1.5 }}
          >
            Share Location
          </Button>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={() => setEmergencyDialog(false)}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #e53e3e 0%, #dd6b20 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Emergency Support System
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            Immediate crisis support and emergency resources
          </Typography>
        </Box>
      </Fade>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Zoom in timeout={1000}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Emergency sx={{ color: 'error.main', mr: 2, fontSize: 32 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Emergency Types
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  {emergencyTypes.map((emergency, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Slide direction="up" in timeout={800 + index * 100}>
                        <Card
                          sx={{
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                            },
                            border: '2px solid',
                            borderColor: emergency.color,
                            borderRadius: 3,
                          }}
                          onClick={() => handleEmergencyClick(emergency)}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Box sx={{ color: emergency.color, mr: 2 }}>
                                {emergency.icon}
                              </Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                                {emergency.title}
                              </Typography>
                              <Chip
                                label={emergency.priority}
                                size="small"
                                color={emergency.priority === 'Critical' ? 'error' : 'warning'}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {emergency.description}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {emergency.hotline}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {emergency.responseTime}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Slide>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>

        <Grid item xs={12} md={4}>
          <Zoom in timeout={1200}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Support sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Crisis Resources
                  </Typography>
                </Box>

                <List>
                  {emergencyResources.map((resource, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <Phone color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={resource.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {resource.phone}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {resource.description} • {resource.available}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
      </Grid>

      <EmergencyDialog />
    </Box>
  );
};

export default EmergencySupportSystem;
