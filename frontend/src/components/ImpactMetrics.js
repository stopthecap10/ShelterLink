import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Avatar,
  Chip,
  Fade,
  Zoom,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Home,
  Work,
  School,
  LocalHospital,
  Security,
  Speed,
  CheckCircle,
  Star,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

const ImpactMetrics = () => {
  const theme = useTheme();
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading impact metrics
    setTimeout(() => {
      setMetrics({
        totalLivesImpacted: 47,
        shelterPlacements: 12,
        jobPlacements: 8,
        longTermStability: 6,
        volunteerHours: 240,
        partnerShelters: 3,
        successRate: 75,
        averageTimeToHousing: 72,
        costSavings: 45000,
        communityImpact: {
          familiesReunited: 3,
          childrenSupported: 7,
          veteransServed: 4,
          youthMentored: 5,
        },
        monthlyGrowth: {
          users: 8,
          placements: 6,
          partnerships: 2,
        },
        regionalImpact: {
          losAngeles: 85,
          sanFrancisco: 10,
          sanDiego: 3,
          other: 2,
        },
      });
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6">{t('loadingImpactMetrics')}</Typography>
      </Box>
    );
  }

  const metricCards = [
    {
      title: t('livesImpacted'),
      value: metrics.totalLivesImpacted.toLocaleString(),
      icon: <People />,
      color: 'primary',
      description: t('totalIndividualsServed'),
      trend: t('trend1'),
    },
    {
      title: t('shelterPlacements'),
      value: metrics.shelterPlacements.toLocaleString(),
      icon: <Home />,
      color: 'success',
      description: t('successfulMatches'),
      trend: t('trend2'),
    },
    {
      title: t('jobPlacements'),
      value: metrics.jobPlacements.toLocaleString(),
      icon: <Work />,
      color: 'info',
      description: t('employmentSecured'),
      trend: t('trend3'),
    },
    {
      title: t('successRate'),
      value: `${metrics.successRate}%`,
      icon: <Star />,
      color: 'warning',
      description: t('longTermStability'),
      trend: t('trend4'),
    },
  ];

  const communityMetrics = [
    {
      title: t('familiesReunited'),
      value: metrics.communityImpact.familiesReunited,
      icon: <CheckCircle />,
      color: 'success',
    },
    {
      title: t('childrenSupported'),
      value: metrics.communityImpact.childrenSupported,
      icon: <School />,
      color: 'info',
    },
    {
      title: t('veteransServed'),
      value: metrics.communityImpact.veteransServed,
      icon: <Security />,
      color: 'primary',
    },
    {
      title: t('youthMentored'),
      value: metrics.communityImpact.youthMentored,
      icon: <People />,
      color: 'secondary',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Fade in timeout={800}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 3,
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('measurableImpact')}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            {t('pilotProgramDescription')}
          </Typography>
        </Box>
      </Fade>

      {/* Main Metrics Grid */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {metricCards.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Zoom in timeout={1000 + index * 200}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
                  },
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: `${metric.color}.main`,
                      width: 60,
                      height: 60,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {metric.icon}
                  </Avatar>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: `${metric.color}.main` }}>
                    {metric.value}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {metric.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {metric.description}
                  </Typography>
                  <Chip
                    label={metric.trend}
                    size="small"
                    color={metric.color}
                    sx={{ fontWeight: 600 }}
                  />
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      {/* Community Impact */}
      <Fade in timeout={1200}>
        <Card sx={{ mb: 6, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
              {t('communityImpact')}
            </Typography>
            <Grid container spacing={3}>
              {communityMetrics.map((metric, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        bgcolor: `${metric.color}.main`,
                        width: 50,
                        height: 50,
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      {metric.icon}
                    </Avatar>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: `${metric.color}.main` }}>
                      {metric.value}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {metric.title}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Fade>

      {/* Detailed Impact Metrics */}
      <Grid container spacing={4}>
        {/* Cost Savings */}
        <Grid item xs={12} md={6}>
          <Zoom in timeout={1400}>
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TrendingUp sx={{ fontSize: 32, color: 'success.main', mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {t('economicImpact')}
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, color: 'success.main', mb: 2 }}>
                  ${metrics.costSavings.toLocaleString()}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {t('costSavingsDescription')}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {t('averageTimeToHousing')}: {metrics.averageTimeToHousing} {t('days')}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={75}
                    color="success"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {t('fasterThanTraditional')}
                </Typography>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>

        {/* Growth Metrics */}
        <Grid item xs={12} md={6}>
          <Zoom in timeout={1600}>
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Speed sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {t('growthMetrics')}
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{t('newUsers')}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      +{metrics.monthlyGrowth.users}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={metrics.monthlyGrowth.users}
                    color="primary"
                    sx={{ height: 6, borderRadius: 3, mb: 2 }}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{t('successfulPlacements')}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      +{metrics.monthlyGrowth.placements}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={metrics.monthlyGrowth.placements}
                    color="success"
                    sx={{ height: 6, borderRadius: 3, mb: 2 }}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{t('newPartnerships')}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      +{metrics.monthlyGrowth.partnerships}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={metrics.monthlyGrowth.partnerships}
                    color="info"
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
      </Grid>

      {/* Regional Impact */}
      <Fade in timeout={1800}>
        <Card sx={{ mt: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
              {t('regionalImpact')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                    {metrics.regionalImpact.losAngeles}%
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {t('losAngeles')}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main', mb: 1 }}>
                    {metrics.regionalImpact.sanFrancisco}%
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {t('sanFrancisco')}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main', mb: 1 }}>
                    {metrics.regionalImpact.sanDiego}%
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {t('sanDiego')}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main', mb: 1 }}>
                    {metrics.regionalImpact.other}%
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {t('otherCities')}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
};

export default ImpactMetrics;
