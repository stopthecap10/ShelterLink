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
  Pets,
  FamilyRestroom,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { mockShelterService } from '../api/mockData';
import ShelterMap from '../components/ShelterMap';
import SimpleMap from '../components/SimpleMap';

const SheltersPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

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

  useEffect(() => {
    fetchShelters();
  }, []);

  const getServiceIcon = (service) => {
    const iconMap = {
      'WiFi': <Wifi />,
      'Parking': <LocalParking />,
      'Meals': <Restaurant />,
      'Medical': <MedicalServices />,
      'Security': <Security />,
      'Pets': <Pets />,
      'Family': <FamilyRestroom />,
    };
    return iconMap[service] || <Business />;
  };

  const getServiceColor = (service) => {
    const colorMap = {
      'WiFi': 'primary',
      'Parking': 'secondary',
      'Meals': 'success',
      'Medical': 'error',
      'Security': 'warning',
      'Pets': 'info',
      'Family': 'default',
    };
    return colorMap[service] || 'default';
  };

  const filteredShelters = shelters.filter(shelter => {
    const matchesSearch = shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shelter.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !city || shelter.address.city.toLowerCase().includes(city.toLowerCase());
    const matchesState = !state || shelter.address.state.toLowerCase().includes(state.toLowerCase());
    const matchesAvailability = !availableOnly || shelter.capacity.availableBeds > 0;
    
    return matchesSearch && matchesCity && matchesState && matchesAvailability;
  });

  const sortedShelters = [...filteredShelters].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'availability':
        return b.capacity.availableBeds - a.capacity.availableBeds;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedShelters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedShelters = sortedShelters.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            zIndex: 1,
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Fade in timeout={800}>
            <Box>
              {/* Navigation */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Button
                  startIcon={<ArrowBack />}
                  onClick={() => navigate('/')}
                  sx={{ 
                    mr: 2, 
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                  variant="outlined"
                >
                  Back to Home
                </Button>
                <Button
                  startIcon={<Home />}
                  onClick={() => navigate('/')}
                  sx={{ 
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                  variant="outlined"
                >
                  Home
                </Button>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                {t('shelters')}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  opacity: 0.9,
                  mb: 4,
                  maxWidth: '600px',
                }}
              >
                Discover safe havens and support services in your area. 
                Real-time availability, comprehensive services, and compassionate care.
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Search and Filters */}
        <Fade in timeout={1000}>
          <Card
            sx={{
              mb: 6,
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.05)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder={t('searchShelters')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    fullWidth
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    fullWidth
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Sort by</InputLabel>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      label="Sort by"
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="rating">Rating</MenuItem>
                      <MenuItem value="name">Name</MenuItem>
                      <MenuItem value="availability">Availability</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                      variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                      onClick={() => setViewMode('grid')}
                      startIcon={<Business />}
                      sx={{ borderRadius: 2 }}
                    >
                      Grid
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'contained' : 'outlined'}
                      onClick={() => setViewMode('list')}
                      startIcon={<List />}
                      sx={{ borderRadius: 2 }}
                    >
                      List
                    </Button>
                    <Button
                      variant={viewMode === 'map' ? 'contained' : 'outlined'}
                      onClick={() => setViewMode('map')}
                      startIcon={<Map />}
                      sx={{ borderRadius: 2 }}
                    >
                      Map
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Fade>

        {/* Results Count */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {filteredShelters.length} Shelters Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredShelters.length)} of {filteredShelters.length} results
          </Typography>
        </Box>

        {/* Map View */}
        {viewMode === 'map' && (
          <Slide direction="up" in timeout={1200}>
            <Card
              sx={{
                mb: 4,
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              }}
            >
              <Box sx={{ height: 500 }}>
                <SimpleMap shelters={paginatedShelters} />
              </Box>
            </Card>
          </Slide>
        )}

        {/* Shelters Grid/List */}
        {viewMode !== 'map' && (
          <Grid container spacing={4}>
            {paginatedShelters.map((shelter, index) => (
              <Grid item xs={12} md={viewMode === 'list' ? 12 : 6} lg={viewMode === 'list' ? 12 : 4} key={shelter._id}>
                <Zoom in timeout={1200 + index * 100}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                      },
                    }}
                    onClick={() => navigate(`/shelters/${shelter._id}`)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Header */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: 'primary.main',
                            width: 50,
                            height: 50,
                            mr: 2,
                          }}
                        >
                          <Business />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              mb: 0.5,
                              color: 'text.primary',
                            }}
                          >
                            {shelter.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating
                              value={shelter.rating?.average || 0}
                              readOnly
                              size="small"
                              sx={{ mr: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {shelter.rating?.average || 0} ({shelter.rating?.count || 0} reviews)
                            </Typography>
                          </Box>
                        </Box>
                        {shelter.capacity.availableBeds > 0 && (
                          <Chip
                            label={`${shelter.capacity.availableBeds} beds available`}
                            color="success"
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        )}
                      </Box>

                      {/* Description */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          mb: 3,
                          lineHeight: 1.6,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {shelter.description}
                      </Typography>

                      {/* Location */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {shelter.address.city}, {shelter.address.state}
                        </Typography>
                      </Box>

                      {/* Services */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Services Available:
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
                            />
                          ))}
                          {shelter.services.length > 4 && (
                            <Chip
                              label={`+${shelter.services.length - 4} more`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>

                      {/* Contact Info */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        {shelter.contact.phone && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Phone sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                              {shelter.contact.phone}
                            </Typography>
                          </Box>
                        )}
                        {shelter.contact.email && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Email sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                              {shelter.contact.email}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </CardContent>

                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/shelters/${shelter._id}`);
                        }}
                        sx={{
                          borderRadius: 2,
                          py: 1.5,
                          fontWeight: 600,
                        }}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SheltersPage;