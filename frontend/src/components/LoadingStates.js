import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Skeleton,
  Fade,
  LinearProgress,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  Home,
  Work,
  People,
  TrendingUp,
} from '@mui/icons-material';

// Loading spinner with message
export const LoadingSpinner = ({ message = 'Loading...', size = 40 }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4,
    }}
  >
    <CircularProgress size={size} sx={{ mb: 2 }} />
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

// Skeleton loading for shelter cards
export const ShelterCardSkeleton = () => (
  <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Skeleton variant="circular" width={50} height={50} sx={{ mr: 2 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="40%" height={20} />
        </Box>
      </Box>
      <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: 2 }} />
      </Box>
      <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: 2 }} />
    </CardContent>
  </Card>
);

// Skeleton loading for job cards
export const JobCardSkeleton = () => (
  <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Skeleton variant="circular" width={50} height={50} sx={{ mr: 2 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Skeleton variant="text" width="70%" height={24} />
          <Skeleton variant="text" width="50%" height={20} />
        </Box>
      </Box>
      <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="90%" height={20} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rectangular" width={70} height={24} sx={{ borderRadius: 2 }} />
      </Box>
      <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: 2 }} />
    </CardContent>
  </Card>
);

// Loading grid for multiple cards
export const LoadingGrid = ({ type = 'shelter', count = 6 }) => (
  <Grid container spacing={3}>
    {Array.from({ length: count }).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        {type === 'shelter' ? <ShelterCardSkeleton /> : <JobCardSkeleton />}
      </Grid>
    ))}
  </Grid>
);

// Dashboard loading state
export const DashboardLoading = () => (
  <Box>
    {/* Header skeleton */}
    <Box sx={{ mb: 4 }}>
      <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="60%" height={24} />
    </Box>

    {/* Stats cards skeleton */}
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Skeleton variant="circular" width={60} height={60} sx={{ mx: 'auto', mb: 2 }} />
              <Skeleton variant="text" width="60%" height={32} sx={{ mx: 'auto', mb: 1 }} />
              <Skeleton variant="text" width="80%" height={24} sx={{ mx: 'auto', mb: 2 }} />
              <Skeleton variant="rectangular" width={100} height={24} sx={{ mx: 'auto', borderRadius: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>

    {/* Content sections skeleton */}
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
          <CardContent sx={{ p: 3 }}>
            <Skeleton variant="text" width="30%" height={28} sx={{ mb: 3 }} />
            {Array.from({ length: 3 }).map((_, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="rectangular" width="100%" height={8} sx={{ borderRadius: 2 }} />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
          <CardContent sx={{ p: 3 }}>
            <Skeleton variant="text" width="40%" height={28} sx={{ mb: 3 }} />
            {Array.from({ length: 4 }).map((_, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" width="70%" height={20} />
                  <Skeleton variant="text" width="50%" height={16} />
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

// Page loading with progress
export const PageLoading = ({ message = 'Loading page...', progress = 0 }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
      py: 4,
    }}
  >
    <CircularProgress size={60} sx={{ mb: 3 }} />
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
      {message}
    </Typography>
    {progress > 0 && (
      <Box sx={{ width: '300px', mb: 2 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 8, borderRadius: 4 }}
        />
        <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
          {progress}% complete
        </Typography>
      </Box>
    )}
  </Box>
);

// Animated loading with icons
export const AnimatedLoading = ({ type = 'general' }) => {
  const icons = {
    shelter: <Home />,
    job: <Work />,
    people: <People />,
    analytics: <TrendingUp />,
    general: <Home />,
  };

  return (
    <Fade in timeout={500}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
        }}
      >
        <Box
          sx={{
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.1)' },
              '100%': { transform: 'scale(1)' },
            },
            mb: 3,
          }}
        >
          {icons[type]}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          {type === 'shelter' && 'Finding the best shelters for you...'}
          {type === 'job' && 'Searching for job opportunities...'}
          {type === 'people' && 'Connecting you with support...'}
          {type === 'analytics' && 'Analyzing data...'}
          {type === 'general' && 'Loading...'}
        </Typography>
        <CircularProgress size={40} />
      </Box>
    </Fade>
  );
};

// Error loading state
export const ErrorLoading = ({ message = 'Something went wrong', onRetry }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 6,
      textAlign: 'center',
    }}
  >
    <Typography variant="h6" sx={{ mb: 2, color: 'error.main' }}>
      {message}
    </Typography>
    {onRetry && (
      <button
        onClick={onRetry}
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          border: '1px solid #1976d2',
          background: '#1976d2',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        Try Again
      </button>
    )}
  </Box>
);

export default {
  LoadingSpinner,
  ShelterCardSkeleton,
  JobCardSkeleton,
  LoadingGrid,
  DashboardLoading,
  PageLoading,
  AnimatedLoading,
  ErrorLoading,
};
