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
  Work,
  LocationOn,
  Business,
  AttachMoney,
  Schedule,
  ArrowBack,
  Home,
  Star,
  TrendingUp,
  People,
  AccessTime,
  School,
  Security,
  Speed,
} from '@mui/icons-material';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { mockJobService } from '../api/mockData';
import LanguageToggle from '../components/LanguageToggle';

const JobsPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/jobs?limit=50');
      const fetched = response.data.jobs;
      if (fetched && fetched.length > 0) {
        setJobs(fetched);
      } else {
        // API returned empty — fall back to mock data
        const mock = await mockJobService.getJobs();
        setJobs(mock.jobs || []);
      }
    } catch {
      // API unreachable — fall back to mock data
      try {
        const mock = await mockJobService.getJobs();
        setJobs(mock.jobs || []);
      } catch (err) {
        setError('Failed to load jobs');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const getJobTypeIcon = (type) => {
    const iconMap = {
      'Full-time': <Work />,
      'Part-time': <Schedule />,
      'Contract': <Business />,
      'Internship': <School />,
      'Volunteer': <People />,
    };
    return iconMap[type] || <Work />;
  };

  const getJobTypeColor = (type) => {
    const colorMap = {
      'Full-time': 'success',
      'Part-time': 'info',
      'Contract': 'warning',
      'Internship': 'secondary',
      'Volunteer': 'primary',
    };
    return colorMap[type] || 'default';
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !location || job.location.address.city.toLowerCase().includes(location.toLowerCase());
    const matchesType = !jobType || job.type === jobType;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'title':
        return a.title.localeCompare(b.title);
      case 'salary':
        return (b.salary?.min || 0) - (a.salary?.min || 0);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = sortedJobs.slice(startIndex, startIndex + itemsPerPage);

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
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                
                {/* Language Toggle */}
                <LanguageToggle />
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                {t('findJobs')}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  opacity: 0.9,
                  mb: 4,
                  maxWidth: '600px',
                }}
              >
                {t('jobOpportunitiesDescription')}
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
                    placeholder="Search jobs..."
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
                
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn />
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
                
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Job Type</InputLabel>
                    <Select
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                      label="Job Type"
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">All Types</MenuItem>
                      <MenuItem value="Full-time">Full-time</MenuItem>
                      <MenuItem value="Part-time">Part-time</MenuItem>
                      <MenuItem value="Contract">Contract</MenuItem>
                      <MenuItem value="Internship">Internship</MenuItem>
                      <MenuItem value="Volunteer">Volunteer</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>{t('sortBy')}</InputLabel>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      label={t('sortBy')}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="date">{t('datePosted')}</MenuItem>
                      <MenuItem value="title">Job Title</MenuItem>
                      <MenuItem value="salary">Salary</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Fade>

        {/* Results Count */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {filteredJobs.length} Jobs Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('showingResults')} {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredJobs.length)} {t('ofResults')} {filteredJobs.length} {t('results')}
          </Typography>
        </Box>

        {/* Jobs Grid */}
        <Grid container spacing={4}>
          {paginatedJobs.map((job, index) => (
            <Grid item xs={12} md={6} lg={4} key={job._id}>
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
                  onClick={() => navigate(`/jobs/${job._id}`)}
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
                          {job.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            mb: 1,
                          }}
                        >
                          {job.company.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {job.location.address.city}, {job.location.address.state}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        icon={getJobTypeIcon(job.type)}
                        label={job.type}
                        color={getJobTypeColor(job.type)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
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
                      {job.description}
                    </Typography>

                    {/* Salary */}
                    {job.salary && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <AttachMoney sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                        <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                          {job.salary.min && job.salary.max 
                            ? `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}`
                            : job.salary.min 
                            ? `$${job.salary.min.toLocaleString()}+`
                            : 'Salary not specified'
                          }
                        </Typography>
                      </Box>
                    )}

                    {/* Requirements */}
                    {job.requirements && job.requirements.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Requirements:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {job.requirements.slice(0, 3).map((req, reqIndex) => (
                            <Chip
                              key={`${job._id}-req-${reqIndex}`}
                              label={req}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          ))}
                          {job.requirements.length > 3 && (
                            <Chip
                              label={`+${job.requirements.length - 3} more`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                    )}

                    {/* Posted Date */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccessTime sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {t('posted')} {new Date(job.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/jobs/${job._id}`);
                      }}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        fontWeight: 600,
                      }}
                    >
                      {t('viewDetails')}
                    </Button>
                  </CardActions>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>

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

export default JobsPage;