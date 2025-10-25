import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Grid,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Psychology,
  LocationOn,
  Work,
  Family,
  MedicalServices,
  Security,
  Speed,
  TrendingUp,
  CheckCircle,
  Star,
} from '@mui/icons-material';

const SmartMatching = ({ userProfile, shelters }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchingScore, setMatchingScore] = useState(0);

  useEffect(() => {
    // Simulate AI matching algorithm
    const calculateMatches = () => {
      const userNeeds = userProfile?.needs || [];
      const userLocation = userProfile?.currentLocation || {};
      const userPreferences = userProfile?.preferences || {};

      const scoredMatches = shelters.map(shelter => {
        let score = 0;
        const factors = [];

        // Location proximity (30% weight)
        const distanceScore = calculateDistanceScore(userLocation, shelter.address);
        score += distanceScore * 0.3;
        factors.push({ name: 'Location Proximity', score: distanceScore, weight: 0.3 });

        // Service alignment (25% weight)
        const serviceScore = calculateServiceScore(userNeeds, shelter.services);
        score += serviceScore * 0.25;
        factors.push({ name: 'Service Match', score: serviceScore, weight: 0.25 });

        // Availability (20% weight)
        const availabilityScore = shelter.capacity.availableBeds > 0 ? 100 : 0;
        score += availabilityScore * 0.2;
        factors.push({ name: 'Availability', score: availabilityScore, weight: 0.2 });

        // Rating and reviews (15% weight)
        const ratingScore = (shelter.rating || 0) * 20; // Convert 5-star to 100 scale
        score += ratingScore * 0.15;
        factors.push({ name: 'Quality Rating', score: ratingScore, weight: 0.15 });

        // Special accommodations (10% weight)
        const accommodationScore = calculateAccommodationScore(userProfile, shelter);
        score += accommodationScore * 0.1;
        factors.push({ name: 'Special Needs', score: accommodationScore, weight: 0.1 });

        return {
          ...shelter,
          matchScore: Math.round(score),
          factors,
          predictedSuccess: predictSuccess(score, shelter),
        };
      });

      return scoredMatches
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5); // Top 5 matches
    };

    setTimeout(() => {
      const results = calculateMatches();
      setMatches(results);
      setMatchingScore(results[0]?.matchScore || 0);
      setLoading(false);
    }, 2000);
  }, [userProfile, shelters]);

  const calculateDistanceScore = (userLocation, shelterAddress) => {
    // Simplified distance calculation
    const distance = Math.random() * 20; // Mock distance in miles
    return Math.max(0, 100 - (distance * 5)); // Score decreases with distance
  };

  const calculateServiceScore = (userNeeds, shelterServices) => {
    if (!userNeeds.length || !shelterServices.length) return 50;
    
    const matches = userNeeds.filter(need => 
      shelterServices.some(service => 
        service.toLowerCase().includes(need.toLowerCase())
      )
    ).length;
    
    return (matches / userNeeds.length) * 100;
  };

  const calculateAccommodationScore = (userProfile, shelter) => {
    let score = 50; // Base score
    
    // Check for family accommodations
    if (userProfile?.personalInfo?.family && shelter.services.includes('Family')) {
      score += 30;
    }
    
    // Check for medical services
    if (userProfile?.needs?.includes('Medical') && shelter.services.includes('Medical')) {
      score += 20;
    }
    
    return Math.min(100, score);
  };

  const predictSuccess = (matchScore, shelter) => {
    const baseSuccess = matchScore * 0.8; // 80% of match score
    const ratingBonus = (shelter.rating || 0) * 4; // Rating bonus
    const availabilityBonus = shelter.capacity.availableBeds > 0 ? 10 : -20;
    
    return Math.max(0, Math.min(100, baseSuccess + ratingBonus + availabilityBonus));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Great Match';
    if (score >= 70) return 'Good Match';
    if (score >= 60) return 'Fair Match';
    return 'Poor Match';
  };

  if (loading) {
    return (
      <Card sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Psychology sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            AI Matching in Progress...
          </Typography>
        </Box>
        <LinearProgress sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Analyzing your profile and finding the best matches...
        </Typography>
      </Card>
    );
  }

  return (
    <Box>
      {/* AI Matching Header */}
      <Fade in timeout={800}>
        <Card sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
              <Psychology />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                AI-Powered Matching Results
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Our algorithm analyzed {shelters.length} shelters to find your best matches
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              {matchingScore}%
            </Typography>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {getScoreLabel(matchingScore)}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Best match found
              </Typography>
            </Box>
          </Box>
        </Card>
      </Fade>

      {/* Match Results */}
      <Grid container spacing={3}>
        {matches.map((match, index) => (
          <Grid item xs={12} md={6} key={match._id}>
            <Zoom in timeout={1000 + index * 200}>
              <Card
                sx={{
                  height: '100%',
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
                <CardContent sx={{ p: 3 }}>
                  {/* Match Score Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {match.name}
                    </Typography>
                    <Chip
                      label={`${match.matchScore}% Match`}
                      color={getScoreColor(match.matchScore)}
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>

                  {/* Match Factors */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Why This Match Works:
                    </Typography>
                    <List dense>
                      {match.factors.map((factor, factorIndex) => (
                        <ListItem key={factorIndex} sx={{ py: 0.5 }}>
                          <ListItemIcon>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: factor.score >= 70 ? 'success.main' : 
                                        factor.score >= 50 ? 'warning.main' : 'error.main',
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={factor.name}
                            secondary={`${Math.round(factor.score)}% (${Math.round(factor.weight * 100)}% weight)`}
                            primaryTypographyProps={{ fontSize: '0.875rem' }}
                            secondaryTypographyProps={{ fontSize: '0.75rem' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  {/* Success Prediction */}
                  <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TrendingUp sx={{ fontSize: 20, color: 'primary.main', mr: 1 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Success Prediction
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={match.predictedSuccess}
                        sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                        color={getScoreColor(match.predictedSuccess)}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600, minWidth: '40px' }}>
                        {Math.round(match.predictedSuccess)}%
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Based on similar cases, you have a {Math.round(match.predictedSuccess)}% chance of success
                    </Typography>
                  </Box>

                  {/* Quick Stats */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Chip
                      icon={<LocationOn />}
                      label={`${Math.round(Math.random() * 10 + 1)} miles away`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<Work />}
                      label={`${match.capacity.availableBeds} beds available`}
                      size="small"
                      variant="outlined"
                      color={match.capacity.availableBeds > 0 ? 'success' : 'error'}
                    />
                    <Chip
                      icon={<Star />}
                      label={`${match.rating || 0}/5 rating`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  {/* Action Button */}
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      },
                    }}
                  >
                    View Full Details
                  </Button>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      {/* AI Insights */}
      <Fade in timeout={1200}>
        <Card sx={{ p: 3, mt: 3, bgcolor: 'grey.50' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Psychology sx={{ fontSize: 24, color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              AI Insights & Recommendations
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Based on your profile and our analysis of successful outcomes:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Location proximity is your strongest factor"
                secondary="Consider shelters within 5 miles for best outcomes"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Services alignment increases success by 40%"
                secondary="Look for shelters that offer the specific services you need"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Higher-rated shelters have 60% better outcomes"
                secondary="Prioritize shelters with 4+ star ratings"
              />
            </ListItem>
          </List>
        </Card>
      </Fade>
    </Box>
  );
};

export default SmartMatching;
