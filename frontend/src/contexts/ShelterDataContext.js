import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockShelters } from '../api/mockData';

const ShelterDataContext = createContext();

export const useShelterData = () => {
  const context = useContext(ShelterDataContext);
  if (!context) {
    throw new Error('useShelterData must be used within a ShelterDataProvider');
  }
  return context;
};

export const ShelterDataProvider = ({ children }) => {
  const [shelters, setShelters] = useState(mockShelters);

  // Load shelters from localStorage on mount
  useEffect(() => {
    const savedShelters = localStorage.getItem('shelter-data');
    if (savedShelters) {
      try {
        setShelters(JSON.parse(savedShelters));
      } catch (error) {
        console.error('Error loading saved shelter data:', error);
      }
    }
  }, []);

  // Save shelters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('shelter-data', JSON.stringify(shelters));
  }, [shelters]);

  const updateShelterCapacity = (shelterId, availableBeds, totalBeds) => {
    setShelters(prevShelters => 
      prevShelters.map(shelter => 
        shelter._id === shelterId 
          ? {
              ...shelter,
              capacity: {
                ...shelter.capacity,
                availableBeds,
                totalBeds,
              },
              lastUpdated: new Date().toISOString(),
            }
          : shelter
      )
    );
  };

  const getShelterById = (shelterId) => {
    return shelters.find(shelter => shelter._id === shelterId);
  };

  const value = {
    shelters,
    updateShelterCapacity,
    getShelterById,
  };

  return (
    <ShelterDataContext.Provider value={value}>
      {children}
    </ShelterDataContext.Provider>
  );
};
