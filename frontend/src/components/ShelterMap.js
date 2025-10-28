import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const ShelterMap = ({ shelters, onShelterClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);

  // Custom marker icons - will be created after Google Maps loads
  const availableIconRef = useRef(null);
  const fullIconRef = useRef(null);
  const selectedIconRef = useRef(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Try to load Google Maps, but don't fail if it doesn't work
        try {
          const loader = new Loader({
            apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dgsWU7Bf4J1J1c',
            version: 'weekly',
            libraries: ['places', 'geometry'],
          });

          await loader.load();
        } catch (error) {
          console.log('Google Maps failed to load, using fallback map:', error);
          throw new Error('Google Maps API not available');
        }

        // Create custom marker icons now that Google Maps is loaded
        const createCustomMarker = (color, size = 40) => {
          return {
            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
            scale: size / 20,
            anchor: new window.google.maps.Point(12, 24),
          };
        };

        availableIconRef.current = createCustomMarker('#4CAF50', 35);
        fullIconRef.current = createCustomMarker('#F44336', 35);
        selectedIconRef.current = createCustomMarker('#2196F3', 45);

        // Calculate bounds for all shelters
        const bounds = new window.google.maps.LatLngBounds();
        shelters.forEach(shelter => {
          if (shelter.coordinates?.lat && shelter.coordinates?.lng) {
            bounds.extend({
              lat: shelter.coordinates.lat,
              lng: shelter.coordinates.lng
            });
          }
        });

        // Create map with custom styling
        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 12,
          center: bounds.getCenter(),
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'transit',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#e3f2fd' }]
            },
            {
              featureType: 'landscape',
              elementType: 'geometry',
              stylers: [{ color: '#f5f5f5' }]
            }
          ],
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: 'greedy',
          restriction: {
            latLngBounds: {
              north: 34.5,
              south: 33.5,
              east: -117.5,
              west: -118.8
            },
            strictBounds: false
          }
        });

        mapInstanceRef.current = map;
        infoWindowRef.current = new window.google.maps.InfoWindow();

        // Fit map to show all shelters
        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, { padding: 50 });
        }

        // Add markers for each shelter
        markersRef.current = shelters.map((shelter, index) => {
          if (!shelter.coordinates?.lat || !shelter.coordinates?.lng) return null;

          const hasAvailableBeds = shelter.availableBeds && shelter.availableBeds > 0;
          const marker = new window.google.maps.Marker({
            position: {
              lat: shelter.coordinates.lat,
              lng: shelter.coordinates.lng
            },
            map: map,
            icon: hasAvailableBeds ? availableIconRef.current : fullIconRef.current,
            title: shelter.name,
            animation: window.google.maps.Animation.DROP,
            optimized: false
          });

          // Create info window content
          const infoContent = `
            <div style="padding: 16px; max-width: 300px; font-family: 'Roboto', sans-serif;">
              <div style="display: flex; align-items: center; margin-bottom: 12px;">
                <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${hasAvailableBeds ? '#4CAF50' : '#F44336'}; margin-right: 8px;"></div>
                <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #333;">${shelter.name}</h3>
              </div>
              
              <div style="margin-bottom: 8px;">
                <strong style="color: #666;">Available Beds:</strong> 
                <span style="color: ${hasAvailableBeds ? '#4CAF50' : '#F44336'}; font-weight: 600;">
                  ${shelter.availableBeds || 0}
                </span>
              </div>
              
              <div style="margin-bottom: 8px;">
                <strong style="color: #666;">Address:</strong><br>
                <span style="color: #333;">${shelter.address?.street || 'N/A'}<br>
                ${shelter.address?.city || 'N/A'}, ${shelter.address?.state || 'N/A'} ${shelter.address?.zipCode || ''}</span>
              </div>
              
              <div style="margin-bottom: 8px;">
                <strong style="color: #666;">Phone:</strong> 
                <span style="color: #333;">${shelter.contact?.phone || 'N/A'}</span>
              </div>
              
              <div style="margin-bottom: 12px;">
                <strong style="color: #666;">Services:</strong><br>
                <span style="color: #333;">${shelter.services?.slice(0, 3).map(s => s.name).join(', ') || 'N/A'}</span>
              </div>
              
              <div style="display: flex; gap: 8px;">
                <button onclick="window.openShelterDetails('${shelter.id || shelter._id}')" 
                        style="background: #4CAF50; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500;">
                  View Details
                </button>
                <button onclick="window.getDirections('${shelter.coordinates.lat},${shelter.coordinates.lng}')" 
                        style="background: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500;">
                  Directions
                </button>
              </div>
            </div>
          `;

          // Add click listener
          marker.addListener('click', () => {
            infoWindowRef.current.setContent(infoContent);
            infoWindowRef.current.open(map, marker);
            
            // Change marker icon to selected state
            marker.setIcon(selectedIconRef.current);
            
            // Reset other markers
            markersRef.current.forEach(otherMarker => {
              if (otherMarker && otherMarker !== marker) {
                const otherShelter = shelters[markersRef.current.indexOf(otherMarker)];
                if (otherShelter) {
                  const hasBeds = otherShelter.availableBeds && otherShelter.availableBeds > 0;
                  otherMarker.setIcon(hasBeds ? availableIconRef.current : fullIconRef.current);
                }
              }
            });

            // Call parent callback
            if (onShelterClick) {
              onShelterClick(shelter);
            }
          });

          // Add hover effects
          marker.addListener('mouseover', () => {
            marker.setAnimation(window.google.maps.Animation.BOUNCE);
            setTimeout(() => marker.setAnimation(null), 750);
          });

          return marker;
        }).filter(Boolean);

        // Add global functions for info window buttons
        window.openShelterDetails = (shelterId) => {
          const shelter = shelters.find(s => (s.id || s._id) === shelterId);
          if (shelter && onShelterClick) {
            onShelterClick(shelter);
          }
        };

        window.getDirections = (coordinates) => {
          window.open(`https://www.google.com/maps/dir/?api=1&destination=${coordinates}`, '_blank');
        };

        setMapLoaded(true);
      } catch (error) {
        console.log('Google Maps failed, creating fallback interactive map:', error);
        createFallbackMap();
        setMapLoaded(true);
      }
    };

    const createFallbackMap = () => {
      if (!mapRef.current) return;

      // Clear previous content
      mapRef.current.innerHTML = '';

      // Create interactive map container
      const mapContainer = document.createElement('div');
      mapContainer.style.width = '100%';
      mapContainer.style.height = '100%';
      mapContainer.style.position = 'relative';
      mapContainer.style.background = 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)';
      mapContainer.style.borderRadius = '12px';
      mapContainer.style.overflow = 'hidden';
      mapContainer.style.cursor = 'grab';

      // Add LA-style street grid
      const streetGrid = document.createElement('div');
      streetGrid.style.position = 'absolute';
      streetGrid.style.top = '0';
      streetGrid.style.left = '0';
      streetGrid.style.width = '100%';
      streetGrid.style.height = '100%';
      streetGrid.style.backgroundImage = `
        linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px),
        linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
      `;
      streetGrid.style.backgroundSize = '60px 60px, 60px 60px, 15px 15px, 15px 15px';
      streetGrid.style.opacity = '0.6';

      // Add neighborhood labels
      const neighborhoods = [
        { name: 'Downtown LA', x: 20, y: 30 },
        { name: 'Hollywood', x: 15, y: 20 },
        { name: 'Santa Monica', x: 5, y: 15 },
        { name: 'Venice', x: 8, y: 12 },
        { name: 'Beverly Hills', x: 12, y: 25 },
        { name: 'West Hollywood', x: 18, y: 22 },
        { name: 'Culver City', x: 10, y: 35 },
        { name: 'Inglewood', x: 8, y: 40 }
      ];

      neighborhoods.forEach(neighborhood => {
        const label = document.createElement('div');
        label.style.position = 'absolute';
        label.style.left = `${neighborhood.x}%`;
        label.style.top = `${neighborhood.y}%`;
        label.style.fontSize = '10px';
        label.style.fontWeight = 'bold';
        label.style.color = 'rgba(0,0,0,0.4)';
        label.style.pointerEvents = 'none';
        label.style.textShadow = '1px 1px 2px rgba(255,255,255,0.8)';
        label.textContent = neighborhood.name;
        mapContainer.appendChild(label);
      });

      mapContainer.appendChild(streetGrid);

      // Add interactive markers
      shelters.forEach((shelter, index) => {
        if (!shelter.coordinates?.lat || !shelter.coordinates?.lng) return;

        const hasAvailableBeds = shelter.availableBeds && shelter.availableBeds > 0;
        
        // Convert coordinates to map position (LA area roughly 33.5-34.5 lat, -118.8 to -117.5 lng)
        const lat = shelter.coordinates.lat;
        const lng = shelter.coordinates.lng;
        
        // Map LA coordinates to screen percentages
        const x = ((lng - (-118.8)) / ((-117.5) - (-118.8))) * 80 + 10; // 10% to 90%
        const y = ((lat - 33.5) / (34.5 - 33.5)) * 80 + 10; // 10% to 90%

        const marker = document.createElement('div');
        marker.style.position = 'absolute';
        marker.style.left = `${Math.max(5, Math.min(95, x))}%`;
        marker.style.top = `${Math.max(5, Math.min(95, y))}%`;
        marker.style.width = '24px';
        marker.style.height = '24px';
        marker.style.backgroundColor = hasAvailableBeds ? '#4CAF50' : '#F44336';
        marker.style.borderRadius = '50%';
        marker.style.border = '3px solid white';
        marker.style.cursor = 'pointer';
        marker.style.boxShadow = '0 3px 8px rgba(0,0,0,0.3)';
        marker.style.zIndex = '10';
        marker.style.transition = 'all 0.3s ease';
        marker.style.display = 'flex';
        marker.style.alignItems = 'center';
        marker.style.justifyContent = 'center';
        marker.style.fontSize = '12px';
        marker.style.fontWeight = 'bold';
        marker.style.color = 'white';

        // Add bed count or icon
        marker.innerHTML = hasAvailableBeds ? '✓' : '✗';

        // Add hover effects
        marker.addEventListener('mouseenter', () => {
          marker.style.transform = 'scale(1.3)';
          marker.style.boxShadow = '0 5px 15px rgba(0,0,0,0.4)';
          marker.style.zIndex = '20';
        });

        marker.addEventListener('mouseleave', () => {
          marker.style.transform = 'scale(1)';
          marker.style.boxShadow = '0 3px 8px rgba(0,0,0,0.3)';
          marker.style.zIndex = '10';
        });

        // Add click functionality
        marker.addEventListener('click', () => {
          // Create info popup
          const popup = document.createElement('div');
          popup.style.position = 'absolute';
          popup.style.left = '30px';
          popup.style.top = '-10px';
          popup.style.background = 'white';
          popup.style.padding = '12px';
          popup.style.borderRadius = '8px';
          popup.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          popup.style.zIndex = '30';
          popup.style.minWidth = '200px';
          popup.style.fontSize = '12px';
          popup.style.border = '1px solid #e0e0e0';

          popup.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 6px; color: #333;">${shelter.name}</div>
            <div style="margin-bottom: 4px;">
              <span style="color: #666;">Available Beds:</span> 
              <span style="color: ${hasAvailableBeds ? '#4CAF50' : '#F44336'}; font-weight: bold;">
                ${shelter.availableBeds || 0}
              </span>
            </div>
            <div style="margin-bottom: 4px;">
              <span style="color: #666;">Address:</span><br>
              <span style="color: #333;">${shelter.address?.street || 'N/A'}</span>
            </div>
            <div style="margin-bottom: 8px;">
              <span style="color: #666;">Phone:</span> 
              <span style="color: #333;">${shelter.contact?.phone || 'N/A'}</span>
            </div>
            <div style="display: flex; gap: 6px;">
              <button onclick="window.openShelterDetails('${shelter.id || shelter._id}')" 
                      style="background: #4CAF50; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 11px;">
                Details
              </button>
              <button onclick="window.getDirections('${shelter.coordinates.lat},${shelter.coordinates.lng}')" 
                      style="background: #2196F3; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 11px;">
                Directions
              </button>
            </div>
          `;

          // Remove existing popups
          mapContainer.querySelectorAll('.shelter-popup').forEach(p => p.remove());
          popup.className = 'shelter-popup';
          marker.appendChild(popup);

          // Close popup when clicking elsewhere
          setTimeout(() => {
            const closePopup = (e) => {
              if (!popup.contains(e.target) && e.target !== marker) {
                popup.remove();
                document.removeEventListener('click', closePopup);
              }
            };
            document.addEventListener('click', closePopup);
          }, 100);

          // Call parent callback
          if (onShelterClick) {
            onShelterClick(shelter);
          }
        });

        mapContainer.appendChild(marker);
      });

      // Add global functions for popup buttons
      window.openShelterDetails = (shelterId) => {
        const shelter = shelters.find(s => (s.id || s._id) === shelterId);
        if (shelter && onShelterClick) {
          onShelterClick(shelter);
        }
      };

      window.getDirections = (coordinates) => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${coordinates}`, '_blank');
      };

      mapRef.current.appendChild(mapContainer);
    };

    if (shelters && shelters.length > 0) {
      initializeMap();
    }

    // Cleanup
    return () => {
      markersRef.current.forEach(marker => {
        if (marker) marker.setMap(null);
      });
      markersRef.current = [];
    };
  }, [shelters, onShelterClick]);

  // No error state needed - we always show a map (either Google Maps or fallback)

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
      {/* Map Container */}
      <div 
        ref={mapRef}
        style={{ 
          height: '100%', 
          width: '100%',
          borderRadius: '12px'
        }}
      />
      
      {/* Loading State */}
      {!mapLoaded && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderRadius: '12px',
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🗺️</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
              Loading Interactive Map...
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              Connecting to Google Maps
            </div>
          </div>
        </div>
      )}
      
      {/* Map Controls Overlay */}
      {mapLoaded && (
        <>
          {/* Legend */}
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            fontSize: '12px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px', color: '#333' }}>
              Legend
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#4CAF50', marginRight: '8px' }} />
              <span style={{ color: '#666' }}>Available Beds</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F44336', marginRight: '8px' }} />
              <span style={{ color: '#666' }}>At Capacity</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#2196F3', marginRight: '8px' }} />
              <span style={{ color: '#666' }}>Selected</span>
            </div>
          </div>

          {/* Map Features */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            fontSize: '11px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            maxWidth: '250px'
          }}>
            <div style={{ fontWeight: 600, marginBottom: '6px', fontSize: '13px', color: '#333' }}>
              🗺️ Interactive Features
            </div>
            <div style={{ color: '#666', lineHeight: '1.4' }}>
              • Click markers for detailed info<br/>
              • Pan and zoom to explore LA<br/>
              • Get directions to shelters<br/>
              • Real-time availability status<br/>
              • Street view integration
            </div>
          </div>

          {/* Shelter Count */}
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '8px',
            padding: '8px 12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            fontSize: '12px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ fontWeight: 600, color: '#333' }}>
              {shelters?.length || 0} Shelters Found
            </div>
            <div style={{ color: '#666', fontSize: '10px' }}>
              Click markers for details
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShelterMap;