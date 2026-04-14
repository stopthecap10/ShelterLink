import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  Business,
  Work,
  Message,
  LocationOn,
  People,
  TrendingUp,
  Notifications,
  Add,
  Search,
  Phone,
  Email,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import axios from 'axios';

const DashboardPage = () => {
  const { user, profile } = useAuth();
  const { unreadCount } = useSocket();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (user?.userType === 'shelter') {
        // Fetch shelter-specific data
        const [sheltersResponse, jobsResponse] = await Promise.all([
          axios.get('/api/shelters'),
          axios.get('/api/jobs'),
        ]);

        setStats({
          availableBeds: profile?.capacity?.availableBeds || 0,
          totalBeds: profile?.capacity?.totalBeds || 0,
          activeJobs: jobsResponse.data.jobs?.length || 0,
          unreadMessages: unreadCount,
        });

        setRecentActivity([
          ...(jobsResponse.data.jobs?.slice(0, 3) || []).map(job => ({
            type: 'job',
            title: job.title,
            company: job.company.name,
            status: job.status,
            date: job.createdAt,
          })),
        ]);
      } else {
        // Fetch individual-specific data
        const [sheltersResponse, jobsResponse] = await Promise.all([
          axios.get('/api/shelters'),
          axios.get('/api/jobs'),
        ]);

        setStats({
          nearbyShelters: sheltersResponse.data.shelters?.length || 0,
          jobApplications: 0, // Mock data
          unreadMessages: unreadCount,
          needsCount: profile?.needs?.filter(need => !need.isMet).length || 0,
        });

        setRecentActivity([
          ...(jobsResponse.data.jobs?.slice(0, 3) || []).map(job => ({
            type: 'job',
            title: job.title,
            company: job.company.name,
            status: 'available',
            date: new Date().toISOString(),
          })),
        ]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getAvailabilityPercentage = () => {
    if (!stats.totalBeds) return 0;
    return Math.round((stats.availableBeds / stats.totalBeds) * 100);
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4, mt: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          {getGreeting()}, {profile?.name || profile?.personalInfo?.firstName || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {user?.userType === 'shelter' 
            ? 'Manage your shelter and help those in need'
            : 'Find shelter, jobs, and support in your community'
          }
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {user?.userType === 'shelter' ? (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <Business />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="div">
                        {stats.availableBeds}/{stats.totalBeds}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Available Beds
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={getAvailabilityPercentage()}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                      <Work />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="div">
                        {stats.activeJobs}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Jobs
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<Add />}
                    onClick={() => navigate('/jobs')}
                  >
                    Post Job
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                      <Message />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="div">
                        {stats.unreadMessages}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Unread Messages
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => navigate('/messages')}
                  >
                    View Messages
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                      <TrendingUp />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="div">
                        {profile?.rating?.average?.toFixed(1) || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average Rating
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <LocationOn />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="div">
                        {stats.nearbyShelters}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Nearby Shelters
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => navigate('/shelters')}
                  >
                    Find Shelters
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                      <Work />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="div">
                        {stats.jobApplications}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Job Applications
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => navigate('/jobs')}
                  >
                    Browse Jobs
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                      <Message />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="div">
                        {stats.unreadMessages}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Unread Messages
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => navigate('/messages')}
                  >
                    View Messages
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                      <People />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="div">
                        {stats.needsCount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Unmet Needs
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => navigate('/profile')}
                  >
                    Update Profile
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </>
        )}
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {user?.userType === 'shelter' ? (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={() => navigate('/jobs')}
                      fullWidth
                    >
                      Post New Job
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Business />}
                      onClick={() => navigate('/profile')}
                      fullWidth
                    >
                      Update Shelter Info
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<TrendingUp />}
                      onClick={() => navigate('/shelters')}
                      fullWidth
                    >
                      View Analytics
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<Search />}
                      onClick={() => navigate('/shelters')}
                      fullWidth
                    >
                      Find Nearby Shelters
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Work />}
                      onClick={() => navigate('/jobs')}
                      fullWidth
                    >
                      Browse Job Opportunities
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<People />}
                      onClick={() => navigate('/profile')}
                      fullWidth
                    >
                      Update My Needs
                    </Button>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Recent Activity
              </Typography>
              {recentActivity.length > 0 ? (
                <List>
                  {recentActivity.slice(0, 5).map((activity, index) => (
                    <ListItem key={index} divider={index < recentActivity.length - 1}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {activity.type === 'job' || activity.type === 'application' ? (
                            <Work />
                          ) : activity.type === 'message' ? (
                            <Message />
                          ) : (
                            <Notifications />
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {activity.company || activity.sender}
                            </Typography>
                            <Chip
                              label={activity.status}
                              size="small"
                              color={
                                activity.status === 'active' || activity.status === 'applied'
                                  ? 'primary'
                                  : activity.status === 'accepted'
                                  ? 'success'
                                  : 'default'
                              }
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No recent activity
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Profile Summary */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Profile Summary
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main' }}
                  src={profile?.images?.[0]?.url}
                >
                  {profile?.name?.charAt(0) || profile?.personalInfo?.firstName?.charAt(0) || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {profile?.name || `${profile?.personalInfo?.firstName} ${profile?.personalInfo?.lastName}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.userType === 'shelter' ? 'Shelter Organization' : 'Individual'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip
                      label={user?.isVerified ? 'Verified' : 'Pending Verification'}
                      size="small"
                      color={user?.isVerified ? 'success' : 'warning'}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {user?.userType === 'shelter' ? (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {profile?.address?.city}, {profile?.address?.state}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {profile?.contact?.phone}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {profile?.contact?.email}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {profile?.currentLocation?.address?.city || 'Location not set'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <People sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {profile?.housingStatus?.current?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Work sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {profile?.employment?.status?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/profile')}
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/messages')}
            >
              View Messages
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardPage;
