import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Box, Typography, Card, CardContent, Chip, Button } from '@mui/material';
import { LocationOn, Directions, Phone, Email } from '@mui/icons-material';

const ShelterMap = ({ shelters = [], selectedShelter = null, onShelterSelect = null }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        // Check if we have a valid API key
        const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
        if (!apiKey || apiKey === 'demo-key') {
          setError('Google Maps API key not configured. Please add REACT_APP_GOOGLE_MAPS_API_KEY to your environment variables.');
          return;
        }

        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        const { Map } = await loader.importLibrary('maps');
        const { Marker } = await loader.importLibrary('marker');
        const { InfoWindow } = await loader.importLibrary('maps');

        // Default to Los Angeles if no shelters
        const defaultCenter = { lat: 34.0522, lng: -118.2437 };
        
        const mapInstance = new Map(mapRef.current, {
          center: defaultCenter,
          zoom: 12,
          mapTypeId: 'roadmap',
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        setMap(mapInstance);

        // Create markers for each shelter
        const newMarkers = shelters.map((shelter, index) => {
          const position = {
            lat: shelter.coordinates?.lat || 34.0522 + (Math.random() - 0.5) * 0.1,
            lng: shelter.coordinates?.lng || -118.2437 + (Math.random() - 0.5) * 0.1
          };

          const marker = new Marker({
            position,
            map: mapInstance,
            title: shelter.name,
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="14" fill="${shelter.capacity?.availableBeds > 0 ? '#4CAF50' : '#F44336'}" stroke="#fff" stroke-width="2"/>
                  <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${shelter.capacity?.availableBeds || 0}</text>
                </svg>
              `)}`,
              scaledSize: new window.google.maps.Size(32, 32), // eslint-disable-line no-undef
              anchor: new window.google.maps.Point(16, 16) // eslint-disable-line no-undef
            }
          });

          const infoWindow = new InfoWindow({
            content: `
              <div style="padding: 8px; max-width: 250px;">
                <h3 style="margin: 0 0 8px 0; color: #1976d2; font-size: 16px;">${shelter.name}</h3>
                <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">${shelter.address?.street}, ${shelter.address?.city}</p>
                <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${shelter.contact?.phone}</p>
                <div style="display: flex; gap: 4px; margin-bottom: 8px;">
                  <span style="background: ${shelter.capacity?.availableBeds > 0 ? '#4CAF50' : '#F44336'}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px;">
                    ${shelter.capacity?.availableBeds || 0} beds available
                  </span>
                </div>
                <p style="margin: 0; color: #333; font-size: 13px;">${shelter.description?.substring(0, 100)}...</p>
              </div>
            `
          });

          marker.addListener('click', () => {
            // Close other info windows
            markers.forEach(m => m.infoWindow?.close());
            
            infoWindow.open(mapInstance, marker);
            marker.infoWindow = infoWindow;
            
            if (onShelterSelect) {
              onShelterSelect(shelter);
            }
          });

          marker.infoWindow = infoWindow;
          return marker;
        });

        setMarkers(newMarkers);
        setIsLoaded(true);

        // Fit map to show all markers
        if (shelters.length > 0) {
          const bounds = new window.google.maps.LatLngBounds(); // eslint-disable-line no-undef
          newMarkers.forEach(marker => {
            bounds.extend(marker.getPosition());
          });
          mapInstance.fitBounds(bounds);
        }

      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load map. Please check your internet connection.');
      }
    };

    if (shelters.length > 0) {
      initMap();
    }
  }, [shelters, onShelterSelect]);

  // Update markers when shelters change
  useEffect(() => {
    if (map && markers.length > 0) {
      markers.forEach(marker => marker.setMap(null));
      
      const newMarkers = shelters.map((shelter, index) => {
        const position = {
          lat: shelter.coordinates?.lat || 34.0522 + (Math.random() - 0.5) * 0.1,
          lng: shelter.coordinates?.lng || -118.2437 + (Math.random() - 0.5) * 0.1
        };

        const marker = new window.google.maps.Marker({ // eslint-disable-line no-undef
          position,
          map,
          title: shelter.name,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" fill="${shelter.capacity?.availableBeds > 0 ? '#4CAF50' : '#F44336'}" stroke="#fff" stroke-width="2"/>
                <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${shelter.capacity?.availableBeds || 0}</text>
              </svg>
            `)}`,
            scaledSize: new window.google.maps.Size(32, 32), // eslint-disable-line no-undef
            anchor: new window.google.maps.Point(16, 16) // eslint-disable-line no-undef
          }
        });

        return marker;
      });

      setMarkers(newMarkers);
    }
  }, [map, shelters]);

  if (error) {
    return (
      <Card sx={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            Map Unavailable
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        ref={mapRef}
        sx={{
          width: '100%',
          height: '400px',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid #e0e0e0'
        }}
      />
      
      {!isLoaded && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 1
          }}
        >
          <Typography>Loading map...</Typography>
        </Box>
      )}

      {selectedShelter && (
        <Card
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            maxWidth: 300,
            zIndex: 2,
            boxShadow: 3
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {selectedShelter.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {selectedShelter.address?.street}, {selectedShelter.address?.city}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip
                label={`${selectedShelter.capacity?.availableBeds || 0} beds available`}
                color={selectedShelter.capacity?.availableBeds > 0 ? 'success' : 'error'}
                size="small"
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                size="small"
                startIcon={<Directions />}
                onClick={() => {
                  const address = `${selectedShelter.address?.street}, ${selectedShelter.address?.city}, ${selectedShelter.address?.state}`;
                  window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`);
                }}
              >
                Directions
              </Button>
              <Button
                size="small"
                startIcon={<Phone />}
                onClick={() => window.open(`tel:${selectedShelter.contact?.phone}`)}
              >
                Call
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ShelterMap;
