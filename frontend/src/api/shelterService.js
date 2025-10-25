import axios from 'axios';
import { apiConfig, endpoints } from './config';

// Create axios instance with base configuration
const api = axios.create(apiConfig);

// Shelter API service
export const shelterService = {
  // Get all shelters
  getShelters: async (params = {}) => {
    try {
      const response = await api.get(endpoints.shelters, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching shelters:', error);
      throw error;
    }
  },

  // Get shelter by ID
  getShelter: async (id) => {
    try {
      const response = await api.get(`${endpoints.shelters}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching shelter:', error);
      throw error;
    }
  },

  // Search shelters
  searchShelters: async (query) => {
    try {
      const response = await api.get(endpoints.shelters, {
        params: { search: query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching shelters:', error);
      throw error;
    }
  },

  // Filter shelters by city
  getSheltersByCity: async (city) => {
    try {
      const response = await api.get(endpoints.shelters, {
        params: { city }
      });
      return response.data;
    } catch (error) {
      console.error('Error filtering shelters by city:', error);
      throw error;
    }
  },

  // Get shelters with available beds
  getSheltersWithBeds: async () => {
    try {
      const response = await api.get(endpoints.shelters, {
        params: { availableBeds: 'true' }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching shelters with beds:', error);
      throw error;
    }
  }
};

export default shelterService;
