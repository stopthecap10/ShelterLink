import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  useTheme,
} from '@mui/material';
import {
  People,
  Home,
  Work,
  Favorite,
  TrendingUp,
  AccessTime,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

const ImpactDashboard = () => {
  const { t } = useLanguage();
  const theme = useTheme();
  const [stats, setStats] = useState({
    totalUsers: 1247,
    shelterPlacements: 89,
    jobPlacements: 52,
    volunteerHours: 1240,
    successRate: 87,
    avgResponseTime: 2.3,
  });

  const impactMetrics = [
    {
      title: 'Lives Impacted',
      value: stats.totalUsers.toLocaleString(),
      icon: <People sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      color: 'primary',
      trend: '+23% this month',
    },
    {
      title: 'Shelter Placements',
      value: stats.shelterPlacements,
      icon: <Home sx={{ fontSize: 40, color: theme.palette.success.main }} />,
      color: 'success',
      trend: '+15% this month',
    },
    {
      title: 'Job Placements',
      value: stats.jobPlacements,
      icon: <Work sx={{ fontSize: 40, color: theme.palette.warning.main }} />,
      color: 'warning',
      trend: '+31% this month',
    },
    {
      title: 'Volunteer Hours',
      value: stats.volunteerHours.toLocaleString(),
      icon: <Favorite sx={{ fontSize: 40, color: theme.palette.error.main }} />,
      color: 'error',
      trend: '+18% this month',
    },
  ];

  const successStories = [
    {
      name: 'Maria G.',
      story: 'Found shelter at Union Rescue Mission and secured a job as a kitchen assistant. Now saving for her own apartment.',
      outcome: 'Housed & Employed',
      timeAgo: '2 months ago',
    },
    {
      name: 'John D.',
      story: 'Used Shelter Match to find LA Mission. Their recovery programs helped him address challenges and find stability.',
      outcome: 'In Recovery',
      timeAgo: '3 months ago',
    },
    {
      name: 'Sarah M.',
      story: 'Connected with Downtown Women\'s Center through the app. Now working as a receptionist and living independently.',
      outcome: 'Independent Living',
      timeAgo: '1 month ago',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        Our Impact - Real Results
      </Typography>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {impactMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {metric.icon}
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: `${metric.color}.main` }}>
                      {metric.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metric.title}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={metric.trend}
                  color={metric.color}
                  size="small"
                  icon={<TrendingUp />}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Success Rate & Response Time */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Success Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main', mr: 2 }}>
                  {stats.successRate}%
                </Typography>
                <Chip label="Above Average" color="success" size="small" />
              </Box>
              <LinearProgress
                variant="determinate"
                value={stats.successRate}
                sx={{ height: 8, borderRadius: 4 }}
                color="success"
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Of users who find shelter or employment through our platform
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Average Response Time
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'info.main', mr: 2 }}>
                  {stats.avgResponseTime}h
                </Typography>
                <Chip label="Fast Response" color="info" size="small" />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2">
                  From application to shelter placement
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Success Stories */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Success Stories
          </Typography>
          <Grid container spacing={3}>
            {successStories.map((story, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {story.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      "{story.story}"
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip
                        label={story.outcome}
                        color="success"
                        size="small"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {story.timeAgo}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ImpactDashboard;
