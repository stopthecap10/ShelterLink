import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Avatar,
  LinearProgress,
  Fade,
  Zoom,
  useTheme,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  Speed,
  Visibility,
  TouchApp,
  Mic,
  KeyboardVoice,
  AutoAwesome,
  TrendingUp,
  CheckCircle,
} from '@mui/icons-material';

const DemoFeatures = () => {
  const theme = useTheme();
  const [currentDemo, setCurrentDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);

  const demoSteps = [
    {
      id: 1,
      title: 'AI-Powered Matching',
      description: 'Watch our AI analyze user needs and match them with the perfect shelter',
      icon: <AutoAwesome />,
      color: 'primary',
      features: [
        'Real-time needs assessment',
        'Machine learning algorithms',
        'Personalized recommendations',
        'Success rate optimization',
      ],
      demoData: {
        userProfile: 'Single mother, 2 children, needs childcare',
        matchScore: 94,
        recommendedShelter: 'Union Rescue Mission',
        reasoning: 'Family-friendly, childcare services, job training',
      },
    },
    {
      id: 2,
      title: 'Interactive Map Integration',
      description: 'See how users can explore shelters with real-time availability',
      icon: <Visibility />,
      color: 'info',
      features: [
        'Real-time bed availability',
        'Interactive location search',
        'Transportation options',
        'Nearby services',
      ],
      demoData: {
        totalShelters: 12,
        availableBeds: 8,
        nearestShelter: '0.3 miles away',
        waitTime: '2 hours',
      },
    },
    {
      id: 3,
      title: 'Job Placement Integration',
      description: 'Demonstrate how we connect people with employment opportunities',
      icon: <TrendingUp />,
      color: 'success',
      features: [
        'Skill-based matching',
        'Training programs',
        'Employer partnerships',
        'Career advancement',
      ],
      demoData: {
        availableJobs: 23,
        trainingPrograms: 8,
        successRate: 89,
        averageWage: '$18.50/hour',
      },
    },
    {
      id: 4,
      title: 'Accessibility Features',
      description: 'Showcase inclusive design and multilingual support',
      icon: <TouchApp />,
      color: 'secondary',
      features: [
        'Voice navigation',
        'Screen reader support',
        'Multiple languages',
        'High contrast mode',
      ],
      demoData: {
        languages: ['English', 'Spanish', 'Chinese'],
        accessibilityScore: 98,
        voiceCommands: 15,
        supportedDevices: 'All',
      },
    },
  ];

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setDemoProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentDemo((prev) => (prev + 1) % demoSteps.length);
    setDemoProgress(0);
  };

  const handlePrevious = () => {
    setCurrentDemo((prev) => (prev - 1 + demoSteps.length) % demoSteps.length);
    setDemoProgress(0);
  };

  const currentStep = demoSteps[currentDemo];

  return (
    <Box>
      {/* Demo Header */}
      <Fade in timeout={800}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Interactive Demo
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
            Experience Shelter Match in action. Watch our AI-powered platform 
            transform how communities address homelessness.
          </Typography>
        </Box>
      </Fade>

      {/* Demo Controls */}
      <Fade in timeout={1000}>
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Demo Controls
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handlePrevious}
                  startIcon={<SkipPrevious />}
                >
                  Previous
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handlePlayPause}
                  startIcon={isPlaying ? <Pause /> : <PlayArrow />}
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleNext}
                  endIcon={<SkipNext />}
                >
                  Next
                </Button>
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={demoProgress}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
              {demoProgress}% complete
            </Typography>
          </CardContent>
        </Card>
      </Fade>

      {/* Current Demo Step */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Zoom in timeout={1200}>
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: `${currentStep.color}.main`,
                      width: 60,
                      height: 60,
                      mr: 2,
                    }}
                  >
                    {currentStep.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                      {currentStep.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Step {currentStep.id} of {demoSteps.length}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                  {currentStep.description}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Key Features:
                  </Typography>
                  {currentStep.features.map((feature, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CheckCircle sx={{ fontSize: 16, color: 'success.main', mr: 1 }} />
                      <Typography variant="body2">{feature}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>

        <Grid item xs={12} md={6}>
          <Zoom in timeout={1400}>
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Live Demo Data
                </Typography>

                {currentStep.id === 1 && (
                  <Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        User Profile:
                      </Typography>
                      <Typography variant="body2" sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                        {currentStep.demoData.userProfile}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Match Score: {currentStep.demoData.matchScore}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={currentStep.demoData.matchScore}
                        color="success"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Recommended Shelter:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {currentStep.demoData.recommendedShelter}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {currentStep.demoData.reasoning}
                    </Typography>
                  </Box>
                )}

                {currentStep.id === 2 && (
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.50', borderRadius: 2 }}>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {currentStep.demoData.totalShelters}
                          </Typography>
                          <Typography variant="body2">Total Shelters</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.50', borderRadius: 2 }}>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                            {currentStep.demoData.availableBeds}
                          </Typography>
                          <Typography variant="body2">Available Beds</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Nearest shelter: {currentStep.demoData.nearestShelter}
                      </Typography>
                      <Typography variant="body2">
                        Estimated wait time: {currentStep.demoData.waitTime}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {currentStep.id === 3 && (
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.50', borderRadius: 2 }}>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                            {currentStep.demoData.availableJobs}
                          </Typography>
                          <Typography variant="body2">Available Jobs</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.50', borderRadius: 2 }}>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                            {currentStep.demoData.successRate}%
                          </Typography>
                          <Typography variant="body2">Success Rate</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Training programs: {currentStep.demoData.trainingPrograms}
                      </Typography>
                      <Typography variant="body2">
                        Average wage: {currentStep.demoData.averageWage}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {currentStep.id === 4 && (
                  <Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Supported Languages:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        {currentStep.demoData.languages.map((lang, index) => (
                          <Chip key={index} label={lang} size="small" color="primary" />
                        ))}
                      </Box>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Accessibility Score: {currentStep.demoData.accessibilityScore}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={currentStep.demoData.accessibilityScore}
                        color="success"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Voice commands: {currentStep.demoData.voiceCommands}
                    </Typography>
                    <Typography variant="body2">
                      Device support: {currentStep.demoData.supportedDevices}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
      </Grid>

      {/* Demo Navigation */}
      <Fade in timeout={1600}>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Ready to see it in action?
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
            startIcon={<PlayArrow />}
          >
            Start Full Demo
          </Button>
        </Box>
      </Fade>
    </Box>
  );
};

export default DemoFeatures;
