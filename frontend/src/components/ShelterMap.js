import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { LocationOn } from '@mui/icons-material';

const ShelterMap = ({ shelters, onShelterClick }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapboxLoaded, setMapboxLoaded] = useState(false);

  useEffect(() => {
    // Dynamically load Mapbox GL
    const loadMapbox = async () => {
      try {
        const mapboxgl = await import('mapbox-gl');
        await import('mapbox-gl/dist/mapbox-gl.css');
        
        // Set access token
        mapboxgl.default.accessToken = 'pk.eyJ1Ijoic3RvcHRoZWNhcDEwIiwiYSI6ImNtaDczMGdseTBsMXoya3B6YXNtdTZwdXgifQ.hwUlEo5PrXmc37UcBE0H_g';
        
        setMapboxLoaded(true);
        initializeMap(mapboxgl.default);
      } catch (err) {
        console.error('Error loading Mapbox:', err);
        // Fallback to static map
        setError('Map service unavailable. Using static map view.');
        setLoading(false);
      }
    };

    const initializeMap = (mapboxgl) => {
      if (map.current) return;

      try {
        // Initialize the map
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [-118.2437, 34.0522], // Los Angeles
          zoom: 11
        });

        // Wait for map to load
        map.current.on('load', () => {
          setLoading(false);
          addMarkers(mapboxgl);
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Handle map errors
        map.current.on('error', (e) => {
          console.error('Map error:', e);
          setError('Map failed to load. Please check your internet connection.');
          setLoading(false);
        });

      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to initialize map.');
        setLoading(false);
      }
    };

    const addMarkers = (mapboxgl) => {
      shelters.forEach((shelter, index) => {
        // Use real coordinates from shelter data
        const markerLng = shelter.coordinates?.lng || -118.2437;
        const markerLat = shelter.coordinates?.lat || 34.0522;
        
        // Create a custom marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'shelter-marker';
        markerEl.style.cssText = `
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: ${shelter.capacity?.availableBeds > 0 
            ? 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)' 
            : 'linear-gradient(45deg, #f44336 30%, #d32f2f 90%)'};
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        `;

        // Add home icon
        const homeIcon = document.createElement('div');
        homeIcon.innerHTML = '🏠';
        homeIcon.style.cssText = 'font-size: 20px; color: white;';
        markerEl.appendChild(homeIcon);

        // Add availability indicator
        const availabilityEl = document.createElement('div');
        availabilityEl.style.cssText = `
          position: absolute;
          top: -5px;
          right: -5px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${shelter.capacity?.availableBeds > 0 ? '#4CAF50' : '#f44336'};
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
          color: white;
        `;
        availabilityEl.textContent = shelter.capacity?.availableBeds || 0;
        markerEl.appendChild(availabilityEl);

        // Add hover effect
        markerEl.addEventListener('mouseenter', () => {
          markerEl.style.transform = 'scale(1.2)';
          markerEl.style.zIndex = '1000';
        });
        
        markerEl.addEventListener('mouseleave', () => {
          markerEl.style.transform = 'scale(1)';
          markerEl.style.zIndex = '1';
        });

        // Create marker
        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat([markerLng, markerLat])
          .addTo(map.current);

        // Add click event
        markerEl.addEventListener('click', () => {
          onShelterClick(shelter);
        });

        // Create popup
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false
        }).setHTML(`
          <div style="padding: 12px; min-width: 200px; font-family: 'Roboto', sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #333;">
              ${shelter.name}
            </h3>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #666; display: flex; align-items: center;">
              📍 ${shelter.address.street}, ${shelter.address.city}
            </p>
            <p style="margin: 0 0 12px 0; font-size: 14px; color: #666; display: flex; align-items: center;">
              🏠 ${shelter.capacity?.availableBeds || 0} beds available
            </p>
            <div style="margin-bottom: 12px;">
              <span style="
                background: ${shelter.capacity?.availableBeds > 0 ? '#4CAF50' : '#f44336'};
                color: white;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
              ">
                ${shelter.capacity?.availableBeds > 0 ? 'Available' : 'At Capacity'}
              </span>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button onclick="
                const address = '${shelter.address.street}, ${shelter.address.city}, ${shelter.address.state} ${shelter.address.zipCode}';
                const encodedAddress = encodeURIComponent(address);
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                if (isMobile) {
                  window.open('maps://maps.google.com/maps?daddr=' + encodedAddress, '_blank');
                } else {
                  window.open('https://www.google.com/maps/dir/?api=1&destination=' + encodedAddress, '_blank');
                }
              " style="
                background: linear-gradient(45deg, #667eea 30%, #764ba2 90%);
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
              " onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
                📍 Directions
              </button>
              <button onclick="
                const phoneNumber = '${shelter.contact.phone.replace(/\D/g, '')}';
                window.open('tel:' + phoneNumber, '_self');
              " style="
                background: linear-gradient(45deg, #4CAF50 30%, #45a049 90%);
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
              " onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
                📞 Call
              </button>
            </div>
          </div>
        `);

        // Add popup to marker
        marker.setPopup(popup);
      });
    };

    loadMapbox();

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [shelters, onShelterClick]);

  if (error) {
    return (
      <Box sx={{ height: '400px', width: '100%', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
        {/* Static Map Background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-118.2437,34.0522,11,0/800x400@2x?access_token=pk.eyJ1Ijoic3RvcHRoZWNhcDEwIiwiYSI6ImNtaDczMGdseTBsMXoya3B6YXNtdTZwdXgifQ.hwUlEo5PrXmc37UcBE0H_g')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'brightness(0.9) saturate(1.1)',
          }}
        />
        
        {/* Map Overlay for better visibility */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Interactive Shelter Markers */}
        {shelters.map((shelter, index) => {
          // Use real coordinates from shelter data
          const lat = shelter.coordinates?.lat || 34.0522;
          const lng = shelter.coordinates?.lng || -118.2437;
          
          // Convert coordinates to map position (approximate)
          // LA bounds: lat 33.7 to 34.3, lng -118.7 to -118.1
          const mapTop = ((34.3 - lat) / 0.6) * 100; // Convert to percentage
          const mapLeft = ((lng - (-118.7)) / 0.6) * 100; // Convert to percentage
          
          const top = Math.max(5, Math.min(95, mapTop));
          const left = Math.max(5, Math.min(95, mapLeft));
          
          return (
            <Box
              key={shelter._id}
              sx={{
                position: 'absolute',
                top: `${top}%`,
                left: `${left}%`,
                cursor: 'pointer',
                zIndex: 10,
                '&:hover': {
                  transform: 'scale(1.2)',
                  zIndex: 20,
                },
                transition: 'all 0.3s ease',
              }}
              onClick={() => onShelterClick(shelter)}
            >
              {/* Marker */}
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: shelter.capacity?.availableBeds > 0 
                    ? 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)'
                    : 'linear-gradient(45deg, #f44336 30%, #d32f2f 90%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  border: '3px solid white',
                  position: 'relative',
                  '&:hover': {
                    boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                  },
                }}
              >
                <Box sx={{ fontSize: 24, color: 'white' }}>🏠</Box>
                
                {/* Availability indicator */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: shelter.capacity?.availableBeds > 0 ? '#4CAF50' : '#f44336',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid white',
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'white', fontSize: '0.6rem', fontWeight: 600 }}>
                    {shelter.capacity?.availableBeds || 0}
                  </Typography>
                </Box>
              </Box>
              
              {/* Shelter Name */}
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block',
                  textAlign: 'center',
                  mt: 1,
                  fontWeight: 600,
                  color: 'text.secondary',
                  fontSize: '0.7rem',
                  maxWidth: 80,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: 2,
                  px: 1,
                  py: 0.5,
                }}
              >
                {shelter.name.split(' ')[0]}
              </Typography>
            </Box>
          );
        })}

        {/* Map Legend */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 3,
            p: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Legend
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)',
                }}
              />
              <Typography variant="caption">Available</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #f44336 30%, #d32f2f 90%)',
                }}
              />
              <Typography variant="caption">At Capacity</Typography>
            </Box>
          </Box>
        </Box>

        {/* Map Instructions */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            right: 16,
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 3,
            p: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Interactive Map (Static View)
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Click on any marker to view shelter details and get directions
          </Typography>
        </Box>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ height: '400px', width: '100%', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ color: '#667eea', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              Loading Interactive Map...
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              Please wait while we load the map tiles
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '400px', width: '100%', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
      {/* Map Container */}
      <div 
        ref={mapContainer} 
        style={{ 
          width: '100%', 
          height: '100%',
          borderRadius: '12px'
        }} 
      />
      
      {/* Map Legend */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 3,
          p: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          Legend
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)',
              }}
            />
            <Typography variant="caption">Available</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #f44336 30%, #d32f2f 90%)',
              }}
            />
            <Typography variant="caption">At Capacity</Typography>
          </Box>
        </Box>
      </Box>

      {/* Map Instructions */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 3,
          p: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          Interactive Map
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Click on any marker to view shelter details and get directions
        </Typography>
      </Box>
    </Box>
  );
};

export default ShelterMap;