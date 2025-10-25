import React from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Language,
  ExpandMore,
  Translate,
  Public,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle = () => {
  const { language, changeLanguage, t } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage);
    handleClose();
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <Box>
      <Tooltip title="Change Language / Cambiar Idioma / Changer de Langue">
        <Button
          onClick={handleClick}
          startIcon={<Translate />}
          endIcon={<ExpandMore />}
          variant="contained"
          size={isMobile ? 'small' : 'medium'}
          sx={{
            minWidth: isMobile ? 'auto' : 140,
            textTransform: 'none',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
            },
            transition: 'all 0.3s ease',
            borderRadius: 2,
            px: 2,
            py: 1,
          }}
        >
          {isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="body2" sx={{ fontSize: '1.1rem' }}>
                {currentLanguage?.flag}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontSize: '1.1rem' }}>
                {currentLanguage?.flag}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {currentLanguage?.name}
              </Typography>
            </Box>
          )}
        </Button>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            mt: 1,
          }
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={lang.code === language}
            sx={{
              minWidth: 160,
              py: 1.5,
              px: 2,
              '&.Mui-selected': {
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.2)',
                },
              },
              '&:hover': {
                backgroundColor: 'rgba(102, 126, 234, 0.05)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
              <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>
                {lang.flag}
              </Typography>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {lang.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {lang.code === 'en' && 'English'}
                  {lang.code === 'es' && 'Spanish'}
                  {lang.code === 'fr' && 'French'}
                </Typography>
              </Box>
              {lang.code === language && (
                <Chip
                  label="Active"
                  size="small"
                  color="primary"
                  sx={{ 
                    fontSize: '0.7rem',
                    height: 20,
                    '& .MuiChip-label': {
                      px: 1,
                    }
                  }}
                />
              )}
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageToggle;
