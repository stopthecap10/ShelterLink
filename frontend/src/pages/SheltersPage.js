import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Rating,
  IconButton,
  Pagination,
  CircularProgress,
  Alert,
  Fade,
  Zoom,
  Slide,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
  Paper,
} from '@mui/material';
import {
  Search,
  LocationOn,
  Business,
  People,
  Star,
  Phone,
  Email,
  Map,
  List,
  ArrowBack,
  Home,
  AccessTime,
  Wifi,
  LocalParking,
  Restaurant,
  MedicalServices,
  Security,
  Speed,
  TrendingUp,
  FilterList,
  ViewList,
  ViewModule,
  Map as MapIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useShelterData } from '../contexts/ShelterDataContext';
import { mockShelterService } from '../api/mockData';
import LanguageToggle from '../components/LanguageToggle';

const SheltersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { shelters } = useShelterData();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  // Removed map view - using list view only
  const [availableOnly, setAvailableOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    // Data is now provided by ShelterDataContext
    setLoading(false);
  }, []);

  // Remove fetchShelters function since data comes from context

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsGettingLocation(false);
        
        // If "closest to me" is selected, trigger a re-sort
        if (sortBy === 'closest') {
          // Force re-render by updating sortBy
          setSortBy('closest');
        }
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enable location permissions.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An unknown error occurred while retrieving location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    
    // If "closest to me" is selected and we don't have location yet, get it
    if (newSortBy === 'closest' && !userLocation) {
      getUserLocation();
    }
  };

  const getServiceIcon = (serviceName) => {
    const iconMap = {
      'Emergency Shelter': <Home />,
      'Meals': <Restaurant />,
      'Medical Care': <MedicalServices />,
      'Job Training': <Business />,
      'Counseling': <People />,
      'Case Management': <People />,
      'Childcare': <People />,
      'Transportation': <LocationOn />,
    };
    return iconMap[serviceName] || <Business />;
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

  const translateServiceName = (serviceName) => {
    const serviceMap = {
      'Emergency Shelter': t('emergencyShelter'),
      'Meals': t('meals'),
      'Medical Care': t('medicalCare'),
      'Job Training': t('jobTraining'),
      'Counseling': t('counseling'),
      'Case Management': t('caseManagement'),
      'Childcare': t('childcare'),
      'Transportation': t('transportation'),
      'LGBTQ+ Shelter': t('lgbtqShelter'),
      'Housing Assistance': t('housingAssistance'),
      'Mental Health': t('mentalHealth'),
      'Women\'s Shelter': t('womensShelter'),
      'Permanent Housing': t('permanentHousing'),
      'Family Shelter': t('familyShelter'),
      'Youth Shelter': t('youthShelter'),
      'Education Support': t('educationSupport'),
    };
    return serviceMap[serviceName] || serviceName;
  };

  const translateShelterDescription = (shelterName) => {
    const descriptionMap = {
      'Union Rescue Mission': t('unionRescueMissionDescription'),
      'Los Angeles Mission': t('laMissionDescription'),
      'Downtown Women\'s Center': t('downtownWomensCenterDescription'),
      'Covenant House California': t('covenantHouseDescription'),
      'Skid Row Housing Trust': t('skidRowHousingTrustDescription'),
      'Midnight Mission': t('midnightMissionDescription'),
      'Haven House': t('havenHouseDescription'),
      'Los Angeles LGBT Center': t('laLgbtCenterDescription'),
    };
    return descriptionMap[shelterName] || shelterName;
  };

  const filteredShelters = shelters.filter(shelter => {
    const matchesSearch = shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shelter.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shelter.address.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !location || shelter.address.city.toLowerCase().includes(location.toLowerCase());
    const matchesAvailability = !availableOnly || (shelter.capacity?.availableBeds > 0);
    
    return matchesSearch && matchesLocation && matchesAvailability;
  });

  const sortedShelters = [...filteredShelters].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating?.average || 0) - (a.rating?.average || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'availability':
        return (b.capacity?.availableBeds || 0) - (a.capacity?.availableBeds || 0);
      case 'closest':
        if (!userLocation || !a.coordinates || !b.coordinates) {
          return 0; // If no location data, maintain original order
        }
        const distanceA = calculateDistance(
          userLocation.lat, 
          userLocation.lng, 
          a.coordinates.lat, 
          a.coordinates.lng
        );
        const distanceB = calculateDistance(
          userLocation.lat, 
          userLocation.lng, 
          b.coordinates.lat, 
          b.coordinates.lng
        );
        return distanceA - distanceB;
      default:
        return 0;
    }
  });

  // Show all shelters on one page (no pagination)
  const paginatedShelters = sortedShelters;

  const handleGetDirections = (shelter) => {
    const address = `${shelter.address.street}, ${shelter.address.city}, ${shelter.address.state} ${shelter.address.zipCode}`;
    const encodedAddress = encodeURIComponent(address);
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      window.open(`maps://maps.google.com/maps?daddr=${encodedAddress}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
    }
  };

  const handleCallShelter = (shelter) => {
    const phoneNumber = shelter.contact.phone.replace(/\D/g, '');
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleEmailShelter = (shelter) => {
    window.open(`mailto:${shelter.contact.email}`, '_blank');
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
              Loading shelters...
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
            onClick={() => navigate('/')} 
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
            Back to Home
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
        {/* Header */}
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/')}
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
                Back to Home
              </Button>
              
              {/* Language Toggle */}
              <LanguageToggle />
            </Box>

            {/* Page Title */}
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3
              }}
            >
                {t('findShelters')}
            </Typography>

            {/* Search and Filters */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder={t('searchShelters')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: '#667eea' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  placeholder={t('city')}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn sx={{ color: '#667eea' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>{t('sortBy')}</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    sx={{
                      borderRadius: 3,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                      },
                    }}
                  >
                    <MenuItem value="rating">{t('rating')}</MenuItem>
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="availability">Availability</MenuItem>
                    <MenuItem value="closest">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn sx={{ fontSize: 16 }} />
                        Closest to Me
                        {isGettingLocation && <CircularProgress size={16} />}
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* Map view removed - using list view only */}
            </Grid>

            {/* Results Summary */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary' }}>
{t('sheltersFound').replace('{{count}}', filteredShelters.length)}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  label={t('availableBeds')}
                  color="success"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  label={t('atCapacity')}
                  color="error"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Box>

            {/* Location Status */}
            {sortBy === 'closest' && (
              <Box sx={{ mb: 3 }}>
                {locationError && (
                  <Alert 
                    severity="warning" 
                    sx={{ 
                      mb: 2,
                      borderRadius: 3,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    action={
                      <Button 
                        color="inherit" 
                        size="small" 
                        onClick={getUserLocation}
                        disabled={isGettingLocation}
                      >
                        {isGettingLocation ? 'Getting...' : 'Retry'}
                      </Button>
                    }
                  >
                    {locationError}
                  </Alert>
                )}
                
                {userLocation && (
                  <Alert 
                    severity="success" 
                    sx={{ 
                      borderRadius: 3,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn sx={{ fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Location found! Showing shelters closest to you.
                      </Typography>
                    </Box>
                  </Alert>
                )}
                
                {!userLocation && !locationError && !isGettingLocation && (
                  <Alert 
                    severity="info" 
                    sx={{ 
                      borderRadius: 3,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    action={
                      <Button 
                        color="inherit" 
                        size="small" 
                        onClick={getUserLocation}
                        startIcon={<LocationOn />}
                      >
                        Get My Location
                      </Button>
                    }
                  >
                    <Typography variant="body2">
                      Enable location access to see shelters closest to you.
                    </Typography>
                  </Alert>
                )}
              </Box>
            )}
          </Paper>
        </Fade>

        {/* Map view removed - using list view only */}

        {/* Shelter List */}
        <Grid container spacing={3}>
            {paginatedShelters.map((shelter, index) => (
              <Grid item xs={12} md={6} key={shelter._id}>
                <Slide in timeout={1000 + index * 200} direction="up">
                  <Paper
                    elevation={8}
                    sx={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 4,
                      overflow: 'hidden',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 32px 64px rgba(0,0,0,0.15)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                  <CardContent sx={{ p: 3 }}>
                    {/* Shelter Header */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar
                        sx={{ 
                          width: 60, 
                          height: 60, 
                          mr: 2,
                          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                        }}
                        src={shelter.images?.[0]?.url}
                      >
                        <Business sx={{ fontSize: 30 }} />
                      </Avatar>
                      
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700,
                            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1
                          }}
                        >
                          {shelter.name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOn sx={{ color: '#667eea', mr: 1, fontSize: 20 }} />
                          <Typography variant="body2" color="text.secondary">
                            {shelter.address.street}, {shelter.address.city}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Rating
                            value={shelter.rating?.average || 0}
                            precision={0.1}
                            readOnly
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {shelter.rating?.average || 0} ({shelter.rating?.count || 0} {t('reviews')})
                          </Typography>
                        </Box>

                        {/* Distance Display */}
                        {sortBy === 'closest' && userLocation && shelter.coordinates && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOn sx={{ color: '#4CAF50', mr: 1, fontSize: 16 }} />
                            <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 600 }}>
                              {calculateDistance(
                                userLocation.lat, 
                                userLocation.lng, 
                                shelter.coordinates.lat, 
                                shelter.coordinates.lng
                              ).toFixed(1)} miles away
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      <Chip
                        label={`${shelter.capacity?.availableBeds || 0} ${t('beds')}`}
                        color={shelter.capacity?.availableBeds > 0 ? 'success' : 'error'}
                        sx={{ 
                          fontWeight: 600,
                          px: 2,
                          py: 1,
                          borderRadius: 3,
                        }}
                      />
                    </Box>

                    {/* Description */}
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.5,
                      }}
                    >
                      {translateShelterDescription(shelter.name)}
                    </Typography>

                    {/* Services */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                        Services:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {shelter.services.slice(0, 4).map((service, serviceIndex) => (
                          <Chip
                            key={serviceIndex}
                            icon={getServiceIcon(service.name)}
                            label={translateServiceName(service.name)}
                            size="small"
                            color={getServiceColor(service.name)}
                            variant="outlined"
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              borderRadius: 2,
                            }}
                          />
                        ))}
                        {shelter.services.length > 4 && (
                          <Chip
                            label={`+${shelter.services.length - 4} more`}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              borderRadius: 2,
                            }}
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<LocationOn />}
                        onClick={() => handleGetDirections(shelter)}
                        sx={{
                          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                          borderRadius: 3,
                          px: 2,
                          py: 0.5,
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {t('directions')}
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Phone />}
                        onClick={() => handleCallShelter(shelter)}
                        sx={{
                          background: 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)',
                          borderRadius: 3,
                          px: 2,
                          py: 0.5,
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {t('call')}
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Email />}
                        onClick={() => handleEmailShelter(shelter)}
                        sx={{
                          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                          borderRadius: 3,
                          px: 2,
                          py: 0.5,
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {t('email')}
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/shelters/${shelter._id}`)}
                        sx={{
                          borderColor: '#667eea',
                          color: '#667eea',
                          borderRadius: 3,
                          px: 2,
                          py: 0.5,
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          '&:hover': {
                            borderColor: '#764ba2',
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {t('viewDetails')}
                      </Button>
                    </Box>
                  </CardContent>
                </Paper>
              </Slide>
            </Grid>
          ))}
          </Grid>

      </Container>
    </Box>
  );
};

export default SheltersPage;