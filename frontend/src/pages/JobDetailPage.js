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
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Container,
  Fade,
  Zoom,
  Slide,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Work,
  Business,
  LocationOn,
  AttachMoney,
  Schedule,
  Security,
  Send,
  Share,
  Bookmark,
  ArrowBack,
  AccessTime,
  School,
  Star,
  Home,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { mockJobService } from '../api/mockData';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [applicationNotes, setApplicationNotes] = useState('');

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const jobData = await mockJobService.getJob(id);
      if (jobData) {
        setJob(jobData);
      } else {
        setError('Failed to load job details. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      setError('Failed to load job details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setApplyDialogOpen(true);
  };

  const submitApplication = async () => {
    try {
      // Mock application submission
      console.log('Submitting application for job:', id, 'with notes:', applicationNotes);
      
      setApplyDialogOpen(false);
      setApplicationNotes('');
      // Show success message or redirect
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  const formatSalary = (compensation) => {
    if (compensation.type === 'volunteer') return 'Volunteer Position';
    if (compensation.type === 'contract') return 'Contract Position';
    if (compensation.min && compensation.max) {
      return `$${compensation.min} - $${compensation.max}`;
    }
    if (compensation.min) return `$${compensation.min}+`;
    return 'Salary negotiable';
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Fade in={true}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress sx={{ color: 'white', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'white' }}>
              {t('loading')}...
            </Typography>
          </Box>
        </Fade>
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Fade in={true}>
            <Alert severity="error" sx={{ borderRadius: 3, boxShadow: 3 }}>
              {error}
            </Alert>
          </Fade>
        </Container>
      </Box>
    );
  }

  if (!job) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Fade in={true}>
            <Alert severity="warning" sx={{ borderRadius: 3, boxShadow: 3 }}>
              Job not found
            </Alert>
          </Fade>
        </Container>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Fade in={true}>
          <Card 
            sx={{ 
              mb: 4, 
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                {/* Left side - Navigation buttons */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<Home />}
                    onClick={() => navigate('/')}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                    }}
                  >
                    {t('home')}
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/jobs')}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                    }}
                  >
                    {t('backToJobs')}
                  </Button>
                </Box>

                {/* Center - Job title and company */}
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
                  <Avatar
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      mr: 3, 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                    }}
                  >
                    <Work sx={{ fontSize: 40, color: 'white' }} />
                  </Avatar>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1, color: '#2c3e50' }}>
                      {job.title}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                      {job.company.name}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Right side - Language Toggle */}
                <LanguageToggle />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button 
                  variant="outlined" 
                  startIcon={<Share />}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                  }}
                >
                  {t('share')}
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<Bookmark />}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                  }}
                >
                  {t('bookmark')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Fade>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Job Description */}
          <Slide direction="up" in={true} timeout={800}>
            <Card 
              sx={{ 
                mb: 3, 
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50', mb: 3 }}>
                  {t('jobDescription')}
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: '#34495e' }}>
                  {job.description}
                </Typography>
              </CardContent>
            </Card>
          </Slide>

          {/* Requirements */}
          <Slide direction="up" in={true} timeout={1000}>
            <Card 
              sx={{ 
                mb: 3, 
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50', mb: 3 }}>
                  {t('requirements')}
                </Typography>
              
              {job.requirements.experience && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#34495e' }}>
                    {t('experience')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 1 }}>
                    {t('entryLevel')} level
                    {job.requirements.experience.years && ` (${job.requirements.experience.years} years)`}
                  </Typography>
                  {job.requirements.experience.description && (
                    <Typography variant="body2" sx={{ mt: 1, color: '#34495e' }}>
                      {t('noPriorExperience')}
                    </Typography>
                  )}
                </Box>
              )}

              {job.requirements.education && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#34495e' }}>
                    {t('education')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                    {t('highSchoolRequired')}
                  </Typography>
                </Box>
              )}

              {job.requirements.skills && job.requirements.skills.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#34495e' }}>
                    {t('skills')}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {job.requirements.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={t(skill.toLowerCase().replace(/\s+/g, ''))}
                        sx={{
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          fontWeight: 500,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {job.requirements.certifications && job.requirements.certifications.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                    Certifications
                  </Typography>
                  <List dense>
                    {job.requirements.certifications.map((cert, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Security sx={{ fontSize: 20, color: 'text.secondary' }} />
                        </ListItemIcon>
                        <ListItemText primary={cert} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Slide>

          {/* Application Process */}
          <Slide direction="up" in={true} timeout={1200}>
            <Card 
              sx={{ 
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50', mb: 3 }}>
                  {t('howToApply')}
                </Typography>
                <Typography variant="body1" sx={{ color: '#34495e', mb: 3, lineHeight: 1.8 }}>
                  {t('visitShelter')}
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#34495e', mb: 2 }}>
                  {t('requiredDocuments')}
                </Typography>
                <List>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <School sx={{ color: '#667eea' }} />
                    </ListItemIcon>
                    <ListItemText primary={t('resume')} />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Star sx={{ color: '#667eea' }} />
                    </ListItemIcon>
                    <ListItemText primary={t('twoReferences')} />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Security sx={{ color: '#667eea' }} />
                    </ListItemIcon>
                    <ListItemText primary={t('validId')} />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Security sx={{ color: '#667eea' }} />
                    </ListItemIcon>
                    <ListItemText primary={t('socialSecurityCard')} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Slide>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Job Details */}
          <Zoom in={true} timeout={1000}>
            <Card 
              sx={{ 
                mb: 3, 
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50', mb: 3 }}>
                  {t('jobDetails')}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <AttachMoney sx={{ color: '#667eea', mr: 2, fontSize: 24 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#34495e' }}>
                    {formatSalary(job.compensation)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Schedule sx={{ color: '#667eea', mr: 2, fontSize: 24 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#34495e' }}>
                    {job.employment.type.replace('-', ' ')}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <LocationOn sx={{ color: '#667eea', mr: 2, fontSize: 24 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#34495e' }}>
                    {job.location.address.city}, {job.location.address.state}
                    {job.location.isRemote && ' (Remote)'}
                  </Typography>
                </Box>

              {job.employment.schedule && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <AccessTime sx={{ color: '#667eea', mr: 2, fontSize: 24 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#34495e' }}>
                    {job.employment.schedule}
                  </Typography>
                </Box>
              )}

              {job.employment.startDate && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Schedule sx={{ color: '#667eea', mr: 2, fontSize: 24 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#34495e' }}>
                    Start Date: {new Date(job.employment.startDate).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Zoom>

          {/* Company Info */}
          <Zoom in={true} timeout={1200}>
            <Card 
              sx={{ 
                mb: 3, 
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50', mb: 3 }}>
                  {t('aboutCompany')} {job.company.name}
                </Typography>
                {job.company.description && (
                  <Typography variant="body1" sx={{ color: '#34495e', mb: 3, lineHeight: 1.8 }}>
                    {job.company.description}
                  </Typography>
                )}
                {job.company.website && (
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => window.open(job.company.website, '_blank')}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      },
                    }}
                  >
                    {t('visitWebsite')}
                  </Button>
                )}
              </CardContent>
            </Card>
          </Zoom>

          {/* Apply Section */}
          <Zoom in={true} timeout={1400}>
            <Card 
              sx={{ 
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50', mb: 3 }}>
                  {t('readyToApply')}
                </Typography>
                <Typography variant="body1" sx={{ color: '#34495e', mb: 3, lineHeight: 1.8 }}>
                  {t('applyForJob')}
                </Typography>
                
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<Send />}
                  onClick={handleApply}
                  disabled={job.status !== 'active'}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 2,
                    fontSize: '1.1rem',
                    background: job.status === 'active' 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : '#bdc3c7',
                    '&:hover': {
                      background: job.status === 'active' 
                        ? 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                        : '#bdc3c7',
                    },
                  }}
                >
                  {job.status === 'active' ? t('applyNow') : 'Position Closed'}
                </Button>

                {job.application.deadline && (
                  <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: '#7f8c8d' }}>
                    {t('applicationDeadline')}: {new Date(job.application.deadline).toLocaleDateString()}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
      </Grid>
      {/* Apply Dialog */}
      <Dialog open={applyDialogOpen} onClose={() => setApplyDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('applyForJob')} {job.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Submit your application for this position at {job.company.name}.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Additional Notes (Optional)"
            placeholder="Tell us why you're interested in this position..."
            value={applicationNotes}
            onChange={(e) => setApplicationNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplyDialogOpen(false)}>{t('cancel')}</Button>
          <Button variant="contained" onClick={submitApplication}>
            {t('submitApplication')}
          </Button>
        </DialogActions>
      </Dialog>
      </Container>
    </Box>
  );
};

export default JobDetailPage;
