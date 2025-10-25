import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Avatar,
  Button,
  IconButton,
  Badge,
  Fade,
  Zoom,
  useTheme,
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  LocationOn,
  Work,
  Schedule,
  Star,
  CheckCircle,
  Warning,
  Info,
  Close,
  MarkAsUnread,
} from '@mui/icons-material';

const SmartNotifications = () => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Simulate smart notifications
    const smartNotifications = [
      {
        id: 1,
        type: 'bed_available',
        title: 'Bed Available at Union Rescue Mission',
        message: 'A bed just became available at Union Rescue Mission. You have 15 minutes to respond.',
        priority: 'high',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        read: false,
        action: 'Reserve Now',
        icon: <LocationOn />,
        color: 'success',
      },
      {
        id: 2,
        type: 'job_match',
        title: 'New Job Match Found',
        message: 'We found a kitchen assistant position that matches your skills and location preferences.',
        priority: 'medium',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: false,
        action: 'View Job',
        icon: <Work />,
        color: 'info',
      },
      {
        id: 3,
        type: 'weather_alert',
        title: 'Weather Alert - High Demand Expected',
        message: 'Cold weather is expected tonight. Shelter demand will increase by 40%. Consider checking in early.',
        priority: 'high',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: true,
        action: 'View Shelters',
        icon: <Warning />,
        color: 'warning',
      },
      {
        id: 4,
        type: 'success_milestone',
        title: 'Congratulations! 30 Days Stable',
        message: 'You\'ve reached a major milestone! 30 days of stable housing. Keep up the great work!',
        priority: 'low',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: true,
        action: 'View Progress',
        icon: <Star />,
        color: 'success',
      },
      {
        id: 5,
        type: 'appointment_reminder',
        title: 'Appointment Reminder',
        message: 'You have a job training session tomorrow at 10:00 AM. Don\'t forget to bring your ID.',
        priority: 'medium',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        read: false,
        action: 'Set Reminder',
        icon: <Schedule />,
        color: 'primary',
      },
    ];

    setNotifications(smartNotifications);
    setUnreadCount(smartNotifications.filter(n => !n.read).length);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <Warning />;
      case 'medium': return <Info />;
      case 'low': return <CheckCircle />;
      default: return <Info />;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <Box>
      {/* Header */}
      <Fade in timeout={800}>
        <Card sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                <Notifications />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Smart Notifications
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  AI-powered alerts to keep you informed and connected
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsActive />
              </Badge>
              {unreadCount > 0 && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={markAllAsRead}
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': { borderColor: 'white' }
                  }}
                >
                  Mark All Read
                </Button>
              )}
            </Box>
          </Box>
        </Card>
      </Fade>

      {/* Unread Notifications */}
      {unreadNotifications.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
            Unread Notifications ({unreadCount})
          </Typography>
          <List>
            {unreadNotifications.map((notification, index) => (
              <Zoom in timeout={1000 + index * 100} key={notification.id}>
                <Card
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: notification.priority === 'high' ? 'error.main' : 
                               notification.priority === 'medium' ? 'warning.main' : 'info.main',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <ListItem sx={{ p: 2 }}>
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: `${notification.color}.main`,
                          width: 40,
                          height: 40,
                        }}
                      >
                        {notification.icon}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {notification.title}
                          </Typography>
                          <Chip
                            label={notification.priority.toUpperCase()}
                            size="small"
                            color={getPriorityColor(notification.priority)}
                            sx={{ fontWeight: 600 }}
                          />
                          <Chip
                            label={formatTimeAgo(notification.timestamp)}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {notification.message}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              color={notification.color}
                              sx={{ borderRadius: 2 }}
                            >
                              {notification.action}
                            </Button>
                            <IconButton
                              size="small"
                              onClick={() => markAsRead(notification.id)}
                              sx={{ color: 'text.secondary' }}
                            >
                              <CheckCircle />
                            </IconButton>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                </Card>
              </Zoom>
            ))}
          </List>
        </Box>
      )}

      {/* Read Notifications */}
      {readNotifications.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
            Recent Notifications
          </Typography>
          <List>
            {readNotifications.map((notification, index) => (
              <Fade in timeout={1200 + index * 100} key={notification.id}>
                <Card
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    opacity: 0.7,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      opacity: 1,
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <ListItem sx={{ p: 2 }}>
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: `${notification.color}.main`,
                          width: 36,
                          height: 36,
                          opacity: 0.8,
                        }}
                      >
                        {notification.icon}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                            {notification.title}
                          </Typography>
                          <Chip
                            label={formatTimeAgo(notification.timestamp)}
                            size="small"
                            variant="outlined"
                            sx={{ opacity: 0.7 }}
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          {notification.message}
                        </Typography>
                      }
                    />
                    <IconButton
                      size="small"
                      sx={{ opacity: 0.5 }}
                    >
                      <CheckCircle sx={{ color: 'success.main' }} />
                    </IconButton>
                  </ListItem>
                </Card>
              </Fade>
            ))}
          </List>
        </Box>
      )}

      {/* Smart Notification Settings */}
      <Fade in timeout={1400}>
        <Card sx={{ p: 3, mt: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Smart Notification Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Our AI learns from your preferences to send only the most relevant notifications.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              label="Bed Availability Alerts"
              color="success"
              variant="outlined"
            />
            <Chip
              label="Job Match Notifications"
              color="info"
              variant="outlined"
            />
            <Chip
              label="Weather Alerts"
              color="warning"
              variant="outlined"
            />
            <Chip
              label="Success Milestones"
              color="primary"
              variant="outlined"
            />
            <Chip
              label="Appointment Reminders"
              color="secondary"
              variant="outlined"
            />
          </Box>
        </Card>
      </Fade>
    </Box>
  );
};

export default SmartNotifications;
