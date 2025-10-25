import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Chip,
  Button,
  Fade,
  Zoom,
  useTheme,
} from '@mui/material';
import {
  Star,
  TrendingUp,
  Home,
  Work,
  People,
  CheckCircle,
  ArrowForward,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

const SuccessStories = () => {
  const theme = useTheme();
  const { t } = useLanguage();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading success stories
    setTimeout(() => {
      setStories([
        {
          id: 1,
          name: 'Maria Rodriguez',
          age: 34,
          location: 'Los Angeles, CA',
          photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          story: t('story1'),
          timeline: t('timeline1'),
          achievements: [t('shelterPlacement'), t('jobTraining'), t('housingStability')],
          currentStatus: t('stableHousing'),
          impact: t('impact1'),
        },
        {
          id: 2,
          name: 'James Thompson',
          age: 28,
          location: 'Los Angeles, CA',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          story: t('story2'),
          timeline: t('timeline2'),
          achievements: [t('veteranSupport'), t('jobTraining'), t('businessOwner')],
          currentStatus: t('businessOwner'),
          impact: t('impact2'),
        },
        {
          id: 3,
          name: 'Sarah Chen',
          age: 22,
          location: 'Los Angeles, CA',
          photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          story: t('story3'),
          timeline: t('timeline3'),
          achievements: [t('youthSupport'), t('education'), t('mentorship')],
          currentStatus: t('collegeStudent'),
          impact: t('impact3'),
        },
        {
          id: 4,
          name: 'Michael Davis',
          age: 45,
          location: 'Los Angeles, CA',
          photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          story: t('story4'),
          timeline: t('timeline4'),
          achievements: [t('mentalHealthSupport'), t('peerCounseling'), t('communityLeadership')],
          currentStatus: t('peerCounselor'),
          impact: t('impact4'),
        },
      ]);
      setLoading(false);
    }, 1000);
  }, [t]);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6">{t('loadingSuccessStories')}</Typography>
      </Box>
    );
  }

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
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('realStoriesRealImpact')}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            {t('successStoriesDescription')}
          </Typography>
        </Box>
      </Fade>

      {/* Success Stories Grid */}
      <Grid container spacing={4}>
        {stories.map((story, index) => (
          <Grid item xs={12} md={6} key={story.id}>
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
                <CardContent sx={{ p: 4 }}>
                  {/* Story Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      src={story.photo}
                      sx={{
                        width: 60,
                        height: 60,
                        mr: 2,
                        border: '3px solid',
                        borderColor: 'primary.main',
                      }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {story.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {story.age} years old • {story.location}
                      </Typography>
                      <Chip
                        label={story.currentStatus}
                        color="success"
                        size="small"
                        sx={{ mt: 1, fontWeight: 600 }}
                      />
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="text.secondary">
                        {story.timeline}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Story Content */}
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      fontStyle: 'italic',
                      lineHeight: 1.6,
                      color: 'text.primary',
                    }}
                  >
                    "{story.story}"
                  </Typography>

                  {/* Achievements */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      {t('keyAchievements')}:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {story.achievements.map((achievement, achievementIndex) => (
                        <Chip
                          key={achievementIndex}
                          label={achievement}
                          size="small"
                          color="primary"
                          variant="outlined"
                          icon={<CheckCircle />}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Impact Statement */}
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'success.50',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'success.200',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'success.main' }}>
                        {t('impactCreated')}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'success.700' }}>
                      {story.impact}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      {/* Call to Action */}
      <Fade in timeout={1400}>
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            {t('readyToStartJourney')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            {t('joinThousandsDescription')}
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
            endIcon={<ArrowForward />}
          >
            {t('getStartedToday')}
          </Button>
        </Box>
      </Fade>
    </Box>
  );
};

export default SuccessStories;
