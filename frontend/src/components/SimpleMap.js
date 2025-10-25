import React from 'react';
import { Box, Typography, Card, CardContent, Button, Chip } from '@mui/material';
import { LocationOn, Directions, Phone, Email } from '@mui/icons-material';

const SimpleMap = ({ shelters = [], selectedShelter = null, onShelterSelect = null }) => {
  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            📍 Shelter Locations
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Interactive map view with Google Maps integration. Click on any shelter below to view details.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip 
              label="🟢 Available Beds" 
              size="small" 
              color="success" 
              variant="outlined" 
            />
            <Chip 
              label="🔴 At Capacity" 
              size="small" 
              color="error" 
              variant="outlined" 
            />
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'grid', gap: 2 }}>
        {shelters.map((shelter) => (
          <Card 
            key={shelter._id}
            sx={{ 
              cursor: 'pointer',
              border: selectedShelter?._id === shelter._id ? 2 : 1,
              borderColor: selectedShelter?._id === shelter._id ? 'primary.main' : 'divider',
              '&:hover': {
                boxShadow: 3,
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
            onClick={() => onShelterSelect && onShelterSelect(shelter)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {shelter.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {shelter.address?.street}, {shelter.address?.city}
                    </Typography>
                  </Box>
                </Box>
                
                <Chip
                  label={`${shelter.capacity?.availableBeds || 0} beds`}
                  color={shelter.capacity?.availableBeds > 0 ? 'success' : 'error'}
                  size="small"
                />
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {shelter.description?.substring(0, 120)}...
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  size="small"
                  startIcon={<Directions />}
                  onClick={(e) => {
                    e.stopPropagation();
                    const address = `${shelter.address?.street}, ${shelter.address?.city}, ${shelter.address?.state}`;
                    window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`);
                  }}
                >
                  Directions
                </Button>
                <Button
                  size="small"
                  startIcon={<Phone />}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`tel:${shelter.contact?.phone}`);
                  }}
                >
                  Call
                </Button>
                <Button
                  size="small"
                  startIcon={<Email />}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`mailto:${shelter.contact?.email}`);
                  }}
                >
                  Email
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {selectedShelter && (
        <Card sx={{ mt: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🎯 Selected: {selectedShelter.name}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {selectedShelter.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={`${selectedShelter.capacity?.availableBeds || 0} beds available`}
                color="primary"
                variant="outlined"
                sx={{ color: 'primary.contrastText', borderColor: 'primary.contrastText' }}
              />
              <Chip
                label={`Rating: ${selectedShelter.rating?.average || 0}/5`}
                color="primary"
                variant="outlined"
                sx={{ color: 'primary.contrastText', borderColor: 'primary.contrastText' }}
              />
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default SimpleMap;
