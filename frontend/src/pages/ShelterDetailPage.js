import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Alert,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Container,
  Stack,
  Paper,
  Fade,
  Zoom,
  Slide,
  IconButton,
  Badge,
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Email,
  Business,
  Schedule,
  Security,
  Message,
  Directions,
  Share,
  Bookmark,
  ArrowBack,
  Star,
  People,
  Home,
  Work,
  MedicalServices,
  Restaurant,
  Psychology,
  FamilyRestroom,
  DirectionsCar,
  AccessTime,
  CheckCircle,
  Warning,
  Info,
  Close,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { mockShelterService, mockRatingService } from '../api/mockData';

const ShelterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const [shelter, setShelter] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  useEffect(() => {
    fetchShelterDetails();
  }, [id]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      navigate('/shelters');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (contactDialogOpen) {
          setContactDialogOpen(false);
        } else {
          navigate('/shelters');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, contactDialogOpen]);

  const fetchShelterDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [shelterData, ratingsData] = await Promise.all([
        mockShelterService.getShelter(id),
        mockRatingService.getShelterRatings(id),
      ]);

      setShelter(shelterData);
      setRatings(ratingsData.ratings);
    } catch (error) {
      console.error('Error fetching shelter details:', error);
      setError('Failed to load shelter details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setContactDialogOpen(true);
  };

  const handleSendMessage = () => {
    // In a real app, this would send the message
    console.log('Sending message:', contactMessage);
    setContactDialogOpen(false);
    setContactMessage('');
  };

  const handleGetDirections = () => {
    const address = `${shelter.address.street}, ${shelter.address.city}, ${shelter.address.state} ${shelter.address.zipCode}`;
    const encodedAddress = encodeURIComponent(address);
    
    // Try to detect if user is on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Use device's default maps app
      window.open(`maps://maps.google.com/maps?daddr=${encodedAddress}`, '_blank');
    } else {
      // Open in new tab for desktop
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
    }
  };

  const handleCallNow = () => {
    // Remove any non-digit characters and format for tel: link
    const phoneNumber = shelter.contact.phone.replace(/\D/g, '');
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleShare = () => {
    const shareData = {
      title: `Shelter: ${shelter.name}`,
      text: `Check out ${shelter.name} - ${shelter.description}`,
      url: window.location.href
    };

    if (navigator.share) {
      // Use native share API if available (mobile)
      navigator.share(shareData).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Shelter link copied to clipboard!');
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Shelter link copied to clipboard!');
      });
    }
  };

  const getServiceIcon = (serviceName) => {
    const iconMap = {
      'Emergency Shelter': <Home />,
      'Meals': <Restaurant />,
      'Medical Care': <MedicalServices />,
      'Job Training': <Work />,
      'Counseling': <Psychology />,
      'Case Management': <People />,
      'Childcare': <FamilyRestroom />,
      'Transportation': <DirectionsCar />,
    };
    return iconMap[serviceName] || <Info />;
  };

  const getServiceColor = (serviceName) => {
    const colorMap = {
      'Emergency Shelter': 'primary',
      'Meals': 'success',
      'Medical Care': 'error',
      'Job Training': 'info',
      'Counseling': 'warning',
      'Case Management': 'secondary',
      'Childcare': 'primary',
      'Transportation': 'success',
    };
    return colorMap[serviceName] || 'default';
  };

  const formatOperatingHours = () => {
    if (!shelter.operatingHours) return [];
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return days.map((day, index) => {
      const dayHours = shelter.operatingHours[day];
      if (dayHours.closed) {
        return `${dayNames[index]}: Closed`;
      }
      return `${dayNames[index]}: ${dayHours.open} - ${dayHours.close}`;
    });
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Fade in>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
              Loading shelter details...
            </Typography>
          </Box>
        </Fade>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        p: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh'
      }}>
        <Container maxWidth="lg">
          <Fade in>
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}
            >
              {error}
            </Alert>
          </Fade>
          <Button 
            onClick={() => navigate('/shelters')} 
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontWeight: 700,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Back to Shelters
          </Button>
        </Container>
      </Box>
    );
  }

  if (!shelter) {
    return (
      <Box sx={{ 
        p: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh'
      }}>
        <Container maxWidth="lg">
          <Fade in>
            <Alert 
              severity="info" 
              sx={{ 
                mb: 3,
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}
            >
              Shelter not found
            </Alert>
          </Fade>
          <Button 
            onClick={() => navigate('/shelters')} 
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontWeight: 700,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Back to Shelters
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Header */}
        <Fade in timeout={800}>
          <Paper
            elevation={12}
            sx={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              p: 4,
              mb: 4,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            {/* Navigation */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/shelters')}
                sx={{
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  color: 'white',
                  borderRadius: 3,
                  px: 3,
                  py: 1,
                  fontWeight: 700,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Back to Shelters
              </Button>
            </Box>

            {/* Shelter Header */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
              <Zoom in timeout={1000}>
                <Avatar
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mr: 3, 
                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    border: '3px solid white'
                  }}
                  src={shelter.images?.[0]?.url}
                >
                  <Business sx={{ fontSize: 40 }} />
                </Avatar>
              </Zoom>
              
              <Box sx={{ flexGrow: 1 }}>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 800,
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                  }}
                >
                  {shelter.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating
                    value={shelter.rating?.average || 0}
                    precision={0.1}
                    readOnly
                    size="large"
                    sx={{ mr: 2 }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    {shelter.rating?.average || 0} ({shelter.rating?.count || 0} reviews)
                  </Typography>
                </Box>

                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'text.secondary',
                    lineHeight: 1.6,
                    maxWidth: '80%'
                  }}
                >
                  {shelter.description}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained"
                  startIcon={<Share />}
                  onClick={handleShare}
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    fontWeight: 700,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Share
                </Button>
                <Button 
                  variant="outlined"
                  startIcon={<Bookmark />}
                  onClick={() => alert('Shelter saved to your favorites!')}
                  sx={{
                    borderColor: '#667eea',
                    color: '#667eea',
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    fontWeight: 700,
                    '&:hover': {
                      borderColor: '#764ba2',
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Paper>
        </Fade>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {/* Contact Information */}
            <Slide in timeout={1200} direction="up">
              <Paper
                elevation={8}
                sx={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  p: 4,
                  mb: 3,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 3
                  }}
                >
                  Contact Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box 
                      onClick={handleGetDirections}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        p: 2,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                        border: '1px solid rgba(102, 126, 234, 0.2)',
                        mb: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <LocationOn sx={{ color: '#667eea', mr: 2, fontSize: 28 }} />
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {shelter.address.street}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {shelter.address.city}, {shelter.address.state} {shelter.address.zipCode}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box 
                      onClick={handleCallNow}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        p: 2,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                        border: '1px solid rgba(102, 126, 234, 0.2)',
                        mb: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Phone sx={{ color: '#667eea', mr: 2, fontSize: 28 }} />
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {shelter.contact.phone}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box 
                      onClick={() => window.open(`mailto:${shelter.contact.email}`, '_blank')}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        p: 2,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                        border: '1px solid rgba(102, 126, 234, 0.2)',
                        mb: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Email sx={{ color: '#667eea', mr: 2, fontSize: 28 }} />
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {shelter.contact.email}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box 
                      onClick={() => window.open(shelter.contact.website, '_blank')}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        p: 2,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                        border: '1px solid rgba(102, 126, 234, 0.2)',
                        mb: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Business sx={{ color: '#667eea', mr: 2, fontSize: 28 }} />
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {shelter.contact.website}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Slide>

            {/* Services */}
            {shelter.services && shelter.services.length > 0 && (
              <Slide in timeout={1400} direction="up">
                <Paper
                  elevation={8}
                  sx={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    p: 4,
                    mb: 3,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700,
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 3
                    }}
                  >
                    Services Provided
                  </Typography>
                  <Grid container spacing={2}>
                    {shelter.services.map((service, index) => (
                      <Grid item key={index}>
                        <Chip
                          icon={getServiceIcon(service.name)}
                          label={service.name}
                          color={getServiceColor(service.name)}
                          variant="filled"
                          sx={{
                            fontWeight: 600,
                            px: 2,
                            py: 1,
                            fontSize: '0.9rem',
                            borderRadius: 3,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Slide>
            )}

            {/* Operating Hours */}
            {shelter.operatingHours && (
              <Slide in timeout={1600} direction="up">
                <Paper
                  elevation={8}
                  sx={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    p: 4,
                    mb: 3,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700,
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 3
                    }}
                  >
                    Operating Hours
                  </Typography>
                  <List>
                    {formatOperatingHours().map((hours, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <AccessTime sx={{ color: '#667eea' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={hours}
                          sx={{ 
                            '& .MuiListItemText-primary': {
                              fontWeight: 600,
                              fontSize: '1.1rem'
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Slide>
            )}

            {/* Reviews */}
            {ratings.length > 0 && (
              <Slide in timeout={1800} direction="up">
                <Paper
                  elevation={8}
                  sx={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    p: 4,
                    mb: 3,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700,
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 3
                    }}
                  >
                    Reviews
                  </Typography>
                  {ratings.map((rating, index) => (
                    <Box key={index} sx={{ mb: 3, pb: 3, borderBottom: index < ratings.length - 1 ? 1 : 0, borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {rating.individual?.personalInfo?.firstName} {rating.individual?.personalInfo?.lastName}
                        </Typography>
                        <Rating value={rating.overallRating} readOnly size="small" />
                      </Box>
                      {rating.review?.content && (
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                          {t(rating.review.content)}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              </Slide>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Availability */}
            <Slide in timeout={1000} direction="left">
              <Paper
                elevation={8}
                sx={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  p: 4,
                  mb: 3,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 3
                  }}
                >
                  Availability
                </Typography>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography 
                    variant="h2" 
                    sx={{ 
                      fontWeight: 800,
                      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1
                    }}
                  >
                    {shelter.capacity?.availableBeds || 0}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    of {shelter.capacity?.totalBeds || 0} beds available
                  </Typography>
                  <Chip
                    label="Accepting new residents"
                    color="success"
                    sx={{
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      fontSize: '1rem',
                      borderRadius: 3,
                    }}
                  />
                </Box>
              </Paper>
            </Slide>

            {/* Get Help */}
            <Slide in timeout={1200} direction="left">
              <Paper
                elevation={8}
                sx={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  p: 4,
                  mb: 3,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 3
                  }}
                >
                  Get Help
                </Typography>
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Message />}
                    onClick={handleContact}
                    sx={{
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      borderRadius: 3,
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Contact Shelter
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Directions />}
                    onClick={handleGetDirections}
                    sx={{
                      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                      borderRadius: 3,
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Get Directions
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Phone />}
                    onClick={handleCallNow}
                    sx={{
                      background: 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)',
                      borderRadius: 3,
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Call Now
                  </Button>
                </Stack>
              </Paper>
            </Slide>

            {/* Requirements */}
            {shelter.requirements && shelter.requirements.length > 0 && (
              <Slide in timeout={1400} direction="left">
                <Paper
                  elevation={8}
                  sx={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    p: 4,
                    mb: 3,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700,
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 3
                    }}
                  >
                    Requirements
                  </Typography>
                  <List>
                    {shelter.requirements.map((req, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Security sx={{ color: req.mandatory ? '#f44336' : '#ff9800' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={req.type}
                          secondary={req.description}
                          sx={{ 
                            '& .MuiListItemText-primary': {
                              fontWeight: 600,
                              color: req.mandatory ? '#f44336' : '#ff9800'
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Slide>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Contact Dialog */}
      <Dialog 
        open={contactDialogOpen} 
        onClose={() => setContactDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700,
          fontSize: '1.5rem'
        }}>
          Contact {shelter.name}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={contactMessage}
            onChange={(e) => setContactMessage(e.target.value)}
            placeholder="Enter your message here..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setContactDialogOpen(false)}
            sx={{ 
              color: 'text.secondary',
              fontWeight: 600,
              px: 3,
              py: 1
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSendMessage}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              borderRadius: 3,
              px: 4,
              py: 1,
              fontWeight: 700,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShelterDetailPage;