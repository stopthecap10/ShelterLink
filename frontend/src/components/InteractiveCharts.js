import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Home,
  Work,
  LocalHospital,
  School,
  Security,
  AccessTime,
} from '@mui/icons-material';

const InteractiveCharts = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeChart, setActiveChart] = useState('impact');
  const [animatedData, setAnimatedData] = useState({});

  const chartData = {
    impact: {
      title: 'Community Impact',
      data: [
        { label: 'Lives Impacted', value: 47, color: '#667eea', icon: <People /> },
        { label: 'Shelter Placements', value: 12, color: '#764ba2', icon: <Home /> },
        { label: 'Job Placements', value: 8, color: '#f093fb', icon: <Work /> },
        { label: 'Success Rate', value: 75, color: '#4facfe', icon: <TrendingUp /> },
      ]
    },
    demographics: {
      title: 'Demographics Served',
      data: [
        { label: 'Families', value: 23, color: '#667eea', icon: <People /> },
        { label: 'Veterans', value: 4, color: '#764ba2', icon: <Security /> },
        { label: 'Youth', value: 7, color: '#f093fb', icon: <School /> },
        { label: 'Seniors', value: 5, color: '#4facfe', icon: <LocalHospital /> },
      ]
    },
    services: {
      title: 'Services Provided',
      data: [
        { label: 'Emergency Shelter', value: 15, color: '#667eea', icon: <Home /> },
        { label: 'Job Training', value: 8, color: '#764ba2', icon: <Work /> },
        { label: 'Mental Health', value: 12, color: '#f093fb', icon: <LocalHospital /> },
        { label: 'Legal Aid', value: 6, color: '#4facfe', icon: <Security /> },
      ]
    }
  };

  useEffect(() => {
    // Animate data on load
    const animateData = () => {
      const data = chartData[activeChart];
      data.data.forEach((item, index) => {
        setTimeout(() => {
          setAnimatedData(prev => ({
            ...prev,
            [item.label]: item.value
          }));
        }, index * 200);
      });
    };

    animateData();
  }, [activeChart]);

  const AnimatedBar = ({ label, value, color, icon, maxValue = 50 }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const percentage = (value / maxValue) * 100;

    useEffect(() => {
      const timer = setTimeout(() => {
        setDisplayValue(value);
      }, 500);
      return () => clearTimeout(timer);
    }, [value]);

    return (
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ color, mr: 1 }}>{icon}</Box>
          <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
            {label}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {displayValue}
          </Typography>
        </Box>
        <Box
          sx={{
            height: 8,
            bgcolor: 'grey.200',
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: `${percentage}%`,
              bgcolor: color,
              borderRadius: 4,
              transition: 'width 1s ease-in-out',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
                animation: 'shimmer 2s infinite',
              }
            }}
          />
        </Box>
      </Box>
    );
  };

  const PieChart = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;

    return (
      <Box sx={{ position: 'relative', width: 200, height: 200, mx: 'auto' }}>
        <svg width="200" height="200" viewBox="0 0 200 200">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const startAngle = (cumulativePercentage / 100) * 360;
            const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
            cumulativePercentage += percentage;

            const radius = 80;
            const centerX = 100;
            const centerY = 100;

            const startAngleRad = (startAngle - 90) * (Math.PI / 180);
            const endAngleRad = (endAngle - 90) * (Math.PI / 180);

            const x1 = centerX + radius * Math.cos(startAngleRad);
            const y1 = centerY + radius * Math.sin(startAngleRad);
            const x2 = centerX + radius * Math.cos(endAngleRad);
            const y2 = centerY + radius * Math.sin(endAngleRad);

            const largeArcFlag = percentage > 50 ? 1 : 0;

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');

            return (
              <path
                key={index}
                d={pathData}
                fill={item.color}
                stroke="white"
                strokeWidth="2"
                style={{
                  transition: 'all 0.5s ease',
                  transformOrigin: '100px 100px',
                }}
              />
            );
          })}
        </svg>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {total}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Interactive Impact Analytics
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            Explore our impact through interactive data visualizations
          </Typography>
        </Box>
      </Fade>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Zoom in timeout={1000}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {chartData[activeChart].title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {Object.keys(chartData).map((key) => (
                      <Button
                        key={key}
                        size="small"
                        variant={activeChart === key ? 'contained' : 'outlined'}
                        onClick={() => setActiveChart(key)}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        {chartData[key].title}
                      </Button>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 4 }}>
                  {chartData[activeChart].data.map((item, index) => (
                    <AnimatedBar
                      key={index}
                      label={item.label}
                      value={item.value}
                      color={item.color}
                      icon={item.icon}
                      maxValue={50}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>

        <Grid item xs={12} md={4}>
          <Zoom in timeout={1200}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', height: '100%' }}>
              <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Distribution Overview
                </Typography>
                
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PieChart data={chartData[activeChart].data} />
                </Box>

                <Box sx={{ mt: 3 }}>
                  {chartData[activeChart].data.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          bgcolor: item.color,
                          borderRadius: '50%',
                          mr: 1,
                        }}
                      />
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {item.label}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InteractiveCharts;
