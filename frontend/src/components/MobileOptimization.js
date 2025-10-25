import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Avatar,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Menu,
  Close,
  Phone,
  Email,
  LocationOn,
  AccessTime,
  Wifi,
  Battery6Bar,
  SignalCellular4Bar,
  TouchApp,
  Speed,
  Security,
} from '@mui/icons-material';

const MobileOptimization = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const mobileFeatures = [
    {
      title: 'Responsive Design',
      description: 'Optimized for all screen sizes from phones to tablets',
      icon: <TouchApp />,
      color: 'primary',
      features: [
        'Adaptive layouts',
        'Touch-friendly buttons',
        'Swipe gestures',
        'Portrait/landscape support',
      ],
    },
    {
      title: 'Offline Capability',
      description: 'Works even without internet connection',
      icon: <Wifi />,
      color: 'success',
      features: [
        'Cached shelter data',
        'Offline maps',
        'Emergency contacts',
        'Basic functionality',
      ],
    },
    {
      title: 'Fast Performance',
      description: 'Lightning-fast loading and smooth interactions',
      icon: <Speed />,
      color: 'info',
      features: [
        'Optimized images',
        'Lazy loading',
        'Minimal data usage',
        'Quick navigation',
      ],
    },
    {
      title: 'Security & Privacy',
      description: 'Bank-level security for sensitive information',
      icon: <Security />,
      color: 'warning',
      features: [
        'Encrypted data',
        'Secure authentication',
        'Privacy controls',
        'Safe browsing',
      ],
    },
  ];

  const mobileStats = [
    { label: 'Load Time', value: '< 2s', icon: <Speed /> },
    { label: 'Battery Usage', value: 'Low', icon: <Battery6Bar /> },
    { label: 'Data Usage', value: 'Minimal', icon: <SignalCellular4Bar /> },
    { label: 'Accessibility', value: '98%', icon: <TouchApp /> },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % mobileFeatures.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box>
      {/* Mobile Header */}
      <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Shelter Match Mobile
          </Typography>
          <IconButton color="inherit">
            <Phone />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <SwipeableDrawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Menu
            </Typography>
            <IconButton onClick={toggleDrawer}>
              <Close />
            </IconButton>
          </Box>
          <List>
            <ListItem button>
              <ListItemIcon>
                <LocationOn />
              </ListItemIcon>
              <ListItemText primary="Find Shelters" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <Phone />
              </ListItemIcon>
              <ListItemText primary="Emergency Contacts" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <Email />
              </ListItemIcon>
              <ListItemText primary="Support" />
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawer>

      {/* Mobile Optimization Content */}
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Mobile-First Design
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.6,
              }}
            >
              Optimized for mobile devices with responsive design, 
              offline capabilities, and lightning-fast performance.
            </Typography>
          </Box>
        </Fade>

        {/* Mobile Stats */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {mobileStats.map((stat, index) => (
            <Grid item xs={6} key={index}>
              <Zoom in timeout={1000 + index * 200}>
                <Card
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.05)',
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 40,
                      height: 40,
                      mx: 'auto',
                      mb: 1,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {stat.label}
                  </Typography>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        {/* Mobile Features */}
        <Grid container spacing={3}>
          {mobileFeatures.map((feature, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Zoom in timeout={1200 + index * 200}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: `${feature.color}.main`,
                        width: 50,
                        height: 50,
                        mr: 2,
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    {feature.features.map((feat, featIndex) => (
                      <Chip
                        key={featIndex}
                        label={feat}
                        size="small"
                        color={feature.color}
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        {/* Mobile Demo */}
        <Fade in timeout={1600}>
          <Card
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.05)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
              Mobile Demo
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Experience Shelter Match on your mobile device. 
                Swipe, tap, and explore with intuitive gestures.
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Try Mobile Version
              </Button>
            </Box>
          </Card>
        </Fade>
      </Box>
    </Box>
  );
};

export default MobileOptimization;
