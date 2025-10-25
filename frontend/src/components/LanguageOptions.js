import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Translate,
  Language,
  Public,
  CheckCircle,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageOptions = () => {
  const { language, changeLanguage, t } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [hoveredLang, setHoveredLang] = useState(null);

  const languages = [
    { 
      code: 'en', 
      name: 'English', 
      flag: '🇺🇸',
      description: 'Default language',
      color: '#667eea'
    },
    { 
      code: 'es', 
      name: 'Español', 
      flag: '🇪🇸',
      description: 'Idioma español',
      color: '#764ba2'
    },
    { 
      code: 'fr', 
      name: 'Français', 
      flag: '🇫🇷',
      description: 'Langue française',
      color: '#f093fb'
    },
  ];

  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage);
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
            Choose Your Language
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            Select your preferred language for the best experience
          </Typography>
        </Box>
      </Fade>

      <Grid container spacing={3} justifyContent="center">
        {languages.map((lang, index) => (
          <Grid item xs={12} sm={6} md={4} key={lang.code}>
            <Zoom in timeout={1000 + index * 200}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: language === lang.code ? `2px solid ${lang.color}` : '2px solid transparent',
                  borderRadius: 3,
                  boxShadow: language === lang.code 
                    ? `0 8px 32px ${lang.color}40` 
                    : '0 4px 16px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 40px ${lang.color}30`,
                    border: `2px solid ${lang.color}`,
                  },
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onClick={() => handleLanguageChange(lang.code)}
                onMouseEnter={() => setHoveredLang(lang.code)}
                onMouseLeave={() => setHoveredLang(null)}
              >
                {language === lang.code && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 1,
                    }}
                  >
                    <Chip
                      icon={<CheckCircle />}
                      label="Active"
                      color="primary"
                      size="small"
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                )}

                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${lang.color}20, ${lang.color}40)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      transition: 'all 0.3s ease',
                      transform: hoveredLang === lang.code ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    <Typography variant="h3" sx={{ fontSize: '2.5rem' }}>
                      {lang.flag}
                    </Typography>
                  </Box>

                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: lang.color }}>
                    {lang.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {lang.description}
                  </Typography>

                  <Button
                    variant={language === lang.code ? 'contained' : 'outlined'}
                    size="large"
                    startIcon={<Translate />}
                    sx={{
                      background: language === lang.code 
                        ? `linear-gradient(135deg, ${lang.color} 0%, ${lang.color}CC 100%)`
                        : 'transparent',
                      borderColor: lang.color,
                      color: language === lang.code ? 'white' : lang.color,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${lang.color} 0%, ${lang.color}CC 100%)`,
                        color: 'white',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                    }}
                  >
                    {language === lang.code ? 'Current Language' : 'Select Language'}
                  </Button>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      <Fade in timeout={1400}>
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Your language preference will be saved and applied across the entire application
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<Language />}
              label="Multilingual Support"
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<Public />}
              label="Accessibility"
              color="secondary"
              variant="outlined"
            />
            <Chip
              icon={<Translate />}
              label="Real-time Translation"
              color="success"
              variant="outlined"
            />
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default LanguageOptions;
