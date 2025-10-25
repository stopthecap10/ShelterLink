import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  SwipeableDrawer,
  Fab,
  IconButton,
  Chip,
  Grid,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  Slide,
} from '@mui/material';
import {
  Menu,
  Close,
  Home,
  Business,
  Work,
  Message,
  Person,
  TrendingUp,
  PlayArrow,
  TouchApp,
  Gesture,
  Swipe,
} from '@mui/icons-material';

const MobileTouchInterface = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [touchGestures, setTouchGestures] = useState([]);
  const [swipeDirection, setSwipeDirection] = useState(null);

  const navigationItems = [
    { icon: <Home />, text: 'Home', path: '/', color: '#667eea' },
    { icon: <Business />, text: 'Shelters', path: '/shelters', color: '#764ba2' },
    { icon: <Work />, text: 'Jobs', path: '/jobs', color: '#f093fb' },
    { icon: <Message />, text: 'Messages', path: '/messages', color: '#4facfe' },
    { icon: <Person />, text: 'Profile', path: '/profile', color: '#43e97b' },
    { icon: <TrendingUp />, text: 'Impact', path: '/impact', color: '#fa709a' },
  ];

  useEffect(() => {
    if (isMobile) {
      // Add touch gesture detection
      const handleTouchStart = (e) => {
        const touch = e.touches[0];
        setTouchGestures([{ x: touch.clientX, y: touch.clientY, time: Date.now() }]);
      };

      const handleTouchMove = (e) => {
        const touch = e.touches[0];
        setTouchGestures(prev => [...prev, { x: touch.clientX, y: touch.clientY, time: Date.now() }]);
      };

      const handleTouchEnd = (e) => {
        if (touchGestures.length > 1) {
          const start = touchGestures[0];
          const end = touchGestures[touchGestures.length - 1];
          const deltaX = end.x - start.x;
          const deltaY = end.y - start.y;
          const deltaTime = end.time - start.time;

          if (deltaTime < 300) { // Quick swipe
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
              setSwipeDirection(deltaX > 0 ? 'right' : 'left');
            } else {
              setSwipeDirection(deltaY > 0 ? 'down' : 'up');
            }
          }
        }
        setTouchGestures([]);
      };

      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isMobile, touchGestures]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const TouchGestureIndicator = () => (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1300,
        display: swipeDirection ? 'block' : 'none',
      }}
    >
      <Chip
        icon={<Gesture />}
        label={`Swipe ${swipeDirection}`}
        color="primary"
        sx={{
          animation: 'pulse 0.5s ease-in-out',
          '& .MuiChip-icon': {
            animation: swipeDirection === 'left' ? 'bounceLeft 0.5s ease-in-out' :
                      swipeDirection === 'right' ? 'bounceRight 0.5s ease-in-out' :
                      swipeDirection === 'up' ? 'bounceUp 0.5s ease-in-out' :
                      'bounceDown 0.5s ease-in-out',
          }
        }}
      />
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {isMobile && <TouchGestureIndicator />}
      
      {/* Mobile Navigation Drawer */}
      <SwipeableDrawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Shelter Match
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {navigationItems.map((item, index) => (
              <Slide
                key={index}
                direction="left"
                in={drawerOpen}
                timeout={300 + index * 100}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateX(8px)',
                    },
                  }}
                >
                  <Box sx={{ color: item.color, mr: 2 }}>
                    {item.icon}
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {item.text}
                  </Typography>
                </Box>
              </Slide>
            ))}
          </Box>

          <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
              Touch Gestures
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip size="small" label="Swipe Left → Right" />
              <Chip size="small" label="Tap to Navigate" />
              <Chip size="small" label="Long Press" />
            </Box>
          </Box>
        </Box>
      </SwipeableDrawer>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease',
        }}
        onClick={handleDrawerToggle}
      >
        <Menu />
      </Fab>

      {/* Touch Gesture Demo */}
      <Box sx={{ p: 4, maxWidth: '800px', mx: 'auto' }}>
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
              Mobile-Optimized Experience
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Touch-friendly interface designed for mobile users
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Zoom in timeout={1000}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <TouchApp sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Touch Gestures
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Swipe sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Swipe Navigation
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Swipe left/right to navigate between sections
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Gesture sx={{ mr: 2, color: 'secondary.main' }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Tap to Interact
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Tap buttons and cards for quick access
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <PlayArrow sx={{ mr: 2, color: 'success.main' }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Long Press
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Long press for additional options
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          <Grid item xs={12} md={6}>
            <Zoom in timeout={1200}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Gesture sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Mobile Features
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Chip
                      icon={<TouchApp />}
                      label="Responsive Design"
                      color="primary"
                      variant="outlined"
                      sx={{ justifyContent: 'flex-start' }}
                    />
                    <Chip
                      icon={<Swipe />}
                      label="Swipe Navigation"
                      color="secondary"
                      variant="outlined"
                      sx={{ justifyContent: 'flex-start' }}
                    />
                    <Chip
                      icon={<Gesture />}
                      label="Touch Optimized"
                      color="success"
                      variant="outlined"
                      sx={{ justifyContent: 'flex-start' }}
                    />
                    <Chip
                      icon={<PlayArrow />}
                      label="Fast Loading"
                      color="warning"
                      variant="outlined"
                      sx={{ justifyContent: 'flex-start' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default MobileTouchInterface;
