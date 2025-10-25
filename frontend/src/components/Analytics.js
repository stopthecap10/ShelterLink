import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  People,
  Home,
  Work,
  Message,
  Star,
  LocationOn,
  AccessTime
} from '@mui/icons-material';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 1247,
    sheltersHelped: 5,
    jobsPosted: 23,
    successfulMatches: 89,
    averageRating: 4.6,
    responseTime: '2.3 hours',
    monthlyGrowth: 23,
    successStories: [
      {
        id: 1,
        name: 'Maria Rodriguez',
        story: 'Found shelter and job within 48 hours',
        rating: 5,
        date: '2024-01-15'
      },
      {
        id: 2,
        name: 'James Wilson',
        story: 'Successfully transitioned to permanent housing',
        rating: 5,
        date: '2024-01-12'
      },
      {
        id: 3,
        name: 'Sarah Johnson',
        story: 'Got job training and employment',
        rating: 4,
        date: '2024-01-10'
      }
    ],
    impactMetrics: {
      livesChanged: 156,
      familiesHelped: 42,
      jobsCreated: 23,
      sheltersSupported: 5
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate loading analytics data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getProgressColor = (value, max = 100) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        Impact Analytics
      </Typography>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {analytics.totalUsers.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={75}
                color={getProgressColor(75)}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                +{analytics.monthlyGrowth}% this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <Home />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {analytics.sheltersHelped}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Shelters
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={90}
                color={getProgressColor(90)}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                All shelters verified
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <Work />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {analytics.jobsPosted}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Job Opportunities
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={65}
                color={getProgressColor(65)}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                New jobs weekly
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <Star />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {analytics.averageRating}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Rating
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={92}
                color={getProgressColor(92)}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Based on 127 reviews
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Impact Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Impact Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" color="primary.main" sx={{ fontWeight: 600 }}>
                      {analytics.impactMetrics.livesChanged}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lives Changed
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" color="success.main" sx={{ fontWeight: 600 }}>
                      {analytics.impactMetrics.familiesHelped}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Families Helped
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" color="info.main" sx={{ fontWeight: 600 }}>
                      {analytics.impactMetrics.jobsCreated}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Jobs Created
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" color="warning.main" sx={{ fontWeight: 600 }}>
                      {analytics.impactMetrics.sheltersSupported}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Shelters Supported
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Performance
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Response Time</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {analytics.responseTime}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={85}
                  color="success"
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Success Rate</Typography>
                  <Typography variant="body2" color="text.secondary">
                    89%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={89}
                  color="success"
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">User Satisfaction</Typography>
                  <Typography variant="body2" color="text.secondary">
                    96%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={96}
                  color="success"
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Success Stories */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Success Stories
          </Typography>
          <List>
            {analytics.successStories.map((story, index) => (
              <React.Fragment key={story.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {story.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {story.name}
                        </Typography>
                        <Chip
                          label={`${story.rating}/5`}
                          size="small"
                          color="primary"
                          icon={<Star />}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {story.story}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(story.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < analytics.successStories.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Analytics;
