import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  LinearProgress,
  Alert,
  Divider,
  Paper,
  Stack,
  Rating,
  Badge,
  Fade,
  Zoom,
  Slide,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Refresh,
  CheckCircle,
  Speed,
  AutoAwesome,
  Group,
  LocalHospital,
  Work,
  Home,
  School,
  Security,
  AccessTime,
  TrendingUp,
  Star,
  LocationOn,
  Phone,
  Email,
  Business,
  People,
  Psychology,
  HealthAndSafety,
  FamilyRestroom,
  DirectionsCar,
  Gavel,
  LocalHospital as Medical,
} from '@mui/icons-material';
import { mockShelterService, mockJobService } from '../api/mockData';
import { useLanguage } from '../contexts/LanguageContext';

const RealDemo = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useLanguage();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [demoData, setDemoData] = useState(null);
  const [matchingResults, setMatchingResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '',
    age: '',
    location: '',
    needs: [],
    specialRequirements: [],
    familySize: 1,
    employmentStatus: 'unemployed',
    urgency: 'planning',
  });
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [processingSteps, setProcessingSteps] = useState([]);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const demoSteps = [
    { label: t('profileAnalysis'), color: 'primary', icon: <Group /> },
    { label: t('needsAssessment'), color: 'secondary', icon: <LocalHospital /> },
    { label: t('resourceScanning'), color: 'success', icon: <Work /> },
    { label: t('aiProcessing'), color: 'warning', icon: <AutoAwesome /> },
    { label: t('matchingAlgorithm'), color: 'info', icon: <Speed /> },
    { label: t('resultsGeneration'), color: 'error', icon: <CheckCircle /> },
    { label: t('complete'), color: 'success', icon: <CheckCircle /> },
  ];

  const needOptions = [
    { value: 'housing', label: t('housing'), icon: <Home /> },
    { value: 'employment', label: t('employment'), icon: <Work /> },
    { value: 'mental_health', label: t('mentalHealth'), icon: <Psychology /> },
    { value: 'substance_abuse', label: t('substanceAbuse'), icon: <HealthAndSafety /> },
    { value: 'domestic_violence', label: t('domesticViolence'), icon: <Security /> },
    { value: 'food', label: t('foodAssistance'), icon: <LocalHospital /> },
    { value: 'clothing', label: t('clothing'), icon: <Group /> },
    { value: 'transportation', label: t('transportation'), icon: <DirectionsCar /> },
    { value: 'legal', label: t('legalAid'), icon: <Gavel /> },
    { value: 'medical', label: t('medicalCare'), icon: <Medical /> },
  ];

  const specialRequirements = [
    { value: 'wheelchair', label: t('wheelchairAccessible') },
    { value: 'pet', label: t('petFriendly') },
    { value: 'lgbtq', label: t('lgbtqSafeSpace') },
    { value: 'veteran', label: t('veteranServices') },
    { value: 'youth', label: t('youthPrograms') },
    { value: 'senior', label: t('seniorServices') },
    { value: 'family', label: t('familyPrograms') },
    { value: 'women', label: t('womenOnly') },
    { value: 'men', label: t('menOnly') },
  ];

  // Real AI-like analysis function
  const generateAIAnalysis = (profile, shelters, jobs) => {
    const needs = profile.needs || [];
    const urgency = profile.urgency || 'planning';
    const employment = profile.employmentStatus || 'unemployed';
    
    // Risk assessment based on urgency and needs
    let riskLevel = 'Low';
    if (urgency === 'immediate') riskLevel = 'High';
    else if (urgency === 'urgent') riskLevel = 'Medium';
    
    // Priority needs based on urgency
    let priorityNeeds = needs.slice(0, 2);
    if (urgency === 'immediate') {
      priorityNeeds = ['housing', 'food'];
    }
    
    // Recommended services based on profile
    const recommendedServices = [];
    if (needs.includes('housing')) recommendedServices.push('Emergency Shelter');
    if (needs.includes('employment')) recommendedServices.push('Job Placement');
    if (needs.includes('mental_health')) recommendedServices.push('Mental Health Support');
    if (needs.includes('substance_abuse')) recommendedServices.push('Substance Abuse Treatment');
    if (needs.includes('domestic_violence')) recommendedServices.push('Domestic Violence Support');
    
    // Timeline estimation
    let timeline = '1-2 weeks';
    if (urgency === 'immediate') timeline = '24-48 hours';
    else if (urgency === 'urgent') timeline = '3-5 days';
    
    // Success probability calculation
    let successProbability = 60;
    if (urgency === 'immediate') successProbability = 85;
    else if (urgency === 'urgent') successProbability = 75;
    else if (employment === 'employed') successProbability = 90;
    
    return {
      riskAssessment: riskLevel,
      priorityNeeds: priorityNeeds,
      recommendedServices: recommendedServices,
      estimatedTimeline: timeline,
      successProbability: successProbability,
      aiInsights: [
        `Based on your ${urgency} timeline, I recommend focusing on immediate shelter placement.`,
        `Your ${employment} status suggests good potential for long-term stability.`,
        `The ${needs.length} needs identified require a comprehensive support approach.`
      ]
    };
  };

  // Real AI-like matching function
  const generateAIMatches = (profile, shelters, jobs) => {
    const needs = profile.needs || [];
    const urgency = profile.urgency || 'planning';
    
    return shelters.map(shelter => {
      let score = 0;
      const reasoning = [];
      const aiInsights = [];
      
      // Location proximity (simulated)
      if (shelter.location) {
        score += 25;
        reasoning.push('Location accessible');
        aiInsights.push('Within reasonable distance of your area');
      }
      
      // Needs matching with weights
      needs.forEach(need => {
        if (shelter.services && shelter.services.includes(need)) {
          const weight = getNeedWeight(need);
          score += weight;
          reasoning.push(`${need} service available`);
          aiInsights.push(`This shelter specializes in ${need} support`);
        }
      });
      
      // Availability matching
      if (shelter.availableBeds > 0) {
        score += 20;
        reasoning.push('Beds currently available');
        aiInsights.push('No waitlist - immediate placement possible');
      } else if (shelter.availableBeds === 0) {
        score -= 10;
        reasoning.push('No beds available');
        aiInsights.push('Waitlist required - consider backup options');
      }
      
      // Urgency matching
      if (urgency === 'immediate' && shelter.availableBeds > 0) {
        score += 15;
        reasoning.push('Emergency placement available');
        aiInsights.push('Perfect for immediate crisis situation');
      }
      
      // Quality indicators
      if (shelter.rating > 4) {
        score += 10;
        reasoning.push('High-rated facility');
        aiInsights.push('Excellent reputation and outcomes');
      }
      
      // Special requirements matching
      if (profile.specialRequirements && profile.specialRequirements.length > 0) {
        const matches = profile.specialRequirements.filter(req => 
          shelter.specialRequirements && shelter.specialRequirements.includes(req)
        );
        if (matches.length > 0) {
          score += matches.length * 8;
          reasoning.push(`Special requirements met: ${matches.join(', ')}`);
          aiInsights.push(`Accommodates your specific needs: ${matches.join(', ')}`);
        }
      }
      
      // Cap the score
      score = Math.min(score, 100);
      
      // Generate AI confidence
      let aiConfidence = 'Low';
      if (score > 80) aiConfidence = 'High';
      else if (score > 60) aiConfidence = 'Medium';
      
      // Generate wait time estimate
      let waitTime = '2-4 hours';
      if (shelter.availableBeds > 0) waitTime = 'Immediate';
      else if (shelter.availableBeds === 0) waitTime = '1-3 days';
      
      return {
        ...shelter,
        matchScore: score,
        reasoning: reasoning,
        aiInsights: aiInsights,
        estimatedWaitTime: waitTime,
        successRate: `${Math.floor(score * 0.8)}%`,
        aiConfidence: aiConfidence,
        aiRecommendation: generateAIRecommendation(score, urgency, needs),
      };
    }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  };

  // Helper function to get need weights
  const getNeedWeight = (need) => {
    const weights = {
      'housing': 20,
      'employment': 15,
      'mental_health': 12,
      'substance_abuse': 10,
      'domestic_violence': 15,
      'food': 8,
      'clothing': 5,
      'transportation': 6,
      'legal': 10,
      'medical': 12
    };
    return weights[need] || 5;
  };

  // Generate AI recommendation
  const generateAIRecommendation = (score, urgency, needs) => {
    if (score > 80) {
      return 'Strong match - highly recommended for immediate placement';
    } else if (score > 60) {
      return 'Good match - suitable option with some compromises';
    } else if (score > 40) {
      return 'Moderate match - consider as backup option';
    } else {
      return 'Low match - only if no other options available';
    }
  };

  // Typing effect function
  const typeText = async (text, speed = 50) => {
    setIsTyping(true);
    setTypingText('');
    
    for (let i = 0; i <= text.length; i++) {
      setTypingText(text.slice(0, i));
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    
    setIsTyping(false);
  };

  const runAIMatching = async () => {
    setLoading(true);
    setCurrentStep(0);
    setIsPlaying(true);
    
    try {
      // Step 1: Profile Analysis
      setCurrentStep(0);
      await typeText(t('analyzingUserProfile'), 30);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Step 2: Needs Assessment
      setCurrentStep(1);
      await typeText(t('evaluatingServiceRequirements'), 30);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Step 3: Resource Scanning
      setCurrentStep(2);
      await typeText(t('scanningAvailableShelters'), 30);
      const shelters = await mockShelterService.getShelters();
      const jobs = await mockJobService.getJobs();
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Step 4: AI Processing
      setCurrentStep(3);
      await typeText(t('runningMachineLearning'), 30);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 5: Matching Algorithm
      setCurrentStep(4);
      await typeText(t('applyingMatchingCriteria'), 30);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Step 6: Results Generation
      setCurrentStep(5);
      await typeText(t('generatingPersonalizedRecommendations'), 30);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate AI analysis
      const analysis = generateAIAnalysis(userProfile, shelters, jobs);
      setAiAnalysis(analysis);
      
      // Generate matching results
      const results = generateAIMatches(userProfile, shelters, jobs);
      setMatchingResults(results);
      
      setDemoData({
        userProfile: userProfile,
        totalShelters: shelters.length,
        availableBeds: shelters.reduce((sum, s) => sum + (s.availableBeds || 0), 0),
        jobOpportunities: jobs.length,
        aiAnalysis: analysis,
      });
      
      // Step 7: Complete
      setCurrentStep(6);
      await typeText(t('aiMatchingCompleteResults'), 30);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Error in AI matching:', error);
    }
    
    setLoading(false);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      runAIMatching();
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setMatchingResults([]);
    setDemoData(null);
    setIsPlaying(false);
    setAiAnalysis(null);
    setProcessingSteps([]);
  };

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              {t('aiMatching')}
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
              {t('aiDescription')}
            </Typography>
          </Box>
        </Fade>

        {/* User Profile Form */}
        {!demoData && (
          <Fade in timeout={1000}>
            <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                  {t('tellUsAboutYourself')}
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('name')}
                      value={userProfile.name}
                      onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                      placeholder={t('name')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('age')}
                      type="number"
                      value={userProfile.age}
                      onChange={(e) => setUserProfile({...userProfile, age: e.target.value})}
                      placeholder={t('age')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('location')}
                      value={userProfile.location}
                      onChange={(e) => setUserProfile({...userProfile, location: e.target.value})}
                      placeholder="City, State"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('familySize')}
                      type="number"
                      value={userProfile.familySize}
                      onChange={(e) => setUserProfile({...userProfile, familySize: parseInt(e.target.value)})}
                      placeholder="Number of people"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {t('whatServicesDoYouNeed')}
                    </Typography>
                    <Grid container spacing={1}>
                      {needOptions.map((need) => (
                        <Grid item key={need.value}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={userProfile.needs.includes(need.value)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setUserProfile({
                                      ...userProfile,
                                      needs: [...userProfile.needs, need.value]
                                    });
                                  } else {
                                    setUserProfile({
                                      ...userProfile,
                                      needs: userProfile.needs.filter(n => n !== need.value)
                                    });
                                  }
                                }}
                              />
                            }
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {need.icon}
                                {need.label}
                              </Box>
                            }
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {t('specialRequirements')}
                    </Typography>
                    <Grid container spacing={1}>
                      {specialRequirements.map((req) => (
                        <Grid item key={req.value}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={userProfile.specialRequirements.includes(req.value)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setUserProfile({
                                      ...userProfile,
                                      specialRequirements: [...userProfile.specialRequirements, req.value]
                                    });
                                  } else {
                                    setUserProfile({
                                      ...userProfile,
                                      specialRequirements: userProfile.specialRequirements.filter(r => r !== req.value)
                                    });
                                  }
                                }}
                              />
                            }
                            label={req.label}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>{t('employmentStatus')}</InputLabel>
                      <Select
                        value={userProfile.employmentStatus}
                        onChange={(e) => setUserProfile({...userProfile, employmentStatus: e.target.value})}
                      >
                        <MenuItem value="employed">{t('employed')}</MenuItem>
                        <MenuItem value="unemployed">{t('unemployed')}</MenuItem>
                        <MenuItem value="part_time">{t('partTime')}</MenuItem>
                        <MenuItem value="student">{t('student')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>{t('urgencyLevel')}</InputLabel>
                      <Select
                        value={userProfile.urgency}
                        onChange={(e) => setUserProfile({...userProfile, urgency: e.target.value})}
                      >
                        <MenuItem value="immediate">{t('immediate')}</MenuItem>
                        <MenuItem value="urgent">{t('urgent')}</MenuItem>
                        <MenuItem value="soon">{t('soon')}</MenuItem>
                        <MenuItem value="planning">{t('planning')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Box sx={{ mt: 3, textAlign: 'center', width: '100%' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={runAIMatching}
                      disabled={!userProfile.name || !userProfile.needs.length}
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
                      {t('startAIMatching')}
                    </Button>
                    {(!userProfile.name || !userProfile.needs.length) && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {t('fillNameAndSelectNeed')}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </CardContent>
            </Card>
          </Fade>
        )}

        {/* Demo Steps */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Zoom in timeout={1200}>
              <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    AI Processing Steps
                  </Typography>
                  <Stepper activeStep={currentStep} orientation="vertical">
                    {demoSteps.map((step, index) => (
                      <Step key={index}>
                        <StepLabel
                          icon={
                            <Avatar
                              sx={{
                                bgcolor: currentStep >= index ? step.color + '.main' : 'grey.300',
                                width: 32,
                                height: 32,
                              }}
                            >
                              {step.icon}
                            </Avatar>
                          }
                        >
                          {step.label}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                  
                  {loading && (
                    <Box sx={{ mt: 3 }}>
                      <LinearProgress sx={{ mb: 2 }} />
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          fontFamily: 'monospace',
                          minHeight: '20px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {typingText}
                        {isTyping && <Box component="span" sx={{ ml: 0.5, animation: 'blink 1s infinite' }}>|</Box>}
                      </Typography>
                    </Box>
                  )}
                  
                  {currentStep === 6 && !loading && (
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                      <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
                        {t('aiMatchingComplete')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('yourPersonalizedRecommendations')}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          <Grid item xs={12} md={6}>
            <Zoom in timeout={1400}>
              <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    {t('aiAnalysisResults')}
                  </Typography>
                  
                  {aiAnalysis && (
                    <Box>
                      <Alert severity="info" sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Risk Assessment: {aiAnalysis.riskAssessment}
                        </Typography>
                        <Typography variant="body2">
                          Success Probability: {aiAnalysis.successProbability}%
                        </Typography>
                        <Typography variant="body2">
                          Estimated Timeline: {aiAnalysis.estimatedTimeline}
                        </Typography>
                      </Alert>
                      
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Priority Needs:
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        {aiAnalysis.priorityNeeds.map((need, index) => (
                          <Chip
                            key={index}
                            label={need.replace('_', ' ')}
                            color="primary"
                            size="small"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>
                      
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        AI Insights:
                      </Typography>
                      {aiAnalysis.aiInsights.map((insight, index) => (
                        <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                          • {insight}
                        </Typography>
                      ))}
                    </Box>
                  )}
                  
                  {!aiAnalysis && !loading && currentStep < 6 && (
                    <Typography variant="body2" color="text.secondary">
                      Fill out the form and start the AI matching to see analysis results.
                    </Typography>
                  )}
                  
                  {currentStep === 6 && !loading && (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <CheckCircle sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                      <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
                        Analysis Complete!
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        </Grid>

        {/* Matching Results */}
        {matchingResults.length > 0 && (
          <Fade in timeout={1600}>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                AI-Generated Matches
              </Typography>
              <Grid container spacing={3}>
                {matchingResults.map((shelter, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {shelter.name}
                          </Typography>
                          <Chip
                            label={`${shelter.matchScore}% Match`}
                            color={shelter.matchScore > 80 ? 'success' : shelter.matchScore > 60 ? 'warning' : 'default'}
                            size="small"
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {shelter.description}
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            AI Confidence: {shelter.aiConfidence}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            Wait Time: {shelter.estimatedWaitTime}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            Success Rate: {shelter.successRate}
                          </Typography>
                        </Box>
                        
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Why This Match:
                        </Typography>
                        {shelter.reasoning.map((reason, idx) => (
                          <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
                            • {reason}
                          </Typography>
                        ))}
                        
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
                          AI Recommendation:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {shelter.aiRecommendation}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        )}

        {/* Demo Controls */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              onClick={handlePlayPause}
              disabled={!userProfile.name || !userProfile.needs.length}
              startIcon={isPlaying ? <Pause /> : <PlayArrow />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
              }}
            >
              {isPlaying ? t('pauseDemo') : t('startDemo')}
            </Button>
            
            <Button
              variant="outlined"
              onClick={handleReset}
              startIcon={<Refresh />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'primary.light',
                },
              }}
            >
              {t('resetDemo')}
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default RealDemo;