import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Zoom,
  Chip,
  Avatar,
  Stack,
  Divider,
} from '@mui/material';
import {
  Home,
  Business,
  Work,
  Message,
  LocationOn,
  People,
  Login,
  PersonAdd,
  Accessibility,
  Analytics,
  SmartToy,
  Phone,
  Email,
  AccessTime,
  Star,
  TrendingUp,
  Support,
  CrisisAlert,
  VolunteerActivism,
  ArrowForward,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import SuccessStories from '../components/SuccessStories';
import ImpactMetrics from '../components/ImpactMetrics';
import LanguageToggle from '../components/LanguageToggle';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <SmartToy sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: t('aiPoweredMatching'),
      description: t('aiPoweredMatchingDescription'),
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      icon: <Work sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: t('careerDevelopment'),
      description: t('careerDevelopmentDescription'),
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      icon: <Message sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: t('crisisSupport'),
      description: t('crisisSupportDescription'),
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      icon: <LocationOn sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: t('realTimeAvailability'),
      description: t('realTimeAvailabilityDescription'),
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
    {
      icon: <People sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: t('communitySupport'),
      description: t('communitySupportDescription'),
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: t('progressTracking'),
      description: t('progressTrackingDescription'),
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    },
  ];

  const stats = [
    { number: '47', label: t('livesImpacted'), icon: <People /> },
    { number: '3', label: t('partnerShelters'), icon: <Business /> },
    { number: '75%', label: t('successRate'), icon: <TrendingUp /> },
    { number: '24/7', label: t('supportAvailable'), icon: <Support /> },
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: t('potentialUser'),
      content: t('testimonial1'),
      rating: 5,
    },
    {
      name: 'Hope Center',
      role: t('potentialPartner'),
      content: t('testimonial2'),
      rating: 5,
    },
    {
      name: 'Michael R.',
      role: t('communityMember'),
      content: t('testimonial3'),
      rating: 5,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
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
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  background: 'linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {t('app.title')}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 300,
                  mb: 4,
                  opacity: 0.9,
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                }}
              >
                {t('app.tagline')}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  opacity: 0.8,
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                {t('app.description')}
              </Typography>
              
              {/* Language Toggle */}
              <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                <LanguageToggle />
              </Box>
              
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/shelters')}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    '&:hover': {
                      bgcolor: 'grey.100',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  startIcon={<LocationOn />}
                >
                  {t('findShelters')}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/jobs')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  startIcon={<Work />}
                >
                  {t('findJobs')}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/ai-matching')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  startIcon={<SmartToy />}
                >
                  {t('aiMatching')}
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/shelter-staff-login')}
                  sx={{
                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  startIcon={<Business />}
                >
                  {t('shelterStaffLogin')}
                </Button>
              </Stack>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Slide direction="up" in timeout={1200}>
            <Grid container spacing={4}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Card
                    sx={{
                      textAlign: 'center',
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
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 60,
                        height: 60,
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                      {stat.number}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {stat.label}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Slide>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 12 }}>
        <Container maxWidth="lg">
          <Fade in timeout={1400}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: 'text.primary',
                }}
              >
                {t('whyChooseShelterMatch')}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                {t('platformDescription')}
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Zoom in timeout={1600 + index * 200}>
                  <Card
                    sx={{
                      height: '100%',
                      p: 4,
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: feature.color,
                      },
                    }}
                  >
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        textAlign: 'center',
                        color: 'text.primary',
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.6,
                        textAlign: 'center',
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Success Stories Section */}
      <Box sx={{ py: 12, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <SuccessStories />
        </Container>
      </Box>

      {/* Impact Metrics Section */}
      <Box sx={{ py: 12 }}>
        <Container maxWidth="lg">
          <ImpactMetrics />
        </Container>
      </Box>


      {/* CTA Section */}
      <Box
        sx={{
          py: 12,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Fade in timeout={2200}>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                }}
              >
                {t('readyToMakeDifference')}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 6,
                  opacity: 0.9,
                  lineHeight: 1.6,
                }}
              >
                {t('heroDescription')}
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                justifyContent="center"
                alignItems="center"
              >
                {!isAuthenticated ? (
                  <>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/register')}
                      sx={{
                        bgcolor: 'white',
                        color: 'primary.main',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                        '&:hover': {
                          bgcolor: 'grey.100',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                      startIcon={<PersonAdd />}
                    >
                      {t('getStarted')}
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/login')}
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: 3,
                        borderWidth: 2,
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.1)',
                        },
                      }}
                      startIcon={<Login />}
                    >
                      {t('signIn')}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/dashboard')}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                      '&:hover': {
                        bgcolor: 'grey.100',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                    startIcon={<Home />}
                  >
                    Go to Dashboard
                  </Button>
                )}
              </Stack>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, bgcolor: 'grey.900', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Shelter Link
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
                {t('footerDescription')}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Chip
                  icon={<Phone />}
                  label={t('crisisHotline')}
                  sx={{ bgcolor: 'primary.main', color: 'white' }}
                />
                <Chip
                  icon={<Email />}
                  label={t('supportEmail')}
                  sx={{ bgcolor: 'primary.main', color: 'white' }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                {t('quickLinks')}
              </Typography>
              <Stack spacing={1}>
                <Button
                  color="inherit"
                  onClick={() => navigate('/shelters')}
                  sx={{ justifyContent: 'flex-start', p: 0 }}
                >
                  {t('findShelters')}
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate('/jobs')}
                  sx={{ justifyContent: 'flex-start', p: 0 }}
                >
                  {t('findJobs')}
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate('/impact')}
                  sx={{ justifyContent: 'flex-start', p: 0 }}
                >
                  {t('ourImpact')}
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate('/mobile')}
                  sx={{ justifyContent: 'flex-start', p: 0 }}
                >
                  {t('mobileFeatures')}
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate('/performance')}
                  sx={{ justifyContent: 'flex-start', p: 0 }}
                >
                  {t('performance')}
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                {t('support')}
              </Typography>
              <Stack spacing={1}>
                <Button
                  color="inherit"
                  onClick={() => navigate('/login')}
                  sx={{ justifyContent: 'flex-start', p: 0 }}
                >
                  {t('signIn')}
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate('/register')}
                  sx={{ justifyContent: 'flex-start', p: 0 }}
                >
                  {t('createAccount')}
                </Button>
                <Button
                  color="inherit"
                  startIcon={<CrisisAlert />}
                  sx={{ justifyContent: 'flex-start', p: 0 }}
                >
                  {t('emergencyResources')}
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, bgcolor: 'grey.700' }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              {t('copyright')}
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;