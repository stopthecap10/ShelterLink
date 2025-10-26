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
import { mockShelterService } from '../api/mockData';
import ShelterMap from '../components/ShelterMap';

const SheltersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('list');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    fetchShelters();
  }, []);

  const fetchShelters = async () => {
    try {
      setLoading(true);
      const response = await mockShelterService.getShelters();
      setShelters(response.shelters || []);
    } catch (err) {
      setError('Failed to load shelters');
      console.error('Error fetching shelters:', err);
    } finally {
      setLoading(false);
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
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedShelters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedShelters = sortedShelters.slice(startIndex, startIndex + itemsPerPage);

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
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
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
              {t('shelters')}
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
                  placeholder="City"
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
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
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
                    <MenuItem value="rating">Rating</MenuItem>
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="availability">Availability</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant={viewMode === 'list' ? 'contained' : 'outlined'}
                    onClick={() => setViewMode('list')}
                    startIcon={<ViewList />}
                    sx={{
                      borderRadius: 3,
                      px: 2,
                      py: 1,
                      fontWeight: 700,
                      ...(viewMode === 'list' ? {
                        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                        },
                      } : {
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': {
                          borderColor: '#764ba2',
                          backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        },
                      }),
                      transition: 'all 0.3s ease',
                    }}
                  >
                    List
                  </Button>
                  <Button
                    variant={viewMode === 'map' ? 'contained' : 'outlined'}
                    onClick={() => setViewMode('map')}
                    startIcon={<MapIcon />}
                    sx={{
                      borderRadius: 3,
                      px: 2,
                      py: 1,
                      fontWeight: 700,
                      ...(viewMode === 'map' ? {
                        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                        },
                      } : {
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': {
                          borderColor: '#764ba2',
                          backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        },
                      }),
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Map
                  </Button>
                </Stack>
              </Grid>
            </Grid>

            {/* Results Summary */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                {filteredShelters.length} Shelters Found
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  label="Available Beds"
                  color="success"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  label="At Capacity"
                  color="error"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Box>
          </Paper>
        </Fade>

        {/* Map View */}
        {viewMode === 'map' && (
          <Slide in timeout={1000} direction="up">
            <Paper
              elevation={8}
              sx={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                p: 3,
                mb: 3,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                minHeight: '500px',
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3
                }}
              >
                Interactive Map View
              </Typography>
              
              {/* Real Interactive Map */}
              <ShelterMap 
                shelters={paginatedShelters}
                onShelterClick={(shelter) => navigate(`/shelters/${shelter._id}`)}
              />

              {/* Map Instructions */}
              <Box sx={{ mt: 3, p: 2, background: 'rgba(102, 126, 234, 0.1)', borderRadius: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Map Features:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Green markers indicate shelters with available beds
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Red markers indicate shelters at capacity
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Click on any marker to view shelter details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Use the list view to see detailed information
                </Typography>
              </Box>
            </Paper>
          </Slide>
        )}

        {/* List View */}
        {viewMode === 'list' && (
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
                            {shelter.rating?.average || 0} ({shelter.rating?.count || 0} reviews)
                          </Typography>
                        </Box>
                      </Box>

                      <Chip
                        label={`${shelter.capacity?.availableBeds || 0} beds`}
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
                      {shelter.description}
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
                            label={service.name}
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
                        Directions
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
                        Call
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
                        Email
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
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Paper>
              </Slide>
            </Grid>
          ))}
          </Grid>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Fade in timeout={2000}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 3,
                    fontWeight: 600,
                    '&.Mui-selected': {
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      color: 'white',
                    },
                  },
                }}
              />
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default SheltersPage;