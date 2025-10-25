import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Grid,
  Avatar,
  Chip,
  Fade,
  Zoom,
  useTheme,
} from '@mui/material';
import {
  Speed,
  Memory,
  Storage,
  NetworkCheck,
  Security,
  Battery6Bar,
  SignalCellular4Bar,
  Wifi,
  TrendingUp,
  CheckCircle,
} from '@mui/icons-material';

const PerformanceOptimization = () => {
  const theme = useTheme();
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading performance data
    setTimeout(() => {
      setPerformance({
        loadTime: 1.2,
        bundleSize: 245,
        lighthouseScore: 98,
        accessibilityScore: 96,
        bestPracticesScore: 100,
        seoScore: 95,
        performanceScore: 98,
        metrics: {
          firstContentfulPaint: 0.8,
          largestContentfulPaint: 1.2,
          cumulativeLayoutShift: 0.05,
          firstInputDelay: 50,
          timeToInteractive: 1.5,
        },
        optimizations: [
          'Code splitting',
          'Lazy loading',
          'Image optimization',
          'Caching strategies',
          'Bundle compression',
          'CDN delivery',
        ],
        browserSupport: {
          chrome: 98,
          firefox: 95,
          safari: 96,
          edge: 97,
        },
        mobilePerformance: {
          loadTime: 1.5,
          batteryUsage: 'Low',
          dataUsage: 'Minimal',
          offlineCapability: 'Full',
        },
      });
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6">Loading performance data...</Typography>
      </Box>
    );
  }

  const performanceCards = [
    {
      title: 'Load Time',
      value: `${performance.loadTime}s`,
      icon: <Speed />,
      color: 'success',
      description: 'Average page load time',
      target: '< 2s',
      achieved: true,
    },
    {
      title: 'Bundle Size',
      value: `${performance.bundleSize}KB`,
      icon: <Storage />,
      color: 'info',
      description: 'Optimized JavaScript bundle',
      target: '< 300KB',
      achieved: true,
    },
    {
      title: 'Lighthouse Score',
      value: `${performance.lighthouseScore}/100`,
      icon: <TrendingUp />,
      color: 'primary',
      description: 'Overall performance score',
      target: '> 90',
      achieved: true,
    },
    {
      title: 'Accessibility',
      value: `${performance.accessibilityScore}/100`,
      icon: <CheckCircle />,
      color: 'warning',
      description: 'WCAG compliance score',
      target: '> 95',
      achieved: true,
    },
  ];

  const optimizationFeatures = [
    {
      title: 'Code Splitting',
      description: 'Load only the code you need, when you need it',
      icon: <Memory />,
      color: 'primary',
      impact: '40% faster initial load',
    },
    {
      title: 'Lazy Loading',
      description: 'Images and components load on demand',
      icon: <NetworkCheck />,
      color: 'success',
      impact: '60% less data usage',
    },
    {
      title: 'Caching',
      description: 'Smart caching for instant repeat visits',
      icon: <Storage />,
      color: 'info',
      impact: '90% faster repeat loads',
    },
    {
      title: 'Compression',
      description: 'Gzip and Brotli compression for smaller files',
      icon: <Speed />,
      color: 'warning',
      impact: '70% smaller file sizes',
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
            Performance Excellence
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
            Lightning-fast performance optimized for all devices. 
            Our platform loads in under 2 seconds and works seamlessly offline.
          </Typography>
        </Box>
      </Fade>

      {/* Performance Metrics */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {performanceCards.map((metric, index) => (
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
                    label={metric.achieved ? 'Target Achieved' : 'In Progress'}
                    size="small"
                    color={metric.achieved ? 'success' : 'warning'}
                    sx={{ fontWeight: 600 }}
                  />
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      {/* Lighthouse Scores */}
      <Fade in timeout={1200}>
        <Card sx={{ mb: 6, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
              Lighthouse Performance Scores
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main', mb: 1 }}>
                    {performance.performanceScore}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Performance
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={performance.performanceScore}
                    color="success"
                    sx={{ mt: 1, height: 6, borderRadius: 3 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                    {performance.accessibilityScore}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Accessibility
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={performance.accessibilityScore}
                    color="primary"
                    sx={{ mt: 1, height: 6, borderRadius: 3 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main', mb: 1 }}>
                    {performance.bestPracticesScore}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Best Practices
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={performance.bestPracticesScore}
                    color="info"
                    sx={{ mt: 1, height: 6, borderRadius: 3 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main', mb: 1 }}>
                    {performance.seoScore}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    SEO
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={performance.seoScore}
                    color="warning"
                    sx={{ mt: 1, height: 6, borderRadius: 3 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>

      {/* Core Web Vitals */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Zoom in timeout={1400}>
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Core Web Vitals
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">First Contentful Paint</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {performance.metrics.firstContentfulPaint}s
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={85}
                    color="success"
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Largest Contentful Paint</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {performance.metrics.largestContentfulPaint}s
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={90}
                    color="success"
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Cumulative Layout Shift</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {performance.metrics.cumulativeLayoutShift}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={95}
                    color="success"
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">First Input Delay</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {performance.metrics.firstInputDelay}ms
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={88}
                    color="success"
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>

        <Grid item xs={12} md={6}>
          <Zoom in timeout={1600}>
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Optimization Features
                </Typography>
                {optimizationFeatures.map((feature, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor: `${feature.color}.main`,
                          width: 40,
                          height: 40,
                          mr: 2,
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={feature.impact}
                      size="small"
                      color={feature.color}
                      sx={{ ml: 6 }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
      </Grid>

      {/* Browser Support */}
      <Fade in timeout={1800}>
        <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
              Browser Compatibility
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                    {performance.browserSupport.chrome}%
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Chrome
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main', mb: 1 }}>
                    {performance.browserSupport.firefox}%
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Firefox
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main', mb: 1 }}>
                    {performance.browserSupport.safari}%
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Safari
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main', mb: 1 }}>
                    {performance.browserSupport.edge}%
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Edge
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

export default PerformanceOptimization;
