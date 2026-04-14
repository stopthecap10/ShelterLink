import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
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
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShelters();
  }, []);

  const fetchShelters = async () => {
    try {
      const response = await axios.get('/api/shelters?limit=50');
      const fetched = response.data.shelters;
      if (fetched && fetched.length > 0) {
        setShelters(fetched);
      } else {
        // API returned empty — use mock data so the UI is never blank
        setShelters(mockShelters);
      }
    } catch {
      // API unreachable (local dev without backend, etc.) — fall back to mock
      setShelters(mockShelters);
    } finally {
      setLoading(false);
    }
  };

  const updateShelterCapacity = async (shelterId, availableBeds, totalBeds, token) => {
    // Optimistically update UI
    setShelters(prev =>
      prev.map(s =>
        (s._id === shelterId || s._id?.toString() === shelterId)
          ? { ...s, capacity: { ...s.capacity, availableBeds, totalBeds }, lastUpdated: new Date().toISOString() }
          : s
      )
    );

    // Persist to backend if a JWT token is available
    if (token) {
      try {
        await axios.put(
          `/api/shelters/${shelterId}/availability`,
          { availableBeds },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error('Failed to persist bed count to API:', err);
      }
    }
  };

  const getShelterById = (shelterId) => {
    return shelters.find(s => s._id === shelterId || s._id?.toString() === shelterId);
  };

  const value = {
    shelters,
    loading,
    fetchShelters,
    updateShelterCapacity,
    getShelterById,
  };

  return (
    <ShelterDataContext.Provider value={value}>
      {children}
    </ShelterDataContext.Provider>
  );
};

export default ShelterDataContext;
