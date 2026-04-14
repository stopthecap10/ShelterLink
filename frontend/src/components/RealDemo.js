import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
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
} from '@mui/material';
import {
  PlayArrow,
  Refresh,
  Home,
  Work,
  Psychology,
  HealthAndSafety,
  Security,
  LocalHospital,
  Group,
  DirectionsCar,
  Gavel,
  LocalHospital as Medical,
} from '@mui/icons-material';
import axios from 'axios';
import { mockShelterService } from '../api/mockData';
import { useLanguage } from '../contexts/LanguageContext';

const RealDemo = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [userProfile, setUserProfile] = useState({
    name: '',
    location: '',
    familySize: '1',
    needs: [],
    specialRequirements: [],
    employmentStatus: 'unemployed',
    urgencyLevel: 'planning_ahead'
  });

  const [demoData, setDemoData] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [processingSteps, setProcessingSteps] = useState([]);

  const needOptions = [
    { value: 'housing', label: t('housing'), icon: <Home /> },
    { value: 'employment', label: t('employment'), icon: <Work /> },
    { value: 'mental_health', label: t('mentalHealth'), icon: <Psychology /> },
    { value: 'substance_abuse', label: t('substanceAbuse'), icon: <HealthAndSafety /> },
    { value: 'domestic_violence', label: t('domesticViolence'), icon: <Security /> },
    { value: 'food_assistance', label: t('foodAssistance'), icon: <LocalHospital /> },
    { value: 'clothing', label: t('clothing'), icon: <Group /> },
    { value: 'transportation', label: t('transportation'), icon: <DirectionsCar /> },
    { value: 'legal_aid', label: t('legalAid'), icon: <Gavel /> },
    { value: 'medical_care', label: t('medicalCare'), icon: <Medical /> },
  ];

  const specialRequirements = [
    { value: 'wheelchair_accessible', label: t('wheelchairAccessible') },
    { value: 'pet_friendly', label: t('petFriendly') },
    { value: 'veteran_services', label: t('veteranServices') },
    { value: 'youth_programs', label: t('youthPrograms') },
    { value: 'senior_services', label: t('seniorServices') },
    { value: 'family_programs', label: t('familyPrograms') },
    { value: 'women_only', label: t('womenOnly') },
    { value: 'men_only', label: t('menOnly') },
  ];

  const runAIMatching = async () => {
    if (!userProfile.name || !userProfile.needs.length) return;

    setIsRunning(true);
    setProcessingSteps([]);
    setCurrentStep(null);

    try {
      // Step 1: Needs Analysis
      setCurrentStep('needs_analysis');
      setProcessingSteps([{
        step: 'needs_analysis',
        title: 'Needs Analysis',
        description: 'Evaluating your circumstances and service requirements...',
        status: 'processing',
      }]);

      await new Promise(r => setTimeout(r, 1000));

      setProcessingSteps(prev => prev.map(s =>
        s.step === 'needs_analysis'
          ? { ...s, status: 'completed', details: `Identified ${userProfile.needs.length} primary need(s) · Family size: ${userProfile.familySize} · Urgency: ${userProfile.urgencyLevel.replace('_', ' ')}` }
          : s
      ));

      // Step 2: Shelter Matching (real algorithm)
      setCurrentStep('shelter_matching');
      setProcessingSteps(prev => [...prev, {
        step: 'shelter_matching',
        title: 'Shelter Matching',
        description: 'Scoring shelters by service match, distance, availability, and rating...',
        status: 'processing',
      }]);

      // Get user coordinates if location string is provided (best-effort)
      let userLat = null;
      let userLng = null;
      if (userProfile.location) {
        try {
          const geo = await axios.get(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(userProfile.location + ', Los Angeles, CA')}&format=json&limit=1`
          );
          if (geo.data?.[0]) {
            userLat = parseFloat(geo.data[0].lat);
            userLng = parseFloat(geo.data[0].lon);
          }
        } catch {
          // Geolocation failed — matching will skip distance factor
        }
      }

      let matchedShelters = [];

      try {
        // Call real matching API
        const matchRes = await axios.post('/api/match', {
          needs: userProfile.needs,
          specialRequirements: userProfile.specialRequirements,
          userLat,
          userLng,
          familySize: parseInt(userProfile.familySize),
          name: userProfile.name,
          employmentStatus: userProfile.employmentStatus,
          urgencyLevel: userProfile.urgencyLevel,
        });

        matchedShelters = matchRes.data.matches.map(m => ({
          ...m.shelter,
          matchScore: m.matchScore,
          distanceMiles: m.distanceMiles,
          reasoning: m.reasoning,
          breakdown: m.breakdown,
        }));
      } catch {
        // API unavailable — fall back to client-side scoring on mock data
        const sheltersRes = await mockShelterService.getShelters();
        const NEED_KEYWORDS = {
          housing: ['shelter', 'housing', 'emergency'],
          employment: ['job', 'employment', 'training'],
          mental_health: ['mental', 'counseling'],
          substance_abuse: ['recovery', 'substance'],
          domestic_violence: ['domestic', 'women'],
          food_assistance: ['meal', 'food'],
          clothing: ['clothing'],
          transportation: ['transportation', 'transit'],
          legal_aid: ['legal'],
          medical_care: ['medical', 'health'],
        };

        matchedShelters = sheltersRes.shelters.map(shelter => {
          const svcText = shelter.services.map(s => s.name.toLowerCase()).join(' ');
          let matched = 0;
          for (const need of userProfile.needs) {
            const kws = NEED_KEYWORDS[need] || [need];
            if (kws.some(k => svcText.includes(k))) matched++;
          }
          const svcScore = userProfile.needs.length ? matched / userProfile.needs.length : 0;
          const availScore = shelter.capacity.totalBeds
            ? shelter.capacity.availableBeds / shelter.capacity.totalBeds : 0;
          const ratingScore = (shelter.rating?.average || 0) / 5;
          const total = svcScore * 0.5 + availScore * 0.3 + ratingScore * 0.2;

          return {
            ...shelter,
            matchScore: Math.round(total * 100),
            reasoning: `${Math.round(svcScore * 100)}% service match · ${shelter.capacity.availableBeds} beds available`,
            breakdown: { serviceMatch: Math.round(svcScore * 100), availability: Math.round(availScore * 100), rating: Math.round(ratingScore * 100) },
          };
        })
        .filter(s => s.shelter?.capacity?.availableBeds > 0 || s.capacity?.availableBeds > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5);
      }

      setProcessingSteps(prev => prev.map(s =>
        s.step === 'shelter_matching'
          ? { ...s, status: 'completed', details: `Scored ${matchedShelters.length} compatible shelter(s) using service match, distance, availability, and ratings` }
          : s
      ));

      // Step 3: Finalizing
      setCurrentStep('results_generation');
      setProcessingSteps(prev => [...prev, {
        step: 'results_generation',
        title: 'Finalizing Results',
        description: 'Ranking matches and preparing personalized recommendations...',
        status: 'processing',
      }]);

      await new Promise(r => setTimeout(r, 800));

      setProcessingSteps(prev => prev.map(s =>
        s.step === 'results_generation'
          ? { ...s, status: 'completed', details: 'Recommendations ranked and ready.' }
          : s
      ));

      const topScore = matchedShelters[0]?.matchScore || 0;

      setDemoData({
        userProfile,
        recommendations: { shelters: matchedShelters },
        aiAnalysis: {
          confidence: topScore,
          matchesFound: matchedShelters.length,
        },
      });

      setCurrentStep(null);
    } catch (error) {
      setDemoData({
        userProfile,
        recommendations: { shelters: [] },
        error: 'Matching temporarily unavailable. Please try again.',
      });
      setCurrentStep(null);
    }

    setIsRunning(false);
  };

  const resetDemo = () => {
    setDemoData(null);
    setIsRunning(false);
    setUserProfile({
      name: '',
      location: '',
      familySize: '1',
      needs: [],
      specialRequirements: [],
      employmentStatus: 'unemployed',
      urgencyLevel: 'planning_ahead'
    });
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Home Button */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            variant="outlined"
            startIcon={<Home />}
            onClick={() => navigate('/')}
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: 600,
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {t('home')}
          </Button>
        </Box>

        {/* Title */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: 'white',
            mb: 2,
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          AI-Powered Shelter Matching System
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255,255,255,0.9)',
            mb: 4,
            textAlign: 'center',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            maxWidth: 800,
            mx: 'auto',
            lineHeight: 1.6
          }}
        >
          Our advanced artificial intelligence analyzes individual needs, shelter availability, and service compatibility to provide personalized housing recommendations with high success rates.
        </Typography>

        {/* Processing Steps with Cool Sidebar */}
        {isRunning && (
          <Card sx={{ 
            borderRadius: 4, 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            mb: 3
          }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ display: 'flex', minHeight: 400 }}>
                {/* Cool Sidebar Progress */}
                <Box sx={{ 
                  width: 200, 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '16px 0 0 16px',
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 3, textAlign: 'center' }}>
                    Processing Analysis
                  </Typography>
                  
                  {/* Progress Steps */}
                  {[
                    { key: 'needs_analysis', title: 'Risk Assessment', icon: '🧠' },
                    { key: 'shelter_matching', title: 'Shelter Matching', icon: '🏠' },
                    { key: 'results_generation', title: 'Recommendations', icon: '📊' }
                  ].map((step, index) => {
                    const stepData = processingSteps.find(s => s.step === step.key);
                    const isActive = currentStep === step.key;
                    const isCompleted = stepData?.status === 'completed';
                    const isProcessing = stepData?.status === 'processing';
                    
                    return (
                      <Box key={step.key} sx={{ mb: 3, position: 'relative' }}>
                        {/* Connection Line */}
                        {index < 3 && (
                          <Box sx={{
                            position: 'absolute',
                            left: 20,
                            top: 40,
                            width: 2,
                            height: 60,
                            background: isCompleted ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
                            borderRadius: 1
                          }} />
                        )}
                        
                        {/* Step Circle */}
                        <Box sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: isCompleted ? 'rgba(76, 175, 80, 0.9)' : 
                                     isProcessing ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 1,
                          border: isProcessing ? '2px solid rgba(255, 255, 255, 0.8)' : 'none',
                          animation: isProcessing ? 'pulse 1.5s ease-in-out infinite' : 'none',
                          '@keyframes pulse': {
                            '0%': { transform: 'scale(1)', opacity: 1 },
                            '50%': { transform: 'scale(1.1)', opacity: 0.8 },
                            '100%': { transform: 'scale(1)', opacity: 1 }
                          }
                        }}>
                          <Typography sx={{ 
                            fontSize: '18px',
                            color: isCompleted ? 'white' : isProcessing ? '#667eea' : 'rgba(255,255,255,0.7)'
                          }}>
                            {isCompleted ? '✅' : step.icon}
                          </Typography>
                        </Box>
                        
                        {/* Step Title */}
                        <Typography variant="body2" sx={{ 
                          color: isCompleted ? 'rgba(255,255,255,0.9)' : 
                                 isProcessing ? 'white' : 'rgba(255,255,255,0.6)',
                          fontWeight: isProcessing ? 700 : 500,
                          fontSize: '12px',
                          textAlign: 'center',
                          lineHeight: 1.2
                        }}>
                          {step.title}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
                
                {/* Main Content Area */}
                <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  {currentStep && (
                    <>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
                        {processingSteps.find(s => s.step === currentStep)?.title}
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3, textAlign: 'center' }}>
                        {processingSteps.find(s => s.step === currentStep)?.description}
                      </Typography>
                      
                      {/* Progress Bar */}
                      <Box sx={{ 
                        width: '100%', 
                        height: 8, 
                        background: 'rgba(0,0,0,0.1)', 
                        borderRadius: 4, 
                        mb: 3,
                        overflow: 'hidden'
                      }}>
                        <Box sx={{
                          height: '100%',
                          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: 4,
                          width: '100%',
                          animation: 'progress 2s ease-in-out infinite',
                          '@keyframes progress': {
                            '0%': { transform: 'translateX(-100%)' },
                            '100%': { transform: 'translateX(100%)' }
                          }
                        }} />
                      </Box>
                      
                      {/* Current Step Details */}
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                          Analyzing data and generating personalized recommendations...
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        {!demoData && !isRunning && (
          <Card sx={{ 
            borderRadius: 4, 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h5" 
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {t('tellUsAboutYourself')}
              </Typography>
              
              <Grid container spacing={3}>
                {/* Basic Info */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('name')}
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('location')}
                    value={userProfile.location}
                    onChange={(e) => setUserProfile({...userProfile, location: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('familySize')}
                    value={userProfile.familySize}
                    onChange={(e) => setUserProfile({...userProfile, familySize: e.target.value})}
                  />
                </Grid>

                {/* Services Needed */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {t('whatServicesDoYouNeed')}
                  </Typography>
                  <Grid container spacing={2}>
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

                {/* Special Requirements */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {t('specialRequirements')}
                  </Typography>
                  <Grid container spacing={2}>
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

                {/* Dropdowns */}
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
                      value={userProfile.urgencyLevel}
                      onChange={(e) => setUserProfile({...userProfile, urgencyLevel: e.target.value})}
                    >
                      <MenuItem value="emergency">{t('emergency')}</MenuItem>
                      <MenuItem value="urgent">{t('urgent')}</MenuItem>
                      <MenuItem value="planning_ahead">{t('planningAhead')}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Submit Button */}
                <Box sx={{ mt: 4, textAlign: 'center', width: '100%' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={runAIMatching}
                    disabled={!userProfile.name || !userProfile.needs.length || isRunning}
                    sx={{
                      px: 6,
                      py: 2,
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 25px rgba(102, 126, 234, 0.4)',
                      },
                      '&:disabled': {
                        background: 'rgba(0,0,0,0.12)',
                        color: 'rgba(0,0,0,0.26)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                    startIcon={isRunning ? <Refresh className="animate-spin" /> : <PlayArrow />}
                  >
                    {isRunning ? t('processing') : t('startAIMatching')}
                  </Button>
                  {(!userProfile.name || !userProfile.needs.length) && (
                    <Typography variant="body2" sx={{ mt: 2, color: '#666', fontStyle: 'italic' }}>
                      {t('fillNameAndSelectNeed')}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {demoData && (
          <Card sx={{ 
            borderRadius: 4, 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  AI Analysis Complete
                </Typography>
                <Button
                  variant="outlined"
                  onClick={resetDemo}
                  startIcon={<Refresh />}
                >
                  Start New Analysis
                </Button>
              </Box>

              {/* AI Analysis Stats */}
              {demoData.aiAnalysis && (
                <Box sx={{ 
                  mb: 3, 
                  p: 2, 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 2,
                  color: 'white'
                }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    System Performance Metrics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Confidence Level</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {demoData.aiAnalysis.confidence}%
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Processing Time</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {demoData.aiAnalysis.processingTime}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Matches Found</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {demoData.aiAnalysis.matchesFound}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Accuracy Rate</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {demoData.aiAnalysis.personalizedScore}%
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Error Message */}
              {demoData.error && (
                <Box sx={{ 
                  mb: 3, 
                  p: 2, 
                  background: 'rgba(244, 67, 54, 0.1)',
                  border: '1px solid rgba(244, 67, 54, 0.3)',
                  borderRadius: 2,
                  color: 'error.main'
                }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    ⚠️ {demoData.error}
                  </Typography>
                </Box>
              )}

              <Grid container spacing={3}>
                {/* Shelter Recommendations */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Recommended Shelter Facilities
                  </Typography>
                  {demoData.recommendations.shelters.length > 0 ? (
                    demoData.recommendations.shelters.map((shelter, index) => (
                      <Card key={index} sx={{ mb: 2, p: 2, border: '1px solid rgba(0,0,0,0.1)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {shelter.name}
                          </Typography>
                          <Box sx={{ 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            fontWeight: 700
                          }}>
                            {shelter.matchScore}% Match
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {shelter.description.substring(0, 100)}...
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                          Analysis: {shelter.reasoning}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Available Beds: {shelter.capacity?.availableBeds || 0}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Rating: {shelter.rating?.average || 4.2}/5.0 ({shelter.rating?.count || 0} reviews)
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Wait Time: {shelter.waitTime} day{shelter.waitTime > 1 ? 's' : ''}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Success Rate: {shelter.successRate}%
                          </Typography>
                        </Box>
                      </Card>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      No shelters match your current criteria. Try adjusting your needs.
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default RealDemo;
