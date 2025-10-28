import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Business,
  Work,
  Message,
  Person,
  Logout,
  Notifications,
  Search,
  LocationOn,
  Home,
  Close,
  CrisisAlert,
  VolunteerActivism,
  TrendingUp,
  PlayArrow,
  Translate,
} from '@mui/icons-material';
import LanguageToggle from './LanguageToggle';
import EmergencyPanel from './EmergencyPanel';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { useLanguage } from '../contexts/LanguageContext';

const Layout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const { user, logout } = useAuth();
  const { unreadCount } = useSocket();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/');
  };

  const navigationItems = [
    { icon: <Home />, text: t('home'), path: '/' },
    { icon: <Dashboard />, text: t('dashboard'), path: '/dashboard' },
    { icon: <Business />, text: t('findShelters'), path: '/shelters' },
    { icon: <Work />, text: t('findJobs'), path: '/jobs' },
    { icon: <Message />, text: t('messages'), path: '/messages' },
    { icon: <Person />, text: t('profile'), path: '/profile' },
    { icon: <TrendingUp />, text: t('impact.title'), path: '/impact' },
    { icon: <PlayArrow />, text: t('demo'), path: '/demo' },
    { icon: <Translate />, text: t('languages'), path: '/languages' },
    { icon: <Business />, text: 'Shelter Staff', path: '/shelter-staff-login' },
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const drawer = (
    <Box sx={{ width: 280, height: '100%', bgcolor: 'background.paper' }}>
      {/* Drawer Header */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            Shelter Link
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {user ? `Welcome, ${user.email}` : 'Guest User'}
          </Typography>
        </Box>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ color: 'white' }}
        >
          <Close />
        </IconButton>
      </Box>

      {/* Navigation Items */}
      <List sx={{ px: 2, py: 2 }}>
        {navigationItems.map((item, index) => (
          <ListItem
            key={index}
            onClick={() => {
              navigate(item.path);
              setDrawerOpen(false);
            }}
            sx={{
              mb: 1,
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              bgcolor: isActivePath(item.path) ? 'primary.main' : 'transparent',
              color: isActivePath(item.path) ? 'white' : 'text.primary',
              '&:hover': {
                bgcolor: isActivePath(item.path) ? 'primary.dark' : 'grey.100',
                transform: 'translateX(4px)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isActivePath(item.path) ? 'white' : 'text.secondary',
                minWidth: 40,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: isActivePath(item.path) ? 600 : 400,
                },
              }}
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mx: 2 }} />

      {/* Emergency Resources */}
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
          Emergency Resources
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<CrisisAlert />}
          sx={{ mb: 1, borderRadius: 2 }}
        >
          Crisis Hotline: 988
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          startIcon={<VolunteerActivism />}
          sx={{ borderRadius: 2 }}
        >
          Emergency Resources
        </Button>
      </Box>

      {/* Language Toggle */}
      <Box sx={{ p: 2 }}>
        <LanguageToggle />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 } }}>
          {/* Left Section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              onClick={() => navigate('/')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 40,
                  height: 40,
                  mr: 2,
                }}
              >
                <LocationOn />
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    lineHeight: 1,
                  }}
                >
                  Shelter Link
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1,
                  }}
                >
                  {user ? `Welcome back!` : 'Find hope, find home'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Center Section - Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navigationItems.slice(1).map((item, index) => (
                <Button
                  key={index}
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  sx={{
                    color: isActivePath(item.path) ? 'primary.main' : 'text.secondary',
                    fontWeight: isActivePath(item.path) ? 600 : 400,
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'grey.100',
                      color: 'primary.main',
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          {/* Right Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Notifications */}
            <IconButton
              onClick={() => navigate('/messages')}
              sx={{ color: 'text.secondary' }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <Message />
              </Badge>
            </IconButton>

            {/* Emergency Panel */}
            <EmergencyPanel />

            {/* Language Toggle */}
            <Box sx={{ mx: 1 }}>
              <LanguageToggle />
            </Box>

            {/* User Menu */}
            {user ? (
              <>
                <IconButton
                  onClick={handleProfileMenuOpen}
                  sx={{ ml: 1 }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: 'primary.main',
                      fontSize: '0.875rem',
                    }}
                  >
                    {user.email.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={profileMenuAnchor}
                  open={Boolean(profileMenuAnchor)}
                  onClose={handleProfileMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      borderRadius: 2,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {user.email}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {user.userType === 'shelter' ? 'Shelter Organization' : 'Individual'}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={() => navigate('/profile')}>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  sx={{ borderRadius: 2 }}
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/register')}
                  sx={{ borderRadius: 2 }}
                >
                  Get Started
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
