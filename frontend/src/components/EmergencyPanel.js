import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Alert,
  Collapse,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Phone,
  LocalHospital,
  Security,
  ExpandMore,
  ExpandLess,
  CrisisAlert,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

const EmergencyPanel = () => {
  const { t } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expanded, setExpanded] = useState(false);

  const emergencyContacts = [
    {
      name: 'Emergency Services',
      number: '911',
      description: 'Police, Fire, Medical Emergency',
      color: 'error',
      icon: <CrisisAlert />,
    },
    {
      name: 'Crisis Hotline',
      number: '988',
      description: 'Suicide & Crisis Lifeline',
      color: 'warning',
      icon: <CrisisAlert />,
    },
    {
      name: 'Homeless Services',
      number: '211',
      description: 'LA County Homeless Services',
      color: 'info',
      icon: <LocalHospital />,
    },
    {
      name: 'Domestic Violence',
      number: '1-800-799-7233',
      description: 'National Domestic Violence Hotline',
      color: 'secondary',
      icon: <Security />,
    },
  ];

  const handleCall = (number) => {
    window.open(`tel:${number}`, '_self');
  };

  return (
    <Card sx={{ mb: 3, border: '2px solid', borderColor: 'error.main' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CrisisAlert sx={{ color: 'error.main', mr: 1, fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
            {t('emergency')} - {t('crisisHotline')}
          </Typography>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{ ml: 'auto' }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            If you are in immediate danger or having a mental health crisis, please call 911 or 988 immediately.
          </Typography>
        </Alert>

        <Collapse in={expanded}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            {emergencyContacts.map((contact, index) => (
              <Card key={index} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ color: `${contact.color}.main`, mr: 1 }}>
                      {contact.icon}
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {contact.name}
                    </Typography>
                  </Box>
                  
                  <Typography variant="h6" sx={{ fontWeight: 700, color: `${contact.color}.main`, mb: 1 }}>
                    {contact.number}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {contact.description}
                  </Typography>
                  
                  <Button
                    variant="contained"
                    color={contact.color}
                    size="small"
                    fullWidth
                    startIcon={<Phone />}
                    onClick={() => handleCall(contact.number)}
                    sx={{ fontWeight: 600 }}
                  >
                    {t('call')} {contact.number}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Collapse>

        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label="24/7 Available"
            color="error"
            size="small"
            icon={<CrisisAlert />}
          />
          <Chip
            label="Free & Confidential"
            color="success"
            size="small"
          />
          <Chip
            label="Multilingual Support"
            color="info"
            size="small"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmergencyPanel;
