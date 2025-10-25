import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Fade,
  Zoom,
  useTheme,
} from '@mui/material';
import {
  Analytics,
  TrendingUp,
  TrendingDown,
  Psychology,
  LocationOn,
  Work,
  People,
  Schedule,
  Star,
  CheckCircle,
  Warning,
  Info,
} from '@mui/icons-material';

const PredictiveAnalytics = () => {
  const theme = useTheme();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching predictive analytics
    setTimeout(() => {
      setAnalytics({
        demandForecast: {
          current: 156,
          predicted: 189,
          trend: 'up',
          confidence: 87,
        },
        successRates: {
          shelterPlacement: 89,
          jobPlacement: 76,
          longTermStability: 68,
        },
        peakTimes: [
          { time: '6:00 PM', demand: 95, reason: 'Evening check-ins' },
          { time: '8:00 AM', demand: 78, reason: 'Morning availability' },
          { time: '2:00 PM', demand: 65, reason: 'Afternoon services' },
        ],
        riskFactors: [
          { factor: 'Weather', impact: 'High', description: 'Cold weather increases demand by 40%' },
          { factor: 'Holidays', impact: 'Medium', description: 'Holiday periods see 25% more requests' },
          { factor: 'Economic', impact: 'High', description: 'Job loss events spike demand' },
        ],
        recommendations: [
          'Increase capacity during cold weather periods',
          'Prepare additional resources for holiday seasons',
          'Focus on job training programs to reduce long-term dependency',
        ],
      });
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <Card sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Analytics sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Loading Predictive Analytics...
          </Typography>
        </Box>
        <LinearProgress />
      </Card>
    );
  }

  const getTrendIcon = (trend) => {
    return trend === 'up' ? <TrendingUp sx={{ color: 'success.main' }} /> : 
           trend === 'down' ? <TrendingDown sx={{ color: 'error.main' }} /> : 
           <TrendingUp sx={{ color: 'warning.main' }} />;
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'success' : trend === 'down' ? 'error' : 'warning';
  };

  return (
    <Box>
      {/* Header */}
      <Fade in timeout={800}>
        <Card sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
              <Analytics />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Predictive Analytics Dashboard
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                AI-powered insights for better resource allocation and outcomes
              </Typography>
            </Box>
          </Box>
        </Card>
      </Fade>

      <Grid container spacing={3}>
        {/* Demand Forecast */}
        <Grid item xs={12} md={6}>
          <Zoom in timeout={1000}>
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Psychology sx={{ fontSize: 24, color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Demand Forecast
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Current Demand
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {analytics.demandForecast.current} people
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Predicted Demand (Next 30 days)
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {analytics.demandForecast.predicted} people
                      </Typography>
                      {getTrendIcon(analytics.demandForecast.trend)}
                    </Box>
                  </Box>
                  
                  <LinearProgress
                    variant="determinate"
                    value={(analytics.demandForecast.predicted / 200) * 100}
                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    color={getTrendColor(analytics.demandForecast.trend)}
                  />
                  
                  <Typography variant="caption" color="text.secondary">
                    Confidence: {analytics.demandForecast.confidence}%
                  </Typography>
                </Box>

                <Chip
                  label={`${analytics.demandForecast.predicted - analytics.demandForecast.current} more people expected`}
                  color={getTrendColor(analytics.demandForecast.trend)}
                  sx={{ fontWeight: 600 }}
                />
              </CardContent>
            </Card>
          </Zoom>
        </Grid>

        {/* Success Rates */}
        <Grid item xs={12} md={6}>
          <Zoom in timeout={1200}>
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Star sx={{ fontSize: 24, color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Success Rates
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Shelter Placement</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {analytics.successRates.shelterPlacement}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={analytics.successRates.shelterPlacement}
                    color="success"
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Job Placement</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {analytics.successRates.jobPlacement}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={analytics.successRates.jobPlacement}
                    color="info"
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Long-term Stability</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {analytics.successRates.longTermStability}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={analytics.successRates.longTermStability}
                    color="warning"
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>

        {/* Peak Times */}
        <Grid item xs={12} md={6}>
          <Zoom in timeout={1400}>
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Schedule sx={{ fontSize: 24, color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Peak Demand Times
                  </Typography>
                </Box>
                
                <List dense>
                  {analytics.peakTimes.map((peak, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: index === 0 ? 'error.main' : 
                                    index === 1 ? 'warning.main' : 'info.main',
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${peak.time} - ${peak.demand}% demand`}
                        secondary={peak.reason}
                        primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }}
                        secondaryTypographyProps={{ fontSize: '0.75rem' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>

        {/* Risk Factors */}
        <Grid item xs={12} md={6}>
          <Zoom in timeout={1600}>
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Warning sx={{ fontSize: 24, color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Risk Factors
                  </Typography>
                </Box>
                
                <List dense>
                  {analytics.riskFactors.map((risk, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        {risk.impact === 'High' ? (
                          <Warning sx={{ color: 'error.main', fontSize: 20 }} />
                        ) : risk.impact === 'Medium' ? (
                          <Info sx={{ color: 'warning.main', fontSize: 20 }} />
                        ) : (
                          <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={risk.factor}
                        secondary={risk.description}
                        primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }}
                        secondaryTypographyProps={{ fontSize: '0.75rem' }}
                      />
                      <Chip
                        label={risk.impact}
                        size="small"
                        color={risk.impact === 'High' ? 'error' : 
                               risk.impact === 'Medium' ? 'warning' : 'success'}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>

        {/* AI Recommendations */}
        <Grid item xs={12}>
          <Fade in timeout={1800}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Psychology sx={{ fontSize: 24, color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    AI-Powered Recommendations
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  {analytics.recommendations.map((recommendation, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Card sx={{ p: 2, bgcolor: 'grey.50', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <CheckCircle sx={{ color: 'success.main', fontSize: 20, mt: 0.5 }} />
                          <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                            {recommendation}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PredictiveAnalytics;
